# Lecture 11 폴더 구조 분석 및 실행 리포트

## 1. 실행 상태 확인

### 현재 상태: ✅ **정상 작동 중**

```
VITE v6.4.2  ready in 307 ms
➜  Local:   http://localhost:5173/lecture01/
```

개발 서버는 정상적으로 실행되고 있습니다. 브라우저에서 `http://localhost:5173/lecture01/`로 접속 가능합니다.

---

## 2. 폴더 구조 비교

### colleague_repo/lecture01 (참고 프로젝트)

```
colleague_repo/lecture01/
├── .git/
├── .vite/
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/                      ⭐ 이미지 폴더
│   ├── comic.png
│   ├── logo.png
│   ├── panel1.png
│   ├── panel2.png
│   ├── panel3.png
│   ├── panel4.png
│   ├── traditional-coding.png
│   └── vibe-coding.png
├── src/
│   ├── App.tsx                 (1,892줄)
│   ├── index.css               (대형 스타일시트)
│   └── main.tsx
└── 루트 이미지 파일들/
    ├── 37FA2950-FB5C-4E04-BA29-BD47C5AAA4F1_1_105_c.jpeg
    ├── F3833872-8F44-4F7B-BE4A-0BE6A0EBAEA9_1_105_c.jpeg
    ├── p1.png
    ├── p2.png
    ├── p3.png
    ├── p4.png
    ├── p5.png
    └── p6.png
```

### lecture_11 (현재 프로젝트)

```
lecture_11/
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── node_modules/
└── src/
    ├── App.tsx                 (1,497줄)
    ├── index.css
    └── main.tsx
```

**❌ 누락: public/ 폴더와 이미지 파일**

---

## 3. 이미지 사용 현황 (colleague_repo/lecture01)

colleague_repo/lecture01의 App.tsx에서 다음 6개 이미지를 사용:

```tsx
// 1. 전통적인 코딩 vs 바이브 코딩 비교 이미지 (2개)
<img src="/lecture01/traditional-coding.png" alt="전통적인 코딩 방식" />
<img src="/lecture01/vibe-coding.png" alt="바이브 코딩 방식" />

// 2. 만화 패널 (4개)
<img src="/lecture01/panel1.png" alt="복잡한 원리" />
<img src="/lecture01/panel2.png" alt="단순한 시작" />
<img src="/lecture01/panel3.png" alt="목적지 설정" />
<img src="/lecture01/panel4.png" alt="여행 성공" />
```

---

## 4. 실행이 안 되는 이유 진단

### 가능한 원인들:

1. **이미지 파일 누락** (가장 유력)
   - public/ 폴더가 없어서 이미지를 로드할 수 없음
   - 브라우저 콘솔에서 404 에러 발생 예상

2. **vite.config.ts의 base 경로 설정**
   - 현재 `base: '/lecture01/'`로 설정됨
   - 이미지 경로도 `/lecture01/...`로 참조해야 함

3. **CSS 미완성**
   - index.css가 colleague_repo와 다를 수 있음

---

## 5. 이미지 추가 방안 (Gemini/GPT 활용)

### 방안 1: AI 이미지 생성 API 사용

#### Gemini Imagen 3 (추천)
```python
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Imagen 3로 이미지 생성
model = genai.ImageGenerationModel('imagen-3.0-generate-001')

# 예: traditional-coding.png 생성
prompt = """
A side-by-side comparison illustration showing traditional coding vs modern AI-assisted coding.
Left side: Engineer frustrated with complex code syntax, error messages, and documentation books.
Right side: Engineer happy with AI assistant generating clean code from natural language descriptions.
Style: Modern tech illustration, clean lines, blue and green color scheme.
"""

response = model.generate_images(
    prompt=prompt,
    number_of_images=1,
    safety_filter_level="block_few",
    person_generation="allow_adult"
)

# 이미지 저장
response.images[0].save('public/traditional-coding.png')
```

#### DALL-E 3 (OpenAI)
```python
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

response = client.images.generate(
    model="dall-e-3",
    prompt="""
    A clean, modern illustration comparing traditional coding (left) and AI-assisted coding (right).
    Left: Stressed engineer with complex code and error messages.
    Right: Happy engineer with AI generating code from descriptions.
    Style: Flat design, professional, tech-themed.
    """,
    size="1792x1024",
    quality="hd",
    n=1,
)

# URL에서 다운로드하여 저장
import requests
image_url = response.data[0].url
img_data = requests.get(image_url).content
with open('public/traditional-coding.png', 'wb') as f:
    f.write(img_data)
```

### 방안 2: 웹 기반 도구 사용

1. **Google AI Studio** (무료)
   - https://aistudio.google.com
   - Imagen 2/3 직접 사용
   - 프롬프트 입력 → 이미지 다운로드

2. **ChatGPT (GPT-4)** (유료)
   - ChatGPT Plus 구독 필요
   - DALL-E 3 내장
   - 프롬프트 입력 → 이미지 생성

3. **Midjourney** (Discord 기반)
   - 고품질 일러스트
   - `/imagine` 명령어 사용

### 방안 3: 기존 이미지 복사 (빠른 해결)

```bash
# colleague_repo의 이미지를 lecture_11로 복사
mkdir -p lecture_11/public
cp colleague_repo/lecture01/public/*.png lecture_11/public/
```

**단점**: 11강 내용과 맞지 않는 이미지일 수 있음

---

## 6. lecture_11에 필요한 이미지 목록

### Gemini 생태계 관련 이미지 제안:

1. **gemini-ecosystem.png**
   - Gemini Pro, NotebookLM, Firebase, AI Studio, Telegram Bot 5개 도구 아이콘
   - 화살표로 연결된 생태계 다이어그램

2. **api-key-workflow.png**
   - API Key 발급 → .env 저장 → Python 호출 3단계 플로우

3. **notebooklm-demo.png**
   - 논문 업로드 → 질문 → 출처 기반 답변 스크린샷

4. **pricing-comparison.png**
   - Gemini Pro vs Claude Pro vs GPT-4 Pro 비교 차트

5. **firebase-setup.png**
   - Firebase Console 5단계 설정 플로우

6. **security-checklist.png**
   - API Key 보안 체크리스트 시각화

---

## 7. 즉시 실행 가능한 수정 방안

### Step 1: public 폴더 생성
```bash
mkdir lecture_11/public
```

### Step 2: vite.config.ts 확인
```typescript
// lecture_11/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/lecture01/',  // 또는 '/lecture11/'로 변경
})
```

### Step 3: 임시 플레이스홀더 이미지 추가

App.tsx에서 이미지 태그를 찾아 임시로 주석 처리하거나, SVG 아이콘으로 대체:

```tsx
// 이미지 대신 lucide-react 아이콘 사용
import { Bot, Cloud, Database } from 'lucide-react';

// 기존
<img src="/gemini-ecosystem.png" alt="Gemini Ecosystem" />

// 대체
<div className="icon-placeholder">
  <Bot size={64} color="#4285F4" />
  <Cloud size={64} color="#34A853" />
  <Database size={64} color="#FBBC04" />
</div>
```

### Step 4: 개발 서버 재시작
```bash
npm run dev
```

---

## 8. 이미지 생성 프롬프트 예시 (Gemini/GPT)

### 1. Gemini Ecosystem Diagram
```
Create a modern tech ecosystem diagram showing 5 interconnected Google AI tools:
1. Gemini Pro (blue robot icon)
2. NotebookLM (green book icon)
3. AI Studio (yellow code icon)
4. Firebase (orange cloud icon)
5. Telegram Bot (blue chat icon)

Style: Clean, flat design, rounded icons, arrows showing data flow between tools.
Color scheme: Google brand colors (blue #4285F4, red #EA4335, yellow #FBBC04, green #34A853).
Background: White with subtle gradient.
```

### 2. API Key Security Checklist
```
Create an infographic showing API key security best practices:
- Lock icon: Keep .env file local only
- GitHub icon with X: Never commit to GitHub
- Shield icon: Add .env to .gitignore
- Refresh icon: Regenerate if exposed
- Team icon: Each member gets own key
- Chart icon: Monitor usage on Google Cloud Console

Style: Flat icons, checklist layout, green checkmarks, red X marks.
Colors: Professional blue and green tones.
```

### 3. NotebookLM Workflow
```
Create a 3-panel workflow diagram:
Panel 1: User uploads PDF research paper (document icon)
Panel 2: NotebookLM indexes and analyzes (AI brain processing)
Panel 3: User asks question, gets answer with source citation (chat bubble with footnote)

Style: Modern UI mockup, clean interface, realistic screen design.
Colors: Google NotebookLM brand colors (green #34A853 accent).
```

---

## 9. 권장 작업 순서

1. ✅ **개발 서버 확인** (완료 - 정상 작동 중)
2. ⏳ **public 폴더 생성** 및 이미지 추가
3. ⏳ **이미지 생성** (Gemini Imagen 또는 DALL-E 3)
4. ⏳ **App.tsx 이미지 경로 확인** 및 수정
5. ⏳ **브라우저에서 최종 확인**

---

## 10. 결론

**현재 상태**: 개발 서버는 정상 작동하지만, 시각적 콘텐츠(이미지)가 누락되어 있습니다.

**해결 방법**:
1. **빠른 해결**: colleague_repo의 이미지를 복사 (임시)
2. **올바른 해결**: Gemini Imagen 3 또는 DALL-E 3로 11강에 맞는 새 이미지 생성
3. **최종 목표**: 각 섹션에 맞는 시각 자료를 추가하여 학습 효과 극대화

**추천**: Gemini Imagen 3 사용 (Google 생태계 강의이므로 Google AI 도구 활용이 적합)
