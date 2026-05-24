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
    title: 'Gemini API Key 확인 & AI Studio 프로젝트 생성',
    body: '14강에서 발급한 API Key를 확인하고, 새 프롬프트 프로젝트를 생성합니다.',
    type: 'key',
  },
  {
    step: '학습목표 2',
    title: '3단계 프롬프트로 3D 열응력 시뮬레이터 구축',
    body: 'UI 설계 → 물리 엔진 → 3D 시각화 순서로 다층 소재 휨(Warpage) 시뮬레이터를 완성합니다.',
    type: 'simulator',
  },
  {
    step: '학습목표 3',
    title: '공유 링크로 팀원과 시뮬레이터 배포',
    body: '완성된 시뮬레이터를 공유 링크로 배포하여 팀 협업에 즉시 활용합니다.',
    type: 'share',
  },
];

const lessonFlow = [
  { time: '1단계', label: '문제 정의 (다층 소재 열 휨)' },
  { time: '2단계', label: 'AI Studio 프로젝트 생성' },
  { time: '3단계', label: 'Phase 1 — UI 레이아웃' },
  { time: '4단계', label: 'Phase 2 — 물리 엔진' },
  { time: '5단계', label: 'Phase 3 — 3D 시각화' },
  { time: '6단계', label: '공유 링크 배포 + Quality Gate' },
];

const roleFlow = [
  { owner: '제조 엔지니어', task: '층 구성 정의, 물성치 입력, 결과 검증' },
  { owner: 'Google AI Studio', task: 'Gemini가 시뮬레이터 코드 자동 생성' },
  { owner: '공유 링크', task: '팀원 즉시 접속, 동일 시뮬레이터 사용' },
];

const manualVsAI = [
  {
    label: '기존: 유한요소법(FEM) 소프트웨어',
    items: [
      '라이선스 비용 수천만원 (ANSYS, ABAQUS)',
      '모델링 + 메시 + 경계조건 설정에 반나절',
      '전문 교육 필수 (석사 이상 역학 지식)',
      '파라미터 변경 시 재모델링 필요',
    ],
  },
  {
    label: 'AI: 웹 기반 시뮬레이터',
    items: [
      '무료 (AI Studio + React)',
      '프롬프트 입력 → 즉시 시뮬레이터 생성',
      '슬라이더로 파라미터 실시간 변경',
      '3D 결과를 팀원과 링크 하나로 공유',
    ],
  },
];

const phase1PromptText = `다층 소재의 열응력을 분석하는 웹 기반 시뮬레이터의 기본 화면을 React와 Tailwind CSS로 만들어주세요.

[화면 구조]
좌측: 제어 패널(Control Panel)
- 레이어 속성 테이블: 소재명, 두께(μm), 탄성률(GPa), CTE(ppm/°C)
- 기본 3층 구조: Silicon(500μm, 130GPa, 2.6ppm), Copper(50μm, 120GPa, 17ppm), Polyimide(25μm, 3GPa, 30ppm)
- 온도 변화(ΔT) 슬라이더: 0~200°C
- 표면 패터닝 타입 선택: Uniform / Longitudinal / Grid

우측 상단: 3D 시뮬레이션 뷰어 영역 (빈 공간, 나중에 Three.js 삽입)
우측 하단: 분석 결과 요약표
- 곡률 반지름(mm), 최대 변위(μm), 휨 형태(Smile/Cry)

[TypeScript 인터페이스]
interface Layer { name: string; thickness: number; modulus: number; cte: number; }
interface SimulationResult { curvatureRadius: number; maxDisplacement: number; warpageType: 'smile' | 'cry'; stressMap: number[][]; }`;

const phase2PromptText = `이제 레이어 데이터를 바탕으로 열 휨(Thermal Warpage)을 계산하는 핵심 함수를 구현해주세요.

[계산 로직]
1. 기계적 중립축(Neutral Axis) 계산:
   z_neutral = Σ(E_i × t_i × z_i) / Σ(E_i × t_i)
   - E_i: i번째 층 탄성률
   - t_i: i번째 층 두께
   - z_i: i번째 층 중심 z좌표

2. 굽힘 강성(Bending Stiffness):
   D = Σ E_i × [t_i³/12 + t_i × (z_i - z_neutral)²]

3. 열 모멘트(Thermal Moment):
   M_thermal = ΔT × Σ E_i × α_i × t_i × (z_i - z_neutral)

4. 곡률(Curvature):
   κ = M_thermal / D
   곡률 반지름: R = 1/κ
   최대 변위: δ = (L²/2) × κ  (L = 판 길이)

5. 패턴 보정 계수:
   - Uniform: factor = 1.0
   - Longitudinal: factor = 0.7 (한 방향만 구속)
   - Grid: factor = 0.85 (양방향 부분 구속)

6. 응력 분포:
   σ_i(z) = E_i × (α_i × ΔT - κ × (z - z_neutral))

[요구사항]
- calculateSimulation(layers, deltaT, pattern) 함수 구현
- 휨 방향 판별: κ > 0이면 'smile', κ < 0이면 'cry'
- 각 층별 최대/최소 응력값 계산
- XY 격자(20×20)에서 z 변위 맵 생성`;

const phase3PromptText = `3D 시각화와 종합 분석 대시보드를 추가해주세요.

[요구사항]
1. Three.js 또는 Plotly.js로 3D 표면 플롯:
   - 20×20 격자의 z 변위를 높이로 표현
   - 색상: 응력 크기에 따라 파랑(압축)→흰색(0)→빨강(인장) 그라데이션
   - 마우스 드래그로 회전, 스크롤로 줌

2. 응력 분포 단면도:
   - 두께 방향(z축) vs 응력 그래프
   - 각 층 경계를 수직 점선으로 표시
   - 중립축 위치 빨간 수평선

3. 결과 요약 카드:
   - 곡률 반지름 R (mm)
   - 최대 변위 δ (μm)
   - 휨 형태 (Smile ∪ / Cry ∩)
   - 최대 인장응력 / 최대 압축응력 (MPa)

4. 파라미터 감도 분석:
   - ΔT를 0~200°C로 sweep한 변위 변화 그래프
   - 각 층 두께를 ±50% 변경했을 때 변위 변화 바 차트

5. JSON Export: 전체 시뮬레이션 결과 다운로드 버튼`;

const systemPromptText = `당신은 다층 박막(Multi-layer Thin Film) 구조의 열응력 및 휨(Warpage) 시뮬레이션 전문가입니다.

[역할]
사용자가 입력한 다층 소재의 물성치와 온도 조건을 바탕으로, 열 팽창 불일치에 의한 내부 응력과 변형을 계산합니다.

[입력 파라미터]
- layers: [{name, thickness_um, modulus_GPa, cte_ppm}]
- deltaT: 온도 변화 (°C)
- pattern_type: "uniform" | "longitudinal" | "grid"
- plate_size_mm: 판 크기 (기본 100mm × 100mm)

[물리 모델]
1. 중립축: z_n = Σ(E_i·t_i·z_i) / Σ(E_i·t_i)
2. 굽힘 강성: D = Σ E_i·[t_i³/12 + t_i·(z_i - z_n)²]
3. 열 모멘트: M = ΔT · Σ E_i·α_i·t_i·(z_i - z_n)
4. 곡률: κ = M/D, 반지름 R = 1/|κ|
5. 최대 변위: δ = (L²/2)·|κ|
6. 층별 응력: σ_i = E_i·(α_i·ΔT - κ·(z - z_n))
7. 패턴 보정: uniform=1.0, longitudinal=0.7, grid=0.85

[출력 형식 - JSON]
{
  "neutralAxis_um": 250.5,
  "curvatureRadius_mm": 850,
  "maxDisplacement_um": 45.2,
  "warpageType": "smile",
  "layerStress": [
    {"name": "Silicon", "max_MPa": 12.5, "min_MPa": -8.3},
    {"name": "Copper", "max_MPa": 85.2, "min_MPa": 42.1},
    {"name": "Polyimide", "max_MPa": -5.1, "min_MPa": -15.8}
  ],
  "patternFactor": 1.0,
  "recommendation": "설계 요약"
}

[제약조건]
- 층 수: 2~10층
- 두께 범위: 1~5000 μm
- ΔT 범위: 0~300°C
- 판 크기: 10~500 mm
- 소재 DB 내장: Si, Cu, Al, PI, FR-4, Solder, Glass, SiO2`;

const procedureSteps = [
  {
    step: '1',
    title: 'AI Studio 접속 & 프로젝트 생성',
    description: 'aistudio.google.com에 접속하여 새 프롬프트 프로젝트를 생성합니다.',
    details: [
      'aistudio.google.com 접속 → Google 로그인',
      'Create new prompt 클릭',
      '(선택) 14강에서 발급한 API Key 확인',
      '프로젝트 이름: "3D Warpage Simulator"',
    ],
    icon: Key,
    color: '#4285F4',
  },
  {
    step: '2',
    title: 'Phase 1 — UI 레이아웃 & 데이터 구조',
    description: '제어 패널, 3D 뷰어, 결과 요약의 3영역 레이아웃과 TypeScript 인터페이스를 만듭니다.',
    details: [
      'Phase 1 프롬프트를 채팅창에 입력',
      '좌측 제어 패널: 레이어 테이블 + ΔT 슬라이더',
      '우측 상단: 3D 뷰어 빈 영역 확인',
      '우측 하단: 결과 요약 카드 영역 확인',
      'Layer 인터페이스 타입 정의 확인',
    ],
    icon: Layers,
    color: '#34A853',
  },
  {
    step: '3',
    title: 'Phase 2 — 물리 엔진 (중립축, 굽힘, 곡률)',
    description: '고체역학 기반 다층 박막 휨 계산 함수를 구현합니다.',
    details: [
      'Phase 2 프롬프트 추가 입력 (같은 대화에서)',
      '중립축(Neutral Axis) 계산 확인',
      '굽힘 강성(D) + 열 모멘트(M) → 곡률(κ) 도출',
      '패턴 보정 계수 적용 (uniform/longitudinal/grid)',
      'Smile/Cry 판별 로직 확인',
    ],
    icon: Eye,
    color: '#FBBC04',
  },
  {
    step: '4',
    title: 'Phase 3 — 3D 시각화 & 공유',
    description: 'Three.js 3D 표면 플롯, 응력 단면도, 감도 분석을 추가하고 공유합니다.',
    details: [
      'Phase 3 프롬프트로 3D 시각화 추가',
      '색상 맵: 파랑(압축) → 빨강(인장)',
      '응력 단면도: 층 경계 + 중립축 표시',
      'ΔT sweep 감도 분석 그래프',
      'Share → Get link → 팀원 공유',
    ],
    icon: Share2,
    color: '#EA4335',
  },
];

const qualityChecklist = [
  '레이어 물성치 입력 UI가 정상 동작하는가?',
  'ΔT 슬라이더 변경 시 결과가 실시간 업데이트되는가?',
  '중립축 위치가 물리적으로 타당한가? (두꺼운 층 쪽에 가까워야 함)',
  'CTE 큰 층이 위에 있으면 Smile, 아래에 있으면 Cry로 나오는가?',
  '3D 표면 플롯에서 응력 색상 분포가 보이는가?',
  '공유 링크로 팀원이 접속 가능한가?',
];

const keyMessages = [
  {
    icon: Layers,
    text: '3단계 프롬프트: UI 뼈대 → 물리 두뇌 → 시각화 피부 순서로 쌓으면 AI가 복잡한 공학 시뮬레이터도 정확하게 만듭니다.',
    color: '#4285F4',
  },
  {
    icon: Eye,
    text: '핵심 수식: κ = M_thermal / D. 곡률은 열 모멘트를 굽힘 강성으로 나눈 것. CTE 차이가 클수록, ΔT가 클수록 많이 휜다.',
    color: '#34A853',
  },
  {
    icon: AlertTriangle,
    text: 'AI가 만든 물리 엔진을 맹신하지 마세요. 중립축 위치와 Smile/Cry 방향이 상식에 맞는지 반드시 검증하세요.',
    color: '#EA4335',
  },
];

const deploymentMethods = [
  { lecture: '13강', method: 'Streamlit Cloud', type: '인터랙티브 앱', icon: Rocket },
  { lecture: '14강', method: 'AI Studio 링크', type: 'OLED 공진 시뮬레이터', icon: Sparkles },
  { lecture: '15강', method: 'AI Studio 링크', type: '3D 열응력 시뮬레이터', icon: Share2 },
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
        <div className="element-tag">중립축</div>
        <div className="element-tag">곡률</div>
        <div className="element-tag">3D 응력</div>
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
        <span>프롬프트</span><strong>{title}</strong>
      </div>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ background: '#f5f5f7', borderRadius: '8px', padding: '1.25rem', borderLeft: `4px solid ${color}`, whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.7', color: '#333' }}>{promptText}</div>
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
  return (<figure className="lecture-image"><img src={assetUrl(src)} alt={alt} loading="lazy" /><figcaption>{caption}</figcaption></figure>);
}

function VerifyChecklist({ points }: { points: string[] }) {
  return (
    <div className="verify-checklist"><span>Quality Gate 체크리스트</span>
      {points.map((point) => (<div className="verify-item" key={point}><CheckCircle2 size={15} /><p>{point}</p></div>))}
    </div>
  );
}

function ProcedureCard({ proc }: { proc: typeof procedureSteps[0] }) {
  const Icon = proc.icon;
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Step {proc.step}</span><h3>{proc.title}</h3><p>{proc.description}</p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img src={assetUrl(proc.step === '1' ? 'panel1.png' : proc.step === '2' ? 'panel2.png' : proc.step === '3' ? 'panel3.png' : 'panel4.png')} alt={proc.title} style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
        </div>
      </div>
      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel prompt-panel">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Icon size={16} color={proc.color} />절차</span>
          <h4>{proc.title}</h4>
          <ol style={{ lineHeight: '2', paddingLeft: '1.5rem', fontSize: '0.95rem' }}>{proc.details.map((d, i) => <li key={i}>{d}</li>)}</ol>
        </article>
      </div>
    </div>
  );
}

function InteractiveWorkshop() {
  const [fields, setFields] = useState({ phase1: '', phase2: '', shareLink: '' });
  const [copied, setCopied] = useState(false);
  const hasContent = Object.values(fields).some(Boolean);
  const generated = hasContent ? `1. Phase 1 (UI): ${fields.phase1 || '[진행 예정]'}\n2. Phase 2 (물리엔진): ${fields.phase2 || '[진행 예정]'}\n3. 공유 링크: ${fields.shareLink || '[생성 예정]'}` : '';
  const handleCopy = () => { if (!generated) return; navigator.clipboard.writeText(generated).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); }); };
  const inputRows: { key: keyof typeof fields; label: string; placeholder: string }[] = [
    { key: 'phase1', label: 'Phase 1 (UI 레이아웃)', placeholder: '예: 3영역 레이아웃 + 레이어 테이블 정상' },
    { key: 'phase2', label: 'Phase 2 (물리 엔진)', placeholder: '예: Smile/Cry 판별 정상, 곡률 계산 OK' },
    { key: 'shareLink', label: '공유 링크', placeholder: '예: https://aistudio.google.com/...' },
  ];
  return (
    <div className="interactive-workshop">
      <div className="iw-header"><Rocket size={22} color="var(--accent)" /><strong>실습 체크리스트</strong><p>각 Phase 완료 상태를 기록하세요.</p></div>
      <div className="iw-body">
        <div className="iw-inputs">{inputRows.map((row) => (<div className="iw-field" key={row.key}><label htmlFor={`iw-${row.key}`}>{row.label}</label><input id={`iw-${row.key}`} type="text" placeholder={row.placeholder} value={fields[row.key]} onChange={(e) => setFields((prev) => ({ ...prev, [row.key]: e.target.value }))} /></div>))}</div>
        <div className="iw-output">
          <div className="iw-output-header"><Sparkles size={18} color="var(--accent)" /><strong>진행 현황</strong></div>
          <div className={`iw-generated-text ${hasContent ? 'active' : ''}`}>{generated || '위 항목 입력 시 표시됩니다.'}</div>
          <button className={`iw-copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy} disabled={!hasContent}>{copied ? <><Check size={15} />복사됨!</> : <><Copy size={15} />복사</>}</button>
        </div>
      </div>
    </div>
  );
}

function FirstRunGuide() {
  const quickSteps = [
    { step: '1', title: 'AI Studio 접속', body: 'Google 로그인' },
    { step: '2', title: '새 프롬프트', body: 'Create new prompt' },
    { step: '3', title: 'Phase 1', body: 'UI 뼈대 만들기' },
    { step: '4', title: 'Phase 2', body: '물리 엔진 구현' },
    { step: '5', title: 'Phase 3', body: '3D 시각화' },
    { step: '6', title: '공유 링크', body: '팀원에게 배포' },
  ];
  return (
    <div className="first-run-guide">
      <div className="frg-title"><ExternalLink size={18} color="var(--accent)" /><strong>6단계 요약</strong></div>
      <div className="frg-steps">{quickSteps.map((item) => (<div className="frg-step" key={item.step}><span className="frg-num">{item.step}</span><div><strong>{item.title}</strong><p>{item.body}</p></div></div>))}</div>
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
            <span className="header-tag">다층 소재 열응력 시뮬레이터로 Warpage 예측</span>
          </motion.div>
        </div>
        <motion.div className="hero-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1>Ch.15 Google AI Studio 실습 (2) — 3D 열응력 & 휨 시뮬레이터</h1>
          <p className="subtitle">3단계 프롬프트로 다층 박막의 CTE 불일치에 의한 Warpage를 계산하고 3D로 시각화하는 시뮬레이터를 만듭니다.</p>
          <div className="lesson-meta">
            <span>40분</span>
            <span>실습 중심</span>
            <span>Gemini API</span>
            <span>결과물: 3D Warpage 시뮬레이터</span>
          </div>
        </motion.div>
      </header>

      <main>
      {/* 01. 학습목표 */}
      <section className="overview-section">
        <span className="section-label">01. 오프닝 및 학습목표</span>
        <h2>AI Studio로 3D 열응력 시뮬레이터 만들기</h2>
        <p className="section-intro">반도체 패키징, 디스플레이, PCB 등 제조 현장에서 만나는 Warpage 문제를 AI로 시뮬레이션합니다.</p>
        <div className="learning-goals-grid">
          {learningGoals.map((item) => (
            <div className="learning-goal-card" key={item.step}>
              <span>{item.step}</span><h3>{item.title}</h3><p>{item.body}</p>
              <div className="goal-visual-wrapper"><GoalVisual type={item.type} /></div>
            </div>
          ))}
        </div>
        <div className="lesson-timeline">
          {lessonFlow.map((item) => (<div className="timeline-step" key={item.label}><strong>{item.time}</strong><span>{item.label}</span></div>))}
        </div>
      </section>

      {/* 02. 전체 흐름 */}
      <section className="definition-section">
        <span className="section-label">02. 전체 흐름 이해</span>
        <h2>UI 뼈대 → 물리 두뇌 → 3D 피부</h2>
        <p className="section-intro">제조 엔지니어가 층 구성을 정의하면, AI가 UI → 물리 엔진 → 3D 시각화 순서로 시뮬레이터를 완성합니다.</p>
        <div className="one-line-definition inline-definition">
          <span>한 문장 정의</span>
          <strong>Google AI Studio에서 다층 박막 열응력(중립축, 곡률, 응력 분포) 계산과 3D 변형 시각화를 수행하는 Warpage 시뮬레이터를 구축하고 팀에 배포합니다.</strong>
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
        <h2 className="section-title"><AlertTriangle size={22} /> 문제 정의: 다층 소재 열 휨</h2>
        <LectureImage src="comic.png" alt="제조 엔지니어 Warpage 고민" caption="반도체 패키징, 디스플레이, PCB 등 다층 구조에서 온도 변화 시 CTE 불일치로 발생하는 Warpage" />
        <div className="compare-grid">{manualVsAI.map((col, i) => (<div className="compare-card" key={i}><h4>{col.label}</h4><ul>{col.items.map((item, j) => <li key={j}>{item}</li>)}</ul></div>))}</div>
      </motion.section>

      {/* PROCEDURE STEPS */}
      <motion.section className="section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title"><Rocket size={22} /> 실습 절차</h2>
        {procedureSteps.map((proc) => <ProcedureCard key={proc.step} proc={proc} />)}
      </motion.section>

      {/* PHASE PROMPTS */}
      <motion.section className="section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title"><MessageSquare size={22} /> 3단계 프롬프트</h2>
        <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.95rem' }}>💡 <strong>팁:</strong> Phase 1 → 확인 → Phase 2 → 확인 → Phase 3 순서로 입력하세요.</p>
        <PromptCard title="Phase 1: UI 레이아웃 & 데이터 구조" promptText={phase1PromptText} color="#4285F4" />
        <div style={{ height: '1.5rem' }} />
        <PromptCard title="Phase 2: 물리 엔진 (중립축 + 곡률 + 응력)" promptText={phase2PromptText} color="#34A853" />
        <div style={{ height: '1.5rem' }} />
        <PromptCard title="Phase 3: 3D 시각화 & 감도 분석" promptText={phase3PromptText} color="#EA4335" />
      </motion.section>

      {/* SYSTEM PROMPT */}
      <motion.section className="section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title"><Brain size={22} /> 시스템 프롬프트 (전문)</h2>
        <PromptCard title="3D 열응력 시뮬레이터 시스템 프롬프트" promptText={systemPromptText} color="#9C27B0" />
        <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '1rem' }}>이 시스템 프롬프트를 AI Studio의 "System Instructions"에 붙여넣으면 열응력 시뮬레이터로 동작합니다.</p>
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
          {deploymentMethods.map((d, i) => { const Icon = d.icon; return (<div className={`deploy-card ${d.lecture === '15강' ? 'active' : ''}`} key={i}><Icon size={24} /><span className="deploy-lecture">{d.lecture}</span><strong>{d.method}</strong><p>{d.type}</p></div>); })}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1.5rem', background: '#f0f7ff', borderRadius: '12px' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a73e8', margin: 0 }}>"제조 현장의 복잡한 물리 문제도, 프롬프트 3개면 시뮬레이터가 됩니다"</p>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid #eee', color: '#999', fontSize: '0.85rem' }}>
        <p>제조 엔지니어를 위한 AI 코딩 과정 — 15강 3D 열응력 시뮬레이터</p>
      </footer>
      </main>
    </div>
  );
}
