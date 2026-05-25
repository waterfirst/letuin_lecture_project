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
    title: 'Antigravity CLI 설치 & GitHub Token 발급',
    body: 'Antigravity CLI(agy)를 설치하고, GitHub Classic Token을 발급받아 연동합니다.',
    type: 'create',
  },
  {
    step: '학습목표 2',
    title: 'AI로 포트폴리오 HTML 생성',
    body: 'agy 프롬프트로 12~15강 실습 URL이 포함된 디자인 포트폴리오 페이지를 만듭니다.',
    type: 'customize',
  },
  {
    step: '학습목표 3',
    title: 'GitHub Pages 자동 배포',
    body: 'agy로 GitHub repo 생성 + push + Pages 활성화까지 CLI 한 줄로 완료합니다.',
    type: 'deploy',
  },
];

const lessonFlow = [
  { time: '1단계', label: 'Antigravity CLI 설치' },
  { time: '2단계', label: 'GitHub Classic Token 발급' },
  { time: '3단계', label: 'agy로 포트폴리오 HTML 생성' },
  { time: '4단계', label: '디자인 커스터마이징' },
  { time: '5단계', label: 'GitHub Pages 자동 배포' },
  { time: '6단계', label: 'URL 확인 + Quality Gate' },
];

const roleFlow = [
  { owner: '수강생', task: '실습 URL 준비, 디자인 프롬프트 작성' },
  { owner: 'Antigravity CLI', task: 'AI가 포트폴리오 HTML 자동 생성' },
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
    title: 'Antigravity CLI 설치',
    description: 'Windows / Mac 환경에서 Antigravity CLI(agy)를 설치합니다.',
    details: [
      'Windows: PowerShell에서 irm https://antigravity.google/cli/install.ps1 | iex',
      'Windows PATH 추가: $env:Path += ";C:\\Users\\USERNAME\\AppData\\Local\\agy\\bin"',
      'Mac: 터미널에서 curl -fsSL https://antigravity.google/cli/install.sh | bash',
      'Mac PATH 추가: export PATH="$HOME/.local/bin:$PATH" (zshrc에 추가)',
      '설치 확인: agy --help',
      '업데이트: agy update',
    ],
    icon: Code,
    color: '#4285F4',
  },
  {
    step: '2',
    title: 'GitHub Classic Token 발급',
    description: 'GitHub Personal Access Token(Classic)을 발급받아 agy에 연동합니다.',
    details: [
      'GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)',
      'Generate new token (classic) 클릭',
      'Note: "antigravity-portfolio"',
      'Expiration: 90 days',
      'Scopes: repo (전체 체크), workflow 체크',
      'Generate token > 토큰 복사 (한 번만 보임!)',
      'agy 실행 시 토큰 입력 또는 환경변수 설정',
    ],
    icon: Key,
    color: '#34A853',
  },
  {
    step: '3',
    title: 'agy로 포트폴리오 HTML 생성',
    description: 'Antigravity AI에게 디자인 프롬프트를 주고 포트폴리오 index.html을 생성합니다.',
    details: [
      'agy 실행 후 포트폴리오 프롬프트 입력',
      '12~15강 실습 URL 4개를 프롬프트에 포함',
      'AI가 index.html 생성 확인',
      '로컬 브라우저에서 미리보기 (파일 더블클릭)',
      '디자인 수정이 필요하면 추가 프롬프트 입력',
    ],
    icon: Layout,
    color: '#FBBC04',
  },
  {
    step: '4',
    title: 'GitHub Pages 자동 배포',
    description: 'agy + GitHub Token으로 repo 생성부터 Pages 배포까지 CLI에서 완료합니다.',
    details: [
      'GitHub에 portfolio repo 생성 (agy가 안내하거나 수동)',
      'git init > git add index.html > git commit',
      'git remote add origin https://github.com/USERNAME/portfolio.git',
      'git push -u origin main (Token으로 인증)',
      'Settings > Pages > Branch: main > Save',
      '1~2분 후 https://USERNAME.github.io/portfolio/ 확인',
    ],
    icon: Globe,
    color: '#EA4335',
  },
];

const agyInstallWindows = `# Windows PowerShell
irm https://antigravity.google/cli/install.ps1 | iex

# PATH 추가 (현재 터미널에서 바로 사용)
$env:Path += ";C:\\Users\\USERNAME\\AppData\\Local\\agy\\bin"

# 설치 확인 및 업데이트
agy update
agy --help`;

const agyInstallMac = `# Mac 터미널 (zsh/bash)
curl -fsSL https://antigravity.google/cli/install.sh | bash

# PATH 추가 (~/.zshrc 또는 ~/.bashrc에 추가)
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 설치 확인 및 업데이트
agy update
agy --help`;

const githubTokenSteps = `# GitHub Classic Token 발급 경로
GitHub.com > Settings > Developer settings
> Personal access tokens > Tokens (classic)
> Generate new token (classic)

# 설정
Note: antigravity-portfolio
Expiration: 90 days
Scopes: [v] repo (전체), [v] workflow

# 토큰 복사 후 환경변수 설정
# Windows PowerShell:
$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxx"

# Mac/Linux:
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"`;

const portfolioPromptText = `나의 AI 엔지니어 포트폴리오 웹페이지(index.html)를 만들어줘.

[프로필]
- 이름: (자기 이름)
- 한 줄 소개: 제조 AI 엔지니어 | 렛유인 코딩 과정 수료
- GitHub: https://github.com/USERNAME

[프로젝트 목록 - 아래 URL을 실제 자기 URL로 교체]
1. 제목: AI 코딩 강의 자료
   URL: https://username.github.io/lecture-project/
   플랫폼: GitHub Pages
   기술: React, TypeScript, Vite
   설명: 렛유인 AI 코딩 과정 강의 슬라이드 및 실습 자료

2. 제목: OLED 증착 데이터 분석 대시보드
   URL: https://oled-analyzer.streamlit.app
   플랫폼: Streamlit Cloud
   기술: Python, Streamlit, Pandas, Plotly
   설명: 챔버별 수율 분석, 두께 분포, 불량 맵 자동화

3. 제목: OLED 탠덤 공진 시뮬레이터
   URL: https://aistudio.google.com/share/xxxxx
   플랫폼: Google AI Studio
   기술: Gemini API, Fabry-Perot 수식, Recharts
   설명: R/G/B ITO 두께 최적화, 시야각 vs 휘도 그래프

4. 제목: 3D 열응력 Warpage 시뮬레이터
   URL: https://aistudio.google.com/share/yyyyy
   플랫폼: Google AI Studio
   기술: Gemini API, Three.js, 고체역학
   설명: 다층 박막 CTE 불일치 휨 예측 + 3D 시각화

[디자인 요구사항]
- 단일 HTML 파일 (외부 의존성 없음, Google Fonts만 허용)
- 반응형 (모바일 호환)
- 상단: 그라디언트 헤더 (어두운 파랑→보라) + 이름 + 소개
- 프로젝트 카드: 그리드 레이아웃, 호버 시 그림자 + 살짝 올라가는 효과
- 플랫폼별 색상 뱃지: GitHub Pages=초록, Streamlit=빨강, AI Studio=파랑
- 기술 스택: 작은 둥근 뱃지로 표시
- 각 카드에 "데모 보기" 버튼 (해당 URL로 새 탭)
- 하단 푸터: "Built with AI | 렛유인 코딩 과정"
- 다크 모드 기본, 깔끔하고 모던한 느낌`;

const designRefinePrompt = `포트폴리오 페이지를 더 예쁘게 개선해줘.

[추가 디자인]
- 카드에 아이콘 추가 (프로젝트 성격에 맞는 이모지)
- 상단에 기술 스택 요약 섹션 (사용한 전체 기술을 뱃지로 나열)
- 부드러운 스크롤 애니메이션 (카드가 아래에서 위로 페이드인)
- 카드 상단에 플랫폼별 컬러 스트라이프
- "연락처" 섹션: GitHub, 이메일 링크
- 폰트: Inter 또는 Pretendard
- 전체적으로 깔끔하고 여백이 넉넉한 레이아웃`;

const gitDeployCommand = `# Git으로 GitHub Pages 배포
git init
git add index.html
git commit -m "Deploy portfolio"
git branch -M main
git remote add origin https://github.com/USERNAME/portfolio.git
git push -u origin main

# GitHub Pages 활성화
# Settings > Pages > Source: Deploy from a branch
# Branch: main > / (root) > Save

# 1~2분 후 URL:
# https://USERNAME.github.io/portfolio/`;

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
            <span className="header-tag">Antigravity CLI로 포트폴리오를 만들고 GitHub Pages 배포</span>
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
          <span className="section-label">05. Antigravity CLI 설치</span>
          <h2>Windows / Mac에서 agy 설치하기</h2>
          <p className="section-intro">Antigravity CLI는 터미널에서 AI에게 코드를 만들게 하는 도구입니다. 명령어는 antigravity가 아니라 agy입니다.</p>
          <PromptCard title="Windows PowerShell 설치" promptText={agyInstallWindows} color="#0078D4" />
          <div style={{ height: '1.5rem' }} />
          <PromptCard title="Mac 터미널 설치" promptText={agyInstallMac} color="#333333" />
          <div style={{ marginTop: '1.5rem', background: '#FFF3E0', borderRadius: '12px', padding: '1.25rem', borderLeft: '4px solid #FF9800' }}>
            <p style={{ fontSize: '0.95rem', color: '#E65100', margin: 0, lineHeight: '1.7' }}>
              <strong>주의:</strong> 설치 후 터미널을 새로 열거나 PATH를 수동 추가해야 agy 명령어가 동작합니다. 로그인은 브라우저 창이 자동으로 열리며 소셜 인증으로 진행됩니다.
            </p>
          </div>
        </section>

        <section>
          <span className="section-label">06. GitHub Classic Token 발급</span>
          <h2>agy에서 GitHub에 Push하려면 Token이 필요합니다</h2>
          <p className="section-intro">GitHub Classic Token을 발급받아 환경변수에 설정하면, 터미널에서 비밀번호 없이 push할 수 있습니다.</p>
          <PromptCard title="GitHub Classic Token 발급 절차" promptText={githubTokenSteps} color="#333333" />
          <div style={{ marginTop: '1.5rem', background: '#FFEBEE', borderRadius: '12px', padding: '1.25rem', borderLeft: '4px solid #EA4335' }}>
            <p style={{ fontSize: '0.95rem', color: '#C62828', margin: 0, lineHeight: '1.7' }}>
              <strong>보안 주의:</strong> Token은 한 번만 보여줍니다. 반드시 안전한 곳에 저장하세요. 코드나 GitHub에 절대 올리지 마세요.
            </p>
          </div>
        </section>

        <section>
          <span className="section-label">07. agy로 포트폴리오 만들기</span>
          <h2>AI에게 디자인 프롬프트를 주고 index.html 생성</h2>
          <p className="section-intro">agy를 실행하고 아래 프롬프트를 입력하면 12~15강 URL이 포함된 포트폴리오 HTML이 자동 생성됩니다. URL은 자신의 것으로 교체하세요.</p>
          <PromptCard title="포트폴리오 생성 프롬프트 (agy에 입력)" promptText={portfolioPromptText} color="#4285F4" />
          <div style={{ height: '1.5rem' }} />
          <PromptCard title="디자인 개선 추가 프롬프트" promptText={designRefinePrompt} color="#9C27B0" />
          <div style={{ marginTop: '1.5rem', background: '#E8F5E9', borderRadius: '12px', padding: '1.25rem', borderLeft: '4px solid #34A853' }}>
            <p style={{ fontSize: '0.95rem', color: '#1B5E20', margin: 0, lineHeight: '1.7' }}>
              <strong>팁:</strong> 첫 번째 프롬프트로 기본 구조를 만들고, 두 번째 프롬프트로 디자인을 다듬으세요. 한 번에 다 시키면 결과가 불안정합니다.
            </p>
          </div>
        </section>

        <section>
          <span className="section-label">08. GitHub Pages 배포</span>
          <h2>생성된 index.html을 GitHub에 올리고 배포</h2>
          <PromptCard title="Git 배포 명령어" promptText={gitDeployCommand} color="#333333" />
        </section>

        <section>
          <span className="section-label">09. 핵심 메시지</span>
          <h2>오늘 기억할 세 가지</h2>
          {keyMessages.map((msg, i) => <KeyMessageBox key={i} icon={msg.icon} text={msg.text} color={msg.color} />)}
        </section>

        <section className="workshop-section teaching-section">
          <span className="section-label">10. 미니 워크숍</span>
          <h2>실습: 포트폴리오 배포 체크리스트</h2>
          <InteractiveWorkshop />
          <FirstRunGuide />
        </section>

        <section>
          <span className="section-label">11. 품질 점검</span>
          <h2>배포 전, 이 5가지만 확인하세요</h2>
          <VerifyChecklist points={qualityChecklist} />
        </section>

        <section>
          <span className="section-label">12. 배포 방식 비교</span>
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
          <span className="section-label">포트폴리오 템플릿 다운로드</span>
          <h2>index.html 템플릿을 다운로드하고 Antigravity에서 수정하세요</h2>
          <p className="section-intro" style={{ maxWidth: '640px', margin: '0 auto 2rem' }}>
            아래 버튼으로 기본 포트폴리오 HTML을 다운로드합니다. URL과 내용을 자기 것으로 바꾸고, agy에서 디자인을 다듬은 후 GitHub Pages에 배포하세요.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`${import.meta.env.BASE_URL}portfolio-template.html`} download="index.html" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', background: '#4285F4', color: '#fff', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 12px rgba(66,133,244,0.3)' }}>
              <ExternalLink size={20} />
              index.html 다운로드
            </a>
            <a href={`${import.meta.env.BASE_URL}portfolio-template.html`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', background: '#fff', color: '#4285F4', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, textDecoration: 'none', border: '2px solid #4285F4' }}>
              <Eye size={20} />
              미리보기
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
