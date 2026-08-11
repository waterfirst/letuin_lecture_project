# Claude 검수 바톤 — 렛유인 프로젝트 데이터 다운로드

작성일: 2026-08-11  
저장소: `https://github.com/waterfirst/letuin_lecture_project`  
기준 구현 커밋: `d8c5fda`

## 목표

- 3개 프로젝트의 초·중·상 과제 페이지에서 필요한 실습 데이터를 바로 다운로드하게 한다.
- 학생이 학습 데이터로 기준을 만들고, 홀드아웃 정답을 나중에 확인하도록 데이터 누수를 막는다.

## 완료 사항

- 프로젝트 1 초·중·상: 기존 SiOx 두께 CSV 2종 링크 정상(HTTP 200).
- 프로젝트 2 초·중·상: 기존 OLED 증착 XY-map CSV 링크 정상(HTTP 200).
- 프로젝트 3 초·중·상: 아래 4개 CSV를 새로 생성하고 페이지에 다운로드 버튼과 사용 순서를 추가.
  - `projects/project3/data/smart_factory_sensor_training.csv` — 72행, 라벨 포함
  - `projects/project3/data/smart_factory_sensor_holdout.csv` — 24행, 라벨 제외
  - `projects/project3/data/smart_factory_sensor_holdout_answer.csv` — 24행, 정답·주요 원인
  - `projects/project3/data/smart_factory_sensor_data_dictionary.csv` — 10개 컬럼 정의
- CVD 설비 3대의 온도·압력·박막 두께·RF power·gas flow·진동 데이터를 구성.
- 정상·주의·위험·결측 검토 사례와 의도적 노이즈를 포함.
- 초급 프롬프트를 가상 센서 생성 중심에서 CSV 업로드·결측 처리·라벨 비교 중심으로 수정.
- 중·상급은 `학습 → 기준 고정 → 홀드아웃 예측 저장 → 정답 공개 → 평가` 순서로 명시.

## 난이도별 데이터 사용

- **초급:** 학습 CSV + 데이터 사전. 차트와 상태 판정 후 제공 라벨과 비교.
- **중급:** 학습·홀드아웃·데이터 사전. 예측 CSV를 저장한 후 접힌 정답 링크를 열어 정확도와 DANGER 재현율 계산.
- **상급:** 중급 흐름에 DANGER 재현율·오탐 수·REVIEW 처리율·정답 공개 전후 커밋 분리를 추가.

## 공개 URL

- 초급: `https://waterfirst.github.io/letuin_lecture_project/projects/project3/project3_beginner.html`
- 중급: `https://waterfirst.github.io/letuin_lecture_project/projects/project3/project3_intermediate.html`
- 상급: `https://waterfirst.github.io/letuin_lecture_project/projects/project3/project3_advanced.html`
- 데이터 기준 경로: `https://waterfirst.github.io/letuin_lecture_project/projects/project3/data/`

## 검증 결과

- GitHub Actions `Deploy to GitHub Pages`: 성공.
- 공개 페이지 3개: HTTP 200, 필요한 다운로드 버튼 포함 확인.
- 공개 CSV 4개: HTTP 200, 로컬 파일과 SHA-256 일치.
- 학습·홀드아웃 `record_id`: 중복 없음.
- 홀드아웃과 정답 `record_id`: 완전 일치.
- 홀드아웃에 `alarm_state`가 없음을 확인.
- `git diff --check`: 통과.
- 푸시 후 작업 트리: clean.

## 커밋

- `d8c5fda Add downloadable datasets for project 3 assignments`
- 직전 강의 업데이트: `b370be5 Update course for Gemini 3.6 and Google GenAI SDK`

## Claude에게 요청할 검수

1. **읽기 전용으로 먼저 검수**한다. 오류가 없으면 수정하지 않는다.
2. 과제 의도와 초·중·상 난이도 차이가 적절한지 본다.
3. 정답 파일이 학생에게 너무 일찍 노출되지 않는지 본다. 현재 HTML `<details>`는 교육적 경고일 뿐 보안 장치는 아니다.
4. 제공 라벨을 절대적 공정 기준으로 오해할 표현이 없는지 본다. 이 데이터는 교육용 합성 데이터다.
5. 수정이 필요하면 문제 위치·근거·최소 수정안을 먼저 보고하고, 승인 전 대규모 재작성이나 구조 변경은 하지 않는다.

## 주의

- API 키·텔레그램 토큰 등 비밀정보는 저장하지 않았다.
- 프로젝트 1·2 데이터 링크는 이미 정상이다. 관련 없는 경로·문구·스타일을 리팩터링하지 않는다.
- Claude 세션 토큰 절약을 위해 과거 대화 전체를 다시 읽지 말고 이 문서와 해당 HTML/CSV만 확인한다.
