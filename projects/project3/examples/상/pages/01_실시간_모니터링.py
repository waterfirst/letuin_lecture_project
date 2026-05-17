"""
Page 1 — 실시간 모니터링
========================
최근 데이터를 기반으로 실시간처럼 업데이트되는 대시보드입니다.
자동 새로고침, 애니메이션 차트, 설비별 비교 뷰를 제공합니다.
"""

import time
import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

from utils.data_generator import generate_factory_data, SENSOR_CONFIG

st.set_page_config(page_title="실시간 모니터링", page_icon="📡", layout="wide")
st.title("📡 실시간 공정 모니터링")

# ── 데이터 로드 ───────────────────────────────────────────────────
if "factory_df" not in st.session_state:
    st.session_state["factory_df"] = generate_factory_data(hours=24, freq_sec=60)

df = st.session_state["factory_df"]
selected_eq = st.session_state.get("selected_eq", df["설비"].unique().tolist())
df = df[df["설비"].isin(selected_eq)] if selected_eq else df

# ── 제어판 ────────────────────────────────────────────────────────
col_ctrl1, col_ctrl2, col_ctrl3 = st.columns([2, 2, 1])
with col_ctrl1:
    sensor = st.selectbox("센서 선택", list(SENSOR_CONFIG.keys()))
with col_ctrl2:
    window = st.slider("표시 구간 (분)", min_value=30, max_value=360, value=120, step=30)
with col_ctrl3:
    st.markdown("<br>", unsafe_allow_html=True)
    auto = st.checkbox("자동 새로고침", value=False)

# 최근 N분 필터
recent = df[df["시각"] >= df["시각"].max() - pd.Timedelta(minutes=window)]

st.divider()

# ── 게이지 (현재값) ───────────────────────────────────────────────
st.subheader("현재 센서 값")
cfg = SENSOR_CONFIG[sensor]
lo_ok, hi_ok = cfg["normal"]

gauge_cols = st.columns(len(selected_eq))
for col, eq in zip(gauge_cols, selected_eq):
    latest_val = df[df["설비"] == eq].sort_values("시각")[sensor].iloc[-1]
    if lo_ok <= latest_val <= hi_ok:
        status, color = "정상", "#2ecc71"
    elif (lo_ok * 0.9) <= latest_val <= (hi_ok * 1.1):
        status, color = "주의", "#f39c12"
    else:
        status, color = "위험", "#e74c3c"

    fig_g = go.Figure(go.Indicator(
        mode="gauge+number+delta",
        value=latest_val,
        delta={"reference": cfg["base"]},
        title={"text": f"{eq}<br>{sensor}"},
        gauge={
            "axis": {"range": [lo_ok * 0.7, hi_ok * 1.3]},
            "bar":  {"color": color},
            "steps": [
                {"range": [lo_ok * 0.7, lo_ok], "color": "#fdecea"},
                {"range": [lo_ok, hi_ok],        "color": "#eafaf1"},
                {"range": [hi_ok, hi_ok * 1.3],  "color": "#fdecea"},
            ],
            "threshold": {
                "line": {"color": "red", "width": 3},
                "thickness": 0.75,
                "value": hi_ok,
            },
        },
    ))
    fig_g.update_layout(height=220, margin=dict(t=40, b=0, l=20, r=20))
    col.plotly_chart(fig_g, use_container_width=True)

# ── 시계열 라인 차트 (설비 비교) ──────────────────────────────────
st.subheader(f"{sensor} 추이 비교 (최근 {window}분)")
fig_line = go.Figure()
colors = ["#3498db", "#e74c3c", "#2ecc71", "#9b59b6", "#f39c12"]
for i, eq in enumerate(selected_eq):
    eq_data = recent[recent["설비"] == eq]
    fig_line.add_trace(go.Scatter(
        x=eq_data["시각"],
        y=eq_data[sensor],
        name=eq,
        mode="lines",
        line=dict(color=colors[i % len(colors)], width=2),
    ))

# 정상 범위 음영
fig_line.add_hrect(
    y0=lo_ok, y1=hi_ok,
    fillcolor="#2ecc71", opacity=0.07,
    annotation_text="정상 범위",
    annotation_position="top right",
)
fig_line.update_layout(
    height=320,
    yaxis_title=f"{sensor} ({cfg['unit']})",
    legend_title="설비",
    margin=dict(t=30, b=40, l=60, r=20),
    hovermode="x unified",
)
st.plotly_chart(fig_line, use_container_width=True)

# ── 멀티 센서 히트맵 ──────────────────────────────────────────────
st.subheader("센서별 수율 상관관계")
sensors = list(SENSOR_CONFIG.keys())
corr_cols = sensors + ["수율"]
df_corr = df[df["설비"].isin(selected_eq)][corr_cols]
corr_matrix = df_corr.corr()

fig_heat = px.imshow(
    corr_matrix,
    text_auto=".2f",
    color_continuous_scale="RdBu",
    title="센서-수율 상관관계 히트맵",
    zmin=-1, zmax=1,
)
fig_heat.update_layout(height=400, margin=dict(t=50, b=20, l=80, r=20))
st.plotly_chart(fig_heat, use_container_width=True)

# ── 자동 새로고침 ─────────────────────────────────────────────────
if auto:
    time.sleep(3)
    st.rerun()
