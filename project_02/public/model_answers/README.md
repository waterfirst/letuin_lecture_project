# Project 2 채점용 모범답안

이 폴더는 Project 2의 초급, 중급, 고급 제출물을 채점할 때 비교 기준으로 쓰기 위한 모범답안입니다.
원본 CSV는 복사본이 아니라 `project_02/public/oled_deposition_xymap.csv`를 직접 읽어 분석했습니다.

## 생성 방법

```bash
python projects/project2/model_answers/build_model_answers.py
```

현재 저장된 HTML 보고서와 그림은 위 스크립트로 재생성할 수 있습니다. 실행 환경에 `pandas`, `numpy`, `Pillow`가 있으면 보고서 생성이 가능하고, 학생용 예시 코드는 `seaborn`, `matplotlib`, `statsmodels`, `quarto` 사용을 전제로 작성했습니다.

## 단계별 산출물

| 단계 | 파일 |
|---|---|
| 초급 | `beginner/report_beginner.html`, `beginner/answer_beginner.py`, `beginner/hints_beginner.md` |
| 중급 | `intermediate/report_intermediate.html`, `intermediate/answer_intermediate.py`, `intermediate/hints_intermediate.md` |
| 고급 | `advanced/report_advanced.html`, `advanced/oled_deposition_report.qmd`, `advanced/answer_advanced.py`, `advanced/hints_advanced.md` |
| 공통 | `column_dictionary.md`, `assets/*.png` |

## 기준 인사이트

- 데이터 크기: 24,576행, 29개 컬럼
- 전체 fail rate: 11.45%
- 평균 수율이 가장 좋은 chamber: C1
- fail rate가 가장 높은 chamber: C4
- 결함 Pareto 1순위: particle
- 표준화 OLS 기준 R-squared: 0.8376

## 채점 시 확인할 핵심

1. 제출자가 CSV를 먼저 읽고 `df.columns`, `df.shape`, 주요 컬럼 의미를 확인했는가.
2. x/y 좌표가 있는 데이터라는 점을 살려 heatmap 또는 x/y map을 만들었는가.
3. 단순 그래프 나열이 아니라 chamber, zone, defect_type, yield_score 사이의 관계를 설명했는가.
4. 중급 이상은 Pareto, correlation, 회귀분석 또는 그룹 비교를 통해 원인 후보를 좁혔는가.
5. 고급은 Quarto 문서 또는 그에 준하는 재현 가능한 HTML 보고서로 코드와 해석을 함께 남겼는가.
