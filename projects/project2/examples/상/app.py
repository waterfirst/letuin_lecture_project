"""
프로젝트 2 [상] 난이도 — 공정 이상 감지 + 최적화 시스템
렛유인 AI + 바이브코딩 강의 모범 답안

실행 방법:
    pip install -r requirements.txt
    cp .env.example .env   # Gemini API 키 입력 (선택)
    streamlit run app.py
"""

from __future__ import annotations

import io
import time
from datetime import datetime

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import streamlit as st

from utils import (
    PROCESS_PARAMS,
    generate_process_data,
    detect_anomalies_iqr,
    detect_anomalies_zscore,
    combined_anomaly_score,
    compute_spc_limits,
    compute_pareto,
    suggest_optimal_params,
)
from ai_analyzer import ProcessAnalyzer

# ─────────────────────────────────────────────
# 커스텀 CSS
# ─────────────────────────────────────────────
CUSTOM_CSS = """
<style>
    /* 메인 헤더 */
    .main-header {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 10px;
        margin-bottom: 1.5rem;
        border-left: 5px solid #e94560;
    }
    .main-header h1 { margin: 0; font-size: 1.8rem; }
    .main-header p  { margin: 0.3rem 0 0; opacity: 0.8; font-size: 0.9rem; }

    /* 메트릭 카드 */
    .metric-card {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
    }
    .metric-card.danger  { border-left: 4px solid #dc3545; }
    .metric-card.warning { border-left: 4px solid #ffc107; }
    .metric-card.good    { border-left: 4px solid #28a745; }

    /* 섹션 헤더 */
    .section-header {
        color: #0f3460;
        border-bottom: 2px solid #e94560;
        padding-bottom: 0.3rem;
        margin-bottom: 1rem;
    }

    /* 경고 배너 */
    .alert-critical {
        background: #ffe0e0;
        border: 1px solid #ff4444;
        border-radius: 6px;
        padding: 0.75rem 1rem;
        color: #cc0000;
        font-weight: bold;
    }

    /* 다운로드 버튼 영역 */
    .download-section {
        background: #e8f4fd;
        border: 1px solid #90c4e4;
        border-radius: 8px;
        padding: 1rem;
    }

    /* AI 응답 카드 */
    .ai-response {
        background: linear-gradient(135deg, #f0f7ff, #e8f0fe);
        border: 1px solid #4a90d9;
        border-radius: 8px;
        padding: 1.2rem;
    }
</style>
"""

# ─────────────────────────────────────────────
# 페이지 설정
# ─────────────────────────────────────────────
st.set_page_config(
    page_title="공정 이상 감지 시스템",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="expanded",
)
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)

st.markdown("""
<div class="main-header">
    <h1>🔬 공정 이상 감지 & 최적화 시스템</h1>
    <p>IQR · Z-score 이상 감지 | Pareto 불량 분석 | AI 최적 조건 추천 | 렛유인 AI 강의 프로젝트 2 [상]</p>
</div>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────
# AI 분석기 초기화
# ─────────────────────────────────────────────
analyzer = ProcessAnalyzer()

# ─────────────────────────────────────────────
# 사이드바 — 분석 설정
# ─────────────────────────────────────────────
with st.sidebar:
    st.header("분석 설정")

    n_samples = st.slider("샘플 수", 100, 1000, 500, step=50)
    anomaly_rate = st.slider("이상 발생률 설정 (%)", 2, 20, 7, step=1) / 100

    st.markdown("---")
    st.subheader("이상 감지 파라미터")
    iqr_factor  = st.slider("IQR 배수",         1.0, 3.0, 1.5, step=0.25)
    z_threshold = st.slider("Z-score 임계값 (σ)", 2.0, 4.0, 3.0, step=0.5)
    spc_sigma   = st.slider("SPC 관리 한계 (σ)", 2.0, 4.0, 3.0, step=0.5)

    st.markdown("---")
    st.subheader("표시 설정")
    selected_params = st.multiselect(
        "분석 파라미터",
        list(PROCESS_PARAMS.keys()),
        default=["temperature", "pressure", "thickness"],
    )
    primary_param = st.selectbox(
        "SPC 주요 파라미터",
        selected_params if selected_params else list(PROCESS_PARAMS.keys()),
    )

    st.markdown("---")
    st.info(f"AI 모드: **{analyzer.mode}**\n\n.env 파일에 GEMINI_API_KEY 설정 시 실제 AI 사용")

    # 데이터 재생성 버튼
    if st.button("데이터 재생성", type="secondary", use_container_width=True):
        st.cache_data.clear()
        st.rerun()

# ─────────────────────────────────────────────
# 데이터 로드
# ─────────────────────────────────────────────
@st.cache_data(ttl=300)
def load_data(n: int, rate: float) -> tuple[pd.DataFrame, pd.DataFrame]:
    return generate_process_data(n_samples=n, anomaly_rate=rate)

df, df_wafer = load_data(n_samples, anomaly_rate)

# 이상 감지 계산
if selected_params:
    iqr_mask   = pd.DataFrame({p: detect_anomalies_iqr(df[p], iqr_factor)   for p in selected_params}).any(axis=1)
    z_mask     = pd.DataFrame({p: detect_anomalies_zscore(df[p], z_threshold) for p in selected_params}).any(axis=1)
    combo_mask = iqr_mask | z_mask
    anomaly_score = combined_anomaly_score(df, selected_params)
else:
    iqr_mask = z_mask = combo_mask = pd.Series(False, index=df.index)
    anomaly_score = pd.Series(0.0, index=df.index)

df["anomaly_iqr"]   = iqr_mask
df["anomaly_zscore"] = z_mask
df["anomaly_combo"]  = combo_mask
df["anomaly_score"]  = anomaly_score.round(3)

n_anomalies = int(combo_mask.sum())

# ─────────────────────────────────────────────
# 상단 KPI 카드
# ─────────────────────────────────────────────
st.markdown('<h3 class="section-header">핵심 지표</h3>', unsafe_allow_html=True)

kpi1, kpi2, kpi3, kpi4, kpi5 = st.columns(5)

with kpi1:
    avg_yield = df["yield_pct"].mean()
    delta_yield = avg_yield - 95
    st.metric("평균 수율", f"{avg_yield:.1f}%",
              delta=f"{delta_yield:+.1f}%p vs 목표",
              delta_color="normal" if delta_yield >= 0 else "inverse")

with kpi2:
    anomaly_pct = n_anomalies / len(df) * 100
    st.metric("이상 발생률", f"{anomaly_pct:.1f}%",
              delta=f"{n_anomalies}건 탐지",
              delta_color="inverse" if anomaly_pct > 5 else "off")

with kpi3:
    if primary_param and primary_param in df.columns:
        spc_lim = compute_spc_limits(df[primary_param], spc_sigma)
        cpk_val = spc_lim["cpk"]
        cpk_status = "우수" if cpk_val >= 1.33 else "보통" if cpk_val >= 1.0 else "개선필요"
        st.metric(f"Cpk ({primary_param[:4]})", f"{cpk_val:.3f}",
                  delta=cpk_status,
                  delta_color="normal" if cpk_val >= 1.33 else "inverse")

with kpi4:
    pareto_df = compute_pareto(df)
    top_cause = pareto_df.iloc[0]["원인"] if len(pareto_df) > 0 else "없음"
    top_pct   = pareto_df.iloc[0]["비율"] if len(pareto_df) > 0 else 0
    st.metric("주요 불량 원인", top_cause, delta=f"{top_pct:.1f}% 비중")

with kpi5:
    iqr_only  = int((iqr_mask & ~z_mask).sum())
    both_flag = int((iqr_mask & z_mask).sum())
    st.metric("IQR+Z 동시 이상", f"{both_flag}건",
              delta=f"IQR 단독 {iqr_only}건 추가",
              delta_color="inverse" if both_flag > 0 else "off")

# 위험 배너
if anomaly_pct > 10:
    st.markdown(
        f'<div class="alert-critical">경고: 이상 발생률 {anomaly_pct:.1f}% — 즉각 공정 점검이 필요합니다!</div>',
        unsafe_allow_html=True,
    )

st.markdown("---")

# ─────────────────────────────────────────────
# 멀티 탭
# ─────────────────────────────────────────────
tab_overview, tab_anomaly, tab_optimize, tab_report = st.tabs([
    "📊 Overview",
    "⚠️ 이상 감지",
    "🎯 최적화",
    "📄 리포트",
])


# ════════════════════════════════════════════════
# TAB 1: Overview
# ════════════════════════════════════════════════
with tab_overview:
    st.subheader("공정 파라미터 시계열")

    if not selected_params:
        st.warning("사이드바에서 분석 파라미터를 선택해 주세요.")
    else:
        # 서브플롯
        rows = (len(selected_params) + 1) // 2
        fig_ts = make_subplots(
            rows=rows, cols=2,
            subplot_titles=[PROCESS_PARAMS[p]["unit"] and f"{p} ({PROCESS_PARAMS[p]['unit']})"
                            for p in selected_params],
            shared_xaxes=False,
            vertical_spacing=0.08,
        )
        colors = px.colors.qualitative.Set2

        for idx, param in enumerate(selected_params):
            r = idx // 2 + 1
            c = idx % 2 + 1
            series = df[param]
            spc = compute_spc_limits(series, spc_sigma)

            # 정상 / 이상 분리
            normal_mask = ~df["anomaly_combo"]
            fig_ts.add_trace(go.Scatter(
                x=df.loc[normal_mask, "timestamp"], y=series[normal_mask],
                mode="lines", name=f"{param} (정상)",
                line=dict(color=colors[idx % len(colors)], width=1),
                showlegend=(idx == 0),
            ), row=r, col=c)
            fig_ts.add_trace(go.Scatter(
                x=df.loc[~normal_mask, "timestamp"], y=series[~normal_mask],
                mode="markers", name="이상",
                marker=dict(color="red", size=5, symbol="x"),
                showlegend=(idx == 0),
            ), row=r, col=c)
            # UCL/LCL
            for y_val, dash, color, label in [
                (spc["ucl"], "dash", "red",   f"UCL"),
                (spc["lcl"], "dash", "red",   f"LCL"),
                (spc["mean"],"solid","green", f"CL"),
            ]:
                fig_ts.add_hline(y=y_val, line_dash=dash, line_color=color,
                                 row=r, col=c, line_width=1)

        fig_ts.update_layout(height=max(300, 220 * rows), showlegend=True)
        st.plotly_chart(fig_ts, use_container_width=True)

    # 웨이퍼 히트맵
    st.subheader("웨이퍼 두께 균일성 맵")
    col_wl, col_wr = st.columns(2)
    with col_wl:
        fig_wt = px.density_heatmap(
            df_wafer, x="x", y="y", z="thickness",
            nbinsx=10, nbinsy=10,
            color_continuous_scale="RdYlGn",
            title="두께 분포 맵 (nm)",
        )
        fig_wt.update_layout(height=340)
        st.plotly_chart(fig_wt, use_container_width=True)
    with col_wr:
        fig_wu = px.density_heatmap(
            df_wafer, x="x", y="y", z="uniformity",
            nbinsx=10, nbinsy=10,
            color_continuous_scale="Blues",
            title="균일도 맵 (%)",
        )
        fig_wu.update_layout(height=340)
        st.plotly_chart(fig_wu, use_container_width=True)

    # 이상 점수 타임라인
    st.subheader("종합 이상 점수 타임라인")
    fig_score = go.Figure()
    fig_score.add_trace(go.Scatter(
        x=df["timestamp"], y=df["anomaly_score"],
        fill="tozeroy", mode="lines",
        line=dict(color="#e94560", width=1),
        fillcolor="rgba(233, 69, 96, 0.15)",
        name="이상 점수",
    ))
    fig_score.add_hline(y=z_threshold, line_dash="dash", line_color="orange",
                        annotation_text=f"임계값 ({z_threshold}σ)")
    fig_score.update_layout(height=220, showlegend=False,
                             xaxis_title="시간", yaxis_title="이상 점수")
    st.plotly_chart(fig_score, use_container_width=True)


# ════════════════════════════════════════════════
# TAB 2: 이상 감지
# ════════════════════════════════════════════════
with tab_anomaly:
    col_al, col_ar = st.columns([2, 1])

    with col_al:
        st.subheader("Pareto 차트 — 불량 원인 분석")
        pareto_df = compute_pareto(df)
        if pareto_df.empty:
            st.info("이상 데이터가 없습니다.")
        else:
            fig_pareto = make_subplots(specs=[[{"secondary_y": True}]])
            fig_pareto.add_trace(go.Bar(
                x=pareto_df["원인"], y=pareto_df["건수"],
                name="건수",
                marker_color=px.colors.qualitative.Set1[:len(pareto_df)],
            ), secondary_y=False)
            fig_pareto.add_trace(go.Scatter(
                x=pareto_df["원인"], y=pareto_df["누적비율"],
                name="누적 비율",
                mode="lines+markers",
                line=dict(color="black", width=2),
                marker=dict(size=7),
            ), secondary_y=True)
            fig_pareto.add_hline(y=80, line_dash="dot", line_color="red",
                                 secondary_y=True, annotation_text="80% 기준선")
            fig_pareto.update_yaxes(title_text="건수", secondary_y=False)
            fig_pareto.update_yaxes(title_text="누적 비율 (%)", secondary_y=True, range=[0, 105])
            fig_pareto.update_layout(height=400, title="불량 원인 Pareto 분석")
            st.plotly_chart(fig_pareto, use_container_width=True)

    with col_ar:
        st.subheader("이상 탐지 비교")
        detect_summary = pd.DataFrame({
            "방법": ["IQR", "Z-score", "통합(OR)"],
            "탐지 건수": [
                int(iqr_mask.sum()),
                int(z_mask.sum()),
                int(combo_mask.sum()),
            ],
        })
        fig_bar = px.bar(
            detect_summary, x="방법", y="탐지 건수",
            color="방법",
            text="탐지 건수",
            color_discrete_sequence=["#1f77b4", "#ff7f0e", "#d62728"],
        )
        fig_bar.update_traces(textposition="outside")
        fig_bar.update_layout(height=250, showlegend=False)
        st.plotly_chart(fig_bar, use_container_width=True)

        # 이상 데이터 테이블
        st.markdown("**이상 발생 샘플 (최근 20건)**")
        df_anomaly_list = df[df["anomaly_combo"]].tail(20)[
            ["timestamp", "yield_pct", "defect_cause", "anomaly_score"]
        ].rename(columns={
            "timestamp": "시간", "yield_pct": "수율(%)",
            "defect_cause": "원인", "anomaly_score": "점수",
        })
        st.dataframe(df_anomaly_list, use_container_width=True, height=220)

    # SPC 관리도 (상세)
    st.subheader(f"SPC 관리도 — {primary_param}")
    spc_lim = compute_spc_limits(df[primary_param], spc_sigma)

    fig_spc = go.Figure()
    # 배경 존 (1σ / 2σ / 3σ)
    for zone, alpha, label in [
        (spc_lim["ucl_2s"], 0.05, "2σ 경계"),
        (spc_lim["ucl"],    0.08, f"{spc_sigma}σ 경계"),
    ]:
        fig_spc.add_hrect(y0=spc_lim["lcl_2s"], y1=zone, fillcolor="yellow", opacity=alpha,
                          line_width=0)
        fig_spc.add_hrect(y0=zone, y1=spc_lim["ucl"] + spc_lim["std"],
                          fillcolor="red", opacity=alpha, line_width=0)

    point_colors = ["red" if a else "#1f77b4" for a in df["anomaly_combo"]]
    fig_spc.add_trace(go.Scatter(
        x=df["timestamp"], y=df[primary_param],
        mode="lines+markers",
        line=dict(color="#1f77b4", width=1),
        marker=dict(color=point_colors, size=3),
        name=primary_param,
    ))
    for y_val, dash, color, note in [
        (spc_lim["ucl"],  "dash",  "red",   f"UCL={spc_lim['ucl']:.3f}"),
        (spc_lim["lcl"],  "dash",  "red",   f"LCL={spc_lim['lcl']:.3f}"),
        (spc_lim["mean"], "solid", "green", f"CL={spc_lim['mean']:.3f}"),
    ]:
        fig_spc.add_hline(y=y_val, line_dash=dash, line_color=color,
                          annotation_text=note, annotation_position="right")

    fig_spc.update_layout(
        height=380,
        title=f"{primary_param} X-bar 관리도 (Cpk={spc_lim['cpk']:.3f})",
        xaxis_title="시간", yaxis_title=PROCESS_PARAMS.get(primary_param, {}).get("unit", ""),
        showlegend=False,
    )
    st.plotly_chart(fig_spc, use_container_width=True)

    # AI 이상 분석
    st.subheader("AI 이상 원인 분석")
    if st.button("AI 이상 분석 실행", type="primary"):
        with st.spinner("AI 분석 중..."):
            time.sleep(1.5)
            result = analyzer.analyze_anomalies({
                "n_samples": len(df),
                "n_anomalies": n_anomalies,
                "n_iqr": int(iqr_mask.sum()),
                "n_zscore": int(z_mask.sum()),
                "iqr_factor": iqr_factor,
                "z_threshold": z_threshold,
            })
        st.markdown('<div class="ai-response">', unsafe_allow_html=True)
        st.markdown(result)
        st.markdown('</div>', unsafe_allow_html=True)


# ════════════════════════════════════════════════
# TAB 3: 최적화
# ════════════════════════════════════════════════
with tab_optimize:
    st.subheader("최적 공정 조건 분석")

    opt_params = suggest_optimal_params(df)

    # 현재 vs 최적 비교 테이블
    rows_opt = []
    for param, info in opt_params.items():
        rows_opt.append({
            "파라미터": param,
            "현재 목표": info["target"],
            "AI 추천값": info["optimal_mean"],
            "편차": info["deviation"],
            "단위": info["unit"],
            "허용 범위 내": "O" if info["within_tol"] else "X",
        })
    df_opt = pd.DataFrame(rows_opt)

    st.dataframe(
        df_opt.style.applymap(
            lambda v: "background-color: #d4edda" if v == "O"
                      else "background-color: #f8d7da" if v == "X" else "",
            subset=["허용 범위 내"],
        ),
        use_container_width=True,
        height=260,
    )

    # 레이더 차트 (정규화)
    st.subheader("파라미터 편차 레이더 차트")
    params_list = [r["파라미터"] for r in rows_opt]
    deviations  = [abs(r["편차"]) / PROCESS_PARAMS[r["파라미터"]]["tol"] * 100 for r in rows_opt]

    fig_radar = go.Figure(go.Scatterpolar(
        r=deviations + [deviations[0]],
        theta=params_list + [params_list[0]],
        fill="toself",
        fillcolor="rgba(233, 69, 96, 0.2)",
        line=dict(color="#e94560"),
        name="편차 (%)",
    ))
    fig_radar.add_trace(go.Scatterpolar(
        r=[100] * (len(params_list) + 1),
        theta=params_list + [params_list[0]],
        fill=None,
        line=dict(color="red", dash="dash"),
        name="허용 한계",
    ))
    fig_radar.update_layout(
        polar=dict(radialaxis=dict(visible=True, range=[0, 120])),
        height=400,
        title="허용 범위 대비 편차 (%)",
    )
    st.plotly_chart(fig_radar, use_container_width=True)

    # 수율 분포 (현재 vs 최적 조건)
    col_ol, col_or = st.columns(2)
    with col_ol:
        fig_yield_hist = px.histogram(
            df, x="yield_pct",
            nbins=30, color_discrete_sequence=["#1f77b4"],
            title="현재 수율 분포",
            labels={"yield_pct": "수율 (%)"},
        )
        fig_yield_hist.add_vline(x=df["yield_pct"].mean(), line_dash="dash",
                                  line_color="red", annotation_text=f"평균: {df['yield_pct'].mean():.1f}%")
        fig_yield_hist.update_layout(height=300)
        st.plotly_chart(fig_yield_hist, use_container_width=True)

    with col_or:
        # 최적 조건 예상 수율 (상위 10% 수율 분포)
        top_yield = df[df["yield_pct"] >= df["yield_pct"].quantile(0.90)]["yield_pct"]
        fig_top_hist = px.histogram(
            top_yield, nbins=20,
            color_discrete_sequence=["#28a745"],
            title="최적 조건 구간 수율 분포 (상위 10%)",
        )
        fig_top_hist.add_vline(x=top_yield.mean(), line_dash="dash",
                                line_color="darkgreen", annotation_text=f"평균: {top_yield.mean():.1f}%")
        fig_top_hist.update_layout(height=300)
        st.plotly_chart(fig_top_hist, use_container_width=True)

    # AI 최적화 추천
    st.subheader("AI 최적 조건 추천")
    if st.button("AI 최적화 분석 실행", type="primary"):
        with st.spinner("AI가 최적 조건을 계산 중..."):
            time.sleep(1.5)
            opt_text = analyzer.suggest_optimization({
                "n_samples": len(df),
                "n_anomalies": n_anomalies,
                "avg_yield": float(df["yield_pct"].mean()),
                "optimal_params": df_opt.to_string(),
            })
        st.markdown('<div class="ai-response">', unsafe_allow_html=True)
        st.markdown(opt_text)
        st.markdown('</div>', unsafe_allow_html=True)


# ════════════════════════════════════════════════
# TAB 4: 리포트
# ════════════════════════════════════════════════
with tab_report:
    st.subheader("자동 리포트 생성")

    col_r1, col_r2 = st.columns([3, 1])
    with col_r1:
        report_title = st.text_input("리포트 제목", value="공정 이상 감지 분석 리포트")
        report_author = st.text_input("작성자", value="공정 엔지니어")
    with col_r2:
        include_ai   = st.checkbox("AI 분석 포함", value=True)
        include_data = st.checkbox("원시 데이터 포함", value=False)

    if st.button("리포트 생성", type="primary", use_container_width=False):
        with st.spinner("리포트 생성 중..."):
            time.sleep(1.0)

            # AI 인사이트 생성
            if include_ai:
                ai_overview = analyzer.analyze_overview({
                    "n_samples": len(df),
                    "n_anomalies": n_anomalies,
                    "avg_yield": float(df["yield_pct"].mean()),
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
                })
            else:
                ai_overview = "*AI 분석 미포함*"

            # 파레토 요약
            pareto_str = ""
            pareto_df2 = compute_pareto(df)
            if not pareto_df2.empty:
                for _, row in pareto_df2.iterrows():
                    pareto_str += f"| {row['원인']} | {row['건수']}건 | {row['비율']:.1f}% | {row['누적비율']:.1f}% |\n"

            # Markdown 리포트 조립
            report_md = f"""# {report_title}

**작성일:** {datetime.now().strftime("%Y년 %m월 %d일 %H:%M")}
**작성자:** {report_author}
**분석 도구:** 렛유인 AI 바이브코딩 강의 — 공정 데이터 분석기

---

## 1. 분석 개요

| 항목 | 값 |
|------|-----|
| 총 샘플 수 | {len(df):,}건 |
| 이상 탐지 건수 | {n_anomalies}건 ({n_anomalies/len(df)*100:.1f}%) |
| 평균 수율 | {df["yield_pct"].mean():.2f}% |
| 분석 기간 | {df["timestamp"].min().strftime("%Y-%m-%d")} ~ {df["timestamp"].max().strftime("%Y-%m-%d")} |
| IQR 배수 | {iqr_factor} |
| Z-score 임계값 | {z_threshold}σ |

---

## 2. 이상 감지 결과

| 방법 | 탐지 건수 |
|------|---------|
| IQR ({iqr_factor}x) | {int(iqr_mask.sum())}건 |
| Z-score ({z_threshold}σ) | {int(z_mask.sum())}건 |
| 통합 (OR) | {n_anomalies}건 |

---

## 3. Pareto 불량 원인 분석

| 원인 | 건수 | 비율 | 누적 비율 |
|------|------|------|---------|
{pareto_str}
---

## 4. SPC 관리도 요약 ({primary_param})

| 항목 | 값 |
|------|-----|
| 평균 (CL) | {spc_lim["mean"]:.4f} |
| UCL | {spc_lim["ucl"]:.4f} |
| LCL | {spc_lim["lcl"]:.4f} |
| Cpk | {spc_lim["cpk"]:.3f} |

---

## 5. AI 분석 인사이트

{ai_overview}

---

## 6. 권장 조치 사항

1. 이상 발생률 {n_anomalies/len(df)*100:.1f}% — {"즉각 조치 필요" if n_anomalies/len(df) > 0.10 else "지속 모니터링 권장"}
2. 주요 불량 원인 **{pareto_df2.iloc[0]["원인"] if len(pareto_df2) > 0 else "없음"}** 집중 관리
3. Cpk {spc_lim["cpk"]:.3f} — {"공정 능력 양호" if spc_lim["cpk"] >= 1.33 else "공정 능력 개선 필요"}

---

*본 리포트는 렛유인 AI + 바이브코딩 강의 자동 생성 리포트입니다.*
"""
            # 화면 미리보기
            st.markdown("### 리포트 미리보기")
            st.markdown(report_md)

            # 다운로드
            st.markdown("---")
            st.markdown('<div class="download-section">', unsafe_allow_html=True)
            col_dl1, col_dl2 = st.columns(2)
            with col_dl1:
                st.download_button(
                    label="Markdown 리포트 다운로드",
                    data=report_md.encode("utf-8"),
                    file_name=f"process_report_{datetime.now().strftime('%Y%m%d_%H%M')}.md",
                    mime="text/markdown",
                    use_container_width=True,
                )
            with col_dl2:
                if include_data:
                    csv_data = df.to_csv(index=False, encoding="utf-8-sig")
                    st.download_button(
                        label="원시 데이터 CSV 다운로드",
                        data=csv_data.encode("utf-8-sig"),
                        file_name=f"process_data_{datetime.now().strftime('%Y%m%d_%H%M')}.csv",
                        mime="text/csv",
                        use_container_width=True,
                    )
            st.markdown('</div>', unsafe_allow_html=True)

    else:
        st.info("리포트 생성 버튼을 클릭하면 자동으로 분석 리포트가 만들어집니다.")

        # AI 전체 분석 (독립 실행)
        st.subheader("AI 종합 분석")
        if st.button("AI 종합 분석 실행"):
            with st.spinner("AI 분석 중..."):
                time.sleep(1.5)
                overview_result = analyzer.analyze_overview({
                    "n_samples": len(df),
                    "n_anomalies": n_anomalies,
                    "avg_yield": float(df["yield_pct"].mean()),
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
                })
            st.markdown('<div class="ai-response">', unsafe_allow_html=True)
            st.markdown(overview_result)
            st.markdown('</div>', unsafe_allow_html=True)

st.markdown("---")
st.caption("렛유인 AI + 바이브코딩 강의 | 프로젝트 2 [상] 모범 답안")
