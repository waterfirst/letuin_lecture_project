# Lecture 11 실행 가이드

## 현재 상태

✅ **개발 서버 정상 작동**
- URL: http://localhost:5173/lecture01/
- 백엔드: Vite + React + TypeScript
- 패키지: 모두 설치 완료

⚠️ **이미지 파일 누락**
- `public/` 폴더에 이미지가 없어 시각 자료가 표시되지 않습니다.

---

## 빠른 시작 (3가지 방법)

### 방법 1: 이미지 없이 실행 (즉시 가능)

```bash
npm run dev
```

브라우저에서 http://localhost:5173/lecture01/ 접속

**현재 상태**: 텍스트 콘텐츠는 모두 표시되지만 이미지는 깨진 상태

---

### 방법 2: 기존 이미지 복사 (5초 해결)

colleague_repo/lecture01의 이미지를 임시로 복사:

```bash
cp -r ../colleague_repo/lecture01/public/*.png public/
```

**장점**: 즉시 실행 가능
**단점**: 1강 이미지이므로 11강 내용과 맞지 않음

---

### 방법 3: AI로 새 이미지 생성 (권장)

#### 옵션 A: DALL-E 3 자동 생성

1. .env 파일에 OpenAI API Key 추가:
```bash
OPENAI_API_KEY=sk-proj-...
```

2. 패키지 설치:
```bash
pip install openai requests python-dotenv
```

3. 스크립트 실행:
```bash
python generate_images.py
```

선택 메뉴에서 `1` 입력 → 자동으로 6개 이미지 생성

**예상 비용**: 이미지당 $0.04 × 6개 = $0.24 (약 300원)

---

#### 옵션 B: Google AI Studio 수동 생성 (무료)

1. 프롬프트 출력:
```bash
python generate_images.py
```

선택 메뉴에서 `2` 입력 → 프롬프트 복사

2. Google AI Studio 접속:
   - https://aistudio.google.com
   - Imagen 2/3 선택
   - 프롬프트 붙여넣기 → Generate
   - 다운로드 → `public/` 폴더에 저장

**장점**: 무료, Google 생태계 강의에 적합
**단점**: 수동 작업 필요

---

## 생성할 이미지 목록

1. **gemini-ecosystem.png** - Gemini 5개 도구 생태계 다이어그램
2. **api-key-workflow.png** - API Key 발급 3단계 플로우
3. **notebooklm-demo.png** - NotebookLM UI 데모 스크린샷
4. **pricing-comparison.png** - Gemini vs Claude vs GPT-4 비교 차트
5. **firebase-setup.png** - Firebase 5단계 설정 가이드
6. **security-checklist.png** - API Key 보안 체크리스트 인포그래픽

---

## 폴더 구조

```
lecture_11/
├── public/               ← 이미지 저장 위치
│   ├── .gitkeep
│   ├── gemini-ecosystem.png
│   ├── api-key-workflow.png
│   ├── notebooklm-demo.png
│   ├── pricing-comparison.png
│   ├── firebase-setup.png
│   └── security-checklist.png
├── src/
│   ├── App.tsx          ← 메인 컴포넌트
│   ├── index.css        ← 스타일시트
│   └── main.tsx
├── generate_images.py   ← 이미지 생성 스크립트
├── package.json
├── vite.config.ts
└── README_SETUP.md      ← 이 파일
```

---

## 이미지 경로 확인

App.tsx에서 이미지를 참조할 때:

```tsx
// vite.config.ts에서 base: '/lecture01/' 설정됨
<img src="/lecture01/gemini-ecosystem.png" alt="Gemini Ecosystem" />
```

또는 base를 '/lecture11/'로 변경하면:

```tsx
<img src="/lecture11/gemini-ecosystem.png" alt="Gemini Ecosystem" />
```

---

## 문제 해결

### Q1: 이미지가 404 에러
- vite.config.ts의 `base` 경로와 이미지 `src` 경로가 일치하는지 확인
- 현재: `base: '/lecture01/'` → 이미지는 `/lecture01/xxx.png`

### Q2: 개발 서버가 안 열림
```bash
# 포트 충돌 확인
netstat -ano | findstr :5173

# 다른 포트 사용
vite --port 5174
```

### Q3: 이미지 생성 스크립트 에러
- .env 파일에 API Key가 있는지 확인
- 패키지 설치 확인: `pip list | grep openai`

---

## 다음 단계

1. ✅ 이미지 생성/복사
2. ✅ 개발 서버 실행
3. ✅ 브라우저에서 확인
4. ⏳ 콘텐츠 검토 및 수정
5. ⏳ 빌드 및 배포

```bash
# 빌드
npm run build

# 프리뷰
npm run preview
```

---

## 참고 자료

- [Vite 공식 문서](https://vitejs.dev/)
- [DALL-E 3 API](https://platform.openai.com/docs/guides/images)
- [Google AI Studio](https://aistudio.google.com)
- [colleague_repo/lecture01](../colleague_repo/lecture01/) - 참고 프로젝트

---

## 연락처

문제가 발생하면 `ANALYSIS_REPORT.md` 파일을 참고하세요.
