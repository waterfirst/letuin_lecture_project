# 공정 이상 감지 & 최적화 시스템 [상]

> 렛유인 AI + 바이브코딩 강의 | 프로젝트 2 [상] 모범 답안

## 기능

- IQR + Z-score 이중 이상 감지
- Pareto 차트 불량 원인 분석
- SPC 관리도 (X-bar, UCL/LCL, Cpk)
- 웨이퍼 두께/균일성 히트맵
- 최적 공정 조건 추천 (레이더 차트)
- AI 종합 인사이트 (Gemini API / Mock 모드)
- Markdown 리포트 자동 생성 + 다운로드
- 멀티 탭 UI (Overview / 이상 감지 / 최적화 / 리포트)

## 파일 구조

```
상/
├── app.py          -- 메인 Streamlit 앱
├── utils.py        -- 데이터 생성 + 통계 분석
├── ai_analyzer.py  -- Gemini AI / Mock 분석기
├── requirements.txt
├── .env.example
└── README.md
```

## 실행 방법

```bash
pip install -r requirements.txt
cp .env.example .env  # API 키 설정 (선택)
streamlit run app.py
```

## Gemini API 연동

1. https://aistudio.google.com/app/apikey 에서 API 키 발급
2. `.env` 파일에 `GEMINI_API_KEY=발급받은키` 입력
3. `requirements.txt`에서 `google-generativeai` 주석 해제 후 설치
4. 앱을 재실행하면 "Gemini API" 모드로 자동 전환

## Streamlit Cloud 배포

1. GitHub 레포지토리에 push
2. [share.streamlit.io](https://share.streamlit.io) 에서 New app 생성
3. Secrets에 `GEMINI_API_KEY` 등록

---

*렛유인 AI + 바이브코딩 강의*
