import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, ArrowRight, Brain, Check, CheckCircle2, ChevronRight,
  Copy, ExternalLink, Eye, Globe, Key, Layers, Link2, MessageSquare,
  Quote, Rocket, Search, Share2, Sparkles, Target, Users, Zap,
} from 'lucide-react';

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}${filename}`;

// ============================================================================
// DATA ARRAYS
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
    title: '시스템 프롬프트로 공진 시뮬레이터 구축',
    body: '3단계 프롬프트 전략으로 OLED 탠덤 공진(Resonance) 최적화 시뮬레이터를 만듭니다.',
    type: 'simulator',
  },
  {
    step: '학습목표 3',
    title: '공유 링크로 팀원과 시뮬레이터 배포',
    body: 'AI Studio 공유 링크를 생성해 팀원이 동일한 시뮬레이터를 즉시 사용할 수 있게 합니다.',
    type: 'share',
  },
];

const lessonFlow = [
  { time: '1단계', label: '문제 인식 (탠덤 시야각 이슈)' },
  { time: '2단계', label: 'AI Studio 셋업 (API Key 발급)' },
  { time: '3단계', label: 'Phase 1 프롬프트 (UI 구조)' },
  { time: '4단계', label: 'Phase 2 프롬프트 (광학 수식)' },
  { time: '5단계', label: 'Phase 3 프롬프트 (성능 분석)' },
  { time: '6단계', label: '공유 링크 배포 + Quality Gate' },
];

const roleFlow = [
  { owner: 'OLED 엔지니어', task: '문제 정의, 파라미터 설정, 결과 검증' },
  { owner: 'Google AI Studio', task: 'Gemini가 공진 시뮬레이터 코드 자동 생성' },
  { owner: '공유 링크', task: '팀원 즉시 접속, 동일 시뮬레이터 사용' },
];

const manualVsAI = [
  {
    label: '기존: Trial & Error',
    items: [
      'ITO 두께 수동 변경 → 증착 → 측정 반복',
      '1회 실험 사이클: 2~3일 소요',
      'R/G/B 각각 최적화 시 수십 회 반복 필요',
      '시야각별 성능 예측 불가',
    ],
  },
  {
    label: 'AI: 공진 시뮬레이션',
    items: [
      '파라미터 입력 → 즉시 최적 ITO 두께 출력',
      '시뮬레이션 1회: 수 초 이내',
      'R/G/B 동시 최적화 + 시야각 0~60° 분석',
      'Fabry-Perot 수식 기반 정량적 예측',
    ],
  },
];

const phase1PromptText = `React와 Recharts를 사용하여 OLED 탠덤 구조 ITO 두께 비교 웹 앱을 만들어줘.

[요구사항]
1. 탭 2개: "기존 구조" vs "RGB 차등 공진 구조"
2. 기존 구조 탭: ITO 150nm 균일 적용된 탠덤 OLED 단면도 (Glass/ITO/HTL/R-EML/CGL/G-EML/CGL/B-EML/ETL/Cathode)
3. RGB 차등 구조 탭: R=180nm, G=150nm, B=120nm으로 ITO 두께가 다른 단면도
4. 각 구조 아래에 특징 비교 테이블 (시야각 성능, 제조 난이도, 비용)
5. 스타일: 다크 테마, 보라색/파란색 계열 accent`;

const phase2PromptText = `위 앱에 "시뮬레이션" 탭을 추가해줘.

[광학 수식]
- Fabry-Perot 공진 조건: 2 × n × d × cos(θ) = m × λ
  - n: ITO 굴절률 (1.9)
  - d: ITO 두께 (nm)
  - θ: 시야각 (0~60°)
  - m: 공진 차수 (정수)
  - λ: 목표 파장 (R=620nm, G=530nm, B=460nm)

[요구사항]
1. 슬라이더 3개: R/G/B ITO 두께 입력 (80~220nm, step 5nm)
2. Recharts Line Chart: X축=시야각(0~60°), Y축=상대 휘도(%)
3. R/G/B 3개 라인 표시, 각각 색상 구분
4. 최적 두께일 때 60°에서 80% 이상 유지되는지 표시
5. cos(θ) 기반 광로장 변화 실시간 계산`;

const phase3PromptText = `"성능 분석" 탭을 추가해줘.

[요구사항]
1. 종합 KPI 카드: 평균 휘도 유지율(%), 최대 색좌표 변화(Δu'v'), 예상 수명 향상(%)
2. 바 차트: 기존 구조 vs 최적화 구조의 R/G/B별 60° 휘도 유지율 비교
3. 레이더 차트: 시야각 성능, 전력효율, 수명, 색재현율, 제조용이성 5축 비교
4. 엔지니어 리포트 요약: "ITO 두께를 R=Xnm, G=Ynm, B=Znm 설정 시 시야각 60°에서 평균 휘도 유지율 N%, Δu'v' < 0.02 확보"
5. Export 버튼: 분석 결과를 JSON으로 다운로드`;

const systemPromptText = `당신은 OLED 탠덤(Tandem) 구조의 광학 공진(Optical Resonance) 시뮬레이션 전문가입니다.
ITO(Indium Tin Oxide) 두께 최적화를 통해 시야각 색변화 및 휘도 저하를 개선합니다.

[입력 파라미터]
- R_target_wavelength: 620 nm (Red)
- G_target_wavelength: 530 nm (Green)
- B_target_wavelength: 460 nm (Blue)
- ITO_refractive_index: 1.9
- 현재 ITO 두께: R/G/B 각각 (nm)

[물리 모델]
공진 조건: 2 × n × d × cos(θ) = m × λ
- θ: 시야각 (0°, 15°, 30°, 45°, 60°)
- Snell's law: n_air × sin(θ_ext) = n_ITO × sin(θ_int)
- 상대 휘도: cos²(δ/2), δ = (4π × n × d × cos(θ_int)) / λ - 2πm

[출력 형식 - JSON]
{
  "optimalThickness": { "R_nm": 180, "G_nm": 152, "B_nm": 118 },
  "luminanceRetention_at_60deg": { "R_pct": 82.5, "G_pct": 85.1, "B_pct": 79.8 },
  "colorShift_duv": { "at_30deg": 0.008, "at_45deg": 0.014, "at_60deg": 0.019 },
  "resonanceOrder": { "R": 2, "G": 2, "B": 2 },
  "recommendation": "설계 요약"
}

[제약조건]
- ITO 두께 범위: 80~220nm
- 목표: 60°에서 상대 휘도 80% 이상, Δu'v' < 0.02
- 공진 차수(m): 2차 또는 3차 권장`;

const procedureSteps = [
  {
    step: '1',
    title: 'AI Studio 접속 & API Key 발급',
    description: 'aistudio.google.com에 접속하여 Gemini API Key를 발급받습니다.',
    details: [
      'aistudio.google.com 접속',
      'Google 계정으로 로그인',
      'Get API Key → Create API Key 클릭',
      'API Key 복사 (코드 연동 시 사용)',
      '보안: .env 파일에 저장, .gitignore에 추가',
    ],
    icon: Key,
    color: '#4285F4',
  },
  {
    step: '2',
    title: 'Phase 1 — UI 프레임워크 구축',
    description: 'Phase 1 프롬프트로 기존 구조와 RGB 차등 공진 구조를 비교하는 탭 UI를 만듭니다.',
    details: [
      '새 프롬프트 생성 (Create new prompt)',
      'Phase 1 프롬프트를 채팅창에 입력',
      '기존 Uniform ITO vs RGB 차등 공진 비교 탭 확인',
      '단면도 다이어그램 + 특징 비교 테이블 확인',
      '정상 렌더링되면 Phase 2로 진행',
    ],
    icon: Layers,
    color: '#34A853',
  },
  {
    step: '3',
    title: 'Phase 2 — 광학 공진 수식 & 그래프',
    description: 'Fabry-Perot 공진 조건과 시야각별 휘도 그래프를 추가합니다.',
    details: [
      'Phase 2 프롬프트 추가 입력',
      'Fabry-Perot 공진 조건: 2nd·cos(θ) = mλ',
      'Recharts 라인 차트: 시야각(0~60°) vs 상대 휘도',
      'R/G/B 3개 라인 색상 구분 확인',
      '슬라이더로 두께 변경 시 그래프 실시간 반영 확인',
    ],
    icon: Eye,
    color: '#FBBC04',
  },
  {
    step: '4',
    title: 'Phase 3 — 성능 분석 & 공유',
    description: '종합 성능 분석 탭을 추가하고 공유 링크를 생성합니다.',
    details: [
      'Phase 3 프롬프트로 성능 분석 탭 추가',
      'KPI 카드 + 바 차트 + 레이더 차트 확인',
      'JSON Export 기능 동작 확인',
      'Share 버튼 → Get link → 링크 복사',
      '팀원에게 링크 전달 → 동일 시뮬레이터 접속 확인',
    ],
    icon: Share2,
    color: '#EA4335',
  },
];

const qualityChecklist = [
  'Gemini API Key가 정상 발급되었는가?',
  'Phase 1: 구조 비교 UI가 탭으로 정상 표시되는가?',
  'Phase 2: 시야각(0~60°) vs 휘도 그래프가 렌더링되는가?',
  'Phase 2: 슬라이더 조작 시 그래프가 실시간 업데이트되는가?',
  'Phase 3: KPI + 차트가 포함된 성능 분석 탭이 있는가?',
  '공유 링크로 팀원이 접속 가능한가?',
];

const keyMessages = [
  {
    icon: Layers,
    text: '3단계 프롬프트 전략: 한 번에 다 요구하지 말고 UI→수식→분석 순서로 쌓으면 AI가 훨씬 정확한 코드를 생성합니다.',
    color: '#4285F4',
  },
  {
    icon: Eye,
    text: 'Fabry-Perot 공진 조건(2nd·cosθ = mλ)은 OLED뿐 아니라 모든 박막 광학 소자의 기본 원리입니다.',
    color: '#34A853',
  },
  {
    icon: AlertTriangle,
    text: 'AI가 만든 수식 코드를 100% 신뢰하지 마세요. cos(θ) vs cos(θ_int) — 내부 굴절각 적용 여부를 반드시 검증하세요.',
    color: '#EA4335',
  },
];

const deploymentMethods = [
  { lecture: '12강', method: 'GitHub Pages', type: '정적 문서', icon: Globe },
  { lecture: '13강', method: 'Streamlit Cloud', type: '인터랙티브 앱', icon: Rocket },
  { lecture: '14강', method: 'AI Studio 공유 링크', type: 'AI 시뮬레이터', icon: Share2 },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function GoalVisual({ type }: { type: string }) {
  if (type === 'key') {
    return (
      <div className="goal-visual definition">
        <div className="visual-item person"><Key size={18} /><span>API Key</span></div>
        <ArrowRight size={14} className="visual-arrow" />
        <div className="visual-item ai"><Brain size={18} /><span>AI Studio</span></div>
      </div>
    );
  }
  if (type === 'simulator') {
    return (
      <div className="goal-visual elements">
        <div className="element-tag">ITO 두께</div>
        <div className="element-tag">공진 수식</div>
        <div className="element-tag">휘도 그래프</div>
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
        <div className="success-indicator"><CheckCircle2 size={12} /><span>공유 링크 배포</span></div>
      </div>
    );
  }
  return null;
}

function KeyMessageBox({ icon: Icon, text, color }: { icon: typeof Eye; text: string; color: string }) {
  return (
    <div style={{ background: '#f5f5f7', borderRadius: '8px', padding: '1rem 1.25rem', borderLeft: `4px solid ${color}`, marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
      <Icon size={20} color={color} style={{ flexShrink: 0, marginTop: '2px' }} />
      <p style={{ fontSize: '0.95rem', color: '#333', margin: 0, lineHeight: '1.6' }}>{text}</p>
    </div>
  );
}

function PromptCard({ title, promptText, color }: { title: string; promptText: string; color: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(promptText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); }); };
  return (
    <div className="visual-card">
      <div className="visual-header" style={{ background: color }}>
        <span>프롬프트</span>
        <strong>{title}</strong>
      </div>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ background: '#f5f5f7', borderRadius: '8px', padding: '1.25rem', borderLeft: `4px solid ${color}`, whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.7', color: '#333' }}>
          {promptText}
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #ccc', background: copied ? color : '#fff', color: copied ? '#fff' : '#333', cursor: 'pointer', fontSize: '0.85rem' }}>
            {copied ? <><Check size={14} />복사됨!</> : <><Copy size={14} />프롬프트 복사</>}
          </button>
        </div>
      </div>
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
      <span>Quality Gate 체크리스트</span>
      {points.map((point) => (
        <div className="verify-item" key={point}><CheckCircle2 size={15} /><p>{point}</p></div>
      ))}
    </div>
  );
}

function ProcedureCard({ proc }: { proc: typeof procedureSteps[0] }) {
  const Icon = proc.icon;
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Step {proc.step}</span>
        <h3>{proc.title}</h3>
        <p>{proc.description}</p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img
            src={assetUrl(proc.step === '1' ? 'panel1.png' : proc.step === '2' ? 'panel2.png' : proc.step === '3' ? 'panel3.png' : 'panel4.png')}
            alt={proc.title}
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        </div>
      </div>
      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel prompt-panel">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Icon size={16} color={proc.color} />절차</span>
          <h4>{proc.title}</h4>
          <ol style={{ lineHeight: '2', paddingLeft: '1.5rem', fontSize: '0.95rem' }}>
            {proc.details.map((detail, i) => (<li key={i}>{detail}</li>))}
          </ol>
        </article>
      </div>
    </div>
  );
}

function InteractiveWorkshop() {
  const [fields, setFields] = useState({ phase1: '', phase2: '', shareLink: '' });
  const [copied, setCopied] = useState(false);
  const hasContent = Object.values(fields).some(Boolean);
  const generated = hasContent
    ? `1. Phase 1 완료: ${fields.phase1 || '[진행 예정]'}\n2. Phase 2 완료: ${fields.phase2 || '[진행 예정]'}\n3. 공유 링크: ${fields.shareLink || '[생성 예정]'}\n\n다음 단계: 팀원에게 링크 전달 → 시뮬레이터 검증`
    : '';
  const handleCopy = () => { if (!generated) return; navigator.clipboard.writeText(generated).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); }); };
  const inputRows: { key: keyof typeof fields; label: string; placeholder: string }[] = [
    { key: 'phase1', label: 'Phase 1 (UI 구조)', placeholder: '예: 탭 2개 + 단면도 정상 렌더링' },
    { key: 'phase2', label: 'Phase 2 (그래프)', placeholder: '예: 시야각 vs 휘도 그래프 정상' },
    { key: 'shareLink', label: '공유 링크', placeholder: '예: https://aistudio.google.com/...' },
  ];
  return (
    <div className="interactive-workshop">
      <div className="iw-header"><Rocket size={22} color="var(--accent)" /><strong>실습 체크리스트</strong><p>각 Phase 완료 상태와 공유 링크를 기록하세요.</p></div>
      <div className="iw-body">
        <div className="iw-inputs">
          {inputRows.map((row) => (<div className="iw-field" key={row.key}><label htmlFor={`iw-${row.key}`}>{row.label}</label><input id={`iw-${row.key}`} type="text" placeholder={row.placeholder} value={fields[row.key]} onChange={(e) => setFields((prev) => ({ ...prev, [row.key]: e.target.value }))} /></div>))}
        </div>
        <div className="iw-output">
          <div className="iw-output-header"><Sparkles size={18} color="var(--accent)" /><strong>실습 진행 현황</strong></div>
          <div className={`iw-generated-text ${hasContent ? 'active' : ''}`}>{generated || '위 항목을 입력하면\n진행 현황이 표시됩니다.'}</div>
          <button className={`iw-copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy} disabled={!hasContent}>{copied ? <><Check size={15} />복사됨!</> : <><Copy size={15} />체크리스트 복사</>}</button>
        </div>
      </div>
    </div>
  );
}

function FirstRunGuide() {
  const quickSteps = [
    { step: '1', title: 'AI Studio 접속', body: 'Google 로그인' },
    { step: '2', title: '새 프롬프트', body: 'Create new prompt' },
    { step: '3', title: 'Phase 1 입력', body: 'UI 구조 생성' },
    { step: '4', title: 'Phase 2 입력', body: '수식 + 그래프' },
    { step: '5', title: 'Phase 3 입력', body: '성능 분석' },
    { step: '6', title: '공유 링크', body: '팀원에게 배포' },
  ];
  return (
    <div className="first-run-guide">
      <div className="frg-title"><ExternalLink size={18} color="var(--accent)" /><strong>지금 바로 해보기 — 6단계</strong></div>
      <div className="frg-steps">
        {quickSteps.map((item) => (<div className="frg-step" key={item.step}><span className="frg-num">{item.step}</span><div><strong>{item.title}</strong><p>{item.body}</p></div></div>))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================

export default function App() {
  return (
    <div className="app-container">
      {/* HEADER — 13강 동일 형식 */}
      <header className="main-header">
        <div className="header-top">
          <motion.div className="logo-group" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <img src={assetUrl('logo.png')} alt="LettUin Edu" className="header-logo" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </motion.div>
          <motion.div className="header-tag-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <span className="header-tag">Google AI Studio로 OLED 공진 시뮬레이터 구축</span>
          </motion.div>
        </div>
        <motion.div className="hero-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1>Ch.14 Google AI Studio 실습 — OLED 탠덤 공진 시뮬레이터</h1>
          <p className="subtitle">3단계 프롬프트로 R/G/B ITO 두께를 최적화하는 Fabry-Perot 공진 시뮬레이터를 만들고, 공유 링크로 배포합니다.</p>
          <div className="lesson-meta">
            <span>40분</span>
            <span>실습 중심</span>
            <span>Gemini API</span>
            <span>결과물: AI 시뮬레이터 공유 링크</span>
          </div>
        </motion.div>
      </header>

      <main>
      {/* 01. 학습목표 */}
      <section className="overview-section">
        <span className="section-label">01. 오프닝 및 학습목표</span>
        <h2>AI Studio로 OLED 공진 시뮬레이터 만들기</h2>
        <p className="section-intro">
          14강에서 탠덤 OLED의 시야각 색변화 문제를 해결하는 ITO 두께 최적화 시뮬레이터를 Google AI Studio에서 만듭니다.
          프롬프트만 잘 쓰면, 코드를 모르는 엔지니어도 시뮬레이터를 만들 수 있습니다.
        </p>
        <div className="learning-goals-grid">
          {learningGoals.map((item) => (
            <div className="learning-goal-card" key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <div className="goal-visual-wrapper"><GoalVisual type={item.type} /></div>
            </div>
          ))}
        </div>
        <div className="lesson-timeline">
          {lessonFlow.map((item) => (
            <div className="timeline-step" key={item.label}><strong>{item.time}</strong><span>{item.label}</span></div>
          ))}
        </div>
      </section>

      {/* 02. 전체 흐름 */}
      <section className="definition-section">
        <span className="section-label">02. 전체 흐름 이해</span>
        <h2>3단계 프롬프트로 시뮬레이터 구축</h2>
        <p className="section-intro">엔지니어가 문제를 정의하고, AI가 Phase 1(UI) → Phase 2(수식) → Phase 3(분석) 순서로 시뮬레이터를 완성합니다.</p>
        <div className="one-line-definition inline-definition">
          <span>한 문장 정의</span>
          <strong>Google AI Studio에서 Fabry-Perot 공진 수식 기반 OLED ITO 두께 최적화 시뮬레이터를 만들고, 공유 링크로 팀 배포하는 과정입니다.</strong>
        </div>
        <div className="role-flow">
          {roleFlow.map((item, index) => (
            <div className="role-step" key={`${item.owner}-${item.task}`}>
              <span>{item.owner}</span><strong>{item.task}</strong>
              {index < roleFlow.length - 1 && <ArrowRight size={22} />}
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM & COMIC */}
      <motion.section className="section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title"><AlertTriangle size={22} /> 문제 정의: 시야각 색변화</h2>
        <LectureImage src="comic.png" alt="OLED 개발자 고민" caption="탠덤 OLED에서 측면 시야각 시 발생하는 색변화(Color Shift) 및 휘도 저하 문제" />
        <div className="compare-grid">
          {manualVsAI.map((col, i) => (
            <div className="compare-card" key={i}>
              <h4>{col.label}</h4>
              <ul>{col.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </motion.section>

      {/* PROCEDURE STEPS */}
      <motion.section className="section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title"><Rocket size={22} /> 실습 절차</h2>
        {procedureSteps.map((proc) => <ProcedureCard key={proc.step} proc={proc} />)}
      </motion.section>

      {/* PHASE PROMPTS */}
      <motion.section className="section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title"><MessageSquare size={22} /> 3단계 프롬프트</h2>
        <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          💡 <strong>팁:</strong> 한 번에 다 넣지 말고, Phase 1 결과 확인 → Phase 2 → Phase 3 순서로 입력하세요.
        </p>
        <PromptCard title="Phase 1: UI 프레임워크 (구조 비교)" promptText={phase1PromptText} color="#4285F4" />
        <div style={{ height: '1.5rem' }} />
        <PromptCard title="Phase 2: 광학 공진 수식 + 그래프" promptText={phase2PromptText} color="#34A853" />
        <div style={{ height: '1.5rem' }} />
        <PromptCard title="Phase 3: 성능 분석 + 리포트" promptText={phase3PromptText} color="#EA4335" />
      </motion.section>

      {/* SYSTEM PROMPT */}
      <motion.section className="section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title"><Brain size={22} /> 시스템 프롬프트 (전문)</h2>
        <PromptCard title="OLED 공진 시뮬레이터 시스템 프롬프트" promptText={systemPromptText} color="#9C27B0" />
        <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '1rem' }}>
          이 시스템 프롬프트를 AI Studio의 "System Instructions"에 붙여넣으면 공진 시뮬레이터로 동작합니다.
        </p>
      </motion.section>

      {/* KEY MESSAGES */}
      <motion.section className="section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title"><Quote size={22} /> 핵심 메시지</h2>
        {keyMessages.map((msg, i) => <KeyMessageBox key={i} icon={msg.icon} text={msg.text} color={msg.color} />)}
      </motion.section>

      {/* INTERACTIVE WORKSHOP */}
      <motion.section className="section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <InteractiveWorkshop />
        <FirstRunGuide />
      </motion.section>

      {/* QUALITY GATE */}
      <motion.section className="section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title"><CheckCircle2 size={22} /> Quality Gate</h2>
        <VerifyChecklist points={qualityChecklist} />
      </motion.section>

      {/* DEPLOYMENT COMPARISON */}
      <motion.section className="section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title"><Globe size={22} /> 배포 방식 비교</h2>
        <div className="deploy-grid">
          {deploymentMethods.map((d, i) => {
            const Icon = d.icon;
            return (
              <div className={`deploy-card ${d.lecture === '14강' ? 'active' : ''}`} key={i}>
                <Icon size={24} />
                <span className="deploy-lecture">{d.lecture}</span>
                <strong>{d.method}</strong>
                <p>{d.type}</p>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1.5rem', background: '#f0f7ff', borderRadius: '12px' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a73e8', margin: 0 }}>
            "프롬프트만 잘 쓰면, 코드를 모르는 엔지니어도 시뮬레이터를 만들 수 있습니다"
          </p>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid #eee', color: '#999', fontSize: '0.85rem' }}>
        <p>OLED 엔지니어를 위한 AI 코딩 과정 — 14강 Google AI Studio 실습</p>
      </footer>
      </main>
    </div>
  );
}
