"""
Page 3 — AI 분석
=================
Gemini API 연동 구조로 공정 데이터를 AI가 분석합니다.
API 키가 없을 때는 현실적인 모킹 응답을 생성합니다.
"""

import os
import time
import random
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from dotenv import load_dotenv

from utils.data_generator import generate_factory_data, SENSOR_CONFIG
from utils.analyzer import find_strong_correlations, linear_trend, rolling_stats

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

st.set_page_config(page_title="AI 분석", page_icon="🤖", layout="wide")
st.title("🤖 AI 공정 분석")
st.caption("Gemini AI 기반 공정 패턴 분석 및 개선 제안")


# ── 데이터 로드 ───────────────────────────────────────────────────
if "factory_df" not in st.session_state:
    st.session_state["factory_df"] = generate_factory_data(hours=24, freq_sec=60)

df = st.session_state["factory_df"]
selected_eq = st.session_state.get("selected_eq", df["설비"].unique().tolist())
df_f = df[df["설비"].isin(selected_eq)] if selected_eq else df
sensors = list(SENSOR_CONFIG.keys())


# ── AI 응답 함수 ──────────────────────────────────────────────────
def call_gemini(prompt: str) -> str:
    """Gemini API 호출 (키 없으면 모킹)."""
    if GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")
            return model.generate_content(prompt).text
        except Exception as e:
            return f"[API 오류] {e}\n\n아래는 모킹 응답입니다:\n\n{_mock_response(prompt)}"
    return _mock_response(prompt)


def _mock_response(prompt: str) -> str:
    """현실적인 모킹 AI 응답."""
    responses = [
        (
            "공정 데이터 분석 결과를 말씀드리겠습니다.\n\n"
            "**온도 패턴**: 설비 EQ-01의 온도가 오전 10~12시 구간에서 "
            "정상 범위 상한(75°C)을 일시적으로 초과하는 경향이 관찰됩니다. "
            "이는 주간 생산 피크 타임의 열 누적 현상으로 추정됩니다.\n\n"
            "**압력-수율 상관관계**: 압력이 목표치(1.05 bar) 대비 ±0.1 bar를 초과할 경우 "
            "수율이 평균 1.8% 하락하는 패턴이 통계적으로 유의미하게 확인됩니다 (r = -0.73).\n\n"
            "**권고 사항**:\n"
            "1. EQ-01 냉각 시스템 점검 및 쿨링 팬 RPM 상향 조정\n"
            "2. 압력 제어 PID 게인(Kp) 10% 상향 조정\n"
            "3. 오전 10~12시 생산 속도를 5% 감속하여 열 부하 분산"
        ),
        (
            "**이상 패턴 요약**\n\n"
            "분석된 24시간 데이터에서 총 58건의 이상치가 감지되었으며, "
            "이는 전체 데이터의 4.0%에 해당합니다.\n\n"
            "설비별 분석 결과:\n"
            "- **EQ-01**: 온도 이상 23건, 주로 오전 피크 타임 집중\n"
            "- **EQ-02**: 진동 이상 19건, 베어링 교체 검토 권고\n"
            "- **EQ-03**: 전류 이상 16건, 전원 공급 안정성 확인 필요\n\n"
            "**즉각적인 조치**가 필요한 항목은 EQ-02의 진동 이상으로, "
            "방치 시 기계 고장으로 이어질 수 있습니다."
        ),
        (
            "**공정 최적화 분석**\n\n"
            "현재 공정 데이터를 머신러닝 관점에서 분석한 결과:\n\n"
            "**수율에 가장 큰 영향을 미치는 변수** (중요도 순):\n"
            "1. 온도 (중요도 38%)\n"
            "2. 압력 (중요도 27%)\n"
            "3. 습도 (중요도 19%)\n"
            "4. 진동 (중요도 10%)\n"
            "5. 전류 (중요도 6%)\n\n"
            "**최적 공정 조건** (수율 97% 이상 달성 시):\n"
            "- 온도: 62~68°C\n"
            "- 압력: 1.02~1.08 bar\n"
            "- 습도: 40~50%\n\n"
            "현재 공정 파라미터를 위 범위로 유지할 경우 "
            "수율을 기존 대비 **2.3%p 개선**할 수 있을 것으로 예상됩니다."
        ),
    ]
    return random.choice(responses)


# ── 분석 탭 구성 ──────────────────────────────────────────────────
tab1, tab2, tab3 = st.tabs(["🔬 데이터 인사이트", "🤖 AI 진단", "📈 트렌드 분석"])


# ═══════════════════════ TAB 1: 데이터 인사이트 ═══════════════════
with tab1:
    st.subheader("센서 간 상관관계 분석")
    strong = find_strong_correlations(df_f, threshold=0.5)
    if not strong.empty:
        st.dataframe(strong, use_container_width=True, hide_index=True)
        # 산포도
        if len(strong) > 0:
            v1 = strong.iloc[0]["변수1"]
            v2 = strong.iloc[0]["변수2"]
            fig_scatter = px.scatter(
                df_f, x=v1, y=v2, color="설비",
                trendline="ols",
                title=f"최강 상관관계: {v1} vs {v2}",
            )
            st.plotly_chart(fig_scatter, use_container_width=True)
    else:
        st.info("강한 상관관계(|r| ≥ 0.5)가 없습니다.")

    st.divider()
    st.subheader("수율 영향 인자 분석")
    yield_corr = df_f[sensors + ["수율"]].corr()["수율"].drop("수율").sort_values(key=abs, ascending=False)
    fig_bar = px.bar(
        x=yield_corr.index, y=yield_corr.values,
        color=yield_corr.values,
        color_continuous_scale="RdBu",
        title="각 센서와 수율의 상관계수",
        labels={"x": "센서", "y": "상관계수"},
    )
    fig_bar.add_hline(y=0, line_color="black", line_width=1)
    st.plotly_chart(fig_bar, use_container_width=True)


# ═══════════════════════ TAB 2: AI 진단 ══════════════════════════
with tab2:
    st.subheader("AI 공정 진단")

    if not GEMINI_API_KEY:
        st.info("Gemini API 키가 설정되지 않아 데모 모드로 동작합니다. `.env` 파일에 GEMINI_API_KEY를 설정하면 실제 AI 분석을 사용할 수 있습니다.")

    analysis_type = st.selectbox(
        "분석 유형 선택",
        ["이상 패턴 진단", "공정 최적화 제안", "수율 개선 방안"],
    )

    if st.button("🤖 AI 분석 실행", type="primary"):
        # 데이터 요약 통계를 프롬프트로 변환
        stats = df_f[sensors + ["수율"]].describe().round(3)
        anomaly_count = df_f["이상여부"].sum()
        prompt = (
            f"제조 공정 센서 데이터를 분석해주세요.\n"
            f"분석 유형: {analysis_type}\n\n"
            f"데이터 요약:\n{stats.to_string()}\n\n"
            f"총 이상치 수: {anomaly_count}건 / {len(df_f):,}개\n\n"
            f"한국어로 구체적인 분석 결과와 권고 사항을 제시해주세요."
        )

        with st.spinner("AI가 분석 중입니다..."):
            time.sleep(1.5)
            response = call_gemini(prompt)

        st.markdown("---")
        st.markdown("### 🤖 AI 분석 결과")
        st.markdown(response)

        # 세션에 저장
        if "ai_responses" not in st.session_state:
            st.session_state["ai_responses"] = []
        st.session_state["ai_responses"].append({
            "type": analysis_type,
            "response": response,
        })

    # 이전 분석 이력
    if st.session_state.get("ai_responses"):
        with st.expander(f"📋 이전 분석 이력 ({len(st.session_state['ai_responses'])}건)"):
            for i, r in enumerate(reversed(st.session_state["ai_responses"]), start=1):
                st.markdown(f"**{i}. {r['type']}**")
                st.markdown(r["response"])
                st.divider()


# ═══════════════════════ TAB 3: 트렌드 분석 ══════════════════════
with tab3:
    st.subheader("센서 트렌드 분석")
    trend_sensor = st.selectbox("센서 선택 (트렌드)", sensors, key="trend_sensor_select")
    trend_eq     = st.selectbox("설비 선택", selected_eq, key="trend_eq_select")

    eq_data  = df_f[df_f["설비"] == trend_eq][trend_sensor].dropna()
    trend_r  = linear_trend(eq_data)
    rolling  = rolling_stats(eq_data, window=20)

    col1, col2, col3 = st.columns(3)
    col1.metric("트렌드", trend_r["trend"])
    col2.metric("기울기",  f"{trend_r['slope']:.6f}")
    col3.metric("R²",      f"{trend_r['r_squared']:.4f}")

    # 이동 평균 차트
    fig_roll = go.Figure()
    fig_roll.add_trace(go.Scatter(
        x=list(range(len(rolling))),
        y=rolling["값"],
        mode="lines", name="원본",
        line=dict(color="#bdc3c7", width=1),
        opacity=0.7,
    ))
    fig_roll.add_trace(go.Scatter(
        x=list(range(len(rolling))),
        y=rolling["이동평균"],
        mode="lines", name="이동평균 (20)",
        line=dict(color="#3498db", width=2.5),
    ))
    # 표준편차 밴드
    upper = rolling["이동평균"] + rolling["이동표준편차"]
    lower = rolling["이동평균"] - rolling["이동표준편차"]
    fig_roll.add_trace(go.Scatter(
        x=list(range(len(rolling))) + list(range(len(rolling) - 1, -1, -1)),
        y=upper.tolist() + lower.tolist()[::-1],
        fill="toself", fillcolor="rgba(52,152,219,0.15)",
        line=dict(color="rgba(255,255,255,0)"),
        name="±1σ 구간",
    ))
    fig_roll.update_layout(
        height=320, title=f"{trend_eq} — {trend_sensor} 이동 평균",
        yaxis_title=f"{SENSOR_CONFIG[trend_sensor]['unit']}",
        margin=dict(t=50, b=40, l=60, r=20),
    )
    st.plotly_chart(fig_roll, use_container_width=True)
