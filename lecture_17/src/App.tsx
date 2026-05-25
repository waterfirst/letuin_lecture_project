import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, ArrowRight, Award, Briefcase, Check, CheckCircle2,
  ChevronRight, Code, Copy, ExternalLink, Eye, FileText, Globe,
  Layers, Link2, MessageSquare, Quote, Rocket, Share2, Sparkles,
  Star, Target, Trophy, Users, Zap,
} from 'lucide-react';

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}${filename}`;

// ============================================================================
// DATA ARRAYS
// ============================================================================

const learningGoals = [
  {
    step: '학습목표 1',
    title: '11~16강 프로젝트 맵 정리',
    body: '6개 강의에서 만든 프로젝트를 하나의 스토리라인으로 정리하고, 각 프로젝트의 핵심 성과 수치를 확정합니다.',
    type: 'map',
  },
  {
    step: '학습목표 2',
    title: '기술 면접 + 3분 피칭 설계',
    body: '예상 질문 10개의 30초 답변과, 문제-솔루션-데모-차별화 4단 구조 피칭 스크립트를 완성합니다.',
    type: 'pitch',
  },
  {
    step: '학습목표 3',
    title: 'STAR 기법 인성 면접 준비',
    body: 'Situation-Task-Action-Result 구조로 협업, 실패 극복, 지원 동기 답변을 설계합니다.',
    type: 'star',
  },
];

const lessonFlow = [
  { time: '1단계', label: '11~16강 프로젝트 맵 총정리' },
  { time: '2단계', label: '취업 프로세스 4단계 이해' },
  { time: '3단계', label: '기술 면접 30초 답변 설계' },
  { time: '4단계', label: '3분 프로젝트 피칭 구조' },
  { time: '5단계', label: 'STAR 인성 면접 준비' },
  { time: '6단계', label: '최종 체크리스트 확인' },
];

const roleFlow = [
  { owner: '지원자', task: '포트폴리오 정비, 답변 설계, 피칭 연습' },
  { owner: '포트폴리오', task: '11~16강 프로젝트 6종 + README + 데모 URL' },
  { owner: '면접관', task: '기술 깊이, 문제 해결력, 협업 능력, 컬처 핏 평가' },
];

const projectMap = [
  { lecture: '11강', title: 'AI API 기초', desc: 'Gemini/GPT API 호출, 프롬프트 엔지니어링 기초', tech: 'Python, API', icon: Code },
  { lecture: '12강', title: 'GitHub Pages 배포', desc: '정적 웹 문서 작성 및 GitHub Pages 호스팅', tech: 'HTML, Git', icon: Globe },
  { lecture: '13강', title: 'Streamlit 데이터 분석', desc: 'OLED 증착 공정 데이터 분석 앱 + Streamlit Cloud 배포', tech: 'Streamlit, Pandas, Plotly', icon: Layers },
  { lecture: '14강', title: 'OLED 공진 시뮬레이터', desc: 'Fabry-Perot 공진 기반 R/G/B ITO 두께 최적화', tech: 'Gemini, Recharts, 광학 수식', icon: Eye },
  { lecture: '15강', title: 'Warpage 시뮬레이터', desc: '다층 박막 CTE 불일치 열응력 계산 + 3D 시각화', tech: 'Gemini, Three.js, 고체역학', icon: Zap },
  { lecture: '16강', title: '통합 포트폴리오', desc: '모든 프로젝트를 한 페이지 포트폴리오로 통합 + GitHub Pages 배포', tech: 'HTML, GitHub Pages', icon: Share2 },
];

const interviewStages = [
  { icon: FileText, title: '서류 전형', desc: 'GitHub 포트폴리오 완성도, README, 커밋 히스토리가 핵심. 데모 URL이 있으면 통과율 대폭 상승.', color: '#4285F4' },
  { icon: Code, title: '기술 면접', desc: '"왜 그 기술을 선택했나?" "정확도는?" "한계는?" — 30초 답변 구조: 결론 → 숫자 → 한계.', color: '#34A853' },
  { icon: Users, title: '실무/인성 면접', desc: 'STAR 기법으로 협업 경험, 실패 극복, 갈등 해결 사례를 구조화. 데이터 근거가 핵심.', color: '#FBBC04' },
  { icon: Trophy, title: '최종 면접', desc: '지원 동기, 5년 후 계획, 회사 이해도. 회사별 맞춤 답변 1문단 필수.', color: '#EA4335' },
];

const techQuestions = [
  { q: '이 프로젝트에서 AI를 어떻게 활용했나요?', a: '13강: Gemini API로 공정 데이터 자동 분석, 14강: 시스템 프롬프트로 광학 시뮬레이터 구축, 15강: 열응력 물리 엔진을 AI로 코드 생성' },
  { q: 'Fabry-Perot 공진 조건을 설명해주세요.', a: '2nd cos(theta) = m lambda. ITO 두께(d)와 굴절률(n)이 결정하는 광학 경로 길이가 파장의 정수배일 때 보강 간섭. 시야각(theta)이 커지면 cos 값이 줄어 공진 파장이 이동.' },
  { q: 'Warpage 시뮬레이터의 핵심 수식은?', a: 'kappa = M_thermal / D. 열 모멘트를 굽힘 강성으로 나눈 곡률. CTE 차이가 클수록, 온도 변화가 클수록, 중립축에서 먼 층일수록 많이 휜다.' },
  { q: 'AI가 만든 코드를 어떻게 검증했나요?', a: '14강: 내부 굴절각(Snell law) 적용 여부 확인. 15강: 중립축 위치가 두꺼운 층 쪽인지, Smile/Cry 방향이 CTE 순서와 맞는지 교차 검증.' },
  { q: '포트폴리오를 왜 한 페이지로 통합했나요?', a: '채용 담당자가 URL 4개를 각각 열어보지 않는다. 한 페이지에서 전체 역량을 5분 안에 파악할 수 있게 설계. 16강에서 생성기로 자동 구축.' },
];

const pitchStructure = [
  { phase: '문제 정의', time: '30초', content: '제조 현장에서 ITO 두께 최적화에 2~3일/회 × 수십 회 반복. Warpage 예측은 ANSYS 라이선스 수천만원 필요.', color: '#EA4335' },
  { phase: '솔루션 제시', time: '60초', content: 'Google AI Studio + 3단계 프롬프트로 OLED 공진 시뮬레이터와 Warpage 시뮬레이터를 각각 40분 만에 구축. 무료, 코드 불필요.', color: '#4285F4' },
  { phase: '데모 시연', time: '60초', content: '실제 시뮬레이터 데모: ITO 슬라이더 → 시야각 그래프 실시간 변화. 층 물성치 입력 → 3D 변형 시각화. Streamlit 데이터 대시보드.', color: '#34A853' },
  { phase: '차별화 포인트', time: '30초', content: '단일 기능이 아닌 6개 프로젝트 통합 포트폴리오. 모두 실행 가능한 데모 URL 보유. AI 프롬프트 전략(3단계)을 체계적으로 적용.', color: '#9C27B0' },
];

const starExamples = [
  { type: '협업 경험', s: '13강에서 팀원과 Streamlit 앱을 함께 개발', t: '수율 계산 로직에서 yield_score vs pass_fail 정의 불일치 발생', a: '데이터 명세서를 작성하고 AI 프롬프트에 수율 정의를 명시적으로 포함', r: '계산 오류 0건, 팀 전체가 같은 기준으로 분석 가능' },
  { type: '실패 극복', s: '14강에서 AI가 내부 굴절각을 무시한 코드를 생성', t: '시야각 60도에서 휘도 예측이 실제와 30% 이상 차이', a: 'Snell law 적용 여부를 검증하는 체크 루틴을 추가하고 AI에게 수정 지시', r: '예측 오차 5% 이내로 개선, AI 검증 습관을 모든 프로젝트에 적용' },
  { type: '지원 동기', s: '제조업 현장에서 비싼 시뮬레이션 SW 대신 AI로 대안을 만든 경험', t: '이 역량을 귀사의 공정 최적화/품질 혁신에 적용하고 싶음', a: '11~16강 6개 프로젝트로 AI 활용 능력을 실증', r: '데모 URL로 즉시 검증 가능한 포트폴리오 완성' },
];

const qualityChecklist = [
  '11~16강 프로젝트 6개의 핵심 성과 수치를 말할 수 있는가?',
  '기술 면접 예상 질문 5개에 30초 이내로 답변할 수 있는가?',
  '3분 피칭이 문제-솔루션-데모-차별화 4단 구조로 되어있는가?',
  'STAR 기법으로 협업/실패/지원동기 3개 답변이 준비되었는가?',
  'GitHub 포트폴리오 URL과 모든 데모 링크가 정상 동작하는가?',
  '모의 면접을 최소 1회 이상 연습하고 녹화해봤는가?',
];

const keyMessages = [
  { icon: Layers, text: '면접관은 30초 안에 판단합니다. 결론 먼저, 숫자로 근거, 한계를 솔직히. 이 3박자가 30초 답변의 전부입니다.', color: '#4285F4' },
  { icon: Eye, text: '데모가 곧 실력 증명입니다. "잘했습니다"보다 "여기서 직접 클릭해보세요"가 100배 강력합니다.', color: '#34A853' },
  { icon: AlertTriangle, text: '실패를 숨기지 마세요. "AI가 틀렸고, 제가 잡았습니다"는 "AI를 잘 씁니다"보다 훨씬 강한 답변입니다.', color: '#EA4335' },
];

const deploymentMethods = [
  { lecture: '11강', method: 'API 기초', type: 'Python 스크립트', icon: Code },
  { lecture: '12강', method: 'GitHub Pages', type: '정적 문서', icon: Globe },
  { lecture: '13강', method: 'Streamlit Cloud', type: '데이터 분석 앱', icon: Rocket },
  { lecture: '14강', method: 'AI Studio', type: 'OLED 시뮬레이터', icon: Sparkles },
  { lecture: '15강', method: 'AI Studio', type: 'Warpage 시뮬레이터', icon: Zap },
  { lecture: '16강', method: 'GitHub Pages', type: '통합 포트폴리오', icon: Share2 },
  { lecture: '17강', method: '면접 & 피칭', type: '최종 어필', icon: Trophy },
];

// ============================================================================
// HELPER COMPONENTS (13강 동일 패턴)
// ============================================================================

function GoalVisual({ type }: { type: string }) {
  if (type === 'map') {
    return (<div className="goal-visual elements">
      <div className="element-tag">11강</div><div className="element-tag">12강</div><div className="element-tag">13강</div>
      <div className="element-tag">14강</div><div className="element-tag">15강</div><div className="element-tag">16강</div>
    </div>);
  }
  if (type === 'pitch') {
    return (<div className="goal-visual definition">
      <div className="visual-item person"><MessageSquare size={18} /><span>피칭</span></div>
      <ArrowRight size={14} className="visual-arrow" />
      <div className="visual-item ai"><Trophy size={18} /><span>합격</span></div>
    </div>);
  }
  if (type === 'star') {
    return (<div className="goal-visual field">
      <div className="field-icons"><div className="f-icon"><Users size={18} /></div><div className="f-icon"><Award size={18} /></div></div>
      <div className="success-indicator"><CheckCircle2 size={12} /><span>STAR 답변</span></div>
    </div>);
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

function LectureImage({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (<figure className="lecture-image"><img src={assetUrl(src)} alt={alt} loading="lazy" /><figcaption>{caption}</figcaption></figure>);
}

function VerifyChecklist({ points }: { points: string[] }) {
  return (
    <div className="verify-checklist"><span>최종 체크리스트</span>
      {points.map((point) => (<div className="verify-item" key={point}><CheckCircle2 size={15} /><p>{point}</p></div>))}
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
            <span className="header-tag">11~16강 프로젝트를 면접 무기로 만드는 법</span>
          </motion.div>
        </div>
        <motion.div className="hero-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1>Ch.17 기술 면접 & 피칭: 포트폴리오를 무기로</h1>
          <p className="subtitle">11~16강에서 만든 6개 프로젝트를 기술 면접 답변, 3분 피칭, STAR 인성 면접에 활용하는 전략을 설계합니다.</p>
          <div className="lesson-meta">
            <span>40분</span><span>강의 중심</span><span>면접 전략</span><span>최종 마무리</span>
          </div>
        </motion.div>
      </header>

      <main>
        {/* 01 학습목표 */}
        <section className="overview-section">
          <span className="section-label">01. 오프닝 및 학습목표</span>
          <h2>만든 것을 보여주는 기술: 면접과 피칭</h2>
          <p className="section-intro">코드를 잘 짜는 것과 그걸 설득력 있게 전달하는 것은 별개의 능력입니다. 오늘은 11~16강에서 만든 6개 프로젝트를 면접 무기로 바꿉니다.</p>
          <div className="learning-goals-grid">
            {learningGoals.map((item) => (
              <div className="learning-goal-card" key={item.step}><span>{item.step}</span><h3>{item.title}</h3><p>{item.body}</p>
                <div className="goal-visual-wrapper"><GoalVisual type={item.type} /></div>
              </div>
            ))}
          </div>
          <div className="lesson-timeline">
            {lessonFlow.map((item) => (<div className="timeline-step" key={item.label}><strong>{item.time}</strong><span>{item.label}</span></div>))}
          </div>
        </section>

        {/* 02 프로젝트 맵 */}
        <section className="definition-section">
          <span className="section-label">02. 11~16강 프로젝트 맵</span>
          <h2>6개 강의, 6개 프로젝트, 하나의 스토리</h2>
          <p className="section-intro">면접관에게 "저는 6개 프로젝트를 만들었습니다"가 아니라 "API 기초부터 통합 포트폴리오까지 체계적으로 구축했습니다"로 말해야 합니다.</p>
          <LectureImage src="panel1.png" alt="11~16강 프로젝트 맵" caption="API 기초(11강) → 배포(12강) → 데이터 분석(13강) → 시뮬레이터(14,15강) → 통합(16강)의 성장 스토리" />
          <div className="scenario-grid">
            {projectMap.map((p) => { const Icon = p.icon; return (
              <motion.div className="scenario-card" key={p.lecture} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="scenario-icon"><Icon size={24} /></div>
                <h3>{p.lecture}: {p.title}</h3>
                <p className="scenario-before">{p.desc}</p>
                <p className="scenario-output">{p.tech}</p>
              </motion.div>
            ); })}
          </div>
          <div className="role-flow">
            {roleFlow.map((item, index) => (
              <div className="role-step" key={`${item.owner}-${item.task}`}><span>{item.owner}</span><strong>{item.task}</strong>
                {index < roleFlow.length - 1 && <ArrowRight size={22} />}
              </div>
            ))}
          </div>
        </section>

        {/* 03 취업 프로세스 4단계 */}
        <section>
          <span className="section-label">03. 취업 프로세스 4단계</span>
          <h2>서류 → 기술 면접 → 실무/인성 → 최종</h2>
          <p className="section-intro">각 단계에서 면접관이 보는 포인트가 다릅니다. 우리 프로젝트가 어디서 어떻게 쓰이는지 정리합니다.</p>
          <div className="scenario-grid">
            {interviewStages.map((stage) => { const Icon = stage.icon; return (
              <motion.div className="scenario-card" key={stage.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="scenario-icon" style={{ color: stage.color }}><Icon size={24} /></div>
                <h3>{stage.title}</h3>
                <p className="scenario-before">{stage.desc}</p>
              </motion.div>
            ); })}
          </div>
        </section>

        {/* 04 기술 면접 30초 답변 */}
        <section>
          <span className="section-label">04. 기술 면접: 30초 답변 설계</span>
          <h2>결론(10초) → 숫자 근거(10초) → 한계 인정(10초)</h2>
          <p className="section-intro">면접관은 30초 안에 "이 사람이 이해하고 만든 건지" 판단합니다. 예상 질문별로 3박자 답변을 미리 설계합니다.</p>
          <LectureImage src="panel2.png" alt="30초 답변 구조" caption="결론 먼저 → 숫자로 근거 → 한계를 솔직히. 이 3박자가 기술 면접의 전부입니다." />
          <div className="deep-dive">
            <div className="deep-dive-heading"><span>예상 질문 Top 5</span><h3>11~16강 프로젝트 기반 기술 면접 Q&A</h3></div>
            {techQuestions.map((tq, i) => (
              <div key={i} className="yield-case-compare vertical-case-flow" style={{ marginBottom: '1rem' }}>
                <article className="yield-case-panel manual-panel"><span>Q{i+1}</span><h4>{tq.q}</h4></article>
                <article className="yield-case-panel result-panel"><span>모범 답변</span><p style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>{tq.a}</p></article>
              </div>
            ))}
          </div>
        </section>

        {/* 05 3분 피칭 */}
        <section>
          <span className="section-label">05. 3분 프로젝트 피칭</span>
          <h2>문제(30초) → 솔루션(60초) → 데모(60초) → 차별화(30초)</h2>
          <p className="section-intro">면접관 머릿속에 여러분을 각인시키는 3분. 숫자와 데모가 핵심입니다.</p>
          <LectureImage src="panel3.png" alt="3분 피칭 구조" caption="4단계로 나눠서 시간을 배분하면 3분 안에 모든 것을 전달할 수 있습니다." />
          <div className="deep-dive">
            <div className="deep-dive-heading"><span>피칭 스크립트</span><h3>4단계 3분 피칭 상세 내용</h3></div>
            {pitchStructure.map((ps, i) => (
              <div key={i} style={{ background: '#f5f5f7', borderRadius: '12px', padding: '1.25rem', borderLeft: `4px solid ${ps.color}`, marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ background: ps.color, color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>{ps.time}</span>
                  <strong style={{ fontSize: '1.05rem' }}>{ps.phase}</strong>
                </div>
                <p style={{ fontSize: '0.95rem', color: '#333', lineHeight: '1.7', margin: 0 }}>{ps.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 06 STAR 인성 면접 */}
        <section>
          <span className="section-label">06. STAR 기법 인성 면접</span>
          <h2>Situation → Task → Action → Result</h2>
          <p className="section-intro">인성 면접의 핵심은 "구체적 사례"입니다. 우리 프로젝트 경험에서 STAR 구조를 뽑아냅니다.</p>
          <LectureImage src="panel4.png" alt="STAR 기법" caption="상황(S) → 과제(T) → 행동(A) → 결과(R) 4단계로 모든 인성 질문에 대응" />
          <div className="deep-dive">
            <div className="deep-dive-heading"><span>STAR 답변 예시</span><h3>11~16강 프로젝트 기반 인성 면접 답변 3종</h3></div>
            {starExamples.map((se, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e0e0e0', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h4 style={{ fontSize: '1.1rem', color: '#1a73e8', marginBottom: '1rem' }}>{se.type}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {[{l:'S (상황)',v:se.s,c:'#4285F4'},{l:'T (과제)',v:se.t,c:'#FBBC04'},{l:'A (행동)',v:se.a,c:'#34A853'},{l:'R (결과)',v:se.r,c:'#EA4335'}].map((x) => (
                    <div key={x.l} style={{ padding: '0.75rem', borderLeft: `3px solid ${x.c}`, background: '#f9f9fb', borderRadius: '8px' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: x.c, margin: '0 0 0.25rem' }}>{x.l}</p>
                      <p style={{ fontSize: '0.9rem', color: '#333', margin: 0, lineHeight: '1.5' }}>{x.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 07 핵심 메시지 */}
        <section>
          <span className="section-label">07. 핵심 메시지</span>
          <h2>오늘 기억할 세 가지</h2>
          {keyMessages.map((msg, i) => <KeyMessageBox key={i} icon={msg.icon} text={msg.text} color={msg.color} />)}
        </section>

        {/* 08 품질 점검 */}
        <section>
          <span className="section-label">08. 최종 점검</span>
          <h2>면접 전, 이것만 확인하세요</h2>
          <VerifyChecklist points={qualityChecklist} />
        </section>

        {/* 09 전체 여정 정리 */}
        <section>
          <span className="section-label">09. 11~17강 전체 여정</span>
          <h2>API 기초부터 면접 전략까지</h2>
          <div className="scenario-grid">
            {deploymentMethods.map((d, i) => { const Icon = d.icon; return (
              <motion.div className="scenario-card" key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="scenario-icon"><Icon size={24} /></div>
                <h3>{d.lecture}</h3>
                <p className="scenario-before">{d.method}</p>
                <p className="scenario-output">{d.type}</p>
              </motion.div>
            ); })}
          </div>
          <div className="wrap-message">
            <Quote size={36} color="var(--accent)" />
            <h3>"코드를 짤 수 있는 사람은 많습니다. 그 코드로 문제를 해결하고, 설득력 있게 보여줄 수 있는 사람은 드뭅니다. 여러분은 이미 그 사람입니다."</h3>
          </div>
        </section>

        <section className="professional-point">
          <div className="highlight-box" style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '24px' }}>
            <h3>여러분이 가진 것</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: '1rem', fontSize: '1.05rem', lineHeight: '1.8' }}>
              6개 프로젝트, 모두 실행 가능한 데모 URL.<br/>
              API 기초부터 통합 포트폴리오까지 체계적 성장 스토리.<br/>
              기술 면접 30초 답변, 3분 피칭, STAR 인성 답변 준비 완료.<br/><br/>
              <strong>이제 면접장에서 보여주기만 하면 됩니다. 여러분의 무기는 준비되었습니다.</strong>
            </p>
          </div>
        </section>
      </main>

      <footer><p>&copy; 2026 렛유인 AI 코딩 과정 &mdash; Ch.17 기술 면접 & 피칭: 포트폴리오를 무기로</p></footer>
    </div>
  );
}
