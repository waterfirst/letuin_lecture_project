import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ClipboardList,
  Copy,
  ExternalLink,
  FileCode2,
  FileText,
  Globe,
  Layers,
  LayoutTemplate,
  MessageSquareText,
  Microscope,
  Quote,
  Rocket,
  Search,
  Share2,
  Sparkles,
  Upload,
  Wrench,
  Zap,
} from 'lucide-react';

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}${filename}`;

// ============================================================================
// DATA ARRAYS - Gemini Defect Report & GitHub Pages
// ============================================================================

const learningGoals = [
  {
    step: '학습목표 1',
    title: 'Gemini에게 설비 불량 분석 보고서를 HTML로 작성시키기',
    body: 'gemini.google.com에서 프롬프트 하나로 Chart.js 포함 불량 보고서를 만듭니다.',
    type: 'report',
  },
  {
    step: '학습목표 2',
    title: 'index.html과 README.md를 Gemini로 만들기',
    body: 'GitHub Pages 배포에 필요한 파일을 Gemini가 자동 생성합니다.',
    type: 'files',
  },
  {
    step: '학습목표 3',
    title: 'GitHub Pages로 배포하여 부서원에게 URL 공유',
    body: 'GitHub 웹 UI에서 드래그 앤 드롭으로 업로드하고 Pages를 설정합니다.',
    type: 'deploy',
  },
];

const lessonFlow = [
  { time: '3분', label: '오프닝' },
  { time: '12분', label: '보고서 생성' },
  { time: '10분', label: '파일 생성' },
  { time: '10분', label: 'Pages 배포' },
  { time: '5분', label: '정리' },
];

const roleFlow = [
  { owner: '엔지니어', task: '불량 현상 설명 + 프롬프트 작성' },
  { owner: 'Gemini', task: 'HTML 보고서 + index.html + README.md 생성' },
  { owner: 'GitHub Pages', task: '정적 사이트 호스팅 + URL 공유' },
];

const defectPrompt = `반도체 CVD 챔버 #3에서 박막 두께 균일도 불량이 발생했습니다.
히터 존별 온도 편차가 원인입니다.
이 불량에 대한 분석 보고서를 HTML로 만들어줘.
포함: 불량 개요, 데이터 분석(Chart.js 히스토그램),
원인 분석(5 Why), 대책, 효과 확인.
깔끔한 보고서 스타일, 반응형, 인쇄 가능.`;

const reportSections = [
  { title: '불량 개요', desc: '장비명, 일시, 현상, 영향 범위' },
  { title: '데이터 분석', desc: 'Chart.js 히스토그램 — 두께 분포' },
  { title: '원인 분석', desc: '5 Why 분석 — 히터 존 온도 편차' },
  { title: '대책', desc: '단기/장기 대책 매트릭스' },
  { title: '효과 확인', desc: '개선 전/후 Cpk 비교' },
];

const geminiSteps = [
  { step: '1', title: 'gemini.google.com 접속', body: 'Google 계정으로 로그인합니다.', duration: '30초' },
  { step: '2', title: '프롬프트 입력', body: '불량 현황과 요구사항을 구체적으로 작성합니다.', duration: '2분' },
  { step: '3', title: 'HTML 코드 복사', body: 'Gemini가 생성한 HTML 코드를 전체 복사합니다.', duration: '30초' },
  { step: '4', title: '로컬에 저장', body: 'report.html로 저장하고 브라우저에서 확인합니다.', duration: '1분' },
  { step: '5', title: '수정 요청', body: '"차트 색상을 파란색으로 바꿔줘" 등 추가 지시합니다.', duration: '1분' },
];

const indexReadmeSteps = [
  { step: '1', title: 'index.html 생성 프롬프트', body: '"report.html로 연결되는 index.html을 만들어줘. 프로젝트 이름, 보고서 링크, 작성일 포함."', duration: '1분' },
  { step: '2', title: 'README.md 생성 프롬프트', body: '"이 GitHub 저장소의 README.md를 만들어줘. 프로젝트 설명, 파일 목록, GitHub Pages URL 포함."', duration: '1분' },
  { step: '3', title: '코드 복사 & 저장', body: 'index.html과 README.md를 각각 파일로 저장합니다.', duration: '1분' },
];

const deploySteps = [
  { num: '1', label: 'github.com 접속 & 로그인' },
  { num: '2', label: 'New Repository 생성 (Public)' },
  { num: '3', label: 'uploading your files 링크 클릭' },
  { num: '4', label: 'report.html, index.html, README.md 드래그 앤 드롭' },
  { num: '5', label: 'Commit changes 클릭' },
  { num: '6', label: 'Settings 탭 → Pages 메뉴' },
  { num: '7', label: 'Source: Deploy from a branch → main → /(root) → Save' },
  { num: '8', label: '1~2분 후 URL 확인 → 부서원에게 공유' },
];

const fieldAlternatives = [
  {
    icon: Layers,
    field: '디스플레이',
    title: 'OLED Mura 불량 보고서',
    prompt: '"OLED 패널에서 Mura 불량이 발생했습니다. 증착 소스 정렬 편차가 원인입니다. HTML 분석 보고서를 만들어줘."',
    cause: '증착 소스 정렬 편차',
  },
  {
    icon: Zap,
    field: '배터리',
    title: '전극 코팅 두께 불량 보고서',
    prompt: '"배터리 전극 코팅 두께 불량이 발생했습니다. 슬롯다이 갭 이상이 원인입니다. HTML 분석 보고서를 만들어줘."',
    cause: '슬롯다이 갭 이상',
  },
  {
    icon: Microscope,
    field: '바이오',
    title: '세포 배양 오염 보고서',
    prompt: '"세포 배양 중 오염이 발생했습니다. 클린벤치 HEPA 필터 열화가 원인입니다. HTML 분석 보고서를 만들어줘."',
    cause: 'HEPA 필터 열화',
  },
];

const qualityChecklist = [
  'Gemini가 생성한 HTML을 브라우저에서 열어 정상 표시되는가?',
  'Chart.js 히스토그램이 데이터와 함께 렌더링되는가?',
  '5 Why 분석이 논리적으로 연결되는가?',
  'index.html에서 report.html로 링크가 작동하는가?',
  'GitHub Pages URL이 정상 접속되는가?',
];

const timeComparison = [
  { task: 'Word 보고서 작성', traditional: '3시간', gemini: '5분' },
  { task: '차트 삽입', traditional: '30분', gemini: '자동 생성' },
  { task: '웹 변환', traditional: '2시간', gemini: '즉시' },
  { task: '배포 & 공유', traditional: '별도 서버', gemini: 'GitHub Pages 무료' },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function GoalVisual({ type }: { type: string }) {
  if (type === 'report') {
    return (
      <div className="goal-visual definition">
        <div className="visual-item person">
          <MessageSquareText size={18} />
          <span>프롬프트</span>
        </div>
        <ArrowRight size={14} className="visual-arrow" />
        <div className="visual-item ai">
          <FileCode2 size={18} />
          <span>HTML</span>
        </div>
      </div>
    );
  }
  if (type === 'files') {
    return (
      <div className="goal-visual elements">
        <div className="element-tag">index.html</div>
        <div className="element-tag">README.md</div>
        <div className="element-tag">report.html</div>
      </div>
    );
  }
  if (type === 'deploy') {
    return (
      <div className="goal-visual field">
        <div className="field-icons">
          <div className="f-icon"><Upload size={18} /></div>
          <div className="f-icon"><Globe size={18} /></div>
        </div>
        <div className="success-indicator">
          <CheckCircle2 size={12} />
          <span>배포 완료</span>
        </div>
      </div>
    );
  }
  return null;
}

function TimeComparisonTable() {
  return (
    <div className="visual-card">
      <div className="visual-header">
        <span>시간 비교</span>
        <strong>Word vs Gemini</strong>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e5e5' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#666' }}>작업</th>
              <th style={{ textAlign: 'center', padding: '0.75rem', color: '#E74C3C' }}>Word 수작업</th>
              <th style={{ textAlign: 'center', padding: '0.75rem', color: '#34A853' }}>Gemini + Pages</th>
            </tr>
          </thead>
          <tbody>
            {timeComparison.map((row) => (
              <tr key={row.task} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>{row.task}</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#E74C3C' }}>{row.traditional}</td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#34A853', fontWeight: 700 }}>{row.gemini}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
        총 소요 시간: Word 약 5시간 30분 → Gemini + GitHub Pages 약 10분
      </p>
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

function GeminiReportDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>STEP 1~5 Deep Dive</span>
        <h3>Gemini에서 CVD 챔버 불량 보고서 HTML 만들기</h3>
        <p>
          gemini.google.com에 접속하여 프롬프트 하나로 Chart.js 포함 불량 분석 보고서를 생성합니다.
          복사 → 저장 → 브라우저 확인 → 수정 요청까지 5단계입니다.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img
            src={assetUrl('panel2.png')}
            alt="Gemini HTML 보고서 생성 화면"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        </div>
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: Word 수작업</span>
          <h4>Word로 보고서 작성 → 3시간 이상 소요</h4>
          <ul>
            <li>Word에서 표 그리고 데이터 입력 — 30분</li>
            <li>Excel에서 차트 만들고 캡처 → 붙여넣기 — 30분</li>
            <li>5 Why 분석 텍스트 직접 작성 — 1시간</li>
            <li>대책 & 효과 확인 작성 — 1시간</li>
            <li>포맷 정리, PDF 변환, 이메일 전송 — 30분</li>
          </ul>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>프롬프트: Gemini에게 지시</span>
          <h4>불량 현황 + 요구사항을 한 번에 전달합니다</h4>
          <div className="code-preview-box">
            <pre style={{ background: '#1a1a2e', color: '#e0e0e0', padding: '1.25rem', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{defectPrompt}</pre>
          </div>
          <div className="aoi-rule-grid">
            <div><strong>불량 개요</strong><span>현상 + 영향 범위</span></div>
            <div><strong>Chart.js</strong><span>히스토그램 자동 생성</span></div>
            <div><strong>5 Why</strong><span>근본 원인 분석</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: Gemini 산출물</span>
          <h4>완성된 HTML 보고서 — 브라우저에서 바로 확인</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {reportSections.map((sec) => (
              <div key={sec.title} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                <CheckCircle2 size={16} color="#34A853" />
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>{sec.title}</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#666', fontSize: '0.85rem' }}>{sec.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="aoi-impact-strip">
            <div><strong>작성 시간</strong><span>3시간 → 5분</span></div>
            <div><strong>차트</strong><span>Chart.js 자동 포함</span></div>
            <div><strong>반응형</strong><span>모바일에서도 확인</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 불량 현황을 구체적으로 설명하고, 포함할 섹션(개요, 데이터, 원인, 대책, 효과)을 명확히 지시하는 것입니다.
      </p>
      <VerifyChecklist points={[
        'HTML 파일을 브라우저에서 열었을 때 모든 섹션이 표시되는가?',
        'Chart.js 히스토그램이 정상 렌더링되는가?',
        '5 Why 분석의 논리가 자연스러운가?',
      ]} />
    </div>
  );
}

function IndexReadmeDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>파일 구성 Deep Dive</span>
        <h3>Gemini로 index.html + README.md 만들기</h3>
        <p>
          GitHub Pages는 index.html을 첫 페이지로 인식합니다.
          Gemini에게 index.html과 README.md를 각각 만들어달라고 요청합니다.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img
            src={assetUrl('panel3.png')}
            alt="index.html과 README.md 생성 화면"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        </div>
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel prompt-panel">
          <span>Prompt 1: index.html</span>
          <h4>보고서 목록 페이지를 만들어달라고 요청합니다</h4>
          <div className="code-preview-box">
            <pre style={{ background: '#1a1a2e', color: '#e0e0e0', padding: '1.25rem', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{`"report.html로 연결되는 index.html을 만들어줘.
프로젝트 이름: CVD 챔버 불량 분석
보고서 링크, 작성일, 작성자 포함.
깔끔한 카드 스타일 디자인."`}</pre>
          </div>
          <div className="aoi-rule-grid">
            <div><strong>역할</strong><span>GitHub Pages 첫 페이지</span></div>
            <div><strong>링크</strong><span>report.html 연결</span></div>
            <div><strong>디자인</strong><span>카드 스타일</span></div>
          </div>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt 2: README.md</span>
          <h4>저장소 설명 파일을 만들어달라고 요청합니다</h4>
          <div className="code-preview-box">
            <pre style={{ background: '#1a1a2e', color: '#e0e0e0', padding: '1.25rem', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{`"이 GitHub 저장소의 README.md를 만들어줘.
프로젝트: CVD 챔버 #3 불량 분석 보고서
파일 목록: index.html, report.html
GitHub Pages URL 자리표시자 포함.
마크다운 형식으로 깔끔하게."`}</pre>
          </div>
          <div className="aoi-rule-grid">
            <div><strong>역할</strong><span>저장소 첫 화면 설명</span></div>
            <div><strong>파일 목록</strong><span>3개 파일 안내</span></div>
            <div><strong>URL</strong><span>Pages 주소 안내</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>결과: 3개 파일 준비 완료</span>
          <h4>GitHub에 업로드할 파일이 모두 준비되었습니다</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <FileCode2 size={20} color="#16a766" />
              <div>
                <strong>index.html</strong>
                <span style={{ marginLeft: '0.5rem', color: '#666', fontSize: '0.85rem' }}>— 보고서 목록 페이지 (GitHub Pages 첫 화면)</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#f0f7ff', borderRadius: '8px', border: '1px solid #d1e7ff' }}>
              <BarChart3 size={20} color="#4285F4" />
              <div>
                <strong>report.html</strong>
                <span style={{ marginLeft: '0.5rem', color: '#666', fontSize: '0.85rem' }}>— 불량 분석 보고서 (Chart.js 포함)</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#fefce8', borderRadius: '8px', border: '1px solid #fef08a' }}>
              <FileText size={20} color="#ca8a04" />
              <div>
                <strong>README.md</strong>
                <span style={{ marginLeft: '0.5rem', color: '#666', fontSize: '0.85rem' }}>— 저장소 설명 파일</span>
              </div>
            </div>
          </div>
          <div className="aoi-impact-strip">
            <div><strong>파일 수</strong><span>3개</span></div>
            <div><strong>생성 시간</strong><span>약 3분</span></div>
            <div><strong>코딩 필요</strong><span>없음</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 index.html이 GitHub Pages의 첫 페이지 역할을 하며, report.html로 연결되는 구조를 만드는 것입니다.
      </p>
      <VerifyChecklist points={[
        'index.html에서 report.html 링크를 클릭하면 보고서가 열리는가?',
        'README.md가 마크다운 문법에 맞게 작성되었는가?',
        '3개 파일이 모두 같은 폴더에 있는가?',
      ]} />
    </div>
  );
}

function GitHubPagesDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>배포 Deep Dive</span>
        <h3>GitHub Pages 배포 8단계 (웹 UI 전용)</h3>
        <p>
          git 명령어 없이, GitHub 웹사이트에서 드래그 앤 드롭으로 파일을 업로드하고
          Pages를 설정하여 URL을 공유합니다.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img
            src={assetUrl('panel4.png')}
            alt="GitHub Pages 배포 화면"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
        <img
          src={assetUrl('comic.png')}
          alt="GitHub Pages 배포 8단계 흐름도"
          style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        />
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div className="yield-case-compare vertical-case-flow">
          <article className="yield-case-panel result-panel">
            <span>8단계 상세 안내</span>
            <h4>모두 웹 브라우저에서 마우스로 진행합니다</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {deploySteps.map((item) => (
                <div key={item.num} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #4285F4' }}>
                  <span style={{ background: '#4285F4', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>{item.num}</span>
                  <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="aoi-impact-strip" style={{ marginTop: '1.5rem' }}>
              <div><strong>git 명령어</strong><span>사용 안 함</span></div>
              <div><strong>업로드</strong><span>드래그 앤 드롭</span></div>
              <div><strong>비용</strong><span>무료</span></div>
            </div>
          </article>
        </div>
      </div>

      <div className="highlight-box" style={{ marginTop: '2rem', background: '#f0f7ff', borderLeftColor: '#4285F4' }}>
        <p style={{ fontWeight: 700, color: '#4285F4' }}>배포 완료 후 URL 형식:</p>
        <p style={{ fontFamily: 'monospace', fontSize: '1.05rem', marginTop: '0.5rem' }}>
          https://username.github.io/repository-name/
        </p>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          이 URL을 부서 단톡방이나 이메일로 공유하면 누구나 보고서를 확인할 수 있습니다.
        </p>
      </div>

      <p className="case-takeaway">
        핵심은 git 명령어 없이 GitHub 웹 UI만으로 파일 업로드와 Pages 배포가 모두 가능하다는 것입니다.
      </p>
      <VerifyChecklist points={[
        'Repository가 Public으로 생성되었는가?',
        'index.html, report.html, README.md가 모두 업로드되었는가?',
        'Settings → Pages에서 Source가 main / /(root)로 설정되었는가?',
        '배포 URL에 접속했을 때 index.html이 표시되는가?',
      ]} />
    </div>
  );
}

function InteractiveWorkshop() {
  const [fields, setFields] = useState({
    equipment: '',
    defect: '',
    cause: '',
  });
  const [copied, setCopied] = useState(false);

  const hasContent = Object.values(fields).some(Boolean);

  const generated = hasContent
    ? `${fields.equipment || '[설비명]'}에서 ${fields.defect || '[불량 현상]'}이 발생했습니다.
${fields.cause || '[원인]'}이 원인입니다.
이 불량에 대한 분석 보고서를 HTML로 만들어줘.
포함: 불량 개요, 데이터 분석(Chart.js 히스토그램),
원인 분석(5 Why), 대책, 효과 확인.
깔끔한 보고서 스타일, 반응형, 인쇄 가능.`
    : '';

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const inputRows: { key: keyof typeof fields; label: string; placeholder: string }[] = [
    { key: 'equipment', label: '설비명', placeholder: '예: CVD 챔버 #3, OLED 증착기, 슬롯다이 코터' },
    { key: 'defect', label: '불량 현상', placeholder: '예: 박막 두께 균일도 불량, Mura 불량, 코팅 불균일' },
    { key: 'cause', label: '추정 원인', placeholder: '예: 히터 존 온도 편차, 소스 정렬 편차, 갭 이상' },
  ];

  return (
    <div className="interactive-workshop">
      <div className="iw-header">
        <Sparkles size={22} color="var(--accent)" />
        <strong>나만의 불량 보고서 프롬프트 생성기</strong>
        <p>아래 정보를 입력하면 Gemini에 바로 붙여넣을 수 있는 프롬프트가 생성됩니다.</p>
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
            <MessageSquareText size={18} color="var(--accent)" />
            <strong>생성된 프롬프트</strong>
          </div>
          <div className={`iw-generated-text ${hasContent ? 'active' : ''}`}>
            {generated || '위 정보를 입력하면\nGemini 프롬프트가 자동 생성됩니다.'}
          </div>
          <button
            className={`iw-copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            disabled={!hasContent}
          >
            {copied
              ? <><Check size={15} />복사됨!</>
              : <><Copy size={15} />프롬프트 복사</>}
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
        <strong>지금 바로 해보기 — Gemini로 보고서 만들고 GitHub Pages 배포</strong>
      </div>
      <div className="frg-steps">
        {geminiSteps.map((item) => (
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
      {/* ── HEADER ───────────────────────────────────────────── */}
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
            <span className="header-tag">Gemini 불량 보고서 & GitHub Pages 배포</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Ch.12 Gemini로 불량 보고서 만들어 GitHub Pages에 배포</h1>
          <p className="subtitle">Word로 3시간 걸리던 불량 보고서를 Gemini로 5분에 만들고, GitHub Pages로 부서원에게 URL 공유</p>
          <div className="lesson-meta" aria-label="lesson summary">
            <span>40분</span>
            <span>Gemini 웹</span>
            <span>GitHub Pages</span>
            <span>결과물: 불량 보고서 웹사이트</span>
          </div>
        </motion.div>
        <LectureImage
          src="panel1.png"
          alt="Gemini로 불량 보고서를 HTML로 만들고 GitHub Pages에 배포하는 전체 흐름입니다."
          caption="Gemini로 HTML 보고서 생성 → GitHub 업로드 → Pages 배포 → URL 공유"
        />
      </header>

      <main>
        {/* ── Section 01: 오프닝 ──────────────────────────────── */}
        <section className="overview-section">
          <span className="section-label">01. 오프닝 (0:00-3:00)</span>
          <h2>Word로 3시간 → Gemini로 5분</h2>
          <p className="section-intro">
            설비 불량 보고서를 매번 Word로 작성하시나요? 표 그리고, 차트 만들고, 포맷 맞추고, PDF 변환하고...
            Gemini에게 프롬프트 하나 주면 Chart.js 포함 HTML 보고서가 5분 만에 완성됩니다.
            GitHub Pages로 배포하면 URL 하나로 부서 전체가 바로 확인할 수 있습니다.
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
          <TimeComparisonTable />
        </section>

        {/* ── Section 02: Gemini 보고서 생성 ──────────────────── */}
        <section className="definition-section">
          <span className="section-label">02. Gemini에서 불량 보고서 HTML 만들기 (3:00-15:00)</span>
          <h2>프롬프트 하나로 Chart.js 포함 불량 분석 보고서 완성</h2>
          <p className="section-intro">
            gemini.google.com에 접속하여 불량 현황을 설명하고, 보고서에 포함할 내용을 지시합니다.
            Gemini가 불량 개요, 데이터 분석(Chart.js 히스토그램), 원인 분석(5 Why), 대책, 효과 확인을
            모두 포함한 HTML 파일을 생성합니다.
          </p>
          <div className="one-line-definition inline-definition">
            <span>한 문장 정의</span>
            <strong>Gemini는 불량 현상을 설명하면 Chart.js 포함 HTML 분석 보고서를 자동으로 만들어주는 AI입니다.</strong>
          </div>
          <div className="role-flow" aria-label="역할 분담">
            {roleFlow.map((item, index) => (
              <div className="role-step" key={`${item.owner}-${item.task}`}>
                <span>{item.owner}</span>
                <strong>{item.task}</strong>
                {index < roleFlow.length - 1 && <ArrowRight size={22} />}
              </div>
            ))}
          </div>

          <div className="highlight-box" style={{ marginTop: '2rem', background: '#f0f7ff', borderLeftColor: '#4285F4' }}>
            <p style={{ fontWeight: 700, color: '#4285F4' }}>핵심 프롬프트:</p>
            <pre style={{ background: '#1a1a2e', color: '#e0e0e0', padding: '1.25rem', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.7', whiteSpace: 'pre-wrap', marginTop: '0.75rem' }}>{defectPrompt}</pre>
          </div>

          <GeminiReportDeepDive />
        </section>

        {/* ── Section 03: index.html + README.md ──────────────── */}
        <section>
          <span className="section-label">03. Gemini로 index.html + README.md 만들기 (15:00-25:00)</span>
          <h2>GitHub Pages 배포에 필요한 파일을 Gemini가 만들어줍니다</h2>
          <p className="section-intro">
            GitHub Pages는 index.html을 첫 페이지로 인식합니다. report.html로 연결되는 index.html과
            저장소를 설명하는 README.md를 Gemini에게 요청합니다.
          </p>

          <div className="first-run-guide" style={{ marginTop: '2rem' }}>
            <div className="frg-title">
              <LayoutTemplate size={18} color="var(--accent)" />
              <strong>파일 생성 3단계</strong>
            </div>
            <div className="frg-steps">
              {indexReadmeSteps.map((item) => (
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

          <IndexReadmeDeepDive />
        </section>

        {/* ── Section 04: GitHub Pages 배포 ───────────────────── */}
        <section>
          <span className="section-label">04. GitHub Pages 배포 8단계 (25:00-35:00)</span>
          <h2>git 명령어 없이 웹 브라우저에서 배포 완료</h2>
          <p className="section-intro">
            GitHub 웹사이트에서 드래그 앤 드롭으로 파일을 업로드하고,
            Settings에서 Pages를 설정하면 1~2분 후 URL이 생성됩니다.
            git 명령어는 전혀 사용하지 않습니다.
          </p>

          <div className="highlight-box" style={{ background: '#fef3c7', borderLeftColor: '#f59e0b' }}>
            <p style={{ fontWeight: 700, color: '#b45309' }}>중요:</p>
            <p>이 과정에서는 git clone, git add, git commit, git push 등의 명령어를 사용하지 않습니다.
            모든 작업은 GitHub 웹사이트의 마우스 클릭과 드래그 앤 드롭으로 진행합니다.</p>
          </div>

          <GitHubPagesDeepDive />
        </section>

        {/* ── Section 05: 다른 분야 활용 ─────────────────────── */}
        <section>
          <span className="section-label">04-1. 다른 분야에 적용하기</span>
          <h2>디스플레이 / 배터리 / 바이오 — 같은 방법, 다른 프롬프트</h2>
          <p className="section-intro">
            CVD 챔버 외에도 동일한 방법으로 다양한 설비 불량 보고서를 만들 수 있습니다.
            프롬프트에서 설비명, 불량 현상, 원인만 바꾸면 됩니다.
          </p>
          <div className="scenario-grid">
            {fieldAlternatives.map((item) => {
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
                  <p className="scenario-before">{item.field} 분야</p>
                  <div className="intent-box">
                    <span>프롬프트</span>
                    <p>{item.prompt}</p>
                  </div>
                  <p className="scenario-output">원인: {item.cause}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Section 06: 미니 워크숍 ────────────────────────── */}
        <section className="workshop-section teaching-section">
          <span className="section-label">05. Quality Gate & 마무리 (35:00-40:00)</span>
          <h2>실습: 내 설비의 <mark>불량 보고서 프롬프트</mark> 만들기</h2>
          <p className="section-intro">
            본인 담당 설비의 불량 정보를 입력하면 Gemini 프롬프트가 자동 생성됩니다.
            복사해서 gemini.google.com에 바로 붙여넣으세요.
          </p>
          <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <img
              src={assetUrl('logo.png')}
              alt="실습 카드"
              style={{ maxWidth: '240px', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>
          <InteractiveWorkshop />
          <FirstRunGuide />
        </section>

        {/* ── Section 07: 품질 점검 ──────────────────────────── */}
        <section>
          <span className="section-label">05-1. 품질 점검 및 정리</span>
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
            <h3>"보고서는 내용이 핵심이지, 포맷에 시간을 쓸 필요가 없습니다. Gemini가 포맷을 맡고, 여러분은 분석에 집중하세요."</h3>
            <p>다음 강의: 하이테크 물리 & 공정 시뮬레이터 제작 (13강)</p>
          </div>
          <NextLecturePreview />
        </section>

        {/* ── Professional Point ──────────────────────────────── */}
        <section className="professional-point">
          <div className="highlight-box" style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '24px' }}>
            <h3>Advanced Process Engineering Point</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '1rem', fontSize: '1.1rem' }}>
              "불량 보고서에 3시간을 쓰면 그만큼 공정 개선에 쓸 시간이 줄어듭니다.
              Gemini로 보고서를 5분에 만들고, 남은 시간에 5 Why 분석을 더 깊이 하세요.
              GitHub Pages URL 하나면 부서 전체가 실시간으로 보고서를 확인할 수 있습니다."
            </p>
            <div className="point-strip">
              <span><Sparkles size={16} /> Gemini = 보고서 자동화</span>
              <span><Globe size={16} /> Pages = 무료 웹 배포</span>
              <span><Share2 size={16} /> URL = 즉시 공유</span>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer>
        <p>&copy; 2026 Gemini Defect Report & GitHub Pages for Fine Tech Engineering | LettUin Edu</p>
      </footer>
    </div>
  );
}
