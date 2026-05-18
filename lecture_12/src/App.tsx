import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Code,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  GitBranch,
  Github,
  Key,
  Lock,
  Quote,
  Shield,
  Terminal,
  Unlock,
  Wrench,
  Zap,
} from 'lucide-react';

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}${filename}`;

// ============================================================================
// DATA ARRAYS - Security & CI/CD
// ============================================================================

const learningGoals = [
  {
    step: '학습목표 1',
    title: '.env 파일로 API Key 안전하게 관리',
    body: 'API Key를 코드에서 분리하여 .env 파일로 관리하고 .gitignore로 보호합니다.',
    type: 'env'
  },
  {
    step: '학습목표 2',
    title: 'GitHub Secrets로 배포 환경 암호화',
    body: 'GitHub Actions에서 안전하게 API Key를 사용하는 방법을 배웁니다.',
    type: 'secrets'
  },
  {
    step: '학습목표 3',
    title: 'GitHub Actions로 CI/CD 자동화',
    body: 'push할 때마다 자동으로 테스트하고 배포하는 파이프라인을 구축합니다.',
    type: 'cicd'
  },
];

const lessonFlow = [
  { time: '3분', label: '목표 확인' },
  { time: '7분', label: '개념·비유' },
  { time: '8분', label: '실무 사례' },
  { time: '17분', label: '지시문·실습' },
  { time: '5분', label: '검증·정리' },
];

const roleFlow = [
  { owner: '엔지니어', task: '.env 파일 생성, .gitignore 설정, GitHub Secrets 등록' },
  { owner: 'GitHub', task: 'API Key 암호화 저장, Actions 로그 마스킹' },
  { owner: 'GitHub Actions', task: '자동 테스트, 자동 배포, 알림 전송' },
];

const securityRisks = [
  {
    title: 'GitHub 직접 commit',
    probability: 45,
    severity: '매우 높음',
    color: '#E74C3C',
  },
  {
    title: '로그 파일 출력',
    probability: 25,
    severity: '높음',
    color: '#E67E22',
  },
  {
    title: '공개 채팅/스크린샷',
    probability: 20,
    severity: '중간',
    color: '#F39C12',
  },
  {
    title: '하드코딩',
    probability: 10,
    severity: '높음',
    color: '#E67E22',
  },
];

const fieldScenarios = [
  {
    icon: Lock,
    title: '.env 파일 관리',
    before: 'API Key를 코드에 직접 입력하여 GitHub에 노출',
    intent: 'API Key를 .env 파일로 분리하고 .gitignore로 보호해줘.',
    output: '.env 파일 생성 + .gitignore 설정 완료',
  },
  {
    icon: Github,
    title: 'GitHub Secrets 설정',
    before: 'Actions에서 API Key를 평문으로 사용하여 로그 노출',
    intent: 'GitHub Secrets에 API Key를 등록하고 workflow에서 안전하게 사용해줘.',
    output: 'Secrets 등록 + workflow 암호화 완료',
  },
  {
    icon: Zap,
    title: 'GitHub Actions CI/CD',
    before: '수동으로 테스트하고 배포하여 실수 발생',
    intent: 'push할 때마다 자동으로 테스트하고 배포하는 workflow를 만들어줘.',
    output: '자동 테스트 + 자동 배포 파이프라인 구축',
  },
];

const envSteps = [
  { step: '1', title: '.env 파일 생성', body: 'GEMINI_API_KEY=your_key_here', duration: '30초' },
  { step: '2', title: '.gitignore에 추가', body: 'echo ".env" >> .gitignore', duration: '10초' },
  { step: '3', title: 'Python에서 로드', body: 'load_dotenv() 사용', duration: '1분' },
  { step: '4', title: 'git status 확인', body: '.env가 untracked인지 확인', duration: '10초' },
];

const gitignoreTemplate = `.env
.env.local
.env.production
*.pem
*_key.json
credentials.json
__pycache__/
*.pyc
venv/
.venv/
node_modules/
dist/
build/
.DS_Store
Thumbs.db`;

const cicdSteps = [
  { step: '1', title: 'workflow 파일 생성', body: '.github/workflows/ci.yml', duration: '2분' },
  { step: '2', title: 'GitHub Secrets 등록', body: 'Settings → Secrets', duration: '1분' },
  { step: '3', title: 'push 후 확인', body: 'Actions 탭에서 초록 체크', duration: '30초' },
];

const securityChecklist = [
  '.env 파일을 절대 GitHub에 커밋하지 않기',
  '.gitignore에 .env 추가 확인',
  'GitHub Secrets에 API Key 등록',
  'Actions 로그에서 Key 마스킹 확인',
  '유출 시 즉시 Key 재발급',
];

const intentChecklist = [
  '.env 파일이 생성되었는가?',
  '.gitignore에 .env가 추가되었는가?',
  'GitHub Secrets에 Key가 등록되었는가?',
  'GitHub Actions workflow가 작동하는가?',
  'git status에서 .env가 untracked인가?',
];

const envVerifyPoints = [
  '.env 파일이 .gitignore에 포함되어 있는가?',
  'git status에서 .env가 빨간색(untracked)인가?',
  'Python에서 os.getenv()로 읽히는가?',
];

const secretsVerifyPoints = [
  'GitHub Secrets에 Key가 등록되어 있는가?',
  'workflow에서 secrets 변수로 참조하는가?',
  'Actions 로그에서 Key가 ***로 마스킹되는가?',
];

const cicdVerifyPoints = [
  'push 후 Actions 탭에서 workflow가 실행되는가?',
  '테스트가 통과하면 초록 체크마크가 뜨는가?',
  '배포가 자동으로 진행되는가?',
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function GoalVisual({ type }: { type: string }) {
  if (type === 'env') {
    return (
      <div className="goal-visual definition">
        <div className="visual-item person">
          <Lock size={18} />
          <span>.env</span>
        </div>
        <ArrowRight size={14} className="visual-arrow" />
        <div className="visual-item ai">
          <Shield size={18} />
          <span>안전</span>
        </div>
      </div>
    );
  }
  if (type === 'secrets') {
    return (
      <div className="goal-visual elements">
        <div className="element-tag">Secrets</div>
        <div className="element-tag">암호화</div>
        <div className="element-tag">마스킹</div>
      </div>
    );
  }
  if (type === 'cicd') {
    return (
      <div className="goal-visual field">
        <div className="field-icons">
          <div className="f-icon"><Terminal size={18} /></div>
          <div className="f-icon"><Zap size={18} /></div>
        </div>
        <div className="success-indicator">
          <CheckCircle2 size={12} />
          <span>자동화</span>
        </div>
      </div>
    );
  }
  return null;
}

function SecurityRiskChart() {
  const max = Math.max(...securityRisks.map((item) => item.probability));

  return (
    <div className="visual-card">
      <div className="visual-header">
        <span>API Key Leak Risk</span>
        <strong>발생 빈도</strong>
      </div>
      <div className="bar-chart" role="img" aria-label="API Key 유출 경로 차트">
        {securityRisks.map((item) => (
          <div className="bar-row" key={item.title}>
            <span>{item.title}</span>
            <div>
              <i style={{ width: `${(item.probability / max) * 100}%`, background: item.color }} />
            </div>
            <strong>{item.probability}%</strong>
          </div>
        ))}
      </div>
      <p>GitHub 직접 commit이 전체 유출의 45%를 차지합니다. .gitignore 하나로 대부분을 막을 수 있습니다.</p>
    </div>
  );
}

function LectureImage({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="lecture-image">
      <img src={assetUrl(src)} alt={alt} loading="lazy" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
function VerifyChecklist({ points }: { points: string[] }) {
  return (
    <div className="verify-checklist">
      <span>엔지니어 검증 포인트</span>
      {points.map((point) => (
        <div className="verify-item" key={point}>
          <CheckCircle2 size={15} />
          <p>{point}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// DEEP DIVE SECTIONS
// ============================================================================

function EnvFileDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 01 Deep Dive</span>
        <h3>.env 파일 관리: API Key를 코드에서 분리하기</h3>
        <p>
          API Key를 코드에 직접 입력하면 GitHub에 노출됩니다. .env 파일로 분리하고 .gitignore로 보호합니다.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img
            src={assetUrl('lecture-12-security-cicd.png')}
            alt=".env 파일 관리"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        </div>
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: 하드코딩 (위험)</span>
          <h4>API Key를 코드에 직접 입력</h4>
          <div className="code-preview-box">
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>{`# app.py
import google.generativeai as genai

# ❌ 위험: API Key를 코드에 직접 입력
api_key = "AIzaSyXXXXXXXXXXXXXXXX"
genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-pro')
response = model.generate_content("Hello")
print(response.text)`}</pre>
          </div>
          <ul>
            <li>API Key가 GitHub에 노출됨</li>
            <li>팀원 모두에게 Key가 공유됨</li>
            <li>유출 시 $50,000 청구 위험</li>
          </ul>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: .env 분리 지시</span>
          <h4>API Key를 .env 파일로 분리하고 .gitignore로 보호합니다</h4>
          <p>
            ".env 파일을 생성하고 GEMINI_API_KEY를 저장해줘. Python 코드에서는 python-dotenv로 읽어오고,
            .gitignore에 .env를 추가해서 GitHub에 올라가지 않게 해줘."
          </p>
          <div className="aoi-rule-grid">
            <div><strong>.env 파일</strong><span>GEMINI_API_KEY=your_key</span></div>
            <div><strong>.gitignore</strong><span>.env 추가</span></div>
            <div><strong>Python</strong><span>load_dotenv() 사용</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 산출물</span>
          <h4>.env 파일로 API Key를 안전하게 관리합니다</h4>
          <div className="code-preview-box">
            <div className="visual-header">
              <span>.env 파일</span>
              <strong>(GitHub에 올리지 않음)</strong>
            </div>
            <pre style={{ background: '#f5f5f7', color: '#333', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>{`GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXX
TELEGRAM_BOT_TOKEN=123456:ABCDEFGHIJ
ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXXXXX`}</pre>
          </div>
          <div className="code-preview-box" style={{ marginTop: '1rem' }}>
            <div className="visual-header">
              <span>Python 코드</span>
              <strong>app.py</strong>
            </div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>{`# app.py
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()  # .env 파일 로드

# ✅ 안전: 환경 변수로 읽기
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-pro')
response = model.generate_content("Hello")
print(response.text)`}</pre>
          </div>
          <div className="aoi-impact-strip">
            <div><strong>GitHub 안전</strong><span>.env가 .gitignore에 포함</span></div>
            <div><strong>팀 협업</strong><span>각자 본인 Key 사용</span></div>
            <div><strong>유출 방지</strong><span>$50,000 청구 위험 제거</span></div>
          </div>
          <div className="security-checklist-box">
            <Lock size={24} color="#EA4335" />
            <h4>보안 체크리스트 (필수)</h4>
            <ul className="security-list">
              {securityChecklist.map((item, index) => (
                <li key={index}>
                  <Shield size={14} color="#34A853" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 API Key를 코드에 절대 입력하지 않고, .env 파일로 분리하여 .gitignore로 보호하는 것입니다.
      </p>
      <VerifyChecklist points={envVerifyPoints} />
    </div>
  );
}

function GitHubSecretsDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 02 Deep Dive</span>
        <h3>GitHub Secrets: 배포 환경에서 안전하게 Key 사용하기</h3>
        <p>
          GitHub Actions에서 API Key를 사용할 때, workflow 파일에 직접 입력하면 로그에 노출됩니다.
          GitHub Secrets에 등록하면 AES-256 암호화로 안전하게 보관됩니다.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img
            src={assetUrl('lecture-12-security-cicd.png')}
            alt="GitHub Secrets 설정"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        </div>
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: workflow에 평문 입력</span>
          <h4>API Key를 workflow 파일에 직접 입력</h4>
          <div className="code-preview-box">
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>{`# .github/workflows/deploy.yml
name: Deploy

on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy with API Key
        run: |
          # ❌ 위험: 평문으로 입력
          export GEMINI_API_KEY="AIzaSyXXXXXX"
          python deploy.py`}</pre>
          </div>
          <ul>
            <li>API Key가 workflow 파일에 노출</li>
            <li>Actions 로그에 Key가 평문으로 출력</li>
            <li>저장소 접근자 모두에게 Key 공개</li>
          </ul>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: GitHub Secrets 설정 지시</span>
          <h4>API Key를 GitHub Secrets에 등록하고 workflow에서 참조합니다</h4>
          <p>
            "GitHub Secrets에 GEMINI_API_KEY를 등록해줘. workflow 파일에서는 {'${{ secrets.GEMINI_API_KEY }}'} 로
            참조하고, Actions 로그에서 자동으로 마스킹되게 해줘."
          </p>
          <div className="aoi-rule-grid">
            <div><strong>Secrets 등록</strong><span>Settings → Secrets</span></div>
            <div><strong>workflow 참조</strong><span>{'${{ secrets.KEY }}'}</span></div>
            <div><strong>로그 마스킹</strong><span>자동으로 *** 표시</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 산출물</span>
          <h4>GitHub Secrets로 API Key가 암호화되어 안전합니다</h4>
          <div className="github-secrets-result-box">
            <div className="visual-header">
              <span>GitHub Secrets 등록 방법</span>
              <strong>Repository → Settings</strong>
            </div>
            <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <ol style={{ lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                <li>Repository → Settings 클릭</li>
                <li>Secrets and variables → Actions 선택</li>
                <li>New repository secret 클릭</li>
                <li>Name: <strong>GEMINI_API_KEY</strong></li>
                <li>Value: <strong>AIzaSy...</strong> (실제 Key 입력)</li>
                <li>Add secret 클릭</li>
              </ol>
            </div>
          </div>
          <div className="code-preview-box" style={{ marginTop: '1rem' }}>
            <div className="visual-header">
              <span>workflow 파일</span>
              <strong>.github/workflows/deploy.yml</strong>
            </div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>{`# .github/workflows/deploy.yml
name: Deploy

on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      # ✅ 안전: Secrets에서 참조
      GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        run: python deploy.py`}</pre>
          </div>
          <div className="aoi-impact-strip">
            <div><strong>AES-256 암호화</strong><span>Secrets 저장소에 안전 보관</span></div>
            <div><strong>로그 마스킹</strong><span>Actions에서 *** 표시</span></div>
            <div><strong>접근 제어</strong><span>관리자만 Key 확인 가능</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 API Key를 workflow 파일에 직접 입력하지 않고, GitHub Secrets에 등록하여
        암호화된 상태로 안전하게 사용하는 것입니다.
      </p>
      <VerifyChecklist points={secretsVerifyPoints} />
    </div>
  );
}

function CICDDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 03 Deep Dive</span>
        <h3>GitHub Actions CI/CD: 자동 테스트 & 배포 파이프라인</h3>
        <p>
          push할 때마다 수동으로 테스트하고 배포하는 대신, GitHub Actions로 자동화합니다.
          테스트 통과 시에만 자동 배포됩니다.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img
            src={assetUrl('lecture-12-security-cicd.png')}
            alt="GitHub Actions CI/CD"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        </div>
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: 수동 배포</span>
          <h4>매번 수동으로 테스트하고 배포</h4>
          <ul>
            <li>로컬에서 pytest 실행</li>
            <li>테스트 통과 확인</li>
            <li>수동으로 Streamlit Community Cloud 배포</li>
            <li>실수로 테스트 없이 배포하여 버그 발생</li>
            <li>팀원마다 배포 방법이 다름</li>
          </ul>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: GitHub Actions 설정 지시</span>
          <h4>push할 때마다 자동으로 테스트하고 배포합니다</h4>
          <p>
            ".github/workflows/ci.yml 파일을 만들어줘. push할 때마다 pytest를 자동 실행하고,
            테스트 통과 시에만 Streamlit Community Cloud에 자동 배포해줘. 실패 시 Slack 알림도 보내줘."
          </p>
          <div className="aoi-rule-grid sensor-rule-grid">
            <div><strong>자동 테스트</strong><span>push → pytest 실행</span></div>
            <div><strong>조건 배포</strong><span>테스트 통과 시만</span></div>
            <div><strong>알림</strong><span>Slack/Email</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 산출물</span>
          <h4>GitHub Actions로 push → 테스트 → 배포가 자동화됩니다</h4>
          <div className="code-preview-box">
            <div className="visual-header">
              <span>workflow 파일</span>
              <strong>.github/workflows/ci.yml</strong>
            </div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', overflow: 'auto' }}>{`name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    env:
      GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest
      - name: Run tests
        run: pytest tests/ -v

  deploy:
    needs: test  # 테스트 통과 후에만 실행
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Streamlit Cloud
        run: |
          echo "✅ 자동 배포 완료"
          # Streamlit Cloud API 호출`}</pre>
          </div>
          <div className="aoi-impact-strip sensor-impact-strip">
            <div><strong>수동 → 자동</strong><span>push만 하면 끝</span></div>
            <div><strong>버그 차단</strong><span>테스트 실패 시 배포 차단</span></div>
            <div><strong>팀 표준화</strong><span>모두 동일한 흐름</span></div>
          </div>
          <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#f0f7ff', borderRadius: '8px', border: '1px solid #d1e7ff' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#0071e3' }}>GitHub Actions 파이프라인 흐름</h4>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'white', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <GitBranch size={20} color="#333" />
                <strong style={{ marginLeft: '0.5rem' }}>git push</strong>
              </div>
              <ArrowRight size={20} color="#999" />
              <div style={{ padding: '0.75rem 1rem', background: 'white', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Terminal size={20} color="#27AE60" />
                <strong style={{ marginLeft: '0.5rem' }}>자동 테스트</strong>
              </div>
              <ArrowRight size={20} color="#999" />
              <div style={{ padding: '0.75rem 1rem', background: 'white', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Zap size={20} color="#4285F4" />
                <strong style={{ marginLeft: '0.5rem' }}>자동 배포</strong>
              </div>
              <ArrowRight size={20} color="#999" />
              <div style={{ padding: '0.75rem 1rem', background: 'white', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <CheckCircle2 size={20} color="#34A853" />
                <strong style={{ marginLeft: '0.5rem' }}>완료</strong>
              </div>
            </div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 수동 작업을 자동화하여 실수를 제거하고, 테스트 통과 시에만 배포하여 품질을 보장하는 것입니다.
      </p>
      <VerifyChecklist points={cicdVerifyPoints} />
    </div>
  );
}

function InteractiveWorkshop() {
  const [fields, setFields] = useState({
    env: '',
    gitignore: '',
    secrets: '',
  });
  const [copied, setCopied] = useState(false);

  const hasContent = Object.values(fields).some(Boolean);

  const generated = hasContent
    ? `1. .env 파일: ${fields.env || '[생성 예정]'}
2. .gitignore: ${fields.gitignore || '[설정 예정]'}
3. GitHub Secrets: ${fields.secrets || '[등록 예정]'}

다음 단계: git status 확인 → push → Actions 탭 확인`
    : '';

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const inputRows: { key: keyof typeof fields; label: string; placeholder: string }[] = [
    { key: 'env', label: '.env 파일 상태', placeholder: '예: GEMINI_API_KEY=AIzaSy... 저장 완료' },
    { key: 'gitignore', label: '.gitignore 확인', placeholder: '예: .env 추가 완료' },
    { key: 'secrets', label: 'GitHub Secrets', placeholder: '예: Settings → Secrets에 등록 완료' },
  ];

  return (
    <div className="interactive-workshop">
      <div className="iw-header">
        <FileText size={22} color="var(--accent)" />
        <strong>3단계 보안 체크리스트</strong>
        <p>.env, .gitignore, GitHub Secrets 설정을 확인하세요.</p>
      </div>
      <div className="iw-body">
        <div className="iw-inputs">
          {inputRows.map((row) => (
            <div className="iw-field" key={row.key}>
              <label htmlFor={`iw-${row.key}`}>{row.label}</label>
              <input
                id={`iw-${row.key}`}
                type="text"
                placeholder={row.placeholder}
                value={fields[row.key]}
                onChange={(e) => setFields((prev) => ({ ...prev, [row.key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <div className="iw-output">
          <div className="iw-output-header">
            <Shield size={18} color="var(--accent)" />
            <strong>보안 점검 현황</strong>
          </div>
          <div className={`iw-generated-text ${hasContent ? 'active' : ''}`}>
            {generated || '위 3단계를 입력하면\n보안 점검 현황이 표시됩니다.'}
          </div>
          <button
            className={`iw-copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            disabled={!hasContent}
          >
            {copied
              ? <><Check size={15} />복사됨!</>
              : <><Copy size={15} />체크리스트 복사</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function FirstRunGuide() {
  return (
    <div className="first-run-guide">
      <div className="frg-title">
        <ExternalLink size={18} color="var(--accent)" />
        <strong>지금 바로 해보기 — .env 파일 생성 & GitHub Secrets 설정</strong>
      </div>
      <div className="frg-steps">
        {envSteps.map((item) => (
          <div className="frg-step" key={item.step}>
            <span className="frg-num">{item.step}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NextLecturePreview() {
  return (
    <div className="next-lecture-card">
      <div className="nlc-header">
        <span>13강 미리보기</span>
        <h3>하이테크 물리 & 공정 시뮬레이터 제작</h3>
        <p>공정 시뮬레이션 결과를 실시간 시각화하는 도구를 만듭니다. 파라미터를 조정하면 즉시 결과가 업데이트됩니다.</p>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function App() {
  return (
    <div className="app-container">
      <header className="main-header">
        <div className="header-top">
          <motion.div
            className="logo-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <img
              src={assetUrl('logo.png')}
              alt="LettUin Edu"
              className="header-logo"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </motion.div>

          <motion.div
            className="header-tag-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="header-tag">API Key 보안 & 자동화 파이프라인</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Ch.12 환경 관리 & 보안 & GitHub Actions</h1>
          <p className="subtitle">API Key 유출 실화부터 .env, GitHub Secrets, CI/CD 자동화까지 — 보안 없는 배포는 시한폭탄</p>
          <div className="lesson-meta" aria-label="lesson summary">
            <span>40분</span>
            <span>보안 실습</span>
            <span>CI/CD</span>
            <span>결과물: 안전한 배포 파이프라인</span>
          </div>
        </motion.div>
        <LectureImage
          src="security-cicd-overview.png"
          alt="API Key, .env, GitHub Secrets, Actions, Deploy가 한 흐름으로 연결되는 보안 배포 파이프라인입니다."
          caption="API Key, .env, GitHub Secrets, Actions, Deploy가 한 흐름으로 연결되는 보안 배포 파이프라인입니다."
        />
      </header>

      <main>
        <section className="overview-section">
          <span className="section-label">01. 오프닝 및 학습목표</span>
          <h2>AWS 요금 청구서 $50,000 — 실화입니다</h2>
          <p className="section-intro">
            개발자가 AWS API Key를 GitHub에 실수로 올렸습니다. 30분 뒤 자동 봇이 Key를 발견했고,
            하루 만에 $50,000(약 6,700만 원)이 청구됐습니다. 이 강의에서는 이런 사고를 예방하는 법을 배웁니다.
          </p>
          <div className="learning-goals-grid" aria-label="학습목표">
            {learningGoals.map((item) => (
              <div className="learning-goal-card" key={item.step}>
                <span>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <div className="goal-visual-wrapper">
                  <GoalVisual type={item.type} />
                </div>
              </div>
            ))}
          </div>
          <div className="lesson-timeline" aria-label="40분 강의 진행표">
            {lessonFlow.map((item) => (
              <div className="timeline-step" key={item.label}>
                <strong>{item.time}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
            <img
              src={assetUrl('lecture-12-security-cicd.png')}
              alt="API Key 유출 실화"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          </div>
        </section>

        <section className="definition-section">
          <span className="section-label">02. .env 파일이란 무엇인가</span>
          <h2>.env 파일은 비밀 정보를 코드에서 분리하는 방법입니다</h2>
          <p className="section-intro">
            API Key, DB 비밀번호, 토큰 등을 코드에 직접 입력하면 GitHub에 노출됩니다.
            .env 파일로 분리하고 .gitignore로 보호하면 안전합니다.
          </p>
          <div className="one-line-definition inline-definition">
            <span>한 문장 정의</span>
            <strong>.env 파일은 비밀 정보를 코드에서 분리하여 .gitignore로 보호하는 환경 변수 관리 파일입니다.</strong>
          </div>
          <div className="role-flow" aria-label="보안 역할 분리">
            {roleFlow.map((item, index) => (
              <div className="role-step" key={`${item.owner}-${item.task}`}>
                <span>{item.owner}</span>
                <strong>{item.task}</strong>
                {index < roleFlow.length - 1 && <ArrowRight size={22} />}
              </div>
            ))}
          </div>
          <div className="code-preview-box" style={{ marginTop: '2rem' }}>
            <div className="visual-header">
              <span>.gitignore 템플릿</span>
              <strong>프로젝트 첫 커밋 전에 생성</strong>
            </div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>{gitignoreTemplate}</pre>
          </div>
        </section>

        <section>
          <span className="section-label">03. API Key 유출 경로</span>
          <h2>GitHub 직접 commit이 전체 유출의 45%를 차지합니다</h2>
          <p className="section-intro">
            .gitignore 하나로 대부분의 유출을 막을 수 있습니다. 보안은 나중에 하는 게 아니라 처음부터 하는 것입니다.
          </p>
          <SecurityRiskChart />
          <div className="highlight-box" style={{ background: '#fff7f7', borderLeftColor: '#E74C3C' }}>
            <p style={{ fontWeight: 700, color: '#E74C3C' }}>실화 경고:</p>
            <p>"API Key를 GitHub에 올린 후 30분 만에 자동 봇이 발견하여 $50,000 청구. .gitignore 하나로 막을 수 있었습니다."</p>
          </div>
        </section>

        <section>
          <span className="section-label">04. 첨단 공정기술 사례</span>
          <h2>반도체·디스플레이·배터리 엔지니어의 보안 관리</h2>
          <p className="section-intro">
            공정 데이터 분석 앱을 배포할 때도 API Key 보안은 필수입니다.
            .env, GitHub Secrets, CI/CD 자동화를 모두 적용합니다.
          </p>
          <div className="scenario-grid">
            {fieldScenarios.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  className="scenario-card"
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="scenario-icon">
                    <Icon size={24} />
                  </div>
                  <h3>{item.title}</h3>
                  <p className="scenario-before">{item.before}</p>
                  <div className="intent-box">
                    <span>의도 지시문</span>
                    <p>{item.intent}</p>
                  </div>
                  <p className="scenario-output">{item.output}</p>
                </motion.div>
              );
            })}
          </div>
          <EnvFileDeepDive />
          <GitHubSecretsDeepDive />
          <CICDDeepDive />
        </section>

        <section className="workshop-section teaching-section">
          <span className="section-label">05. 미니 워크숍</span>
          <h2>실습: 내 첫 <mark>보안 배포 파이프라인</mark> 만들기</h2>
          <p className="section-intro">
            .env 파일 생성, .gitignore 설정, GitHub Secrets 등록을 차례로 완료하세요.
          </p>
          <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <img
              src={assetUrl('lecture-12-security-cicd.png')}
              alt="보안 파이프라인 실습"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>
          <InteractiveWorkshop />
          <FirstRunGuide />
        </section>

        <section>
          <span className="section-label">06. 품질 점검 및 정리</span>
          <h2>배포 전, 이 5가지만 확인하세요</h2>
          <div className="checklist">
            {intentChecklist.map((item) => (
              <div className="check-item" key={item}>
                <CheckCircle2 size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="wrap-message">
            <Quote size={36} color="var(--accent)" />
            <h3>"보안은 나중에 하는 게 아니라 처음부터 하는 것입니다. .env와 .gitignore는 첫 커밋 전에 설정하세요."</h3>
            <p>다음 강의: 하이테크 물리 & 공정 시뮬레이터 제작 (13강)</p>
          </div>
          <NextLecturePreview />
        </section>

        <section className="professional-point">
          <div className="highlight-box" style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '24px' }}>
            <h3>Advanced Process Engineering Point</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '1rem', fontSize: '1.1rem' }}>
              "API Key 유출은 $50,000 청구로 이어질 수 있습니다. .env 파일, .gitignore, GitHub Secrets로
              3중 보안을 구축하고, GitHub Actions로 자동화하여 실수를 제거하세요."<br/>
              보안은 선택이 아니라 필수입니다.
            </p>
            <div className="point-strip">
              <span><Lock size={16} /> .env는 비밀 창고</span>
              <span><Shield size={16} /> .gitignore는 방패</span>
              <span><Zap size={16} /> Actions는 자동화</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 Security & CI/CD for Fine Tech Engineering | LettUin Edu</p>
      </footer>
    </div>
  );
}
