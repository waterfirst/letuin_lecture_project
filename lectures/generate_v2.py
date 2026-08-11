"""
강의록 V2 — Quarto RevealJS 고품질 재생성
- R ggplot2 / knitr 차트·표 포함
- auto-animate, fragment, panel-tabset, background 슬라이드
- 세련된 커스텀 CSS + 폰트 최적화
"""
import os, time
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
OUT = os.path.dirname(os.path.abspath(__file__))

# ── YAML 헤더 ────────────────────────────────────────────────
def header(num, title, subtitle, bg_color="#0d1b2a"):
    return f"""---
title: "{title}"
subtitle: "{subtitle}"
author: "렛유인 KDC"
date: today
engine: knitr
execute:
  echo: true
  warning: false
  message: false
  fig-width: 9
  fig-height: 4.5
format:
  revealjs:
    theme: [moon, ../custom.scss]
    slide-number: c/t
    show-slide-number: all
    controls: true
    progress: true
    center: false
    incremental: false
    transition: slide
    background-transition: fade
    chalkboard: true
    preview-links: auto
    highlight-style: dracula
    code-line-numbers: true
    footer: "렛유인 KDC | AI 바이브 코딩 실전 | {num}강"
    width: 1280
    height: 720
    margin: 0.1
    logo: ../logo.png
---
"""

# ── GPT 시스템 프롬프트 ──────────────────────────────────────
SYSTEM = """당신은 Quarto RevealJS 강의 슬라이드 전문 디자이너입니다.
아래 규칙을 반드시 준수하여 완전한 슬라이드 본문(YAML 헤더 제외)을 생성하세요.

## 필수 기술 요소 (모두 포함)

### 1. R 코드 청크 — ggplot2 차트 (최소 2개)
```{r}
#| echo: false
#| fig-width: 9
#| fig-height: 4.5
library(ggplot2); library(dplyr); library(scales)
# 강의 내용과 관련된 디스플레이 데이터로 차트 생성
```

### 2. knitr 테이블 (최소 1개)
```{r}
#| echo: false
knitr::kable(df, caption="표 제목", align=c("l","r","r"))
```

### 3. auto-animate 슬라이드 쌍
## 슬라이드A {auto-animate="true"}
내용A

## 슬라이드B {auto-animate="true"}
내용A + 추가내용B  ← 같은 요소가 애니메이션으로 이동

### 4. Fragment 애니메이션
::: {.fragment .fade-in}
내용
:::
::: {.fragment .highlight-red}
강조
:::

### 5. Panel tabset
::: {.panel-tabset}
### 탭1
내용1
### 탭2
내용2
:::

### 6. 컬럼 레이아웃
::: {.columns}
::: {.column width="45%"}
왼쪽
:::
::: {.column width="55%"}
오른쪽
:::
:::

### 7. 배경색 섹션 슬라이드
# 섹션 제목 {background="#1F4E79"}

### 8. callout 박스
::: {.callout-tip title="팁"}
내용
:::
::: {.callout-warning title="주의"}
내용
:::

### 9. 코드 라인 하이라이트
```python
코드
``` {code-line-numbers="1-2|3|5-7"}

## 슬라이드 구성 원칙
- 슬라이드 총 14~18개 (섹션 포함)
- 텍스트 최소화, 시각 자료 최대화
- 각 슬라이드는 1가지 핵심 메시지
- 코드 슬라이드: 실제 실행 가능한 코드
- R 차트: 디스플레이 공정/수율/스펙 데이터 사용
- 한국어 사용 (영어 기술 용어 혼용 허용)
- 불필요한 --- 구분선 생략 (## 헤딩이 슬라이드 구분)

## 폰트 크기 가이드
- 일반: {.smaller} 클래스 적용
- 코드: 기본 크기 유지
- 표: {.smaller} 적용

반드시 YAML 헤더 없이 바로 # 섹션 슬라이드로 시작하세요.
"""

LECTURES = [
  (1,  "AI 마인드셋 + Claude Pro 시작",
       "바이브 코딩이란? — 코드 없이 AI로 앱을 만드는 시대",
       """
강의 내용: PART 1 (30분)
오프닝: Andrej Karpathy "나는 코드를 거의 직접 쓰지 않는다" 트윗 → 50만 뷰

이론 (15분):
• 바이브 코딩 개념: 자연어 지시 → AI 코드 생성 → 결과 확인 사이클
• AI 개발 도구 비교: Claude vs GPT-4o vs Gemini 성능/비용/특징 비교표
• Constitutional AI: Anthropic의 안전 AI 원칙 (유출된 System Prompt 공개 분석)
• Claude Pro 기능: 200K 컨텍스트, Projects, Artifacts
• 2025년 AI 생태계 지형도 차트 (시장 점유율, 분기별 성장)
• 디스플레이 엔지니어 × AI: 삼성/LG 현업 활용 비율 데이터

실습 (15분):
• Claude.ai 로그인 → Projects 생성 → 첫 프롬프트
• 예시 프롬프트: "디스플레이 산업 취업준비생용 포트폴리오 앱 5가지 제안"

시각화 아이디어:
• R ggplot2: AI 도구별 GitHub Star 성장 추이 라인 차트 (2023~2025)
• R kable: Claude vs GPT vs Gemini 기능 비교표 (컨텍스트/무료한도/특기)
• Fragment: 바이브 코딩 단계 (지시→생성→테스트→배포) 순차 등장
"""),
  (2,  "GitHub + Claude Code 환경 세팅",
       "취업 포트폴리오의 시작 — Git, GitHub, Claude Code",
       """
강의 내용: PART 1 (30분)
오프닝: Pieter Levels (@levelsio) — 혼자서 AI+GitHub로 연 $5M 수익

이론 (15분):
• Git 워크플로우: Working Dir → Staging → Local Repo → Remote 다이어그램
• GitHub 포트폴리오 전략: Contribution Graph, README, Pinned Repos
• Claude Code란: 터미널 기반 AI 에이전트, CLAUDE.md 컨텍스트 파일
• 디스플레이 취준생 포트폴리오 예시: Star 100+ repos 유형 분석

실습 (12분):
• GitHub 계정 → New Repo → README 작성
• npm install -g @anthropic-ai/claude-code → 첫 실행
• CLAUDE.md: "나는 디스플레이 공학과 4학년, Python/R 가능, 수율 분석 관심"

시각화 아이디어:
• R ggplot2: Git 브랜치 전략 시각화 (main/dev/feature 흐름)
• R kable: git 명령어 치트시트 표 (명령어/기능/예시)
• auto-animate: CLAUDE.md 없는 버전 → 있는 버전 Claude 응답 품질 비교
"""),
  (3,  "Claude Code Skills & 커스텀 자동화",
       "반복 작업을 슬래시 명령어 하나로",
       """
강의 내용: PART 2 (30분)
오프닝: Simon Willison "나는 하루 10개 앱을 만든다. AI 덕분에."

이론 (12분):
• Claude Code Skills: /commit, /review, /test 내장 스킬 vs 커스텀 스킬
• 프롬프트 품질 비교: 나쁜 예 vs 좋은 예 (역할·맥락·형식·제약 4요소)
• CLAUDE.md 고급 설정: 프로젝트별 AI 행동 커스터마이즈
• cokacdir 소개: Rust AI 터미널 파일 매니저 (자연어 명령)

실습 (18분):
• /analyze-yield 커스텀 스킬 직접 작성
• 프롬프트 패턴 실습: 디스플레이 수율 데이터 분석 요청

시각화 아이디어:
• R ggplot2: 좋은 프롬프트 vs 나쁜 프롬프트 응답 품질 점수 bar chart
• R kable: 4대 프롬프트 요소 설명표 (역할/맥락/작업/출력형식)
• Panel tabset: 나쁜 프롬프트 예시 / 좋은 프롬프트 예시 / 결과 비교
"""),
  (4,  "Claude Agent 모드 + CLI-Anything",
       "AI가 20개 파일을 알아서 만든다",
       """
강의 내용: PART 2 (30분)
오프닝: "일반모드: 1개 파일. 에이전트 모드: 20개 파일 + 테스트까지"

이론 (12분):
• 에이전트 모드 구조: Orchestrator → Subagent 병렬 실행 다이어그램
• Plan→Explore→Code→Review 4단계 워크플로우
• CLI-Anything: 7단계 파이프라인 (Analyze→Design→Implement→Test→Document→Publish)
• 멀티 에이전트 vs 단일 에이전트 성능 비교 데이터

실습 (18분):
• "디스플레이 수율 분석 대시보드 만들어줘" → 생성 과정 관찰
• CLI-Anything으로 나만의 AI 도구 만들기
• 생성된 코드 구조 분석

시각화:
• R ggplot2: 멀티 에이전트 작업 완료 시간 비교 bar chart
• R kable: 에이전트 모드 vs 일반 모드 비교표
• auto-animate: 파이프라인 단계별 슬라이드 (단계가 하나씩 추가)
"""),
  (5,  "Python Streamlit 앱 제작 & 배포",
       "PPI 계산기를 5분 만에 — Streamlit Cloud까지",
       """
강의 내용: PART 3 (30분)
오프닝: GitHub Star 38만 돌파. "Python으로 웹앱을 코드 없이 만드는 시대"

이론 (12분):
• Streamlit 선형 실행 모델: 위→아래 순서 실행 원리
• 핵심 위젯: st.slider, st.selectbox, st.file_uploader, st.plotly_chart, st.metric
• Streamlit Community Cloud 무료 배포 절차
• requirements.txt 작성법

실습: 디스플레이 PPI 계산기
• 입력: 가로/세로 해상도, 화면 크기(인치)
• 출력: PPI 수치 + 주요 기기 비교 차트
• Streamlit Cloud 배포

시각화:
• R ggplot2: 주요 디스플레이 기기 PPI 비교 가로 bar chart
  (Galaxy S24/iPhone 15/iPad Pro/4K TV/Full HD 모니터 등)
• R kable: Streamlit 핵심 위젯 정리표 (위젯명/기능/예시코드)
• Panel tabset: 코드 / 실행 결과 / 배포 방법
"""),
  (6,  "R Shiny 대시보드 제작 & 배포",
       "수율 트렌드를 한눈에 — R Shiny & shinyapps.io",
       """
강의 내용: PART 3 (30분)
⚠️ 사전 준비: R + RStudio + shinyapps.io 계정 필수

오프닝: "R은 통계학자의 언어. Shiny는 R로 웹앱을 만드는 마법."

이론 (12분):
• Shiny 구조: ui (레이아웃) + server (로직) + reactive 개념
• Streamlit vs Shiny 비교: 언어/구조/배포/적합 용도
• shinydashboard 구성요소: header/sidebar/body

실습: 수율 트렌드 모니터링 대시보드
• CSV 업로드 → 자동 시각화
• 날짜 범위 선택, 라인 필터
• 수율 95% 미만 구간 자동 빨간 하이라이트
• shinyapps.io 배포

시각화:
• R ggplot2: 디스플레이 라인별 일별 수율 트렌드 차트 (샘플 데이터)
  수율 95% 기준선 + 이상 구간 빨간 영역 표시
• R kable: Shiny ui 함수 정리표
• auto-animate: ui 코드 → server 코드 → 완성 앱 단계별 등장
"""),
  (7,  "Quarto 공정 분석 보고서 & GitHub Pages",
       "PPT 수정 지옥 탈출 — 코드+글+차트가 하나로",
       """
강의 내용: PART 3 (30분)
오프닝: "PPT 수정 지옥. 데이터 바뀌면 차트도 다시, 표도 다시, 번호도 다시."

이론 (12분):
• Quarto .qmd 구조: YAML 헤더 + 마크다운 + 코드 청크
• 출력 형식 비교: HTML/PDF/Slides/Website
• Quarto vs Jupyter vs PPT 3가지 비교표
• GitHub Pages 자동 배포 (gh-pages 브랜치)
• 이 슬라이드 자체가 Quarto RevealJS!

실습: 디스플레이 공정 분석 보고서
• 샘플 수율 데이터 + ggplot2 차트 자동 생성
• quarto render → HTML 보고서
• GitHub Pages 배포

시각화:
• R ggplot2: 파라미터별 수율 상관관계 산점도 + 회귀선
• R kable: Quarto vs Jupyter vs PPT 비교표
• Fragment: Quarto 작성 → render → 배포 단계 순차 등장
"""),
  (8,  "Google AI Studio + Gemini API 챗봇",
       "Gemini 3.6 Flash와 공식 GenAI SDK",
       """
강의 내용: PART 4 (30분)
오프닝: "Gemini 3.6 Flash를 공식 SDK로 연결하고 활성 한도와 품질을 직접 확인한다."

이론 (12분):
• Gemini API 구조: API Key → Model → generate_content()
• .env 보안 관리: dotenv 패턴
• Claude API vs Gemini API 비교 (현재 모델/가격/맥락창/데이터 정책/평가셋)
• 멀티모달: 텍스트+이미지+영상 입력 가능

실습: 디스플레이 기술 Q&A 챗봇
• Gemini API + Streamlit 인터페이스
• System Prompt: "너는 디스플레이 공정 전문가야"
• 대화 히스토리 유지

시각화:
• R ggplot2: 같은 홀드아웃에서 지연·비용·정확도 비교 (실측값만 사용)
• R kable: Claude vs Gemini 상세 비교표
• Panel tabset: API Key 발급 / 코드 / 실행 결과
"""),
  (9,  "AI 시뮬레이션 만들기",
       "픽셀의 색이 만들어지는 원리를 눈으로",
       """
강의 내용: PART 4 (30분)
오프닝: "픽셀 하나가 어떻게 색을 만드는가? 시뮬레이션으로 직접 보자."

이론 (10분):
• 디스플레이 색공간: sRGB / DCI-P3 / Adobe RGB / Rec.2020
• 색역(Color Gamut) 개념: CIE 1931 xy 색도도
• RGB 서브픽셀 레이아웃: Stripe / Diamond / PenTile 비교
• 시뮬레이션 종류: 광학/공정/통계 시뮬레이션

실습: RGB 색상 혼합 & 색역 시뮬레이터
• R/G/B 슬라이더 → 색상 조합
• sRGB/DCI-P3 경계 시각화
• Gemini API: 색상 용도 자동 해설

시각화:
• R ggplot2: CIE 1931 xy 색도도에 sRGB/DCI-P3/Rec2020 삼각형 오버레이
• R ggplot2: RGB 서브픽셀 레이아웃 비교 (Stripe vs Diamond)
• R kable: 색공간별 커버리지 비교표
"""),
  (10, "웹앱 배포 플랫폼 심화",
       "같은 앱, 다른 플랫폼 — 선택 기준 마스터",
       """
강의 내용: PART 4 (30분)
오프닝: "같은 앱, GitHub Pages vs Streamlit vs Firebase — 결과가 다르다."

이론 (15분):
• 플랫폼 비교 4종: GitHub Pages / Streamlit Cloud / Firebase / Render
  — 적합 앱 유형 / 무료 한도 / 배포 속도 / 특징
• 선택 가이드: 앱 종류별 최적 플랫폼 결정 트리
• Firebase Studio: Google AI 통합 Full-stack

실습: 디스플레이 스펙 비교 웹앱
• 주요 기기(Galaxy/iPhone/iPad/TV) 스펙 내장 데이터
• PPI/색역/밝기 비교 시각화 → Streamlit Cloud 배포

시각화:
• R ggplot2: 플랫폼별 배포 난이도 vs 기능 버블 차트
• R kable: 4대 플랫폼 상세 비교표
• Fragment: 앱 종류별 플랫폼 선택 가이드 순차 등장
"""),
  (11, "배포 플랫폼 10종 총정리",
       "내 앱을 세상에 — 10개 플랫폼 완전 정리",
       """
강의 내용: PART 5 (30분)
오프닝: "앱을 만들었는데 내 컴퓨터에서만 돌아간다면?"

이론 (20분):
10개 플랫폼:
1. GitHub Pages — HTML/정적, 완전무료, ⭐
2. Streamlit Cloud — Python, 무료, ⭐
3. shinyapps.io — R Shiny, 제한무료, ⭐
4. Netlify — 정적+서버리스, 무료, ⭐⭐
5. Vercel — Next.js/React, 무료, ⭐⭐
6. Firebase — 웹앱+DB, 무료, ⭐⭐
7. Render — 풀스택, 무료, ⭐⭐
8. Fly.io — 컨테이너, 제한무료, ⭐⭐⭐
9. HuggingFace Spaces — AI/ML, 무료, ⭐⭐
10. Google Cloud Run — 프로덕션, 유료, ⭐⭐⭐

실습: Netlify drag & drop 배포 (1분)

시각화:
• R ggplot2: 10개 플랫폼 난이도 vs 무료한도 산점도 (버블 크기=기능수)
• R kable: 10개 플랫폼 전체 비교표
• Panel tabset: 입문자 추천 / 중급자 추천 / 고급자 추천
"""),
  (12, "환경 관리 & 보안 & GitHub Actions CI/CD",
       "API Key를 GitHub에 올리면 요금 폭탄",
       """
강의 내용: PART 5 (30분)
오프닝: "2023년 삼성 직원 ChatGPT 사내 코드 유출 사건. API Key 노출로 하루 $500 청구된 개발자."

이론 (18분):
• .env 파일: API Key 분리 관리
• .gitignore 필수 항목: .env, __pycache__, .DS_Store
• dotenv 패턴: Python load_dotenv()
• GitHub Secrets: Actions에서 환경변수 안전 사용
• GitHub Actions: push → 자동 테스트 → 자동 배포 워크플로우

실습 (12분):
• .env + .gitignore 설정
• Claude Code로 GitHub Actions deploy.yml 생성
• GitHub Secrets 설정

시각화:
• R ggplot2: CI/CD 파이프라인 흐름도 (push→test→build→deploy)
• R kable: .gitignore 필수 항목 표 (파일/이유/위험도)
• auto-animate: .env 없는 코드 → .env 있는 안전한 코드 전환
"""),
  (13, "텔레그램 봇 기초 + Claude API 연결",
       "AI가 내 폰에 메시지를 보낸다",
       """
강의 내용: PART 6 (30분)
오프닝: "2016년부터 있던 텔레그램 봇. AI가 들어가자 완전히 달라졌다."

이론 (12분):
• 텔레그램 봇 구조: BotFather → Token → Polling/Webhook
• python-telegram-bot 라이브러리 구조
• Claude API 연동: anthropic.Anthropic() → messages.create()
• 실사례: 공장 설비 알람봇 / 수율 알림봇

실습: 디스플레이 기술 상담 봇
• /start /help /explain [공정명] 커맨드
• 일반 텍스트 → Claude 자유 답변

시각화:
• R ggplot2: 텔레그램 봇 메시지 흐름 다이어그램
• R kable: 봇 명령어 목록표 (명령어/기능/예시)
• Panel tabset: BotFather 설정 / Python 코드 / 실행 결과
"""),
  (14, "Gemini 봇 + 설비 알람 시스템",
       "AI 봇이 수율을 24시간 감시한다",
       """
강의 내용: PART 6 (30분)
오프닝: "gemini_telebot: Gmail 읽고, 캘린더 관리하고, GitHub 커밋까지 — AI 비서의 시대"

이론 (12분):
• gemini_telebot 구조: PDCA 워크플로우 + Google Workspace 연동
• 설비 알람 패턴: CSV 읽기 → 임계값 판단 → 텔레그램 전송
• schedule 라이브러리: 주기적 자동 실행
• APScheduler vs schedule 비교

실습: 수율 모니터링 알람 봇
• 샘플 수율 CSV → 95% 미만 → 경고 알람
• /status /summary 명령어

시각화:
• R ggplot2: 시간별 수율 데이터 + 95% 임계선 + 알람 발생 포인트 표시
• R kable: 알람 봇 설계 패턴 표
• auto-animate: 데이터 수집 → 판단 → 알람 단계 애니메이션
"""),
  (15, "종합 통합 실습 — 모든 것을 하나로",
       "Streamlit + Gemini AI + 텔레그램 알람 풀스택 완성 (60분)",
       """
강의 내용: PART 6 (60분 — 이 강의만 60분)

시스템 구성:
수율 데이터 시뮬레이션 → Streamlit 대시보드(Gemini AI 분석) → 텔레그램 알람 → GitHub Actions

60분 순서:
1. (10분) Claude에게 전체 아키텍처 설계 요청
2. (25분) Claude Code로 코드 생성: data_simulator.py / app.py / alert_bot.py
3. (15분) 연결 테스트 & 디버깅
4. (10분) GitHub push + Streamlit 배포

시각화:
• R ggplot2: 전체 시스템 아키텍처 다이어그램 (노드-엣지 그래프)
• R ggplot2: 시뮬레이션 수율 데이터 실시간 트렌드 + AI 분석 결과
• R kable: 3개 파일 역할 정리표 (파일명/역할/핵심코드)
• Panel tabset: data_simulator.py / app.py / alert_bot.py 코드
"""),
  (16, "최신 AI 트렌드 & 수료",
       "다음 단계는? — 2025~2026 AI 개발자 로드맵",
       """
강의 내용: PART 6 (30분)

오늘의 AI 뉴스 (10분):
• Claude 모델 타임라인: 3.0 → 3.5 → 3.7 → 4.6
• GitHub Trending Top 10 (실시간)
• 디스플레이 × AI: 삼성/LG 공개 사례

프로젝트 3 발표 (15분):
• 각자 3분 발표 → 기술 설명 → 어려운 점
• 동료 피드백

다음 단계 로드맵 (5분):
• 초급→중급: FastAPI, Docker, LangChain
• 중급→고급: MCP 서버 제작, Rust CLI, RAG
• 취업 활용: GitHub 포트폴리오 3종 + 면접 어필법

시각화:
• R ggplot2: Claude 모델별 벤치마크 성능 비교 bar chart
• R ggplot2: AI 개발자 학습 로드맵 타임라인 (가로 간트 차트 스타일)
• R kable: 수료 후 다음 단계 커리큘럼 표
• Fragment: 수료 축하 메시지 순차 등장
"""),
]

def gen(num, title, subtitle, content):
    prompt = f"""
{content}

위 강의 내용으로 Quarto RevealJS 슬라이드 본문(YAML 없이)을 만드세요.
- 슬라이드 14~18개
- R ggplot2 차트 최소 2개 (위의 시각화 아이디어 참고, 실제 실행 가능한 샘플 데이터 포함)
- knitr::kable() 표 최소 1개
- auto-animate 슬라이드 1쌍 이상
- fragment 애니메이션 포함
- panel-tabset 1개 이상
- 배경색 섹션 슬라이드 사용 (# 제목 {{background="#색코드"}})
- 폰트가 슬라이드에 꽉 차지 않도록 {{.smaller}} 적절히 사용
- 강의 번호: {num}강
"""
    r = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": prompt},
        ],
        temperature=0.6,
        max_tokens=5000,
    )
    return r.choices[0].message.content


def main():
    print("=" * 60)
    print("강의록 V2 생성 시작 (R ggplot2 + 시각화 강화)")
    print("=" * 60)

    for num, title, subtitle, content in LECTURES:
        fname = f"lecture_{num:02d}.qmd"
        fpath = os.path.join(OUT, fname)
        print(f"[{num:2d}/16] {title} ...", end=" ", flush=True)

        body = gen(num, title, subtitle, content)

        # YAML 헤더 + 본문
        full = header(num, title, subtitle) + "\n" + body

        with open(fpath, "w", encoding="utf-8") as f:
            f.write(full)

        print(f"done → {fname}")
        time.sleep(1)

    print("\n" + "=" * 60)
    print("V2 생성 완료!")
    print("=" * 60)


if __name__ == "__main__":
    main()
