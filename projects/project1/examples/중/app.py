import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
from scipy import stats
from datetime import datetime, timedelta

# 페이지 설정
st.set_page_config(page_title="공정 데이터 분석", layout="wide", initial_sidebar_state="expanded")

st.title("🏭 공정 데이터 인터랙티브 분석기")
st.markdown("---")

# 세션 상태 초기화
if 'df' not in st.session_state:
    st.session_state.df = None
if 'df_filtered' not in st.session_state:
    st.session_state.df_filtered = None

# ============ 사이드바 설정 ============
with st.sidebar:
    st.header("⚙️ 설정")

    # CSV 파일 업로드
    uploaded_file = st.file_uploader(
        "CSV 파일 업로드",
        type=['csv'],
        help="분석할 공정 데이터 CSV 파일을 선택하세요"
    )

    if uploaded_file is not None:
        st.session_state.df = pd.read_csv(uploaded_file)
        st.success("파일 업로드 완료!")

# ============ 데이터 로드 확인 ============
if st.session_state.df is None:
    st.info("📥 사이드바에서 CSV 파일을 업로드하여 시작하세요.")
    st.stop()

df = st.session_state.df

# ============ 데이터 전처리 ============
# 날짜 열 자동 감지
date_columns = []
for col in df.columns:
    try:
        pd.to_datetime(df[col], errors='coerce')
        if df[col].dtype == 'object':
            date_columns.append(col)
    except:
        pass

# 숫자 열만 필터링
numeric_columns = df.select_dtypes(include=[np.number]).columns.tolist()

if not numeric_columns:
    st.error("숫자 데이터가 없습니다. 숫자 열이 포함된 CSV 파일을 업로드하세요.")
    st.stop()

# ============ 사이드바 필터 ============
with st.sidebar:
    st.divider()
    st.header("🔍 필터")

    # 분석할 열 선택
    selected_columns = st.multiselect(
        "분석 데이터 선택",
        numeric_columns,
        default=numeric_columns[:min(3, len(numeric_columns))],
        help="분석에 포함할 숫자 열을 선택하세요"
    )

    if not selected_columns:
        st.warning("최소 1개 이상의 열을 선택하세요.")
        st.stop()

    # 날짜 범위 필터 (있을 경우)
    if date_columns:
        st.subheader("📅 날짜 범위")
        date_col = st.selectbox("날짜 열 선택", date_columns)

        # 날짜 변환
        df[date_col] = pd.to_datetime(df[date_col], errors='coerce')
        min_date = df[date_col].min()
        max_date = df[date_col].max()

        date_range = st.date_input(
            "기간 선택",
            value=(min_date.date(), max_date.date()),
            min_value=min_date.date(),
            max_value=max_date.date()
        )

        if len(date_range) == 2:
            start_date, end_date = date_range
            df_filtered = df[
                (df[date_col].dt.date >= start_date) &
                (df[date_col].dt.date <= end_date)
            ].copy()
        else:
            df_filtered = df.copy()
    else:
        df_filtered = df.copy()

    st.session_state.df_filtered = df_filtered

    # 임계값 슬라이더 (이상치 탐지용)
    st.subheader("⚠️ 이상치 설정")
    sigma_threshold = st.slider(
        "표준편차 배수 선택",
        min_value=1.0,
        max_value=4.0,
        value=2.0,
        step=0.5,
        help="평균 ± N*σ 범위를 벗어난 값을 이상치로 표시"
    )

# ============ 기본 통계 섹션 ============
st.header("📊 기본 통계")

col1, col2, col3 = st.columns(3)
with col1:
    st.metric(label="총 데이터 행 수", value=f"{len(df_filtered):,}")
with col2:
    st.metric(label="선택된 열 개수", value=f"{len(selected_columns)}")
with col3:
    st.metric(label="필터링된 데이터 비율", value=f"{len(df_filtered)/len(df)*100:.1f}%")

# 통계표
with st.expander("📈 상세 통계표", expanded=True):
    stats_df = df_filtered[selected_columns].describe().T
    stats_df = stats_df.round(4)

    # 추가 통계
    additional_stats = pd.DataFrame({
        '변수계수(CV)': df_filtered[selected_columns].std() / df_filtered[selected_columns].mean(),
        '왜도': df_filtered[selected_columns].skew(),
        '첨도': df_filtered[selected_columns].kurtosis()
    }).round(4)

    stats_df = pd.concat([stats_df, additional_stats], axis=1)
    st.dataframe(stats_df, use_container_width=True)

# ============ 이상치 감지 함수 ============
def detect_outliers(data):
    """이상치 감지 (mean ± sigma_threshold * σ)"""
    mean = data.mean()
    std = data.std()
    lower_bound = mean - sigma_threshold * std
    upper_bound = mean + sigma_threshold * std
    return (data < lower_bound) | (data > upper_bound)

# ============ 차트 섹션 ============
st.header("📉 인터랙티브 차트")

# 탭 구성
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "📊 히스토그램",
    "📦 박스플롯",
    "🔍 산점도",
    "📈 시계열",
    "🔗 상관계수"
])

# ============ 탭 1: 히스토그램 ============
with tab1:
    st.subheader("히스토그램 분석")

    col1, col2 = st.columns([2, 1])
    with col1:
        selected_col_hist = st.selectbox(
            "분석할 열 선택",
            selected_columns,
            key="hist_col"
        )
    with col2:
        bins = st.slider("구간 개수", min_value=5, max_value=50, value=20)

    # 이상치 표시
    outlier_mask = detect_outliers(df_filtered[selected_col_hist])

    fig_hist = go.Figure()

    # 정상 데이터
    fig_hist.add_trace(go.Histogram(
        x=df_filtered.loc[~outlier_mask, selected_col_hist],
        name="정상",
        nbinsx=bins,
        marker_color='#636EFA',
        opacity=0.7
    ))

    # 이상치
    if outlier_mask.any():
        fig_hist.add_trace(go.Histogram(
            x=df_filtered.loc[outlier_mask, selected_col_hist],
            name="이상치",
            nbinsx=bins,
            marker_color='#EF553B',
            opacity=0.9
        ))

    fig_hist.update_layout(
        title=f"{selected_col_hist} 분포",
        xaxis_title=selected_col_hist,
        yaxis_title="빈도",
        barmode='overlay',
        hovermode='x unified',
        template='plotly_white',
        height=500
    )

    st.plotly_chart(fig_hist, use_container_width=True)

# ============ 탭 2: 박스플롯 ============
with tab2:
    st.subheader("박스플롯 분석")

    # 모든 선택된 열의 박스플롯
    fig_box = go.Figure()

    for col in selected_columns:
        outlier_mask = detect_outliers(df_filtered[col])

        # 일반 데이터
        fig_box.add_trace(go.Box(
            y=df_filtered.loc[~outlier_mask, col],
            name=col,
            boxmean='sd'
        ))

    fig_box.update_layout(
        title="각 변수별 박스플롯",
        yaxis_title="값",
        hovermode='closest',
        template='plotly_white',
        height=500
    )

    st.plotly_chart(fig_box, use_container_width=True)

    # 박스플롯 통계
    with st.expander("📊 박스플롯 통계 상세"):
        for col in selected_columns:
            q1 = df_filtered[col].quantile(0.25)
            q3 = df_filtered[col].quantile(0.75)
            iqr = q3 - q1
            st.write(f"**{col}**")
            st.write(f"- Q1: {q1:.4f}, Q3: {q3:.4f}, IQR: {iqr:.4f}")

# ============ 탭 3: 산점도 ============
with tab3:
    st.subheader("산점도 분석")

    col1, col2 = st.columns(2)
    with col1:
        x_col = st.selectbox("X축 선택", selected_columns, key="scatter_x")
    with col2:
        y_col = st.selectbox("Y축 선택", selected_columns,
                            index=min(1, len(selected_columns)-1),
                            key="scatter_y")

    # 이상치 탐지
    outlier_x = detect_outliers(df_filtered[x_col])
    outlier_y = detect_outliers(df_filtered[y_col])
    outlier_mask = outlier_x | outlier_y

    fig_scatter = go.Figure()

    # 정상 점
    fig_scatter.add_trace(go.Scatter(
        x=df_filtered.loc[~outlier_mask, x_col],
        y=df_filtered.loc[~outlier_mask, y_col],
        mode='markers',
        name='정상',
        marker=dict(
            size=8,
            color='#636EFA',
            opacity=0.6
        )
    ))

    # 이상치
    if outlier_mask.any():
        fig_scatter.add_trace(go.Scatter(
            x=df_filtered.loc[outlier_mask, x_col],
            y=df_filtered.loc[outlier_mask, y_col],
            mode='markers',
            name='이상치',
            marker=dict(
                size=10,
                color='#EF553B',
                opacity=0.9,
                symbol='x'
            )
        ))

    # 추세선 추가
    z = np.polyfit(df_filtered[x_col].dropna(), df_filtered[y_col].dropna(), 1)
    p = np.poly1d(z)
    x_trend = np.linspace(df_filtered[x_col].min(), df_filtered[x_col].max(), 100)

    fig_scatter.add_trace(go.Scatter(
        x=x_trend,
        y=p(x_trend),
        mode='lines',
        name='추세선',
        line=dict(color='rgba(0,0,0,0.3)', width=2, dash='dash')
    ))

    # 상관계수
    corr = df_filtered[[x_col, y_col]].corr().iloc[0, 1]

    fig_scatter.update_layout(
        title=f"{x_col} vs {y_col} (상관계수: {corr:.4f})",
        xaxis_title=x_col,
        yaxis_title=y_col,
        hovermode='closest',
        template='plotly_white',
        height=500
    )

    st.plotly_chart(fig_scatter, use_container_width=True)

# ============ 탭 4: 시계열 ============
with tab4:
    st.subheader("시계열 분석")

    if date_columns:
        col1, col2 = st.columns(2)
        with col1:
            date_col_ts = st.selectbox("날짜 열 선택", date_columns, key="ts_date")
        with col2:
            value_col_ts = st.selectbox("값 열 선택", selected_columns, key="ts_value")

        # 날짜 정렬
        df_ts = df_filtered[[date_col_ts, value_col_ts]].copy()
        df_ts[date_col_ts] = pd.to_datetime(df_ts[date_col_ts])
        df_ts = df_ts.sort_values(date_col_ts)

        # 이상치 탐지
        outlier_mask_ts = detect_outliers(df_ts[value_col_ts])

        fig_line = go.Figure()

        # 정상 데이터
        fig_line.add_trace(go.Scatter(
            x=df_ts.loc[~outlier_mask_ts, date_col_ts],
            y=df_ts.loc[~outlier_mask_ts, value_col_ts],
            mode='lines+markers',
            name='정상',
            line=dict(color='#636EFA', width=2),
            marker=dict(size=6)
        ))

        # 이상치
        if outlier_mask_ts.any():
            fig_line.add_trace(go.Scatter(
                x=df_ts.loc[outlier_mask_ts, date_col_ts],
                y=df_ts.loc[outlier_mask_ts, value_col_ts],
                mode='markers',
                name='이상치',
                marker=dict(
                    size=12,
                    color='#EF553B',
                    symbol='diamond'
                )
            ))

        fig_line.update_layout(
            title=f"{value_col_ts} 시계열 추이",
            xaxis_title="시간",
            yaxis_title=value_col_ts,
            hovermode='x unified',
            template='plotly_white',
            height=500
        )

        st.plotly_chart(fig_line, use_container_width=True)
    else:
        st.warning("⚠️ 날짜 열이 없어 시계열 분석을 할 수 없습니다.")
        st.info("CSV 파일에 날짜 형식의 열이 포함되어 있어야 합니다.")

# ============ 탭 5: 상관계수 히트맵 ============
with tab5:
    st.subheader("상관계수 분석")

    # 상관계수 계산
    corr_matrix = df_filtered[selected_columns].corr()

    # 히트맵 생성
    fig_heatmap = go.Figure(data=go.Heatmap(
        z=corr_matrix.values,
        x=corr_matrix.columns,
        y=corr_matrix.columns,
        colorscale='RdBu',
        zmid=0,
        text=np.round(corr_matrix.values, 3),
        texttemplate='%{text}',
        textfont={"size": 10},
        colorbar=dict(title="상관계수")
    ))

    fig_heatmap.update_layout(
        title="상관계수 히트맵",
        xaxis_title="변수",
        yaxis_title="변수",
        height=600,
        width=700
    )

    st.plotly_chart(fig_heatmap, use_container_width=True)

    # 상관계수 테이블
    with st.expander("📊 상관계수 상세표"):
        # 높은 상관관계만 표시
        corr_pairs = []
        for i in range(len(corr_matrix.columns)):
            for j in range(i+1, len(corr_matrix.columns)):
                corr_pairs.append({
                    '변수1': corr_matrix.columns[i],
                    '변수2': corr_matrix.columns[j],
                    '상관계수': corr_matrix.iloc[i, j]
                })

        corr_pairs_df = pd.DataFrame(corr_pairs)
        corr_pairs_df = corr_pairs_df.sort_values('상관계수', key=abs, ascending=False)
        st.dataframe(corr_pairs_df, use_container_width=True)

# ============ 이상치 요약 ============
st.divider()
st.header("⚠️ 이상치 탐지 요약")

outlier_summary = pd.DataFrame({
    '열': selected_columns,
    '이상치 개수': [detect_outliers(df_filtered[col]).sum() for col in selected_columns],
    '이상치 비율(%)': [detect_outliers(df_filtered[col]).sum() / len(df_filtered) * 100
                      for col in selected_columns]
})

outlier_summary = outlier_summary[outlier_summary['이상치 개수'] > 0]

if len(outlier_summary) > 0:
    col1, col2 = st.columns([2, 1])
    with col1:
        st.dataframe(outlier_summary.round(2), use_container_width=True)
    with col2:
        st.metric(
            "총 이상치 개수",
            int(outlier_summary['이상치 개수'].sum())
        )
else:
    st.info("기준(평균 ± {}σ)을 벗어난 이상치가 없습니다.".format(sigma_threshold))

# ============ 데이터 다운로드 ============
st.divider()
st.header("💾 결과 다운로드")

col1, col2 = st.columns(2)

with col1:
    # 필터링된 데이터 다운로드
    csv = df_filtered[selected_columns].to_csv(index=False)
    st.download_button(
        label="필터링된 데이터 다운로드 (CSV)",
        data=csv,
        file_name=f"filtered_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
        mime="text/csv"
    )

with col2:
    # 통계표 다운로드
    stats_csv = stats_df.to_csv()
    st.download_button(
        label="통계 다운로드 (CSV)",
        data=stats_csv,
        file_name=f"statistics_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
        mime="text/csv"
    )

st.markdown("---")
st.caption("🏭 공정 데이터 인터랙티브 분석기 | Streamlit + Plotly")
