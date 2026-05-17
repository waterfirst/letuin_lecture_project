import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from scipy import stats
from datetime import datetime
import io

# Page config
st.set_page_config(
    page_title="🏭 스마트 공정 분석 시스템",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Color scheme
COLORS = {
    'primary': '#1f77b4',
    'secondary': '#ff7f0e',
    'success': '#2ca02c',
    'danger': '#d62728',
    'warning': '#ff9896',
    'info': '#17becf'
}

# Title
st.title("🏭 스마트 공정 분석 시스템")
st.markdown("---")

# Session state initialization
if 'df' not in st.session_state:
    st.session_state.df = None

# Sidebar configuration
st.sidebar.header("⚙️ 설정")

# File upload
uploaded_file = st.sidebar.file_uploader("📁 CSV 파일 업로드", type=['csv'])

if uploaded_file is not None:
    st.session_state.df = pd.read_csv(uploaded_file)
    st.sidebar.success("✅ 파일 로드 완료")

# Column selection
if st.session_state.df is not None:
    numeric_cols = st.session_state.df.select_dtypes(include=[np.number]).columns.tolist()
    selected_column = st.sidebar.selectbox("📊 분석 컬럼 선택", numeric_cols)

    # Line filter
    filter_value = st.sidebar.slider(
        "🎯 값 범위 필터",
        float(st.session_state.df[selected_column].min()),
        float(st.session_state.df[selected_column].max()),
        (float(st.session_state.df[selected_column].min()),
         float(st.session_state.df[selected_column].max()))
    )

    # Date range filter (if date column exists)
    date_columns = st.session_state.df.select_dtypes(include=['datetime64']).columns.tolist()
    if date_columns:
        date_col = st.sidebar.selectbox("📅 날짜 컬럼 선택", date_columns)
        st.session_state.df[date_col] = pd.to_datetime(st.session_state.df[date_col])
        date_range = st.sidebar.date_input(
            "📆 날짜 범위",
            value=(st.session_state.df[date_col].min().date(),
                   st.session_state.df[date_col].max().date()),
            key="date_range"
        )
        # Filter dataframe
        mask_date = (st.session_state.df[date_col].dt.date >= date_range[0]) & \
                    (st.session_state.df[date_col].dt.date <= date_range[1])
        df = st.session_state.df[mask_date]
    else:
        df = st.session_state.df.copy()

    # Apply value filter
    df = df[(df[selected_column] >= filter_value[0]) & (df[selected_column] <= filter_value[1])]

    # Tab layout
    tab1, tab2, tab3, tab4 = st.tabs(["📊 개요", "🔍 이상 감지", "📈 SPC 관리도", "📋 리포트"])

    # TAB 1: 개요
    with tab1:
        st.header("📊 데이터 개요")

        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("📈 평균", f"{df[selected_column].mean():.2f}")
        with col2:
            st.metric("🎯 중앙값", f"{df[selected_column].median():.2f}")
        with col3:
            st.metric("📊 표준편차", f"{df[selected_column].std():.2f}")
        with col4:
            st.metric("📌 샘플 수", len(df))

        st.divider()

        # Basic stats table
        st.subheader("📋 기본 통계")
        stats_table = pd.DataFrame({
            '통계량': ['최솟값', '25 백분위수', '중앙값', '75 백분위수', '최댓값', '평균', '표준편차', '분산'],
            '값': [
                df[selected_column].min(),
                df[selected_column].quantile(0.25),
                df[selected_column].median(),
                df[selected_column].quantile(0.75),
                df[selected_column].max(),
                df[selected_column].mean(),
                df[selected_column].std(),
                df[selected_column].var()
            ]
        })
        st.dataframe(stats_table, use_container_width=True)

        st.divider()

        # Visualizations
        col1, col2 = st.columns(2)

        # Histogram
        with col1:
            st.subheader("📊 히스토그램")
            fig_hist = go.Figure()
            fig_hist.add_trace(go.Histogram(
                x=df[selected_column],
                nbinsx=30,
                marker_color=COLORS['primary'],
                name=selected_column
            ))
            fig_hist.update_layout(
                title=f"{selected_column} 분포",
                xaxis_title=selected_column,
                yaxis_title="빈도",
                hovermode='x unified',
                plot_bgcolor='rgba(240,240,240,0.5)',
                paper_bgcolor='white'
            )
            st.plotly_chart(fig_hist, use_container_width=True)

        # Box Plot
        with col2:
            st.subheader("📦 박스플롯")
            fig_box = go.Figure()
            fig_box.add_trace(go.Box(
                y=df[selected_column],
                name=selected_column,
                marker_color=COLORS['secondary'],
                boxmean='sd'
            ))
            fig_box.update_layout(
                title=f"{selected_column} 박스플롯",
                yaxis_title=selected_column,
                hovermode='y unified',
                plot_bgcolor='rgba(240,240,240,0.5)',
                paper_bgcolor='white'
            )
            st.plotly_chart(fig_box, use_container_width=True)

        # Correlation heatmap (if multiple numeric columns)
        if len(numeric_cols) > 1:
            st.subheader("🔥 상관계수 히트맵")
            corr_matrix = df[numeric_cols].corr()
            fig_heatmap = go.Figure(data=go.Heatmap(
                z=corr_matrix.values,
                x=corr_matrix.columns,
                y=corr_matrix.columns,
                colorscale='RdBu',
                zmid=0,
                zmin=-1,
                zmax=1,
                text=corr_matrix.values,
                texttemplate='%{text:.2f}',
                textfont={"size": 10},
                colorbar=dict(title="상관계수")
            ))
            fig_heatmap.update_layout(
                title="수치형 변수 상관계수 분석",
                width=800,
                height=700,
                plot_bgcolor='white',
                paper_bgcolor='white'
            )
            st.plotly_chart(fig_heatmap, use_container_width=True)

    # TAB 2: 이상 감지
    with tab2:
        st.header("🔍 이상값 감지 분석")

        # IQR Method
        st.subheader("📌 IQR 방식 이상값 감지")
        Q1 = df[selected_column].quantile(0.25)
        Q3 = df[selected_column].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR

        outliers_iqr = df[(df[selected_column] < lower_bound) | (df[selected_column] > upper_bound)]

        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("🎯 IQR", f"{IQR:.2f}")
        with col2:
            st.metric("⬇️ 하한값", f"{lower_bound:.2f}")
        with col3:
            st.metric("⬆️ 상한값", f"{upper_bound:.2f}")

        st.write(f"**검출된 이상값: {len(outliers_iqr)}개** ({len(outliers_iqr)/len(df)*100:.1f}%)")

        # Z-Score Method
        st.subheader("📌 Z-Score 방식 이상값 감지")
        z_scores = np.abs(stats.zscore(df[selected_column]))
        threshold = 3
        outliers_zscore = df[z_scores > threshold]

        col1, col2 = st.columns(2)
        with col1:
            st.metric("📊 Z-Score 임계값", threshold)
        with col2:
            st.metric("🚨 검출된 이상값", f"{len(outliers_zscore)}개")

        st.divider()

        # Scatter plot with outliers highlighted (IQR)
        col1, col2 = st.columns(2)

        with col1:
            st.subheader("📍 IQR 방식 산점도")
            df_plot = df.copy()
            df_plot['outlier'] = (df_plot[selected_column] < lower_bound) | (df_plot[selected_column] > upper_bound)

            fig_scatter1 = px.scatter(
                df_plot,
                y=selected_column,
                color='outlier',
                color_discrete_map={True: COLORS['danger'], False: COLORS['primary']},
                labels={'outlier': '이상값'},
                hover_data={'outlier': False}
            )
            fig_scatter1.add_hline(y=lower_bound, line_dash="dash", line_color=COLORS['warning'],
                                   annotation_text="하한값")
            fig_scatter1.add_hline(y=upper_bound, line_dash="dash", line_color=COLORS['warning'],
                                   annotation_text="상한값")
            fig_scatter1.update_layout(
                title=f"{selected_column} - IQR 이상값 감지",
                yaxis_title=selected_column,
                xaxis_title="인덱스",
                hovermode='closest',
                plot_bgcolor='rgba(240,240,240,0.5)',
                paper_bgcolor='white'
            )
            st.plotly_chart(fig_scatter1, use_container_width=True)

        with col2:
            st.subheader("📍 Z-Score 방식 산점도")
            df_plot['outlier_z'] = z_scores > threshold

            fig_scatter2 = px.scatter(
                df_plot,
                y=selected_column,
                color='outlier_z',
                color_discrete_map={True: COLORS['danger'], False: COLORS['primary']},
                labels={'outlier_z': '이상값'},
                hover_data={'outlier_z': False}
            )
            fig_scatter2.update_layout(
                title=f"{selected_column} - Z-Score 이상값 감지",
                yaxis_title=selected_column,
                xaxis_title="인덱스",
                hovermode='closest',
                plot_bgcolor='rgba(240,240,240,0.5)',
                paper_bgcolor='white'
            )
            st.plotly_chart(fig_scatter2, use_container_width=True)

        st.divider()

        # Outlier summary
        st.subheader("📊 이상값 요약 테이블")

        outlier_comparison = pd.DataFrame({
            '감지 방식': ['IQR', 'Z-Score'],
            '이상값 개수': [len(outliers_iqr), len(outliers_zscore)],
            '비율(%)': [f"{len(outliers_iqr)/len(df)*100:.1f}%",
                       f"{len(outliers_zscore)/len(df)*100:.1f}%"],
            '최소값': [outliers_iqr[selected_column].min() if len(outliers_iqr) > 0 else 'N/A',
                      outliers_zscore[selected_column].min() if len(outliers_zscore) > 0 else 'N/A'],
            '최대값': [outliers_iqr[selected_column].max() if len(outliers_iqr) > 0 else 'N/A',
                      outliers_zscore[selected_column].max() if len(outliers_zscore) > 0 else 'N/A']
        })
        st.dataframe(outlier_comparison, use_container_width=True)

        # Show outlier data
        with st.expander("🔎 이상값 데이터 상세 보기 (IQR)"):
            if len(outliers_iqr) > 0:
                st.dataframe(outliers_iqr, use_container_width=True)
            else:
                st.info("이상값이 없습니다.")

    # TAB 3: SPC 관리도
    with tab3:
        st.header("📈 SPC(통계적 공정 관리) 제어도")

        st.subheader("⚙️ 제어도 설정")

        col1, col2 = st.columns(2)
        with col1:
            subgroup_size = st.number_input(
                "소그룹 크기 (subgroup size)",
                min_value=2,
                max_value=len(df)//2,
                value=5,
                step=1
            )

        with col2:
            confidence_level = st.selectbox(
                "신뢰도 수준",
                options=[0.95, 0.99],
                format_func=lambda x: f"{int(x*100)}%"
            )

        # Calculate control limits
        n_subgroups = len(df) // subgroup_size

        # Create subgroups
        subgroup_means = []
        subgroup_ranges = []

        for i in range(n_subgroups):
            subgroup = df[selected_column].iloc[i*subgroup_size:(i+1)*subgroup_size]
            subgroup_means.append(subgroup.mean())
            subgroup_ranges.append(subgroup.max() - subgroup.min())

        # Constants for control charts (standard values)
        d2_dict = {2: 1.128, 3: 1.693, 4: 2.059, 5: 2.326, 6: 2.534}
        d2 = d2_dict.get(subgroup_size, 2.326)

        mean_of_means = np.mean(subgroup_means)
        mean_of_ranges = np.mean(subgroup_ranges)

        # X-bar chart limits
        A2_dict = {2: 1.880, 3: 1.023, 4: 0.729, 5: 0.577, 6: 0.483}
        A2 = A2_dict.get(subgroup_size, 0.577)

        UCL_xbar = mean_of_means + A2 * mean_of_ranges
        LCL_xbar = mean_of_means - A2 * mean_of_ranges
        CL = mean_of_means

        # Display limits
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("📈 UCL (상한선)", f"{UCL_xbar:.2f}")
        with col2:
            st.metric("📊 CL (중심선)", f"{CL:.2f}")
        with col3:
            st.metric("📉 LCL (하한선)", f"{LCL_xbar:.2f}")
        with col4:
            st.metric("📌 제어 범위", f"{UCL_xbar - LCL_xbar:.2f}")

        st.divider()

        # X-bar control chart
        st.subheader("📈 X-bar 제어도")

        fig_xbar = go.Figure()

        # Add the mean line
        fig_xbar.add_trace(go.Scatter(
            y=subgroup_means,
            mode='lines+markers',
            name='소그룹 평균',
            line=dict(color=COLORS['primary'], width=2),
            marker=dict(size=6)
        ))

        # Add control limits
        fig_xbar.add_hline(y=UCL_xbar, line_dash="dash", line_color=COLORS['danger'],
                          annotation_text=f"UCL: {UCL_xbar:.2f}",
                          annotation_position="right")
        fig_xbar.add_hline(y=CL, line_dash="solid", line_color=COLORS['success'],
                          annotation_text=f"CL: {CL:.2f}",
                          annotation_position="right")
        fig_xbar.add_hline(y=LCL_xbar, line_dash="dash", line_color=COLORS['danger'],
                          annotation_text=f"LCL: {LCL_xbar:.2f}",
                          annotation_position="right")

        # Highlight out-of-control points
        out_of_control = []
        for i, mean in enumerate(subgroup_means):
            if mean > UCL_xbar or mean < LCL_xbar:
                out_of_control.append(i)

        if out_of_control:
            fig_xbar.add_trace(go.Scatter(
                x=out_of_control,
                y=[subgroup_means[i] for i in out_of_control],
                mode='markers',
                name='이상 신호',
                marker=dict(size=12, color=COLORS['danger'], symbol='x')
            ))

        fig_xbar.update_layout(
            title=f"X-bar 제어도 (소그룹 크기: {subgroup_size})",
            xaxis_title="소그룹 번호",
            yaxis_title=f"{selected_column} 평균",
            hovermode='x unified',
            plot_bgcolor='rgba(240,240,240,0.5)',
            paper_bgcolor='white'
        )

        st.plotly_chart(fig_xbar, use_container_width=True)

        # R (Range) control chart
        st.subheader("📊 R(범위) 제어도")

        D3_dict = {2: 0, 3: 0, 4: 0, 5: 0, 6: 0}
        D4_dict = {2: 3.267, 3: 2.575, 4: 2.282, 5: 2.114, 6: 2.004}

        D3 = D3_dict.get(subgroup_size, 0)
        D4 = D4_dict.get(subgroup_size, 2.114)

        UCL_r = D4 * mean_of_ranges
        CL_r = mean_of_ranges
        LCL_r = D3 * mean_of_ranges

        fig_r = go.Figure()

        fig_r.add_trace(go.Scatter(
            y=subgroup_ranges,
            mode='lines+markers',
            name='범위',
            line=dict(color=COLORS['secondary'], width=2),
            marker=dict(size=6)
        ))

        fig_r.add_hline(y=UCL_r, line_dash="dash", line_color=COLORS['danger'],
                       annotation_text=f"UCL: {UCL_r:.2f}",
                       annotation_position="right")
        fig_r.add_hline(y=CL_r, line_dash="solid", line_color=COLORS['success'],
                       annotation_text=f"CL: {CL_r:.2f}",
                       annotation_position="right")
        fig_r.add_hline(y=LCL_r, line_dash="dash", line_color=COLORS['danger'],
                       annotation_text=f"LCL: {LCL_r:.2f}",
                       annotation_position="right")

        fig_r.update_layout(
            title=f"R 제어도 (소그룹 크기: {subgroup_size})",
            xaxis_title="소그룹 번호",
            yaxis_title="범위 (R)",
            hovermode='x unified',
            plot_bgcolor='rgba(240,240,240,0.5)',
            paper_bgcolor='white'
        )

        st.plotly_chart(fig_r, use_container_width=True)

        # Control chart summary
        st.subheader("📋 제어도 분석 요약")
        col1, col2 = st.columns(2)

        with col1:
            st.write("**X-bar 제어도 분석**")
            out_of_control_count = len(out_of_control)
            st.write(f"- 소그룹 개수: {n_subgroups}")
            st.write(f"- 이상 신호: {out_of_control_count}개")
            st.write(f"- 공정 상태: {'🔴 이상' if out_of_control_count > 0 else '🟢 정상'}")

        with col2:
            st.write("**R 제어도 분석**")
            r_out_of_control = sum(1 for r in subgroup_ranges if r > UCL_r or r < LCL_r)
            st.write(f"- 평균 범위: {mean_of_ranges:.2f}")
            st.write(f"- 범위 이상: {r_out_of_control}개")
            st.write(f"- 공정 변동성: {'🔴 높음' if mean_of_ranges > (UCL_xbar - LCL_xbar)/6 else '🟢 정상'}")

    # TAB 4: 리포트
    with tab4:
        st.header("📋 자동 생성 분석 리포트")

        # Generate report
        Q1 = df[selected_column].quantile(0.25)
        Q3 = df[selected_column].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        outliers_iqr = df[(df[selected_column] < lower_bound) | (df[selected_column] > upper_bound)]

        z_scores = np.abs(stats.zscore(df[selected_column]))
        outliers_zscore = df[z_scores > 3]

        report = f"""# 🏭 스마트 공정 분석 시스템 리포트

## 📊 분석 개요
- **분석 대상 컬럼**: {selected_column}
- **분석 날짜**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
- **샘플 크기**: {len(df)}

## 📈 기본 통계

| 통계량 | 값 |
|-------|-----|
| 최솟값 | {df[selected_column].min():.2f} |
| 25 백분위수 | {df[selected_column].quantile(0.25):.2f} |
| 중앙값 | {df[selected_column].median():.2f} |
| 75 백분위수 | {df[selected_column].quantile(0.75):.2f} |
| 최댓값 | {df[selected_column].max():.2f} |
| **평균** | **{df[selected_column].mean():.2f}** |
| **표준편차** | **{df[selected_column].std():.2f}** |
| **분산** | **{df[selected_column].var():.2f}** |

## 🔍 이상값 분석

### IQR 방식
- **IQR (사분위수 범위)**: {IQR:.2f}
- **하한값 (LB)**: {lower_bound:.2f}
- **상한값 (UB)**: {upper_bound:.2f}
- **검출된 이상값**: {len(outliers_iqr)}개 ({len(outliers_iqr)/len(df)*100:.1f}%)

### Z-Score 방식
- **임계값**: 3σ
- **검출된 이상값**: {len(outliers_zscore)}개 ({len(outliers_zscore)/len(df)*100:.1f}%)

## 📊 이상값 범위

| 감지 방식 | 개수 | 비율 | 최솟값 | 최댓값 |
|---------|------|------|--------|--------|
| IQR | {len(outliers_iqr)} | {len(outliers_iqr)/len(df)*100:.1f}% | {outliers_iqr[selected_column].min() if len(outliers_iqr) > 0 else 'N/A'} | {outliers_iqr[selected_column].max() if len(outliers_iqr) > 0 else 'N/A'} |
| Z-Score | {len(outliers_zscore)} | {len(outliers_zscore)/len(df)*100:.1f}% | {outliers_zscore[selected_column].min() if len(outliers_zscore) > 0 else 'N/A'} | {outliers_zscore[selected_column].max() if len(outliers_zscore) > 0 else 'N/A'} |

## 📈 SPC 제어도 분석

### X-bar 제어도 (소그룹 크기: 5)
"""

        # Calculate SPC data
        subgroup_size = 5
        n_subgroups = len(df) // subgroup_size
        subgroup_means = []

        for i in range(n_subgroups):
            subgroup = df[selected_column].iloc[i*subgroup_size:(i+1)*subgroup_size]
            subgroup_means.append(subgroup.mean())

        A2 = 0.577
        mean_of_ranges = df[selected_column].rolling(subgroup_size).apply(lambda x: x.max() - x.min()).mean()
        mean_of_means = np.mean(subgroup_means)

        UCL_xbar = mean_of_means + A2 * mean_of_ranges
        LCL_xbar = mean_of_means - A2 * mean_of_ranges
        CL = mean_of_means

        out_of_control = sum(1 for mean in subgroup_means if mean > UCL_xbar or mean < LCL_xbar)

        report += f"""
- **중심선 (CL)**: {CL:.2f}
- **상한선 (UCL)**: {UCL_xbar:.2f}
- **하한선 (LCL)**: {LCL_xbar:.2f}
- **이상 신호**: {out_of_control}개
- **공정 상태**: {'⚠️ 이상 감지' if out_of_control > 0 else '✅ 정상'}

## 🎯 주요 발견사항

1. **데이터 분포**:
   - 데이터는 평균 {df[selected_column].mean():.2f}을 중심으로 표준편차 {df[selected_column].std():.2f}의 분포를 보입니다.
   - 분포의 대칭성과 산포도를 확인하시기 바랍니다.

2. **이상값 감지**:
   - IQR 방식으로 {len(outliers_iqr)}개의 이상값이 감지되었습니다.
   - 이는 전체 데이터의 {len(outliers_iqr)/len(df)*100:.1f}%에 해당합니다.

3. **공정 안정성**:
   - X-bar 제어도에서 {'이상 신호가 감지되었습니다. 공정 개선이 필요합니다.' if out_of_control > 0 else '이상 신호가 없으므로 공정이 안정적으로 관리되고 있습니다.'}

4. **권장사항**:
   - 이상값이 감지된 경우, 근본 원인을 분석하시기 바랍니다.
   - 정기적인 공정 모니터링을 통해 품질 관리를 강화하시기 바랍니다.

---

*본 리포트는 {datetime.now().strftime('%Y-%m-%d')}에 자동으로 생성되었습니다.*
"""

        # Display report
        st.markdown(report)

        st.divider()

        # Download button
        st.subheader("📥 리포트 다운로드")

        col1, col2 = st.columns(2)

        with col1:
            # Download as markdown
            md_bytes = report.encode('utf-8')
            st.download_button(
                label="📄 마크다운 형식 (MD)",
                data=md_bytes,
                file_name=f"공정분석리포트_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md",
                mime="text/markdown"
            )

        with col2:
            # Download as text
            txt_bytes = report.encode('utf-8')
            st.download_button(
                label="📝 텍스트 형식 (TXT)",
                data=txt_bytes,
                file_name=f"공정분석리포트_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt",
                mime="text/plain"
            )

else:
    st.info("👈 왼쪽 사이드바에서 CSV 파일을 업로드하여 시작하세요.")
    st.markdown("""
    ### 📊 사용 방법
    1. **파일 업로드**: CSV 파일을 업로드합니다
    2. **컬럼 선택**: 분석할 수치형 컬럼을 선택합니다
    3. **필터 설정**: 필요시 값 범위나 날짜를 필터링합니다
    4. **탭 확인**: 각 탭에서 상세 분석을 확인합니다

    ### 🎯 각 탭의 기능
    - **📊 개요**: 기본 통계, 히스토그램, 박스플롯, 상관계수
    - **🔍 이상 감지**: IQR/Z-Score 기반 이상값 감지
    - **📈 SPC 관리도**: X-bar 및 R 제어도
    - **📋 리포트**: 자동 생성된 분석 리포트 다운로드
    """)
