import React, { useState } from 'react';
import {
  Layers,
  Eye,
  AlertTriangle,
  Copy,
  Check,
  ChevronRight,
  Globe,
  Rocket,
  Layout,
  Monitor,
  Code,
  ExternalLink,
} from 'lucide-react';

const assetUrl = (filename: string) =>
  `${import.meta.env.BASE_URL}assets/images/${filename}`;

/* ===== 데이터 배열 ===== */

const learningGoals = [
  {
    step: 1,
    title: '포트폴리오 생성기 실행',
    body: '준비된 HTML 생성기에 자기 URL을 입력하여 포트폴리오 HTML을 만듭니다.',
    type: 'create',
  },
  {
    step: 2,
    title: '프로젝트 카드 커스터마이징',
    body: '제목, 설명, 기술 스택 태그를 수정하여 자신만의 포트폴리오를 완성합니다.',
    type: 'customize',
  },
  {
    step: 3,
    title: 'GitHub Pages 배포',
    body: '생성된 index.html을 GitHub에 올리고 Public URL로 공개합니다.',
    type: 'deploy',
  },
];

const lessonFlow = [
  { label: '생성기 열기', icon: Layout },
  { label: '프로젝트 입력', icon: Code },
  { label: 'HTML 생성', icon: Monitor },
  { label: 'Pages 배포', icon: Globe },
];

const roleFlow = [
  { role: '수강생', desc: '프로젝트 URL 입력 및 카드 작성' },
  { role: '생성기', desc: 'HTML 포트폴리오 자동 생성' },
  { role: 'GitHub Pages', desc: '정적 파일 호스팅 및 배포' },
];

const procedureSteps = [
  {
    step: 1,
    title: '포트폴리오 생성기 열기',
    desc: '강의 페이지 하단의 생성기를 열고 프로젝트 URL을 입력합니다.',
    image: 'panel1.png',
  },
  {
    step: 2,
    title: '프로젝트 카드 작성',
    desc: '최소 4개 프로젝트의 제목, 설명, URL, 기술 스택을 입력합니다.',
    image: 'panel2.png',
  },
  {
    step: 3,
    title: 'HTML 생성 & 미리보기',
    desc: 'Generate 버튼으로 포트폴리오 HTML을 생성하고 미리보기를 확인합니다.',
    image: 'panel3.png',
  },
  {
    step: 4,
    title: 'GitHub Pages 배포',
    desc: '생성된 HTML을 GitHub repo에 올리고 Pages를 활성화합니다.',
    image: 'panel4.png',
  },
];

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
    color: '#4285F4',
    text: '포트폴리오의 핵심은 코드 양이 아닙니다. 처음 보는 사람이 클릭 한 번으로 체험할 수 있는 데모 URL이 핵심입니다.',
  },
  {
    icon: Eye,
    color: '#34A853',
    text: 'GitHub Pages, Streamlit Cloud, AI Studio 공유 링크 — 12~15강에서 만든 모든 결과물이 한 페이지에 모입니다.',
  },
  {
    icon: AlertTriangle,
    color: '#EA4335',
    text: 'README와 .env.example 없이 코드만 올리면 채용 담당자는 실행할 수 없습니다. 항상 데모 URL을 최상단에.',
  },
];

const deployComparison = [
  { lecture: '12강', platform: 'GitHub Pages', desc: '정적 문서', active: false },
  { lecture: '13강', platform: 'Streamlit Cloud', desc: '데이터 분석 앱', active: false },
  { lecture: '14강', platform: 'AI Studio 링크', desc: 'OLED 시뮬레이터', active: false },
  { lecture: '15강', platform: 'AI Studio 링크', desc: 'Warpage 시뮬레이터', active: false },
  { lecture: '16강', platform: 'GitHub Pages', desc: '통합 포트폴리오 대시보드', active: true },
];

/* ===== 헬퍼 컴포넌트 ===== */

function GoalVisual({ goal }: { goal: (typeof learningGoals)[0] }) {
  const typeColor: Record<string, string> = {
    create: '#4285F4',
    customize: '#34A853',
    deploy: '#FBBC04',
  };
  return (
    <div className="visual-card" style={{ borderTop: `4px solid ${typeColor[goal.type]}` }}>
      <div className="visual-header">
        <span className="step-badge" style={{ background: typeColor[goal.type] }}>
          Step {goal.step}
        </span>
        <h3>{goal.title}</h3>
      </div>
      <p>{goal.body}</p>
    </div>
  );
}

function KeyMessageBox({ msg }: { msg: (typeof keyMessages)[0] }) {
  const Icon = msg.icon;
  return (
    <div className="key-message-box" style={{ borderLeft: `4px solid ${msg.color}` }}>
      <Icon size={24} color={msg.color} />
      <p>{msg.text}</p>
    </div>
  );
}

function PromptCard({ title, content }: { title: string; content: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="prompt-card">
      <div className="prompt-header">
        <span>{title}</span>
        <button onClick={handleCopy} className="copy-btn">
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
      <pre className="prompt-content">{content}</pre>
    </div>
  );
}

function LectureImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="lecture-image">
      <img src={assetUrl(src)} alt={alt} loading="lazy" />
    </div>
  );
}

function VerifyChecklist() {
  const [checks, setChecks] = useState<boolean[]>(new Array(qualityChecklist.length).fill(false));
  const toggle = (i: number) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
  };
  const done = checks.filter(Boolean).length;
  return (
    <div className="verify-checklist">
      <h3>품질 체크리스트 ({done}/{qualityChecklist.length})</h3>
      <ul>
        {qualityChecklist.map((item, i) => (
          <li key={i} onClick={() => toggle(i)} className={checks[i] ? 'checked' : ''}>
            <span className="checkbox">{checks[i] ? '\u2713' : ''}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProcedureCard({ step }: { step: (typeof procedureSteps)[0] }) {
  return (
    <div className="procedure-card">
      <div className="procedure-header">
        <span className="procedure-number">{step.step}</span>
        <h4>{step.title}</h4>
      </div>
      <p>{step.desc}</p>
      <LectureImage src={step.image} alt={step.title} />
    </div>
  );
}

function InteractiveWorkshop() {
  const [fields, setFields] = useState({
    projectCount: '',
    githubRepo: '',
    pagesUrl: '',
  });
  const update = (key: string, val: string) => setFields({ ...fields, [key]: val });
  const allFilled = Object.values(fields).every((v) => v.trim() !== '');

  return (
    <div className="interactive-workshop">
      <h3>실습 기록</h3>
      <p>아래에 오늘 실습 결과를 기록하세요.</p>
      <div className="workshop-fields">
        <label>
          입력한 프로젝트 수
          <input
            type="text"
            placeholder="예: 5"
            value={fields.projectCount}
            onChange={(e) => update('projectCount', e.target.value)}
          />
        </label>
        <label>
          GitHub Repo URL
          <input
            type="text"
            placeholder="https://github.com/username/portfolio"
            value={fields.githubRepo}
            onChange={(e) => update('githubRepo', e.target.value)}
          />
        </label>
        <label>
          GitHub Pages URL
          <input
            type="text"
            placeholder="https://username.github.io/portfolio"
            value={fields.pagesUrl}
            onChange={(e) => update('pagesUrl', e.target.value)}
          />
        </label>
      </div>
      {allFilled && (
        <div className="workshop-success">
          모든 항목이 입력되었습니다! 포트폴리오 배포를 완료했습니다.
        </div>
      )}
    </div>
  );
}

function FirstRunGuide() {
  return (
    <div className="first-run-guide">
      <h3>처음이신가요?</h3>
      <ol>
        <li>이 페이지 하단의 <strong>포트폴리오 생성기</strong>를 엽니다.</li>
        <li>12~15강에서 배포한 URL을 준비합니다.</li>
        <li>프로젝트 카드에 제목, 설명, URL을 입력합니다.</li>
        <li>HTML을 생성하고 GitHub Pages에 배포합니다.</li>
      </ol>
    </div>
  );
}

/* ===== 메인 App ===== */

export default function App() {
  return (
    <div className="app">
      {/* 헤더 */}
      <header className="main-header">
        <div className="logo-group">
          <Rocket size={28} color="#4285F4" />
          <span className="logo-text">렛유인 AI 코딩</span>
        </div>
        <span className="header-tag">실습 URL을 모아 GitHub Pages 포트폴리오로 배포</span>
      </header>

      {/* 히어로 섹션 */}
      <section className="hero-section">
        <h1>Ch.16 통합 포트폴리오 대시보드</h1>
        <p className="subtitle">
          12~15강에서 만든 GitHub Pages, Streamlit, AI Studio 링크를 하나의 대시보드로 통합하고,
          GitHub Pages로 배포합니다.
        </p>
        <div className="lesson-meta">
          <span>40분</span>
          <span>실습 중심</span>
          <span>GitHub Pages</span>
          <span>결과물: 포트폴리오 URL</span>
        </div>
      </section>

      {/* 수업 흐름 */}
      <section className="overview-section">
        <h2>수업 흐름</h2>
        <div className="flow-row">
          {lessonFlow.map((item, i) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={i}>
                <div className="flow-item">
                  <Icon size={28} />
                  <span>{item.label}</span>
                </div>
                {i < lessonFlow.length - 1 && <ChevronRight size={20} className="flow-arrow" />}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* 역할 분담 */}
      <section className="definition-section">
        <h2>역할 분담</h2>
        <div className="role-flow">
          {roleFlow.map((r, i) => (
            <div className="role-card" key={i}>
              <strong>{r.role}</strong>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 학습 목표 */}
      <section className="goals-section">
        <h2>학습 목표</h2>
        <div className="goals-grid">
          {learningGoals.map((g) => (
            <GoalVisual key={g.step} goal={g} />
          ))}
        </div>
      </section>

      {/* 핵심 메시지 */}
      <section className="messages-section">
        <h2>핵심 메시지</h2>
        {keyMessages.map((m, i) => (
          <KeyMessageBox key={i} msg={m} />
        ))}
      </section>

      {/* 배포 비교표 */}
      <section className="deep-dive">
        <h2 className="deep-dive-heading">배포 플랫폼 비교 (12~16강)</h2>
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>강의</th>
                <th>플랫폼</th>
                <th>내용</th>
              </tr>
            </thead>
            <tbody>
              {deployComparison.map((row, i) => (
                <tr key={i} className={row.active ? 'active-row' : ''}>
                  <td>{row.lecture}</td>
                  <td>{row.platform}</td>
                  <td>
                    {row.desc}
                    {row.active && <span className="current-badge"> (현재 강의)</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 실습 절차 */}
      <section className="procedure-section">
        <h2>실습 절차</h2>
        <div className="procedure-grid">
          {procedureSteps.map((s) => (
            <ProcedureCard key={s.step} step={s} />
          ))}
        </div>
      </section>

      {/* 프롬프트 / 명령어 카드 */}
      <section className="prompt-section">
        <h2>GitHub Pages 배포 명령어</h2>
        <PromptCard
          title="Git 초기화 및 Push"
          content={"git init\ngit add index.html\ngit commit -m \"Add portfolio dashboard\"\ngit branch -M main\ngit remote add origin https://github.com/USERNAME/portfolio.git\ngit push -u origin main"}
        />
        <PromptCard
          title="GitHub Pages 활성화 경로"
          content={"Repository Settings > Pages > Source: Deploy from a branch\nBranch: main > / (root) > Save\n\n약 1~2분 후 URL 활성화:\nhttps://USERNAME.github.io/portfolio/"}
        />
      </section>

      {/* 첫 실행 가이드 */}
      <FirstRunGuide />

      {/* 품질 체크리스트 */}
      <VerifyChecklist />

      {/* 실습 워크숍 */}
      <InteractiveWorkshop />

      {/* 생성기 링크 */}
      <section className="generator-link-section">
        <h2>포트폴리오 생성기</h2>
        <p>아래 버튼을 눌러 포트폴리오 생성기를 새 탭에서 열 수 있습니다.</p>
        <a
          href="./portfolio-generator.html"
          target="_blank"
          rel="noopener noreferrer"
          className="generator-btn"
        >
          <ExternalLink size={18} />
          포트폴리오 생성기 열기
        </a>
      </section>

      {/* 푸터 */}
      <footer className="main-footer">
        <p>렛유인 AI 코딩 과정 &mdash; Ch.16 통합 포트폴리오 대시보드</p>
      </footer>
    </div>
  );
}
