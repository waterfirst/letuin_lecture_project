# 🎓 렛유인 AI 강의 - Fine Tech Engineering (Lectures 11-17 & Projects 1-3)

**비전공자를 위한 AI 실무 적용 교육 프로그램**

반도체, 디스플레이, 배터리, 바이오 분야 엔지니어를 위한 실전 AI 강의와 프로젝트 시리즈입니다.

---

## 📚 강의 구성

### Lecture 11-17: AI 실무 적용 강의
### Project 1-3: 단계별 실습 프로젝트 (초급 → 중급 → 고급)

---

## 🎯 강의 목표

- **AI 도구 활용**: Gemini API, ChatGPT, Claude를 업무에 즉시 적용
- **데이터 자동화**: pandas, plotly, Streamlit으로 반복 업무 제거
- **이미지 분석**: Gemini Vision API와 OpenCV로 비전 AI 구축
- **실시간 대시보드**: Streamlit으로 웹 대시보드 개발 및 클라우드 배포
- **포트폴리오 구축**: GitHub 공개 프로젝트로 취업 경쟁력 강화

---

## 📖 강의 시리즈 (Lecture 11-17)

| 구분 | 내용 | 링크 |
|------|------|------|
| 📋 KDC 강의계획서 | 렛유인 제출용 공식 강의계획서 (xlsx) | [렛유인_KDC_강의계획서.xlsx](docs/렛유인_KDC_강의계획서.xlsx) |
| 📝 사전 테스트 | 필수 26문항 + 보너스 9문항 | [pre_test.md](docs/pre_test.md) |
| ✅ 사전평가 50문항 | 객관식/주관식 혼합 50문항 + 정답/해설 | [pre_assessment_50.md](docs/pre_assessment_50.md) |
| 📚 강사용 타임테이블 | 강의별 시간 배분 & 체크리스트 | [full_course_plan.md](docs/full_course_plan.md) |
| 🎯 프로젝트 1 | 소개 웹페이지 (상/중/하) | [project1/](projects/project1/README.md) |
| 🎯 프로젝트 2 | 공정 시뮬레이터 (상/중/하) | [project2/](projects/project2/README.md) |
| 🎯 프로젝트 3 | AI 디스플레이 도구 (상/중/하) | [project3/](projects/project3/README.md) |
| 📦 강의 슬라이드 | Quarto RevealJS 강의록 (1~16강) | [lectures/](lectures/) |
| 📎 참고 자료 | 치트시트, 링크 모음 | [resources/cheatsheets.md](resources/cheatsheets.md) |

### 📌 Lecture 11: AI란 무엇인가? (AI 프롬프트 기초)

**핵심 개념**
- AI의 정의와 기본 동작 원리
- 의도 기반 프롬프트 작성법
- Before → Prompt → After 패턴

**주요 기술**
- Gemini API
- 프롬프트 엔지니어링
- 의도 기반 명령어 작성

**학습 결과물**
- 효과적인 프롬프트 템플릿
- 업무별 프롬프트 사례집

**적용 분야**
- 반도체 공정 데이터 분석
- 디스플레이 불량 패턴 해석
- 배터리 수명 예측
- 바이오 실험 결과 분석

---

### 📌 Lecture 12: Python 기초 (실전 자동화)

**핵심 개념**
- Python 기본 문법 (변수, 조건문, 반복문, 함수)
- pandas로 CSV 데이터 처리
- plotly로 인터랙티브 차트 생성

**주요 기술**
- Python 3.10+
- pandas (데이터 처리)
- plotly (시각화)

**학습 결과물**
- CSV 자동 분석 스크립트
- 추세 그래프 자동 생성

**실습 예제**
```python
import pandas as pd
import plotly.express as px

# CSV 로드
df = pd.read_csv('fab_yield.csv')

# 통계 계산
avg_yield = df.groupby('Line')['Yield'].mean()

# 차트 생성
fig = px.line(df, x='Date', y='Yield', color='Line')
fig.show()
```

---

### 📌 Lecture 13: 데이터 분석 자동화 & AI 인사이트

**핵심 개념**
- pandas로 CSV 자동 분석
- Gemini API로 AI 인사이트 추출
- Streamlit으로 대시보드 자동 생성

**주요 기술**
- pandas (데이터 처리)
- Gemini API (인사이트 생성)
- Streamlit (대시보드)
- plotly (시각화)

**학습 결과물**
- CSV 업로드 → 자동 분석 → AI 인사이트
- 인터랙티브 대시보드 (Streamlit)

**Deep Dive 섹션**
1. Excel 수동 분석 → pandas 자동화
2. 단순 차트 → Gemini AI 인사이트
3. 정적 그래프 → Streamlit 대시보드

---

### 📌 Lecture 14: 이미지 분석 자동화 (Gemini Vision API)

**핵심 개념**
- Gemini Vision API로 이미지 자동 분류
- PIL로 이미지 전처리
- asyncio로 배치 처리

**주요 기술**
- Gemini Vision API
- PIL (Pillow)
- asyncio (병렬 처리)
- SQLite (결과 저장)

**학습 결과물**
- 단일 이미지 불량 판정
- 수백 장 이미지 배치 분석
- 불량 유형별 통계 리포트

**적용 사례**
- Wafer 표면 결함 검사 (반도체)
- Panel 불량 자동 검출 (디스플레이)
- 전극 코팅 불량 검사 (배터리)
- 세포 이미지 분석 (바이오)

---

### 📌 Lecture 15: 센서 데이터 예측 & 알림 시스템

**핵심 개념**
- Prophet으로 시계열 예측
- Isolation Forest로 이상 탐지
- Multi-channel 알림 (이메일, Slack, SMS)

**주요 기술**
- Prophet (시계열 예측)
- scikit-learn (Isolation Forest)
- smtplib (이메일)
- slack-sdk (Slack)
- twilio (SMS)

**학습 결과물**
- 센서 데이터 미래 예측
- 이상 패턴 자동 감지
- 실시간 알림 발송

**Deep Dive 섹션**
1. 수동 모니터링 → Prophet 자동 예측
2. 단순 임계값 → ML 이상 탐지
3. 이메일 수동 → Multi-channel 자동 알림

---

### 📌 Lecture 16: 통합 대시보드 & 포트폴리오

**핵심 개념**
- Streamlit Multi-page 구조
- 데이터 분석 + 이미지 검사 + 센서 예측 통합
- GitHub Pages 배포

**주요 기술**
- Streamlit (Multi-page)
- pandas, plotly, Gemini API
- GitHub Pages / Streamlit Cloud

**학습 결과물**
- 통합 분석 대시보드
- 공개 웹 URL
- GitHub 포트폴리오

**통합 기능**
- 📊 데이터 분석: CSV 자동 분석 + AI 인사이트
- 🖼️ 이미지 검사: Gemini Vision 불량 판정
- 📈 센서 예측: Prophet 시계열 예측 + 알림

---

### 📌 Lecture 17: 기술 면접 & 프로젝트 피칭

**핵심 개념**
- STAR 기법 (Situation, Task, Action, Result)
- 3분 프로젝트 피칭 템플릿
- 예상 질문 TOP 10 & 답변 전략

**주요 내용**
- 기술 면접 준비 (Python, AI, 데이터 분석)
- 행동 면접 대응 (STAR 기법)
- 프로젝트 발표 스킬 (3분 피치)

**면접 준비 자료**
- Python 기술 질문 TOP 10
- AI/ML 개념 질문 TOP 10
- 프로젝트 시연 체크리스트

**Deep Dive 섹션**
1. 기술 면접 대응 전략
2. 프로젝트 프레젠테이션 스킬
3. 행동 면접 STAR 기법

---

## 🚀 실습 프로젝트 (Project 1-3)

### 📦 Project 01: 데이터 분석 자동화

**3단계 프로그레시브 학습**

#### Level 1 (초급) - 2-3시간
- CSV 파일 기본 분석
- pandas + plotly 자동 차트
- Gemini API로 인사이트 추출

**기술 스택**: pandas, plotly, Gemini API

**결과물**: CSV → 자동 분석 → AI 리포트

#### Level 2 (중급) - 1주
- 다중 파일 배치 처리
- SQLite 데이터베이스 저장
- 통합 리포트 자동 생성

**기술 스택**: asyncio, SQLite, pandas, plotly

**결과물**: 배치 처리 자동화 시스템

#### Level 3 (고급) - 2-3주
- 실시간 데이터 파이프라인
- FastAPI REST API
- Prophet ML 예측
- Docker 배포

**기술 스택**: FastAPI, Prophet, Docker, GitHub Actions

**결과물**: 클라우드 배포 API 시스템

---

### 📦 Project 02: 이미지 분석 & 비전 AI

**3단계 프로그레시브 학습**

#### Level 1 (초급) - 2-3시간
- 단일 이미지 분류
- Gemini Vision API 호출
- 불량 여부 자동 판정

**기술 스택**: Gemini Vision API, PIL, Python

**결과물**: 이미지 자동 분류 스크립트

#### Level 2 (중급) - 1주
- 수백 장 배치 처리
- asyncio 병렬 처리
- SQLite 결과 저장
- 불량 통계 리포트

**기술 스택**: asyncio, SQLite, pandas, plotly

**결과물**: 배치 이미지 분석 시스템

#### Level 3 (고급) - 2-3주
- 실시간 영상 분석
- PyTorch 커스텀 모델 파인튜닝
- FastAPI REST API
- Docker 배포

**기술 스택**: OpenCV, PyTorch, FastAPI, Docker

**결과물**: 실시간 비전 AI 시스템

**적용 사례**
- Wafer 결함 검사 (반도체)
- Panel 불량 검출 (디스플레이)
- 코팅 불량 검사 (배터리)
- 세포 이미지 분석 (바이오)

---

### 📦 Project 03: 실시간 대시보드 & 배포

**3단계 프로그레시브 학습**

#### Level 1 (초급) - 2-3시간
- 기본 Streamlit 대시보드
- CSV 데이터 시각화
- 사이드바 필터링

**기술 스택**: Streamlit, pandas, plotly

**결과물**: 로컬 실행 대시보드

#### Level 2 (중급) - 1주
- SQLite 데이터베이스 연동
- Streamlit Multi-page 구조
- Gemini API 통합
- st.cache_data 성능 최적화

**기술 스택**: Streamlit, SQLite, Gemini API

**결과물**: DB 연동 웹 앱

#### Level 3 (고급) - 2-3주
- Docker 컨테이너화
- GitHub Actions CI/CD
- Streamlit Cloud 배포
- Prometheus + Grafana 모니터링

**기술 스택**: Docker, GitHub Actions, Prometheus, Grafana

**결과물**: 클라우드 배포 대시보드

**배포 URL 예시**: https://your-app.streamlit.app

---

## 🛠️ 기술 스택 요약

### 데이터 분석
- **Python**: pandas, numpy
- **시각화**: plotly, matplotlib
- **AI**: Gemini API, Prophet

### 이미지 분석
- **Vision AI**: Gemini Vision API
- **이미지 처리**: PIL, OpenCV
- **ML**: PyTorch, scikit-learn

### 웹 대시보드
- **프레임워크**: Streamlit
- **데이터베이스**: SQLite
- **배포**: Docker, Streamlit Cloud

### DevOps
- **CI/CD**: GitHub Actions
- **컨테이너**: Docker, docker-compose
- **모니터링**: Prometheus, Grafana

---

## 📂 프로젝트 구조

```
Letuin_AI_Lecture/
├── lecture_11/          # AI 프롬프트 기초
├── lecture_12/          # Python 기초
├── lecture_13/          # 데이터 분석 자동화
├── lecture_14/          # 이미지 분석 자동화
├── lecture_15/          # 센서 데이터 예측
├── lecture_16/          # 통합 대시보드
├── lecture_17/          # 기술 면접 & 피칭
├── project_01/          # 데이터 분석 (초급→중급→고급)
├── project_02/          # 이미지 분석 (초급→중급→고급)
├── project_03/          # 대시보드 배포 (초급→중급→고급)
└── README.md            # 이 문서
```

각 강의와 프로젝트는 독립적인 React + TypeScript 앱으로 구성되어 있습니다.

---

## 🎯 학습 경로 추천

### 초보자 (비전공자)
1. Lecture 11: AI 프롬프트 기초 이해
2. Lecture 12: Python 기초 문법 학습
3. Lecture 13: 데이터 분석 자동화
4. **Project 01 Level 1**: CSV 자동 분석 실습
5. Lecture 14: 이미지 분석 입문
6. **Project 02 Level 1**: 이미지 분류 실습

### 중급자 (Python 기초 보유)
1. Lecture 13-15: 데이터/이미지/센서 자동화
2. **Project 01 Level 2**: 배치 처리 시스템
3. **Project 02 Level 2**: 배치 이미지 분석
4. Lecture 16: 통합 대시보드
5. **Project 03 Level 2**: DB 연동 웹 앱

### 고급자 (실무 적용 목표)
1. **Project 01 Level 3**: FastAPI + Prophet ML
2. **Project 02 Level 3**: PyTorch 파인튜닝 + 실시간 영상
3. **Project 03 Level 3**: Docker + CI/CD + Cloud 배포
4. Lecture 17: 기술 면접 & 포트폴리오 완성
5. GitHub 공개 + 기술 블로그 작성

---

## 💼 취업 포트폴리오 구축

### 1단계: GitHub 공개
- 프로젝트 1, 2, 3을 GitHub에 공개
- README에 프로젝트 설명과 실행 방법 작성
- 코드에 주석과 docstring 추가

### 2단계: 배포 URL 획득
- Streamlit Cloud에 대시보드 배포
- FastAPI를 Render 또는 Railway에 배포
- README에 실행 가능한 URL 추가

### 3단계: 기술 블로그 작성
- Medium, Velog, tistory 등에 프로젝트 과정 작성
- 문제 해결 경험과 인사이트 공유
- 기술 역량 증명

### 4단계: 면접 준비
- Lecture 17 기술 면접 자료 복습
- 프로젝트 3분 피칭 연습
- STAR 기법으로 경험 정리

---

## 🌟 핵심 특징

### 1. Before → Prompt → After 패턴
- **Before**: 수동 작업의 비효율성
- **Prompt**: AI에게 주는 명확한 지시문
- **After**: 자동화된 결과물

### 2. 4개 도메인 적용 가능
- **반도체**: Wafer 수율, 공정 데이터
- **디스플레이**: Panel 불량, Mura 검출
- **배터리**: 충전 사이클, 용량 감소
- **바이오**: 세포 이미지, 실험 결과

### 3. Deep Dive 실전 사례
- 각 강의마다 3개의 Deep Dive 섹션
- 실무 적용 가능한 구체적 코드
- 검증 체크리스트 제공

### 4. 프로그레시브 학습 (초급 → 고급)
- 단계별 난이도 상승
- 누구나 따라할 수 있는 구조
- 실무 배포까지 완성

---

## 🚀 시작하기

### 1. 환경 설정

```bash
# Python 3.10+ 설치 확인
python --version

# 필수 패키지 설치
pip install pandas plotly streamlit google-generativeai
pip install python-dotenv pillow opencv-python
pip install scikit-learn prophet
```

### 2. Gemini API Key 발급

1. https://makersuite.google.com/app/apikey 접속
2. API Key 생성
3. `.env` 파일 생성:
```
GEMINI_API_KEY=your_api_key_here
```

### 3. 강의 실행 (Vite + React)

```bash
cd lecture_13
npm install
npm run dev
```

### 4. 프로젝트 실행 (Streamlit)

```bash
cd project_03
pip install -r requirements.txt
streamlit run app.py
```

---

## 📞 문의 및 지원

- **GitHub Repository**: https://github.com/waterfirst/letuin_lecture_project
- **Issues**: 버그 리포트 및 질문
- **Discussions**: 학습 관련 토론

---

## 📄 라이선스

이 프로젝트는 교육 목적으로 제공되며, 개인 학습 및 포트폴리오 용도로 자유롭게 사용할 수 있습니다.

---

## 🙏 감사의 말

이 강의와 프로젝트는 반도체, 디스플레이, 배터리, 바이오 분야의 비전공 엔지니어들이 AI를 실무에 적용할 수 있도록 설계되었습니다. 모든 분들의 성공적인 커리어 전환을 응원합니다!

**© 2026 LettUin Edu | Fine Tech Engineering AI Education**
