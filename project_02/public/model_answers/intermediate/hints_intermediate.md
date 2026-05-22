# 중급 힌트

1. Pareto chart를 만들 때 `defect_type == "none"`을 포함하면 결함 원인이 잘 보이지 않는다. none을 제외하고 결함끼리 비교한다.
2. chamber별 평균만 보지 말고 fail rate, abs_error_nm, particle_count를 함께 비교한다.
3. correlation은 원인을 증명하는 값이 아니다. 그래프, 위치 패턴, 회귀분석 결과를 함께 보고 원인 후보라고 표현한다.
4. OLS에서 범주형 변수는 `C(chamber)`, `C(zone)`처럼 처리한다.
5. p-value가 작아도 계수 방향과 공정 의미가 맞는지 확인해야 한다.
