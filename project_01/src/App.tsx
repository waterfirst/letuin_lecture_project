import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Code,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  Layers,
  Quote,
  Sparkles,
  Star,
  Terminal,
  Trophy,
  Upload,
} from 'lucide-react';

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
              src="/logo.png"
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
            <span className="header-tag">Claude Code + GitHub Pages 프로젝트</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>프로젝트 1: 나의 디스플레이 관심 분야 소개 웹페이지</h1>
          <p className="subtitle">Claude Code와 GitHub Pages로 만드는 인터랙티브 포트폴리오</p>
          <div className="lesson-meta" aria-label="project summary">
            <span>제출 시기: 4강 후 1주일</span>
            <span>난이도: 하/중/상 선택</span>
            <span>도구: Claude Code</span>
            <span>배포: GitHub Pages</span>
          </div>
        </motion.div>
      </header>

      <main>
        <ProjectOverview />
        <LevelBeginner />
        <LevelIntermediate />
        <LevelAdvanced />
        <EvaluationCriteria />
        <InteractiveWorkshop />
        <Summary />
      </main>

      <footer>
        <p>© 2026 Display Portfolio Project | LettUin Edu</p>
      </footer>
    </div>
  );
}

// ============================================================================
// PROJECT OVERVIEW
// ============================================================================

function ProjectOverview() {
  return (
    <section className="overview-section">
      <span className="section-label">프로젝트 개요</span>
      <h2>Claude Code와 GitHub Pages로 만드는 디스플레이 포트폴리오</h2>
      <p className="section-intro">
        자신의 디스플레이 산업 관심 분야를 소개하는 인터랙티브 웹페이지를 만들고 GitHub Pages로 배포합니다.
        난이도를 선택하여 자신의 수준에 맞게 도전하세요.
      </p>

      <div className="one-line-definition inline-definition">
        <span>공통 주제</span>
        <strong>Claude Code와 GitHub Pages를 사용하여 자신의 디스플레이 산업 관심 분야를 소개하는 인터랙티브 웹 페이지를 만드시오.</strong>
      </div>

      <div style={{ marginTop: '2rem', padding: '2rem', background: '#f5f7fa', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#0071e3' }}>
          <CheckCircle2 size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />
          최소 포함 요소
        </h3>
        <ul style={{ lineHeight: '2', paddingLeft: '1.5rem' }}>
          <li>✅ <strong>자기소개 섹션</strong></li>
          <li>✅ <strong>관심 공정/직무 소개</strong></li>
          <li>✅ <strong>비교 데이터 테이블 1개 이상</strong> (예: OLED vs LCD)</li>
          <li>✅ <strong>GitHub Pages 배포 완료</strong></li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
        <img
          src="/project1-overview.png"
          alt="프로젝트 1 개요"
          style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      <div className="lesson-timeline" aria-label="난이도 선택" style={{ marginTop: '3rem' }}>
        <div className="timeline-step">
          <strong>하</strong>
          <span>단계별 가이드</span>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>프롬프트 제공, 복사만 하면 됨</p>
        </div>
        <div className="timeline-step">
          <strong>중</strong>
          <span>방향 제시</span>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>힌트 제공, 스스로 프롬프트 작성</p>
        </div>
        <div className="timeline-step">
          <strong>상</strong>
          <span>요구사항만</span>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>힌트 없음, 완전 자율</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// LEVEL: BEGINNER (하)
// ============================================================================

function LevelBeginner() {
  const [copied, setCopied] = useState(false);

  const promptText = `나는 디스플레이 산업 취업준비생이야.
아래 조건으로 GitHub Pages에 배포할 수 있는 index.html 파일 하나를 만들어줘:

1. 내 소개: [이름 입력], 관심 직무: [직무명 입력]
2. 내가 관심 있는 디스플레이 기술 TOP 3 섹션 (카드 형태)
3. OLED vs LCD 비교 테이블
4. 모던한 CSS 스타일 (다크모드 선호)
5. 반응형 디자인 (모바일에서도 잘 보이게)

파일은 index.html 하나로 완성해줘.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <section style={{ marginTop: '4rem' }}>
      <span className="section-label">[하] 난이도 - 단계별 가이드 제공</span>
      <h2>프롬프트를 복사해서 Claude Code에 붙여넣기만 하세요</h2>
      <p className="section-intro">
        아래 프롬프트를 그대로 복사하여 Claude Code에 입력하면 완성된 웹페이지를 받을 수 있습니다.
      </p>

      <div className="deep-dive">
        <div className="deep-dive-heading">
          <span>Step 1: Claude Code 프롬프트</span>
          <h3>아래 텍스트를 Claude Code에 복사하세요</h3>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <img
              src="/project1-beginner-step1.png"
              alt="Claude Code 프롬프트 입력"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        </div>

        <div className="code-preview-box" style={{ marginTop: '2rem' }}>
          <div className="visual-header">
            <span>Claude Code Prompt</span>
            <strong>복사해서 사용하세요</strong>
          </div>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1.5rem', borderRadius: '8px', fontSize: '0.95rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
            {promptText}
          </pre>
          <button
            onClick={handleCopy}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              background: copied ? '#10b981' : '#0071e3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {copied ? <><Check size={18} />복사됨!</> : <><Copy size={18} />프롬프트 복사</>}
          </button>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Step 2: 파일 저장 후 GitHub에 올리기</h3>
          <div className="code-preview-box">
            <div className="visual-header">
              <span>Git Commands</span>
              <strong>터미널에서 실행</strong>
            </div>
            <pre style={{ background: '#1e1e1e', color: '#10b981', padding: '1.5rem', borderRadius: '8px', fontSize: '0.95rem' }}>
{`git add index.html
git commit -m "Add portfolio page"
git push`}
            </pre>
          </div>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Step 3: GitHub Pages 활성화</h3>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <img
              src="/project1-beginner-step3.png"
              alt="GitHub Pages 설정"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <ol style={{ lineHeight: '2', paddingLeft: '1.5rem', marginTop: '1rem' }}>
            <li>GitHub Repository → <strong>Settings</strong> → <strong>Pages</strong></li>
            <li>Source: <strong>Deploy from branch</strong> <code>main</code></li>
            <li>저장 후 2~3분 대기</li>
            <li><code>https://[사용자명].github.io/[레포명]</code> 접속 확인</li>
          </ol>
        </div>

        <div className="highlight-box" style={{ background: '#d1f2eb', borderLeftColor: '#10b981', marginTop: '2rem' }}>
          <p style={{ fontWeight: 700 }}>✅ 제출:</p>
          <p>배포된 URL을 제출하세요</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// LEVEL: INTERMEDIATE (중)
// ============================================================================

function LevelIntermediate() {
  return (
    <section style={{ marginTop: '4rem' }}>
      <span className="section-label">[중] 난이도 - 방향 제시</span>
      <h2>힌트를 참고하여 직접 프롬프트를 작성하세요</h2>
      <p className="section-intro">
        요구사항을 보고 Claude Code에 줄 프롬프트를 직접 작성합니다. 힌트를 참고하세요.
      </p>

      <div className="deep-dive">
        <div className="deep-dive-heading">
          <span>요구사항</span>
          <h3>다음 조건을 모두 만족하는 웹페이지를 만드세요</h3>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <img
              src="/project1-intermediate.png"
              alt="중급 프로젝트 예시"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        </div>

        <div className="verify-checklist" style={{ marginTop: '2rem' }}>
          <span>필수 요구사항</span>
          <div className="verify-item">
            <CheckCircle2 size={15} />
            <p>Claude Code로 HTML 생성 (프롬프트는 직접 작성)</p>
          </div>
          <div className="verify-item">
            <CheckCircle2 size={15} />
            <p>인터랙티브 요소 1개 이상 (탭, 토글, 슬라이더 등)</p>
          </div>
          <div className="verify-item">
            <CheckCircle2 size={15} />
            <p>실제 디스플레이 스펙 데이터 활용 (검색 또는 AI에 질문)</p>
          </div>
          <div className="verify-item">
            <CheckCircle2 size={15} />
            <p>GitHub Pages 배포 필수</p>
          </div>
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', background: '#fff3cd', borderRadius: '12px', border: '1px solid #ffc107' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#856404' }}>
            <Sparkles size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />
            힌트
          </h3>
          <ul style={{ lineHeight: '2', paddingLeft: '1.5rem' }}>
            <li><code>외부 프레임워크(React 등) 없이 순수 HTML/CSS/JS로 구현</code></li>
            <li><code>모바일에서도 잘 보여야 함 (반응형)</code></li>
            <li>데이터 부족하면 Claude에게: <em>"주요 스마트폰 OLED 디스플레이 스펙 표로 만들어줘"</em></li>
          </ul>
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', background: '#f0f7ff', borderRadius: '12px', border: '1px solid #0071e3' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#0071e3' }}>
            <Trophy size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />
            추가 점수
          </h3>
          <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>
            README.md에 앱 설명 + 스크린샷 포함 시
          </p>
        </div>

        <div className="highlight-box" style={{ background: '#fff3cd', borderLeftColor: '#ffc107', marginTop: '2rem' }}>
          <p style={{ fontWeight: 700 }}>✅ 제출:</p>
          <p>GitHub Repository URL + 배포 URL</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// LEVEL: ADVANCED (상)
// ============================================================================

function LevelAdvanced() {
  return (
    <section style={{ marginTop: '4rem' }}>
      <span className="section-label">[상] 난이도 - 요구사항만 (힌트 없음)</span>
      <h2>요구사항을 보고 완전히 자율적으로 제작하세요</h2>
      <p className="section-intro">
        힌트 없이 요구사항만 제공됩니다. 모든 것을 스스로 해결하세요.
      </p>

      <div className="deep-dive">
        <div className="deep-dive-heading">
          <span>요구사항만 제공</span>
          <h3>다음 조건을 모두 만족하세요</h3>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <img
              src="/project1-advanced.png"
              alt="고급 프로젝트 예시"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        </div>

        <div className="verify-checklist" style={{ marginTop: '2rem' }}>
          <span>필수 요구사항</span>
          <div className="verify-item">
            <CheckCircle2 size={15} />
            <p><strong>1. GitHub Pages 배포 완료</strong></p>
          </div>
          <div className="verify-item">
            <CheckCircle2 size={15} />
            <p><strong>2. 인터랙티브 요소 3개 이상</strong></p>
          </div>
          <div className="verify-item">
            <CheckCircle2 size={15} />
            <p><strong>3. 실제 디스플레이 공정 데이터 포함</strong> (포토/에치/잉크젯 중 1개 이상)</p>
          </div>
          <div className="verify-item">
            <CheckCircle2 size={15} />
            <p><strong>4. Chart.js 또는 D3.js를 이용한 시각화 포함</strong></p>
          </div>
          <div className="verify-item">
            <CheckCircle2 size={15} />
            <p><strong>5. README.md 영문 작성</strong> (AI 활용 가능)</p>
          </div>
          <div className="verify-item">
            <CheckCircle2 size={15} />
            <p><strong>6. 커밋 히스토리 최소 5개 이상</strong> (작업 과정이 보여야 함)</p>
          </div>
        </div>

        <div className="highlight-box" style={{ background: '#f8d7da', borderLeftColor: '#dc3545', marginTop: '2rem' }}>
          <p style={{ fontWeight: 700 }}>✅ 제출:</p>
          <p>GitHub Repository URL + 배포 URL</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// EVALUATION CRITERIA
// ============================================================================

function EvaluationCriteria() {
  return (
    <section style={{ marginTop: '4rem' }}>
      <span className="section-label">평가 기준</span>
      <h2>난이도별 평가 기준표</h2>
      <p className="section-intro">
        자신이 선택한 난이도에 맞는 평가 기준을 확인하세요.
      </p>

      <div style={{ marginTop: '2rem', overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ background: '#0071e3', color: 'white' }}>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #005bb5' }}>항목</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #005bb5' }}>하</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #005bb5' }}>중</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #005bb5' }}>상</th>
            </tr>
          </thead>
          <tbody>
            {[
              { item: 'GitHub Pages 배포', low: '필수', mid: '필수', high: '필수' },
              { item: '인터랙티브 요소', low: '없어도 됨', mid: '1개 이상', high: '3개 이상' },
              { item: '데이터 수준', low: '기본 비교표', mid: '실제 스펙 데이터', high: '공정 데이터 포함' },
              { item: '시각화', low: '없어도 됨', mid: '없어도 됨', high: '필수' },
              { item: 'README', low: '선택', mid: '권장', high: '필수 (영문)' },
              { item: '커밋 수', low: '제한 없음', mid: '제한 없음', high: '5개 이상' },
            ].map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{row.item}</td>
                <td style={{ padding: '1rem', textAlign: 'center', background: '#d1f2eb' }}>{row.low}</td>
                <td style={{ padding: '1rem', textAlign: 'center', background: '#fff3cd' }}>{row.mid}</td>
                <td style={{ padding: '1rem', textAlign: 'center', background: '#f8d7da' }}>{row.high}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ============================================================================
// INTERACTIVE WORKSHOP
// ============================================================================

function InteractiveWorkshop() {
  const [fields, setFields] = useState({
    level: '',
    repo: '',
    url: '',
  });
  const [copied, setCopied] = useState(false);

  const hasContent = Object.values(fields).some(Boolean);

  const generated = hasContent
    ? `난이도: ${fields.level || '[선택 안 함]'}
GitHub Repository: ${fields.repo || '[미작성]'}
배포 URL: ${fields.url || '[미배포]'}

다음 단계: ${!fields.level ? '난이도 선택' : !fields.repo ? 'GitHub Repository 생성' : !fields.url ? 'GitHub Pages 배포' : '제출 완료!'}`
    : '';

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const inputRows: { key: keyof typeof fields; label: string; placeholder: string }[] = [
    { key: 'level', label: '난이도 선택', placeholder: '하 / 중 / 상' },
    { key: 'repo', label: 'GitHub Repository URL', placeholder: 'https://github.com/...' },
    { key: 'url', label: '배포 URL', placeholder: 'https://...github.io/...' },
  ];

  return (
    <section className="workshop-section teaching-section" style={{ marginTop: '4rem' }}>
      <span className="section-label">제출 체크리스트</span>
      <h2>프로젝트 진행 현황을 확인하세요</h2>
      <p className="section-intro">
        난이도를 선택하고, Repository URL과 배포 URL을 입력하여 제출 준비를 완료하세요.
      </p>

      <div className="interactive-workshop">
        <div className="iw-header">
          <FileText size={22} color="var(--accent)" />
          <strong>제출 준비 체크리스트</strong>
          <p>아래 항목을 모두 입력하세요.</p>
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
              <CheckCircle2 size={18} color="var(--accent)" />
              <strong>제출 현황</strong>
            </div>
            <div className={`iw-generated-text ${hasContent ? 'active' : ''}`}>
              {generated || '위 항목을 입력하면\n제출 현황이 표시됩니다.'}
            </div>
            <button
              className={`iw-copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              disabled={!hasContent}
            >
              {copied
                ? <><Check size={15} />복사됨!</>
                : <><Copy size={15} />제출 정보 복사</>}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SUMMARY
// ============================================================================

function Summary() {
  return (
    <section style={{ marginTop: '4rem' }}>
      <span className="section-label">정리</span>
      <h2>프로젝트 1 완료 확인</h2>
      <div className="checklist">
        <div className="check-item">
          <CheckCircle2 size={20} />
          <span>Claude Code로 index.html 파일 생성</span>
        </div>
        <div className="check-item">
          <CheckCircle2 size={20} />
          <span>자기소개 + 관심 분야 + 비교 테이블 포함</span>
        </div>
        <div className="check-item">
          <CheckCircle2 size={20} />
          <span>GitHub Repository에 push 완료</span>
        </div>
        <div className="check-item">
          <CheckCircle2 size={20} />
          <span>GitHub Pages 배포 완료 및 URL 확인</span>
        </div>
        <div className="check-item">
          <CheckCircle2 size={20} />
          <span>선택한 난이도에 맞는 요구사항 모두 충족</span>
        </div>
      </div>
      <div className="wrap-message">
        <Quote size={36} color="var(--accent)" />
        <h3>"Claude Code와 GitHub Pages로 만든 첫 번째 포트폴리오 웹페이지가 완성되었습니다!"</h3>
        <p>다음 프로젝트: 디스플레이 공정 시뮬레이터 (프로젝트 2)</p>
      </div>
    </section>
  );
}
