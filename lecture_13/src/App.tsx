import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Battery,
  Check,
  CheckCircle2,
  Cloud,
  Copy,
  Database,
  Dna,
  ExternalLink,
  FileText,
  Github,
  Globe,
  LineChart,
  Quote,
  Rocket,
  Sparkles,
  TrendingUp,
  Upload,
  Zap,
} from 'lucide-react';

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}${filename}`;

// ============================================================================
// DATA ARRAYS - Antigravity → GitHub → Streamlit Cloud 배포
// ============================================================================

const learningGoals = [
  {
    step: '학습목표 1',
    title: 'Antigravity IDE에서 Streamlit 앱 만들기',
    body: 'AI에게 OLED 증착 공정 데이터 분석 Streamlit 앱을 만들도록 프롬프트를 작성하고, app.py와 requirements.txt를 생성합니다.',
    type: 'create',
  },
  {
    step: '학습목표 2',
    title: 'GitHub에 파일 올리기',
    body: 'GitHub에 새 저장소를 만들고, app.py와 requirements.txt를 드래그 & 드롭으로 업로드합니다.',
    type: 'upload',
  },
  {
    step: '학습목표 3',
    title: 'Streamlit Cloud로 배포하기',
    body: 'streamlit.io에서 GitHub 저장소를 연결하고 실제 돌아가는 앱 URL을 생성합니다.',
    type: 'deploy',
  },
];

const lessonFlow = [
  { time: '1단계', label: 'Antigravity에서 Streamlit 앱 만들기' },
  { time: '2단계', label: 'app.py + requirements.txt 확인' },
  { time: '3단계', label: 'GitHub 저장소 만들기' },
  { time: '4단계', label: '파일 올리기' },
  { time: '5단계', label: 'streamlit.io 연결 + 배포' },
  { time: '6단계', label: 'URL 확인 + 공유' },
];

const roleFlow = [
  { owner: '엔지니어', task: '프롬프트 작성, CSV 데이터 준비, 결과 검증' },
  { owner: 'Antigravity', task: 'AI가 app.py + requirements.txt 자동 생성' },
  { owner: 'GitHub', task: '파일 저장소, 버전 관리' },
  { owner: 'Streamlit Cloud', task: '앱 배포, URL 생성, 팀 공유' },
];

const domainExamples = [
  {
    icon: BarChart3,
    domain: 'OLED 증착 (Display)',
    data: 'oled_deposition_xymap.csv',
    columns: 'chamber_id, panel_id, lot_id, x_position, y_position, thickness, yield_score, pass_fail',
    prompt: '"OLED 증착 공정 데이터를 분석하는 Streamlit 앱을 만들어줘. 챔버별 수율(pass_fail 기준), 두께 분포 박스플롯, X-Y 히트맵, 이상치 감지를 포함해줘"',
    output: '챔버별 수율 바 차트 + 두께 분포 + X-Y 히트맵 + 3-sigma 이상치 표시',
    color: '#34A853',
  },
  {
    icon: Activity,
    domain: '반도체 CVD (Semiconductor)',
    data: 'cvd_film_thickness.csv',
    columns: 'chamber_id, wafer_id, x_pos, y_pos, film_thickness, uniformity',
    prompt: '"CVD 박막 두께 균일도를 분석하는 Streamlit 앱을 만들어줘. 챔버별 균일도 비교, 웨이퍼 맵 히트맵, 이상 웨이퍼 감지를 포함해줘"',
    output: '챔버별 균일도 비교 + 웨이퍼 맵 + 이상 웨이퍼 하이라이트',
    color: '#4285F4',
  },
  {
    icon: Battery,
    domain: '배터리 전극 코팅 (Battery)',
    data: 'electrode_coating.csv',
    columns: 'coater_id, roll_id, position, coating_thickness, density, defect_flag',
    prompt: '"배터리 전극 코팅 두께 분석 Streamlit 앱을 만들어줘. 코터별 두께 균일도, 위치별 히트맵, 불량 플래그 기준 수율을 보여줘"',
    output: '코터별 두께 균일도 + 위치별 히트맵 + 불량률 통계',
    color: '#FBBC04',
  },
  {
    icon: Dna,
    domain: '바이오 세포 배양 (Bio)',
    data: 'cell_culture_density.csv',
    columns: 'well_id, plate_id, x_pos, y_pos, cell_density, viability, confluence',
    prompt: '"세포 배양 밀도 분석 Streamlit 앱을 만들어줘. 플레이트별 밀도 분포, 위치별 히트맵, 생존율 기준 이상 웰 감지를 포함해줘"',
    output: '플레이트별 밀도 분포 + 위치별 히트맵 + 이상 웰 감지',
    color: '#EA4335',
  },
];

const oledPromptText = `OLED 증착 공정 데이터(oled_deposition_xymap.csv)를 분석하는 Streamlit 앱을 만들어줘.

데이터 구조:
- 24,576행, 29컬럼
- 핵심 컬럼: chamber_id(C1~C4), panel_id, lot_id, x_position, y_position, thickness, yield_score, pass_fail
- yield_score: 0~100 연속값 (품질 점수)
- pass_fail: 0 또는 1 (합격 판정, 1=합격)

수율 정의 (중요!):
- 올바른 수율 = pass_fail이 1인 비율 x 100
- yield_score는 수율이 아님, 품질 점수임

앱 기능:
1. CSV 파일 업로드 (st.file_uploader)
2. 챔버별 수율 바 차트 (pass_fail 기준)
3. 챔버별 두께 분포 박스플롯
4. X-Y 위치별 두께 히트맵 (선택한 챔버/패널)
5. 이상치 감지: 3-sigma 벗어나는 측정점 표시
6. 요약 통계 테이블

app.py와 requirements.txt 두 파일로 만들어줘.`;

const resultInterpretation = [
  { chamber: 'C1', yield: '95.6%', note: '가장 높음', color: '#34A853' },
  { chamber: 'C2', yield: '84.5%', note: '', color: '#4285F4' },
  { chamber: 'C3', yield: '89.1%', note: '', color: '#FBBC04' },
  { chamber: 'C4', yield: '81.2%', note: '가장 낮음 → 점검 필요', color: '#EA4335' },
];

const procedureSteps = [
  {
    step: '1',
    title: 'Antigravity IDE에서 앱 만들기',
    description: 'Antigravity IDE를 열고 AI에게 OLED 증착 공정 데이터 분석 Streamlit 앱을 만들어달라고 프롬프트를 입력합니다.',
    details: [
      'Antigravity IDE 접속',
      '위의 OLED 전용 프롬프트를 복사하여 입력',
      'AI가 app.py 생성 확인',
      'AI가 requirements.txt 생성 확인',
      '로컬에서 streamlit run app.py로 테스트',
    ],
    icon: Sparkles,
    color: '#4285F4',
  },
  {
    step: '2',
    title: '파일 확인',
    description: 'AI가 만든 app.py와 requirements.txt 파일이 정상인지 확인합니다.',
    details: [
      'app.py: CSV 업로드 + 챔버별 수율 + 두께 분포 + 히트맵 + 이상치 감지 포함',
      'requirements.txt: streamlit, pandas, numpy, plotly 등 포함',
      '브라우저에서 localhost:8501 접속',
      'oled_deposition_xymap.csv 파일 업로드',
      '챔버별 수율이 pass_fail 기준으로 계산되는지 확인 (C1: 95.6%, C4: 81.2%)',
    ],
    icon: FileText,
    color: '#34A853',
  },
  {
    step: '3-4',
    title: 'GitHub 저장소 만들기 + 파일 올리기',
    description: 'GitHub에 새 저장소를 만들고, app.py와 requirements.txt를 드래그 & 드롭으로 업로드합니다.',
    details: [
      'github.com에서 New repository 클릭',
      '저장소 이름: oled-deposition-analyzer',
      'app.py + requirements.txt 파일 드래그 & 드롭',
      '두 파일 모두 업로드 확인',
      'Commit changes 클릭',
    ],
    icon: Github,
    color: '#333333',
  },
  {
    step: '5-6',
    title: 'Streamlit Cloud 연결 + 배포',
    description: 'streamlit.io에서 GitHub 저장소를 연결하고 앱을 배포합니다.',
    details: [
      'streamlit.io/cloud 접속 → Sign in with GitHub',
      'New app → GitHub 저장소 선택',
      'Main file path: app.py',
      'Deploy 클릭 → 1-2분 대기',
      '배포된 URL을 팀원에게 공유!',
    ],
    icon: Cloud,
    color: '#FF4B4B',
  },
];

const qualityChecklist = [
  'Antigravity에서 app.py가 생성되었는가?',
  'requirements.txt가 함께 만들어졌는가?',
  '로컬에서 streamlit run app.py가 정상 실행되는가?',
  '챔버별 수율이 pass_fail 기준으로 계산되는가? (C1: 95.6%, C4: 81.2%)',
  'Streamlit Cloud 배포 URL에서 CSV 업로드가 작동하는가?',
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function GoalVisual({ type }: { type: string }) {
  if (type === 'create') {
    return (
      <div className="goal-visual definition">
        <div className="visual-item person">
          <Sparkles size={18} />
          <span>프롬프트</span>
        </div>
        <ArrowRight size={14} className="visual-arrow" />
        <div className="visual-item ai">
          <FileText size={18} />
          <span>app.py</span>
        </div>
      </div>
    );
  }
  if (type === 'upload') {
    return (
      <div className="goal-visual elements">
        <div className="element-tag">GitHub</div>
        <div className="element-tag">app.py</div>
        <div className="element-tag">req.txt</div>
      </div>
    );
  }
  if (type === 'deploy') {
    return (
      <div className="goal-visual field">
        <div className="field-icons">
          <div className="f-icon"><Cloud size={18} /></div>
          <div className="f-icon"><Globe size={18} /></div>
        </div>
        <div className="success-indicator">
          <CheckCircle2 size={12} />
          <span>URL 공유</span>
        </div>
      </div>
    );
  }
  return null;
}

function DomainPromptCards() {
  return (
    <div className="visual-card">
      <div className="visual-header">
        <span>4개 분야 CSV 분석 예시</span>
        <strong>Antigravity에 입력할 프롬프트</strong>
      </div>
      <div style={{ padding: '1.5rem' }}>
        {domainExamples.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.domain} style={{ marginBottom: '1rem', padding: '1rem', background: '#f5f5f7', borderRadius: '8px', borderLeft: `4px solid ${item.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Icon size={20} color={item.color} />
                <strong style={{ color: item.color }}>{item.domain}</strong>
              </div>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0', color: '#555' }}>
                <strong>CSV:</strong> {item.data} ({item.columns})
              </p>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0', color: '#333', fontStyle: 'italic' }}>
                <strong>프롬프트:</strong> {item.prompt}
              </p>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0', color: '#333' }}>
                <strong>결과:</strong> {item.output}
              </p>
            </div>
          );
        })}
      </div>
      <p>모든 분야에서 동일한 프롬프트 패턴을 사용합니다. CSV 구조만 다릅니다.</p>
    </div>
  );
}

function OledPromptCard() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(oledPromptText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };
  return (
    <div className="visual-card">
      <div className="visual-header">
        <span>Antigravity AI 프롬프트</span>
        <strong>OLED 증착 공정 데이터 분석 앱 생성 프롬프트</strong>
      </div>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ background: '#f5f5f7', borderRadius: '8px', padding: '1.25rem', borderLeft: '4px solid #34A853', whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.7', color: '#333' }}>
          {oledPromptText}
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleCopy}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #ccc', background: copied ? '#34A853' : '#fff', color: copied ? '#fff' : '#333', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            {copied ? <><Check size={14} />복사됨!</> : <><Copy size={14} />프롬프트 복사</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultInterpretationCard() {
  return (
    <div className="visual-card">
      <div className="visual-header">
        <span>결과 해석</span>
        <strong>챔버별 수율 비교 (pass_fail 기준)</strong>
      </div>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {resultInterpretation.map((item) => (
            <div key={item.chamber} style={{ padding: '1rem', background: '#f5f5f7', borderRadius: '8px', borderLeft: `4px solid ${item.color}`, textAlign: 'center' }}>
              <strong style={{ fontSize: '1.1rem', color: item.color }}>{item.chamber}</strong>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0', color: '#333' }}>{item.yield}</p>
              {item.note && <p style={{ fontSize: '0.8rem', color: item.color, fontWeight: 600 }}>{item.note}</p>}
            </div>
          ))}
        </div>
        <div style={{ background: '#FFF3E0', borderRadius: '8px', padding: '1rem', borderLeft: '4px solid #FF9800', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.9rem', color: '#E65100', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
            yield_score 평균으로 계산하면 모든 챔버가 85~90으로 비슷해 보여서 문제를 놓침
          </p>
          <p style={{ fontSize: '0.9rem', color: '#333', margin: 0 }}>
            pass_fail 기준으로 계산해야 C4의 문제가 드러남
          </p>
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
// PROCEDURE SECTIONS (No Code)
// ============================================================================

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
            src={assetUrl(proc.step === '1' ? 'panel1.png' : proc.step === '2' ? 'panel2.png' : proc.step === '3-4' ? 'panel3.png' : 'panel4.png')}
            alt={proc.title}
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        </div>
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel prompt-panel">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icon size={16} color={proc.color} />
            절차
          </span>
          <h4>{proc.title}</h4>
          <ol style={{ lineHeight: '2', paddingLeft: '1.5rem', fontSize: '0.95rem' }}>
            {proc.details.map((detail, i) => (
              <li key={i}>{detail}</li>
            ))}
          </ol>
        </article>
      </div>
    </div>
  );
}

function InteractiveWorkshop() {
  const [fields, setFields] = useState({
    appCreated: '',
    githubRepo: '',
    deployedUrl: '',
  });
  const [copied, setCopied] = useState(false);

  const hasContent = Object.values(fields).some(Boolean);

  const generated = hasContent
    ? `1. Antigravity 앱 생성: ${fields.appCreated || '[진행 예정]'}
2. GitHub 저장소: ${fields.githubRepo || '[생성 예정]'}
3. 배포 URL: ${fields.deployedUrl || '[배포 예정]'}

다음 단계: oled_deposition_xymap.csv 업로드 테스트 → 팀원에게 URL 공유`
    : '';

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const inputRows: { key: keyof typeof fields; label: string; placeholder: string }[] = [
    { key: 'appCreated', label: 'Antigravity 앱 생성', placeholder: '예: app.py + requirements.txt 완료' },
    { key: 'githubRepo', label: 'GitHub 저장소', placeholder: '예: github.com/username/oled-deposition-analyzer' },
    { key: 'deployedUrl', label: '배포된 URL', placeholder: '예: https://oled-deposition-analyzer.streamlit.app' },
  ];

  return (
    <div className="interactive-workshop">
      <div className="iw-header">
        <Rocket size={22} color="var(--accent)" />
        <strong>배포 체크리스트</strong>
        <p>Antigravity 앱 생성 → GitHub 업로드 → Streamlit 배포를 확인하세요.</p>
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
            <Database size={18} color="var(--accent)" />
            <strong>배포 진행 현황</strong>
          </div>
          <div className={`iw-generated-text ${hasContent ? 'active' : ''}`}>
            {generated || '위 3단계를 입력하면\n배포 진행 현황이 표시됩니다.'}
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
  const quickSteps = [
    { step: '1', title: 'Antigravity IDE 열기', body: '프롬프트 입력' },
    { step: '2', title: 'app.py 확인', body: '로컬 테스트' },
    { step: '3', title: 'GitHub 저장소', body: '새 레포 생성' },
    { step: '4', title: '파일 업로드', body: '드래그 & 드롭' },
    { step: '5', title: 'Streamlit 배포', body: 'GitHub 연결' },
    { step: '6', title: 'URL 공유', body: '팀원에게 전송' },
  ];

  return (
    <div className="first-run-guide">
      <div className="frg-title">
        <ExternalLink size={18} color="var(--accent)" />
        <strong>지금 바로 해보기 — 6단계 배포</strong>
      </div>
      <div className="frg-steps">
        {quickSteps.map((item) => (
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
        <span>14강 미리보기</span>
        <h3>이미지 분석 자동화: Gemini Vision API</h3>
        <p>AOI 불량 이미지를 Gemini Vision API로 자동 분류하고 통계 리포트를 생성합니다. 수백 장 이미지를 몇 초만에 분석.</p>
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
            <span className="header-tag">Antigravity → GitHub → Streamlit Cloud 배포</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Ch.13 데이터 분석 자동화 & Streamlit 배포</h1>
          <p className="subtitle">Antigravity IDE에서 AI에게 OLED 증착 공정 데이터 분석 앱을 만들게 하고, GitHub + Streamlit Cloud로 배포합니다.</p>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.75)', marginTop: '0.5rem' }}>
            실습 데이터: oled_deposition_xymap.csv (24,576행, 29컬럼)
          </p>
          <div className="lesson-meta" aria-label="lesson summary">
            <span>6단계</span>
            <span>배포 실습</span>
            <span>4개 분야</span>
            <span>결과물: 실제 배포 URL</span>
          </div>
        </motion.div>
      </header>

      <main>
        <section className="overview-section">
          <span className="section-label">01. 오프닝 및 학습목표</span>
          <h2>AI가 만든 앱을 실제 URL로 배포하기</h2>
          <p className="section-intro">
            12강에서 문서를 만들었다면, 13강에서는 앱을 만듭니다.
            OLED 증착 공정 실측 데이터 -- 챔버 4개, 패널 4장, LOT 2개를 분석하는 Streamlit 앱을 Antigravity IDE에서 AI로 생성하고, GitHub + Streamlit Cloud로 배포합니다.
          </p>
          <p className="section-intro" style={{ marginTop: '0.5rem', fontWeight: 600, color: '#EA4335' }}>
            수율 정의(yield_score vs pass_fail)가 핵심 -- AI에게 올바른 정의를 알려주지 않으면 차트가 이상하게 나옵니다.
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
          <div className="lesson-timeline" aria-label="6단계 진행표">
            {lessonFlow.map((item) => (
              <div className="timeline-step" key={item.label}>
                <strong>{item.time}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <LectureImage
            src="logo.png"
            alt="Antigravity에서 app.py 생성, GitHub 업로드, Streamlit Cloud 배포까지 이어지는 6단계 흐름"
            caption="Antigravity에서 app.py 생성, GitHub 업로드, Streamlit Cloud 배포까지 이어지는 6단계 흐름"
          />
        </section>

        <section className="definition-section">
          <span className="section-label">02. 전체 흐름 이해</span>
          <h2>프롬프트 하나로 앱 생성 → 배포까지</h2>
          <p className="section-intro">
            엔지니어가 프롬프트를 작성하면 Antigravity AI가 앱을 만들고,
            GitHub에 올린 후 Streamlit Cloud가 자동 배포합니다.
          </p>
          <div className="one-line-definition inline-definition">
            <span>한 문장 정의</span>
            <strong>Antigravity IDE에서 AI가 OLED 증착 공정 데이터 분석 앱을 생성하고, GitHub + Streamlit Cloud로 실제 URL을 만들어 팀원과 공유하는 전체 배포 흐름입니다.</strong>
          </div>
          <div className="role-flow" aria-label="배포 역할 분리">
            {roleFlow.map((item, index) => (
              <div className="role-step" key={`${item.owner}-${item.task}`}>
                <span>{item.owner}</span>
                <strong>{item.task}</strong>
                {index < roleFlow.length - 1 && <ArrowRight size={22} />}
              </div>
            ))}
          </div>
        </section>

        <section>
          <span className="section-label">03. AI 프롬프트 및 분야별 예시</span>
          <h2>OLED 증착 데이터 분석 프롬프트</h2>
          <p className="section-intro">
            아래 프롬프트를 Antigravity IDE에 입력하면 OLED 증착 공정 분석 앱이 생성됩니다.
            수율 정의(pass_fail 기준)를 명확히 알려주는 것이 핵심입니다.
          </p>
          <OledPromptCard />
          <ResultInterpretationCard />
          <h3 style={{ marginTop: '3rem', marginBottom: '1rem' }}>다른 분야에도 동일한 패턴 적용</h3>
          <p className="section-intro">
            OLED 증착 두께 균일도 분석이 기본 예시이며, 반도체 CVD 박막 두께 분석, 배터리 전극 코팅 두께 분석, 바이오 세포 배양 밀도 분석에도 동일한 프롬프트 패턴을 사용합니다.
          </p>
          <DomainPromptCards />
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <img
              src={assetUrl('comic.png')}
              alt="4개 분야 CSV 예시"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>
        </section>

        <section>
          <span className="section-label">04. 실습 절차</span>
          <h2>6단계 배포 절차 (코드 작성 없음 -- AI가 전부 만듦)</h2>
          <p className="section-intro">
            엔지니어는 프롬프트를 작성하고, 파일을 확인하고, 클릭으로 배포합니다.
            코드를 직접 작성할 필요가 없습니다.
          </p>
          {procedureSteps.map((proc) => (
            <ProcedureCard key={proc.step} proc={proc} />
          ))}
        </section>

        <section className="workshop-section teaching-section">
          <span className="section-label">05. 미니 워크숍</span>
          <h2>실습: 내 첫 <mark>Streamlit 앱 배포</mark></h2>
          <p className="section-intro">
            Antigravity에서 OLED 증착 분석 앱을 만들고, GitHub에 올리고, Streamlit Cloud로 배포하세요.
          </p>
          <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <img
              src={assetUrl('panel4.png')}
              alt="Streamlit Cloud 배포"
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
            {qualityChecklist.map((item) => (
              <div className="check-item" key={item}>
                <CheckCircle2 size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="wrap-message">
            <Quote size={36} color="var(--accent)" />
            <h3>"Antigravity에서 프롬프트 하나로 OLED 증착 분석 앱을 만들고, GitHub + Streamlit Cloud로 팀원 누구나 접속할 수 있는 URL을 배포합니다."</h3>
            <p>다음 강의: 이미지 분석 자동화 (Gemini Vision API) -- 14강</p>
          </div>
          <NextLecturePreview />
        </section>

        <section className="professional-point">
          <div className="highlight-box" style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '24px' }}>
            <h3>Advanced Process Engineering Point</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '1rem', fontSize: '1.1rem' }}>
              "AI가 만든 앱을 실제 배포까지 완료하면, 엔지니어는 데이터 분석 도구를 팀 전체와 공유할 수 있습니다.
              수율 정의(yield_score vs pass_fail)를 정확히 프롬프트에 명시하는 것이 곧 엔지니어링 역량입니다."<br/>
              Antigravity + GitHub + Streamlit Cloud = 실무 배포 완성
            </p>
            <div className="point-strip">
              <span><Sparkles size={16} /> Antigravity = 앱 생성</span>
              <span><Github size={16} /> GitHub = 파일 저장</span>
              <span><Cloud size={16} /> Streamlit = 배포</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Data Analysis Automation for Fine Tech Engineering | LettUin Edu</p>
      </footer>
    </div>
  );
}
