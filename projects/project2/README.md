# 프로젝트 2 — OLED Deposition 데이터 시각화 & HTML 보고서

> **렛유인 AI + 바이브코딩 강의** | CH.2 수료 후 두 번째 프로젝트 (2일)

---

## 개요

OLED deposition 공정 데이터를 읽고 **그래프와 통계 분석으로 공정 인사이트를 찾은 뒤 HTML 보고서로 문서화**하는 프로젝트입니다.
P1에서 익힌 CSV 분석 경험을 바탕으로, 이번에는 Seaborn 시각화와 Quarto 문서를 활용해 더 보고서다운 결과물을 만듭니다.

- **수행 기간**: CH.2 이후 주말 2일 (토~일)
- **사용 도구**: Gemini AI + Python + pandas + seaborn + statsmodels + Quarto
- **결과물**: CSV 분석 코드 + 그래프 이미지 + HTML 또는 Quarto HTML 보고서
- **참고 사이트**: [Seaborn Gallery](https://seaborn.pydata.org/examples/index.html)

---

## P1에서 배운 것 복습

P2를 시작하기 전에 P1에서 익힌 핵심 역량을 점검하세요.

| P1 핵심 역량 | 확인 |
|-------------|------|
| Gemini에게 코드 생성/수정을 요청하는 프롬프트 작성 | [ ] |
| CSV 파일을 pandas로 읽고 기본 통계를 확인 | [ ] |
| 그래프를 보고 이상치나 패턴을 설명 | [ ] |
| 분석 결과를 간단한 문서로 정리 | [ ] |
| 에러 발생 시 AI에게 디버깅 요청 | [ ] |

> P1의 핵심이 “CSV를 읽고 그래프를 만든다”였다면, P2의 핵심은 “그래프를 근거로 원인 후보를 좁히고 보고서로 설명한다”입니다.

---

## P1에서 P2로의 성장

```
P1: CSV 읽기 → 기본 통계 → 차트 확인
                ↓
P2: CSV 읽기 → 최적 시각화 선택 → 통계 검증 → HTML 보고서 작성
```

| 구분 | P1 | P2 (이번 프로젝트) |
|------|----|-------------------|
| 데이터 | 간단한 공정 CSV | OLED deposition x/y map CSV |
| 시각화 | 기본 차트 | boxplot, scatter, heatmap, Pareto, x/y map |
| 분석 | 그래프 확인 | 상관관계, 회귀분석, p-value 해석 |
| 보고서 | 간단 요약 | HTML 또는 Quarto HTML |
| 목표 | 분석 경험 | 원인 가설과 개선 제안 |

---

## 학습 목표

1. OLED deposition 데이터를 읽고 주요 품질 지표를 이해한다
2. 문제 유형에 맞는 시각화 방법을 선택한다
3. boxplot, scatter plot, heatmap, Pareto chart로 인사이트를 찾는다
4. 회귀분석과 p-value를 이용해 원인 후보를 통계적으로 검토한다
5. 분석 흐름을 HTML 또는 Quarto HTML 보고서로 문서화한다

---

## AI Tool 활용 비중

```
┌─────────────────────────────────────────┐
│  AI Tool 활용 (65%)                     │
│  • Gemini로 분석 코드 생성/수정          │
│  • Seaborn 예제 코드를 내 데이터에 맞게 변환 │
│  • 보고서 초안과 해석 문장 개선          │
├─────────────────────────────────────────┤
│  도메인 지식 (35%)                       │
│  • OLED deposition 품질 지표 이해        │
│  • 그래프별 공정 의미 해석               │
│  • 원인 후보와 개선 제안 판단            │
└─────────────────────────────────────────┘
```

---

## 제공 데이터

이번 프로젝트에는 확장된 OLED deposition 합성 CSV가 제공됩니다.

| 파일 | 위치 | 설명 |
|------|------|------|
| `oled_deposition_xymap.csv` | `project_02/public/` | 4개 panel, 96 x 64 좌표, 총 24,576행 |

### 주요 컬럼

| 컬럼 | 의미 | 활용 예 |
|------|------|---------|
| `panel_id`, `x_index`, `y_index` | panel과 x/y 측정 좌표 | x/y map, heatmap |
| `chamber`, `zone` | 증착 chamber와 panel 영역 | chamber별 boxplot |
| `source_temp_c`, `substrate_temp_c` | 공정 온도 | 산점도, 회귀분석 |
| `pressure_mTorr`, `oxygen_flow_sccm` | 공정 압력/가스 조건 | 상관관계, 회귀분석 |
| `thickness_nm`, `thickness_error_nm` | 목표 두께 대비 편차 | boxplot, heatmap |
| `particle_count`, `dark_spot_count` | 결함 관련 측정값 | Pareto, 원인 후보 |
| `defect_type`, `pass_fail` | 결함 유형과 판정 | Pareto chart |
| `yield_score` | 좌표 단위 품질 점수 | scatter, regression |

---

## 난이도별 수행 가이드

### 🟢 하 (기본) — CSV 읽기 + Seaborn 그래프 3종

> **목표**: 제공 CSV를 읽고 boxplot, 산점도, heatmap을 생성한 뒤 HTML 보고서를 만듭니다.

**소요 시간**: 3~4시간

**제공되는 것**:
- `oled_deposition_xymap.csv`
- Gemini 프롬프트 전문
- Seaborn Gallery 링크

**Step 1.** [Gemini](https://gemini.google.com)에 접속합니다.

**Step 2.** 아래 프롬프트를 복사해서 붙여넣으세요.

```text
OLED deposition CSV를 분석하는 Python 예제를 만들어줘.

조건:
1. pandas로 oled_deposition_xymap.csv를 읽기
2. seaborn으로 boxplot, scatter plot, heatmap을 각각 그리기
3. heatmap은 x_index, y_index 좌표별 thickness_error_nm 평균으로 만들기
4. 그래프는 PNG로 저장하고, 결과 해석을 HTML 보고서(report.html)에 넣기
5. 초보자도 실행할 수 있도록 requirements.txt와 실행 명령어도 함께 설명하기

사용 컬럼:
panel_id, x_index, y_index, chamber, zone, substrate_temp_c, pressure_mTorr,
thickness_nm, thickness_error_nm, particle_count, defect_type, yield_score
```

**Step 3.** Gemini가 생성한 코드를 `analysis.py`로 저장합니다.

**Step 4.** 터미널에서 실행합니다.

```bash
pip install pandas seaborn matplotlib
python analysis.py
```

**Step 5.** 생성된 `report.html`과 그래프 PNG를 확인합니다.

**평가 기준**:
- [ ] CSV가 정상 로드되는가
- [ ] boxplot, scatter plot, heatmap이 각각 1개 이상 생성되는가
- [ ] HTML 보고서에 그래프와 한 줄 해석이 포함되는가
- [ ] 실행 화면 또는 보고서 캡처 1장 제출

---

### 🟡 중 (응용) — 시각화 + 통계 분석으로 인사이트 찾기

> **목표**: 그래프를 보고 끝내지 않고, 결함 우선순위와 통계적으로 유의한 원인 후보를 찾습니다.

**소요 시간**: 6~8시간

**제공되는 것**:
- 확장 OLED deposition CSV
- 방향 힌트
- 프롬프트는 직접 설계

**요구사항**:
- Seaborn/Matplotlib 그래프 **5종 이상**
  - boxplot
  - scatter plot
  - heatmap 또는 x/y map
  - Pareto chart
  - correlation heatmap
- 결함 유형별 Pareto 분석
- 수치 컬럼 상관관계 분석
- 회귀분석 또는 그룹 비교 분석 1개 이상
- HTML 보고서 제출

**분석 질문 예시**:
- chamber별로 thickness_error_nm 분포가 다른가?
- 특정 x/y 위치에 thin spot 또는 dark spot이 몰리는가?
- defect_type 중 누적 비율 80%를 차지하는 상위 결함은 무엇인가?
- yield_score에 유의한 영향을 주는 공정 조건은 무엇인가?

**프롬프트 작성 팁**:

```text
이 분석 코드에 통계 분석을 추가해줘.

추가 요구사항:
- defect_type Pareto chart 생성
- 수치 컬럼 correlation heatmap 생성
- statsmodels OLS로 yield_score 회귀분석
- p-value가 0.05보다 작은 변수를 "유의한 인자"로 표시
- HTML 보고서에 그래프별 해석과 개선 제안 3개 포함
```

**평가 기준**:
- [ ] 그래프 5종 이상
- [ ] Pareto chart 포함
- [ ] 통계 분석 결과 포함
- [ ] p-value 또는 상관계수 해석 포함
- [ ] HTML 보고서에 인사이트와 개선 제안 포함

---

### 🔴 상 (심화) — Quarto 기반 원인 분석 보고서

> **목표**: `.qmd` 문서 하나로 코드, 그래프, 통계표, 해석, 결론이 모두 재현되는 HTML 보고서를 만듭니다.

**소요 시간**: 10~12시간 (2일)

**제공되는 것**:
- 확장 OLED deposition CSV
- 보고서 구조 예시
- 힌트는 최소화

**요구사항**:
- Quarto 문서(`oled_deposition_report.qmd`) 작성
- HTML 렌더링 결과 제출
- Seaborn 그래프 **6종 이상**
- x/y map 또는 heatmap으로 위치 기반 이상 패턴 분석
- statsmodels 회귀분석 결과표 포함
- p-value 기반 원인 후보 해석
- 결론에 “가장 먼저 확인할 공정 조건/장비/위치”를 3개 이상 제안
- GitHub README.md 작성

**Quarto 프롬프트 예시**:

```text
Quarto 문서 oled_deposition_report.qmd를 만들어줘.

목표:
- oled_deposition_xymap.csv를 읽고 OLED deposition 공정 문제 원인을 찾는 HTML 보고서 작성
- 코드, 그래프, 통계 분석, p-value 해석, 개선 제안을 한 문서에 포함

포함할 섹션:
1. 분석 목적과 데이터 설명
2. 품질 지표 요약: thickness_nm, thickness_error_nm, yield_score
3. Seaborn boxplot, scatter plot, heatmap, Pareto chart
4. statsmodels OLS 회귀분석: yield_score를 종속변수로 두고 공정 조건의 p-value 해석
5. x/y map hotspot과 defect_type Pareto를 연결한 원인 가설
6. 최종 권고안 3개

렌더링:
quarto render oled_deposition_report.qmd --to html
```

**평가 기준**:
- [ ] `.qmd` 원본 제출
- [ ] HTML 렌더링 결과 제출
- [ ] 그래프 6종 이상
- [ ] 회귀분석과 p-value 해석 포함
- [ ] 원인 가설과 개선 제안이 그래프 근거와 연결됨
- [ ] GitHub README 작성

---

## 추천 보고서 구조

```text
1. 분석 목적
2. 데이터 설명
3. 결측치/기초 통계 확인
4. 시각화 결과
   - 분포: boxplot
   - 관계: scatter plot
   - 위치: heatmap 또는 x/y map
   - 우선순위: Pareto chart
5. 통계 분석
   - correlation heatmap
   - regression model
   - p-value 해석
6. 원인 후보 정리
7. 개선 제안
8. 한계와 다음 분석 방향
```

---

## Gemini 바이브코딩 워크플로우

```text
1. Gemini에게 기본 분석 코드 요청
   "CSV를 읽고 Seaborn 그래프 3개를 그려줘"

2. 실행 후 에러 수정
   "이 에러 메시지를 보고 코드를 고쳐줘: ..."

3. Seaborn Gallery 예제 적용
   "이 예제 스타일을 내 데이터의 chamber별 boxplot으로 바꿔줘"

4. 통계 분석 추가
   "statsmodels 회귀분석과 p-value 해석을 추가해줘"

5. 보고서 개선
   "그래프 아래에 공정 엔지니어 관점의 해석 문장을 추가해줘"

6. Quarto 전환
   "이 분석을 .qmd 문서로 바꿔서 HTML로 렌더링할 수 있게 해줘"
```

---

## 선수 학습 확인

- [ ] P1 프로젝트를 완료했다
- [ ] pandas로 CSV를 읽어본 적이 있다
- [ ] boxplot, scatter plot, heatmap의 용도를 설명할 수 있다
- [ ] HTML 보고서를 브라우저에서 열어볼 수 있다
- [ ] 고급에 도전한다면 Quarto 설치 또는 사용 환경을 준비했다

---

## 제출물 체크리스트

### 하 난이도 제출물
- [ ] `analysis.py`
- [ ] 그래프 PNG 3개 이상
- [ ] `report.html`
- [ ] 실행 또는 보고서 캡처 1장

### 중 난이도 제출물
- [ ] `analysis.py`
- [ ] 그래프 PNG 5개 이상
- [ ] 통계 분석 결과가 포함된 `report.html`
- [ ] 사용한 Gemini 프롬프트 기록
- [ ] 해석 및 개선 제안 포함

### 상 난이도 제출물
- [ ] `oled_deposition_report.qmd`
- [ ] 렌더링된 HTML 보고서
- [ ] GitHub Repository URL
- [ ] README.md
- [ ] 사용한 Gemini 프롬프트 기록

---

## 자주 묻는 질문

**Q. Streamlit 앱을 만들어도 되나요?**  
A. 이번 프로젝트의 기준 산출물은 HTML 또는 Quarto HTML 보고서입니다. Streamlit은 추가 산출물로는 좋지만 필수는 아닙니다.

**Q. 그래프를 많이 넣으면 높은 점수를 받나요?**  
A. 그래프 개수보다 “왜 이 그래프를 선택했고 무엇을 알게 되었는지”가 더 중요합니다.

**Q. p-value가 뭔지 잘 모르겠어요.**  
A. 중급 이상에서는 Gemini에게 “p-value를 공정 엔지니어가 이해할 수 있게 해석해줘”라고 요청하세요. 단, AI 답변을 그대로 믿지 말고 그래프와 도메인 상식으로 다시 확인해야 합니다.

**Q. Quarto가 꼭 필요한가요?**  
A. 고급 난이도에서는 필요합니다. 초급과 중급은 일반 HTML 보고서로 제출해도 됩니다.

**Q. 실제 회사 데이터를 써도 되나요?**  
A. 공개 저장소에는 절대 올리면 안 됩니다. 회사 내부 데이터, 장비명, lot 정보, 고객 정보는 모두 제외하세요. 제공된 합성 CSV 또는 공개 데이터만 사용하세요.

---

## 트러블슈팅

**증상: `ModuleNotFoundError: No module named 'seaborn'`**

```bash
pip install seaborn matplotlib pandas
```

**증상: 한글이 그래프에서 깨짐**

```python
import matplotlib.pyplot as plt
plt.rcParams["font.family"] = "Malgun Gothic"
plt.rcParams["axes.unicode_minus"] = False
```

**증상: heatmap이 너무 느림**
- 전체 데이터를 그대로 그리지 말고 `pivot_table`로 x/y 평균값을 만든 뒤 그리세요.
- panel 하나를 선택해서 먼저 분석하세요.

**증상: Quarto 렌더링 실패**

```bash
quarto check
quarto render oled_deposition_report.qmd --to html
```

**증상: p-value 결과가 이상함**
- 결측치와 문자열 컬럼이 모델에 들어갔는지 확인하세요.
- 독립변수끼리 너무 강하게 상관되어 있으면 회귀계수가 불안정할 수 있습니다.

---

## 배점 기준

| 항목 | 비중 |
|------|------|
| 데이터 처리와 재현성 | 25% |
| 시각화 완성도 | 25% |
| 통계 분석과 해석 | 25% |
| 보고서 문서화 | 25% |

---

## 평가 기준 요약

| 항목 | 하 | 중 | 상 |
|------|----|----|-----|
| CSV 로드 | 필수 | 필수 | 필수 |
| 시각화 | 3종 | 5종 이상 | 6종 이상 |
| Pareto chart | 선택 | 필수 | 필수 |
| x/y map | heatmap 가능 | 권장 | 필수 |
| 통계 분석 | 기초 통계 | 상관/회귀 | p-value 기반 원인 분석 |
| 보고서 | HTML | HTML | Quarto HTML |
| README | 선택 | 권장 | 필수 |

---

## 제출 방법

1. 실행 코드 또는 Quarto 원본
2. HTML 보고서
3. 그래프 이미지 또는 보고서 캡처
4. 중/상 난이도는 사용한 Gemini 프롬프트 기록
5. 상 난이도는 GitHub 레포지토리 URL

---

## 다음 단계 안내

P2를 완료했다면 **프로젝트 3 (P3)**로 넘어갈 준비가 되었습니다.

**P2에서 쌓은 역량:**
- 공정 CSV를 읽고 적절한 그래프를 선택하는 능력
- Seaborn 기반 시각화
- Pareto, heatmap, 회귀분석을 통한 원인 후보 도출
- HTML/Quarto 보고서 작성

**P3에서 새로 배울 것:**
- 분석 결과를 앱 또는 대시보드로 확장
- 자동 알림과 배포
- 포트폴리오 수준의 완성도 정리

---

*렛유인 AI + 바이브코딩 강의 | 데이터 시각화와 분석 보고서 자동화*
