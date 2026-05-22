# OLED deposition CSV 컬럼 사전

- 원본 파일: `project_02/public/oled_deposition_xymap.csv`
- 행/열: 24,576행, 29개 컬럼
- 이 파일은 모범답안을 만들 때 실제 CSV를 읽어 자동 생성했습니다.

| column | dtype | meaning | example | n_unique |
| --- | --- | --- | --- | --- |
| lot_id | str | 생산 lot 식별자 | LOT26A_01 | 2 |
| run_id | str | 증착 run 식별자 | RUN_2026_05_22_A | 2 |
| panel_id | str | 측정 panel 식별자 | PNL_A01 | 4 |
| tool_id | str | 증착 장비 식별자 | TOOL_DP_07 | 2 |
| chamber | str | 장비 내 chamber | C1 | 4 |
| sample_id | str | panel 내 측정 sample ID | PNL_A01_00_00 | 24576 |
| x_index | int64 | x 방향 격자 좌표 | 0 | 96 |
| y_index | int64 | y 방향 격자 좌표 | 0 | 64 |
| x_mm | float64 | x 방향 실제 위치(mm) | -24.7 | 96 |
| y_mm | float64 | y 방향 실제 위치(mm) | -16.38 | 64 |
| zone | str | panel 위치 영역(center, middle, edge) | edge | 3 |
| source_temp_c | float64 | 증착 source 온도(섭씨) | 119.796 | 7730 |
| substrate_temp_c | float64 | 기판 온도(섭씨) | 82.283 | 4193 |
| pressure_mTorr | float64 | chamber 압력(mTorr) | 2.7586 | 2657 |
| oxygen_flow_sccm | float64 | 산소 유량(sccm) | 18.075 | 1541 |
| nitrogen_flow_sccm | float64 | 질소 유량(sccm) | 42.314 | 1152 |
| deposition_rate_a_s | float64 | 증착 속도(Angstrom/sec) | 1.4378 | 1820 |
| target_thickness_nm | float64 | 목표 두께(nm) | 100.0 | 1 |
| thickness_nm | float64 | 측정 두께(nm) | 101.579 | 7254 |
| thickness_error_nm | float64 | 측정 두께 - 목표 두께(nm) | 1.579 | 7254 |
| abs_error_nm | float64 | 두께 오차 절댓값(nm) | 1.579 | 4442 |
| sheet_resistance_ohm_sq | float64 | 면저항(ohm/sq) | 14.399 | 1552 |
| luminance_cd_m2 | float64 | 휘도(cd/m2) | 767.99 | 7069 |
| voltage_v | float64 | 구동 전압(V) | 3.144 | 1881 |
| particle_count | int64 | 측정 좌표 주변 particle 개수 | 0 | 7 |
| dark_spot_count | int64 | dark spot 개수 | 0 | 4 |
| defect_type | str | 주요 결함 유형 | none | 6 |
| pass_fail | str | 좌표 단위 품질 판정 | pass | 2 |
| yield_score | float64 | 좌표 단위 수율 점수 | 96.965 | 9861 |
