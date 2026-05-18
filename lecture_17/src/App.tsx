import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Briefcase,
  Check,
  CheckCircle2,
  Code,
  Copy,
  FileText,
  Github,
  Lightbulb,
  Linkedin,
  Mail,
  MessageSquare,
  Quote,
  Rocket,
  Star,
  Target,
  Trophy,
  Users,
  Wrench,
} from 'lucide-react';

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}${filename}`;

// ============================================================================
// DATA ARRAYS - Technical Interview & Pitching
// ============================================================================

const learningGoals = [
  {
    step: '학습목표 1',
    title: '기술 면접 예상 질문 답변 설계',
    body: '13~16강 프로젝트를 기반으로 10대 예상 질문에 대한 핵심 답변 스크립트를 설계합니다.',
    type: 'api',
  },
  {
    step: '학습목표 2',
    title: '3분 프로젝트 피칭 스크립트',
    body: '문제 → 솔루션 → 데모 → 차별화의 4단 구조로 면접관 머릿속에 박히는 피칭을 만듭니다.',
    type: 'knowledge',
  },
  {
    step: '학습목표 3',
    title: 'STAR 기법으로 인성 면접 통과',
    body: 'Situation·Task·Action·Result 4단 구조로 협업·실패·지원동기 답변을 정리합니다.',
    type: 'deploy',
  },
];

const lessonFlow = [
  { time: '3분', label: '목표 확인' },
  { time: '7분', label: '취업 프로세스' },
  { time: '8분', label: '실무 사례' },
  { time: '17분', label: '피칭·STAR 실습' },
  { time: '5분', label: '체크리스트' },
];

const roleFlow = [
  { owner: '지원자', task: 'GitHub 정비, 자기소개서 작성, 데모 시연' },
  { owner: '포트폴리오', task: '13~16강 프로젝트 4종, README, 실행 영상' },
  { owner: '면접관', task: '기술 깊이 검증, 협업 능력 평가, 컬처 핏 확인' },
  { owner: '합격', task: '서류 → 기술 → 실무 → 최종 4단계 통과' },
];

const interviewStages = [
  {
    icon: FileText,
    title: '서류 전형',
    description: 'GitHub 포트폴리오, README 완성도, 실행 가능 코드가 핵심입니다.',
    features: ['README 잘 정리', '실행 캡처/영상', '커밋 히스토리'],
    cost: '통과율 80%',
    freeQuota: '핵심: 정량적 성과',
  },
  {
    icon: Code,
    title: '기술 면접',
    description: '프로젝트 설명과 코딩 테스트를 통해 기술적 깊이를 확인합니다.',
    features: ['Gemini API 원리', '아키텍처 설명', '코딩 라이브'],
    cost: '합격률 60%',
    freeQuota: '핵심: Why에 집중',
  },
  {
    icon: Users,
    title: '실무 면접',
    description: '문제 해결력과 협업 경험을 실제 사례로 증명하는 단계입니다.',
    features: ['STAR 답변', '갈등 해결 사례', '실패와 배움'],
    cost: '합격률 50%',
    freeQuota: '핵심: 데이터 근거',
  },
  {
    icon: Trophy,
    title: '최종 합격',
    description: '열정·성장 가능성·컬처 핏을 종합적으로 평가하는 임원 면접입니다.',
    features: ['지원 동기', '5년 후 계획', '회사 이해도'],
    cost: '최종 30%',
    freeQuota: '핵심: 회사 맞춤화',
  },
];

const fieldScenarios = [
  {
    icon: Briefcase,
    title: '반도체: 공정 자동화 직무',
    before: '"Gemini API로 수율 데이터 분석을 자동화한 경험이 있나요?"',
    intent: '13강 데이터 분석 + 14강 Vision 검사 프로젝트를 묶어 "현장 8시간 → 5분"으로 정량 답변.',
    output: '면접관이 곧바로 실무 적용 가능성을 인지 → 추가 질문이 깊어짐',
  },
  {
    icon: Star,
    title: '디스플레이: 품질 검사 직무',
    before: '"육안 검사를 AI로 대체할 수 있다고 생각하나요?"',
    intent: '14강 Vision 검사 99.5% 정확도 결과를 보여주고, 한계와 보완책을 함께 설명.',
    output: '단순 도구 사용자가 아닌 "기술 한계를 이해하는 엔지니어"로 인식',
  },
  {
    icon: Target,
    title: '배터리: 모니터링 시스템 직무',
    before: '"실시간 알림은 어떻게 구현했나요?"',
    intent: '15강 시계열 예측 + 16강 멀티채널 알림을 한 화면 데모로 시연.',
    output: '"바로 우리 팀에 투입해도 되겠다"는 인상 → 처우 협상 우위',
  },
];

const pitchSteps = [
  { step: '1', title: '문제 정의 (30초)', body: '숫자로 심각성 전달 — 8시간/85%/연 수억', duration: '30초' },
  { step: '2', title: '솔루션 제시 (60초)', body: 'Gemini Vision + Prophet + 알림 통합', duration: '60초' },
  { step: '3', title: '데모 시연 (60초)', body: '실제 동작 화면 — 이미지/예측/알림', duration: '60초' },
  { step: '4', title: '차별화 (30초)', body: '단일 기능 아닌 통합, 오픈소스 공개', duration: '30초' },
];

const intentChecklist = [
  '기술 면접 예상 질문 10개에 대한 답변이 준비되었는가?',
  '3분 피칭 스크립트가 문제·솔루션·데모·차별화 4단 구조인가?',
  'STAR 기법으로 협업·실패·지원동기 답변을 정리했는가?',
  'GitHub README와 실행 영상이 누구든 따라할 수 있게 정리되었는가?',
  '모의 면접을 3회 이상 연습하고 녹화·피드백을 받았는가?',
];

const technicalVerifyPoints = [
  '예상 질문 10개에 대한 답변이 30초 이내로 압축되었는가?',
  '"왜(Why)" 그 기술을 선택했는지 근거가 명확한가?',
  '실패 경험과 개선 과정을 솔직하게 공유할 준비가 되었는가?',
];

const pitchVerifyPoints = [
  '3분 안에 4단계가 모두 들어가는가?',
  '각 단계마다 숫자/그래프 등 정량 증거가 붙어 있는가?',
  '실제 동작하는 데모 화면이 준비되었는가?',
];

const behavioralVerifyPoints = [
  '협업/실패/지원동기 답변이 STAR 구조로 정리되었는가?',
  '회사별 맞춤 지원동기가 1문단 이상 작성되었는가?',
  '예상 꼬리 질문에 대한 추가 근거 자료가 있는가?',
];

const careerComparison = [
  { model: 'AI 포트폴리오 (13~17강)', price: '40시간 학습', context: '실행 가능 프로젝트 4종', free: 'GitHub 공개', score: 95 },
  { model: '학과 수업 + 자격증', price: '학기 2개', context: '이론 중심', free: '수료증', score: 65 },
  { model: '튜토리얼 따라하기', price: '주말 3회', context: '복붙 코드', free: 'README 없음', score: 40 },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function GoalVisual({ type }: { type: string }) {
  if (type === 'api') {
    return (
      <div className="goal-visual definition">
        <div className="visual-item person">
          <MessageSquare size={18} />
          <span>Q10</span>
        </div>
        <ArrowRight size={14} className="visual-arrow" />
        <div className="visual-item ai">
          <CheckCircle2 size={18} />
          <span>Answer</span>
        </div>
      </div>
    );
  }
  if (type === 'knowledge') {
    return (
      <div className="goal-visual elements">
        <div className="element-tag">문제</div>
        <div className="element-tag">솔루션</div>
        <div className="element-tag">데모</div>
      </div>
    );
  }
  if (type === 'deploy') {
    return (
      <div className="goal-visual field">
        <div className="field-icons">
          <div className="f-icon"><Users size={18} /></div>
          <div className="f-icon"><Award size={18} /></div>
        </div>
        <div className="success-indicator">
          <CheckCircle2 size={12} />
          <span>합격</span>
        </div>
      </div>
    );
  }
  return null;
}

function CareerChart() {
  const max = Math.max(...careerComparison.map((item) => item.score));

  return (
    <div className="visual-card">
      <div className="visual-header">
        <span>준비 경로 비교</span>
        <strong>면접 합격 점수</strong>
      </div>
      <div className="bar-chart" role="img" aria-label="취업 준비 경로 비교 차트">
        {careerComparison.map((item) => (
          <div className="bar-row" key={item.model}>
            <span>{item.model}</span>
            <div>
              <i style={{ width: `${(item.score / max) * 100}%` }} />
            </div>
            <strong>{item.score}</strong>
          </div>
        ))}
      </div>
      <p>실행 가능한 프로젝트 4종을 가진 지원자는 이론 중심·튜토리얼 따라하기와 명확히 구분됩니다.</p>
    </div>
  );
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

function VerifyChecklist({ points }: { points: string[] }) {
  return (
    <div className="verify-checklist">
      <span>면접 검증 포인트</span>
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

function TechnicalInterviewDeepDive() {
  const questions = [
    { q: 'Gemini API를 선택한 이유는?', a: '멀티모달 지원(텍스트+이미지), 무료 티어, 최신 AI 모델' },
    { q: 'Vision API 검사 정확도는?', a: '테스트 99.5% — 육안 85% 대비 +14%p, 표준편차 1.2%' },
    { q: 'Prophet을 쓴 이유는?', a: '계절성 자동 감지, Facebook 제공, 적은 데이터에서도 안정적' },
    { q: '실시간 알림 구현은?', a: 'SMTP + Slack API + Twilio SMS 멀티채널 통합' },
    { q: '데이터 보안 처리는?', a: '.env 분리, GitHub Secrets, API 키 암호화 저장' },
  ];

  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 01 Deep Dive</span>
        <h3>기술 면접: 13~16강 프로젝트를 어떻게 30초 답변으로 압축할까</h3>
        <p>
          면접관은 30초 안에 "이 사람이 이해하고 만든 건지" 판단합니다. 예상 질문 10개를
          뽑아 "결론 → 근거 숫자 → 한계" 3박자 구조로 답변을 미리 설계합니다.
        </p>
        <LectureImage
          src="lecture-17-interview-pitch.png"
          alt="기술 면접 예상 질문 10개와 30초 답변 구조를 정리한 표"
          caption="질문은 다양해 보이지만 결국 '왜 그 기술을 골랐는가'와 '얼마나 잘 동작하는가' 두 축으로 모입니다."
        />
      </div>

      <div className="yield-case-compare vertical-case-flow" aria-label="기술 면접 Before Prompt After">
        <article className="yield-case-panel manual-panel">
          <span>Before: 떨면서 즉답</span>
          <h4>면접장에서 처음 듣는 듯이 횡설수설</h4>
          <ul>
            <li>"그냥 튜토리얼 따라 했어요" — 즉시 감점</li>
            <li>기술 용어만 나열, Why가 없음</li>
            <li>숫자 없이 "잘 작동했어요" 수준 답변</li>
            <li>실패 경험을 숨기다 꼬리 질문에서 무너짐</li>
          </ul>
          <div className="mini-excel dense-excel">
            <strong>흔한 실수 패턴</strong>
            <div style={{ padding: '1rem', background: '#f5f5f7', borderRadius: '8px', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                1. 결론 없이 배경부터 늘어놓기<br/>
                2. 숫자/그래프 없는 정성적 답변<br/>
                3. 한계를 모르는 듯한 자신감<br/>
                4. README 없는 GitHub 링크<br/>
                5. 실행 안 되는 코드 시연
              </p>
            </div>
          </div>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: 답변 설계 지시</span>
          <h4>예상 질문 10개를 뽑고 30초 답변을 미리 설계합니다</h4>
          <p>
            "13~16강 프로젝트를 검토하고 면접관이 던질 만한 기술 질문 10개를 추출해줘.
            각 질문에 대해 결론 1줄 → 핵심 근거 숫자 1개 → 한계와 보완책 1줄
            3박자 구조의 30초 답변 스크립트를 만들어줘."
          </p>
          <div className="aoi-rule-grid sensor-rule-grid">
            <div><strong>결론</strong><span>한 문장으로 단정</span></div>
            <div><strong>근거</strong><span>정량 숫자 1개</span></div>
            <div><strong>한계</strong><span>스스로 인지 표현</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: 30초 답변 모음</span>
          <h4>면접관 머리에 그대로 박히는 압축 답변 5선</h4>
          <div className="code-preview-box">
            <div className="visual-header">
              <span>Top 5 Q&amp;A</span>
              <strong>30초 답변</strong>
            </div>
            <div style={{ padding: '1rem', background: '#f0f7ff', borderRadius: '8px', border: '1px solid #d1e7ff' }}>
              <ol style={{ paddingLeft: '1.25rem', lineHeight: '1.8' }}>
                {questions.map((item) => (
                  <li key={item.q}>
                    <strong>{item.q}</strong>
                    <p style={{ fontSize: '0.9rem', color: '#0071e3', marginTop: '0.25rem' }}>
                      → {item.a}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="aoi-impact-strip sensor-impact-strip">
            <div><strong>30초</strong><span>답변 길이 고정</span></div>
            <div><strong>+숫자</strong><span>모든 답변 정량 근거</span></div>
            <div><strong>한계 인지</strong><span>신뢰 가산점</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 "많이 아는 것"이 아니라 "30초 안에 결론·근거·한계를 정리할 수 있는가"입니다.
        면접관은 깊이가 아니라 구조화 능력을 봅니다.
      </p>
      <VerifyChecklist points={technicalVerifyPoints} />
    </div>
  );
}

function ProjectPresentationDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 02 Deep Dive</span>
        <h3>프로젝트 피칭: 3분 안에 면접관 머리에 박는 4단 스크립트</h3>
        <p>
          15분 발표가 아니라 3분 엘리베이터 피칭입니다. 문제(30초) → 솔루션(60초) →
          데모(60초) → 차별화(30초) 4단 구조로 모든 숫자가 정해진 위치에 들어갑니다.
        </p>
        <LectureImage
          src="lecture-17-interview-pitch.png"
          alt="3분 피칭의 문제·솔루션·데모·차별화 4단 구조를 시간 라인으로 정리한 도식"
          caption="시간 박스를 미리 정해두고 각 박스에 들어갈 숫자·문장을 채우면 떨림이 줄어듭니다."
        />
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: 15분 발표 그대로</span>
          <h4>학교 PPT를 면접장에 그대로 들고 오는 실수</h4>
          <ul>
            <li>배경 설명에 1분 30초 — 결론이 늦음</li>
            <li>모든 슬라이드를 읽음 — 면접관 흥미 이탈</li>
            <li>데모 없이 스크린샷만 — 실제 동작 의심</li>
            <li>차별화 포인트가 없어 "그래서 너 뭐가 다른데?" 질문</li>
            <li>3분 초과로 면접관이 끊음</li>
          </ul>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: 4단 스크립트 지시</span>
          <h4>각 단계의 시간·문장·숫자를 미리 고정합니다</h4>
          <p>
            "13~16강 통합 프로젝트를 3분 안에 피칭하는 스크립트를 만들어줘.
            문제(30초, 정량 숫자 2개 포함) → 솔루션(60초, 핵심 기술 3개) →
            데모(60초, 화면 흐름 묘사) → 차별화(30초, 경쟁 대비 1문장)
            구조로 각 문장을 그대로 외울 수 있는 형태로 써줘."
          </p>
          <div className="aoi-rule-grid">
            <div><strong>30초</strong><span>문제 정의 + 정량 손실</span></div>
            <div><strong>60+60초</strong><span>솔루션 + 데모 시연</span></div>
            <div><strong>30초</strong><span>차별화 한 문장</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: 외워서 쓰는 4단 스크립트</span>
          <h4>3분 안에 60배 속도, 99.5% 정확도, 90% 비용 절감이 전달됩니다</h4>
          <div className="notebooklm-result-box">
            <div className="visual-header">
              <span>Pitch Script</span>
              <strong>3분 고정 분량</strong>
            </div>
            <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <p style={{ fontSize: '0.92rem', marginBottom: '0.75rem' }}>
                <strong>① 문제 (30초)</strong> — "제조 현장 이미지 검사 하루 8시간, 정확도 85%.
                연간 수억 원 손실."
              </p>
              <p style={{ fontSize: '0.92rem', marginBottom: '0.75rem' }}>
                <strong>② 솔루션 (60초)</strong> — "Gemini Vision API + Prophet + 멀티채널 알림.
                0.5초 검사, 99.5% 정확도, 15분 전 이상 예측."
              </p>
              <p style={{ fontSize: '0.92rem', marginBottom: '0.75rem' }}>
                <strong>③ 데모 (60초)</strong> — "CSV 업로드 → 그래프 자동 생성 → 이상 알림.
                지금 화면 공유하겠습니다."
              </p>
              <p style={{ fontSize: '0.92rem' }}>
                <strong>④ 차별화 (30초)</strong> — "단일 기능 솔루션과 달리 분석·검사·예측·알림을
                하나로 통합하고 GitHub 오픈소스로 공개했습니다."
              </p>
            </div>
          </div>
          <div className="aoi-impact-strip">
            <div><strong>60배</strong><span>검사 속도</span></div>
            <div><strong>99.5%</strong><span>정확도</span></div>
            <div><strong>90% ↓</strong><span>비용 절감</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 "모든 걸 보여주기"가 아니라 "면접관이 기억할 3개 숫자"를 남기는 것입니다.
        60배·99.5%·90%처럼 단순한 수치가 가장 오래 남습니다.
      </p>
      <VerifyChecklist points={pitchVerifyPoints} />
    </div>
  );
}

function BehavioralInterviewDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 03 Deep Dive</span>
        <h3>인성 면접: STAR 기법으로 협업·실패·지원동기 정리</h3>
        <p>
          Situation·Task·Action·Result 4단 구조로 답변을 미리 작성해두면, 어떤 인성 질문이
          나와도 같은 골격에 살만 바꿔 끼우면 됩니다.
        </p>
        <LectureImage
          src="lecture-17-interview-pitch.png"
          alt="STAR 기법의 4단 구조와 협업/실패/지원동기 답변 예시를 정리한 인포그래픽"
          caption="질문은 다양해도 STAR 4박자 골격에 1~2문장씩만 채우면 끝납니다."
          variant="poster"
        />
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: 즉흥 인성 답변</span>
          <h4>"음... 그게..."로 시작하는 두서없는 이야기</h4>
          <ul>
            <li>상황 설명만 2분 — 결과를 못 들음</li>
            <li>본인 행동이 모호 — "팀이 잘했어요"</li>
            <li>결과의 정량 효과가 없음</li>
            <li>지원동기가 "성장하고 싶어서" 수준</li>
            <li>회사를 안 봤다는 게 티남</li>
          </ul>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: STAR 답변 설계</span>
          <h4>3개 시나리오 × STAR 4단 = 12개 문장만 외웁니다</h4>
          <p>
            "협업 갈등 / 실패 경험 / 지원 동기 3가지 인성 질문에 대해
            STAR (Situation, Task, Action, Result) 4단 구조로 답변을 만들어줘.
            각 단계는 한 문장씩이며, Result에는 정량 숫자가 반드시 포함되어야 해.
            13~16강 프로젝트 경험을 근거로 사용해줘."
          </p>
          <div className="aoi-rule-grid sensor-rule-grid">
            <div><strong>S</strong><span>상황 — 한 문장</span></div>
            <div><strong>T·A</strong><span>임무·행동 — 두 문장</span></div>
            <div><strong>R</strong><span>결과 — 정량 숫자</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: STAR 답변 3종 세트</span>
          <h4>협업·실패·지원동기 답변이 30초씩 정리됩니다</h4>
          <div className="firebase-result-box">
            <div className="visual-header">
              <span>STAR Script</span>
              <strong>3종 세트</strong>
            </div>
            <div style={{ padding: '1rem', background: '#f0f7ff', borderRadius: '8px', border: '1px solid #d1e7ff' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                <strong>Q. 팀 갈등 경험?</strong><br/>
                <span style={{ color: '#555' }}>
                  (S) 프로젝트 방향 의견 차이 → (T) 중재자 역할 → (A) 데이터로 비교 분석 →
                  <strong style={{ color: '#0071e3' }}> (R) 합의 도출, 3일 단축</strong>
                </span>
              </p>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                <strong>Q. 실패 경험?</strong><br/>
                <span style={{ color: '#555' }}>
                  (S) Vision 정확도 60% → (T) 90% 목표 → (A) 프롬프트 100회 튜닝 →
                  <strong style={{ color: '#0071e3' }}> (R) 99.5% 달성</strong>
                </span>
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                <strong>Q. 지원 동기?</strong><br/>
                <span style={{ color: '#555' }}>
                  반도체 스마트 팩토리 선도 기업 → 13~16강 현장 적용 가능 AI 시스템 보유 →
                  귀사 공정 자동화에 즉시 기여 가능
                </span>
              </p>
            </div>
          </div>
          <div className="aoi-impact-strip sensor-impact-strip">
            <div><strong>30초/답변</strong><span>3종 골격 외우기</span></div>
            <div><strong>정량 결과</strong><span>모든 답변에 숫자</span></div>
            <div><strong>회사 맞춤</strong><span>지원동기 1문단</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 "솔직함"과 "정량성"입니다. 실패를 숨기지 않되, 그 실패가 어떤 숫자로 회복되었는지
        보여주는 사람을 면접관은 신뢰합니다.
      </p>
      <VerifyChecklist points={behavioralVerifyPoints} />
    </div>
  );
}

function InteractiveWorkshop() {
  const [fields, setFields] = useState({
    problem: '',
    solution: '',
    differentiator: '',
  });
  const [copied, setCopied] = useState(false);

  const hasContent = Object.values(fields).some(Boolean);

  const generated = hasContent
    ? `[3분 피칭 스크립트 초안]

① 문제 (30초): ${fields.problem || '[정량 손실 숫자 2개]'}
② 솔루션 (60초): ${fields.solution || '[핵심 기술 3개 + 정확도/속도]'}
③ 데모 (60초): 실제 화면 공유 + 입력→처리→결과 흐름
④ 차별화 (30초): ${fields.differentiator || '[경쟁 대비 1문장]'}

→ 면접관에게 남길 3개 숫자를 마지막에 한 번 더 반복`
    : '';

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const inputRows: { key: keyof typeof fields; label: string; placeholder: string }[] = [
    { key: 'problem', label: '문제 정의 (정량 숫자 2개)', placeholder: '예: 검사 하루 8시간, 정확도 85%, 연 수억 손실' },
    { key: 'solution', label: '솔루션 (핵심 기술 + 성과 숫자)', placeholder: '예: Gemini Vision 0.5초 검사, 99.5% 정확도, 60배 향상' },
    { key: 'differentiator', label: '차별화 (한 문장)', placeholder: '예: 분석·검사·예측·알림을 하나로 통합한 오픈소스' },
  ];

  return (
    <div className="interactive-workshop">
      <div className="iw-header">
        <FileText size={22} color="var(--accent)" />
        <strong>3분 피칭 스크립트 빌더</strong>
        <p>문제·솔루션·차별화 3가지만 채우면 4단 스크립트 초안이 자동 완성됩니다.</p>
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
            <Lightbulb size={18} color="var(--accent)" />
            <strong>피칭 스크립트 초안</strong>
          </div>
          <div className={`iw-generated-text ${hasContent ? 'active' : ''}`}>
            {generated || '위 3가지를 입력하면\n3분 피칭 스크립트가 생성됩니다.'}
          </div>
          <button
            className={`iw-copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            disabled={!hasContent}
          >
            {copied
              ? <><Check size={15} />복사됨!</>
              : <><Copy size={15} />스크립트 복사</>}
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
        <Rocket size={18} color="var(--accent)" />
        <strong>지금 바로 해보기 — 3분 피칭 4단 타임박스</strong>
      </div>
      <div className="frg-steps">
        {pitchSteps.map((item) => (
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

function GraduationCard() {
  return (
    <div className="next-lecture-card">
      <div className="nlc-header">
        <span>수료 안내</span>
        <h3>13~17강 전 과정을 완료했습니다 — 이제 면접장으로</h3>
        <p>
          13강 데이터 분석부터 17강 면접 전략까지 — 4종의 실행 가능한 AI 프로젝트와
          기술/피칭/인성 답변 시나리오를 갖췄습니다. GitHub Public 공개 → LinkedIn
          업데이트 → 1주일 내 첫 지원서 제출을 권장합니다.
        </p>
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
            <span className="header-tag">포트폴리오를 무기로 취업 성공</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Ch.17 기술 면접 &amp; 실무 피칭 전략</h1>
          <p className="subtitle">13~16강 AI 프로젝트를 무기로 반도체·디스플레이·배터리·바이오 기업 면접을 통과합니다</p>
          <div className="lesson-meta" aria-label="lesson summary">
            <span>40분</span>
            <span>실습 중심</span>
            <span>면접 스크립트</span>
            <span>결과물: 3분 피칭 + STAR 답변</span>
          </div>
        </motion.div>
      </header>

      <main>
        <section className="overview-section">
          <span className="section-label">01. 오프닝 및 학습목표</span>
          <h2>오늘 여러분은 <mark>면접 답변 스크립트</mark>를 들고 면접장에 들어갈 준비를 마칩니다</h2>
          <p className="section-intro">
            기술 질문 10개, 3분 피칭 4단 스크립트, STAR 인성 답변 3종을 완성합니다.
            "튜토리얼 따라 했어요" 지원자와 명확히 구분되는 무기를 확보합니다.
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
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
            <img
              src={assetUrl('lecture-17-interview-pitch.png')}
              alt="면접 피칭 코믹"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          </div>
        </section>

        <section className="definition-section">
          <span className="section-label">02. 기술 면접 &amp; 피칭이란?</span>
          <h2>면접은 "많이 아는 사람"이 아니라 <mark>구조화해서 30초에 전달하는 사람</mark>을 뽑습니다</h2>
          <p className="section-intro">
            서류 → 기술 → 실무 → 최종 4단계 모두에서 같은 원리가 작동합니다.
            결론을 먼저, 정량 근거를 다음, 한계 인지를 마지막에 — 이 골격에 답변을 맞추면
            튜토리얼 추종자가 아닌 엔지니어로 인식됩니다.
          </p>
          <div className="one-line-definition inline-definition">
            <span>한 문장 정의</span>
            <strong>기술 면접 &amp; 피칭은 13~16강 프로젝트를 정량 숫자 3개로 압축해 30초~3분 분량의 스크립트로 전달하는 기술입니다.</strong>
          </div>
          <LectureImage
            src="interview-pitch-overview.png"
            alt="문제, 데이터, AI 워크플로우, 결과, 임팩트를 면접 피칭 구조로 정리한 다이어그램"
            caption="문제·데이터·워크플로우·결과·임팩트 5단 흐름 — 피칭과 면접 답변이 같은 골격을 공유합니다."
          />
          <div className="role-flow" aria-label="취업 프로세스 역할 분리">
            {roleFlow.map((item, index) => (
              <div className="role-step" key={`${item.owner}-${item.task}`}>
                <span>{item.owner}</span>
                <strong>{item.task}</strong>
                {index < roleFlow.length - 1 && <ArrowRight size={22} />}
              </div>
            ))}
          </div>
          <div className="scenario-grid">
            {interviewStages.map((item) => {
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
                  <p className="scenario-before">{item.description}</p>
                  <div className="intent-box">
                    <span>준비 포인트</span>
                    <ul style={{ paddingLeft: '1.2rem', margin: '0.5rem 0 0 0' }}>
                      {item.features.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  </div>
                  <p className="scenario-output">{item.cost} / {item.freeQuota}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="coding-compare-grid" style={{ marginTop: '3rem' }}>
            <motion.article
              className="coding-compare-card traditional"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <img src={assetUrl('lecture-17-interview-pitch.png')} alt="전통적인 면접 준비" />
              <div className="compare-content">
                <span className="compare-kicker">Traditional (자기소개서 중심)</span>
                <h3>이력서·자소서·자격증 위주의 막연한 준비</h3>
                <p>
                  학과 수업과 자격증, 인턴 경력만으로 자기소개서를 채우다 보면
                  "실제로 뭘 만들 수 있는가" 질문에 흔들립니다.
                </p>
                <ul>
                  <li>증명 가능한 산출물이 없음</li>
                  <li>면접 질문에 이론만 답변</li>
                  <li>GitHub 비어 있음 — 첫인상 감점</li>
                </ul>
              </div>
            </motion.article>

            <motion.article
              className="coding-compare-card vibe"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              <img src={assetUrl('lecture-17-interview-pitch.png')} alt="AI 포트폴리오 기반 면접" />
              <div className="compare-content">
                <span className="compare-kicker">AI Portfolio (13~17강)</span>
                <h3>실행 가능한 AI 프로젝트 4종을 손에 든 지원</h3>
                <p>
                  데이터 분석·이미지 검사·시계열 예측·알림 통합 4종을 GitHub에 공개하고
                  3분 피칭으로 정리하면, 면접관이 먼저 깊이 있는 질문을 던집니다.
                </p>
                <ul>
                  <li>실행 가능한 코드 + README + 영상</li>
                  <li>정량 숫자 3개로 성과 증명</li>
                  <li>STAR 답변 3종으로 인성 면접 대응</li>
                </ul>
              </div>
            </motion.article>
          </div>
        </section>

        <section>
          <span className="section-label">03. 왜 면접 준비가 핵심인가?</span>
          <h2>실력만큼 중요한 것은 "30초 안에 전달하는 구조화 능력"</h2>
          <p className="section-intro">
            같은 13~16강을 들은 두 사람이라도 면접 결과는 정반대일 수 있습니다.
            답변 길이를 30초로 고정하고 숫자 3개를 박는 사람이 합격합니다.
          </p>
          <CareerChart />
          <LectureImage
            src="lecture-17-interview-pitch.png"
            alt="면접 준비 경로별 합격률 비교 인포그래픽"
            caption="AI 포트폴리오 보유자는 학과+자격증 그룹 대비 합격 점수가 약 1.5배 높습니다."
          />
          <div className="highlight-box" style={{ background: '#f5f5f7', borderLeftColor: '#333' }}>
            <p style={{ fontWeight: 700 }}>Target Point:</p>
            <p>"면접관은 가장 똑똑한 사람을 뽑는 것이 아니라, 가장 명확하게 설명할 수 있는 사람을 뽑습니다."</p>
          </div>
        </section>

        <section>
          <span className="section-label">04. 첨단 공정기술 면접 사례</span>
          <h2>반도체·디스플레이·배터리 직무별 면접 질문과 답변 전략</h2>
          <p className="section-intro">
            같은 13~16강 프로젝트라도 직무에 따라 강조점이 달라집니다.
            공정 자동화 직무에는 수율 분석을, 품질 검사 직무에는 Vision 정확도를,
            모니터링 직무에는 실시간 알림을 전면에 배치합니다.
          </p>
          <div className="scenario-grid">
            {fieldScenarios.map((item) => {
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
                  <p className="scenario-before">{item.before}</p>
                  <div className="intent-box">
                    <span>답변 전략</span>
                    <p>{item.intent}</p>
                  </div>
                  <p className="scenario-output">{item.output}</p>
                </motion.div>
              );
            })}
          </div>
          <TechnicalInterviewDeepDive />
          <ProjectPresentationDeepDive />
          <BehavioralInterviewDeepDive />
        </section>

        <section className="workshop-section teaching-section">
          <span className="section-label">05. 미니 워크숍</span>
          <h2>실습: 나만의 <mark>3분 피칭 스크립트</mark> 작성</h2>
          <p className="section-intro">
            13~16강 통합 프로젝트의 문제·솔루션·차별화 3가지만 채우면 4단 스크립트 초안이
            자동으로 만들어집니다. 그 자리에서 소리 내어 3회 읽어보세요.
          </p>
          <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <img
              src={assetUrl('lecture-17-interview-pitch.png')}
              alt="3분 피칭 실습 가이드"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>
          <InteractiveWorkshop />
          <FirstRunGuide />
        </section>

        <section>
          <span className="section-label">06. 검증 체크리스트 &amp; 수료</span>
          <h2>면접장 들어가기 전, 이 5가지만 확인하세요</h2>
          <div className="checklist">
            {intentChecklist.map((item) => (
              <div className="check-item" key={item}>
                <CheckCircle2 size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <LectureImage
            src="interview-pitch-overview.png"
            alt="최종 면접 준비 체크리스트 인포그래픽"
            caption="GitHub README, 데모 영상, 3분 피칭, STAR 답변, 회사 맞춤 지원동기 — 다섯 박스를 채우면 완료입니다."
          />
          <div className="wrap-message">
            <Quote size={36} color="var(--accent)" />
            <h3>"면접은 가장 많이 아는 사람이 아니라, 가장 명확하게 설명할 수 있는 사람을 뽑습니다."</h3>
            <p>13~17강 전 과정을 완료한 여러분 — 이제 지원서를 제출할 시간입니다.</p>
          </div>
          <GraduationCard />
          <div className="scenario-grid" style={{ marginTop: '2rem' }}>
            {[
              { icon: Github, title: 'GitHub Public 공개', desc: '13~16강 프로젝트 4종을 즉시 Public 전환, README + 실행 영상 첨부' },
              { icon: Linkedin, title: 'LinkedIn 업데이트', desc: '프로젝트 링크와 정량 성과(60배·99.5%·90%↓)를 헤드라인에 반영' },
              { icon: Mail, title: '1주일 내 첫 지원', desc: '회사별 맞춤 지원동기 1문단을 붙여 첫 5곳에 지원서 제출' },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div className="scenario-card" key={step.title}>
                  <div className="scenario-icon">
                    <Icon size={24} />
                  </div>
                  <h3>{step.title}</h3>
                  <p className="scenario-before">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="professional-point">
          <div className="highlight-box" style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '24px' }}>
            <h3>Advanced Process Engineering Point</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '1rem', fontSize: '1.1rem' }}>
              "면접은 13~16강의 결과물을 '구조화해서 30초~3분에 전달하는 기술'입니다.
              엔지니어로서의 진짜 실력은 기술 자체가 아니라, 그 기술이 만든 결과를 정량 숫자로
              설명할 수 있느냐에서 갈립니다."<br/>
              포트폴리오는 무기, 스크립트는 사용법 — 두 가지를 함께 갖춰야 합격합니다.
            </p>
            <div className="point-strip">
              <span><Wrench size={16} /> 포트폴리오는 무기</span>
              <span><FileText size={16} /> 스크립트는 사용법</span>
              <span><Trophy size={16} /> 합격은 구조화 능력</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 Career Pitching for Fine Tech Engineering | LettUin Edu</p>
      </footer>
    </div>
  );
}
