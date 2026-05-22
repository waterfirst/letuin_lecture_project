import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  Cloud,
  Code,
  Copy,
  Database,
  ExternalLink,
  FileText,
  Key,
  Lock,
  MessageCircle,
  Quote,
  Shield,
  Sparkles,
  Terminal,
  Upload,
  Wrench,
  Zap,
} from 'lucide-react';

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}${filename}`;

// ============================================================================
// DATA ARRAYS - Gemini Ecosystem
// ============================================================================

const learningGoals = [
  {
    step: '학습목표 1',
    title: 'Gemini API Key 발급 및 첫 호출',
    body: 'Google AI Studio에서 API Key를 발급하고 Python으로 첫 번째 AI 호출을 실행합니다.',
    type: 'api'
  },
  {
    step: '학습목표 2',
    title: 'NotebookLM 지식 베이스 구축',
    body: '연구 논문을 업로드하여 개인화된 AI 연구 노트를 만들고 출처 기반 답변을 받습니다.',
    type: 'knowledge'
  },
  {
    step: '학습목표 3',
    title: 'AI Studio 시뮬레이터 구축 및 문제 해결',
    body: 'Google AI Studio를 활용하여 반도체/디스플레이/배터리 공정 시뮬레이터를 구축하고 주요 문제를 해결합니다.',
    type: 'deploy'
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
  { owner: '엔지니어', task: 'API Key 관리, NotebookLM 자료 업로드, AI Studio 시뮬레이터 설계' },
  { owner: 'Gemini', task: '데이터 분석, 논문 요약, 시뮬레이션 코드 생성' },
  { owner: 'NotebookLM', task: '논문 인덱싱, 출처 추적' },
  { owner: 'AI Studio', task: '프롬프트 테스트, 시스템 지시문(System Instruction) 설정' },
];

const geminiEcosystem = [
  {
    icon: Bot,
    title: 'Gemini Pro',
    description: '100만 토큰 컨텍스트, Deep Research',
    features: ['긴 논문 분석', '멀티모달', 'JSON 출력'],
    cost: '$20/월',
    freeQuota: '15 req/min',
  },
  {
    icon: BookOpen,
    title: 'NotebookLM',
    description: '개인 지식 베이스, 출처 기반 답변',
    features: ['할루시네이션 방지', 'PDF/웹 지원', '팟캐스트'],
    cost: '무료',
    freeQuota: '무제한',
  },
  {
    icon: Code,
    title: 'AI Studio',
    description: 'API Key 발급, 프롬프트 테스트, 시뮬레이터 구축',
    features: ['프롬프트 갤러리', 'System instruction', 'Function calling'],
    cost: '무료',
    freeQuota: '60 req/min',
  },
  {
    icon: Zap,
    title: 'Antigravity IDE',
    description: 'API 기반 AI 개발 환경 및 에이전트 코딩',
    features: ['API Key 직접 연동 (BYOK)', '요금제 크레딧 지원', '파일 구조 자동 생성'],
    cost: '무료 / 구독제 선택',
    freeQuota: 'AI Studio 한도 사용 가능',
  },
  {
    icon: MessageCircle,
    title: 'Telegram Bot',
    description: 'Gemini API 연동 자동 알림',
    features: ['실시간 푸시', '그룹 채팅', '파일 전송'],
    cost: '무료',
    freeQuota: '무제한',
  },
];

const fieldScenarios = [
  {
    icon: BarChart3,
    title: '반도체: 수율 분석 자동화',
    before: 'Excel 수율 데이터를 Gemini에 업로드하여 이상 패턴 감지',
    intent: '최근 7일 라인별 수율을 분석하고 전일 대비 3% 이상 하락한 항목을 리포트로 만들어줘.',
    output: 'Gemini가 Python 코드 + 시각화 차트 + 원인 후보 생성',
  },
  {
    icon: FileText,
    title: '디스플레이: 논문 요약',
    before: 'OLED 관련 논문 50편을 NotebookLM에 업로드',
    intent: 'OLED 수명 개선 연구 동향을 요약하고 핵심 기술 3가지를 정리해줘.',
    output: 'NotebookLM이 출처 포함 요약 + 팟캐스트 생성',
  },
  {
    icon: Activity,
    title: '배터리: AI Studio 열폭주 시뮬레이터',
    before: '배터리 화학조성 및 양극재/음극재 물성 데이터를 AI Studio에 설정',
    intent: '배터리 팩 설계 사양을 입력하면 온도 상승 곡선과 열폭주 임계점 도달 시간을 예측해줘.',
    output: 'AI Studio 시뮬레이터가 열역학 계산식 + 물성별 시뮬레이션 결과 리포트 출력',
  },
];

const apiKeySteps = [
  {
    step: '1',
    title: 'Google AI Studio 접속',
    body: 'aistudio.google.com 방문',
    duration: '30초',
  },
  {
    step: '2',
    title: 'Get API Key 클릭',
    body: 'Create API key in new project 선택',
    duration: '20초',
  },
  {
    step: '3',
    title: 'API Key 복사',
    body: '생성된 키를 안전하게 복사',
    duration: '10초',
  },
  {
    step: '4',
    title: 'Python 코드 실행',
    body: 'google-generativeai 설치 후 첫 호출',
    duration: '2분',
  },
];

const securityChecklist = [
  'API Key를 절대 GitHub에 커밋하지 않기',
  '.env 파일 또는 환경변수로 관리',
  '.gitignore에 .env 추가',
  'API Key 유출 시 즉시 재발급',
];

const notebookLMSteps = [
  { step: '1', title: 'NotebookLM 접속', body: 'notebooklm.google.com', duration: '30초' },
  { step: '2', title: '새 노트 생성', body: 'Create 클릭', duration: '10초' },
  { step: '3', title: 'PDF 논문 업로드', body: 'Add source → Upload', duration: '1분' },
  { step: '4', title: '질문하기', body: '논문 기반 질문 입력', duration: '2분' },
];

const aiStudioSimulatorSteps = [
  { step: '1', title: 'AI Studio 접속', body: 'aistudio.google.com 접속', duration: '30초' },
  { step: '2', title: 'System Instruction 설정', body: '반도체/디스플레이/배터리 물리 공식 및 역할 명시', duration: '1분' },
  { step: '3', title: '변수 프롬프트 구성', body: '{{온도}}, {{압력}}, {{조성}} 등 실시간 입력값 템플릿화', duration: '2분' },
  { step: '4', title: '시뮬레이션 및 검증', body: '프롬프트 테스트 후 API 코드로 저장', duration: '1분' },
];

const intentChecklist = [
  'Gemini API Key를 안전하게 발급하고 Antigravity에 연동했는가?',
  'NotebookLM에 올바른 논문을 업로드했는가?',
  'AI Studio에서 시뮬레이터 시스템 지시문을 올바르게 구성했는가?',
  '첫 API 호출 및 시뮬레이션 결과 출력이 성공했는가?',
  '보안 체크리스트를 모두 확인했는가?',
];

const pricingComparison = [
  { model: 'Gemini Pro', price: '$20/월', context: '100만 토큰', free: '15 req/min', score: 95 },
  { model: 'Claude Pro', price: '$20/월', context: '20만 토큰', free: '없음', score: 75 },
  { model: 'ChatGPT Plus', price: '$20/월', context: '12.8만 토큰', free: '없음', score: 70 },
];

const apiVerifyPoints = [
  'API Key가 정상적으로 발급되었는가?',
  '첫 호출 응답이 성공했는가?',
  '.env 파일에 KEY가 저장되었는가?',
];

const notebookVerifyPoints = [
  'NotebookLM이 논문을 정확히 인덱싱했는가?',
  '출처 링크가 올바르게 표시되는가?',
  '할루시네이션 없이 답변하는가?',
];

const aiStudioSimulatorVerifyPoints = [
  'AI Studio 시뮬레이터의 물리적 제약조건이 올바른가?',
  '다양한 공정 변수 입력 시 물리 규칙에 맞춰 시뮬레이션 응답이 나오는가?',
  '에러 패턴 및 최적화 추천안이 일관되게 반환되는가?',
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function GoalVisual({ type }: { type: string }) {
  if (type === 'api') {
    return (
      <div className="goal-visual definition">
        <div className="visual-item person">
          <Key size={18} />
          <span>API Key</span>
        </div>
        <ArrowRight size={14} className="visual-arrow" />
        <div className="visual-item ai">
          <Bot size={18} />
          <span>Gemini</span>
        </div>
      </div>
    );
  }
  if (type === 'knowledge') {
    return (
      <div className="goal-visual elements">
        <div className="element-tag">논문</div>
        <div className="element-tag">출처</div>
        <div className="element-tag">요약</div>
      </div>
    );
  }
  if (type === 'deploy') {
    return (
      <div className="goal-visual field">
        <div className="field-icons">
          <div className="f-icon"><Wrench size={18} /></div>
          <div className="f-icon"><Activity size={18} /></div>
        </div>
        <div className="success-indicator">
          <CheckCircle2 size={12} />
          <span>시뮬레이터 구축</span>
        </div>
      </div>
    );
  }
  return null;
}

function PricingChart() {
  const max = Math.max(...pricingComparison.map((item) => item.score));

  return (
    <div className="visual-card">
      <div className="visual-header">
        <span>Pricing Comparison</span>
        <strong>종합 점수</strong>
      </div>
      <div className="bar-chart" role="img" aria-label="가격 비교 차트">
        {pricingComparison.map((item) => (
          <div className="bar-row" key={item.model}>
            <span>{item.model}</span>
            <div>
              <i style={{ width: `${(item.score / max) * 100}%` }} />
            </div>
            <strong>{item.score}</strong>
          </div>
        ))}
      </div>
      <p>Gemini는 무료 할당량과 긴 컨텍스트 창으로 연구 업무에 최적화되어 있습니다.</p>
    </div>
  );
}

function LectureImage({
  src,
  alt,
  caption,
  variant = 'wide',
}: {
  src: string;
  alt: string;
  caption: string;
  variant?: 'wide' | 'poster';
}) {
  return (
    <figure className={`lecture-image ${variant}`}>
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

function ApiKeyDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 01 Deep Dive</span>
        <h3>Gemini API Key 발급 및 첫 호출: AI Studio에서 Python까지</h3>
        <p>
          수동으로 프롬프트를 입력하는 대신, API Key를 발급받아 Python 코드로 자동화합니다.
          반도체, 디스플레이, 배터리, 바이오 4개 분야 프롬프트를 테스트합니다.
        </p>
        <LectureImage
          src="api-key-workflow.png"
          alt="Google AI Studio에서 API Key를 발급하고 .env에 저장한 뒤 Python으로 Gemini API를 호출하는 3단계 흐름"
          caption="AI Studio에서 API Key를 발급하고 .env에 저장한 뒤 Python 호출까지 이어지는 실습 흐름입니다."
        />
      </div>

      <div className="yield-case-compare vertical-case-flow" aria-label="API Key 발급 Before Prompt After">
        <article className="yield-case-panel manual-panel">
          <span>Before: 수동 프롬프트 입력</span>
          <h4>Gemini 웹에서 매번 복사-붙여넣기로 프롬프트 실행</h4>
          <ul>
            <li>Gemini.google.com 접속</li>
            <li>프롬프트를 매번 복사하여 입력</li>
            <li>결과를 수동으로 복사하여 Excel/Word에 붙여넣기</li>
            <li>여러 데이터셋을 반복 분석할 때 비효율</li>
          </ul>
          <div className="mini-excel dense-excel">
            <strong>수동 작업 흐름</strong>
            <div style={{ padding: '1rem', background: '#f5f5f7', borderRadius: '8px', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                1. 웹 브라우저에서 Gemini 열기<br/>
                2. 프롬프트 수동 입력<br/>
                3. 응답 대기 (10-30초)<br/>
                4. 결과 복사 → Excel 붙여넣기<br/>
                5. 다음 데이터셋으로 1번부터 반복
              </p>
            </div>
          </div>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: API 자동화 지시</span>
          <h4>Python으로 Gemini API를 호출하여 자동화합니다</h4>
          <p>
            "Google AI Studio에서 API Key를 발급받고, Python google-generativeai 라이브러리를 설치해줘.
            반도체 수율 데이터를 CSV로 읽어서 Gemini에게 이상 패턴 분석을 요청하고,
            응답을 JSON 형태로 저장하는 자동화 스크립트를 만들어줘."
          </p>
          <div className="aoi-rule-grid sensor-rule-grid">
            <div><strong>API Key</strong><span>aistudio.google.com에서 발급</span></div>
            <div><strong>라이브러리</strong><span>pip install google-generativeai</span></div>
            <div><strong>자동화</strong><span>CSV → Gemini → JSON 출력</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 산출물</span>
          <h4>Python 스크립트가 자동으로 Gemini를 호출하고 결과를 저장합니다</h4>
          <div className="code-preview-box">
            <div className="visual-header">
              <span>Python Script</span>
              <strong>gemini_auto.py</strong>
            </div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', overflow: 'auto' }}>{`import google.generativeai as genai
import pandas as pd
import json
from dotenv import load_dotenv
import os

load_dotenv()
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

model = genai.GenerativeModel('gemini-pro')

# CSV 읽기
df = pd.read_csv('yield_data.csv')

# Gemini에게 분석 요청
prompt = f"""
다음 수율 데이터를 분석해줘:
{df.to_string()}

전일 대비 3% 이상 하락한 항목을 찾아
JSON 형태로 반환해줘.
"""

response = model.generate_content(prompt)
result = json.loads(response.text)

# 결과 저장
with open('gemini_result.json', 'w') as f:
    json.dump(result, f, indent=2)

print("✅ 분석 완료: gemini_result.json")`}</pre>
          </div>
          <div className="aoi-impact-strip sensor-impact-strip">
            <div><strong>5분 → 10초</strong><span>반복 작업 자동화</span></div>
            <div><strong>JSON 출력</strong><span>구조화된 데이터</span></div>
            <div><strong>무료 할당량</strong><span>15 req/min</span></div>
          </div>
          <div className="security-checklist-box">
            <Lock size={24} color="#EA4335" />
            <h4>API Key 보안 체크리스트 (필수)</h4>
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
        핵심은 Gemini가 분석 결과를 확정하는 것이 아니라, 반복 작업을 자동화하고
        엔지니어가 결과를 빠르게 검토할 수 있는 구조를 만드는 것입니다.
      </p>
      <VerifyChecklist points={apiVerifyPoints} />
    </div>
  );
}

function AntigravityApiKeyIntegration() {
  return (
    <div className="deep-dive" style={{ borderLeftColor: 'var(--accent)', background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)', marginTop: '3rem' }}>
      <div className="deep-dive-heading">
        <span>Antigravity Integration Guide</span>
        <h3>Gemini API Key 연동: 나만의 무료 초고속 에이전트 개발 환경</h3>
        <p>
          Google AI Studio에서 발급받은 API Key를 Antigravity IDE에 직접 연동하여 
          무료 한도 내에서 제한 없이 강력한 AI 에이전트 자동 코딩 환경을 구축합니다.
        </p>
        <LectureImage
          src="antigravity-api-key.png"
          alt="Antigravity 설정 창의 Model 섹션에 Gemini API Key를 입력하고 초록색 체크마크를 얻는 화면"
          caption="Antigravity IDE의 설정 -> Model Configuration에서 발급받은 Gemini API Key를 입력하여 즉시 연동할 수 있습니다."
          variant="wide"
        />
      </div>

      <div className="comparison-panel" style={{ marginTop: '2.5rem', gap: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <article className="bad-prompt" style={{ background: '#ffffff', borderColor: '#d1d5db', padding: '1.8rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <h4 style={{ color: '#1d1d1f', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.25rem', fontWeight: 900, marginBottom: '1rem' }}>
            <Sparkles size={20} color="#0071e3" /> Antigravity 요금제 연결 (Subscription)
          </h4>
          <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: '1.6', fontFamily: 'var(--font-content)' }}>
            따로 API Key를 발급받을 필요 없이, Antigravity 플랫폼에서 제공하는 통합 AI 크레딧을 소모하여 간편하게 사용하는 방식입니다.
          </p>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem', display: 'grid', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 800 }}>
            <li><strong>초간단 시작</strong>: 복잡한 API 키 발급 과정 없이 원클릭으로 구동 가능</li>
            <li><strong>인프라 관리 대행</strong>: Antigravity가 제공하는 초고속 전용 채널을 통해 안정적으로 응답 제공</li>
            <li><strong>통합 과금</strong>: 개인 계정 크레딧 결제를 통해 편리하게 정산 및 관리</li>
          </ul>
        </article>

        <article className="good-prompt" style={{ background: '#f0f7ff', borderColor: '#0071e359', padding: '1.8rem', borderRadius: '20px', border: '1px solid var(--accent)' }}>
          <h4 style={{ color: '#0071e3', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.25rem', fontWeight: 900, marginBottom: '1rem' }}>
            <Key size={20} color="#0071e3" /> Gemini API 직접 연결 (BYOK - Bring Your Own Key)
          </h4>
          <p style={{ fontSize: '0.95rem', color: '#0071e3', lineHeight: '1.6', fontWeight: 700, fontFamily: 'var(--font-content)' }}>
            Google AI Studio에서 직접 무료로 발급받은 나만의 API Key를 Antigravity 환경설정에 직접 입력하여 연동하는 방식입니다.
          </p>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem', display: 'grid', gap: '0.6rem', fontSize: '0.88rem', color: '#0071e3', fontWeight: 800 }}>
            <li><strong>독립 쿼터 사용 (무료 혜택)</strong>: AI Studio가 무료 사용자에게 제공하는 15 req/min ~ 60 req/min의 대용량 한도를 직접 활용</li>
            <li><strong>크레딧 차감 제로</strong>: Antigravity의 기본 구독 요금제 크레딧을 소모하지 않아 경제성 극대화</li>
            <li><strong>헤비 유저 최적화</strong>: 대량의 파일 코딩, 무제한 에이전트 자동화 실행 시 요금 부담 제로</li>
          </ul>
        </article>
      </div>

      <div className="highlight-box" style={{ background: '#fffbeb', borderLeftColor: '#f59e0b', marginTop: '2rem' }}>
        <p style={{ fontWeight: 800, color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          💡 엔지니어 추천 실무 자동화 가이드:
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.95rem', color: '#78350f', lineHeight: '1.6', margin: '0.5rem 0 0 0' }}>
          처음 시작할 때는 **Antigravity 요금제/기본 제공 크레딧**을 사용하여 빠르게 시스템 성능을 체험해 보세요. 
          이후 50편 이상의 연구 논문을 한번에 인덱싱하거나, 다수의 소스 코드를 반복해서 수정·개발하는 본격적인 
          **에이전트 모드**에서는 **직접 API Key를 연동(BYOK)**하여 쾌속 무료 쿼터를 활용하는 것이 생산성 측면에서 훨씬 유리합니다!
        </p>
      </div>
    </div>
  );
}

function NotebookLMDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 02 Deep Dive</span>
        <h3>NotebookLM 지식 베이스 구축: 논문 50편을 개인 AI 연구 노트로</h3>
        <p>
          PDF 논문을 업로드하면 NotebookLM이 자동으로 인덱싱하고, 출처 기반 답변을 제공합니다.
          할루시네이션 없이 정확한 정보만 추출합니다.
        </p>
        <LectureImage
          src="notebooklm-demo.png"
          alt="NotebookLM에서 논문 PDF를 소스로 추가하고 출처가 달린 답변을 받는 UI 예시"
          caption="PDF 자료가 왼쪽 소스가 되고, 오른쪽 답변에는 페이지와 그림 출처가 함께 붙습니다."
        />
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: 논문 수동 검색</span>
          <h4>Ctrl+F로 키워드를 찾고 직접 정리</h4>
          <ul>
            <li>PDF 파일 50개를 폴더에 저장</li>
            <li>각 논문을 열어 Ctrl+F로 키워드 검색</li>
            <li>관련 문단을 복사하여 Word/Notion에 정리</li>
            <li>출처 페이지 번호를 수동으로 기록</li>
            <li>연구 동향 요약을 직접 작성</li>
          </ul>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: NotebookLM 지시</span>
          <h4>논문을 업로드하고 AI에게 질문합니다</h4>
          <p>
            "업로드한 OLED 논문 50편에서 '수명 개선' 관련 연구 동향을 요약해줘.
            핵심 기술 3가지를 정리하고, 각 기술의 출처 논문과 페이지 번호를 함께 표시해줘.
            마지막에 2분짜리 팟캐스트로 요약본도 만들어줘."
          </p>
          <div className="aoi-rule-grid">
            <div><strong>업로드</strong><span>PDF 50편 드래그 앤 드롭</span></div>
            <div><strong>인덱싱</strong><span>자동으로 내용 파싱</span></div>
            <div><strong>질문</strong><span>자연어로 묻기</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 산출물</span>
          <h4>NotebookLM이 출처 포함 요약과 팟캐스트를 생성합니다</h4>
          <div className="notebooklm-result-box">
            <div className="visual-header">
              <span>NotebookLM Output</span>
              <strong>요약 + 출처</strong>
            </div>
            <div style={{ padding: '1rem', background: '#f0f7ff', borderRadius: '8px', border: '1px solid #d1e7ff' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>OLED 수명 개선 핵심 기술 3가지</h4>
              <ol style={{ lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                <li><strong>Host-Dopant 최적화</strong> - 출처: [논문 #12, p.47]</li>
                <li><strong>Encapsulation 기술</strong> - 출처: [논문 #23, p.102]</li>
                <li><strong>Charge Balance 개선</strong> - 출처: [논문 #38, p.215]</li>
              </ol>
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'white', borderRadius: '6px' }}>
                <strong>🎧 팟캐스트 요약본 (2분)</strong>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#555' }}>
                  AI 음성으로 핵심 내용을 2분 팟캐스트로 생성
                </p>
              </div>
            </div>
          </div>
          <div className="aoi-impact-strip">
            <div><strong>3시간 → 5분</strong><span>논문 요약 시간 단축</span></div>
            <div><strong>출처 자동 추적</strong><span>페이지 번호 포함</span></div>
            <div><strong>팟캐스트 생성</strong><span>이동 중 청취 가능</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 NotebookLM이 논문 내용을 암기하는 것이 아니라, 업로드한 자료에서만
        정보를 추출하여 할루시네이션 없이 정확한 답변을 제공하는 것입니다.
      </p>
      <VerifyChecklist points={notebookVerifyPoints} />
    </div>
  );
}

function AiStudioSimulatorDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 03 Deep Dive</span>
        <h3>Google AI Studio 시뮬레이터 구축: 반도체·디스플레이·배터리 공정 문제 해결</h3>
        <p>
          Google AI Studio의 강력한 System Instruction과 Prompt Engineering을 활용하여 
          첨단 공정 변수를 입력하고 실시간 수율/열폭주 시뮬레이션을 수행합니다.
        </p>
        <LectureImage
          src="ai-studio-simulator.png"
          alt="Google AI Studio에서 시스템 지시문과 템플릿 변수를 설정하여 반도체 수율 및 배터리 열폭주를 예측하는 시뮬레이터 UI 예시"
          caption="시스템 지시문(System Instruction)에 물리 공식을 정의하여 AI Studio를 강력한 공정 시뮬레이터로 작동시킵니다."
          variant="poster"
        />
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: 수동 공정 계산 및 데이터 수집</span>
          <h4>수동으로 물리 공식 계산 및 개별 엑셀 기입</h4>
          <ul>
            <li>공정 조건 변경 시마다 수율/열역학 공식 수동 재계산</li>
            <li>다중 변수(온도, 압력, 시간, 가스 조성) 상호작용 예측 불가</li>
            <li>문제가 생겨도 원인 규명 및 대책 마련에 수 시간 소요</li>
            <li>시각화 및 리포트 작성을 위한 별도 문서 작업 지연</li>
          </ul>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: AI Studio 시뮬레이터 시스템 설정</span>
          <h4>AI Studio의 System Instruction에 물리적 제약을 주입합니다</h4>
          <p>
            "너는 배터리 열폭주 예측 시뮬레이터이다. 양극재 조성(NCM811), 온도, 전압, 셀 사양을 입력하면 Arrenius 속도 식을 기반으로 내부 발열 속도와 열폭주 임계 시간을 예측하라.
            특히 온도가 80도 이상인 위험 상황에서는 물리 법칙에 기초한 원인 분석과 냉각 제어 최적화 추천안을 JSON 구조로 반환하라."
          </p>
          <div className="aoi-rule-grid sensor-rule-grid">
            <div><strong>System Instruction</strong><span>배터리 열화 물리식 정의</span></div>
            <div><strong>온도/압력/전압</strong><span>실시간 변수 매핑</span></div>
            <div><strong>JSON 출력</strong><span>결과의 대시보드 연동용</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 시뮬레이션 산출물</span>
          <h4>물리 법칙에 근거한 임계점 예측 및 문제 해결 대책을 출력합니다</h4>
          <div className="firebase-result-box">
            <div className="visual-header">
              <span>AI Studio Output</span>
              <strong>시뮬레이션 분석 완료</strong>
            </div>
            <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <p style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#166534', marginBottom: '0.5rem' }}>
                ⚠️ WARNING: 열폭주 위험 임계점 도달 감지
              </p>
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'white', borderRadius: '6px' }}>
                <strong>시뮬레이터 예측 분석 보고서 (JSON)</strong>
                <pre style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#333', overflow: 'auto' }}>{`{
  "simulation_result": {
    "status": "CRITICAL_DANGER",
    "thermal_runaway_time_sec": 142.5,
    "internal_heat_slope": "+3.2°C/sec",
    "defect_analysis": "SEI 피막 열적 파괴에 따른 음극 활물질과 전해액의 급격한 발열 반응 시작",
    "process_optimization": [
      "충전 전류 밀도를 2.0C에서 1.2C로 긴급 강하",
      "냉각 채널의 열전달 냉각재 유속을 20% 증가",
      "전력 모듈(BMS)의 최대 방전 컷오프 전압을 4.1V로 하향 설정"
    ]
  }
}`}</pre>
              </div>
            </div>
          </div>
          <div className="aoi-impact-strip sensor-impact-strip">
            <div><strong>3시간 → 1초</strong><span>공정 조건 즉시 예측</span></div>
            <div><strong>최적 공정 설계</strong><span>물리 예측 기반 제안</span></div>
            <div><strong>무료 60 RPM</strong><span>무제한 시나리오 테스트</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 AI가 허구의 답변을 하는 것이 아니라, System Instruction에 입력된 명확한 
        물리 법칙과 제약 조건을 바탕으로 빠르게 다변수 공정 시뮬레이션을 수행하고 최적 조건을 추천하는 것입니다.
      </p>
      <VerifyChecklist points={aiStudioSimulatorVerifyPoints} />
    </div>
  );
}

function InteractiveWorkshop() {
  const [fields, setFields] = useState({
    apiKey: '',
    notebook: '',
    simulator: '',
  });
  const [copied, setCopied] = useState(false);

  const hasContent = Object.values(fields).some(Boolean);

  const generated = hasContent
    ? `1. Gemini API Key: ${fields.apiKey || '[발급 예정]'}
2. NotebookLM 논문: ${fields.notebook || '[업로드 예정]'}
3. AI Studio 시뮬레이터: ${fields.simulator || '[구축 예정]'}

다음 단계: API 호출 → 논문 요약 → 시뮬레이터 테스트`
    : '';

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const inputRows: { key: keyof typeof fields; label: string; placeholder: string }[] = [
    { key: 'apiKey', label: 'API Key 상태', placeholder: '예: 발급 완료 및 Antigravity 등록' },
    { key: 'notebook', label: 'NotebookLM 자료', placeholder: '예: OLED 논문 50편 업로드' },
    { key: 'simulator', label: 'AI Studio 시뮬레이터', placeholder: '예: 배터리 열폭주 예측 시뮬레이터 구축' },
  ];

  return (
    <div className="interactive-workshop">
      <div className="iw-header">
        <FileText size={22} color="var(--accent)" />
        <strong>3단계 체크리스트</strong>
        <p>API Key, NotebookLM, AI Studio 설정을 확인하세요.</p>
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
            <Bot size={18} color="var(--accent)" />
            <strong>진행 상황</strong>
          </div>
          <div className={`iw-generated-text ${hasContent ? 'active' : ''}`}>
            {generated || '위 3단계를 입력하면\n진행 상황이 표시됩니다.'}
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
        <strong>지금 바로 해보기 — Gemini API 첫 호출</strong>
      </div>
      <div className="frg-steps">
        {apiKeySteps.map((item) => (
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
        <span>12강 미리보기</span>
        <h3>Telegram Bot으로 Gemini 알림 자동화</h3>
        <p>Gemini API를 Telegram Bot과 연동하여 실시간 알림을 받습니다. 배터리 온도 이상 시 자동 메시지 전송.</p>
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
            <span className="header-tag">Gemini 생태계로 연구 자동화하기</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Ch.11 Gemini 생태계 마스터</h1>
          <p className="subtitle">API Key 발급부터 NotebookLM, Google AI Studio 시뮬레이터 구축까지 Google AI 생태계 전체 구조 이해</p>
          <div className="lesson-meta" aria-label="lesson summary">
            <span>40분</span>
            <span>실습 중심</span>
            <span>API 호출</span>
            <span>결과물: 첫 Gemini 앱</span>
          </div>
        </motion.div>
      </header>

      <main>
        <section className="overview-section">
          <span className="section-label">01. 오프닝 및 학습목표</span>
          <h2>오늘 여러분은 Gemini API, NotebookLM, Google AI Studio를 하나의 생태계로 이해하고 공정 시뮬레이터를 만듭니다</h2>
          <p className="section-intro">
            이 강의는 단순히 Gemini 웹 채팅을 쓰는 것이 아니라, API로 자동화하고 NotebookLM으로 지식을 쌓고
            Google AI Studio에서 시뮬레이터를 만들어 실무 난제를 해결하는 전체 흐름을 이해하는 시간입니다.
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
              src={assetUrl('lecture-11-gemini-start.png')}
              alt="Gemini 생태계 코믹"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          </div>
        </section>

        <section className="definition-section">
          <span className="section-label">02. Gemini 생태계란?</span>
          <h2>Gemini는 단일 AI가 아니라 5개 도구가 연결된 생태계입니다</h2>
          <p className="section-intro">
            Gemini Pro는 AI 모델, AI Studio는 API Key 발급처이자 시뮬레이터 환경, NotebookLM은 개인 지식 베이스,
            Antigravity IDE는 AI 에이전트 개발 환경, Telegram Bot은 알림 채널입니다. 이 5가지를 함께 쓰면 강력합니다.
          </p>
          <div className="one-line-definition inline-definition">
            <span>한 문장 정의</span>
            <strong>Gemini 생태계는 API, 지식, 시뮬레이션, 에이전트 개발, 알림을 하나로 묶어 엔지니어의 연구 자동화를 완성합니다.</strong>
          </div>
          <LectureImage
            src="gemini-ecosystem.png"
            alt="Gemini Pro를 중심으로 NotebookLM, AI Studio, Antigravity IDE, Telegram Bot이 연결된 Google AI 생태계 다이어그램"
            caption="Gemini Pro, NotebookLM, AI Studio, Antigravity IDE, Telegram Bot이 하나의 자동화 워크플로우로 연결됩니다."
          />
          <div className="role-flow" aria-label="Gemini 생태계 역할 분리">
            {roleFlow.map((item, index) => (
              <div className="role-step" key={`${item.owner}-${item.task}`}>
                <span>{item.owner}</span>
                <strong>{item.task}</strong>
                {index < roleFlow.length - 1 && <ArrowRight size={22} />}
              </div>
            ))}
          </div>
          <div className="scenario-grid">
            {geminiEcosystem.map((item) => {
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
                  <p className="scenario-before">{item.description}</p>
                  <div className="intent-box">
                    <span>주요 기능</span>
                    <ul style={{ paddingLeft: '1.2rem', margin: '0.5rem 0 0 0' }}>
                      {item.features.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  </div>
                  <p className="scenario-output">{item.cost} / {item.freeQuota}</p>
                </motion.div>
              );
            })}
          </div>
          <div style={{ marginTop: '3rem', padding: '2rem', background: 'linear-gradient(135deg, #f0f7ff 0%, #f0fdf4 100%)', borderRadius: '16px', border: '1px solid rgba(0,113,227,0.1)' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: '#0071e3' }}>Gemini 생태계 5개 도구 연결 흐름</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center', minWidth: '140px' }}>
                <Code size={32} color="#4285F4" style={{ margin: '0 auto 0.5rem' }} />
                <strong>AI Studio</strong>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>API Key 발급</p>
              </div>
              <ArrowRight size={24} color="#999" />
              <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center', minWidth: '140px' }}>
                <Bot size={32} color="#4285F4" style={{ margin: '0 auto 0.5rem' }} />
                <strong>Gemini Pro</strong>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>AI 모델 호출</p>
              </div>
              <ArrowRight size={24} color="#999" />
              <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center', minWidth: '140px' }}>
                <BookOpen size={32} color="#34A853" style={{ margin: '0 auto 0.5rem' }} />
                <strong>NotebookLM</strong>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>지식 베이스</p>
              </div>
              <ArrowRight size={24} color="#999" />
              <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center', minWidth: '140px' }}>
                <Zap size={32} color="#0071e3" style={{ margin: '0 auto 0.5rem' }} />
                <strong>Antigravity</strong>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>에이전트 코딩</p>
              </div>
              <ArrowRight size={24} color="#999" />
              <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center', minWidth: '140px' }}>
                <MessageCircle size={32} color="#0088CC" style={{ margin: '0 auto 0.5rem' }} />
                <strong>Telegram Bot</strong>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>실시간 알림</p>
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem', color: '#555' }}>
              5개 도구를 순차적으로 연결하면 API 자동화 → 논문 지식 → 에이전트 코딩 → 알림까지 완성됩니다.
            </p>
          </div>
          <div className="coding-compare-grid" style={{ marginTop: '3rem' }}>
            <motion.article
              className="coding-compare-card traditional"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <img src={assetUrl('traditional-coding.png')} alt="전통적인 수동 방식" />
              <div className="compare-content">
                <span className="compare-kicker">Traditional (Manual Process)</span>
                <h3>웹 UI에서 매번 복사-붙여넣기</h3>
                <p>
                  Gemini.google.com에 접속해서 프롬프트를 입력하고, 응답을 복사하여
                  Excel/Word에 붙여넣는 반복 작업에 시간을 뺏깁니다.
                </p>
                <ul>
                  <li>매번 웹 브라우저 열고 프롬프트 입력</li>
                  <li>응답을 수동으로 복사하여 문서에 정리</li>
                  <li>여러 데이터셋 분석 시 비효율적</li>
                </ul>
              </div>
            </motion.article>

            <motion.article
              className="coding-compare-card vibe"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              <img src={assetUrl('vibe-coding.png')} alt="Gemini API 자동화" />
              <div className="compare-content">
                <span className="compare-kicker">Gemini API (Automated)</span>
                <h3>Python 스크립트로 자동 호출하고 결과 저장</h3>
                <p>
                  API Key를 발급받아 Python 코드로 Gemini를 호출하면, 반복 작업이
                  자동화되고 결과가 구조화된 JSON으로 저장됩니다.
                </p>
                <ul>
                  <li>API Key 한 번 발급으로 무제한 자동화</li>
                  <li>CSV → Gemini → JSON 자동 흐름</li>
                  <li>무료 할당량: 15 req/min</li>
                </ul>
              </div>
            </motion.article>
          </div>
        </section>

        <section>
          <span className="section-label">03. 왜 Gemini인가?</span>
          <h2>100만 토큰 컨텍스트와 무료 API로 연구 업무에 최적화</h2>
          <p className="section-intro">
            Claude, ChatGPT와 비교했을 때 Gemini는 긴 논문 분석, 무료 API, NotebookLM 연동으로
            엔지니어에게 가장 실용적입니다.
          </p>
          <PricingChart />
          <LectureImage
            src="pricing-comparison.png"
            alt="Gemini Pro, Claude Pro, ChatGPT Plus 비교표"
            caption="Gemini를 먼저 실습하는 이유를 컨텍스트, 무료 API, NotebookLM, Antigravity IDE 연동 관점에서 보여줍니다."
          />
          <div className="highlight-box" style={{ background: '#f5f5f7', borderLeftColor: '#333' }}>
            <p style={{ fontWeight: 700 }}>Target Point:</p>
            <p>"Gemini는 유료 구독 없이 무료 API로 시작할 수 있고, NotebookLM과 Antigravity IDE가 완벽하게 연동되어 연구 자동화에 최적화되어 있습니다."</p>
          </div>
        </section>

        <section>
          <span className="section-label">04. 첨단 공정기술 사례</span>
          <h2>반도체·디스플레이·배터리 엔지니어가 Gemini 생태계를 쓰는 법</h2>
          <p className="section-intro">
            단순히 채팅하는 것이 아니라, API로 수율 분석 자동화, NotebookLM으로 논문 지식 베이스 구축,
            AI Studio 시뮬레이션 환경 구축까지 전체 흐름을 연결합니다.
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
          <ApiKeyDeepDive />
          <AntigravityApiKeyIntegration />
          <NotebookLMDeepDive />
          <AiStudioSimulatorDeepDive />
        </section>

        <section className="workshop-section teaching-section">
          <span className="section-label">05. 미니 워크숍</span>
          <h2>실습: 내 첫 <mark>Gemini 생태계 앱</mark> 만들기</h2>
          <p className="section-intro">
            API Key 발급, NotebookLM 논문 업로드, AI Studio 시뮬레이터 구축을 차례로 완료하세요.
          </p>
          <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <img
              src={assetUrl('panel4.png')}
              alt="Gemini 생태계 실습 가이드"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>
          <InteractiveWorkshop />
          <FirstRunGuide />
        </section>

        <section>
          <span className="section-label">06. 품질 점검 및 정리</span>
          <h2>실행 전, 이 5가지만 확인하세요</h2>
          <div className="checklist">
            {intentChecklist.map((item) => (
              <div className="check-item" key={item}>
                <CheckCircle2 size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <LectureImage
            src="security-checklist.png"
            alt="API Key 보안 체크리스트 인포그래픽"
            caption="실무 자동화 전에 .env, .gitignore, 키 재발급, 사용량 모니터링, 프로덕션 격리를 확인합니다."
          />
          <div className="wrap-message">
            <Quote size={36} color="var(--accent)" />
            <h3>"Gemini 생태계는 AI 모델 하나가 아니라, API-지식-배포-알림이 연결된 전체 워크플로우입니다."</h3>
            <p>다음 강의: Telegram Bot으로 실시간 알림 받기 (12강)</p>
          </div>
          <NextLecturePreview />
        </section>

        <section className="professional-point">
          <div className="highlight-box" style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '24px' }}>
            <h3>Advanced Process Engineering Point</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '1rem', fontSize: '1.1rem' }}>
              "Gemini 생태계는 단순히 AI 채팅이 아니라, API 자동화, 논문 지식 베이스, AI Studio 공정 시뮬레이터를 하나로 묶어
              엔지니어의 연구 워크플로우를 완성합니다."<br/>
              API Key 관리와 보안은 엔지니어가 책임지고, AI는 반복 작업을 자동화합니다.
            </p>
            <div className="point-strip">
              <span><Wrench size={16} /> API는 자동화 도구</span>
              <span><BookOpen size={16} /> NotebookLM은 지식 창고</span>
              <span><Zap size={16} /> Antigravity는 개발 환경</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 Gemini Ecosystem for Fine Tech Engineering | LettUin Edu</p>
      </footer>
    </div>
  );
}
