import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import numpy as np

st.set_page_config(page_title="공정 데이터 분석기", layout="wide")

st.title("🏭 공정 데이터 분석기")

st.markdown("CSV 파일을 업로드하여 공정 데이터를 분석해보세요.")

# 파일 업로더
uploaded_file = st.file_uploader("CSV 파일을 선택하세요", type=["csv"])

if uploaded_file is not None:
    df = pd.read_csv(uploaded_file)

    st.success("파일이 업로드되었습니다!")

    # 데이터 미리보기
    st.subheader("📊 데이터 미리보기")
    st.dataframe(df.head(10))

    # 숫자형 열 선택
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    # 사이드바 설정
    st.sidebar.header("⚙️ 설정")
    selected_columns = st.sidebar.multiselect(
        "분석할 열을 선택하세요",
        numeric_cols,
        default=numeric_cols
    )

    if selected_columns:
        # 기본 통계
        st.subheader("📈 기본 통계")

        stats_data = []
        for col in selected_columns:
            stats_data.append({
                "열 이름": col,
                "평균": round(df[col].mean(), 4),
                "표준편차": round(df[col].std(), 4),
                "최솟값": round(df[col].min(), 4),
                "최댓값": round(df[col].max(), 4)
            })

        stats_df = pd.DataFrame(stats_data)
        st.dataframe(stats_df, use_container_width=True)

        # 히스토그램
        st.subheader("📊 분포 분석")

        col_count = len(selected_columns)
        for i, col in enumerate(selected_columns):
            fig = px.histogram(
                df,
                x=col,
                nbins=30,
                title=f"{col} 분포",
                labels={col: col},
            )
            fig.update_layout(height=400, showlegend=False)
            st.plotly_chart(fig, use_container_width=True)

        # 시계열 차트
        st.subheader("📉 시계열 분석")

        if len(df) > 0:
            time_data = {}
            for col in selected_columns:
                time_data[col] = df[col].values

            time_df = pd.DataFrame(time_data)
            time_df["인덱스"] = range(len(time_df))

            fig_line = px.line(
                time_df,
                x="인덱스",
                y=selected_columns,
                title="시간에 따른 데이터 변화",
                labels={"인덱스": "시간", "value": "값"}
            )
            fig_line.update_layout(height=500)
            st.plotly_chart(fig_line, use_container_width=True)

    # 데이터 정보
    st.subheader("ℹ️ 데이터 정보")
    col1, col2, col3 = st.columns(3)

    with col1:
        st.metric("행 개수", len(df))

    with col2:
        st.metric("열 개수", len(df.columns))

    with col3:
        st.metric("숫자형 열", len(numeric_cols))

else:
    st.info("CSV 파일을 업로드하여 시작하세요.")
