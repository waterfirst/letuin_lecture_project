# 스마트 팩토리 통합 대시보드

AI 기반 실시간 공장 모니터링 · 이상 감지 · 자동 보고서 생성을 통합한 포트폴리오 수준의 웹 애플리케이션입니다.

## 주요 기능

- **실시간 모니터링**: 5개 센서(온도/압력/습도/진동/전류)의 실시간 대시보드
- **이상 감지**: Z-score 및 IQR 기반 이상치 감지 + 시각적 강조
- **AI 분석**: Gemini API 연동 공정 패턴 분석 및 최적화 제안
- **자동 보고서**: 차트·통계를 포함한 HTML 보고서 다운로드
- **텔레그램 알림**: 이상 감지 시 팀 채널 자동 알림

## 기술 스택

| 역할 | 기술 |
|-----|------|
| 웹 UI | Streamlit (멀티페이지) |
| AI 분석 | Gemini API (google-generativeai) |
| 데이터 처리 | pandas, numpy |
| 시각화 | Plotly |
| 통계 분석 | scipy |
| 알림 | python-telegram-bot |

## 빠른 시작

```bash
# 1. 의존성 설치
pip install -r requirements.txt

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일에 API 키 입력 (없어도 데모 모드 동작)

# 3. 앱 실행
streamlit run app.py
```

## 프로젝트 구조

```
스마트팩토리/
├── app.py                     ← 메인 홈 페이지 (KPI + 설비 상태)
├── pages/
│   ├── 01_실시간_모니터링.py   ← 게이지 + 라인 차트 + 상관관계 히트맵
│   ├── 02_이상_감지.py         ← Z-score 감지 + 공정 능력 지수
│   ├── 03_AI_분석.py           ← Gemini AI 진단 + 트렌드 분석
│   └── 04_보고서.py            ← HTML 보고서 자동 생성 및 다운로드
├── utils/
│   ├── data_generator.py      ← 현실적인 합성 공장 데이터 생성
│   ├── analyzer.py            ← 통계 분석 (Z-score, Cp/Cpk, 트렌드)
│   └── telegram_alert.py      ← 텔레그램 알림 클라이언트
├── .streamlit/
│   └── config.toml            ← 커스텀 테마 (파란색 계열)
├── requirements.txt
├── .env.example
└── README.md
```

## API 키 설정

API 키 없이도 **데모 모드**로 완전히 동작합니다.

| 환경 변수 | 용도 | 없을 때 |
|---------|-----|--------|
| `GEMINI_API_KEY` | AI 분석 | 모킹 응답 사용 |
| `BOT_TOKEN` | 텔레그램 전송 | 콘솔 출력으로 대체 |
| `CHAT_ID` | 텔레그램 수신자 | 콘솔 출력으로 대체 |

## 이상 감지 알고리즘

Z-score 방법 (기본):

```
z = (x - mu) / sigma
이상치: |z| > 2.5
```

IQR 방법 (옵션):

```
이상치: x < Q1 - 1.5*IQR  또는  x > Q3 + 1.5*IQR
```

## 스크린샷

앱을 실행한 후 각 페이지를 탐색하여 기능을 확인하세요.

## 확장 아이디어

- GitHub Actions로 매일 오전 8시 자동 보고서 생성 및 이메일 전송
- Firebase Auth 연동으로 사용자 인증 추가
- SECOM(UCI) 데이터셋으로 실제 반도체 공정 데이터 분석
- Streamlit Cloud 배포로 팀 공유
