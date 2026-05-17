"""
[상] 난이도 모범 답안 — 스마트 팩토리 통합 대시보드
====================================================
포트폴리오 수준의 멀티페이지 Streamlit 앱입니다.

구성:
  app.py                     ← 메인 홈 페이지
  pages/01_실시간_모니터링.py  ← 실시간 대시보드
  pages/02_이상_감지.py        ← Z-score 이상 감지
  pages/03_AI_분석.py          ← AI 분석 리포트
  pages/04_보고서.py           ← HTML 보고서 생성

실행 방법:
  pip install -r requirements.txt
  streamlit run app.py
"""

import streamlit as st
import pandas as pd
from datetime import datetime

from utils.data_generator import generate_factory_data, EQUIPMENT_LIST, SENSOR_CONFIG

# ── 페이지 설정 ───────────────────────────────────────────────────
st.set_page_config(
    page_title="스마트 팩토리 대시보드",
    page_icon="🏭",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── 전역 데이터 캐싱 ──────────────────────────────────────────────
@st.cache_data(ttl=300, show_spinner="공장 데이터를 불러오는 중...")
def load_data() -> pd.DataFrame:
    """24시간 분량의 공장 데이터를 생성합니다 (5분 캐시)."""
    return generate_factory_data(hours=24, freq_sec=60, anomaly_ratio=0.04)

# ── 사이드바 ──────────────────────────────────────────────────────
with st.sidebar:
    st.markdown(
        """
        <div style="text-align:center; padding:12px 0 4px;">
            <span style="font-size:2.5rem;">🏭</span>
            <h2 style="margin:4px 0 2px; font-size:1.1rem;">스마트 팩토리</h2>
            <p style="color:#888; font-size:0.8rem; margin:0;">통합 모니터링 시스템</p>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.divider()

    df = load_data()

    # 설비 필터
    selected_eq = st.multiselect(
        "설비 선택",
        options=EQUIPMENT_LIST,
        default=EQUIPMENT_LIST,
        key="eq_filter",
    )

    # 날짜 범위
    dates = df["시각"].dt.date.unique()
    st.caption(f"데이터 기간: {dates[0]} ~ {dates[-1]}")

    st.divider()
    st.caption("© 2025 Smart Factory Lab")

# ── 세션 상태에 공유 데이터 저장 ──────────────────────────────────
st.session_state["factory_df"] = df
st.session_state["selected_eq"] = selected_eq

# ── 홈 페이지 콘텐츠 ──────────────────────────────────────────────
st.title("🏭 스마트 팩토리 통합 대시보드")
st.markdown(
    "> 실시간 센서 모니터링 · AI 이상 감지 · 자동 보고서 생성을 통합한 스마트 팩토리 솔루션입니다."
)

st.divider()

# 핵심 KPI
df_filtered = df[df["설비"].isin(selected_eq)] if selected_eq else df
latest = df_filtered.sort_values("시각").groupby("설비").last()

col1, col2, col3, col4 = st.columns(4)
col1.metric("평균 수율",        f'{df_filtered["수율"].mean():.1f}%',    delta="+0.3%")
col2.metric("감시 설비 수",     f'{len(selected_eq)}대')
col3.metric("이상 감지 건수",   f'{df_filtered["이상여부"].sum()}건')
col4.metric("데이터 포인트",    f'{len(df_filtered):,}개')

st.divider()

# 현재 상태 요약 테이블
st.subheader("현재 설비 상태")

STATUS_SPEC = {
    "온도":  (55, 75),
    "압력":  (0.9, 1.2),
    "습도":  (35, 55),
    "진동":  (0, 2.5),
    "전류":  (10, 15),
}

def get_status_badge(sensor: str, value: float) -> str:
    lo, hi = STATUS_SPEC[sensor]
    if lo <= value <= hi:
        return "🟢 정상"
    elif (lo * 0.85) <= value <= (hi * 1.15):
        return "🟡 주의"
    else:
        return "🔴 위험"

summary_rows = []
for eq in selected_eq:
    eq_latest = df_filtered[df_filtered["설비"] == eq].sort_values("시각").iloc[-1]
    row = {"설비": eq, "수율": f'{eq_latest["수율"]:.1f}%'}
    for sensor in STATUS_SPEC:
        row[sensor] = get_status_badge(sensor, eq_latest[sensor])
    summary_rows.append(row)

if summary_rows:
    st.dataframe(pd.DataFrame(summary_rows), use_container_width=True, hide_index=True)

st.divider()
st.info("왼쪽 사이드바에서 페이지를 선택하거나 위 탭을 클릭해 각 기능을 사용하세요.")

# 시스템 정보
with st.expander("ℹ️ 시스템 정보"):
    st.markdown(f"""
    | 항목 | 값 |
    |-----|---|
    | 데이터 생성 시각 | {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} |
    | 총 데이터 행 수  | {len(df):,}개 |
    | 감시 센서 수     | {len(SENSOR_CONFIG)}개 |
    | 감시 설비 수     | {len(EQUIPMENT_LIST)}대 |
    | 이상치 감지 방식 | Z-score (임계값 2.5) |
    """)
