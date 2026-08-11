"""
GPT API를 이용한 Quarto RevealJS 강의록 자동 생성 스크립트
사용법: python generate_lectures.py
"""

import os
import time
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# ── 출력 디렉토리 ────────────────────────────────────────────
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

# ── RevealJS YAML 헤더 템플릿 ────────────────────────────────
def yaml_header(lecture_num: int, title: str, subtitle: str) -> str:
    return f"""---
title: "{title}"
subtitle: "{subtitle}"
author: "렛유인 KDC 강의"
date: today
execute:
  echo: true
  warning: false
lightbox: true
format:
  revealjs:
    theme: moon
    controls: true
    slide-number: true
    show-slide-number: all
    center: false
    incremental: true
    transition: slide
    background-transition: fade
    transition-speed: slow
    highlight-style: github
    footer: "KDC AI 바이브 코딩 실전 | {lecture_num}강"
    css: ../styles.css
    width: 1280
    height: 720
---
"""

# ── 강의별 콘텐츠 정의 ────────────────────────────────────────
LECTURES = [
    {
        "num": 1,
        "title": "AI 마인드셋 + Claude Pro 시작",
        "subtitle": "바이브 코딩이란? — 코드 없이 AI로 앱을 만드는 시대",
        "part": "PART 1 — 세팅 & 바이브 코딩 철학",
        "duration": "30분",
        "content": """
오프닝 훅: "2024년 2월, Andrej Karpathy(전 Tesla AI 디렉터)가 트윗을 올렸다. '나는 이제 코드를 거의 직접 쓰지 않는다. 전부 AI한테 시킨다.' 6시간 만에 50만 뷰. 이것이 바이브 코딩이다."

이론 (15분):
- 바이브 코딩이란? Andrej Karpathy가 말한 진짜 의미
- AI 개발 생태계 2025 지형도 — Claude vs GPT vs Gemini
- [흥미 포인트] Claude의 유출된 System Prompt 분석: Anthropic이 Claude에게 내린 숨겨진 지시들, Constitutional AI — "착한 AI"를 만드는 방법
- Claude Pro가 제공하는 것: 무제한 Claude 3.7 Sonnet, Projects — 나만의 AI 비서 공간, 확장 컨텍스트 (200K 토큰)
- 디스플레이 엔지니어가 AI를 써야 하는 이유: 삼성/LG 현업 활용 사례

실습 (15분):
- Claude.ai 로그인 및 Pro 활성화
- Projects 기능으로 "디스플레이 학습 프로젝트" 생성
- 첫 번째 프롬프트 실습:
  나는 디스플레이 산업 취업준비생이야.
  AI로 만들 수 있는 가장 인상적인 포트폴리오 앱 5가지를 제안해줘.
  각각 어떤 기술 스택을 쓸지도 알려줘.

학습 목표: AI 에이전트 방식 이해, Claude Pro 활성화
""",
    },
    {
        "num": 2,
        "title": "GitHub + Claude Code 환경 세팅",
        "subtitle": "취업 포트폴리오의 시작 — Git, GitHub, Claude Code",
        "part": "PART 1 — 세팅 & 바이브 코딩 철학",
        "duration": "30분",
        "content": """
오프닝 훅: "Pieter Levels(@levelsio)는 혼자서 AI를 이용해 연 수익 $5M(약 65억원)짜리 서비스를 만들었다. 그의 도구? GitHub + AI. 지금 이 환경을 세팅한다."

이론 (15분):
- Git vs GitHub — 버전 관리 핵심 개념
- Repository, Commit, Branch, Pull Request 개념
- GitHub Stars로 보는 2024~2025 인기 프로젝트 실시간 확인
- Claude Code 소개 — 터미널 기반 AI 코딩 에이전트
- CLAUDE.md — AI에게 "나는 이런 사람이야" 알려주기
- 취업 포트폴리오로서 GitHub 활용 전략

실습 (12분):
- GitHub 계정 생성 & 첫 Repository 만들기
- Claude Code 설치: npm install -g @anthropic-ai/claude-code
- 나만의 CLAUDE.md 작성 (디스플레이 취준생용)
- 첫 commit + push

핵심 명령어:
git init / git clone [URL]
git add [파일명]
git commit -m "커밋 메시지"
git push / git pull

학습 목표: GitHub 계정 + Claude Code 실행 환경 완성
""",
    },
    {
        "num": 3,
        "title": "Claude Code Skills & 커스텀 자동화",
        "subtitle": "반복 작업을 슬래시 명령어 하나로 — Skills & 프롬프트 패턴",
        "part": "PART 2 — Claude Code 심화 + 에이전트",
        "duration": "30분",
        "content": """
오프닝 훅: "유명 개발자 Simon Willison이 말했다: '나는 하루에 10개의 작은 앱을 만든다. AI 덕분에.' 오늘 우리도 30분 안에 하나 만든다."

이론 (12분):
- Skills — 반복 작업을 슬래시 명령어로 저장하는 방법
- 좋은 프롬프트 vs 나쁜 프롬프트 실제 비교
- CLAUDE.md 고급 설정 — 프로젝트별 맞춤화
- [특별 소개] cokacdir — Rust로 만든 AI 터미널 파일 매니저 (github.com/waterfirst/cokacdir)
  자연어로 파일 관리: "수율 데이터 파일 찾아서 열어줘"
- 프롬프트 패턴 4가지: 역할부여, 맥락제공, 출력형식지정, 제약조건

실습 (18분):
- /commit 스킬 사용해보기
- 나만의 /analyze-yield 커스텀 스킬 만들기
- 프롬프트 패턴 실습:
  역할: 디스플레이 공정 데이터 분석 전문가
  맥락: [배경 정보 입력]
  작업: [구체적 요청]
  출력형식: Python Streamlit 앱 코드
  제약: pandas, plotly만 사용
- cokacdir 터미널 실습

학습 목표: Skills 활용, 프롬프트 패턴 습득, 자동화 설정
""",
    },
    {
        "num": 4,
        "title": "Claude Agent 모드 + CLI-Anything",
        "subtitle": "AI가 20개 파일을 알아서 만든다 — 에이전트 모드의 세계",
        "part": "PART 2 — Claude Code 심화 + 에이전트",
        "duration": "30분",
        "content": """
오프닝 훅: "Claude에게 '앱 만들어줘'라고 하면 1개의 파일을 만든다. 에이전트 모드로 '앱 만들어줘'라고 하면 20개의 파일을, 테스트까지 하면서 만든다."

이론 (12분):
- 에이전트 모드 vs 일반 대화 모드 (실제 차이 시연)
- [특별 소개] CLI-Anything (github.com/waterfirst/CLI-Anything)
  어떤 소프트웨어든 AI 에이전트용 CLI로 자동 변환
  7단계 파이프라인: Analyze → Design → Implement → Test → Document → Publish
- Claude for Work — 기업 환경에서의 AI 활용 전략
  사내 AI 제한 현실 vs 개인 Claude Pro 활용법
- 멀티 에이전트 구조: 오케스트레이터 + 서브에이전트

실습 (18분):
- /feature-dev 워크플로우 체험
  프롬프트: "디스플레이 수율 분석 대시보드 만들어줘"
  Plan → Explore → Code → Review 과정 관찰
- 생성된 코드 구조 이해 (AI에게 설명 요청)
- CLI-Anything으로 나만의 AI 도구 만들기
- GitHub push

이후 프로젝트 1 시작: 나의 디스플레이 관심 분야 소개 웹페이지 (GitHub Pages 배포)
학습 목표: 에이전트 방식 이해, 기존 CLI 도구를 AI로 전환
""",
    },
    {
        "num": 5,
        "title": "Python Streamlit 앱 제작 & 배포",
        "subtitle": "PPI 계산기를 5분 만에 — Streamlit Cloud까지",
        "part": "PART 3 — 데이터 시각화 앱 3종",
        "duration": "30분",
        "content": """
오프닝 훅: "Streamlit은 2019년 출시 후 GitHub Star 38만 개 돌파. Python으로 웹앱을 '코드 거의 없이' 만들 수 있어서. AI 시대에 가장 어울리는 프레임워크."

이론 (12분):
- Streamlit 소개 & 구조 (선형 실행 모델)
- 핵심 위젯: st.slider, st.selectbox, st.file_uploader, st.plotly_chart
- Streamlit Community Cloud 무료 배포 방법
- Claude Code + Streamlit 협업 방식
- requirements.txt, app.py 구조

실습 앱: "디스플레이 픽셀 밀도(PPI) 계산기"
- 가로/세로 해상도 + 화면 크기(인치) 입력
- PPI 자동 계산 + 시각화
- 주요 스마트폰 제품과 비교 (Galaxy S24, iPhone 15, etc.)
- Claude Code 프롬프트로 전체 코드 생성
- Streamlit Cloud 배포까지 완료

핵심 코드 구조:
import streamlit as st
import math

st.title("디스플레이 PPI 계산기")
width = st.slider("가로 해상도(px)", 720, 3840, 1920)
height = st.slider("세로 해상도(px)", 720, 2160, 1080)
diagonal = st.number_input("화면 크기(인치)", 4.0, 85.0, 6.1)
ppi = math.sqrt(width**2 + height**2) / diagonal
st.metric("PPI", f"{ppi:.1f}")

학습 목표: Streamlit 앱 제작 및 클라우드 배포 경험
""",
    },
    {
        "num": 6,
        "title": "R Shiny 대시보드 제작 & 배포",
        "subtitle": "수율 트렌드를 한눈에 — R Shiny & shinyapps.io",
        "part": "PART 3 — 데이터 시각화 앱 3종",
        "duration": "30분",
        "content": """
사전 준비 필수: R 설치(cran.r-project.org), RStudio 설치(posit.co/downloads), shinyapps.io 계정, 패키지: install.packages(c("shiny","shinydashboard","ggplot2","dplyr","rsconnect"))

오프닝 훅: "R은 통계학자들이 만든 언어. 데이터 분석에서는 Python보다 강력한 면이 있다. Shiny는 R로 웹앱을 만드는 마법 같은 라이브러리."

이론 (12분):
- R Shiny 소개: UI + Server 구조 개념
- Streamlit vs Shiny 비교 — 언제 뭘 쓸까?
- shinydashboard로 전문 대시보드 만들기
- shinyapps.io 무료 배포 방법
- Claude Code로 R Shiny 코드 생성하는 방법

실습 앱: "수율 트렌드 모니터링 대시보드"
- CSV 파일 업로드 → 자동 시각화
- 날짜 범위 선택, 라인별 필터링
- 이상 구간 자동 하이라이트 (수율 95% 미만 경고 표시)
- ggplot2 트렌드 차트 + 통계 요약
- shinyapps.io 배포

핵심 코드 구조:
library(shiny)
library(ggplot2)
ui <- fluidPage(
  titlePanel("수율 트렌드"),
  sidebarLayout(
    sidebarPanel(fileInput("file", "CSV 업로드")),
    mainPanel(plotOutput("trend_plot"))
  )
)
server <- function(input, output) {
  output$trend_plot <- renderPlot({ ... })
}
shinyApp(ui, server)

학습 목표: R 기반 대시보드 제작, shinyapps.io 배포 경험
강사 체크: 수강생 R/RStudio 설치 여부 강의 전 확인 필수
""",
    },
    {
        "num": 7,
        "title": "Quarto 공정 분석 보고서 & GitHub Pages 배포",
        "subtitle": "PPT 수정 지옥에서 탈출 — 코드+글+차트가 하나로",
        "part": "PART 3 — 데이터 시각화 앱 3종",
        "duration": "30분",
        "content": """
오프닝 훅: "PowerPoint 보고서는 수정이 지옥이다. Quarto는 코드 + 글 + 차트가 하나로 묶인 '살아있는 보고서'. AI가 코드를 바꾸면 차트가 자동으로 바뀐다."

이론 (12분):
- Quarto란? R/Python 통합 문서 시스템
- 출력 형식: HTML 보고서, PDF, Slides(revealjs), 웹사이트
- Quarto vs Jupyter Notebook vs PPT 비교
- .qmd 파일 구조: YAML 헤더 + 마크다운 + 코드 청크
- GitHub Pages 자동 배포 방법 (gh-pages 브랜치)
- RevealJS 슬라이드: 이 강의가 바로 Quarto RevealJS!

실습: "디스플레이 공정 분석 보고서"
- 샘플 수율 데이터 + ggplot2/plotly 차트 자동 생성
- Claude Code로 .qmd 파일 전체 생성
- quarto render → HTML 보고서 생성
- GitHub Pages에 HTML 보고서 배포
- Quarto Slides — 발표 자료도 코드 한 줄로 전환

기본 .qmd 구조:
---
title: "디스플레이 공정 분석"
format: html
---
## 수율 트렌드

```{r}
library(ggplot2)
# 차트 코드
```

학습 목표: Quarto 보고서 작성, GitHub Pages 배포
""",
    },
    {
        "num": 8,
        "title": "Google AI Studio + Gemini API 챗봇",
        "subtitle": "Gemini 3.6 Flash API — 디스플레이 Q&A 챗봇 만들기",
        "part": "PART 4 — AI API + 시뮬레이션",
        "duration": "30분",
        "content": """
오프닝 훅: "Gemini 3.6 Flash를 공식 SDK로 연결하고 활성 한도·비용·품질을 직접 측정한다."

이론 (12분):
- Google AI Studio 소개 & Gemini API 구조
- API Key 발급 및 보안 관리 (.env + .gitignore)
- Gemini의 멀티모달 능력 (텍스트 + 이미지 + 영상)
- Claude API vs Gemini API 비교:
  항목 | Claude API | Gemini API
  무료한도 | API 유료 | 무료 티어 제공(활성 한도 확인)
  기본모델 | 사용 시점에 확인 | Gemini 3.6 Flash (stable)
  맥락창 | 200K 토큰 | 1M 토큰
  장점 | 코딩/분석 정확도 | 무료, Google 통합
  이 강의 활용 | 텔레그램 봇(13~14강) | 챗봇·시뮬레이션(8~9강)

실습 앱: "디스플레이 기술 Q&A 챗봇"
- Gemini API 연동
- System Prompt: "너는 디스플레이 공정 전문가야"
- Streamlit 인터페이스
- 대화 히스토리 유지

핵심 코드:
from google import genai
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
response = client.models.generate_content(
    model='gemini-3.6-flash', contents="OLED 포토공정 설명해줘"
)
print(response.text)

학습 목표: 외부 AI API 활용, Claude vs Gemini 비교 이해
""",
    },
    {
        "num": 9,
        "title": "AI 시뮬레이션 만들기",
        "subtitle": "픽셀의 색이 만들어지는 원리를 눈으로 — RGB 색역 시뮬레이터",
        "part": "PART 4 — AI API + 시뮬레이션",
        "duration": "30분",
        "content": """
오프닝 훅: "픽셀 하나가 어떻게 색을 만드는지 눈으로 보여줄 수 있다면? 포토공정에서 노광 패턴이 어떻게 생기는지 시뮬레이션할 수 있다면?"

이론 (10분):
- 시뮬레이션의 종류: 물리, 광학, 공정, 통계
- 디스플레이 관련 시뮬레이션 아이디어들:
  1. RGB 서브픽셀 레이아웃 (Diamond, Stripe, PenTile)
  2. 색공간 변환 (sRGB ↔ DCI-P3 ↔ Adobe RGB)
  3. 포토리소그래피 노광 패턴 시뮬레이터
  4. 잉크젯 도포 균일성 시뮬레이터 (커피링 효과 포함)
- Claude Code로 시뮬레이션 앱 생성하는 방법

실습 앱: "RGB 픽셀 색상 혼합 & 색역 시뮬레이터"
- R, G, B 슬라이더 → 실시간 색상 조합 표시
- sRGB / DCI-P3 / Adobe RGB 영역 시각화
- "이 색은 DCI-P3에서만 표현 가능합니다" AI 해설
- Gemini API로 색상 용도 설명 자동 생성
- Streamlit Cloud 배포

디스플레이 색공간 지식:
- sRGB: 일반 모니터/인터넷 표준 (Coverage 100%)
- DCI-P3: 영화관 표준 (sRGB보다 26% 넓음)
- Adobe RGB: 인쇄 전문가용
- Rec.2020: 미래 HDR TV 표준

학습 목표: 도메인 특화 시뮬레이터 제작, Gemini API 활용
""",
    },
    {
        "num": 10,
        "title": "웹앱 배포 플랫폼 심화",
        "subtitle": "같은 앱, 다른 플랫폼 — GitHub Pages / Streamlit / Firebase 비교",
        "part": "PART 4 — AI API + 시뮬레이션",
        "duration": "30분",
        "content": """
오프닝 훅: "같은 앱을 GitHub Pages / Streamlit Cloud / Firebase Studio 어디에 올리느냐에 따라 성능·비용·유지보수가 완전히 달라진다. 오늘은 플랫폼을 '골라 쓰는 눈'을 기른다."

이론 (15분):
배포 플랫폼 비교:
- GitHub Pages: 정적 HTML/JS | 무제한 무료 | 가장 빠름, 서버 없음
- Streamlit Cloud: Python 데이터앱 | 1앱 무료 | 배포 1분, Python 그대로
- Firebase Studio: Full-stack | 스파크 플랜 무료 | Google AI 통합
- Render: 모든 앱 | 750h/월 무료 | Node.js/Python/Docker

선택 기준:
- 포트폴리오 소개 페이지 → GitHub Pages
- Python 데이터 분석 앱 → Streamlit Cloud
- AI 풀스택 앱 → Firebase Studio
- API 서버 → Render

실습 앱: "디스플레이 스펙 비교 웹앱"
- 주요 스마트폰/TV 디스플레이 스펙 내장 데이터
- 사용자가 기기 선택 → 스펙 비교 시각화 (PPI, 색역, 밝기 등)
- Streamlit Cloud에 배포
- 동일 앱 Firebase Studio에도 배포 비교

이후 프로젝트 2 시작: 디스플레이 공정 시뮬레이터 or 데이터 분석 앱
학습 목표: 플랫폼별 특성 이해, 상황별 최적 플랫폼 선택 능력
""",
    },
    {
        "num": 11,
        "title": "배포 플랫폼 10종 총정리",
        "subtitle": "내 앱을 세상에 — 10개 플랫폼 비교 완전 정리",
        "part": "PART 5 — 배포 전략 & 보안",
        "duration": "30분",
        "content": """
오프닝 훅: "앱을 만들었는데 내 컴퓨터에서만 돌아간다면 의미가 없다. 10개 플랫폼 비교하고, 상황에 맞는 선택을 배운다."

이론 (20분):
10개 플랫폼 전체 비교:
1. GitHub Pages: HTML/정적 사이트 | 완전 무료 | 난이도 ⭐
2. Streamlit Cloud: Python 앱 | 무료 | 난이도 ⭐
3. shinyapps.io: R Shiny 앱 | 제한 무료 | 난이도 ⭐
4. Netlify: 정적 + 서버리스 | 무료 | 난이도 ⭐⭐
5. Vercel: Next.js/React | 무료 | 난이도 ⭐⭐
6. Firebase Hosting: 웹앱+DB | 무료 | 난이도 ⭐⭐
7. Render: 풀스택 앱 | 무료 | 난이도 ⭐⭐
8. Fly.io: 컨테이너 앱 | 제한 무료 | 난이도 ⭐⭐⭐
9. HuggingFace Spaces: AI/ML 앱 | 무료 | 난이도 ⭐⭐
10. Google Cloud Run: 프로덕션급 | 유료 | 난이도 ⭐⭐⭐

결정 가이드:
- HTML 파일 → GitHub Pages (가장 먼저 시도)
- Python 데이터 앱 → Streamlit Cloud (가장 쉬움)
- R 앱 → shinyapps.io
- AI/ML 모델 → HuggingFace Spaces
- 빠른 배포 → Netlify/Vercel (drag & drop)

실습 (10분):
- 프로젝트 1 결과물을 Netlify에도 배포 (drag & drop)
- 배포 URL 비교 (GitHub Pages vs Netlify)

학습 목표: 상황별 최적 플랫폼 선택 능력, 무료 배포 전략
""",
    },
    {
        "num": 12,
        "title": "환경 관리 & 보안 & GitHub Actions CI/CD",
        "subtitle": "API Key를 GitHub에 올리면 요금 폭탄 — 보안 필수 지식",
        "part": "PART 5 — 배포 전략 & 보안",
        "duration": "30분",
        "content": """
오프닝 훅: "2023년 삼성전자 직원들이 ChatGPT에 사내 코드를 올렸다가 내부 데이터가 유출됐다. API Key를 GitHub에 올렸다가 하루 만에 요금 폭탄 맞은 개발자들. 이런 사고를 방지하는 법을 배운다."

이론 (18분):

환경변수 & API Key 관리:
.env 파일 예시:
GEMINI_API_KEY=AIza...
ANTHROPIC_API_KEY=sk-ant-...
TELEGRAM_BOT_TOKEN=123456:ABC...

Python에서 불러오기:
from dotenv import load_dotenv
import os
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

.gitignore 필수 설정:
.env
__pycache__/
.DS_Store
*.pyc
~$*.xlsx

GitHub Actions 기초:
.github/workflows/deploy.yml:
name: Deploy to Streamlit
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

보안 체크리스트:
1. .env 파일은 절대 Git에 올리지 않는다
2. API Key를 코드에 직접 넣지 않는다
3. GitHub Secrets 활용
4. .gitignore 설정 확인

실습 (12분):
- .env 파일 설정 + .gitignore 적용 실습
- Claude Code로 GitHub Actions 워크플로우 생성
- GitHub Secrets 설정 — Actions에서 API Key 안전하게 사용

학습 목표: API Key 안전 관리, 자동 배포 파이프라인 구축
""",
    },
    {
        "num": 13,
        "title": "텔레그램 봇 기초 + Claude API 연결",
        "subtitle": "AI가 내 폰에 메시지를 보낸다 — 디스플레이 상담 봇 만들기",
        "part": "PART 6 — 텔레그램 봇 + 종합 실습",
        "duration": "30분",
        "content": """
오프닝 훅: "텔레그램 봇은 2016년부터 있었다. 그런데 AI가 들어가자 완전히 달라졌다. 지금 전 세계에서 공장 설비 알람, 주식 알림, 뉴스 요약 봇을 만들고 있다."

이론 (12분):
텔레그램 봇 작동 구조:
- BotFather → Bot Token 발급
- Polling (지속 감시) vs Webhook (이벤트 수신)
- python-telegram-bot 라이브러리 구조
- Claude API 연동 구조
- 실제 사례: 설비 데이터 → 텔레그램 알람 봇

실습 봇: "디스플레이 기술 상담 봇"
- BotFather에서 나만의 봇 생성 (@BotFather → /newbot)
- 봇 기능:
  /start → 환영 메시지
  /help → 사용법 안내
  /explain [공정명] → Claude API 답변 (포토, 에치, 잉크젯 등)
  일반 텍스트 → Claude가 자유 답변

핵심 코드 구조:
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler
import anthropic

async def explain_command(update, context):
    process = " ".join(context.args)
    response = call_claude(f"{process} 공정을 설명해줘")
    await update.message.reply_text(response)

app = ApplicationBuilder().token(BOT_TOKEN).build()
app.add_handler(CommandHandler("explain", explain_command))
app.run_polling()

학습 목표: 텔레그램 봇 제작, Claude API 연동
""",
    },
    {
        "num": 14,
        "title": "Gemini 봇 + 설비 알람 시스템",
        "subtitle": "AI 봇이 수율을 감시한다 — 자동 알람 시스템 구축",
        "part": "PART 6 — 텔레그램 봇 + 종합 실습",
        "duration": "30분",
        "content": """
오프닝 훅: "gemini_telebot 레포를 보면 텔레그램 봇이 Gmail 읽고, 캘린더 관리하고, GitHub에 자동 커밋까지 한다. AI 봇이 비서가 되는 시대. → github.com/waterfirst/gemini_telebot"

이론 (12분):
gemini_telebot 레포 구조 함께 탐색:
- PDCA 워크플로우 봇 (/pdca plan, /pdca do, /pdca report)
- Google Workspace 연동 (Gmail, Calendar, Drive)
- 550+ AI 스킬 라이브러리

설비 알람 봇 설계 패턴:
데이터 수집 (CSV/DB/API)
    ↓
임계값 판단 (수율 < 95%?)
    ↓
텔레그램 알람 전송

실습 봇: "디스플레이 수율 모니터링 알람 봇"
- 샘플 수율 데이터(CSV) 주기적 읽기
- 수율 95% 미만 → 경고 알람 자동 전송
- /status → 현재 수율 현황 리포트
- /ai [질문] → Gemini가 답변
- /summary → 오늘의 수율 요약 (Gemini 자동 작성)

핵심 알람 코드:
import schedule
import time

def check_yield():
    data = pd.read_csv("yield_data.csv")
    current_yield = data.iloc[-1]["yield"]
    if current_yield < 95:
        send_telegram_alert(f"⚠️ 수율 경고: {current_yield}% (기준: 95%)")

schedule.every(1).hours.do(check_yield)

학습 목표: 실시간 알람 시스템 구축, Gemini API + 텔레그램 통합
""",
    },
    {
        "num": 15,
        "title": "종합 통합 실습 — 모든 것을 하나로",
        "subtitle": "Streamlit + Gemini AI + 텔레그램 알람 — 풀스택 완성",
        "part": "PART 6 — 텔레그램 봇 + 종합 실습",
        "duration": "60분 (이 강의만 60분)",
        "content": """
강사 참고: 4개 시스템 통합은 30분에 완성 불가 — 이 강의만 60분으로 진행.
또는 examples/integrated_system.py 완성 코드를 미리 제공하고, 수강생이 수정하는 방식으로 진행.

시스템 구성도:
[수율 데이터 시뮬레이션]
          ↓
[Streamlit 대시보드] ← Gemini AI 분석
          ↓
[이상 감지 시 텔레그램 알람]
          ↓
[GitHub에 자동 저장 (Actions)]

목표: 위 시스템을 Claude Code로 구축하고 배포

순서 (60분):
1. (10분) Claude에게 전체 아키텍처 설계 요청 & 구조 이해
   프롬프트: "디스플레이 수율 모니터링 시스템을 만들어줘. Streamlit 대시보드 + Gemini AI 분석 + 텔레그램 알람이 연결된 구조로."

2. (25분) Claude Code로 각 파트 코드 생성
   - data_simulator.py — 수율 데이터 시뮬레이터
   - app.py — Streamlit 대시보드 + Gemini 분석
   - alert_bot.py — 텔레그램 알람 모듈

3. (15분) 연결 테스트 & 디버깅
   - 에러 메시지 Claude에게 그대로 붙여넣기
   - "이 에러 고쳐줘" 프롬프트

4. (10분) GitHub push + Streamlit 배포

완성 시스템 기능:
- 실시간 수율 데이터 시뮬레이션
- Streamlit에서 시각화 + Gemini AI 이상 원인 분석
- 수율 95% 미만 → 텔레그램 자동 경고
- GitHub Actions로 자동 배포

이후 프로젝트 3 시작: 나만의 AI 디스플레이 도구 (자유 주제, 전체 스택)
학습 목표: 전체 스택 통합, 풀스택 AI 앱 완성
""",
    },
    {
        "num": 16,
        "title": "최신 AI 트렌드 & 수료",
        "subtitle": "다음 단계는? — AI 개발자의 미래 로드맵",
        "part": "PART 6 — 텔레그램 봇 + 종합 실습",
        "duration": "30분",
        "content": """
오늘의 AI 뉴스 (10분):
- 최신 Claude 모델 변화 타임라인 (Claude 3 → 3.5 → 3.7 → 4.6)
- GitHub Trending 지금 Top 10 (실시간 확인)
- 유명 개발자들이 지금 만들고 있는 것들
- 디스플레이 × AI 최신 연구 소식:
  삼성전자 AI 수율 예측 시스템
  LG Display AI 기반 불량 검사
  BOE AI 공정 최적화

프로젝트 3 발표 (15분):
- 각자 3분 시연 → 기술 설명 → 어려웠던 점
- 평가 기준: 배포 URL 동작 + 도메인 활용도 + 코드 완성도
- 서로 피드백

다음 단계 로드맵 (5분):

초급 → 중급:
- LangChain / LlamaIndex — AI 앱 심화
- FastAPI — 백엔드 서버 구축
- Docker — 컨테이너 배포

중급 → 고급:
- MCP 서버 만들기 — Claude가 당신의 앱을 직접 사용하게
- Rust로 CLI 도구 만들기 (cokacdir처럼)
- RAG (검색 증강 생성) — 사내 문서 기반 AI

취업/이직 활용:
- GitHub 포트폴리오 3개 프로젝트
- 면접에서 "AI 도구로 실제 앱을 배포해봤습니다" 어필
- 디스플레이 도메인 지식 + AI 개발 = 희소성 있는 인재

수료 조건: 프로젝트 1·2·3 모두 제출
수료증 발급 후 Q&A 및 마무리
""",
    },
]

# ── GPT 프롬프트 ─────────────────────────────────────────────
SYSTEM_PROMPT = """당신은 Quarto RevealJS 프레젠테이션 전문가입니다.
주어진 강의 내용을 바탕으로 **완전한 Quarto RevealJS .qmd 파일**을 생성합니다.

반드시 지켜야 할 형식 규칙:
1. YAML 헤더는 이미 제공되므로 포함하지 마세요 (--- 없이 시작)
2. 섹션 구분: # 제목 {.section-title} (배경 구분용 대제목 슬라이드)
3. 일반 슬라이드: ## 제목 (또는 ## 제목 {.smaller})
4. 2단 레이아웃: ::: {.columns} / ::: {.column width="50%"} / ::: / :::
5. 강조 박스: ::: {.callout-tip} 또는 ::: {.callout-note} 또는 ::: {.callout-warning}
6. 탭 콘텐츠: ::: {.panel-tabset} / ### 탭이름 / ::: (탭 내용) / :::
7. 코드 블록: ```python 또는 ```bash 또는 ```r 형식
8. 점진적 공개: - 로 시작하는 목록 (incremental: true 설정됨)
9. 화살표/순서: →, ①②③ 활용
10. 슬라이드 수: 최소 10개 이상 (섹션 슬라이드 포함)

콘텐츠 구성 (순서 준수):
1. 오프닝 훅 슬라이드 (임팩트 있는 인용/통계)
2. 이 강의에서 배우는 것 (학습 목표)
3. 이론 슬라이드들 (2~4개)
4. 코드/실습 슬라이드 (실제 코드 포함)
5. 실습 앱 결과 / 데모 슬라이드
6. 핵심 정리 / 다음 강의 예고

강의 대상: 디스플레이 관련 학과 대학교 3~4학년 / 취업준비생
톤: 친근하고 실용적, 코딩 입문자도 이해 가능한 수준
언어: 한국어 (코드와 영어 기술 용어 제외)
"""

def generate_lecture_qmd(lecture: dict) -> str:
    """GPT API를 사용해 강의 .qmd 내용 생성"""

    user_msg = f"""다음 강의 내용으로 Quarto RevealJS 슬라이드를 만들어주세요.

강의 번호: {lecture['num']}강
강의 제목: {lecture['title']}
파트: {lecture['part']}
강의 시간: {lecture['duration']}

강의 내용:
{lecture['content']}

YAML 헤더는 이미 준비되어 있으니 포함하지 말고,
# 섹션 슬라이드부터 바로 시작해주세요.
최소 10개 이상의 슬라이드를 만들어주세요.
실제 코드 예제를 반드시 포함하세요.
"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
        ],
        temperature=0.7,
        max_tokens=4000,
    )

    return response.choices[0].message.content


def main():
    print("=" * 60)
    print("렛유인 AI 바이브 코딩 강의록 생성 시작")
    print(f"총 {len(LECTURES)}개 강의")
    print("=" * 60)

    for lecture in LECTURES:
        num = lecture["num"]
        filename = f"lecture_{num:02d}.qmd"
        filepath = os.path.join(OUT_DIR, filename)

        print(f"\n[{num:2d}/16] {lecture['title']} 생성 중...", end=" ", flush=True)

        # GPT API 호출
        body = generate_lecture_qmd(lecture)

        # YAML 헤더 + 본문 합치기
        header = yaml_header(num, lecture["title"], lecture["subtitle"])
        full_content = header + "\n" + body

        # 파일 저장
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(full_content)

        print(f"✓ 저장: {filename}")
        time.sleep(1)  # API rate limit 대응

    print("\n" + "=" * 60)
    print("✅ 전체 생성 완료!")
    print(f"저장 위치: {OUT_DIR}")
    print("\nQuarto 렌더링 방법:")
    print("  cd lectures")
    print("  quarto render lecture_01.qmd  # 개별 렌더링")
    print("=" * 60)


if __name__ == "__main__":
    main()
