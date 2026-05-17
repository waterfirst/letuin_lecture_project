"""
[중] 난이도 모범 답안 — AI 공정 어드바이저
==========================================
구성:
  Page 1 — 데이터 업로드 & 시각화
  Page 2 — AI 분석 (Gemini API 모킹 구조)
  Page 3 — 최적화 제안

실행 방법:
  pip install -r requirements.txt
  streamlit run app.py
"""

import io
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go

from ai_advisor import analyze_dataframe, get_optimization_suggestions
from report_generator import generate_report

# ── 페이지 설정 ───────────────────────────────────────────────────
st.set_page_config(
    page_title="AI 공정 어드바이저",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── 사이드바 ──────────────────────────────────────────────────────
with st.sidebar:
    st.image("https://img.icons8.com/fluency/96/artificial-intelligence.png", width=72)
    st.title("AI 공정 어드바이저")
    st.caption("Gemini AI 기반 공정 데이터 분석 시스템")
    st.divider()
    page = st.radio(
        "페이지 선택",
        ["📂 1. 데이터 업로드", "🔍 2. AI 분석", "💡 3. 최적화 제안"],
        key="page_selector",
    )
    st.divider()
    st.caption("© 2025 AI Engineering Lab")

# ── 샘플 데이터 생성 함수 ─────────────────────────────────────────
def make_sample_data(n: int = 200) -> pd.DataFrame:
    np.random.seed(42)
    t = np.linspace(0, 4 * np.pi, n)
    df = pd.DataFrame({
        "시각":  pd.date_range("2025-01-01", periods=n, freq="10min"),
        "온도":  60 + 15 * np.sin(t) + np.random.randn(n) * 3,
        "압력":  1.0 + 0.2 * np.cos(t * 0.7) + np.random.randn(n) * 0.05,
        "습도":  45 + 10 * np.sin(t * 1.3) + np.random.randn(n) * 2,
        "수율":  95 - 0.3 * np.abs(60 + 15 * np.sin(t) - 60) + np.random.randn(n) * 1.5,
    })
    df["수율"] = df["수율"].clip(80, 99)
    return df

# ── 세션 상태 초기화 ──────────────────────────────────────────────
if "df" not in st.session_state:
    st.session_state.df = None
if "analysis_result" not in st.session_state:
    st.session_state.analysis_result = None


# ════════════════════════════════════════════════════════════════
# PAGE 1 — 데이터 업로드 & 시각화
# ════════════════════════════════════════════════════════════════
if page == "📂 1. 데이터 업로드":
    st.title("📂 데이터 업로드 & 시각화")
    st.markdown("CSV 또는 Excel 파일을 업로드하거나 **샘플 데이터**를 사용하세요.")

    col1, col2 = st.columns([2, 1])
    with col1:
        uploaded = st.file_uploader(
            "파일 업로드 (CSV, XLSX)",
            type=["csv", "xlsx"],
            help="첫 번째 행은 컬럼명이어야 합니다.",
        )
    with col2:
        st.markdown("<br>", unsafe_allow_html=True)
        if st.button("📊 샘플 데이터 불러오기", type="secondary"):
            st.session_state.df = make_sample_data()
            st.success("샘플 데이터를 불러왔습니다.")

    if uploaded is not None:
        try:
            if uploaded.name.endswith(".csv"):
                st.session_state.df = pd.read_csv(uploaded)
            else:
                st.session_state.df = pd.read_excel(uploaded)
            st.success(f"파일 업로드 완료: {uploaded.name}")
        except Exception as e:
            st.error(f"파일 읽기 오류: {e}")

    df = st.session_state.df
    if df is None:
        st.info("위에서 파일을 업로드하거나 샘플 데이터를 선택하세요.")
        st.stop()

    # 데이터 미리보기
    st.subheader("데이터 미리보기")
    st.dataframe(df.head(10), use_container_width=True)

    col_a, col_b, col_c = st.columns(3)
    col_a.metric("행 수",   f"{len(df):,}")
    col_b.metric("열 수",   f"{len(df.columns)}")
    col_c.metric("결측치", f"{df.isnull().sum().sum()}")

    # 수치형 컬럼 자동 감지
    num_cols = df.select_dtypes(include="number").columns.tolist()
    if not num_cols:
        st.warning("수치형 컬럼이 없습니다.")
        st.stop()

    st.divider()
    st.subheader("시각화")

    viz_type = st.selectbox("차트 유형", ["라인 차트", "산포도", "히트맵 (상관관계)", "히스토그램"])
    selected = st.multiselect("컬럼 선택", num_cols, default=num_cols[:2])

    if selected:
        if viz_type == "라인 차트":
            time_col = next((c for c in df.columns if "시각" in c or "time" in c.lower() or "date" in c.lower()), None)
            x_axis = time_col if time_col else df.index
            fig = px.line(df, x=x_axis, y=selected, title="시계열 추이")
            st.plotly_chart(fig, use_container_width=True)

        elif viz_type == "산포도" and len(selected) >= 2:
            fig = px.scatter(df, x=selected[0], y=selected[1],
                             trendline="ols", title=f"{selected[0]} vs {selected[1]}")
            st.plotly_chart(fig, use_container_width=True)

        elif viz_type == "히트맵 (상관관계)":
            corr = df[num_cols].corr()
            fig = px.imshow(corr, text_auto=".2f", color_continuous_scale="RdBu",
                            title="상관관계 히트맵")
            st.plotly_chart(fig, use_container_width=True)

        elif viz_type == "히스토그램":
            fig = px.histogram(df, x=selected[0], nbins=30, title=f"{selected[0]} 분포")
            st.plotly_chart(fig, use_container_width=True)

    st.info("분석을 계속하려면 사이드바에서 **2. AI 분석** 페이지로 이동하세요.")


# ════════════════════════════════════════════════════════════════
# PAGE 2 — AI 분석
# ════════════════════════════════════════════════════════════════
elif page == "🔍 2. AI 분석":
    st.title("🔍 AI 공정 분석")

    df = st.session_state.df
    if df is None:
        st.warning("먼저 **1. 데이터 업로드** 페이지에서 데이터를 불러오세요.")
        st.stop()

    st.markdown("AI가 공정 데이터를 분석하고 **이상 징후 및 패턴**을 파악합니다.")
    st.caption("*현재 데모 모드: Gemini API 연동 구조를 모킹합니다.*")

    if st.button("🤖 AI 분석 시작", type="primary"):
        with st.spinner("AI가 데이터를 분석 중입니다..."):
            import time; time.sleep(1.5)  # UX용 딜레이
            result = analyze_dataframe(df)
            st.session_state.analysis_result = result

    if st.session_state.analysis_result:
        result = st.session_state.analysis_result

        st.subheader("📋 분석 요약")
        st.info(result["summary"])

        st.subheader("🔴 이상 감지 결과")
        col1, col2 = st.columns(2)
        col1.metric("이상 포인트 수", result["anomaly_count"])
        col2.metric("이상 비율",      f'{result["anomaly_rate"]:.1f}%')

        if result["anomaly_indices"]:
            st.dataframe(
                df.iloc[result["anomaly_indices"]].head(20),
                use_container_width=True,
            )

        st.subheader("📊 AI 인사이트")
        for i, insight in enumerate(result["insights"], start=1):
            st.markdown(f"**{i}.** {insight}")

        st.subheader("⚠️ 주요 경고")
        for w in result["warnings"]:
            st.warning(w)

        st.divider()
        st.info("최적화 제안을 보려면 **3. 최적화 제안** 페이지로 이동하세요.")
    else:
        st.info("위의 버튼을 눌러 AI 분석을 시작하세요.")


# ════════════════════════════════════════════════════════════════
# PAGE 3 — 최적화 제안
# ════════════════════════════════════════════════════════════════
elif page == "💡 3. 최적화 제안":
    st.title("💡 공정 최적화 제안")

    df = st.session_state.df
    analysis = st.session_state.analysis_result

    if df is None:
        st.warning("먼저 데이터를 업로드하세요.")
        st.stop()
    if analysis is None:
        st.warning("먼저 **2. AI 분석** 페이지에서 분석을 실행하세요.")
        st.stop()

    suggestions = get_optimization_suggestions(df, analysis)

    st.subheader("🎯 최적 공정 파라미터")
    param_df = pd.DataFrame(suggestions["optimal_params"])
    st.dataframe(param_df, use_container_width=True)

    st.subheader("📈 예상 개선 효과")
    col1, col2, col3 = st.columns(3)
    col1.metric("수율 개선", suggestions["yield_improvement"], delta=suggestions["yield_improvement"])
    col2.metric("불량률 감소", suggestions["defect_reduction"])
    col3.metric("에너지 절감", suggestions["energy_saving"])

    st.subheader("🔧 실행 권고 사항")
    for i, rec in enumerate(suggestions["recommendations"], start=1):
        with st.expander(f"권고 {i}: {rec['title']}"):
            st.write(rec["detail"])
            st.code(rec["action_code"], language="python")

    st.divider()
    st.subheader("📄 보고서 다운로드")
    if st.button("📥 분석 보고서 생성", type="secondary"):
        with st.spinner("보고서를 생성 중입니다..."):
            import time; time.sleep(0.8)
            report_md = generate_report(df, analysis, suggestions)
        st.download_button(
            label="⬇️ 마크다운 보고서 다운로드",
            data=report_md.encode("utf-8"),
            file_name="공정_분석_보고서.md",
            mime="text/markdown",
        )
        st.success("보고서가 생성되었습니다!")
