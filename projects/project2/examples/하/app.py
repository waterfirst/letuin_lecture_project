"""
프로젝트 2 [하] 난이도 — 공정 데이터 기초 대시보드
렛유인 AI + 바이브코딩 강의 모범 답안

실행 방법:
    pip install -r requirements.txt
    streamlit run app.py
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta

# ─────────────────────────────────────────────
# 페이지 설정
# ─────────────────────────────────────────────
st.set_page_config(
    page_title="공정 데이터 대시보드",
    page_icon="🏭",
    layout="wide",
)

st.title("🏭 공정 데이터 대시보드")
st.caption("SECOM 스타일 합성 데이터 기반 | 렛유인 AI 강의 프로젝트 2 [하]")

# ─────────────────────────────────────────────
# 데이터 생성 함수
# ─────────────────────────────────────────────
@st.cache_data
def generate_process_data(n_days: int = 30, seed: int = 42) -> pd.DataFrame:
    """
    합성 공정 데이터 생성.
    실제 SECOM 데이터셋을 모사한 간단한 버전.
    """
    rng = np.random.default_rng(seed)
    n = n_days * 24  # 시간 단위 샘플

    dates = [datetime(2024, 1, 1) + timedelta(hours=i) for i in range(n)]

    # 공정 파라미터 (정상 범위 + 약간의 드리프트)
    trend = np.linspace(0, 0.5, n)  # 서서히 드리프트

    temperature = 200 + 5 * rng.standard_normal(n) + 3 * trend
    pressure    = 1.5 + 0.1 * rng.standard_normal(n) + 0.05 * trend
    thickness   = 100 + 2 * rng.standard_normal(n) - 1.5 * trend

    # 수율: 공정 파라미터에 의존 + 노이즈
    yield_pct = (
        95
        - 0.3 * np.abs(temperature - 200)
        - 2.0 * np.abs(pressure - 1.5)
        - 0.1 * np.abs(thickness - 100)
        + rng.standard_normal(n)
    ).clip(80, 100)

    # 공정 라인 레이블 (랜덤)
    lines = rng.choice(["Line A", "Line B", "Line C"], size=n)

    df = pd.DataFrame({
        "시간": dates,
        "온도 (°C)": temperature.round(2),
        "압력 (atm)": pressure.round(3),
        "두께 (nm)": thickness.round(2),
        "수율 (%)": yield_pct.round(2),
        "공정 라인": lines,
    })
    return df


# ─────────────────────────────────────────────
# 사이드바 — 필터
# ─────────────────────────────────────────────
st.sidebar.header("필터 설정")

df_full = generate_process_data(n_days=30)

# 날짜 범위
min_date = df_full["시간"].min().date()
max_date = df_full["시간"].max().date()

date_range = st.sidebar.date_input(
    "날짜 범위",
    value=(min_date, max_date),
    min_value=min_date,
    max_value=max_date,
)

# 공정 라인 선택
all_lines = sorted(df_full["공정 라인"].unique())
selected_lines = st.sidebar.multiselect(
    "공정 라인",
    options=all_lines,
    default=all_lines,
)

# 파라미터 선택
param_options = ["온도 (°C)", "압력 (atm)", "두께 (nm)", "수율 (%)"]
selected_param = st.sidebar.selectbox("트렌드 차트 파라미터", param_options)

st.sidebar.markdown("---")
st.sidebar.info(
    "Gemini 프롬프트 힌트:\n\n"
    "이 데이터를 분석해서 공정 이상 구간을 찾고, "
    "수율에 가장 영향을 주는 파라미터를 알려줘."
)

# ─────────────────────────────────────────────
# 데이터 필터링
# ─────────────────────────────────────────────
if len(date_range) == 2:
    start_dt = datetime.combine(date_range[0], datetime.min.time())
    end_dt   = datetime.combine(date_range[1], datetime.max.time())
else:
    start_dt = datetime.combine(min_date, datetime.min.time())
    end_dt   = datetime.combine(max_date, datetime.max.time())

df = df_full[
    (df_full["시간"] >= start_dt)
    & (df_full["시간"] <= end_dt)
    & (df_full["공정 라인"].isin(selected_lines))
].copy()

if df.empty:
    st.warning("선택한 조건에 해당하는 데이터가 없습니다. 필터를 확인해 주세요.")
    st.stop()

# ─────────────────────────────────────────────
# 상단 지표 카드
# ─────────────────────────────────────────────
st.subheader("요약 지표")

col1, col2, col3, col4 = st.columns(4)

with col1:
    avg_yield = df["수율 (%)"].mean()
    st.metric("평균 수율", f"{avg_yield:.1f}%",
              delta=f"{avg_yield - 95:.1f}%p vs. 목표(95%)")
with col2:
    avg_temp = df["온도 (°C)"].mean()
    st.metric("평균 온도", f"{avg_temp:.1f} °C",
              delta=f"{avg_temp - 200:.1f} vs. 기준(200°C)")
with col3:
    avg_pressure = df["압력 (atm)"].mean()
    st.metric("평균 압력", f"{avg_pressure:.3f} atm",
              delta=f"{avg_pressure - 1.5:.3f} vs. 기준(1.5atm)")
with col4:
    anomaly_count = (df["수율 (%)"] < 90).sum()
    st.metric("저수율 발생 건수", f"{anomaly_count}건",
              delta=f"전체의 {100*anomaly_count/len(df):.1f}%",
              delta_color="inverse")

st.markdown("---")

# ─────────────────────────────────────────────
# 차트 1 — 시계열 트렌드
# ─────────────────────────────────────────────
st.subheader(f"시계열 트렌드 — {selected_param}")

# 1시간 평균으로 리샘플 (너무 많은 점 방지)
df_resampled = (
    df.set_index("시간")[selected_param]
    .resample("1h")
    .mean()
    .reset_index()
)
df_resampled.columns = ["시간", selected_param]

fig_trend = px.line(
    df_resampled,
    x="시간",
    y=selected_param,
    title=f"{selected_param} 시간별 추이",
    labels={"시간": "시간", selected_param: selected_param},
    color_discrete_sequence=["#1f77b4"],
)

# 수율 차트일 경우 목표선 추가
if selected_param == "수율 (%)":
    fig_trend.add_hline(y=95, line_dash="dash", line_color="red",
                        annotation_text="목표 수율 (95%)")
    fig_trend.add_hline(y=90, line_dash="dot", line_color="orange",
                        annotation_text="경고 수율 (90%)")

fig_trend.update_layout(height=350)
st.plotly_chart(fig_trend, use_container_width=True)

# ─────────────────────────────────────────────
# 차트 2 — 히스토그램 (분포)
# ─────────────────────────────────────────────
st.subheader("파라미터 분포")

col_left, col_right = st.columns(2)

with col_left:
    fig_hist = px.histogram(
        df,
        x=selected_param,
        color="공정 라인",
        barmode="overlay",
        nbins=40,
        title=f"{selected_param} 분포 (공정 라인별)",
        opacity=0.7,
        color_discrete_sequence=px.colors.qualitative.Set2,
    )
    fig_hist.update_layout(height=350)
    st.plotly_chart(fig_hist, use_container_width=True)

with col_right:
    # 박스 플롯
    fig_box = px.box(
        df,
        x="공정 라인",
        y=selected_param,
        color="공정 라인",
        title=f"공정 라인별 {selected_param} 분포",
        color_discrete_sequence=px.colors.qualitative.Set2,
    )
    fig_box.update_layout(height=350, showlegend=False)
    st.plotly_chart(fig_box, use_container_width=True)

# ─────────────────────────────────────────────
# 차트 3 — 수율 vs 파라미터 산점도
# ─────────────────────────────────────────────
st.subheader("수율과 공정 파라미터 관계")

scatter_params = [p for p in param_options if p != "수율 (%)"]
scatter_x = st.selectbox("X축 파라미터", scatter_params, key="scatter_x")

fig_scatter = px.scatter(
    df.sample(min(500, len(df)), random_state=42),  # 최대 500점
    x=scatter_x,
    y="수율 (%)",
    color="공정 라인",
    trendline="ols",
    title=f"{scatter_x} vs 수율 관계",
    color_discrete_sequence=px.colors.qualitative.Set2,
    opacity=0.6,
)
fig_scatter.add_hline(y=90, line_dash="dot", line_color="orange",
                      annotation_text="경고 기준")
fig_scatter.update_layout(height=380)
st.plotly_chart(fig_scatter, use_container_width=True)

# ─────────────────────────────────────────────
# 기초 통계 테이블
# ─────────────────────────────────────────────
st.subheader("기초 통계")

numeric_cols = ["온도 (°C)", "압력 (atm)", "두께 (nm)", "수율 (%)"]
stats = df[numeric_cols].describe().T.round(3)
stats.columns = ["샘플수", "평균", "표준편차", "최솟값", "25%", "중앙값", "75%", "최댓값"]

st.dataframe(stats, use_container_width=True)

# ─────────────────────────────────────────────
# 원시 데이터 미리보기 (접기)
# ─────────────────────────────────────────────
with st.expander("원시 데이터 보기"):
    st.dataframe(df.head(100), use_container_width=True)
    st.caption(f"전체 {len(df):,}행 중 최대 100행 표시")

st.markdown("---")
st.caption("렛유인 AI + 바이브코딩 강의 | 프로젝트 2 [하] 모범 답안")
