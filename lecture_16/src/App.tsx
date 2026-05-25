import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, ArrowRight, Check, CheckCircle2, ChevronRight,
  Copy, ExternalLink, Eye, Globe, Key, Layers, Link2, MessageSquare,
  Quote, Rocket, Share2, Sparkles, Target, Users, Zap, Layout, Code,
} from 'lucide-react';

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}${filename}`;

// ============================================================================
// DATA ARRAYS
// ============================================================================

const learningGoals = [
  {
    step: '학습목표 1',
    title: '포트폴리오 생성기 실행',
    body: '준비된 HTML 생성기에 자기 URL을 입력하여 포트폴리오 HTML을 만듭니다.',
    type: 'create',
  },
  {
    step: '학습목표 2',
    title: '프로젝트 카드 커스터마이징',
    body: '제목, 설명, 기술 스택 태그를 수정하여 자신만의 포트폴리오를 완성합니다.',
    type: 'customize',
  },
  {
    step: '학습목표 3',
    title: 'GitHub Pages 배포',
    body: '생성된 index.html을 GitHub에 올리고 Public URL로 공개합니다.',
    type: 'deploy',
  },
];

const lessonFlow = [
  { time: '1단계', label: '포트폴리오 생성기 열기' },
  { time: '2단계', label: '프로젝트 카드 작성 (4개+)' },
  { time: '3단계', label: 'HTML 생성 & 미리보기' },
  { time: '4단계', label: 'GitHub Pages 배포' },
  { time: '5단계', label: 'URL 확인 + 공유' },
  { time: '6단계', label: 'Quality Gate 체크' },
];

const roleFlow = [
  { owner: '수강생', task: '프로젝트 URL 입력, 카드 작성, 결과 검증' },
  { owner: '포트폴리오 생성기', task: 'HTML 자동 생성 + 미리보기 + 다운로드' },
  { owner: 'GitHub Pages', task: 'Public 호스팅, URL 배포, 24/7 공개' },
];

const manualVsAI = [
  {
    label: '기존: URL 흩어짐',
    items: [
      'GitHub Pages, Streamlit, AI Studio URL이 각각 분산',
      '이력서에 링크 4개를 나열하면 산만함',
      '채용 담당자가 하나씩 열어봐야 전체 파악 가능',
      'README 없이 코드만 있으면 실행 불가',
    ],
  },
  {
    label: '통합: 포트폴리오 한 페이지',
    items: [
      '한 URL에서 모든 프로젝트 카드 확인',
      '플랫폼별 색상 뱃지로 한눈에 구분',
      '클릭 한 번으로 각 데모 체험',
      '이력서에 URL 하나만 적으면 끝',
    ],
  },
];

const procedureSteps = [
  {
    step: '1',
    title: '포트폴리오 생성기 열기',
    description: '강의 페이지 하단의 생성기를 열고 프로필 정보를 입력합니다.',
    details: [
      '강의 페이지 하단 "포트폴리오 생성기 열기" 클릭',
      '이름, 한 줄 소개, GitHub URL 입력',
      '기본 프로젝트 카드 4개 확인',
    ],
    icon: Layout,
    color: '#4285F4',
  },
  {
    step: '2',
    title: '프로젝트 카드 작성 (4개 이상)',
    description: '12~15강에서 만든 URL을 프로젝트 카드에 입력합니다.',
    details: [
      '카드 1: 12강 GitHub Pages 정적 문서 URL',
      '카드 2: 13강 Streamlit 데이터 분석 앱 URL',
      '카드 3: 14강 OLED 시뮬레이터 AI Studio 링크',
      '카드 4: 15강 Warpage 시뮬레이터 AI Studio 링크',
      '각 카드: 제목 + 설명 + URL + 기술 스택 + 플랫폼 선택',
      '(선택) "프로젝트 추가" 버튼으로 최대 8개',
    ],
    icon: Code,
    color: '#34A853',
  },
  {
    step: '3',
    title: 'HTML 생성 & 미리보기',
    description: '포트폴리오 생성 버튼으로 HTML을 만들고 미리보기를 확인합니다.',
    details: [
      '"포트폴리오 생성" 버튼 클릭',
      '오른쪽 iframe에서 미리보기 확인',
      '각 카드 링크 클릭해서 데모 열리는지 확인',
      '수정 필요하면 카드 내용 변경 후 재생성',
      '"HTML 다운로드" 버튼으로 index.html 저장',
    ],
    icon: Eye,
    color: '#FBBC04',
  },
  {
    step: '4',
    title: 'GitHub Pages 배포',
    description: 'index.html을 GitHub에 올리고 Pages를 활성화합니다.',
    details: [
      'GitHub에서 New repository (Public)',
      '이름: portfolio 또는 my-portfolio',
      'Add file > Upload files > index.html 드래그',
      'Settings > Pages > Branch: main > Save',
      '1~2분 후 URL 활성화 확인',
      'README About에 URL 추가',
    ],
    icon: Globe,
    color: '#EA4335',
  },
];

const gitCommandText = `# 터미널에서 배포하는 경우
git init
git add index.html
git commit -m "Add portfolio dashboard"
git branch -M main
git remote add origin https://github.com/USERNAME/portfolio.git
git push -u origin main

# GitHub Pages 활성화
Repository Settings > Pages > Source: Deploy from a branch
Branch: main > / (root) > Save

# 1~2분 후 URL:
https://USERNAME.github.io/portfolio/`;

const qualityChecklist = [
  '프로젝트 4개 이상의 URL이 입력되었는가?',
  '각 카드에 제목, 설명, 기술 스택이 있는가?',
  '생성된 HTML을 브라우저에서 미리보기했는가?',
  'GitHub Pages에 index.html이 배포되었는가?',
  '포트폴리오 URL에서 모든 카드 링크가 정상 동작하는가?',
];

const keyMessages = [
  {
    icon: Layers,
    text: '포트폴리오의 핵심은 코드 양이 아닙니다. 처음 보는 사람이 클릭 한 번으로 체험할 수 있는 데모 URL이 핵심입니다.',
    color: '#4285F4',
  },
  {
    icon: Eye,
    text: 'GitHub Pages, Streamlit Cloud, AI Studio 공유 링크 — 12~15강에서 만든 모든 결과물이 한 페이지에 모입니다.',
    color: '#34A853',
  },
  {
    icon: AlertTriangle,
    text: 'README와 .env.example 없이 코드만 올리면 채용 담당자는 실행할 수 없습니다. 항상 데모 URL을 최상단에.',
    color: '#EA4335',
  },
];

const deploymentMethods = [
  { lecture: '12강', method: 'GitHub Pages', type: '정적 문서', icon: Globe },
  { lecture: '13강', method: 'Streamlit Cloud', type: '데이터 분석 앱', icon: Rocket },
  { lecture: '14강', method: 'AI Studio 링크', type: 'OLED 시뮬레이터', icon: Sparkles },
  { lecture: '15강', method: 'AI Studio 링크', type: 'Warpage 시뮬레이터', icon: Zap },
  { lecture: '16강', method: 'GitHub Pages', type: '통합 포트폴리오', icon: Share2 },
];

// ============================================================================
// HELPER COMPONENTS (13강 동일 패턴)
// ============================================================================

function GoalVisual({ type }: { type: string }) {
  if (type === 'create') {
    return (
      <div className="goal-visual definition">
        <div className="visual-item person"><Layout size={18} /><span>생성기</span></div>
        <ArrowRight size={14} className="visual-arrow" />
        <div className="visual-item ai"><Code size={18} /><span>HTML</span></div>
      </div>
    );
  }
  if (type === 'customize') {
    return (
      <div className="goal-visual elements">
        <div className="element-tag">제목</div>
        <div className="element-tag">기술 스택</div>
        <div className="element-tag">데모 URL</div>
      </div>
    );
  }
  if (type === 'deploy') {
    return (
      <div className="goal-visual field">
        <div className="field-icons">
          <div className="f-icon"><Globe size={18} /></div>
          <div className="f-icon"><Link2 size={18} /></div>
        </div>
        <div className="success-indicator"><CheckCircle2 size={12} /><span>Public 배포</span></div>
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
        <span>명령어</span><strong>{title}</strong>
      </div>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ background: '#f5f5f7', borderRadius: '8px', padding: '1.25rem', borderLeft: `4px solid ${color}`, whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.7', color: '#333', fontFamily: 'monospace' }}>{promptText}</div>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #ccc', background: copied ? color : '#fff', color: copied ? '#fff' : '#333', cursor: 'pointer', fontSize: '0.85rem' }}>
            {copied ? <><Check size={14} />복사됨!</> : <><Copy size={14} />복사</>}
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
  const [fields, setFields] = useState({ projectCount: '', githubRepo: '', pagesUrl: '' });
  const [copied, setCopied] = useState(false);
  const hasContent = Object.values(fields).some(Boolean);
  const generated = hasContent ? `1. 프로젝트 수: ${fields.projectCount || '[입력 예정]'}\n2. GitHub Repo: ${fields.githubRepo || '[생성 예정]'}\n3. Pages URL: ${fields.pagesUrl || '[배포 예정]'}` : '';
  const handleCopy = () => { if (!generated) return; navigator.clipboard.writeText(generated).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); }); };
  const inputRows: { key: keyof typeof fields; label: string; placeholder: string }[] = [
    { key: 'projectCount', label: '입력한 프로젝트 수', placeholder: '예: 5' },
    { key: 'githubRepo', label: 'GitHub Repo URL', placeholder: 'https://github.com/username/portfolio' },
    { key: 'pagesUrl', label: 'GitHub Pages URL', placeholder: 'https://username.github.io/portfolio' },
  ];
  return (
    <div className="interactive-workshop">
      <div className="iw-header"><Rocket size={22} color="var(--accent)" /><strong>실습 체크리스트</strong><p>포트폴리오 배포 결과를 기록하세요.</p></div>
      <div className="iw-body">
        <div className="iw-inputs">{inputRows.map((row) => (<div className="iw-field" key={row.key}><label htmlFor={`iw-${row.key}`}>{row.label}</label><input id={`iw-${row.key}`} type="text" placeholder={row.placeholder} value={fields[row.key]} onChange={(e) => setFields((prev) => ({ ...prev, [row.key]: e.target.value }))} /></div>))}</div>
        <div className="iw-output">
          <div className="iw-output-header"><Sparkles size={18} color="var(--accent)" /><strong>배포 현황</strong></div>
          <div className={`iw-generated-text ${hasContent ? 'active' : ''}`}>{generated || '위 항목 입력 시 표시됩니다.'}</div>
          <button className={`iw-copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy} disabled={!hasContent}>{copied ? <><Check size={15} />복사됨!</> : <><Copy size={15} />복사</>}</button>
        </div>
      </div>
    </div>
  );
}

function FirstRunGuide() {
  const quickSteps = [
    { step: '1', title: '생성기 열기', body: '하단 버튼 클릭' },
    { step: '2', title: '프로필 입력', body: '이름 + 소개' },
    { step: '3', title: '카드 작성', body: 'URL 4개 이상' },
    { step: '4', title: 'HTML 생성', body: '미리보기 확인' },
    { step: '5', title: 'GitHub 업로드', body: 'index.html' },
    { step: '6', title: 'Pages 배포', body: 'URL 확인' },
  ];
  return (
    <div className="first-run-guide">
      <div className="frg-title"><ExternalLink size={18} color="var(--accent)" /><strong>지금 바로 해보기 — 6단계</strong></div>
      <div className="frg-steps">{quickSteps.map((item) => (<div className="frg-step" key={item.step}><span className="frg-num">{item.step}</span><div><strong>{item.title}</strong><p>{item.body}</p></div></div>))}</div>
    </div>
  );
}

// ============================================================================
// MAIN APP (13강 동일 구조)
// ============================================================================

export default function App() {
  return (
    <div className="app-container">
      <header className="main-header">
        <div className="header-top">
          <motion.div className="logo-group" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <img src={assetUrl('logo.png')} alt="LettUin Edu" className="header-logo" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </motion.div>
          <motion.div className="header-tag-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <span className="header-tag">실습 URL을 모아 GitHub Pages 포트폴리오로 배포</span>
          </motion.div>
        </div>
        <motion.div className="hero-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1>Ch.16 통합 포트폴리오 대시보드</h1>
          <p className="subtitle">12~15강에서 만든 GitHub Pages, Streamlit, AI Studio 링크를 하나의 대시보드로 통합하고, GitHub Pages로 배포합니다.</p>
          <div className="lesson-meta">
            <span>40분</span>
            <span>실습 중심</span>
            <span>GitHub Pages</span>
            <span>결과물: 포트폴리오 URL</span>
          </div>
        </motion.div>
      </header>

      <main>
        <section className="overview-section">
          <span className="section-label">01. 오프닝 및 학습목표</span>
          <h2>12~15강 결과물을 한 페이지 포트폴리오로 통합하기</h2>
          <p className="section-intro">
            GitHub Pages, Streamlit Cloud, AI Studio에 흩어진 실습 결과물을 포트폴리오 생성기로 하나의 HTML 페이지에 모으고, GitHub Pages로 배포합니다.
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

        <section className="definition-section">
          <span className="section-label">02. 왜 통합 포트폴리오인가</span>
          <h2>URL 4개가 흩어져 있으면 아무도 안 봅니다</h2>
          <p className="section-intro">채용 담당자는 코드를 읽지 않습니다. 클릭 한 번으로 체험할 수 있는 데모 URL이 전부입니다.</p>
          <div className="one-line-definition inline-definition">
            <span>한 문장 정의</span>
            <strong>통합 포트폴리오는 12~15강 실습 URL을 한 페이지에 모아 GitHub Pages로 배포한, 클릭 가능한 이력서입니다.</strong>
          </div>
          <LectureImage src="comic.png" alt="흩어진 URL을 한 페이지로" caption="분산된 프로젝트 URL을 포트폴리오 생성기로 한 페이지에 통합" />
          <div className="role-flow">
            {roleFlow.map((item, index) => (
              <div className="role-step" key={`${item.owner}-${item.task}`}>
                <span>{item.owner}</span><strong>{item.task}</strong>
                {index < roleFlow.length - 1 && <ArrowRight size={22} />}
              </div>
            ))}
          </div>
        </section>

        <section>
          <span className="section-label">03. 기존 vs 통합</span>
          <h2>흩어진 URL vs 포트폴리오 한 페이지</h2>
          <div className="coding-compare-grid">
            {manualVsAI.map((col, i) => (
              <motion.article className={`coding-compare-card ${i === 0 ? 'traditional' : 'vibe'}`} key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <img src={assetUrl(i === 0 ? 'panel1.png' : 'panel3.png')} alt={col.label} />
                <div className="compare-content">
                  <h3>{col.label}</h3>
                  <ul>{col.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section>
          <span className="section-label">04. 실습 절차</span>
          <h2>포트폴리오 생성기로 4단계 배포</h2>
          {procedureSteps.map((proc) => <ProcedureCard key={proc.step} proc={proc} />)}
        </section>

        <section>
          <span className="section-label">05. Git 배포 명령어</span>
          <h2>터미널에서 배포하는 경우</h2>
          <PromptCard title="GitHub Pages 배포 명령어" promptText={gitCommandText} color="#333333" />
        </section>

        <section>
          <span className="section-label">06. 핵심 메시지</span>
          <h2>오늘 기억할 세 가지</h2>
          {keyMessages.map((msg, i) => <KeyMessageBox key={i} icon={msg.icon} text={msg.text} color={msg.color} />)}
        </section>

        <section className="workshop-section teaching-section">
          <span className="section-label">07. 미니 워크숍</span>
          <h2>실습: 포트폴리오 배포 체크리스트</h2>
          <InteractiveWorkshop />
          <FirstRunGuide />
        </section>

        <section>
          <span className="section-label">08. 품질 점검</span>
          <h2>배포 전, 이 5가지만 확인하세요</h2>
          <VerifyChecklist points={qualityChecklist} />
        </section>

        <section>
          <span className="section-label">09. 배포 방식 비교</span>
          <h2>12~16강 배포 플랫폼 총정리</h2>
          <div className="scenario-grid">
            {deploymentMethods.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div className="scenario-card" key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="scenario-icon"><Icon size={24} /></div>
                  <h3>{d.lecture}</h3>
                  <p className="scenario-before">{d.method}</p>
                  <p className="scenario-output">{d.type}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="wrap-message">
            <Quote size={36} color="var(--accent)" />
            <h3>"포트폴리오의 핵심은 코드 양이 아닙니다. 클릭 한 번으로 체험 가능한 데모 URL, 그게 전부입니다."</h3>
          </div>
        </section>

        <section style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <span className="section-label">포트폴리오 생성기</span>
          <h2>아래 버튼으로 생성기를 열고 실습하세요</h2>
          <div style={{ marginTop: '2rem' }}>
            <a href={`${import.meta.env.BASE_URL}portfolio-generator.html`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', background: '#4285F4', color: '#fff', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 12px rgba(66,133,244,0.3)' }}>
              <ExternalLink size={20} />
              포트폴리오 생성기 열기
            </a>
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 렛유인 AI 코딩 과정 &mdash; Ch.16 통합 포트폴리오 대시보드</p>
      </footer>
    </div>
  );
}
