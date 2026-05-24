import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers, Eye, Target, Zap, Share2, Users, Sparkles,
  MessageSquare, Brain, Key, ArrowRight, Check, CheckCircle2,
  ChevronRight, Copy, ExternalLink, Rocket, Globe, Link2,
  Quote, Search, AlertTriangle
} from 'lucide-react';

// ─────────────────────────────────────────────
// DATA ARRAYS
// ─────────────────────────────────────────────

const learningGoals = [
  {
    icon: Key,
    title: 'API Key 발급 및 설정',
    description: 'Google AI Studio에서 Gemini API Key를 발급받고 프로젝트에 연동하는 방법을 학습합니다.',
  },
  {
    icon: Brain,
    title: '시스템 프롬프트로 공진 시뮬레이터 구축',
    description: '3단계 프롬프트 전략으로 OLED 탠덤 공진 최적화 시뮬레이터를 완성합니다.',
  },
  {
    icon: Share2,
    title: '공유 링크 배포',
    description: '완성된 시뮬레이터를 팀원과 공유하고 협업 환경을 구축합니다.',
  },
];

const lessonFlow = [
  { time: '0–5분', label: '문제 정의', desc: '탠덤 OLED 시야각 이슈 소개' },
  { time: '5–10분', label: 'AI Studio 셋업', desc: 'API Key 발급 및 프로젝트 생성' },
  { time: '10–20분', label: 'Phase 1–2 프롬프트', desc: 'UI 프레임워크 + 광학 수식 구현' },
  { time: '20–30분', label: 'Phase 3 프롬프트', desc: '성능 분석 탭 완성' },
  { time: '30–35분', label: '시스템 프롬프트 통합', desc: '전체 시뮬레이터 동작 검증' },
  { time: '35–40분', label: '공유 및 마무리', desc: '링크 배포 + Quality Gate 체크' },
];

const manualVsAI = [
  {
    category: '기존 방식 (Trial & Error)',
    icon: Search,
    color: '#ff6b6b',
    items: [
      'ITO 두께 수동 변경 → 증착 → 측정 반복',
      '1회 실험 사이클: 2~3일 소요',
      'R/G/B 각각 최적화 시 수십 회 반복 필요',
      '시야각별 성능 예측 불가',
      '비용: 웨이퍼당 $200+ × 반복 횟수',
    ],
  },
  {
    category: 'AI 시뮬레이션 최적화',
    icon: Sparkles,
    color: '#51cf66',
    items: [
      '광학 공진 수식 기반 즉시 계산',
      '시뮬레이션 1회: 수 초 이내',
      'R/G/B 동시 최적화 + 각도별 분석',
      '0°~60° 시야각 성능 실시간 예측',
      '비용: API 호출당 $0.001 수준',
    ],
  },
];

const analysisTargets = [
  { label: 'ITO 두께 (nm)', desc: 'R: 620nm, G: 530nm, B: 460nm 기준 최적값 도출', icon: Layers },
  { label: '광학 경로 길이', desc: 'n·d·cos(θ) 기반 유효 광경로 계산', icon: Eye },
  { label: '간섭 차수 (m)', desc: '2nd = mλ 공진 조건에서 최적 차수 결정', icon: Target },
  { label: '시야각 성능', desc: '0°, 30°, 45°, 60°에서 휘도 유지율 및 색좌표 변이', icon: Zap },
];

const systemPromptText = `당신은 OLED 광학 시뮬레이션 전문가입니다.

[역할]
- Fabry-Perot 공진기 기반 탠덤 OLED 구조의 ITO 두께를 최적화합니다.
- R/G/B 서브 픽셀 각각에 대해 독립적으로 공진 조건을 계산합니다.

[입력 파라미터]
- target_wavelength_R: Red 타겟 파장 (기본값: 620 nm)
- target_wavelength_G: Green 타겟 파장 (기본값: 530 nm)
- target_wavelength_B: Blue 타겟 파장 (기본값: 460 nm)
- current_ITO_thickness: 현재 균일 ITO 두께 (기본값: 150 nm)
- ITO_refractive_index: ITO 굴절률 (기본값: 1.9)

[계산 방법]
1. 광학 경로 길이: OPL = n × d × cos(θ)
   - n: ITO 굴절률
   - d: ITO 두께
   - θ: 내부 굴절각 (Snell's law 적용)

2. 공진 조건: 2 × n × d × cos(θ) = m × λ
   - m: 간섭 차수 (정수, 일반적으로 m=2 사용)
   - λ: 타겟 파장

3. 최적 ITO 두께: d_opt = (m × λ) / (2 × n × cos(θ))

4. 시야각별 계산:
   - θ_ext = 0°, 30°, 45°, 60°
   - θ_int = arcsin(sin(θ_ext) / n)  (Snell's law)
   - 각 각도에서 최적 두께 재계산

5. 휘도 유지율: L(θ) / L(0°) = cos(θ) × [공진 효율 함수]

6. 색좌표 변이: Δu'v' 계산 (CIE 1976 기준)

[출력 형식 - JSON]
{
  "optimalThickness_R": { "0deg": number, "30deg": number, "45deg": number, "60deg": number },
  "optimalThickness_G": { "0deg": number, "30deg": number, "45deg": number, "60deg": number },
  "optimalThickness_B": { "0deg": number, "30deg": number, "45deg": number, "60deg": number },
  "luminanceRetention": { "30deg": "%", "45deg": "%", "60deg": "%" },
  "colorShift_duv": { "30deg": number, "45deg": number, "60deg": number },
  "recommendation": "최적 설계 요약 텍스트"
}

[제약 조건]
- ITO 두께 범위: 50~300 nm
- 공정 마진 고려: ±5 nm 허용
- 색좌표 변이 목표: Δu'v' < 0.02 at 45°`;

const phase1Prompt = `React + TypeScript + Vite 프로젝트를 생성해주세요.

[요구사항]
1. 탭 기반 UI (Material-UI 스타일)
   - Tab 1: "기존 구조" — 균일 ITO 탠덤 OLED 다이어그램
   - Tab 2: "RGB 차등 공진" — R/G/B 서브픽셀별 ITO 두께가 다른 구조도

2. 기존 구조 다이어그램:
   - Layer stack: Glass / ITO (150nm 균일) / HTL / EML-R,G,B / ETL / Cathode
   - 모든 서브픽셀의 ITO가 동일 두께임을 시각적으로 강조

3. RGB 차등 공진 다이어그램:
   - Layer stack: Glass / ITO-R (163nm) / ITO-G (139nm) / ITO-B (121nm) / ...
   - 각 색상별 두께 차이를 높이로 시각적 표현
   - 공진 파장 화살표 표시 (R: 620nm, G: 530nm, B: 460nm)

4. 스타일: 다크 테마, 네온 색상 강조, 반응형 레이아웃`;

const phase2Prompt = `기존 프로젝트에 광학 공진 계산 기능을 추가해주세요.

[요구사항]
1. Fabry-Perot 공진 계산 모듈:
   - 공진 조건: 2nd·cos(θ) = mλ
   - Snell's law: n₁·sin(θ₁) = n₂·sin(θ₂)
   - 최적 ITO 두께 = (m × λ) / (2 × n × cos(θ_int))

2. 입력 슬라이더:
   - 타겟 파장 (R: 580-680nm, G: 490-570nm, B: 420-500nm)
   - ITO 굴절률 (1.7 ~ 2.1)
   - 간섭 차수 m (1, 2, 3)

3. Recharts 라인 그래프:
   - X축: 시야각 (0° ~ 60°)
   - Y축: 정규화 휘도 (0 ~ 1.0)
   - 3개 라인: R (빨강), G (초록), B (파랑)
   - 기존 균일 ITO (점선) vs 최적화 ITO (실선) 비교

4. 실시간 업데이트: 슬라이더 변경 시 그래프 즉시 반영`;

const phase3Prompt = `성능 분석 탭을 추가해주세요.

[요구사항]
1. "수명 영향" 탭:
   - ITO 두께 변경에 따른 전류 밀도 변화 추정
   - 가속 수명 예측 (Arrhenius 모델 기반 간이 계산)
   - Bar chart: R/G/B 서브픽셀별 예상 수명 비교

2. "전력 효율" 탭:
   - 공진 강화에 따른 외부양자효율(EQE) 향상 추정
   - 파워 절감율 계산
   - Pie chart: 광학 이득 / 전기 손실 / 순 효율 개선

3. "종합 리포트" 탭:
   - Executive Summary 카드
   - 핵심 메트릭: 색변화 개선율, 휘도 균일도, 추정 수명
   - "리포트 다운로드" 버튼 (JSON export)
   - 최종 설계 권장사항 텍스트 생성`;

const practiceSteps = [
  { step: 1, title: 'AI Studio 접속', desc: 'aistudio.google.com 접속 → 로그인' },
  { step: 2, title: '새 프롬프트 생성', desc: '"Create new prompt" → System Instructions 영역 활성화' },
  { step: 3, title: '시스템 프롬프트 입력', desc: '위 시스템 프롬프트 전문을 System Instructions에 붙여넣기' },
  { step: 4, title: '테스트 입력', desc: '"Red 620nm, Green 530nm, Blue 460nm, 현재 ITO 150nm로 최적화해줘"' },
  { step: 5, title: '결과 검증', desc: 'JSON 출력 확인 → 물리적 타당성 검토 (두께 범위, 각도 의존성)' },
  { step: 6, title: '공유 링크 생성', desc: '"Share" → "Create link" → 팀원에게 배포' },
];

const shareLinkAdvantages = [
  { icon: Users, title: '팀 협업', desc: '팀원 누구나 동일 시뮬레이터 즉시 사용' },
  { icon: Globe, title: '무설치 접근', desc: '브라우저만으로 시뮬레이션 실행 가능' },
  { icon: Link2, title: '버전 관리', desc: '프롬프트 업데이트 시 링크 자동 반영' },
  { icon: Rocket, title: '즉시 배포', desc: '개발/배포 과정 없이 바로 사용 시작' },
];

const qualityGate = [
  { check: 'R/G/B 최적 ITO 두께가 물리적으로 타당한 범위 (50~300nm) 내인가?', critical: true },
  { check: '시야각 증가 시 cos(θ) 의존성이 올바르게 반영되는가?', critical: true },
  { check: 'JSON 출력 형식이 명세와 일치하는가?', critical: false },
  { check: '색좌표 변이(Δu\'v\')가 0° 기준 단조 증가하는가?', critical: true },
  { check: '간섭 차수 m 변경 시 두께가 비례하여 변하는가?', critical: false },
  { check: '균일 ITO 대비 최적화 ITO의 휘도 유지율이 개선되는가?', critical: true },
];

// ─────────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

function SectionTitle({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <motion.div className="section-title" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <div className="section-title-icon">
        <Icon size={28} />
      </div>
      <h2>{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </motion.div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className="copy-btn" onClick={handleCopy}>
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? '복사됨!' : '복사'}
    </button>
  );
}

function PromptCard({ title, phase, prompt, color }: { title: string; phase: string; prompt: string; color: string }) {
  return (
    <motion.div className="prompt-card" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <div className="prompt-card-header" style={{ borderLeftColor: color }}>
        <span className="prompt-phase-badge" style={{ backgroundColor: color }}>{phase}</span>
        <h3>{title}</h3>
        <CopyButton text={prompt} />
      </div>
      <pre className="prompt-code">{prompt}</pre>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP COMPONENT
// ─────────────────────────────────────────────

export default function App() {
  return (
    <div className="app">
      {/* ───── SECTION 1: Title Slide ───── */}
      <section className="section hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-badge">
            <Sparkles size={16} />
            렛유인 코딩 과정
          </div>
          <h1 className="hero-title">
            14강: Google AI Studio 실습
          </h1>
          <p className="hero-subtitle">
            OLED 탠덤 공진 시뮬레이터
          </p>
          <div className="hero-tags">
            <span className="tag">Gemini API</span>
            <span className="tag">Tandem OLED</span>
            <span className="tag">ITO 최적화</span>
            <span className="tag">광학 공진</span>
          </div>
          <div className="hero-visual">
            <div className="hero-layer-stack">
              <div className="hero-layer" style={{ background: 'rgba(255,100,100,0.3)', height: '20px' }}>Cathode</div>
              <div className="hero-layer" style={{ background: 'rgba(100,255,100,0.2)', height: '15px' }}>ETL</div>
              <div className="hero-layer" style={{ background: 'rgba(255,200,50,0.3)', height: '25px' }}>EML (R/G/B)</div>
              <div className="hero-layer" style={{ background: 'rgba(100,100,255,0.2)', height: '15px' }}>HTL</div>
              <div className="hero-layer hero-ito-layer" style={{ height: '30px' }}>ITO (최적화 대상)</div>
              <div className="hero-layer" style={{ background: 'rgba(200,200,255,0.1)', height: '20px' }}>Glass</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ───── SECTION 2: Learning Goals ───── */}
      <section className="section">
        <SectionTitle icon={Target} title="학습 목표" subtitle="이번 강의를 마치면 다음을 수행할 수 있습니다" />
        <motion.div className="goals-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {learningGoals.map((goal, i) => (
            <motion.div key={i} className="goal-card" variants={fadeInUp}>
              <div className="goal-visual">
                <goal.icon size={32} />
                <span className="goal-number">{i + 1}</span>
              </div>
              <h3>{goal.title}</h3>
              <p>{goal.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ───── SECTION 3: Lesson Flow ───── */}
      <section className="section">
        <SectionTitle icon={ArrowRight} title="강의 흐름" subtitle="40분 실습 타임라인" />
        <motion.div className="timeline" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {lessonFlow.map((item, i) => (
            <motion.div key={i} className="timeline-item" variants={fadeInUp}>
              <div className="timeline-time">{item.time}</div>
              <div className="timeline-dot" />
              <div className="timeline-content">
                <h4>{item.label}</h4>
                <p>{item.desc}</p>
              </div>
              {i < lessonFlow.length - 1 && <ChevronRight className="timeline-arrow" size={16} />}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ───── SECTION 4: Problem Definition ───── */}
      <section className="section">
        <SectionTitle icon={AlertTriangle} title="문제 정의" subtitle="탠덤 OLED 시야각 색변화 및 휘도 저하" />
        <motion.div className="problem-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div className="problem-card" variants={fadeInUp}>
            <div className="problem-illustration">
              <img src="/comic.png" alt="개발자 고민 만화" className="problem-comic" />
            </div>
            <h3>현상</h3>
            <p>탠덤 OLED 구조에서 균일한 ITO 두께를 사용하면, 측면 시야각에서 R/G/B 각 색상의 공진 조건이 동시에 만족되지 않아 색변화(color shift)와 휘도 저하가 발생합니다.</p>
          </motion.div>
          <motion.div className="problem-card" variants={fadeInUp}>
            <h3>근본 원인</h3>
            <ul className="problem-list">
              <li><Eye size={16} /> Fabry-Perot 공진기의 각도 의존성 (cos θ)</li>
              <li><Layers size={16} /> R/G/B 파장별 최적 광학 경로 길이 상이</li>
              <li><Target size={16} /> 균일 ITO로는 3색 동시 최적화 불가</li>
            </ul>
            <h3>해결 방향</h3>
            <p className="solution-text">
              <Sparkles size={16} />
              R/G/B 서브픽셀별 ITO 두께를 차등 설계하여 각 색상의 공진 조건을 독립적으로 만족시킵니다.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ───── SECTION 5: Manual vs AI ───── */}
      <section className="section">
        <SectionTitle icon={Zap} title="기존 vs AI 최적화" subtitle="Trial-and-Error 방식과 AI 시뮬레이션 비교" />
        <motion.div className="comparison-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {manualVsAI.map((col, i) => (
            <motion.div key={i} className="comparison-card" variants={fadeInUp} style={{ borderTopColor: col.color }}>
              <div className="comparison-header">
                <col.icon size={24} style={{ color: col.color }} />
                <h3>{col.category}</h3>
              </div>
              <ul className="comparison-list">
                {col.items.map((item, j) => (
                  <li key={j}>
                    <ChevronRight size={14} style={{ color: col.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
        <motion.div className="comparison-images" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="panel-image-wrapper">
            <img src="/panel1.png" alt="기존 탠덤 구조" className="panel-image" />
            <span className="panel-label">기존 균일 ITO 구조</span>
          </div>
          <div className="panel-arrow">
            <ArrowRight size={32} />
          </div>
          <div className="panel-image-wrapper">
            <img src="/panel2.png" alt="RGB 차등 공진 구조" className="panel-image" />
            <span className="panel-label">RGB 차등 공진 구조</span>
          </div>
        </motion.div>
      </section>

      {/* ───── SECTION 6: Phase 1 Prompt ───── */}
      <section className="section">
        <SectionTitle icon={MessageSquare} title="Phase 1: UI 프레임워크" subtitle="기본 구조 비교 화면 생성" />
        <PromptCard
          title="탭 기반 구조 비교 UI"
          phase="Phase 1"
          prompt={phase1Prompt}
          color="#4dabf7"
        />
        <motion.div className="phase-result" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h4>예상 결과물</h4>
          <img src="/panel3.png" alt="Phase 1 결과 화면" className="result-image" />
        </motion.div>
      </section>

      {/* ───── SECTION 7: Phase 2 Prompt ───── */}
      <section className="section">
        <SectionTitle icon={Eye} title="Phase 2: 광학 공진 계산" subtitle="Fabry-Perot 수식 + 시야각 그래프" />
        <PromptCard
          title="공진 조건 계산 및 시각화"
          phase="Phase 2"
          prompt={phase2Prompt}
          color="#51cf66"
        />
        <motion.div className="phase-result" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h4>예상 결과물</h4>
          <img src="/panel4.png" alt="Phase 2 결과 화면" className="result-image" />
        </motion.div>
        <motion.div className="analysis-targets" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h4 className="targets-title">시뮬레이터 분석 항목</h4>
          <div className="targets-grid">
            {analysisTargets.map((t, i) => (
              <motion.div key={i} className="target-card" variants={fadeInUp}>
                <t.icon size={20} />
                <div>
                  <strong>{t.label}</strong>
                  <p>{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ───── SECTION 8: Phase 3 Prompt ───── */}
      <section className="section">
        <SectionTitle icon={Target} title="Phase 3: 성능 분석" subtitle="수명, 전력 효율, 종합 리포트" />
        <PromptCard
          title="성능 분석 및 리포트 생성"
          phase="Phase 3"
          prompt={phase3Prompt}
          color="#fcc419"
        />
      </section>

      {/* ───── SECTION 9: System Prompt ───── */}
      <section className="section">
        <SectionTitle icon={Brain} title="시스템 프롬프트" subtitle="OLED 공진 시뮬레이터 전체 프롬프트" />
        <motion.div className="system-prompt-container" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="system-prompt-header">
            <Quote size={20} />
            <span>System Instructions</span>
            <CopyButton text={systemPromptText} />
          </div>
          <pre className="system-prompt-code">{systemPromptText}</pre>
        </motion.div>
      </section>

      {/* ───── SECTION 10: Practice Steps ───── */}
      <section className="section">
        <SectionTitle icon={Rocket} title="AI Studio 실습" subtitle="단계별 실습 가이드" />
        <motion.div className="practice-steps" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {practiceSteps.map((s) => (
            <motion.div key={s.step} className="practice-step" variants={fadeInUp}>
              <div className="step-number">{s.step}</div>
              <div className="step-content">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div className="ai-studio-link" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} />
            Google AI Studio 바로가기
          </a>
        </motion.div>
      </section>

      {/* ───── SECTION 11: Share Link ───── */}
      <section className="section">
        <SectionTitle icon={Share2} title="공유 링크 활용" subtitle="팀 배포 시 이점" />
        <motion.div className="share-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {shareLinkAdvantages.map((adv, i) => (
            <motion.div key={i} className="share-card" variants={fadeInUp}>
              <adv.icon size={28} />
              <h4>{adv.title}</h4>
              <p>{adv.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ───── SECTION 12: Quality Gate ───── */}
      <section className="section">
        <SectionTitle icon={CheckCircle2} title="Quality Gate" subtitle="시뮬레이터 검증 체크리스트" />
        <motion.div className="quality-gate" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {qualityGate.map((item, i) => (
            <motion.div key={i} className={`quality-item ${item.critical ? 'critical' : ''}`} variants={fadeInUp}>
              <CheckCircle2 size={18} className="quality-check-icon" />
              <span>{item.check}</span>
              {item.critical && <span className="critical-badge">필수</span>}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ───── SECTION 13: Summary ───── */}
      <section className="section summary-section">
        <SectionTitle icon={Sparkles} title="정리 및 다음 단계" />
        <motion.div className="summary-content" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div className="summary-card" variants={fadeInUp}>
            <h3>오늘 배운 것</h3>
            <ul>
              <li><Check size={16} /> Google AI Studio에서 API Key 발급 및 프로젝트 설정</li>
              <li><Check size={16} /> 3단계 프롬프트로 OLED 공진 시뮬레이터 구축</li>
              <li><Check size={16} /> Fabry-Perot 공진 조건과 시야각 의존성 이해</li>
              <li><Check size={16} /> 공유 링크로 팀 배포 완료</li>
            </ul>
          </motion.div>
          <motion.div className="summary-card next-steps-card" variants={fadeInUp}>
            <h3>다음 강의 예고</h3>
            <div className="next-preview">
              <span className="next-badge">15강</span>
              <p>실제 공정 데이터와 연동하여 시뮬레이션 정확도를 검증하고, 머신러닝 기반 자동 최적화 파이프라인을 구축합니다.</p>
            </div>
          </motion.div>
          <motion.div className="summary-card" variants={fadeInUp}>
            <h3>과제</h3>
            <ul>
              <li><ArrowRight size={16} /> 시뮬레이터로 ITO 두께 120~180nm 범위 스캔 수행</li>
              <li><ArrowRight size={16} /> 최적 결과를 JSON으로 저장 후 슬랙 채널에 공유</li>
              <li><ArrowRight size={16} /> (선택) 간섭 차수 m=1, 2, 3 비교 분석</li>
            </ul>
          </motion.div>
        </motion.div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="footer">
        <p>렛유인 코딩 과정 — 14강 OLED 탠덤 공진 시뮬레이터</p>
        <p className="footer-sub">Google AI Studio + Gemini 활용 실습</p>
      </footer>
    </div>
  );
}
