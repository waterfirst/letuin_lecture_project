# 프로젝트 1 — 반도체 CVD 박막 두께 Wafer Map 데이터 분석

> **렛유인 AI + 바이브코딩 강의** | CH.1 수료 후 첫 번째 프로젝트 (2일)

---

## 🏭 개요

실제 반도체 양산 공정에서 널리 쓰이는 **PECVD 실리콘 산화막(SiOx) 박막 증착 두께 데이터**를 분석하는 실무 프로젝트입니다. 엘립소메터(Ellipsometer) 계측 과정에서 발생한 극단적 노이즈(이상치)와 유실된 계측 데이터(결측치)를 정제하고, 웨이퍼 상의 박막 균일도(Uniformity)를 계산하여 비정상 CVD 설비와 공정 이상 원인을 진단합니다.

- **수행 기간**: CH.1 이후 주말 2일 (토~일)
- **사용 데이터셋**: 
  - [siox_thickness_data_1.csv](file:///d:/python/2026_letuin/Letuin_AI_Lecture/project_01/public/data/siox_thickness_data_1.csv): CVD_M02 설비 오목형(Edge-High) 이상 데이터
  - [siox_thickness_data_2.csv](file:///d:/python/2026_letuin/Letuin_AI_Lecture/project_01/public/data/siox_thickness_data_2.csv): CVD_M03 설비 볼록형(Center-High) 이상 데이터
- **핵심 목표**: 데이터 정제(Outlier/NaN 필터링)를 통한 신뢰성 있는 웨이퍼 2D 맵 및 설비 트렌드 시각화와 결함 판정

---

## 🎯 학습 목표

1. **데이터 정제 능력**: 반도체 센서 및 계측 장비 오작동으로 발생하는 비현실적인 아웃라이어(-999, 999.9, 0 등) 감지 및 결측값 보간 처리
2. **양산 스펙 산출**: 반도체 공정 표준 두께 균일도(Thickness Uniformity) 공식을 적용하여 수치적 품질 진단
3. **공정 엔지니어링 해석**: 웨이퍼 2D 맵의 동심원 형태(오목형 vs 볼록형)를 시각적으로 분석하여 불량 CVD 설비 작동 메커니즘 역추적
4. **AI 활용 및 디버깅**: Gemini 웹 챗 및 Antigravity 로컬 에이전트와의 협업을 통한 데이터 분석 산출물(HTML 및 Streamlit) 도출

---

## 📊 공통 분석 데이터 포맷 (Ellipsometer 49점 계측 데이터)

모든 수강생은 아래와 같은 반도체 표준 측정 포맷을 가진 가상 공정 데이터를 사용합니다.

| 컬럼명 | 데이터 타입 | 설명 | 분석 엔지니어링 관점 |
| :--- | :--- | :--- | :--- |
| `lot_id` | Object | 생산 Lot 번호 (LOT-001 ~ LOT-040) | 시간 경과에 따른 생산 묶음별 제품 품질 비교 |
| `cvd_machine` | Object | 증착 CVD 설비 번호 (CVD_M01 ~ CVD_M03) | 공정 이상을 일으킨 결함 설비 식별 |
| `meas_time` | Object | 박막 측정 완료 시간 (시계열) | 설비 오작동이 개시되고 종료된 타임윈도우 추적 |
| `position_x` | Float | 웨이퍼 상의 측정 X 좌표 (mm 단위) | 센터(0) 기준 -145mm ~ +145mm 좌표 |
| `position_y` | Float | 웨이퍼 상의 측정 Y 좌표 (mm 단위) | 300mm 웨이퍼의 동심원 그리드 배치 |
| `thickness_value`| Float | 엘립소메터 측정 SiOx 두께 (nm 단위) | 두께 편차 분석 및 결함 검출의 핵심 지표 |

---

## 🟢 초급 (Beginner) — Gemini 웹 챗 데이터 진단 및 HTML 보고서 빌드

> **수행 방법**: 로컬 코딩 빌드 없이 웹 브라우저의 **Gemini Chat(웹 클라이언트)**에 직접 CSV 파일들을 업로드한 후 프롬프트 엔지니어링만으로 이상치 탐지 및 보고서를 자동 추출합니다.

- **필수 결과물**: `report_beginner.html` (Gemini가 소스코드로 제공한 단일 다크모드 보고서 파일)
- **수행 단계**:
  1. 웹 브라우저에서 Gemini Chat을 실행하고 `siox_thickness_data_1.csv` 파일을 업로드합니다.
  2. Gemini에게 극단값 이상치(`-999.0`, `999.9`, `0.0`, `250.3`) 및 비어 있는 결측치(NaN)를 감지하고 요약하도록 프롬프트합니다.
  3. 이상치를 제거한 전후의 **Lot별 Uniformity (%)** 변화를 비교하는 표를 요청합니다.
  4. 특정 시간대에 `CVD_M02` 설비에서 비정상적으로 균일도가 치솟은 현상에 대한 원인 분석을 지시합니다.
  5. 최종적으로 이 모든 분석 결과와 웨이퍼 2D 맵 컨셉 및 개선 조치 방안이 잘 정리된 모던한 다크모드 스타일의 단일 파일 보고서 `report_beginner.html` 소스코드를 요청하여 로컬에 저장합니다.

---

## 🟡 중급 (Intermediate) — Antigravity를 활용한 로컬 HTML 반응형 대시보드 빌드

> **수행 방법**: 로컬 에디터에서 Antigravity 에이전트에게 지시하여 **결측치 자동 필터링, 아웃라이어 마스킹 알고리즘**을 작성하고 로컬에서 작동하는 인터랙티브 대시보드를 빌드합니다.

- **필수 결과물**: `report_intermediate.html` (D3.js 또는 Chart.js 기반 동적 시각화 대시보드)
- **수행 단계**:
  1. Antigravity 에이전트에게 `siox_thickness_data_1.csv` 데이터를 로드하고 파싱하는 JS 코드를 작성해 달라고 요청합니다.
  2. 비정상 이상치는 마스킹 처리하고, 누락된 값(NaN)은 해당 Wafer의 정상 계측지 평균값으로 채워 넣는 보간 함수를 구현합니다.
  3. SVG 또는 D3.js 기반으로 **300mm 웨이퍼 규격의 2D Wafer Map Heatmap**을 그리도록 지시합니다. (두께에 따라 Cyan에서 Red 계열로 HSL 색채가 실시간 변화되도록 처리)
  4. Lot별 두께 변화와 설비 작동 내역을 함께 보여주는 트렌드 타임라인 차트를 구현하게 유도합니다.

---

## 🔴 고급 (Advanced) — Antigravity + Streamlit 연동 다중 파일 재현 분석 대시보드 빌드

> **수행 방법**: Antigravity를 활용하여 Python 기반 데이터 대시보드 프레임워크인 **Streamlit** 애플리케이션을 완성하고, 어떤 실험 파일을 넣어도 동작하는 **재현 가능한(Reproducible) 대시보드 파이프라인**을 작성합니다.

- **필수 결과물**: `app.py` (Streamlit 소스 파일), `requirements.txt`
- **수행 단계**:
  1. Antigravity 에이전트에게 Streamlit 대시보드 구조의 `app.py`를 제안받아 설계합니다.
  2. 사용자가 파일 업로더(`st.file_uploader`)를 통해 `siox_thickness_data_1.csv` 또는 `siox_thickness_data_2.csv` 중 **어떤 파일을 드롭해도 즉시 Lot 데이터와 설비를 식별**하여 대시보드가 리프레시되는 재현성 코드를 짭니다.
  3. Plotly Express를 활용하여 동심원 측정 좌표(X, Y) 기반의 **2D 원형 웨이퍼 산점도 맵(Wafer Scatter Map)**을 반응형으로 그립니다.
  4. Uniformity 공식 계산 논리 및 결측 보간 옵션(중앙값 보간/이상치 필터링)을 st.checkbox 또는 st.sidebar 위젯과 바인딩합니다.
  5. 2개의 상이한 데이터를 대입하여, **CVD_M02 설비 이상(오목 형상)**과 **CVD_M03 설비 이상(볼록 형상)**이 정상적이고 재현 가능하게 감지되는지 최종 검증합니다.

---

## 🛠️ 난이도별 평가 기준 요약

| 평가 항목 | 초급 (Beginner) | 중급 (Intermediate) | 고급 (Advanced) |
| :--- | :--- | :--- | :--- |
| **핵심 도구** | Gemini Web Chat | Antigravity (JS/Local) | Antigravity + Streamlit |
| **최종 산출물** | `report_beginner.html` | `report_intermediate.html` | `app.py` / `requirements.txt` |
| **데이터 결함 대응**| 프롬프트를 통한 자동 요약 | 마스킹 및 평균 보간 코딩 | dynamic 전처리 제어 옵션 |
| **2D Wafer Map** | 레이아웃 스케치 (HTML 표/컨셉) | D3.js/Chart.js 동적 히트맵 | Plotly 300mm 원형 산점도 차트 |
| **재현성 검증** | 불필요 | 불필요 | **필수** (`data_1` 및 `data_2` 완벽 지원) |

---

*본 프로젝트는 렛유인 반도체 R&D AI 공정 데이터 가공 핵심 실습 프로젝트 가이드라인입니다.*
