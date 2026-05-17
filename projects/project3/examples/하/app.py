"""
[하] 난이도 모범 답안 — 공정 모니터링 알림 시스템
==============================================
학습 목표:
  1. Streamlit으로 실시간처럼 업데이트되는 대시보드 만들기
  2. 임계값 기반 상태 판단 로직 (정상 / 주의 / 위험)
  3. 텔레그램 알림 연동 구조 이해

실행 방법:
  pip install -r requirements.txt
  streamlit run app.py
"""

import time
import random
import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from datetime import datetime, timedelta

# ── 페이지 기본 설정 ─────────────────────────────────────────────
st.set_page_config(
    page_title="공정 모니터링 대시보드",
    page_icon="🏭",
    layout="wide",
)

# ── 임계값 설정 ───────────────────────────────────────────────────
THRESHOLDS = {
    "온도": {"정상": (20, 80), "주의": (10, 90), "단위": "°C"},
    "압력": {"정상": (0.8, 1.2), "주의": (0.5, 1.5), "단위": "bar"},
    "습도": {"정상": (30, 60), "주의": (20, 70), "단위": "%"},
    "진동": {"정상": (0, 2.0), "주의": (0, 3.5), "단위": "mm/s"},
}


def get_status(sensor: str, value: float) -> str:
    """센서 값으로 상태를 판단합니다."""
    lo_ok, hi_ok = THRESHOLDS[sensor]["정상"]
    lo_warn, hi_warn = THRESHOLDS[sensor]["주의"]
    if lo_ok <= value <= hi_ok:
        return "정상"
    elif lo_warn <= value <= hi_warn:
        return "주의"
    else:
        return "위험"


STATUS_COLOR = {"정상": "#2ecc71", "주의": "#f39c12", "위험": "#e74c3c"}
STATUS_ICON  = {"정상": "✅", "주의": "⚠️", "위험": "🚨"}


def simulate_sensor() -> dict:
    """
    실제 센서 대신 난수로 공정 데이터를 생성합니다.
    실제 프로젝트에서는 이 부분을 실제 센서 API 또는 DB 조회로 교체하세요.
    """
    return {
        "온도": round(random.gauss(55, 15), 1),
        "압력": round(random.gauss(1.0, 0.2), 2),
        "습도": round(random.gauss(45, 12), 1),
        "진동": round(abs(random.gauss(1.0, 0.8)), 2),
    }


# ── 히스토리 초기화 (세션 상태 사용) ─────────────────────────────
if "history" not in st.session_state:
    now = datetime.now()
    rows = []
    for i in range(30):
        ts = now - timedelta(seconds=(30 - i) * 2)
        vals = simulate_sensor()
        rows.append({"시각": ts, **vals})
    st.session_state.history = pd.DataFrame(rows)

if "alert_log" not in st.session_state:
    st.session_state.alert_log = []


# ── UI 렌더링 ─────────────────────────────────────────────────────
st.title("🏭 공정 모니터링 대시보드")
st.caption(f"마지막 갱신: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

# 새 데이터 생성
latest = simulate_sensor()
new_row = pd.DataFrame([{"시각": datetime.now(), **latest}])
st.session_state.history = pd.concat(
    [st.session_state.history, new_row], ignore_index=True
).tail(60)  # 최근 60개만 유지

# ── 상단 상태 카드 ────────────────────────────────────────────────
st.subheader("현재 센서 상태")
cols = st.columns(len(THRESHOLDS))
for col, (sensor, value) in zip(cols, latest.items()):
    status = get_status(sensor, value)
    unit = THRESHOLDS[sensor]["단위"]
    col.markdown(
        f"""
        <div style="
            background:{STATUS_COLOR[status]}22;
            border-left:4px solid {STATUS_COLOR[status]};
            border-radius:8px; padding:12px 16px; margin-bottom:8px;">
            <div style="font-size:0.85rem; color:#555;">{sensor}</div>
            <div style="font-size:1.8rem; font-weight:700;">{value} {unit}</div>
            <div style="font-size:1.1rem;">{STATUS_ICON[status]} {status}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    # 알림 로그에 추가
    if status != "정상":
        msg = f"[{datetime.now().strftime('%H:%M:%S')}] {sensor} {status} — {value}{unit}"
        if not st.session_state.alert_log or st.session_state.alert_log[-1] != msg:
            st.session_state.alert_log.append(msg)

# ── 게이지 차트 ────────────────────────────────────────────────────
st.subheader("센서 게이지")
fig_gauge = make_subplots(
    rows=1, cols=4,
    specs=[[{"type": "indicator"}] * 4],
)
gauge_configs = [
    ("온도",  latest["온도"],  0, 100, "°C"),
    ("압력",  latest["압력"],  0, 2.0, "bar"),
    ("습도",  latest["습도"],  0, 100, "%"),
    ("진동",  latest["진동"],  0, 5.0, "mm/s"),
]
for idx, (name, val, lo, hi, unit) in enumerate(gauge_configs, start=1):
    status = get_status(name, val)
    fig_gauge.add_trace(
        go.Indicator(
            mode="gauge+number",
            value=val,
            title={"text": f"{name} ({unit})"},
            gauge={
                "axis": {"range": [lo, hi]},
                "bar": {"color": STATUS_COLOR[status]},
                "steps": [
                    {"range": [lo, THRESHOLDS[name]["정상"][0]], "color": "#fdecea"},
                    {"range": list(THRESHOLDS[name]["정상"]),     "color": "#eafaf1"},
                    {"range": [THRESHOLDS[name]["정상"][1], hi],  "color": "#fdecea"},
                ],
            },
        ),
        row=1, col=idx,
    )
fig_gauge.update_layout(height=260, margin=dict(t=40, b=10, l=10, r=10))
st.plotly_chart(fig_gauge, use_container_width=True)

# ── 시계열 라인 차트 ───────────────────────────────────────────────
st.subheader("시계열 추이 (최근 60회)")
tab1, tab2, tab3, tab4 = st.tabs(["온도", "압력", "습도", "진동"])
df = st.session_state.history

for tab, sensor in zip([tab1, tab2, tab3, tab4], THRESHOLDS.keys()):
    with tab:
        unit = THRESHOLDS[sensor]["단위"]
        lo_ok, hi_ok = THRESHOLDS[sensor]["정상"]
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=df["시각"], y=df[sensor],
            mode="lines+markers", name=sensor,
            line=dict(color="#3498db", width=2),
            marker=dict(size=4),
        ))
        fig.add_hrect(y0=lo_ok, y1=hi_ok, fillcolor="#2ecc71", opacity=0.08,
                      annotation_text="정상 범위", annotation_position="top right")
        fig.update_layout(
            height=280,
            yaxis_title=f"{sensor} ({unit})",
            margin=dict(t=30, b=30, l=50, r=20),
        )
        st.plotly_chart(fig, use_container_width=True)

# ── 알림 로그 ─────────────────────────────────────────────────────
st.subheader("알림 로그")
if st.session_state.alert_log:
    for msg in reversed(st.session_state.alert_log[-10:]):
        color = "#e74c3c" if "위험" in msg else "#f39c12"
        st.markdown(
            f'<div style="color:{color}; font-family:monospace; font-size:0.9rem;">{msg}</div>',
            unsafe_allow_html=True,
        )
else:
    st.success("현재 모든 센서가 정상 범위입니다.")

# ── 텔레그램 알림 버튼 ─────────────────────────────────────────────
st.divider()
st.subheader("텔레그램 알림 전송")
col_a, col_b = st.columns([1, 3])
with col_a:
    if st.button("🔔 지금 상태 전송", type="primary"):
        # telegram_bot.py 의 send_alert() 함수를 import해서 사용합니다.
        # 현재는 데모용 출력으로 대체합니다.
        lines = ["📊 *공정 현황 보고*\n"]
        for sensor, value in latest.items():
            status = get_status(sensor, value)
            unit = THRESHOLDS[sensor]["단위"]
            lines.append(f"{STATUS_ICON[status]} {sensor}: {value}{unit} ({status})")
        st.code("\n".join(lines), language="markdown")
        st.info("실제 전송하려면 telegram_bot.py 의 BOT_TOKEN / CHAT_ID를 설정하세요.")

# ── 자동 새로고침 ──────────────────────────────────────────────────
st.divider()
auto_refresh = st.checkbox("자동 새로고침 (2초마다)", value=False)
if auto_refresh:
    time.sleep(2)
    st.rerun()
