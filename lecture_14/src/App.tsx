import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  Globe,
  Key,
  Layers,
  Link2,
  MessageSquare,
  Microscope,
  Quote,
  Rocket,
  Search,
  Share2,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}${filename}`;

// ============================================================================
// DATA ARRAYS - Google AI Studio 세포 분석 시뮬레이터
// ============================================================================

const learningGoals = [
  {
    step: '학습목표 1',
    title: 'Gemini API Key 발급 & AI Studio 접속',
    body: 'aistudio.google.com에서 API Key를 발급하고, AI Studio 환경에 접속해 첫 프롬프트를 실행합니다.',
    type: 'key',
  },
  {
    step: '학습목표 2',
    title: '시스템 프롬프트로 세포 분석 시뮬레이터 구축',
    body: '세포 형태, 염색 패턴, N/C ratio, 이상 세포 좌표와 신뢰도를 출력하는 시뮬레이터를 만듭니다.',
    type: 'simulator',
  },
  {
    step: '학습목표 3',
    title: '공유 링크로 팀원과 시뮬레이터 배포',
    body: 'AI Studio 공유 링크를 생성해 팀원이 동일한 시뮬레이터를 즉시 사용할 수 있게 배포합니다.',
    type: 'share',
  },
];

const lessonFlow = [
  { time: '3분', label: '오프닝' },
  { time: '7분', label: 'API Key 발급' },
  { time: '5분', label: '세포 분석 배경' },
  { time: '13분', label: '시뮬레이터 구축' },
  { time: '7분', label: '공유 링크 배포' },
  { time: '5분', label: 'Quality Gate' },
];

const deploymentMethods = [
  { lecture: '12강', method: 'GitHub Pages', type: '정적 문서', icon: Globe },
  { lecture: '13강', method: 'Streamlit Cloud', type: '인터랙티브 앱', icon: Rocket },
  { lecture: '14강', method: 'AI Studio 공유 링크', type: 'AI 시뮬레이터', icon: Share2 },
];

const manualVsAI = [
  {
    label: '기존: 수동 관찰',
    items: [
      '현미경 앞에서 세포 하나씩 육안 판별',
      '관찰자마다 기준이 달라 주관적 판정',
      '이상 세포 위치를 수기로 기록',
      '대량 슬라이드 처리 시 피로도 급증',
    ],
  },
  {
    label: 'AI: 자동 분석',
    items: [
      '이미지 한 장 넣으면 이상 세포 위치 자동 출력',
      '일관된 기준으로 신뢰도 점수 제공',
      '좌표(x, y)와 반경까지 정량적 표시',
      '자연어 소견 요약으로 빠른 판단 지원',
    ],
  },
];

const analysisTargets = [
  {
    icon: Eye,
    title: '세포 형태',
    description: '크기, 모양, 경계선 불규칙도를 정량적으로 평가합니다.',
    details: ['정상 대비 크기 비율', '원형도(circularity) 측정', '경계 불규칙 점수'],
  },
  {
    icon: Layers,
    title: '염색 패턴',
    description: 'H&E 염색 강도와 분포 특성을 분석합니다.',
    details: ['헤마톡실린 강도', '에오신 분포', '과염색/저염색 판별'],
  },
  {
    icon: Target,
    title: '핵/세포질 비율 (N/C ratio)',
    description: '핵과 세포질의 면적 비율을 계산해 이상 여부를 추정합니다.',
    details: ['정상 범위 0.4~0.6', '비율 증가 시 주의', '핵 비대 여부 판별'],
  },
  {
    icon: Search,
    title: '군집 패턴',
    description: '세포 군집(clustering)과 분산도를 평가합니다.',
    details: ['군집 밀도 측정', '분산 패턴 분석', '침윤성 배열 감지'],
  },
];

const analysisOutputs = [
  { label: '이상 세포 좌표', value: '(x, y, 반경)', color: '#8E44AD' },
  { label: '신뢰도 점수', value: '0.0 ~ 1.0', color: '#27AE60' },
  { label: '자연어 소견', value: '전체 상태 요약', color: '#2980B9' },
];

const systemPromptText = `너는 세포 병리 분석 시뮬레이터다.

사용자가 현미경 이미지를 업로드하거나 세포 관찰 데이터를 텍스트로 입력하면:

1. 세포 형태 분석: 크기, 모양, 경계 불규칙도 평가
2. 염색 패턴 분석: H&E 염색 강도와 분포 특성 평가
3. 핵/세포질 비율(N/C ratio) 계산 추정
4. 이상 세포 후보 식별:
   - 좌표 (x, y) 또는 영역 설명
   - 신뢰도 점수 (0.0~1.0)
   - 이상 유형 (크기 이상, 핵 비대, 염색 이상, 형태 변형)
5. 자연어 소견 요약: 전체적인 세포 상태와 주의 사항

출력 형식:
[이상 세포 목록]
| 번호 | 위치 | 신뢰도 | 유형 | 설명 |

[종합 소견]
- 전체 세포 상태 한 줄 요약
- 추가 검사 필요 여부
- 주의 사항

이미지가 없는 경우 텍스트 설명 기반으로 분석하라.
의료 진단이 아닌 연구/교육 목적임을 명시하라.`;

const testExample1 = '원형 세포 50개 관찰. 그 중 5개가 정상보다 1.5배 크고, 핵이 비대하며, H&E 염색이 진함. 3개는 불규칙한 경계. 나머지는 정상.';

const testExample2 = '유방암 조직 슬라이드. 기질세포 사이에 크기가 큰 세포 군집이 보임. 핵 분열상이 관찰됨.';

const aiStudioSteps = [
  { step: '1', title: 'aistudio.google.com 접속', body: 'Google 계정으로 로그인합니다.' },
  { step: '2', title: '새 프롬프트 생성', body: 'Create new prompt를 클릭합니다.' },
  { step: '3', title: 'System instruction 입력', body: '시스템 프롬프트를 붙여넣습니다.' },
  { step: '4', title: '테스트 입력', body: '세포 관찰 데이터를 입력해 결과를 확인합니다.' },
  { step: '5', title: '공유 링크 생성', body: 'Share 버튼 → Get link → 복사합니다.' },
];

const shareAdvantages = [
  { icon: Zap, title: '설치 불필요', body: '웹 브라우저만 있으면 즉시 사용 가능' },
  { icon: Users, title: 'Google 계정만', body: '별도 가입 없이 Google 계정으로 접속' },
  { icon: Sparkles, title: '무료', body: 'AI Studio 무료 요금제로 충분히 실습 가능' },
  { icon: MessageSquare, title: '동일 시스템 프롬프트', body: '팀원이 링크 열면 같은 시뮬레이터 환경' },
];

const qualityChecklist = [
  'Gemini API Key가 정상적으로 발급되었는가?',
  '시스템 프롬프트가 AI Studio에 입력되었는가?',
  '세포 관찰 데이터로 분석 결과가 정상 출력되는가?',
  '공유 링크가 생성되어 팀원이 접속 가능한가?',
];

const apiKeySteps = [
  { step: '1', title: 'aistudio.google.com 접속', body: 'Google 계정으로 로그인합니다.' },
  { step: '2', title: 'Get API Key 클릭', body: '왼쪽 메뉴 또는 상단에서 API Key 메뉴를 찾습니다.' },
  { step: '3', title: 'Create API Key', body: 'Create를 눌러 새 Key를 생성합니다.' },
  { step: '4', title: '.env 파일에 저장', body: 'GEMINI_API_KEY=발급받은키 형식으로 저장합니다.' },
  { step: '5', title: '.gitignore에 .env 추가', body: 'API Key가 Git에 올라가지 않도록 보호합니다.' },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function GoalVisual({ type }: { type: string }) {
  if (type === 'key') {
    return (
      <div className="goal-visual definition">
        <div className="visual-item person">
          <Key size={18} />
          <span>API Key</span>
        </div>
        <ArrowRight size={14} className="visual-arrow" />
        <div className="visual-item ai">
          <Brain size={18} />
          <span>AI Studio</span>
        </div>
      </div>
    );
  }
  if (type === 'simulator') {
    return (
      <div className="goal-visual elements">
        <div className="element-tag">세포 형태</div>
        <div className="element-tag">염색 패턴</div>
        <div className="element-tag">N/C ratio</div>
      </div>
    );
  }
  if (type === 'share') {
    return (
      <div className="goal-visual field">
        <div className="field-icons">
          <div className="f-icon"><Share2 size={18} /></div>
          <div className="f-icon"><Link2 size={18} /></div>
        </div>
        <div className="success-indicator">
          <CheckCircle2 size={12} />
          <span>공유 링크 배포</span>
        </div>
      </div>
    );
  }
  return null;
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

function SystemPromptDisplay() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(systemPromptText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="system-prompt-display">
      <div className="sp-header">
        <div className="sp-title-row">
          <Brain size={22} color="#8E44AD" />
          <strong>System Instruction (시스템 프롬프트)</strong>
        </div>
        <button
          className={`iw-copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          {copied
            ? <><Check size={15} />복사됨!</>
            : <><Copy size={15} />프롬프트 복사</>}
        </button>
      </div>
      <div className="sp-body">
        {systemPromptText.split('\n').map((line, i) => (
          <p key={i} className={line.trim() === '' ? 'sp-blank' : line.startsWith(' ') ? 'sp-indent' : ''}>
            {line || '\u00A0'}
          </p>
        ))}
      </div>
      <div className="sp-footer">
        <AlertTriangle size={16} color="#E67E22" />
        <span>이 프롬프트를 AI Studio의 System instruction 영역에 그대로 붙여넣으세요.</span>
      </div>
    </div>
  );
}

function TestExampleCard({ title, input, label }: { title: string; input: string; label: string }) {
  return (
    <div className="test-example-card">
      <div className="te-label">
        <Microscope size={16} color="#8E44AD" />
        <span>{label}</span>
      </div>
      <h4>{title}</h4>
      <div className="te-input">
        <p>{input}</p>
      </div>
      <div className="te-arrow">
        <ArrowRight size={16} />
        <span>AI Studio에 입력하면 이상 세포 좌표, 신뢰도, 소견이 자동 생성됩니다</span>
      </div>
    </div>
  );
}

function InteractiveWorkshop() {
  const [cellData, setCellData] = useState('');
  const [copied, setCopied] = useState(false);

  const hasContent = cellData.trim().length > 0;

  const generated = hasContent
    ? `[세포 분석 시뮬레이터 테스트 입력]
입력 데이터: ${cellData}

[다음 단계]
1. AI Studio에서 System instruction에 시스템 프롬프트 입력
2. 위 데이터를 채팅창에 붙여넣기
3. 분석 결과 확인 (이상 세포 좌표, 신뢰도, 소견)
4. Share 버튼으로 공유 링크 생성
5. 팀원에게 링크 전달`
    : '';

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="interactive-workshop">
      <div className="iw-header">
        <Microscope size={22} color="#8E44AD" />
        <strong>세포 분석 시뮬레이터 테스트</strong>
        <p>세포 관찰 데이터를 입력하면 AI Studio 실습 체크리스트가 생성됩니다.</p>
      </div>
      <div className="iw-body">
        <div className="iw-inputs">
          <div className="iw-field">
            <label htmlFor="iw-cell">세포 관찰 데이터 입력</label>
            <input
              id="iw-cell"
              type="text"
              placeholder="예: 원형 세포 30개 관찰, 그 중 4개가 정상보다 2배 크고 핵이 비대함"
              value={cellData}
              onChange={(e) => setCellData(e.target.value)}
            />
          </div>
        </div>
        <div className="iw-output">
          <div className="iw-output-header">
            <Brain size={18} color="#8E44AD" />
            <strong>실습 체크리스트</strong>
          </div>
          <div className={`iw-generated-text ${hasContent ? 'active' : ''}`}>
            {generated || '세포 관찰 데이터를 입력하면\n실습 체크리스트가 표시됩니다.'}
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

function NextLecturePreview() {
  return (
    <div className="next-lecture-card">
      <div className="nlc-header">
        <span>15강 미리보기</span>
        <h3>센서 데이터 예측 + Telegram 알림</h3>
        <p>시계열 센서 데이터를 LLM으로 예측하고, 이상 감지 시 Telegram Bot으로 실시간 알림을 발송합니다.</p>
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
      {/* ================================================================ */}
      {/* HEADER                                                          */}
      {/* ================================================================ */}
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
            <span className="header-tag">Google AI Studio로 세포 분석 시뮬레이터 배포</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Ch.14 Google AI Studio로 세포 분석 시뮬레이터 만들어 공유 링크 배포</h1>
          <p className="subtitle">
            시스템 프롬프트 하나로 세포 형태, 염색 패턴, 이상 세포 좌표와 신뢰도를 분석하는
            AI 시뮬레이터를 만들고, 공유 링크로 팀원에게 배포합니다.
          </p>
          <div className="lesson-meta" aria-label="lesson summary">
            <span>40분</span>
            <span>AI Studio</span>
            <span>코딩 0줄</span>
            <span>결과물: 세포 분석 시뮬레이터 공유 링크</span>
          </div>
        </motion.div>
      </header>

      <main>
        {/* ================================================================ */}
        {/* SECTION 01: 오프닝                                              */}
        {/* ================================================================ */}
        <section className="overview-section">
          <span className="section-label">01. 오프닝 및 학습목표 (0:00-3:00)</span>
          <h2>세 번째 배포 방법, <mark>Google AI Studio 공유 링크</mark>입니다</h2>
          <p className="section-intro">
            12강에서 GitHub Pages로 정적 문서를, 13강에서 Streamlit Cloud로 인터랙티브 앱을
            배포했습니다. 오늘은 세 번째 배포 방법으로 Google AI Studio 공유 링크를 사용해
            세포 현미경 이미지를 분석하는 AI 시뮬레이터를 만들고 배포합니다.
          </p>

          <div className="highlight-box" style={{ background: '#F4ECF7', borderLeftColor: '#8E44AD' }}>
            <p style={{ fontWeight: 700 }}>오늘 만드는 것:</p>
            <p>세포 현미경 이미지를 넣으면 이상 세포 좌표와 신뢰도를 알려주는 AI 분석기입니다. 코딩 0줄, 40분이면 완성됩니다.</p>
          </div>

          <div className="scenario-grid" style={{ marginTop: '2rem' }}>
            {deploymentMethods.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  className="scenario-card"
                  key={item.lecture}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  style={item.lecture === '14강' ? { border: '2px solid #8E44AD', background: '#FDFBFE' } : {}}
                >
                  <div className="scenario-icon" style={item.lecture === '14강' ? { background: '#F4ECF7' } : {}}>
                    <Icon size={24} color={item.lecture === '14강' ? '#8E44AD' : undefined} />
                  </div>
                  <h3>{item.lecture}: {item.method}</h3>
                  <p className="scenario-before">{item.type}</p>
                  {item.lecture === '14강' && (
                    <div className="intent-box" style={{ background: '#F4ECF7', borderColor: '#D2B4DE' }}>
                      <span>오늘의 배포 방법</span>
                      <p>시스템 프롬프트 + 공유 링크</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="learning-goals-grid" aria-label="학습목표" style={{ marginTop: '3rem' }}>
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
              src={assetUrl('panel1.png')}
              alt="세포 분석 시뮬레이터 개요"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 02: Gemini API Key 발급                                 */}
        {/* ================================================================ */}
        <section className="definition-section">
          <span className="section-label">02. Gemini API Key 발급 (3:00-10:00)</span>
          <h2>AI Studio 시뮬레이터의 기반, <mark>Gemini API Key</mark>를 발급합니다</h2>
          <p className="section-intro">
            aistudio.google.com에 접속해 API Key를 발급하고, .env 파일에 안전하게 저장합니다.
            이 Key가 오늘 만들 세포 분석 시뮬레이터의 기반이 됩니다.
          </p>

          <LectureImage
            src="panel2.png"
            alt="Google AI Studio API Key 발급 화면"
            caption="aistudio.google.com에서 Get API Key를 클릭해 Gemini API Key를 발급합니다."
          />

          <div className="first-run-guide">
            <div className="frg-title">
              <Key size={18} color="#8E44AD" />
              <strong>API Key 발급 절차</strong>
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

          <div className="highlight-box" style={{ background: '#EAFAF1', borderLeftColor: '#27AE60' }}>
            <p style={{ fontWeight: 700 }}>Python 첫 호출 테스트 (간단 확인):</p>
            <p>
              터미널에서 Python으로 간단히 호출해 Key가 작동하는지 확인합니다.
              정상이면 "Hello! How can I help you today?" 같은 응답이 돌아옵니다.
              이 Key가 AI Studio 시뮬레이터의 기반입니다.
            </p>
          </div>

          <div className="one-line-definition inline-definition" style={{ marginTop: '2rem' }}>
            <span>핵심 포인트</span>
            <strong>API Key는 .env에 저장하고 .gitignore에 반드시 추가합니다. Git에 Key가 올라가면 즉시 무효화하고 재발급해야 합니다.</strong>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 02-2: AI 이미지 분석기의 목적과 활용                     */}
        {/* ================================================================ */}
        <section>
          <span className="section-label">02-2. AI 이미지 분석기 — 목적과 4대 분야 활용</span>
          <h2>이미지 한 장이 <mark>정량적 판정 보고서</mark>로 바뀝니다</h2>
          <p className="section-intro">
            Google AI Studio에 시스템 프롬프트 하나를 설정하면, 이미지를 업로드할 때마다
            AI가 결함/이상 위치, 신뢰도 점수, 자연어 소견을 자동으로 출력합니다.
            코드 설치 불필요, 공유 링크 하나로 팀 전체가 사용 가능합니다.
          </p>

          <div className="highlight-box" style={{ background: '#E8F5E9', borderLeftColor: '#27AE60' }}>
            <p style={{ fontWeight: 700, color: '#27AE60' }}>이 도구의 목적</p>
            <ul style={{ paddingLeft: '1.2rem', lineHeight: '2', marginTop: '0.5rem' }}>
              <li><strong>주관적 판정 → 정량적 분석:</strong> "이상해 보인다" 대신 "신뢰도 0.92, 좌표 (120, 340), 유형: 핵비대"</li>
              <li><strong>개인 편차 제거:</strong> 검사자 A와 B가 같은 이미지를 보고 다른 판정 → AI는 항상 동일한 기준</li>
              <li><strong>대량 처리:</strong> 수백 장 이미지를 하나씩 보는 대신, 연속 업로드 → 연속 판정</li>
              <li><strong>즉시 배포:</strong> 설치 없이 공유 링크 하나로 팀 전체가 사용</li>
            </ul>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>4대 분야에서 이렇게 활용합니다</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>

              <div style={{ background: '#EBF5FB', borderRadius: '12px', padding: '1.2rem', borderLeft: '4px solid #2980B9' }}>
                <h4 style={{ color: '#2980B9', marginBottom: '0.5rem' }}>반도체</h4>
                <p style={{ fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>웨이퍼 결함 이미지 분석기</p>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.3rem' }}>스크래치, 파티클, 크랙 위치와 심각도를 자동 판정. SEM/광학 현미경 이미지 업로드.</p>
              </div>

              <div style={{ background: '#F5EEF8', borderRadius: '12px', padding: '1.2rem', borderLeft: '4px solid #8E44AD' }}>
                <h4 style={{ color: '#8E44AD', marginBottom: '0.5rem' }}>디스플레이</h4>
                <p style={{ fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>패널 불량 이미지 분석기</p>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.3rem' }}>Mura, 데드 픽셀, 얼룩 패턴을 자동 분류. 검사 이미지 업로드 → 불량 유형 + 위치.</p>
              </div>

              <div style={{ background: '#E8F8F5', borderRadius: '12px', padding: '1.2rem', borderLeft: '4px solid #27AE60' }}>
                <h4 style={{ color: '#27AE60', marginBottom: '0.5rem' }}>배터리</h4>
                <p style={{ fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>전극 표면 결함 분석기</p>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.3rem' }}>코팅 불균일, 핀홀, 크랙을 SEM 이미지에서 자동 검출. 위치 + 크기 + 심각도.</p>
              </div>

              <div style={{ background: '#FEF9E7', borderRadius: '12px', padding: '1.2rem', borderLeft: '4px solid #F39C12' }}>
                <h4 style={{ color: '#F39C12', marginBottom: '0.5rem' }}>바이오</h4>
                <p style={{ fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>세포 형태 분석기 (오늘 실습)</p>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.3rem' }}>이상 세포 좌표, 신뢰도, N/C ratio, 염색 패턴을 자동 분석. 소견 요약까지.</p>
              </div>
            </div>
          </div>

          <div className="highlight-box" style={{ background: '#FFF3E0', borderLeftColor: '#FF9800', marginTop: '1.5rem' }}>
            <p style={{ fontWeight: 700, color: '#E65100' }}>핵심 포인트</p>
            <p>시스템 프롬프트만 바꾸면 같은 AI Studio에서 웨이퍼 결함 분석기, 패널 불량 분석기, 전극 결함 분석기, 세포 분석기 어떤 것이든 만들 수 있습니다. 오늘은 바이오 세포 분석으로 실습하지만, 여러분 분야에 맞게 프롬프트만 교체하면 됩니다.</p>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 03: 왜 세포 분석에 AI가 필요한가?                       */}
        {/* ================================================================ */}
        <section>
          <span className="section-label">03. 왜 세포 분석에 AI가 필요한가? (10:00-15:00)</span>
          <h2>수동 관찰의 한계를 AI로 <mark>정량적 분석</mark>으로 바꿉니다</h2>
          <p className="section-intro">
            기존에는 현미경 앞에서 세포를 하나씩 관찰하며 주관적으로 판정했습니다.
            AI를 활용하면 이미지 한 장으로 이상 세포 위치, 신뢰도, 소견을 자동 출력할 수 있습니다.
          </p>

          <div className="coding-compare-grid" style={{ marginTop: '2rem' }}>
            {manualVsAI.map((side) => (
              <motion.article
                className={`coding-compare-card ${side.label.includes('기존') ? 'traditional' : 'vibe'}`}
                key={side.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="compare-content">
                  <span className="compare-kicker">{side.label}</span>
                  <ul>
                    {side.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>

          <LectureImage
            src="panel3.png"
            alt="세포 분석 AI 시뮬레이터 작동 원리"
            caption="세포 이미지 또는 텍스트 데이터를 입력하면 이상 세포 좌표, 신뢰도, 소견이 자동 출력됩니다."
          />

          <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>분석 대상 4가지</h3>
          <div className="scenario-grid">
            {analysisTargets.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  className="scenario-card"
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="scenario-icon" style={{ background: '#F4ECF7' }}>
                    <Icon size={24} color="#8E44AD" />
                  </div>
                  <h3>{item.title}</h3>
                  <p className="scenario-before">{item.description}</p>
                  <div className="intent-box" style={{ background: '#F4ECF7', borderColor: '#D2B4DE' }}>
                    <span>세부 항목</span>
                    <ul style={{ paddingLeft: '1.2rem', margin: '0.5rem 0 0 0' }}>
                      {item.details.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>출력 항목</h3>
          <div className="role-flow" aria-label="분석 출력 항목">
            {analysisOutputs.map((item, index) => (
              <div className="role-step" key={item.label}>
                <span style={{ background: item.color, color: 'white' }}>{item.label}</span>
                <strong>{item.value}</strong>
                {index < analysisOutputs.length - 1 && <ArrowRight size={22} />}
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 04: AI Studio에서 시뮬레이터 구축                        */}
        {/* ================================================================ */}
        <section className="workshop-section teaching-section">
          <span className="section-label">04. AI Studio에서 시뮬레이터 구축 (15:00-28:00)</span>
          <h2>시스템 프롬프트 하나로 <mark>세포 분석 시뮬레이터</mark>를 만듭니다</h2>
          <p className="section-intro">
            AI Studio에서 새 프롬프트를 생성하고, System instruction에 세포 병리 분석 시뮬레이터
            역할을 정의합니다. 테스트 데이터로 분석 결과를 확인합니다.
          </p>

          <div className="first-run-guide" style={{ marginBottom: '2rem' }}>
            <div className="frg-title">
              <ChevronRight size={18} color="#8E44AD" />
              <strong>AI Studio 시뮬레이터 구축 절차</strong>
            </div>
            <div className="frg-steps">
              {aiStudioSteps.map((item) => (
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

          <SystemPromptDisplay />

          <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>테스트 입력 예시</h3>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            아래 데이터를 AI Studio 채팅창에 입력하면, 이상 세포 좌표, 신뢰도, 소견이 자동으로 생성됩니다.
          </p>

          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
            <TestExampleCard
              label="테스트 1: 일반 세포 관찰"
              title="정상 세포 중 이상 세포 식별"
              input={testExample1}
            />
            <TestExampleCard
              label="테스트 2: 조직 슬라이드"
              title="유방암 조직 내 세포 군집 분석"
              input={testExample2}
            />
          </div>

          <LectureImage
            src="panel4.png"
            alt="AI Studio에서 세포 분석 시뮬레이터 테스트 결과"
            caption="AI가 이상 세포 목록(좌표, 신뢰도, 유형)과 종합 소견을 표 형식으로 출력합니다."
            variant="poster"
          />

          <div className="highlight-box" style={{ background: '#F4ECF7', borderLeftColor: '#8E44AD', marginTop: '2rem' }}>
            <p style={{ fontWeight: 700 }}>Key Point:</p>
            <p>강의자료에는 GPT로 만든 이미지를 넣고, 실제 강의에서는 AI Studio로 실습합니다. 시스템 프롬프트가 동일하면 어떤 이미지든 같은 분석 프레임으로 결과가 나옵니다.</p>
          </div>

          <InteractiveWorkshop />
        </section>

        {/* ================================================================ */}
        {/* SECTION 04-2: 실습용 샘플 이미지 다운로드                        */}
        {/* ================================================================ */}
        <section>
          <span className="section-label">04-2. 실습용 세포 이미지 12종 다운로드</span>
          <h2>AI Studio에서 분석할 <mark>H&E 염색 세포 이미지 10종</mark>을 다운로드하세요</h2>
          <p className="section-intro">
            아래 10개 세포 이미지는 H&E(헤마톡실린-에오신) 염색 현미경 관찰을 시뮬레이션한 것입니다.
            정상 조직부터 고등급 병변까지 단계별로 구성되어 있습니다. 400배율 기준.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
            {[
              { file: '01_normal_epithelial.png', label: '01. 정상 상피조직', diff: '정상', color: '#27AE60' },
              { file: '02_normal_glandular.png', label: '02. 정상 선조직', diff: '정상', color: '#27AE60' },
              { file: '03_mild_atypia.png', label: '03. 경도 이형성', diff: '초기', color: '#F39C12' },
              { file: '04_moderate_dysplasia.png', label: '04. 중등도 이형성', diff: '중간', color: '#F39C12' },
              { file: '05_hyperstained_focus.png', label: '05. 국소 과염색', diff: '중간', color: '#F39C12' },
              { file: '06_mitotic_activity.png', label: '06. 핵분열 증가', diff: '의심', color: '#E74C3C' },
              { file: '07_mixed_pathology.png', label: '07. 복합 병리', diff: '의심', color: '#E74C3C' },
              { file: '08_suspicious_cluster.png', label: '08. 의심 군집', diff: '고위험', color: '#8E44AD' },
              { file: '09_high_grade.png', label: '09. 고등급 병변', diff: '고위험', color: '#8E44AD' },
              { file: '10_borderline.png', label: '10. 경계 사례', diff: '판별어려움', color: '#666' },
            ].map((item) => (
              <a
                key={item.file}
                href={`samples/${item.file}`}
                download={item.file}
                style={{
                  display: 'block',
                  background: '#f8f9fa',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: '#333',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <img
                  src={assetUrl(`samples/${item.file}`)}
                  alt={item.label}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div style={{ padding: '0.6rem 0.8rem' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#333', marginBottom: '0.2rem' }}>{item.label}</p>
                  <span style={{ fontSize: '0.7rem', color: item.color, fontWeight: 700 }}>{item.diff}</span>
                </div>
              </a>
            ))}
          </div>

          <div className="highlight-box" style={{ background: '#E8F5E9', borderLeftColor: '#27AE60' }}>
            <p style={{ fontWeight: 700, color: '#27AE60' }}>다운로드 방법</p>
            <p>이미지를 클릭하면 자동으로 다운로드됩니다. 또는 이미지 위에서 마우스 우클릭 → "다른 이름으로 저장".</p>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 04-3: 이미지 업로드 분석 시연                             */}
        {/* ================================================================ */}
        <section>
          <span className="section-label">04-3. AI Studio에서 이미지 분석 실습</span>
          <h2>다운로드한 이미지를 <mark>AI Studio에 업로드하여 분석</mark>합니다</h2>
          <p className="section-intro">
            위에서 다운로드한 세포 이미지를 AI Studio에 업로드하면
            AI가 이상 세포의 위치, 신뢰도, 소견을 자동으로 분석합니다.
            쉬운 것(01~02)부터 시작해서 어려운 것(10~12)으로 진행합니다.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', margin: '2rem 0' }}>
            <div style={{ background: '#f8f9fa', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <img src={assetUrl('sample_a_normal.png')} alt="정상 세포 군집" style={{ width: '100%', height: 'auto' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1rem', color: '#27AE60', marginBottom: '0.3rem' }}>Sample A: 정상 세포</h3>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>균일한 크기, 매끈한 경계, 정상 N/C ratio. AI 분석 결과: "이상 세포 없음, 정상 소견"</p>
              </div>
            </div>

            <div style={{ background: '#f8f9fa', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <img src={assetUrl('sample_b_mixed.png')} alt="이상 세포 포함" style={{ width: '100%', height: 'auto' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1rem', color: '#E74C3C', marginBottom: '0.3rem' }}>Sample B: 이상 세포 5개 발견</h3>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>#1 핵비대(0.92), #2 불규칙경계(0.87), #3 과염색(0.78), #4 핵비대(0.71), #5 불규칙(0.65). 추가 검사 권장.</p>
              </div>
            </div>

            <div style={{ background: '#f8f9fa', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <img src={assetUrl('sample_c_cluster.png')} alt="의심 군집" style={{ width: '100%', height: 'auto' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1rem', color: '#E74C3C', marginBottom: '0.3rem' }}>Sample C: 의심 군집 패턴</h3>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>중심부에 이상 세포 12개 군집. 신뢰도 0.94. 조직 검사 강력 권장.</p>
              </div>
            </div>

            <div style={{ background: '#f8f9fa', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <img src={assetUrl('sample_d_comparison.png')} alt="정상 vs 이상 비교" style={{ width: '100%', height: 'auto' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1rem', color: '#8E44AD', marginBottom: '0.3rem' }}>Sample D: 정상 vs 이상 비교</h3>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>정상: N/C 0.3, 매끈, 정상염색. 이상: N/C 0.7(HIGH), 불규칙, 과염색.</p>
              </div>
            </div>
          </div>

          <div className="highlight-box" style={{ background: '#F5EEF8', borderLeftColor: '#8E44AD' }}>
            <p style={{ fontWeight: 700, color: '#8E44AD' }}>실습 절차:</p>
            <ol style={{ paddingLeft: '1.2rem', lineHeight: '2' }}>
              <li>GPT 이미지 생성 또는 위 샘플 이미지 다운로드</li>
              <li>AI Studio 채팅창에서 이미지 업로드 버튼(📎) 클릭</li>
              <li>이미지 첨부 후 "이 세포 이미지를 분석해줘" 입력</li>
              <li>AI가 이상 세포 좌표, 신뢰도, 유형, 소견 출력</li>
              <li>다른 이미지로 반복 → 결과 비교</li>
            </ol>
          </div>

          <div className="highlight-box" style={{ background: '#FFF3CD', borderLeftColor: '#F39C12', marginTop: '1rem' }}>
            <p style={{ fontWeight: 700, color: '#E67E22' }}>시뮬레이션 예측:</p>
            <p>Sample B 분석 결과에서 "#1 핵비대 세포(신뢰도 0.92)"가 발견되면, AI에게 추가 질문:<br/>
            <strong>"#1 세포의 N/C ratio가 0.7이고 H&E 과염색이라면, 예상되는 진행 경로와 추가 검사 항목을 알려줘"</strong><br/>
            → AI가 진행 예측(분화 단계, 악성 가능성), 권장 검사(면역조직화학, FISH), 추적 관찰 주기를 출력합니다.</p>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 05: 공유 링크로 배포                                    */}
        {/* ================================================================ */}
        <section>
          <span className="section-label">05. 공유 링크로 배포 (28:00-35:00)</span>
          <h2>Share 버튼 한 번으로 <mark>팀원 전체가 사용 가능</mark>합니다</h2>
          <p className="section-intro">
            AI Studio의 Share 버튼을 눌러 공유 링크를 생성합니다. 팀원이 링크를 클릭하면
            동일한 시스템 프롬프트가 적용된 세포 분석 시뮬레이터를 즉시 사용할 수 있습니다.
          </p>

          <div className="deep-dive">
            <div className="deep-dive-heading">
              <span>배포 절차</span>
              <h3>3단계 공유 링크 생성</h3>
            </div>

            <div className="yield-case-compare vertical-case-flow" aria-label="공유 링크 배포 절차">
              <article className="yield-case-panel manual-panel">
                <span>Step 1: 공유 링크 생성</span>
                <h4>AI Studio에서 Share 버튼을 클릭합니다</h4>
                <ul>
                  <li>AI Studio 우측 상단의 Share 버튼 클릭</li>
                  <li>Get link 옵션 선택</li>
                  <li>생성된 링크를 복사</li>
                </ul>
              </article>

              <article className="yield-case-panel prompt-panel">
                <span>Step 2: 팀원에게 전달</span>
                <h4>복사한 링크를 팀원에게 공유합니다</h4>
                <p>
                  Slack, 이메일, 카카오톡 등 어디서든 링크를 전달합니다.
                  팀원은 Google 계정만 있으면 됩니다.
                </p>
              </article>

              <article className="yield-case-panel result-panel">
                <span>Step 3: 즉시 사용</span>
                <h4>팀원이 링크를 열면 동일한 시뮬레이터가 열립니다</h4>
                <div className="aoi-impact-strip sensor-impact-strip">
                  <div><strong>설치 불필요</strong><span>웹 브라우저만</span></div>
                  <div><strong>동일 프롬프트</strong><span>일관된 분석</span></div>
                  <div><strong>무료</strong><span>Google 계정만</span></div>
                </div>
              </article>
            </div>
          </div>

          <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>공유 링크 배포의 장점</h3>
          <div className="scenario-grid">
            {shareAdvantages.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  className="scenario-card"
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="scenario-icon" style={{ background: '#EAFAF1' }}>
                    <Icon size={24} color="#27AE60" />
                  </div>
                  <h3>{item.title}</h3>
                  <p className="scenario-before">{item.body}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="one-line-definition inline-definition" style={{ marginTop: '2rem' }}>
            <span>세 가지 배포 방법 완성</span>
            <strong>
              12강: GitHub Pages(문서). 13강: Streamlit Cloud(앱). 14강: AI Studio 공유 링크(시뮬레이터).
              세 가지 배포 방법이 완성되었습니다.
            </strong>
          </div>

          <LectureImage
            src="panel5.png"
            alt="세 가지 배포 방법 비교"
            caption="GitHub Pages, Streamlit Cloud, AI Studio 공유 링크 - 세 가지 배포 방법이 완성되었습니다."
          />

          <div className="visual-card" style={{ marginTop: '2rem' }}>
            <div className="visual-header">
              <span>배포 방법 비교</span>
              <strong>3가지 배포 완성</strong>
            </div>
            <div className="bar-chart" role="img" aria-label="배포 방법 비교 차트">
              {deploymentMethods.map((item) => (
                <div className="bar-row" key={item.lecture}>
                  <span>{item.lecture}</span>
                  <div>
                    <i style={{ width: item.lecture === '14강' ? '100%' : item.lecture === '13강' ? '80%' : '60%' }} />
                  </div>
                  <strong>{item.method}</strong>
                </div>
              ))}
            </div>
            <p>각 배포 방법은 용도가 다릅니다. 문서는 GitHub Pages, 앱은 Streamlit, AI 시뮬레이터는 AI Studio가 최적입니다.</p>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 06: Quality Gate & 마무리                               */}
        {/* ================================================================ */}
        <section>
          <span className="section-label">06. Quality Gate & 마무리 (35:00-40:00)</span>
          <h2>배포 전, 이 4가지만 확인하세요</h2>
          <p className="section-intro">
            API Key 발급부터 공유 링크 생성까지, 각 단계가 정상적으로 완료되었는지 점검합니다.
          </p>

          <div className="checklist">
            {qualityChecklist.map((item) => (
              <div className="check-item" key={item}>
                <CheckCircle2 size={20} color="#27AE60" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="verify-checklist" style={{ marginTop: '2rem' }}>
            <span>자가 검증 포인트</span>
            <div className="verify-item">
              <CheckCircle2 size={15} />
              <p>API Key가 .env에 저장되고 .gitignore에 추가되었는가?</p>
            </div>
            <div className="verify-item">
              <CheckCircle2 size={15} />
              <p>시스템 프롬프트가 System instruction에 정확히 입력되었는가?</p>
            </div>
            <div className="verify-item">
              <CheckCircle2 size={15} />
              <p>테스트 입력에 대해 이상 세포 좌표와 신뢰도가 출력되는가?</p>
            </div>
            <div className="verify-item">
              <CheckCircle2 size={15} />
              <p>공유 링크를 다른 브라우저에서 열어 정상 작동을 확인했는가?</p>
            </div>
          </div>

          <div className="wrap-message">
            <Quote size={36} color="#8E44AD" />
            <h3>"시스템 프롬프트가 곧 시뮬레이터입니다. 프롬프트를 바꾸면 완전히 다른 분석기가 됩니다."</h3>
            <p>다음 강의: 센서 데이터 예측 + Telegram 알림 (15강)</p>
          </div>

          <NextLecturePreview />
        </section>

        {/* ================================================================ */}
        {/* PROFESSIONAL POINT                                              */}
        {/* ================================================================ */}
        <section className="professional-point">
          <div className="highlight-box" style={{ background: '#8E44AD', color: 'white', border: 'none', borderRadius: '24px' }}>
            <h3>Bio Engineering Point</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: '1rem', fontSize: '1.1rem' }}>
              "AI Studio 시뮬레이터의 본질은 시스템 프롬프트입니다. 세포 형태, 염색 패턴, N/C ratio 등
              분석 기준을 프롬프트에 명시하면, AI가 일관된 기준으로 분석합니다.
              의료 진단이 아닌 연구/교육 도구로서, 병리학자의 1차 스크리닝을 보조합니다."
            </p>
            <div className="point-strip">
              <span><Microscope size={16} /> 세포 형태 정량 분석</span>
              <span><Target size={16} /> 이상 세포 좌표 식별</span>
              <span><ExternalLink size={16} /> 공유 링크로 즉시 배포</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 Google AI Studio Cell Analysis Simulator | LettUin Edu</p>
      </footer>
    </div>
  );
}
