"""
Page 2 — 이상 감지
==================
Z-score 및 IQR 기반 이상치 감지 알고리즘을 적용합니다.
이상 포인트를 시각적으로 강조하고 텔레그램 알림과 연동합니다.
"""

import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

from utils.data_generator import generate_factory_data, SENSOR_CONFIG
from utils.analyzer import (
    detect_anomalies_zscore,
    detect_anomalies_iqr,
    get_anomaly_summary,
    process_capability_report,
)
from utils.telegram_alert import TelegramAlert

st.set_page_config(page_title="이상 감지", page_icon="🔍", layout="wide")
st.title("🔍 이상 감지 분석")

# ── 데이터 로드 ───────────────────────────────────────────────────
if "factory_df" not in st.session_state:
    st.session_state["factory_df"] = generate_factory_data(hours=24, freq_sec=60)

df = st.session_state["factory_df"]
selected_eq = st.session_state.get("selected_eq", df["설비"].unique().tolist())
df_f = df[df["설비"].isin(selected_eq)] if selected_eq else df

# ── 설정 ──────────────────────────────────────────────────────────
col1, col2, col3 = st.columns(3)
with col1:
    sensor = st.selectbox("분석 센서", list(SENSOR_CONFIG.keys()))
with col2:
    method = st.radio("감지 방법", ["Z-score", "IQR"], horizontal=True)
with col3:
    if method == "Z-score":
        threshold = st.slider("Z-score 임계값", 1.5, 4.0, 2.5, 0.1)
    else:
        threshold = st.slider("IQR 배수", 1.0, 3.0, 1.5, 0.1)

# ── 이상 감지 실행 ────────────────────────────────────────────────
series = df_f[sensor]
if method == "Z-score":
    anomaly_mask = detect_anomalies_zscore(series, threshold=threshold)
else:
    anomaly_mask = detect_anomalies_iqr(series, factor=threshold)

df_plot = df_f.copy()
df_plot["is_anomaly"] = anomaly_mask.values

# KPI
col_a, col_b, col_c, col_d = st.columns(4)
col_a.metric("전체 데이터 수",  f"{len(df_plot):,}개")
col_b.metric("이상 감지 수",    f"{anomaly_mask.sum()}개")
col_c.metric("이상 비율",        f"{anomaly_mask.mean()*100:.1f}%")
col_d.metric("정상 범위",
             f"{SENSOR_CONFIG[sensor]['normal'][0]} ~ {SENSOR_CONFIG[sensor]['normal'][1]} "
             f"{SENSOR_CONFIG[sensor]['unit']}")

st.divider()

# ── 이상 감지 시각화 ───────────────────────────────────────────────
st.subheader(f"{sensor} 이상 감지 차트")
normal  = df_plot[~df_plot["is_anomaly"]]
anomaly = df_plot[df_plot["is_anomaly"]]

fig = go.Figure()
# 정상 데이터
fig.add_trace(go.Scatter(
    x=normal["시각"], y=normal[sensor],
    mode="lines", name="정상",
    line=dict(color="#3498db", width=1.5),
))
# 이상 데이터 (빨간 점)
if not anomaly.empty:
    fig.add_trace(go.Scatter(
        x=anomaly["시각"], y=anomaly[sensor],
        mode="markers", name="이상",
        marker=dict(color="#e74c3c", size=8, symbol="x"),
    ))

# 정상 범위 음영
lo, hi = SENSOR_CONFIG[sensor]["normal"]
fig.add_hrect(y0=lo, y1=hi, fillcolor="#2ecc71", opacity=0.08,
              annotation_text="정상 범위", annotation_position="top right")

fig.update_layout(
    height=360,
    yaxis_title=f"{sensor} ({SENSOR_CONFIG[sensor]['unit']})",
    legend_title="상태",
    hovermode="x unified",
    margin=dict(t=30, b=40, l=60, r=20),
)
st.plotly_chart(fig, use_container_width=True)

# ── 이상치 분포 ───────────────────────────────────────────────────
col_hist, col_box = st.columns(2)
with col_hist:
    st.subheader("분포 히스토그램")
    fig_hist = go.Figure()
    fig_hist.add_trace(go.Histogram(
        x=normal[sensor], name="정상",
        marker_color="#3498db", opacity=0.7, nbinsx=40,
    ))
    fig_hist.add_trace(go.Histogram(
        x=anomaly[sensor], name="이상",
        marker_color="#e74c3c", opacity=0.9, nbinsx=20,
    ))
    fig_hist.update_layout(barmode="overlay", height=300,
                           margin=dict(t=20, b=40, l=50, r=20))
    st.plotly_chart(fig_hist, use_container_width=True)

with col_box:
    st.subheader("설비별 박스플롯")
    fig_box = px.box(df_f, x="설비", y=sensor,
                     color="설비", title=f"{sensor} 설비별 분포")
    fig_box.update_layout(height=300, margin=dict(t=40, b=40, l=50, r=20),
                          showlegend=False)
    st.plotly_chart(fig_box, use_container_width=True)

# ── 전체 센서 이상 요약 ───────────────────────────────────────────
st.divider()
st.subheader("전체 센서 이상 요약")
sensors = list(SENSOR_CONFIG.keys())
summary_df = get_anomaly_summary(df_f, sensors, method="zscore" if method == "Z-score" else "iqr")
st.dataframe(summary_df, use_container_width=True, hide_index=True)

# ── 공정 능력 지수 ────────────────────────────────────────────────
st.divider()
st.subheader("공정 능력 지수 (Cp / Cpk)")
specs = {s: {"lsl": cfg["normal"][0], "usl": cfg["normal"][1]}
         for s, cfg in SENSOR_CONFIG.items()}
cp_df = process_capability_report(df_f, specs)

# 판정에 따른 색상 표시
def color_judgment(val):
    color_map = {"우수": "#2ecc71", "양호": "#3498db", "주의": "#f39c12", "불량": "#e74c3c"}
    return f"color: {color_map.get(val, 'black')}"

styled = cp_df.style.applymap(color_judgment, subset=["판정"])
st.dataframe(styled, use_container_width=True, hide_index=True)

# ── 텔레그램 알림 버튼 ─────────────────────────────────────────────
st.divider()
st.subheader("텔레그램 알림 전송")
if st.button("🔔 이상 요약 알림 전송", type="primary"):
    alert = TelegramAlert()
    high_anomaly = summary_df[summary_df["이상치 비율(%)"] > 5]["센서"].tolist()
    if high_anomaly:
        msg = f"이상 비율 5% 초과 센서: {', '.join(high_anomaly)}"
    else:
        msg = "현재 모든 센서가 정상 범위 내에 있습니다."
    alert._send(f"📊 *이상 감지 요약*\n{msg}")
    st.success("알림이 전송되었습니다. (콘솔 확인)")
