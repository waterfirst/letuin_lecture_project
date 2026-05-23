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
// DATA ARRAYS - Gemini 문서 4종 & GitHub Pages
// ============================================================================

const learningGoals = [
  {
    step: '학습목표 1',
    title: 'Gemini에게 제조업 문서 4종(SOP, 불량 보고서, 점검표, 공정 가이드)을 HTML로 만들기',
    body: 'gemini.google.com에서 프롬프트 하나씩으로 SOP, 불량 분석 보고서, 설비 점검 체크리스트, 공정 파라미터 가이드를 HTML로 생성합니다.',
    type: 'report',
  },
  {
    step: '학습목표 2',
    title: 'index.html과 README.md 포함 총 6개 파일 완성',
    body: '문서 4종 HTML + index.html + README.md = 총 6개 파일을 Gemini로 완성합니다.',
    type: 'files',
  },
  {
    step: '학습목표 3',
    title: 'GitHub Pages URL로 부서원에게 배포',
    body: 'GitHub 웹 UI에서 드래그 앤 드롭으로 업로드하고 Pages를 설정하여 URL을 공유합니다.',
    type: 'deploy',
  },
];

const lessonFlow = [
  { time: '1단계', label: 'Gemini에서 문서 4종 HTML 생성' },
  { time: '2단계', label: 'index.html + README.md 완성 (6개 파일)' },
  { time: '3단계', label: 'GitHub 새 저장소 만들기' },
  { time: '4단계', label: '파일 저장소에 올리기' },
  { time: '5단계', label: 'GitHub Pages 활성화 → URL 공유' },
];

const roleFlow = [
  { owner: '엔지니어', task: '업무 문서 요구사항 + 프롬프트 작성' },
  { owner: 'Gemini', task: 'HTML 문서 4종 + index.html + README.md 생성' },
  { owner: 'GitHub Pages', task: '정적 사이트 호스팅 + URL 공유' },
];

const documentTypes = [
  {
    icon: ClipboardList,
    field: '반도체',
    title: 'SOP (반도체 CVD)',
    docType: 'SOP',
    prompt: `반도체 CVD(Chemical Vapor Deposition) 공정의 표준작업절차서(SOP)를 HTML로 만들어줘.
포함: 목적, 적용 범위, 장비 구성, 작업 전 점검사항, 단계별 작업 절차(가스 퍼지 → 승온 → 증착 → 쿨다운), 이상 발생 시 조치, 안전 주의사항.
깔끔한 보고서 스타일, 반응형, 인쇄 가능.
파일명: sop.html`,
    cause: 'CVD 공정 표준작업절차',
  },
  {
    icon: Layers,
    field: '디스플레이',
    title: '불량 분석 보고서 (디스플레이 OLED Mura)',
    docType: '불량 보고서',
    prompt: `디스플레이 OLED 패널에서 Mura 불량이 발생했습니다.
증착 소스 정렬 편차가 원인입니다.
이 불량에 대한 분석 보고서를 HTML로 만들어줘.
포함: 불량 개요, 데이터 분석(Chart.js 히스토그램), 원인 분석(5 Why), 대책, 효과 확인.
깔끔한 보고서 스타일, 반응형, 인쇄 가능.
파일명: defect-report.html`,
    cause: '증착 소스 정렬 편차',
  },
  {
    icon: Zap,
    field: '배터리',
    title: '설비 점검 체크리스트 (배터리 전극 코팅)',
    docType: '점검 체크리스트',
    prompt: `배터리 전극 코팅(슬롯다이 코터) 설비의 일일/주간/월간 점검 체크리스트를 HTML로 만들어줘.
포함: 점검 항목(슬롯다이 갭, 슬러리 유량, 건조 온도, 권취 장력), 판정 기준(OK/NG), 점검자 서명란, 비고란.
체크박스가 클릭 가능한 인터랙티브 HTML.
깔끔한 테이블 스타일, 반응형, 인쇄 가능.
파일명: checklist.html`,
    cause: '슬롯다이 갭 / 슬러리 유량 관리',
  },
  {
    icon: Microscope,
    field: '바이오',
    title: '공정 파라미터 가이드 (바이오 세포 배양)',
    docType: '공정 가이드',
    prompt: `바이오 세포 배양 공정의 핵심 파라미터 가이드를 HTML로 만들어줘.
포함: 배양 온도(37±0.5°C), CO₂ 농도(5±0.2%), pH(7.2~7.4), 배지 교환 주기, 계대 배양 기준, 오염 판별 기준.
각 파라미터의 목표값, 허용 범위, 이탈 시 조치를 표로 정리.
깔끔한 가이드 스타일, 반응형, 인쇄 가능.
파일명: parameter-guide.html`,
    cause: '배양 온도/CO₂/pH 관리',
  },
];

const fieldAlternatives = documentTypes;

const defectPrompt = documentTypes[0].prompt;

const reportSections = [
  { title: 'SOP', desc: '반도체 CVD 표준작업절차서' },
  { title: '불량 보고서', desc: 'OLED Mura 불량 분석 (Chart.js 포함)' },
  { title: '점검 체크리스트', desc: '배터리 전극 코팅 설비 점검표' },
  { title: '공정 가이드', desc: '바이오 세포 배양 파라미터 가이드' },
];

const geminiSteps = [
  { step: '1', title: 'gemini.google.com 접속', body: 'Google 계정으로 로그인합니다.', duration: '30초' },
  { step: '2', title: 'SOP 프롬프트 입력 → sop.html 저장', body: 'CVD SOP 프롬프트를 입력하고 생성된 HTML을 sop.html로 저장합니다.', duration: '3분' },
  { step: '3', title: '불량 보고서 프롬프트 → defect-report.html 저장', body: 'OLED Mura 불량 보고서 프롬프트를 입력하고 저장합니다.', duration: '3분' },
  { step: '4', title: '점검 체크리스트 프롬프트 → checklist.html 저장', body: '배터리 전극 코팅 점검표 프롬프트를 입력하고 저장합니다.', duration: '3분' },
  { step: '5', title: '공정 가이드 프롬프트 → parameter-guide.html 저장', body: '바이오 세포 배양 파라미터 가이드 프롬프트를 입력하고 저장합니다.', duration: '3분' },
];

const indexReadmeSteps = [
  { step: '1', title: 'index.html 생성 프롬프트', body: '"sop.html, defect-report.html, checklist.html, parameter-guide.html 4개 문서로 연결되는 index.html을 만들어줘. 프로젝트 이름, 문서 목록 카드, 작성일 포함. 깔끔한 카드 스타일."', duration: '2분' },
  { step: '2', title: 'README.md 생성 프롬프트', body: '"이 GitHub 저장소의 README.md를 만들어줘. 프로젝트: 제조업 문서 4종 웹사이트. 파일 목록: index.html, sop.html, defect-report.html, checklist.html, parameter-guide.html. GitHub Pages URL 자리표시자 포함."', duration: '2분' },
  { step: '3', title: '코드 복사 & 저장', body: 'index.html과 README.md를 각각 파일로 저장합니다. 총 6개 파일이 준비됩니다.', duration: '1분' },
];

const deploySteps = [
  { num: '1', label: 'github.com 접속 & 로그인' },
  { num: '2', label: 'New Repository 생성 (Public)' },
  { num: '3', label: 'uploading your files 링크 클릭' },
  { num: '4', label: '6개 파일 모두 드래그 앤 드롭 업로드' },
  { num: '5', label: 'Commit changes 클릭' },
  { num: '6', label: 'Settings 탭 → Pages 메뉴' },
  { num: '7', label: 'Source: Deploy from a branch → main → /(root) → Save' },
  { num: '8', label: '1~2분 후 URL 확인 → 부서원에게 공유' },
];

const qualityChecklist = [
  'Gemini에서 문서 4종(SOP, 보고서, 점검표, 가이드)을 HTML로 생성했는가?',
  'index.html과 README.md까지 총 6개 파일이 준비되었는가?',
  'GitHub에 새 저장소를 만들었는가?',
  '6개 파일을 드래그 앤 드롭으로 업로드했는가?',
  'GitHub Pages URL이 정상 작동하는가?',
];

const timeComparison = [
  { task: 'SOP 작성', traditional: '2시간', gemini: '3분' },
  { task: '불량 보고서', traditional: '3시간', gemini: '5분' },
  { task: '점검 체크리스트', traditional: '1시간', gemini: '2분' },
  { task: '공정 가이드', traditional: '2시간', gemini: '3분' },
  { task: '배포', traditional: '별도 서버', gemini: 'GitHub Pages 무료' },
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
          <span>HTML x4</span>
        </div>
      </div>
    );
  }
  if (type === 'files') {
    return (
      <div className="goal-visual elements">
        <div className="element-tag">index.html</div>
        <div className="element-tag">README.md</div>
        <div className="element-tag">+ 문서 4종</div>
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
        <strong>수작업 vs Gemini + GitHub Pages</strong>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e5e5' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#666' }}>작업</th>
              <th style={{ textAlign: 'center', padding: '0.75rem', color: '#E74C3C' }}>수작업</th>
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
        총 소요 시간: 수작업 약 8시간 + 별도 서버 → Gemini + GitHub Pages 약 15분 (무료)
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
        <span>1단계 Deep Dive</span>
        <h3>Gemini에서 문서 4종 HTML 생성</h3>
        <p>
          gemini.google.com에 접속하여 프롬프트 4개를 순서대로 입력합니다.
          SOP, 불량 보고서, 점검 체크리스트, 공정 가이드 — 각각 HTML 파일로 저장합니다.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img
            src={assetUrl('panel2.png')}
            alt="Gemini HTML 문서 생성 화면"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        </div>
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: 수작업으로 문서 4종 작성</span>
          <h4>Word/Excel로 8시간 이상 소요</h4>
          <ul>
            <li>SOP: Word에서 표 그리고 절차 작성 — 2시간</li>
            <li>불량 보고서: Excel 차트 + Word 분석 — 3시간</li>
            <li>점검 체크리스트: Excel 표 만들고 인쇄 — 1시간</li>
            <li>공정 가이드: Word에서 파라미터 표 정리 — 2시간</li>
            <li>배포: 이메일 첨부 or 공유폴더 업로드 — 별도 시간</li>
          </ul>
        </article>

        {documentTypes.map((doc) => (
          <article className="yield-case-panel prompt-panel" key={doc.title}>
            <span>프롬프트: {doc.docType}</span>
            <h4>{doc.title}</h4>
            <div className="code-preview-box">
              <pre style={{ background: '#1a1a2e', color: '#e0e0e0', padding: '1.25rem', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{doc.prompt}</pre>
            </div>
            <div className="aoi-rule-grid">
              <div><strong>분야</strong><span>{doc.field}</span></div>
              <div><strong>문서 유형</strong><span>{doc.docType}</span></div>
              <div><strong>핵심</strong><span>{doc.cause}</span></div>
            </div>
          </article>
        ))}

        <article className="yield-case-panel result-panel">
          <span>After: Gemini 산출물 — 문서 4종 완성</span>
          <h4>각 HTML 파일을 브라우저에서 바로 확인</h4>
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
            <div><strong>작성 시간</strong><span>8시간 → 15분</span></div>
            <div><strong>문서 수</strong><span>4종 HTML</span></div>
            <div><strong>반응형</strong><span>모바일에서도 확인</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 회사명/부서명/파라미터를 바꾸면 내일 당장 쓸 수 있는 업무 도구가 된다는 것입니다. 코딩은 거의 제로, AI가 HTML을 생성하고, 우리는 저장+올리기만 하면 됩니다.
      </p>
      <VerifyChecklist points={[
        '4개 HTML 파일을 각각 브라우저에서 열었을 때 모든 섹션이 표시되는가?',
        '불량 보고서의 Chart.js 히스토그램이 정상 렌더링되는가?',
        '점검 체크리스트의 체크박스가 클릭 가능한가?',
        '공정 가이드의 파라미터 표가 정확한가?',
      ]} />
    </div>
  );
}

function IndexReadmeDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>2단계 Deep Dive</span>
        <h3>index.html + README.md 완성 (총 6개 파일)</h3>
        <p>
          GitHub Pages는 index.html을 첫 페이지로 인식합니다.
          문서 4종으로 연결되는 index.html과 저장소 설명 README.md를 Gemini에게 요청합니다.
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
          <h4>문서 4종 목록 페이지를 만들어달라고 요청합니다</h4>
          <div className="code-preview-box">
            <pre style={{ background: '#1a1a2e', color: '#e0e0e0', padding: '1.25rem', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{`"sop.html, defect-report.html, checklist.html, parameter-guide.html
4개 문서로 연결되는 index.html을 만들어줘.
프로젝트 이름: 제조업 문서 4종
각 문서를 카드 형태로 보여주고,
문서명, 설명, 작성일 포함.
깔끔한 카드 스타일 디자인."`}</pre>
          </div>
          <div className="aoi-rule-grid">
            <div><strong>역할</strong><span>GitHub Pages 첫 페이지</span></div>
            <div><strong>링크</strong><span>문서 4종 연결</span></div>
            <div><strong>디자인</strong><span>카드 스타일</span></div>
          </div>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt 2: README.md</span>
          <h4>저장소 설명 파일을 만들어달라고 요청합니다</h4>
          <div className="code-preview-box">
            <pre style={{ background: '#1a1a2e', color: '#e0e0e0', padding: '1.25rem', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{`"이 GitHub 저장소의 README.md를 만들어줘.
프로젝트: 제조업 문서 4종 웹사이트
파일 목록: index.html, sop.html, defect-report.html,
checklist.html, parameter-guide.html
GitHub Pages URL 자리표시자 포함.
마크다운 형식으로 깔끔하게."`}</pre>
          </div>
          <div className="aoi-rule-grid">
            <div><strong>역할</strong><span>저장소 첫 화면 설명</span></div>
            <div><strong>파일 목록</strong><span>6개 파일 안내</span></div>
            <div><strong>URL</strong><span>Pages 주소 안내</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>결과: 6개 파일 준비 완료</span>
          <h4>GitHub에 업로드할 파일이 모두 준비되었습니다</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <FileCode2 size={20} color="#16a766" />
              <div>
                <strong>index.html</strong>
                <span style={{ marginLeft: '0.5rem', color: '#666', fontSize: '0.85rem' }}>— 문서 목록 페이지 (GitHub Pages 첫 화면)</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#f0f7ff', borderRadius: '8px', border: '1px solid #d1e7ff' }}>
              <ClipboardList size={20} color="#4285F4" />
              <div>
                <strong>sop.html</strong>
                <span style={{ marginLeft: '0.5rem', color: '#666', fontSize: '0.85rem' }}>— 반도체 CVD 표준작업절차서</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#fef0f0', borderRadius: '8px', border: '1px solid #fecaca' }}>
              <BarChart3 size={20} color="#E74C3C" />
              <div>
                <strong>defect-report.html</strong>
                <span style={{ marginLeft: '0.5rem', color: '#666', fontSize: '0.85rem' }}>— OLED Mura 불량 분석 보고서</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a' }}>
              <Zap size={20} color="#f59e0b" />
              <div>
                <strong>checklist.html</strong>
                <span style={{ marginLeft: '0.5rem', color: '#666', fontSize: '0.85rem' }}>— 배터리 전극 코팅 점검 체크리스트</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <Microscope size={20} color="#16a766" />
              <div>
                <strong>parameter-guide.html</strong>
                <span style={{ marginLeft: '0.5rem', color: '#666', fontSize: '0.85rem' }}>— 바이오 세포 배양 공정 가이드</span>
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
            <div><strong>파일 수</strong><span>6개</span></div>
            <div><strong>생성 시간</strong><span>약 15분</span></div>
            <div><strong>코딩 필요</strong><span>없음</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 index.html이 GitHub Pages의 첫 페이지 역할을 하며, 문서 4종으로 연결되는 허브 구조를 만드는 것입니다.
      </p>
      <VerifyChecklist points={[
        'index.html에서 문서 4종 링크를 각각 클릭하면 해당 문서가 열리는가?',
        'README.md가 마크다운 문법에 맞게 작성되었는가?',
        '6개 파일이 모두 같은 폴더에 있는가?',
      ]} />
    </div>
  );
}

function GitHubPagesDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>3~5단계 Deep Dive</span>
        <h3>GitHub 저장소 만들기 → 파일 올리기 → Pages 활성화</h3>
        <p>
          git 명령어 없이, GitHub 웹사이트에서 드래그 앤 드롭으로 6개 파일을 업로드하고
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
          alt="GitHub Pages 배포 흐름도"
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
          이 URL을 부서 단톡방이나 이메일로 공유하면 누구나 문서 4종을 확인할 수 있습니다.
          핸드폰으로 QR 찍으면 바로 열리는 웹사이트입니다.
        </p>
      </div>

      <p className="case-takeaway">
        핵심은 git 명령어 없이 GitHub 웹 UI만으로 파일 업로드와 Pages 배포가 모두 가능하다는 것입니다.
      </p>
      <VerifyChecklist points={[
        'Repository가 Public으로 생성되었는가?',
        '6개 파일(index.html, sop.html, defect-report.html, checklist.html, parameter-guide.html, README.md)이 모두 업로드되었는가?',
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
        <strong>나만의 문서 프롬프트 생성기</strong>
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
        <strong>지금 바로 해보기 — Gemini로 문서 4종 만들고 GitHub Pages 배포</strong>
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
            <span className="header-tag">Gemini 문서 4종 & GitHub Pages 배포</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Ch.12 Gemini로 제조업 문서 4종 만들어 GitHub Pages에 배포</h1>
          <p className="subtitle">오늘 12강이 끝나면 인터넷에서 실제로 열리는 URL이 하나 생깁니다. 핸드폰으로 QR 찍으면 바로 열리는 웹사이트. 그 안에 SOP, 불량 분석 보고서, 점검 체크리스트, 공정 파라미터 가이드 4종이 들어있습니다.</p>
          <div className="lesson-meta" aria-label="lesson summary">
            <span>코딩 거의 제로</span>
            <span>AI가 HTML 생성</span>
            <span>우리는 저장+올리기만</span>
            <span>결과물: 문서 4종 웹사이트</span>
          </div>
        </motion.div>
        <LectureImage
          src="panel1.png"
          alt="Gemini로 문서 4종을 HTML로 만들고 GitHub Pages에 배포하는 전체 흐름입니다."
          caption="Gemini로 HTML 문서 4종 생성 → GitHub 업로드 → Pages 배포 → URL 공유"
        />
      </header>

      <main>
        {/* ── Section 01: 오프닝 ──────────────────────────────── */}
        <section className="overview-section">
          <span className="section-label">01. 오프닝</span>
          <h2>코딩 거의 제로, AI가 HTML 생성, 우리는 저장+올리기만</h2>
          <p className="section-intro">
            오늘 12강이 끝나면 인터넷에서 실제로 열리는 URL이 하나 생깁니다.
            핸드폰으로 QR 찍으면 바로 열리는 웹사이트입니다.
            그 안에 SOP, 불량 분석 보고서, 점검 체크리스트, 공정 파라미터 가이드 4종이 들어있습니다.
            회사명/부서명/파라미터를 바꾸면 내일 당장 쓸 수 있는 업무 도구가 됩니다.
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
          <div className="lesson-timeline" aria-label="5단계 진행표">
            {lessonFlow.map((item) => (
              <div className="timeline-step" key={item.label}>
                <strong>{item.time}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <TimeComparisonTable />
        </section>

        {/* ── Section 02: 1단계 — Gemini에서 문서 4종 HTML 생성 ── */}
        <section className="definition-section">
          <span className="section-label">02. 1단계 — Gemini에서 문서 4종 HTML 생성</span>
          <h2>프롬프트 4개로 SOP, 불량 보고서, 점검표, 공정 가이드 완성</h2>
          <p className="section-intro">
            gemini.google.com에 접속하여 문서별 프롬프트를 입력합니다.
            Gemini가 SOP, 불량 분석 보고서(Chart.js 포함), 설비 점검 체크리스트(인터랙티브),
            공정 파라미터 가이드를 각각 HTML 파일로 생성합니다.
          </p>
          <div className="one-line-definition inline-definition">
            <span>한 문장 정의</span>
            <strong>Gemini는 업무 문서를 설명하면 반응형 HTML을 자동으로 만들어주는 AI입니다. 코딩은 거의 제로!</strong>
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

          {/* Practice cards for all 4 document types */}
          <div className="scenario-grid" style={{ marginTop: '2rem' }}>
            {documentTypes.map((item) => {
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
                  <p className="scenario-before">{item.field} 분야 — {item.docType}</p>
                  <div className="intent-box">
                    <span>Gemini 프롬프트</span>
                    <p>{item.prompt}</p>
                  </div>
                  <p className="scenario-output">핵심: {item.cause}</p>
                </motion.div>
              );
            })}
          </div>

          <GeminiReportDeepDive />
        </section>

        {/* ── Section 03: 2단계 — index.html + README.md ──────── */}
        <section>
          <span className="section-label">03. 2단계 — index.html + README.md (총 6개 파일)</span>
          <h2>GitHub Pages 배포에 필요한 파일을 Gemini가 만들어줍니다</h2>
          <p className="section-intro">
            GitHub Pages는 index.html을 첫 페이지로 인식합니다. 문서 4종으로 연결되는 index.html과
            저장소를 설명하는 README.md를 Gemini에게 요청합니다. 총 6개 파일이 준비됩니다.
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

        {/* ── Section 04: 3~5단계 — GitHub 저장소 → 파일 올리기 → Pages ── */}
        <section>
          <span className="section-label">04. 3~5단계 — GitHub 저장소 만들기 → 파일 올리기 → Pages 활성화 → URL</span>
          <h2>git 명령어 없이 웹 브라우저에서 배포 완료</h2>
          <p className="section-intro">
            GitHub 웹사이트에서 드래그 앤 드롭으로 6개 파일을 업로드하고,
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

        {/* ── Section 05: Quality Gate & 마무리 ─────────────────── */}
        <section className="workshop-section teaching-section">
          <span className="section-label">05. Quality Gate & 마무리</span>
          <h2>실습: 내 설비의 <mark>문서 프롬프트</mark> 만들기</h2>
          <p className="section-intro">
            본인 담당 설비의 정보를 입력하면 Gemini 프롬프트가 자동 생성됩니다.
            복사해서 gemini.google.com에 바로 붙여넣으세요.
            회사명/부서명/파라미터를 바꾸면 내일 당장 쓸 수 있는 업무 도구가 됩니다.
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

          <h2 style={{ marginTop: '3rem' }}>배포 전, 이 5가지만 확인하세요</h2>
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
            <h3>"코딩 거의 제로, AI가 HTML 생성, 우리는 저장+올리기만. 회사명/부서명/파라미터를 바꾸면 내일 당장 쓸 수 있는 업무 도구입니다."</h3>
            <p>다음 강의: 하이테크 물리 & 공정 시뮬레이터 제작 (13강)</p>
          </div>
          <NextLecturePreview />
        </section>

        {/* ── Professional Point ──────────────────────────────── */}
        <section className="professional-point">
          <div className="highlight-box" style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '24px' }}>
            <h3>Advanced Process Engineering Point</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '1rem', fontSize: '1.1rem' }}>
              "SOP, 불량 보고서, 점검표, 공정 가이드 — 이 4종 문서에 8시간을 쓰면 그만큼 공정 개선에 쓸 시간이 줄어듭니다.
              Gemini로 15분에 만들고, 남은 시간에 진짜 분석을 더 깊이 하세요.
              GitHub Pages URL 하나면 부서 전체가 실시간으로 확인할 수 있습니다.
              핸드폰으로 QR 찍으면 바로 열리는 웹사이트입니다."
            </p>
            <div className="point-strip">
              <span><Sparkles size={16} /> Gemini = 문서 4종 자동화</span>
              <span><Globe size={16} /> Pages = 무료 웹 배포</span>
              <span><Share2 size={16} /> URL = 즉시 공유</span>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer>
        <p>&copy; 2026 Gemini 문서 4종 & GitHub Pages for Fine Tech Engineering | LettUin Edu</p>
      </footer>
    </div>
  );
}
