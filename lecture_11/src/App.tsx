import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cloud,
  Code,
  Database,
  FileText,
  GitBranch,
  Globe,
  Layers,
  Link,
  Map,
  Monitor,
  Package,
  Rocket,
  Settings,
  Share2,
  Sliders,
  Sparkles,
  Terminal,
  TrendingUp,
  Upload,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}${filename}`;

// ============================================================================
// DATA
// ============================================================================

const learningGoals = [
  {
    step: '학습목표 1',
    title: 'AI로 제조업 문서 작성 → GitHub Pages 배포',
    body: 'SOP, 불량 보고서, 체크리스트 등을 AI가 HTML로 만들어 URL 하나로 팀 전체가 공유합니다.',
    icon: Globe,
    color: '#0071e3',
    bg: '#f0f7ff',
  },
  {
    step: '학습목표 2',
    title: 'AI로 데이터 분석 앱 → Streamlit Cloud 배포',
    body: 'CSV를 올리면 자동으로 차트와 이상치를 찾아주는 앱을 AI가 만들고, 팀원이 URL로 씁니다.',
    icon: BarChart3,
    color: '#34A853',
    bg: '#f0fdf4',
  },
  {
    step: '학습목표 3',
    title: 'AI로 공정 시뮬레이터 → AI Studio 공유 링크',
    body: '공정 조건을 입력하면 결과를 예측하고 설명해주는 대화형 시뮬레이터를 링크 하나로 배포합니다.',
    icon: Sliders,
    color: '#EA4335',
    bg: '#fff0f0',
  },
];

const docExamples = [
  {
    icon: FileText,
    title: 'CVD / 에칭 공정 SOP',
    desc: '단계별 작업 순서, 안전 주의사항, 체크박스 형태 점검 항목까지. 현장에서 스마트폰으로 QR 찍어 바로 열 수 있습니다.',
  },
  {
    icon: Activity,
    title: '불량 분석 보고서',
    desc: '파티클 불량 현상·원인·조치·재발 방지까지 표 형태로. AI가 구조를 잡아주면 내용만 채우면 됩니다.',
  },
  {
    icon: Wrench,
    title: '설비 예방 보전 체크리스트',
    desc: '일별·주별·월별 점검 항목, 정상 기준값, 이상 시 조치 방법이 들어간 웹 체크리스트.',
  },
  {
    icon: BookOpen,
    title: '신입 엔지니어 온보딩 가이드',
    desc: '공정 개요, 주의사항, 자주 묻는 질문 정리. 선배가 말로 설명하던 걸 AI가 초안으로 잡아줍니다.',
  },
  {
    icon: Package,
    title: '협력사 품질 기준서',
    desc: '측정 항목, 허용 범위, 샘플링 방법까지. 협력사마다 포맷이 달라도 AI가 맞춰줍니다.',
  },
  {
    icon: Globe,
    title: '다국어 작업 지침서',
    desc: '한국어 지침서를 영어·베트남어·인도네시아어로 번역한 버전을 같이 만들 수 있습니다.',
  },
];

const appExamples = [
  {
    icon: TrendingUp,
    title: '공정 관리도 자동 생성 앱',
    desc: 'CSV를 올리면 X-bar, R 관리도가 자동으로 그려지고, 3시그마 벗어난 포인트는 빨간색으로 표시됩니다.',
  },
  {
    icon: Map,
    title: '두께 균일도 분포 시각화 앱',
    desc: '웨이퍼 두께 측정 데이터를 올리면 웨이퍼 맵 컬러맵으로 어느 위치가 얇은지 한눈에 보입니다.',
  },
  {
    icon: BarChart3,
    title: '불량 원인 분석 대시보드',
    desc: '날짜별·설비별·공정별 불량 데이터를 올리면 집중 패턴을 자동 분석. 월간 품질 회의에 바로 씁니다.',
  },
  {
    icon: Activity,
    title: '수율 트렌드 추적 앱',
    desc: '매일 수율 데이터를 올리면 주간 트렌드, 이동 평균, 예상 수율이 그래프로 나옵니다.',
  },
  {
    icon: Zap,
    title: '설비 진동 이상 감지 앱',
    desc: '설비 진동 센서 로그를 올리면 정상·이상 구간을 자동 구분. 예방 보전 타이밍을 잡는 데 씁니다.',
  },
  {
    icon: Database,
    title: '원자재 로트 추적 앱',
    desc: '로트 번호·입고일·사용 공정·수율을 올리면 어떤 로트에서 이상이 있었는지 추적. 공급사 피드백 근거.',
  },
  {
    icon: Layers,
    title: '공정 파라미터 상관관계 분석 앱',
    desc: '온도·압력·가스 유량과 수율·두께·균일도를 올리면 어떤 파라미터가 결과에 얼마나 영향 주는지 시각화.',
  },
];

const simulatorExamples = [
  {
    icon: Monitor,
    title: '포토공정 CD 시뮬레이터',
    desc: '노광량·포커스 오프셋·마스크 CD를 입력하면 웨이퍼 CD를 예측하고 컬러맵으로 보여줍니다. 왜 이 결과가 나왔는지 설명도 해줍니다.',
  },
  {
    icon: Sliders,
    title: '에칭 공정 선택비 시뮬레이터',
    desc: '식각 가스·유량·챔버 압력·바이어스 파워를 입력하면 식각 속도와 선택비를 예측. 새 레시피 개발 방향을 잡는 데 씁니다.',
  },
  {
    icon: Layers,
    title: 'CVD 막 두께 균일도 시뮬레이터',
    desc: '온도·압력·가스 유량·웨이퍼 위치를 입력하면 막 두께 분포를 웨이퍼 맵으로 보여줍니다.',
  },
  {
    icon: Settings,
    title: 'CMP 연마 속도 시뮬레이터',
    desc: '패드 압력·슬러리 유량·테이블 회전수를 입력하면 제거 속도와 평탄도를 예측. 조건 최적화에 씁니다.',
  },
  {
    icon: Zap,
    title: '이온 주입 농도 프로파일 시뮬레이터',
    desc: '도핑 원소·에너지·도즈량을 입력하면 깊이별 농도 분포 그래프. 소자 특성 예측에 씁니다.',
  },
  {
    icon: Activity,
    title: '열처리 공정 확산 길이 시뮬레이터',
    desc: '온도·시간·분위기 가스를 입력하면 불순물 확산 길이 계산. 애닐 조건 설계에 씁니다.',
  },
  {
    icon: TrendingUp,
    title: '수율 예측 시뮬레이터',
    desc: '공정 단계별 불량률을 입력하면 최종 수율을 계산하고 어느 공정 개선이 수율에 가장 효과적인지 알려줍니다.',
  },
  {
    icon: Database,
    title: '원가 영향 시뮬레이터',
    desc: '공정 조건을 바꾸면 사이클 타임·가스 소모량·원가에 어떤 영향을 주는지 계산해줍니다.',
  },
];

const roadmap = [
  {
    num: '12강',
    title: 'Gemini로 제조업 문서 4종 → GitHub Pages 배포',
    desc: '이 강의가 끝나면 여러분 이름의 URL이 생깁니다.',
    color: '#0071e3',
  },
  {
    num: '13강',
    title: 'Antigravity로 데이터 분석 앱 → Streamlit Cloud 배포',
    desc: 'CSV 올리면 자동으로 분석되는 앱 URL이 생깁니다.',
    color: '#34A853',
  },
  {
    num: '14강',
    title: 'Gemini API Key 발급 → AI Studio 공정 시뮬레이터 → 공유 링크',
    desc: 'API Key 발급도 이 강의에서 같이 합니다.',
    color: '#EA4335',
  },
  {
    num: '15강',
    title: '센서 이상 감지 → Telegram 자동 알림',
    desc: '사람이 보지 않아도 AI가 먼저 이상 징후를 알려줍니다.',
    color: '#FBBC04',
  },
  {
    num: '16강',
    title: '통합 포트폴리오 구축',
    desc: 'URL 3개 + 자동화 시스템이 여러분의 포트폴리오가 됩니다.',
    color: '#FF6D00',
  },
  {
    num: '17강',
    title: '기술 면접 & 피칭 전략',
    desc: '"AI로 무엇을 만들었나요?" 에 구체적인 예시로 답하는 연습.',
    color: '#9C27B0',
  },
];

const qualityGate = [
  '3가지 배포 방법 이름을 말할 수 있나요? GitHub Pages, Streamlit Cloud, AI Studio 공유 링크.',
  '각 방법의 용도가 연결되나요? 문서 → GitHub Pages / 반복 데이터 분석 → Streamlit / 조건 탐색 → AI Studio.',
  '오늘 들은 예시 중 "나도 이거 써볼 수 있겠다" 싶은 게 하나 이상 있나요?',
];

// ============================================================================
// COMPONENTS
// ============================================================================

function SectionBadge({ label }: { label: string }) {
  return <span className="section-label">{label}</span>;
}

function ExampleCard({
  icon: Icon,
  title,
  desc,
  color = '#0071e3',
  bg = '#f0f7ff',
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  color?: string;
  bg?: string;
}) {
  return (
    <motion.div
      className="example-card"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ borderTop: `3px solid ${color}` }}
    >
      <div className="example-icon" style={{ background: bg, color }}>
        <Icon size={22} />
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </motion.div>
  );
}

function MethodHeader({
  num,
  badge,
  title,
  subtitle,
  color,
  bg,
  icon: Icon,
}: {
  num: string;
  badge: string;
  title: string;
  subtitle: string;
  color: string;
  bg: string;
  icon: React.ElementType;
}) {
  return (
    <div className="method-header" style={{ borderLeft: `4px solid ${color}`, background: bg }}>
      <div className="method-num" style={{ color }}>{num}</div>
      <div className="method-badge" style={{ background: color }}>{badge}</div>
      <h2>{title}</h2>
      <p className="method-subtitle">{subtitle}</p>
      <div className="method-icon-bg" style={{ color }}>
        <Icon size={48} />
      </div>
    </div>
  );
}

function DecisionBox() {
  return (
    <div className="decision-box">
      <h3>언제 어떤 걸 쓰나요?</h3>
      <div className="decision-rows">
        <div className="decision-row">
          <div className="decision-q">"한 번 만들어서 여러 사람이 읽는 거야"</div>
          <ArrowRight size={20} className="decision-arrow" />
          <div className="decision-a" style={{ background: '#f0f7ff', color: '#0071e3' }}>
            <Globe size={16} /> GitHub Pages
          </div>
        </div>
        <div className="decision-row">
          <div className="decision-q">"매번 새 데이터를 넣고 분석하는 거야"</div>
          <ArrowRight size={20} className="decision-arrow" />
          <div className="decision-a" style={{ background: '#f0fdf4', color: '#34A853' }}>
            <BarChart3 size={16} /> Streamlit Cloud
          </div>
        </div>
        <div className="decision-row">
          <div className="decision-q">"조건을 바꿔가면서 결과를 탐색하는 거야"</div>
          <ArrowRight size={20} className="decision-arrow" />
          <div className="decision-a" style={{ background: '#fff0f0', color: '#EA4335' }}>
            <Sliders size={16} /> AI Studio
          </div>
        </div>
      </div>
    </div>
  );
}

function RoadmapSection() {
  return (
    <div className="roadmap-grid">
      {roadmap.map((item, i) => (
        <motion.div
          className="roadmap-card"
          key={item.num}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07 }}
          style={{ borderLeft: `4px solid ${item.color}` }}
        >
          <div className="roadmap-num" style={{ background: item.color }}>{item.num}</div>
          <div>
            <strong>{item.title}</strong>
            <p>{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function QualityGate() {
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const allDone = checked.every(Boolean);

  return (
    <div className="quality-gate">
      <div className="qg-header">
        <CheckCircle2 size={24} color={allDone ? '#34A853' : '#999'} />
        <h3>Quality Gate — 3가지 확인</h3>
      </div>
      <div className="qg-items">
        {qualityGate.map((item, i) => (
          <button
            key={i}
            className={`qg-item ${checked[i] ? 'checked' : ''}`}
            onClick={() => {
              const next = [...checked];
              next[i] = !next[i];
              setChecked(next);
            }}
          >
            <div className="qg-check">
              {checked[i] ? <Check size={16} /> : <span>{i + 1}</span>}
            </div>
            <p>{item}</p>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {allDone && (
          <motion.div
            className="qg-success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Sparkles size={20} /> 11강 완료! 12강에서 첫 번째 방법을 직접 실습합니다.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// MAIN
// ============================================================================

export default function App() {
  return (
    <div className="app-container">
      {/* ── HEADER ── */}
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
            <span className="header-tag">AI로 제조업 업무 효율화</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Ch.11 3가지 배포 방법</h1>
          <p className="subtitle">
            AI로 만든 것을 어떻게 배포하느냐가 핵심입니다 —
            GitHub Pages · Streamlit Cloud · AI Studio 공유 링크
          </p>
          <div className="lesson-meta" aria-label="lesson summary">
            <span>약 40분</span>
            <span>개요 강의</span>
            <span>코드 없음</span>
            <span>결과물: 큰 그림</span>
          </div>
        </motion.div>
      </header>

      <main>
        {/* ── 01. 오프닝 & 학습목표 ── */}
        <section className="overview-section">
          <SectionBadge label="01. 오프닝 및 학습목표" />
          <h2>오늘 여러분은 3가지 배포 방법과 그 무한한 가능성을 봅니다</h2>
          <p className="section-intro">
            AI는 이제 만드는 수준이 됐습니다. 문서도 만들고, 앱도 만들고, 시뮬레이터도 만듭니다.
            그런데 만드는 것만큼 중요한 게 <strong>배포</strong>입니다. 내 컴퓨터에만 있으면 의미가 없습니다.
            오늘은 "이런 게 있구나", "나도 이거 써볼 수 있겠다"를 느끼는 데 집중합니다.
            실습은 12강부터입니다.
          </p>

          <div className="learning-goals-grid" aria-label="학습목표">
            {learningGoals.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  className="learning-goal-card"
                  key={item.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  style={{ borderTop: `3px solid ${item.color}` }}
                >
                  <div className="goal-icon" style={{ background: item.bg, color: item.color }}>
                    <Icon size={28} />
                  </div>
                  <span>{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="highlight-box" style={{ marginTop: '2.5rem', background: '#fffbeb', borderLeftColor: '#f59e0b' }}>
            <p style={{ fontWeight: 800, color: '#b45309', margin: 0 }}>
              💡 오늘 강의의 핵심 메시지
            </p>
            <p style={{ marginTop: '0.5rem', color: '#78350f', fontSize: '1rem', margin: '0.5rem 0 0 0' }}>
              "AI가 만든 것을 배포해야 가치가 생깁니다. 내 컴퓨터에만 있는 AI 결과물은 존재하지 않는 것과 같습니다."
            </p>
          </div>
        </section>

        {/* ── 02. 방법 1: GitHub Pages ── */}
        <section>
          <MethodHeader
            num="방법 1"
            badge="GitHub Pages"
            title="AI로 제조업 문서를 만들고 URL 하나로 배포합니다"
            subtitle="Word 파일 이메일 전송 → URL 하나로 팀 전체 공유. 파일 버전 혼란 종료."
            color="#0071e3"
            bg="#f0f7ff"
            icon={Globe}
          />

          <SectionBadge label="02. 방법 1 — 이런 문서들을 만들 수 있습니다" />
          <h2>AI에게 공정 정보를 주면 5분 안에 전문 HTML 문서가 나옵니다</h2>
          <p className="section-intro">
            체크리스트 형태로, 모바일에서도 보이고, 인쇄도 되고, QR코드로 현장에서 바로 열 수 있습니다.
            GitHub Pages에 올리면 URL이 생기고, 업데이트하면 모든 사람이 바로 최신 버전을 봅니다.
          </p>

          <div className="examples-grid">
            {docExamples.map((item) => (
              <ExampleCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                desc={item.desc}
                color="#0071e3"
                bg="#f0f7ff"
              />
            ))}
          </div>

          <div className="compare-strip">
            <div className="compare-col before-col">
              <strong>기존 방법</strong>
              <div className="compare-item">📝 작성 시간: 3시간</div>
              <div className="compare-item">📧 배포: 이메일 첨부</div>
              <div className="compare-item">🗂️ 버전 관리: 파일명</div>
              <div className="compare-item">📱 현장 접근: 출력물</div>
              <div className="compare-item">🔄 업데이트: 재배포 필요</div>
            </div>
            <div className="compare-arrow"><ArrowRight size={32} /></div>
            <div className="compare-col after-col">
              <strong>GitHub Pages</strong>
              <div className="compare-item">⚡ 작성 시간: 5분</div>
              <div className="compare-item">🔗 배포: URL 하나</div>
              <div className="compare-item">✅ 버전 관리: 자동</div>
              <div className="compare-item">📲 현장 접근: QR 스캔</div>
              <div className="compare-item">🚀 업데이트: 파일 교체만</div>
            </div>
          </div>

          <div className="lecture-preview-box" style={{ borderColor: '#0071e3' }}>
            <Rocket size={20} color="#0071e3" />
            <p><strong>12강에서 직접 실습합니다.</strong> SOP, 불량 보고서, 설비 점검 체크리스트, 공정 파라미터 가이드 4종을 AI로 만들고 GitHub Pages로 배포합니다.</p>
          </div>
        </section>

        {/* ── 03. 방법 2: Streamlit Cloud ── */}
        <section>
          <MethodHeader
            num="방법 2"
            badge="Streamlit Cloud"
            title="AI로 데이터 분석 앱을 만들고 팀원이 URL로 씁니다"
            subtitle="Excel 반복 분석 → 앱 하나로 자동화. 분석 잘하는 사람이 퇴사해도 앱은 남습니다."
            color="#34A853"
            bg="#f0fdf4"
            icon={BarChart3}
          />

          <SectionBadge label="03. 방법 2 — 이런 앱들을 만들 수 있습니다" />
          <h2>CSV를 올리면 자동으로 분석해주는 앱이 브라우저에 뜹니다</h2>
          <p className="section-intro">
            AI에게 "이런 앱 만들어줘"라고 하면 Python Streamlit 앱을 만들어줍니다.
            Streamlit Cloud에 올리면 URL이 생깁니다. 팀원이 URL에 접속해서 자기 CSV를 올리면 바로 분석됩니다.
            설치 없이, 브라우저만 있으면 됩니다.
          </p>

          <div className="examples-grid examples-grid-wider">
            {appExamples.map((item) => (
              <ExampleCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                desc={item.desc}
                color="#34A853"
                bg="#f0fdf4"
              />
            ))}
          </div>

          <div className="compare-strip">
            <div className="compare-col before-col">
              <strong>Excel 방식</strong>
              <div className="compare-item">⏱️ 분석 시간: 30분</div>
              <div className="compare-item">📧 공유: 파일 이메일</div>
              <div className="compare-item">👥 동시 사용: 불가</div>
              <div className="compare-item">🔍 이상치: 수동 탐색</div>
              <div className="compare-item">⚠️ 의존성: 담당자 1인</div>
            </div>
            <div className="compare-arrow"><ArrowRight size={32} /></div>
            <div className="compare-col after-col">
              <strong>Streamlit 앱</strong>
              <div className="compare-item">⚡ 분석 시간: 3분</div>
              <div className="compare-item">🔗 공유: URL 하나</div>
              <div className="compare-item">👥 동시 사용: 가능</div>
              <div className="compare-item">🤖 이상치: 자동 표시</div>
              <div className="compare-item">✅ 의존성: 팀 전체가 씀</div>
            </div>
          </div>

          <div className="lecture-preview-box" style={{ borderColor: '#34A853' }}>
            <Rocket size={20} color="#34A853" />
            <p><strong>13강에서 직접 실습합니다.</strong> Antigravity로 데이터 분석 앱을 만들고 Streamlit Cloud에 배포합니다.</p>
          </div>
        </section>

        {/* ── 04. 방법 3: AI Studio ── */}
        <section>
          <MethodHeader
            num="방법 3"
            badge="AI Studio 공유 링크"
            title="AI로 공정 시뮬레이터를 만들고 링크 하나로 팀과 공유합니다"
            subtitle="라이선스 수천만원짜리 시뮬레이터 → 무료. 결과만 보여주던 시뮬레이터 → 설명까지 해줌."
            color="#EA4335"
            bg="#fff0f0"
            icon={Sliders}
          />

          <SectionBadge label="04. 방법 3 — 이런 시뮬레이터들을 만들 수 있습니다" />
          <h2>AI에게 역할을 주면 그 순간부터 시뮬레이터가 됩니다</h2>
          <p className="section-intro">
            Google AI Studio에 "너는 포토공정 CD 시뮬레이터야"라고 한 줄 쓰면 끝입니다.
            공정 조건을 입력하면 결과를 예측하고, "왜 이 결과가 나왔어?"라고 물어볼 수 있습니다.
            AI가 설명해줍니다. 공유 링크를 팀원에게 보내면 누구나 씁니다. 무료입니다.
          </p>

          <div className="examples-grid examples-grid-wider">
            {simulatorExamples.map((item) => (
              <ExampleCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                desc={item.desc}
                color="#EA4335"
                bg="#fff0f0"
              />
            ))}
          </div>

          <div className="compare-strip">
            <div className="compare-col before-col">
              <strong>전통 시뮬레이터</strong>
              <div className="compare-item">💰 라이선스: 연 수천만 원</div>
              <div className="compare-item">🖥️ 설치: 전문가 필요</div>
              <div className="compare-item">👥 팀 공유: 추가 라이선스</div>
              <div className="compare-item">📚 학습 시간: 수십 시간</div>
              <div className="compare-item">❓ 결과 설명: 없음</div>
            </div>
            <div className="compare-arrow"><ArrowRight size={32} /></div>
            <div className="compare-col after-col">
              <strong>AI Studio</strong>
              <div className="compare-item">🆓 라이선스: 무료</div>
              <div className="compare-item">🌐 설치: 없음</div>
              <div className="compare-item">🔗 팀 공유: 링크 하나</div>
              <div className="compare-item">⚡ 학습 시간: 이 강의 1개</div>
              <div className="compare-item">💬 결과 설명: AI가 해줌</div>
            </div>
          </div>

          <div className="lecture-preview-box" style={{ borderColor: '#EA4335' }}>
            <Rocket size={20} color="#EA4335" />
            <p><strong>14강에서 직접 실습합니다.</strong> Gemini API Key를 발급하고 AI Studio에서 공정 시뮬레이터를 만들어 공유 링크로 배포합니다.</p>
          </div>
        </section>

        {/* ── 05. 판단 기준 ── */}
        <section>
          <SectionBadge label="05. 3가지 방법 정리" />
          <h2>언제 어떤 걸 쓸지 — 3문장으로 판단합니다</h2>
          <p className="section-intro">
            세 가지 질문으로 바로 답할 수 있습니다.
          </p>
          <DecisionBox />

          <div className="scenario-example-box">
            <h3>실제 상황에 적용해보면</h3>
            <p className="scenario-intro">공정에 이상이 생겼습니다. 어떻게 세 가지를 조합할까요?</p>
            <div className="scenario-steps">
              <div className="scenario-step">
                <div className="ss-num" style={{ background: '#0071e3' }}>1</div>
                <div>
                  <strong>불량 보고서 → GitHub Pages</strong>
                  <p>팀원이 URL 열면 최신 보고서를 바로 봅니다.</p>
                </div>
              </div>
              <div className="scenario-step">
                <div className="ss-num" style={{ background: '#34A853' }}>2</div>
                <div>
                  <strong>불량 데이터 CSV → Streamlit 앱</strong>
                  <p>어떤 패턴이 있는지 자동 분석합니다.</p>
                </div>
              </div>
              <div className="scenario-step">
                <div className="ss-num" style={{ background: '#EA4335' }}>3</div>
                <div>
                  <strong>원인 탐색 → AI Studio 시뮬레이터</strong>
                  <p>"이 조건 바꾸면 이 현상이 개선돼?"를 대화형으로 탐색합니다.</p>
                </div>
              </div>
            </div>
            <p className="scenario-conclusion">문서 + 분석 + 시뮬레이션. 이 세 가지가 같이 돌아가면 문제 해결 속도가 달라집니다.</p>
          </div>
        </section>

        {/* ── 06. 로드맵 ── */}
        <section>
          <SectionBadge label="06. 12~17강 로드맵" />
          <h2>6주 뒤 여러분은 3개의 URL과 포트폴리오를 갖게 됩니다</h2>
          <p className="section-intro">
            코드를 몰라도 됩니다. 결과물이 있으면 됩니다.
            GitHub Pages URL, Streamlit Cloud URL, AI Studio 공유 링크. 이 세 개가 포트폴리오입니다.
          </p>
          <RoadmapSection />
        </section>

        {/* ── 07. Quality Gate ── */}
        <section className="workshop-section">
          <SectionBadge label="07. Quality Gate & 마무리" />
          <h2>11강 완료 체크리스트</h2>
          <p className="section-intro">
            3개를 모두 체크하면 11강 완료입니다.
          </p>
          <QualityGate />

          <div className="wrap-message" style={{ marginTop: '3rem' }}>
            <Sparkles size={36} color="var(--accent)" />
            <h3>"AI로 만든 것을 세상에 꺼내는 창구 — GitHub Pages, Streamlit Cloud, AI Studio"</h3>
            <p>
              여러분이 해야 할 일은 하나입니다.
              <strong> "이런 게 필요하다"를 구체적으로 말하는 것.</strong>
              그게 제조업 AI 활용의 핵심입니다.
            </p>
            <p style={{ marginTop: '1rem', color: '#0071e3', fontWeight: 700 }}>
              → 12강에서 첫 번째 방법을 직접 실습합니다. 11강 수고하셨습니다!
            </p>
          </div>
        </section>

        {/* ── 전문가 포인트 ── */}
        <section className="professional-point">
          <div className="highlight-box" style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '24px' }}>
            <h3>Advanced Engineering Point</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: '1rem', fontSize: '1.05rem', lineHeight: 1.7 }}>
              "배포하지 않은 AI 결과물은 가치가 없습니다. 내 컴퓨터에만 있는 SOP, 내 컴퓨터에만 있는 분석 앱, 내 컴퓨터에만 있는 시뮬레이터 — 이것들은 팀에 기여하지 않습니다.
              GitHub Pages, Streamlit Cloud, AI Studio 공유 링크로 바깥으로 꺼내는 순간, 가치가 시작됩니다."
            </p>
            <div className="point-strip">
              <span><Globe size={16} /> 문서 → GitHub Pages</span>
              <span><BarChart3 size={16} /> 분석 → Streamlit Cloud</span>
              <span><Sliders size={16} /> 시뮬레이션 → AI Studio</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 AI로 제조업 업무 효율화 | LettUin Edu — Ch.11</p>
      </footer>
    </div>
  );
}
