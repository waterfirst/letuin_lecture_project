"""
프로젝트 2 [중] 난이도 — 멀티센서 SPC + AI 인사이트 대시보드
렛유인 AI + 바이브코딩 강의 모범 답안

실행 방법:
    pip install -r requirements.txt
    cp .env.example .env   # Gemini API 키 입력
    streamlit run app.py

주의: GEMINI_API_KEY가 없으면 Mock AI 응답으로 동작합니다.
"""

import os
import time
import random
import textwrap
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import streamlit as st

# dotenv는 선택적으로 로드 (없어도 동작)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# ─────────────────────────────────────────────
# 페이지 설정
# ─────────────────────────────────────────────
st.set_page_config(
    page_title="멀티센서 공정 분석기",
    page_icon="📡",
    layout="wide",
)

st.title("📡 멀티센서 공정 분석기")
st.caption("SPC 관리도 + AI 인사이트 | 렛유인 AI 강의 프로젝트 2 [중]")

# ─────────────────────────────────────────────
# 상수
# ─────────────────────────────────────────────
N_SENSORS = 50
N_SAMPLES = 1000
SENSOR_GROUPS = {
    "온도 센서": [f"T{i:02d}" for i in range(1, 11)],
    "압력 센서": [f"P{i:02d}" for i in range(1, 11)],
    "유량 센서": [f"F{i:02d}" for i in range(1, 11)],
    "전력 센서": [f"E{i:02d}" for i in range(1, 11)],
    "진동 센서": [f"V{i:02d}" for i in range(1, 11)],
}
ALL_SENSORS = [s for group in SENSOR_GROUPS.values() for s in group]

# ─────────────────────────────────────────────
# 합성 데이터 생성
# ─────────────────────────────────────────────
@st.cache_data
def generate_sensor_data(n_samples: int = N_SAMPLES, seed: int = 0) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    # 기본 공분산 구조 (그룹 내 상관관계 있음)
    data = {}
    timestamps = [datetime(2024, 3, 1) + timedelta(minutes=i * 5) for i in range(n_samples)]

    for group_name, sensors in SENSOR_GROUPS.items():
        # 그룹 공통 신호 + 개별 노이즈
        common = rng.standard_normal(n_samples)
        for sensor in sensors:
            drift = np.linspace(0, rng.uniform(-0.5, 0.5), n_samples)
            data[sensor] = (common * 0.6 + rng.standard_normal(n_samples) * 0.8 + drift).round(4)

    # 수율 (일부 센서에 의존)
    key_sensors = ["T01", "P01", "F01", "E01", "V01"]
    yield_signal = sum(data[s] for s in key_sensors) / len(key_sensors)
    yield_pct = (95 - 2 * np.abs(yield_signal) + rng.standard_normal(n_samples) * 0.5).clip(80, 100).round(2)

    df = pd.DataFrame(data, index=timestamps)
    df.index.name = "timestamp"
    df["yield"] = yield_pct

    # 의도적 이상 구간 (약 5%)
    anomaly_idx = rng.choice(n_samples, size=int(n_samples * 0.05), replace=False)
    for idx in anomaly_idx:
        sensor = rng.choice(ALL_SENSORS)
        df.iloc[idx][sensor] += rng.choice([-3, 3]) * rng.uniform(1.5, 3.0)

    return df.reset_index()


df_full = generate_sensor_data()
df_sensors = df_full[ALL_SENSORS]

# ─────────────────────────────────────────────
# Mock AI 분석기 (Gemini API 없을 때 사용)
# ─────────────────────────────────────────────
MOCK_INSIGHTS = [
    """**공정 분석 인사이트** (AI 생성)

**주요 발견사항:**
- T01, P01 센서 간 강한 양의 상관관계(r=0.78) 감지 — 온도 상승 시 압력도 동반 상승하는 패턴
- F03 센서에서 {anomaly_pct:.1f}%의 이상값 탐지 — 유량 불안정 가능성
- 수율 저하 구간과 V01~V03 진동 센서 이상 패턴이 {corr_yield:.0f}% 일치

**권장 조치:**
1. T01 온도 관리 범위를 ±3°C 이내로 유지
2. F03 센서 캘리브레이션 점검 권고
3. 진동 이상 감지 시 즉시 설비 점검 절차 실행

**수율 영향 요인 (중요도 순):**
T01 > P01 > F03 > V02 > E01""",

    """**공정 이상 패턴 분석** (AI 생성)

**통계적 이상 감지 결과:**
- 현재 선택 구간에서 UCL 초과: {ucl_exceed}건 / LCL 미달: {lcl_below}건
- 3-시그마 이상 이탈 비율: {sigma3_pct:.1f}% (허용 기준: 0.27%)

**공정 안정성 평가:**
선택한 센서 ({sensor})의 공정능력지수 Cpk ≈ {cpk:.2f}
- Cpk ≥ 1.33: 우수 / 1.0~1.33: 보통 / < 1.0: 개선 필요

**개선 제안:**
최근 50개 샘플 기준으로 드리프트 경향이 감지됩니다.
공정 파라미터를 초기 기준값으로 재조정하고,
예방 보전 주기를 단축하는 것을 권장합니다.""",
]


def get_ai_insight(sensor: str, stats: dict) -> str:
    """
    실제 환경: Gemini API 호출
    데모 환경: Mock 응답 반환
    """
    api_key = os.getenv("GEMINI_API_KEY", "")

    if api_key and api_key != "your_gemini_api_key_here":
        # 실제 Gemini API 호출 (학생이 직접 구현)
        # import google.generativeai as genai
        # genai.configure(api_key=api_key)
        # model = genai.GenerativeModel("gemini-1.5-flash")
        # prompt = f"공정 센서 {sensor} 데이터 통계: {stats}. 한국어로 분석해줘."
        # response = model.generate_content(prompt)
        # return response.text
        pass

    # Mock 응답 (API 키 없을 때)
    template = random.choice(MOCK_INSIGHTS)
    ucl_exceed = stats.get("ucl_exceed", random.randint(2, 8))
    lcl_below  = stats.get("lcl_below",  random.randint(1, 5))
    return template.format(
        sensor=sensor,
        anomaly_pct=random.uniform(3, 8),
        corr_yield=random.uniform(60, 85),
        ucl_exceed=ucl_exceed,
        lcl_below=lcl_below,
        sigma3_pct=random.uniform(0.5, 2.5),
        cpk=random.uniform(0.8, 1.5),
    )


# ─────────────────────────────────────────────
# 사이드바
# ─────────────────────────────────────────────
st.sidebar.header("분석 설정")

# 센서 그룹 선택
selected_group = st.sidebar.selectbox("센서 그룹", list(SENSOR_GROUPS.keys()))
group_sensors = SENSOR_GROUPS[selected_group]

# 개별 센서 선택
primary_sensor = st.sidebar.selectbox("주요 분석 센서", group_sensors)
compare_sensor = st.sidebar.selectbox(
    "비교 센서",
    [s for s in group_sensors if s != primary_sensor],
    index=0,
)

# 샘플 범위
sample_range = st.sidebar.slider(
    "분석 구간 (샘플 인덱스)",
    min_value=0,
    max_value=N_SAMPLES - 1,
    value=(0, min(200, N_SAMPLES - 1)),
    step=10,
)

# SPC 임계값
sigma_multiplier = st.sidebar.slider(
    "관리 한계 (시그마 배수)",
    min_value=1.0,
    max_value=4.0,
    value=3.0,
    step=0.5,
)

# 히트맵 센서 수
heatmap_n = st.sidebar.slider("히트맵 센서 수", 5, 30, 15, step=5)

st.sidebar.markdown("---")
api_status = "연결됨" if os.getenv("GEMINI_API_KEY", "your_gemini_api_key_here") != "your_gemini_api_key_here" else "Mock 모드"
st.sidebar.info(f"AI 상태: {api_status}\n\n.env 파일에 GEMINI_API_KEY를 설정하면 실제 AI 분석을 사용합니다.")

# ─────────────────────────────────────────────
# 데이터 슬라이싱
# ─────────────────────────────────────────────
start_idx, end_idx = sample_range
df_slice = df_full.iloc[start_idx:end_idx + 1].copy()

# ─────────────────────────────────────────────
# 탭 구성
# ─────────────────────────────────────────────
tab1, tab2, tab3 = st.tabs(["📊 SPC 관리도", "🔥 상관관계 분석", "🤖 AI 인사이트"])

# ════════════════════════════════════════════
# 탭 1: SPC 관리도
# ════════════════════════════════════════════
with tab1:
    st.subheader(f"SPC 관리도 — {primary_sensor}")

    series = df_slice[primary_sensor]
    mean_val = series.mean()
    std_val  = series.std()
    ucl = mean_val + sigma_multiplier * std_val
    lcl = mean_val - sigma_multiplier * std_val

    ucl_exceed = (series > ucl).sum()
    lcl_below  = (series < lcl).sum()
    total_violations = ucl_exceed + lcl_below

    # 메트릭
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("평균", f"{mean_val:.4f}")
    c2.metric("표준편차", f"{std_val:.4f}")
    c3.metric("UCL 초과", f"{ucl_exceed}건", delta_color="inverse" if ucl_exceed > 0 else "normal")
    c4.metric("LCL 미달", f"{lcl_below}건", delta_color="inverse" if lcl_below > 0 else "normal")

    # SPC 차트
    colors = ["red" if (v > ucl or v < lcl) else "#1f77b4" for v in series]

    fig_spc = go.Figure()
    fig_spc.add_trace(go.Scatter(
        x=df_slice["timestamp"],
        y=series,
        mode="lines+markers",
        name=primary_sensor,
        line=dict(color="#1f77b4", width=1),
        marker=dict(color=colors, size=4),
    ))
    fig_spc.add_hline(y=mean_val, line_color="green",  line_dash="solid",  annotation_text=f"CL={mean_val:.3f}")
    fig_spc.add_hline(y=ucl,      line_color="red",    line_dash="dash",   annotation_text=f"UCL={ucl:.3f}")
    fig_spc.add_hline(y=lcl,      line_color="red",    line_dash="dash",   annotation_text=f"LCL={lcl:.3f}")

    fig_spc.update_layout(
        title=f"{primary_sensor} X-bar 관리도 ({sigma_multiplier}σ 한계)",
        xaxis_title="시간",
        yaxis_title="측정값",
        height=380,
        showlegend=False,
    )
    st.plotly_chart(fig_spc, use_container_width=True)

    # 두 센서 비교 (이동 평균)
    st.subheader(f"이동 평균 비교: {primary_sensor} vs {compare_sensor}")
    window = max(5, len(df_slice) // 20)

    fig_ma = go.Figure()
    for sensor, color in [(primary_sensor, "#1f77b4"), (compare_sensor, "#ff7f0e")]:
        s = df_slice[sensor]
        fig_ma.add_trace(go.Scatter(x=df_slice["timestamp"], y=s,
                                    mode="lines", name=sensor,
                                    line=dict(color=color, width=1, dash="dot"), opacity=0.4))
        fig_ma.add_trace(go.Scatter(x=df_slice["timestamp"], y=s.rolling(window).mean(),
                                    mode="lines", name=f"{sensor} MA({window})",
                                    line=dict(color=color, width=2)))
    fig_ma.update_layout(height=320, xaxis_title="시간", yaxis_title="값")
    st.plotly_chart(fig_ma, use_container_width=True)


# ════════════════════════════════════════════
# 탭 2: 상관관계 분석
# ════════════════════════════════════════════
with tab2:
    st.subheader("센서 상관관계 히트맵")

    # 상관관계 계산
    top_sensors = ALL_SENSORS[:heatmap_n]
    corr_matrix = df_full[top_sensors].corr().round(3)

    fig_heatmap = px.imshow(
        corr_matrix,
        text_auto=".2f",
        aspect="auto",
        color_continuous_scale="RdBu_r",
        zmin=-1, zmax=1,
        title=f"상위 {heatmap_n}개 센서 상관관계 행렬",
    )
    fig_heatmap.update_layout(height=500)
    st.plotly_chart(fig_heatmap, use_container_width=True)

    # 수율 상관관계 바 차트
    st.subheader("각 센서와 수율의 상관관계")
    yield_corr = df_full[ALL_SENSORS + ["yield"]].corr()["yield"].drop("yield").sort_values()

    fig_bar = px.bar(
        x=yield_corr.values,
        y=yield_corr.index,
        orientation="h",
        color=yield_corr.values,
        color_continuous_scale="RdBu_r",
        range_color=[-1, 1],
        title="센서 vs 수율 상관계수",
        labels={"x": "상관계수", "y": "센서"},
    )
    fig_bar.add_vline(x=0.3,  line_dash="dash", line_color="green",  annotation_text="양의 임계값(0.3)")
    fig_bar.add_vline(x=-0.3, line_dash="dash", line_color="orange", annotation_text="음의 임계값(-0.3)")
    fig_bar.update_layout(height=600, coloraxis_showscale=False)
    st.plotly_chart(fig_bar, use_container_width=True)

    # 산점도: 선택 센서 vs 수율
    st.subheader(f"산점도: {primary_sensor} vs 수율")
    fig_sc = px.scatter(
        df_full.sample(300, random_state=1),
        x=primary_sensor,
        y="yield",
        trendline="ols",
        color="yield",
        color_continuous_scale="RdYlGn",
        title=f"{primary_sensor} vs 수율 (%)",
        labels={"yield": "수율 (%)"},
    )
    fig_sc.update_layout(height=350)
    st.plotly_chart(fig_sc, use_container_width=True)


# ════════════════════════════════════════════
# 탭 3: AI 인사이트
# ════════════════════════════════════════════
with tab3:
    st.subheader("AI 공정 분석")
    st.markdown(
        f"현재 선택: **{primary_sensor}** | 구간: {start_idx} ~ {end_idx} 샘플"
    )

    series_ai = df_slice[primary_sensor]
    mean_ai = series_ai.mean()
    std_ai  = series_ai.std()
    ucl_ai  = mean_ai + 3 * std_ai
    lcl_ai  = mean_ai - 3 * std_ai
    ucl_cnt = (series_ai > ucl_ai).sum()
    lcl_cnt = (series_ai < lcl_ai).sum()

    stats_dict = {
        "sensor": primary_sensor,
        "mean": round(float(mean_ai), 4),
        "std": round(float(std_ai), 4),
        "ucl_exceed": int(ucl_cnt),
        "lcl_below": int(lcl_cnt),
        "sample_count": len(series_ai),
    }

    col_btn, col_info = st.columns([1, 3])
    with col_btn:
        analyze_btn = st.button("🤖 AI 분석 실행", type="primary", use_container_width=True)
    with col_info:
        st.info("버튼을 클릭하면 Gemini AI가 현재 공정 상태를 분석합니다.\n\nAPI 키가 없으면 Mock 응답으로 동작합니다.")

    if analyze_btn:
        with st.spinner("AI 분석 중..."):
            time.sleep(1.2)  # 실제 API 호출 딜레이 모사
            insight = get_ai_insight(primary_sensor, stats_dict)

        st.success("분석 완료!")
        st.markdown("### 분석 결과")
        st.markdown(insight)

        st.markdown("---")
        st.markdown("**분석에 사용된 통계 요약**")
        stats_df = pd.DataFrame([stats_dict]).T
        stats_df.columns = ["값"]
        st.dataframe(stats_df, use_container_width=True)

    else:
        st.markdown("**직접 Gemini 프롬프트를 작성해 보세요!**")
        st.code(textwrap.dedent(f"""
            # Gemini 프롬프트 예시
            센서 {primary_sensor}의 최근 {len(series_ai)} 샘플 데이터를 분석해줘.
            평균: {mean_ai:.4f}, 표준편차: {std_ai:.4f}
            UCL 초과 {ucl_cnt}건, LCL 미달 {lcl_cnt}건 발생.
            공정 이상 원인을 추정하고 권장 조치를 한국어로 알려줘.
        """).strip(), language="text")

st.markdown("---")
st.caption("렛유인 AI + 바이브코딩 강의 | 프로젝트 2 [중] 모범 답안")
