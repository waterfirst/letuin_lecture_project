# PART 4 — AI API + 시뮬레이션 + Antigravity (8~10강)

## 8강: Google AI Studio + Gemini API (30분)

### 오프닝 훅
> *"Gemini 3.6 Flash를 공식 SDK로 연결하고,
> 활성 한도·비용·품질을 직접 측정해 내 앱에 안전하게 넣어보자."*

### 이론 (12분)
- Google AI Studio 소개 & Gemini API 구조
- API Key 발급 및 보안 관리 (.env + .gitignore)
- Gemini의 멀티모달 능력 (텍스트 + 이미지 + 영상)
- **Claude API vs Gemini API 비교**

| 항목 | Claude API | Gemini API |
|------|-----------|-----------|
| 무료 한도 | 사용 시점의 공식 가격표 확인 | 무료 티어 제공, 활성 한도는 AI Studio에서 확인 |
| 수업 기본 모델 | 사용 시점에 확인 | Gemini 3.6 Flash (stable) |
| 맥락 창 | 200K 토큰 | 1M 토큰 |
| 장점 | 코딩/분석 정확도 높음 | 무료 한도 넉넉, Google 통합 |
| 단점 | 무료 API 없음 | 긴 추론 일관성 낮을 수 있음 |
| 이 강의 활용 | 텔레그램 봇 (13~14강) | 챗봇·시뮬레이션 (8~9강) |

- **[흥미 포인트]** Google DeepMind와 Gemini 합쳐진 이야기

### 실습 (18분)
- Google AI Studio 가입 + API Key 발급
- Claude Code로 Gemini 챗봇 앱 생성
- 실습 앱: **"디스플레이 기술 Q&A 챗봇"**
  - Gemini API 연동
  - System Prompt: "너는 디스플레이 공정 전문가야"
  - Streamlit 인터페이스

---

## 9강: AI 시뮬레이션 만들기 (30분)

### 오프닝 훅
> *"픽셀 하나가 어떻게 색을 만드는지 눈으로 보여줄 수 있다면?
> 포토공정에서 노광 패턴이 어떻게 생기는지 시뮬레이션할 수 있다면?"*

### 이론 (10분)
- 시뮬레이션의 종류: 물리, 광학, 공정, 통계
- 디스플레이 관련 시뮬레이션 아이디어들:
  - RGB 서브픽셀 레이아웃 (Diamond, Stripe, PenTile)
  - 색공간 변환 (sRGB ↔ DCI-P3 ↔ Adobe RGB)
  - 포토리소그래피 노광 패턴 시뮬레이터
  - 잉크젯 도포 균일성 시뮬레이터 (커피링 효과 포함)

### 실습 (20분)
- 실습 앱: **"RGB 픽셀 색상 혼합 & 색역 시뮬레이터"**
  - R, G, B 슬라이더 → 실시간 색상 조합
  - sRGB / DCI-P3 / Adobe RGB 영역 시각화
  - "이 색은 DCI-P3에서만 표현 가능합니다" AI 해설
  - Gemini API로 색상 용도 설명 자동 생성
- Streamlit Cloud 배포

---

## 10강: 웹앱 배포 플랫폼 심화 + AI 스펙 비교 앱 (30분)

> ⚠️ **강사 참고**: `antigravity.google` URL은 강의 준비 시점에 반드시 접속 확인 필요.
> 서비스 미제공 시 **Streamlit Cloud** 또는 **Firebase Studio**(idx.google.com)로 대체.
> 아래 실습은 Streamlit Cloud 기준으로도 100% 진행 가능하도록 작성됨.

### 오프닝 훅
> *"같은 앱을 GitHub Pages / Streamlit Cloud / Firebase Studio 어디에 올리느냐에 따라
> 성능·비용·유지보수가 완전히 달라진다.
> 오늘은 플랫폼을 '골라 쓰는 눈'을 기른다."*

### 이론 (15분)
- 배포 플랫폼 비교 — 목적에 따른 선택 기준

| 플랫폼 | 적합한 앱 | 무료 한도 | 특징 |
|--------|----------|----------|------|
| GitHub Pages | 정적 HTML/JS | 무제한 | 가장 빠름, 서버 없음 |
| Streamlit Cloud | Python 데이터앱 | 1앱 무료 | 배포 1분, Python 그대로 |
| Firebase Studio | Full-stack | 스파크 플랜 무료 | Google AI 통합 |
| Render | 모든 앱 | 750h/월 | Node.js/Python/Docker |

- Gemini + Google Workspace 통합 가능성 소개

### 실습 (15분)
- 실습 앱: **"디스플레이 스펙 비교 웹앱"**
  - 주요 스마트폰/TV 디스플레이 스펙 내장 데이터
  - 사용자가 기기 선택 → 스펙 비교 시각화
  - Streamlit Cloud에 배포 (백업: Firebase Studio)
- 강사가 사전에 확인한 플랫폼으로 실습 진행

> ✅ **이후 프로젝트 2 시작** → [projects/project2/](../../projects/project2/README.md)
