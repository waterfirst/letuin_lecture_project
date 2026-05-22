# 초급 힌트

1. CSV를 바로 그래프로 그리지 말고 `df.shape`, `df.columns`, `df.head()`를 먼저 출력한다.
2. heatmap은 `pivot_table(index="y_index", columns="x_index", values="thickness_error_nm")`처럼 x/y 좌표를 2차원 표로 바꾼 뒤 그린다.
3. 산점도는 전체 24,576점을 모두 찍으면 느리거나 흐려질 수 있으니 `sample(random_state=42)`로 일부만 확인해도 된다.
4. `ModuleNotFoundError: seaborn`이 나오면 `pip install pandas seaborn matplotlib`을 실행한다.
5. HTML에서 그림이 안 보이면 HTML 파일 기준 상대경로가 맞는지 확인한다.
