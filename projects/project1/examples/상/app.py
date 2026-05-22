import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime

# Set page configuration
st.set_page_config(
    page_title="CVD Thin-Film Wafer Map R&D Dashboard",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Premium dark theme styles
st.markdown("""
<style>
    .reportview-container {
        background: #0f172a;
    }
    .main-header {
        font-size: 2.2rem;
        font-weight: 800;
        color: #f8fafc;
        margin-bottom: 0.5rem;
    }
    .sub-header {
        font-size: 1.1rem;
        color: #94a3b8;
        margin-bottom: 2rem;
    }
    .metric-card {
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 1.25rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
</style>
""", unsafe_allow_html=True)

st.markdown('<div class="main-header">📊 CVD 박막 두께 Wafer Map R&D 분석기 (고급형 모범답안)</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">엘립소메터 계측 데이터를 활용한 CVD 설비 매칭 분석 및 웨이퍼 불량 프로파일 시각화 플랫폼</div>', unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 1. SIDEBAR CONTROL PANEL
# -----------------------------------------------------------------------------
st.sidebar.header("🛠️ 데이터 가공 컨트롤 타워")

# File Uploader for Multi-File Reproducibility
uploaded_file = st.sidebar.file_uploader(
    "1. CSV 데이터셋 업로드 (siox_thickness_data_1.csv 또는 siox_thickness_data_2.csv)", 
    type=["csv"]
)

# Outlier options
st.sidebar.markdown("---")
st.sidebar.subheader("🧼 데이터 정제 설정")
filter_outliers = st.sidebar.checkbox("극단 이상치 필터링 활성화", value=True)
impute_nans = st.sidebar.selectbox(
    "결측치(NaN) 처리 방식", 
    options=["평균값 보간 (Wafer Mean)", "결측값 제거 (Drop)", "처리 안 함 (Keep NaNs)"]
)

# -----------------------------------------------------------------------------
# 2. DATA LOADING & PREPROCESSING
# -----------------------------------------------------------------------------
@st.cache_data
def load_data(file_obj):
    if file_obj is not None:
        return pd.read_csv(file_obj)
    # Default fallback path
    try:
        return pd.read_csv("d:/python/2026_letuin/Letuin_AI_Lecture/project_01/public/data/siox_thickness_data_1.csv")
    except:
        return pd.read_csv("project_01/public/data/siox_thickness_data_1.csv")

raw_df = load_data(uploaded_file)
df = raw_df.copy()

# Preprocessing implementation
total_rows = len(df)
nan_count = df['thickness_value'].isna().sum()

# Outlier criteria definition (aligned with manufacturing spec)
outlier_mask = (
    (df['thickness_value'] < 50) | 
    (df['thickness_value'] > 180) | 
    df['thickness_value'].isin([-999.0, 999.9, 0.0, 250.3])
)
outlier_count = df[outlier_mask]['thickness_value'].count()

# Clean outliers if selected
if filter_outliers:
    df.loc[outlier_mask, 'thickness_value'] = np.nan

# Handle NaNs based on selection
cleaned_rows_count = len(df)
if impute_nans == "평균값 보간 (Wafer Mean)":
    # Group by lot_id and fill NaNs with lot average
    df['thickness_value'] = df.groupby('lot_id')['thickness_value'].transform(
        lambda x: x.fillna(x.mean())
    )
elif impute_nans == "결측값 제거 (Drop)":
    df = df.dropna(subset=['thickness_value'])

# Calculate active stats
cleaned_nan_count = df['thickness_value'].isna().sum()

# -----------------------------------------------------------------------------
# 3. METRICS PANEL
# -----------------------------------------------------------------------------
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.markdown('<div class="metric-card">', unsafe_allow_html=True)
    st.metric("총 로우 수", f"{total_rows} 행")
    st.markdown('</div>', unsafe_allow_html=True)

with col2:
    st.markdown('<div class="metric-card">', unsafe_allow_html=True)
    st.metric("결측치(NaN)", f"{nan_count} 개", f"{nan_count/total_rows*100:.1f}%")
    st.markdown('</div>', unsafe_allow_html=True)

with col3:
    st.markdown('<div class="metric-card">', unsafe_allow_html=True)
    st.metric("극단 아웃라이어", f"{outlier_count} 개", f"{outlier_count/total_rows*100:.1f}%", delta_color="inverse")
    st.markdown('</div>', unsafe_allow_html=True)

with col4:
    st.markdown('<div class="metric-card">', unsafe_allow_html=True)
    st.metric("유효 생산 Lot", f"{df['lot_id'].nunique()} Lots")
    st.markdown('</div>', unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 4. LOT-LEVEL UNIFORMITY COMPUTATION
# -----------------------------------------------------------------------------
# Uniformity = (Max - Min) / (2 * Mean) * 100
lot_summary = df.groupby(['lot_id', 'cvd_machine', 'meas_time']).agg(
    min_thick=('thickness_value', 'min'),
    max_thick=('thickness_value', 'max'),
    mean_thick=('thickness_value', 'mean'),
    std_thick=('thickness_value', 'std')
).reset_index()

lot_summary['uniformity'] = (
    (lot_summary['max_thick'] - lot_summary['min_thick']) / 
    (2 * lot_summary['mean_thick']) * 100
)

# -----------------------------------------------------------------------------
# 5. DASHBOARD LAYOUT (2 TABS: SUMMARY & SPATIAL DETAIL)
# -----------------------------------------------------------------------------
tab1, tab2 = st.tabs(["📈 공정 수율 및 설비 매칭 경향성", "🎯 웨이퍼 2D 두께 분포도 (Wafer Map)"])

with tab1:
    st.subheader("CVD 설비별 두께 및 Uniformity 트렌드 차트")
    
    # 1. Timeline trend chart
    fig_trend = px.scatter(
        lot_summary,
        x="meas_time",
        y="uniformity",
        color="cvd_machine",
        size="uniformity",
        hover_data=["lot_id", "mean_thick", "min_thick", "max_thick"],
        title="시간별 Wafer Uniformity (%) 변화 추이 (클릭 시 설비 필터링)",
        labels={"meas_time": "계측 시간", "uniformity": "Uniformity (%)", "cvd_machine": "CVD 설비"},
        color_discrete_map={"CVD_M01": "#a78bfa", "CVD_M02": "#fb923c", "CVD_M03": "#38bdf8"}
    )
    fig_trend.add_hline(y=3.0, line_dash="dash", line_color="#10b981", annotation_text="양산 관리 합격 기준 (3.0%)")
    fig_trend.add_hline(y=8.0, line_dash="dash", line_color="#ef4444", annotation_text="긴급 챔버 점검 경고선 (8.0%)")
    fig_trend.update_layout(template="plotly_dark", height=450)
    st.plotly_chart(fig_trend, use_container_width=True)
    
    # Worst Lots and Alarms
    st.markdown("### ⚠️ 양산 스펙 위반 이상 Lot 리스트")
    worst_lots = lot_summary[lot_summary['uniformity'] >= 3.0].sort_values(by="uniformity", ascending=False)
    
    if len(worst_lots) > 0:
        st.error(f"총 {len(worst_lots)}개의 Lot이 관리 합격선(3.0%)을 초과하였습니다. 긴급 점검이 필요합니다.")
        
        # Display table with red alerts
        col_table, col_diag = st.columns([3, 2])
        with col_table:
            st.dataframe(
                worst_lots.style.format({
                    "min_thick": "{:.2f}nm",
                    "max_thick": "{:.2f}nm",
                    "mean_thick": "{:.2f}nm",
                    "std_thick": "{:.2f}nm",
                    "uniformity": "{:.2f}%"
                }),
                use_container_width=True
            )
        with col_diag:
            st.info("💡 **엔지니어 자동 공정 이상 판단**\n\n"
                    f"가장 비정상적인 거동을 보인 설비는 **{worst_lots.iloc[0]['cvd_machine']}** 입니다.\n\n"
                    f"해당 설비는 **{worst_lots.iloc[0]['meas_time']}** 시간대부터 박막 균일도가 "
                    f"**{worst_lots.iloc[0]['uniformity']:.2f}%**로 치솟았습니다. "
                    "해당 챔버의 히터 서셉터 온도 교정 및 기화 가스 노즐(Nozzle Clog) 상태를 긴급 진단하십시오.")
    else:
        st.success("🎉 모든 Wafer Lot의 Uniformity가 정상 규격(3.0% 이하) 이내에서 관리되고 있습니다.")

with tab2:
    st.subheader("특정 Lot 웨이퍼 2D 물리 맵핑")
    
    # Lot Selectbox
    selected_lot = st.selectbox("시각화할 Wafer Lot 선택", options=lot_summary['lot_id'].unique())
    lot_data = df[df['lot_id'] == selected_lot].copy()
    
    # Display lot stats
    lot_info = lot_summary[lot_summary['lot_id'] == selected_lot].iloc[0]
    
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("해당 Lot 가공 설비", lot_info['cvd_machine'])
    c2.metric("평균 두께", f"{lot_info['mean_thick']:.2f} nm")
    c3.metric("두께 산포 (Range)", f"{lot_info['max_thick']-lot_info['min_thick']:.2f} nm")
    
    uniformity_color = "normal"
    if lot_info['uniformity'] > 8.0: uniformity_color = "inverse"
    elif lot_info['uniformity'] > 3.0: uniformity_color = "off"
    c4.metric("Uniformity (%)", f"{lot_info['uniformity']:.2f}%", delta_color=uniformity_color)
    
    # Wafer Map drawing
    # Add a notched circle to represent 300mm wafer boundary
    wafer_radius = 150 # mm
    theta = np.linspace(0, 2*np.pi, 200)
    wafer_x = wafer_radius * np.cos(theta)
    wafer_y = wafer_radius * np.sin(theta)
    
    # Create interactive plotly wafer plot
    fig_wafer = go.Figure()
    
    # 1. Wafer circle border
    fig_wafer.add_trace(go.Scatter(
        x=wafer_x, y=wafer_y,
        mode='lines',
        line=dict(color='rgba(255, 255, 255, 0.4)', width=2),
        showlegend=False,
        hoverinfo='skip'
    ))
    
    # 2. The Wafer Notch (at bottom x=0, y=-150)
    notch_size = 5
    fig_wafer.add_trace(go.Scatter(
        x=[-notch_size, 0, notch_size],
        y=[-wafer_radius + notch_size, -wafer_radius - notch_size, -wafer_radius + notch_size],
        mode='lines',
        line=dict(color='rgba(255, 255, 255, 0.4)', width=2),
        fill='toself',
        showlegend=False,
        hoverinfo='skip'
    ))
    
    # 3. Silicon thickness measurement nodes
    # Let's map HSL equivalent color palette cyan-to-red
    fig_wafer.add_trace(go.Scatter(
        x=lot_data['position_x'],
        y=lot_data['position_y'],
        mode='markers',
        marker=dict(
            size=22,
            color=lot_data['thickness_value'],
            colorscale='RdBu_r', # Red is high thickness, Blue is low thickness
            showscale=True,
            colorbar=dict(title="Thickness (nm)"),
            cmin=90.0,
            cmax=118.0
        ),
        text=lot_data['thickness_value'].apply(lambda x: f"두께: {x:.2f}nm" if not pd.isna(x) else "결측치 (NaN)"),
        hoverinfo='text+x+y'
    ))
    
    # Adjust layout
    fig_wafer.update_layout(
        title=f"{selected_lot} Wafer Thickness 2D Spatial Map (300mm Concentric Layout)",
        template="plotly_dark",
        width=600,
        height=600,
        xaxis=dict(range=[-170, 170], showgrid=False, zeroline=False),
        yaxis=dict(range=[-170, 170], showgrid=False, zeroline=False),
        yaxis_scaleanchor="x"
    )
    
    col_map, col_rad = st.columns([1, 1])
    with col_map:
        st.plotly_chart(fig_wafer, use_container_width=True)
    with col_rad:
        st.markdown("### 🔍 반경별 두께 분포 프로파일 (Radial Profile)")
        lot_data['radius'] = np.sqrt(lot_data['position_x']**2 + lot_data['position_y']**2)
        lot_data['ring'] = lot_data['radius'].round(0)
        ring_profile = lot_data.groupby('ring')['thickness_value'].mean().reset_index()
        
        # Draw radial profile chart
        fig_rad = px.line(
            ring_profile,
            x="ring",
            y="thickness_value",
            markers=True,
            title="웨이퍼 중심부로부터의 거리(Radius)에 따른 평균 두께 추이",
            labels={"ring": "중심부 거리 (mm)", "thickness_value": "평균 두께 (nm)"}
        )
        fig_rad.update_layout(template="plotly_dark", height=380)
        st.plotly_chart(fig_rad, use_container_width=True)
        
        # Diagnosis explanation
        st.markdown("#### 💡 웨이퍼 공간적 거동 판정 결과")
        if lot_info['uniformity'] < 3.0:
            st.success("✅ **정상 (Normal profile):** 두께가 웨이퍼 중심 및 가장자리에서 모두 오차범위 내 균일하게 관리되고 있습니다.")
        else:
            center_val = ring_profile[ring_profile['ring'] == 0]['thickness_value'].values[0]
            edge_val = ring_profile[ring_profile['ring'] > 140]['thickness_value'].values[0]
            
            if edge_val > center_val:
                st.warning("⚠️ **Edge-High (오목형 불량) 검출:** 웨이퍼 중심부보다 최외곽 반경 145mm 부근의 박막이 비정상적으로 두껍게 증착되었습니다. PECVD의 가스 공급관 샤워헤드의 외곽 가스 유량 과잉 혹은 에지 링(Edge Ring) 열화가 의심됩니다.")
            else:
                st.warning("⚠️ **Center-High (돔형/볼록형 불량) 검출:** 웨이퍼 가장자리보다 중심부(0-30mm) 부근의 박막이 과도하게 증착되었습니다. 공정 반응 가스의 중심부 분사 집중 현상 또는 서셉터 히터(Heater core)의 불균일 가열 상태를 점검하십시오.")

# -----------------------------------------------------------------------------
# 6. REPORT EXPORT
# -----------------------------------------------------------------------------
st.sidebar.markdown("---")
st.sidebar.subheader("📥 R&D 공정 진단서 다운로드")
report_md = f"""# 반도체 CVD 박막 두께 R&D 공정분석 진단서
*   **분석 일시**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
*   **분석 Lot 수**: {df['lot_id'].nunique()} Lots
*   **스펙 위반 비정상 Lot 수**: {len(worst_lots)} Lots

## 1. 종합 진단 요약
{"모든 Lot가 정상 범위 이내에서 안전하게 생산되고 있습니다." if len(worst_lots) == 0 else f"CVD 설비 균일도 관리선(3.0%)을 초과하는 중대한 불량이 총 {len(worst_lots)}건 확인되었습니다. 최악의 불량을 일으킨 CVD 설비는 **{worst_lots.iloc[0]['cvd_machine']}** 입니다."}

## 2. 이상 발생 Lot 세부 이력
{worst_lots.to_markdown(index=False) if len(worst_lots) > 0 else "해당 사항 없음"}
"""
st.sidebar.download_button(
    label="📄 분석 리포트(Markdown) 다운로드",
    data=report_md,
    file_name="CVD_Wafer_Map_Diagnosis_Report.md",
    mime="text/markdown"
)
