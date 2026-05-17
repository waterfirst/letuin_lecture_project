"""
Page 4 — 자동 보고서 생성
==========================
분석 결과를 HTML 보고서로 자동 생성하고 다운로드합니다.
차트 이미지와 통계 테이블을 포함한 완성도 높은 보고서입니다.
"""

import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
from datetime import datetime

from utils.data_generator import generate_factory_data, SENSOR_CONFIG, EQUIPMENT_LIST
from utils.analyzer import get_anomaly_summary, process_capability_report

st.set_page_config(page_title="보고서", page_icon="📄", layout="wide")
st.title("📄 공정 분석 보고서 생성")

# ── 데이터 로드 ───────────────────────────────────────────────────
if "factory_df" not in st.session_state:
    st.session_state["factory_df"] = generate_factory_data(hours=24, freq_sec=60)

df = st.session_state["factory_df"]
selected_eq = st.session_state.get("selected_eq", df["설비"].unique().tolist())
df_f = df[df["설비"].isin(selected_eq)] if selected_eq else df
sensors = list(SENSOR_CONFIG.keys())
now_str = datetime.now().strftime("%Y년 %m월 %d일 %H:%M")


# ── 보고서 미리보기 ───────────────────────────────────────────────
st.subheader("보고서 미리보기")

# 요약 통계
stats = df_f[sensors + ["수율"]].describe().round(3)
st.markdown(f"**분석 기간**: {df_f['시각'].min().strftime('%Y-%m-%d %H:%M')} ~ {df_f['시각'].max().strftime('%Y-%m-%d %H:%M')}")
st.markdown(f"**분석 설비**: {', '.join(selected_eq)}")

col1, col2, col3, col4 = st.columns(4)
col1.metric("평균 수율",   f"{df_f['수율'].mean():.1f}%")
col2.metric("이상 감지",   f"{df_f['이상여부'].sum()}건")
col3.metric("이상 비율",   f"{df_f['이상여부'].mean()*100:.1f}%")
col4.metric("데이터 수",   f"{len(df_f):,}개")

# 요약 차트
fig_summary = make_subplots(
    rows=2, cols=3,
    subplot_titles=[f"{s} 시계열" for s in sensors[:3]] +
                   [f"{s} 분포" for s in sensors[3:6]],
)
colors = ["#3498db", "#e74c3c", "#2ecc71"]
for i, sensor in enumerate(sensors[:3]):
    r, c = (i // 3) + 1, (i % 3) + 1
    sample = df_f[df_f["설비"] == selected_eq[0]].tail(200)
    fig_summary.add_trace(go.Scatter(
        x=sample["시각"], y=sample[sensor],
        mode="lines", name=sensor,
        line=dict(color=colors[i % len(colors)], width=1.5),
        showlegend=False,
    ), row=1, col=i + 1)
for i, sensor in enumerate(sensors[3:6]):
    fig_summary.add_trace(go.Histogram(
        x=df_f[sensor], name=sensor,
        marker_color=colors[i % len(colors)],
        showlegend=False, nbinsx=30,
    ), row=2, col=i + 1)

fig_summary.update_layout(height=480, margin=dict(t=50, b=30, l=50, r=20))
st.plotly_chart(fig_summary, use_container_width=True)

# 이상 요약 테이블
st.subheader("센서별 이상 요약")
anomaly_df = get_anomaly_summary(df_f, sensors)
st.dataframe(anomaly_df, use_container_width=True, hide_index=True)

# 공정 능력
st.subheader("공정 능력 지수 (Cp / Cpk)")
specs = {s: {"lsl": cfg["normal"][0], "usl": cfg["normal"][1]}
         for s, cfg in SENSOR_CONFIG.items()}
cp_df = process_capability_report(df_f, specs)
st.dataframe(cp_df, use_container_width=True, hide_index=True)


# ── HTML 보고서 생성 함수 ─────────────────────────────────────────
def build_html_report() -> str:
    """완성도 높은 HTML 보고서를 생성합니다."""

    # 통계 테이블 HTML
    def df_to_html_table(df: pd.DataFrame) -> str:
        return df.to_html(index=False, border=0, classes="report-table")

    anomaly_html = df_to_html_table(anomaly_df)
    cp_html      = df_to_html_table(cp_df)
    stats_html   = df_to_html_table(stats.reset_index().rename(columns={"index": "통계"}))

    # 수율 트렌드 차트 (Plotly → HTML)
    fig_yield = go.Figure()
    for eq in selected_eq:
        eq_data = df_f[df_f["설비"] == eq]
        fig_yield.add_trace(go.Scatter(
            x=eq_data["시각"], y=eq_data["수율"],
            mode="lines", name=eq,
        ))
    fig_yield.update_layout(
        title="설비별 수율 추이",
        yaxis_title="수율 (%)",
        height=350,
    )
    yield_chart_html = fig_yield.to_html(full_html=False, include_plotlyjs="cdn")

    anomaly_count = int(df_f["이상여부"].sum())
    anomaly_rate  = float(df_f["이상여부"].mean() * 100)
    avg_yield     = float(df_f["수율"].mean())

    html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>스마트 팩토리 공정 분석 보고서</title>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{ font-family: 'Segoe UI', Arial, sans-serif; background: #f5f6fa; color: #2c3e50; }}
    .header {{ background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
               color: white; padding: 40px; text-align: center; }}
    .header h1 {{ font-size: 2rem; margin-bottom: 8px; }}
    .header p  {{ opacity: 0.85; font-size: 1rem; }}
    .container {{ max-width: 1100px; margin: 0 auto; padding: 30px 20px; }}
    .kpi-grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }}
    .kpi-card {{ background: white; border-radius: 12px; padding: 20px;
                 text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,.08); }}
    .kpi-card .value {{ font-size: 2rem; font-weight: 700; color: #3498db; }}
    .kpi-card .label {{ font-size: 0.85rem; color: #7f8c8d; margin-top: 4px; }}
    .section {{ background: white; border-radius: 12px; padding: 28px;
                margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,.08); }}
    .section h2 {{ font-size: 1.2rem; border-left: 4px solid #3498db;
                   padding-left: 12px; margin-bottom: 20px; color: #2c3e50; }}
    .report-table {{ width: 100%; border-collapse: collapse; font-size: 0.9rem; }}
    .report-table th {{ background: #3498db; color: white; padding: 10px 14px;
                        text-align: left; font-weight: 600; }}
    .report-table td {{ padding: 9px 14px; border-bottom: 1px solid #ecf0f1; }}
    .report-table tr:hover td {{ background: #f8f9fa; }}
    .footer {{ text-align: center; padding: 20px; color: #7f8c8d; font-size: 0.85rem; }}
    @media print {{ .section {{ break-inside: avoid; }} }}
  </style>
</head>
<body>
  <div class="header">
    <h1>🏭 스마트 팩토리 공정 분석 보고서</h1>
    <p>생성 일시: {now_str} &nbsp;|&nbsp; 분석 설비: {', '.join(selected_eq)}</p>
  </div>

  <div class="container">
    <div class="kpi-grid">
      <div class="kpi-card"><div class="value">{avg_yield:.1f}%</div><div class="label">평균 수율</div></div>
      <div class="kpi-card"><div class="value">{anomaly_count}건</div><div class="label">이상 감지 수</div></div>
      <div class="kpi-card"><div class="value">{anomaly_rate:.1f}%</div><div class="label">이상 비율</div></div>
      <div class="kpi-card"><div class="value">{len(df_f):,}</div><div class="label">분석 데이터 수</div></div>
    </div>

    <div class="section">
      <h2>수율 추이</h2>
      {yield_chart_html}
    </div>

    <div class="section">
      <h2>센서별 이상 요약</h2>
      {anomaly_html}
    </div>

    <div class="section">
      <h2>공정 능력 지수 (Cp / Cpk)</h2>
      {cp_html}
    </div>

    <div class="section">
      <h2>기초 통계량</h2>
      {stats_html}
    </div>
  </div>

  <div class="footer">
    본 보고서는 스마트 팩토리 AI 모니터링 시스템에 의해 자동 생성되었습니다.
    실제 의사결정에 앞서 엔지니어링 팀의 검토를 거치시기 바랍니다.
  </div>
</body>
</html>"""
    return html


# ── 다운로드 버튼 ─────────────────────────────────────────────────
st.divider()
st.subheader("보고서 다운로드")

col_a, col_b = st.columns(2)
with col_a:
    if st.button("🛠️ HTML 보고서 생성", type="primary"):
        with st.spinner("보고서 생성 중..."):
            import time; time.sleep(1)
            html = build_html_report()
            st.session_state["html_report"] = html
        st.success("보고서 생성 완료!")

if "html_report" in st.session_state:
    filename = f"공정_분석_보고서_{datetime.now().strftime('%Y%m%d_%H%M')}.html"
    st.download_button(
        label="⬇️ HTML 보고서 다운로드",
        data=st.session_state["html_report"].encode("utf-8"),
        file_name=filename,
        mime="text/html",
        type="secondary",
    )
    with st.expander("HTML 미리보기"):
        st.components.v1.html(st.session_state["html_report"], height=400, scrolling=True)
