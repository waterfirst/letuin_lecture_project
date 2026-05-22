import { useState, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Check,
  CheckCircle2,
  Copy,
  Database,
  Download,
  ExternalLink,
  FileText,
  Layers,
  LineChart,
  Map,
  Sigma,
  Sparkles,
  Table2,
  Target,
  Wrench,
} from 'lucide-react';

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}${filename}`;

const palette = {
  blue: '#2563eb',
  indigo: '#4f46e5',
  teal: '#0f9f8f',
  amber: '#d97706',
  rose: '#be123c',
  slate: '#172033',
  muted: '#64748b',
  border: 'rgba(15, 23, 42, 0.1)',
  panel: '#ffffff',
  soft: '#f8fafc',
};

const sectionShell: CSSProperties = {
  background: palette.panel,
  borderRadius: '30px',
  padding: '3rem',
  marginBottom: '3rem',
  boxShadow: '0 10px 40px rgba(15, 23, 42, 0.08)',
  border: `1px solid ${palette.border}`,
};

const gridAuto = (min = 250): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
  gap: '1.5rem',
});

const Card = ({
  icon: Icon,
  title,
  children,
  color = palette.blue,
}: {
  icon: ElementType;
  title: string;
  children: ReactNode;
  color?: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.025, y: -4 }}
    style={{
      background: `linear-gradient(135deg, ${color}12 0%, #ffffff 100%)`,
      border: `1px solid ${color}35`,
      borderRadius: '20px',
      padding: '1.5rem',
      minHeight: '180px',
    }}
  >
    <Icon size={34} color={color} style={{ marginBottom: '1rem' }} />
    <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.2rem', color: palette.slate, wordBreak: 'keep-all' }}>{title}</h3>
    <div style={{ color: palette.muted, lineHeight: 1.7, fontSize: '0.98rem' }}>{children}</div>
  </motion.div>
);

const ProjectImage = ({ filename, caption }: { filename: string; caption: string }) => (
  <motion.figure
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    style={{
      background: 'white',
      borderRadius: '28px',
      overflow: 'hidden',
      marginBottom: '3rem',
      boxShadow: '0 14px 46px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(0,0,0,0.08)',
    }}
  >
    <img
      src={assetUrl(filename)}
      alt={caption}
      style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block' }}
      loading="lazy"
    />
    <figcaption style={{ padding: '1rem 1.25rem', color: '#555', lineHeight: 1.6, fontSize: '0.98rem' }}>{caption}</figcaption>
  </motion.figure>
);

const HintLink = () => (
  <motion.a
    href={assetUrl('hints.html')}
    target="_blank"
    rel="noreferrer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15 }}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      background: 'white',
      borderRadius: '20px',
      padding: '1.5rem 1.75rem',
      marginBottom: '3rem',
      color: '#1a1a1a',
      textDecoration: 'none',
      boxShadow: '0 10px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0,0,0,0.08)',
    }}
  >
    <div>
      <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>상세 힌트 HTML 보기</div>
      <div style={{ color: '#666', lineHeight: 1.6 }}>
        Seaborn 예제 활용, HTML 보고서 작성, Quarto 렌더링 순서를 난이도별로 정리했습니다.
      </div>
    </div>
    <ExternalLink size={24} />
  </motion.a>
);

const PromptBox = ({ text, accent = palette.teal }: { text: string; accent?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'relative' }}>
      <pre
        style={{
          background: '#111827',
          color: '#d1fae5',
          padding: '1.5rem',
          borderRadius: '15px',
          overflow: 'auto',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          fontFamily: '"Fira Code", "Consolas", monospace',
          whiteSpace: 'pre-wrap',
        }}
      >
        {text}
      </pre>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: copied ? accent : palette.indigo,
          color: 'white',
          border: 'none',
          padding: '0.55rem 0.95rem',
          borderRadius: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.9rem',
          fontWeight: 800,
        }}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? '복사됨' : '복사'}
      </button>
    </div>
  );
};

const ProjectOverview = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      background: 'linear-gradient(135deg, #155e75 0%, #2563eb 54%, #7c3aed 100%)',
      borderRadius: '30px',
      padding: '3rem',
      marginBottom: '3rem',
      color: 'white',
      boxShadow: '0 20px 60px rgba(37, 99, 235, 0.28)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
      <BarChart3 size={48} />
      <div>
        <h1 style={{ fontSize: '2.5rem', margin: 0, color: 'white', wordBreak: 'keep-all' }}>프로젝트 2</h1>
        <p style={{ fontSize: '1.3rem', margin: '0.5rem 0 0', opacity: 0.95, wordBreak: 'keep-all' }}>
          OLED Deposition 데이터 시각화와 HTML/Quarto 분석 보고서
        </p>
      </div>
    </div>
    <div style={gridAuto(200)}>
      {[
        ['제출 시기', '10강 후 1주일 이내'],
        ['핵심 데이터', 'OLED deposition x/y map CSV'],
        ['주요 도구', 'Gemini + Python + Seaborn + Quarto'],
        ['최종 산출물', 'HTML 분석 보고서'],
      ].map(([label, value]) => (
        <div
          key={label}
          style={{
            background: 'rgba(255, 255, 255, 0.14)',
            padding: '1.4rem',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>{label}</div>
          <div style={{ fontSize: '1.24rem', fontWeight: 900, wordBreak: 'keep-all' }}>{value}</div>
        </div>
      ))}
    </div>
  </motion.div>
);

const ProjectGoal = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={sectionShell}>
    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: palette.slate }}>프로젝트 목표</h2>
    <p style={{ fontSize: '1.08rem', color: palette.muted, marginBottom: '2rem', lineHeight: 1.8, wordBreak: 'keep-all' }}>
      제공된 OLED deposition CSV를 읽고 boxplot, 산점도, heatmap, Pareto chart, x/y map을 만들어 공정 이상 패턴을 찾습니다.
      단순히 그래프를 많이 그리는 것이 아니라, 어떤 그래프가 어떤 질문에 가장 적합한지 판단하고 HTML 보고서로 문서화하는 것이 핵심입니다.
    </p>
    <div style={gridAuto()}>
      <Card icon={Database} title="데이터 이해" color={palette.blue}>
        x/y 좌표, chamber, 공정 조건, 두께, 결함 유형, yield score가 들어간 CSV를 읽고 결측치와 컬럼 의미를 확인합니다.
      </Card>
      <Card icon={LineChart} title="시각화 선택" color={palette.teal}>
        분포는 boxplot, 관계는 산점도, 위치 패턴은 heatmap/x-y map, 원인 우선순위는 Pareto chart로 확인합니다.
      </Card>
      <Card icon={FileText} title="보고서화" color={palette.rose}>
        그래프, 통계 분석, 회귀분석, p-value 해석을 한 문서 안에 넣어 HTML 또는 Quarto 기반 HTML로 제출합니다.
      </Card>
    </div>
  </motion.div>
);

const DatasetSection = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={sectionShell}>
    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: palette.slate }}>제공 데이터셋</h2>
    <p style={{ color: palette.muted, fontSize: '1.08rem', lineHeight: 1.8, wordBreak: 'keep-all' }}>
      기존 OLED deposition 예제를 확장해 panel 좌표별 측정값을 포함했습니다. x/y map, defect Pareto, chamber 비교, 회귀분석까지 한 번에 실습할 수 있습니다.
    </p>
    <div style={{ ...gridAuto(260), marginTop: '2rem' }}>
      <Card icon={Map} title="x/y map 가능" color={palette.indigo}>
        <strong>24,576 rows</strong> 규모의 좌표 데이터로 두께 편차와 defect cluster를 위치 기반으로 확인할 수 있습니다.
      </Card>
      <Card icon={Table2} title="분석 컬럼 포함" color={palette.teal}>
        source/substrate temperature, pressure, flow, thickness, particles, defect_type, yield_score를 함께 제공합니다.
      </Card>
      <a
        href={assetUrl('oled_deposition_xymap.csv')}
        download
        style={{
          borderRadius: '20px',
          padding: '1.5rem',
          minHeight: '180px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '1rem',
          textDecoration: 'none',
          color: 'white',
          background: 'linear-gradient(135deg, #0f9f8f 0%, #2563eb 100%)',
          boxShadow: '0 12px 34px rgba(37, 99, 235, 0.2)',
        }}
      >
        <Download size={36} />
        <div>
          <strong style={{ display: 'block', fontSize: '1.24rem', marginBottom: '0.35rem' }}>CSV 다운로드</strong>
          <span style={{ opacity: 0.92, lineHeight: 1.6 }}>oled_deposition_xymap.csv</span>
        </div>
      </a>
    </div>
  </motion.div>
);

const ChartGuide = () => {
  const charts = [
    ['Boxplot', 'chamber/zone별 thickness_nm 분포와 outlier 비교', '공정 조건별 산포가 다른가?'],
    ['Scatter plot', 'substrate_temp_c, pressure_mTorr와 yield_score 관계', '어떤 변수가 수율에 영향을 주는가?'],
    ['Heatmap', 'x_index, y_index 좌표별 thickness_error_nm 또는 defect_count', '특정 위치에 불량이 몰리는가?'],
    ['Pareto chart', 'defect_type 빈도와 누적 비율', '먼저 잡아야 할 결함 원인은 무엇인가?'],
    ['Regression', 'statsmodels OLS, p-value, coefficient', '통계적으로 유의한 인자는 무엇인가?'],
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={sectionShell}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: palette.slate }}>그래프 선택 가이드</h2>
      <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem', minWidth: '760px' }}>
          <thead>
            <tr style={{ background: palette.blue, color: 'white' }}>
              <th style={{ padding: '1rem', textAlign: 'left', borderRadius: '10px 0 0 0' }}>그래프</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>사용 컬럼 예시</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderRadius: '0 10px 0 0' }}>답해야 하는 질문</th>
            </tr>
          </thead>
          <tbody>
            {charts.map(([name, columns, question], index) => (
              <tr key={name} style={{ background: index % 2 === 0 ? '#f8fafc' : 'white' }}>
                <td style={{ padding: '1rem', fontWeight: 900, color: palette.slate }}>{name}</td>
                <td style={{ padding: '1rem', color: palette.muted }}>{columns}</td>
                <td style={{ padding: '1rem', color: palette.slate, fontWeight: 700 }}>{question}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <a
        href="https://seaborn.pydata.org/examples/index.html"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', color: palette.blue, fontWeight: 900 }}
      >
        Seaborn Gallery 예제 보기 <ExternalLink size={16} />
      </a>
    </motion.div>
  );
};

const beginnerPrompt = `OLED deposition CSV를 분석하는 Python 예제를 만들어줘.

조건:
1. pandas로 oled_deposition_xymap.csv를 읽기
2. seaborn으로 boxplot, scatter plot, heatmap을 각각 그리기
3. heatmap은 x_index, y_index 좌표별 thickness_error_nm 평균으로 만들기
4. 그래프는 PNG로 저장하고, 결과 해석을 HTML 보고서(report.html)에 넣기
5. 초보자도 실행할 수 있도록 requirements.txt와 실행 명령어도 함께 설명하기

사용 컬럼:
panel_id, x_index, y_index, chamber, zone, substrate_temp_c, pressure_mTorr,
thickness_nm, thickness_error_nm, particle_count, defect_type, yield_score`;

const LevelBeginner = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35 }}
    style={{ background: 'linear-gradient(135deg, #ccfbf1 0%, #a7f3d0 100%)', borderRadius: '30px', padding: '3rem', marginBottom: '3rem' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
      <div style={{ background: palette.teal, color: 'white', padding: '0.8rem 1.5rem', borderRadius: '15px', fontWeight: 900 }}>
        초급
      </div>
      <h2 style={{ fontSize: '2rem', margin: 0, color: palette.slate, wordBreak: 'keep-all' }}>CSV를 읽고 기본 그래프 3종 그리기</h2>
    </div>
    <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', marginBottom: '1rem' }}>
        <Sparkles size={24} color={palette.teal} />
        Gemini에 붙여넣을 시작 프롬프트
      </h3>
      <PromptBox text={beginnerPrompt} accent={palette.teal} />
    </div>
    <div style={{ ...gridAuto(), alignItems: 'stretch' }}>
      <Card icon={BarChart3} title="필수 그래프" color={palette.teal}>
        boxplot, scatter plot, heatmap을 각각 1개 이상 생성하고 제목, 축 이름, 단위를 표시합니다.
      </Card>
      <Card icon={FileText} title="기본 보고서" color={palette.blue}>
        HTML에는 데이터 개요, 그래프 이미지, 그래프별 한 줄 해석, 다음 분석 질문을 포함합니다.
      </Card>
      <Card icon={CheckCircle2} title="제출물" color={palette.indigo}>
        Python 코드, 생성된 PNG 3개 이상, report.html, 실행 화면 또는 보고서 캡처 1장을 제출합니다.
      </Card>
    </div>
  </motion.div>
);

const LevelIntermediate = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderRadius: '30px', padding: '3rem', marginBottom: '3rem' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
      <div style={{ background: palette.amber, color: 'white', padding: '0.8rem 1.5rem', borderRadius: '15px', fontWeight: 900 }}>
        중급
      </div>
      <h2 style={{ fontSize: '2rem', margin: 0, color: palette.slate, wordBreak: 'keep-all' }}>그래프와 통계 분석으로 인사이트 찾기</h2>
    </div>
    <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: palette.slate }}>요구사항</h3>
      <ul style={{ fontSize: '1.08rem', lineHeight: 2, color: palette.slate, paddingLeft: '1.5rem' }}>
        <li>초급 그래프 3종에 Pareto chart와 correlation heatmap을 추가합니다.</li>
        <li>결함 유형별 빈도, chamber별 수율 차이, x/y 위치 패턴을 각각 해석합니다.</li>
        <li>상관계수, 그룹 평균 비교, 간단한 회귀분석 중 2개 이상을 포함합니다.</li>
        <li>보고서는 HTML로 제출하고, 그래프 아래에 “그래서 무엇을 해야 하는가”를 문장으로 씁니다.</li>
      </ul>
    </div>
    <div style={gridAuto()}>
      <Card icon={Sigma} title="통계 분석" color={palette.amber}>
        `statsmodels` 또는 `scipy`를 사용해 p-value를 확인하고, 유의한 인자와 유의하지 않은 인자를 구분합니다.
      </Card>
      <Card icon={Target} title="원인 후보" color={palette.rose}>
        Pareto 상위 결함과 heatmap hotspot을 연결해 “위치 문제인지, chamber 문제인지, 조건 문제인지”를 가설로 정리합니다.
      </Card>
      <Card icon={Wrench} title="개선 제안" color={palette.blue}>
        수율 상위 10% 데이터의 조건 범위를 요약해 substrate temperature, pressure, flow의 권장 범위를 제안합니다.
      </Card>
    </div>
  </motion.div>
);

const quartoPrompt = `Quarto 문서 oled_deposition_report.qmd를 만들어줘.

목표:
- oled_deposition_xymap.csv를 읽고 OLED deposition 공정 문제 원인을 찾는 HTML 보고서 작성
- 코드, 그래프, 통계 분석, p-value 해석, 개선 제안을 한 문서에 포함

포함할 섹션:
1. 분석 목적과 데이터 설명
2. 품질 지표 요약: thickness_nm, thickness_error_nm, yield_score
3. Seaborn boxplot, scatter plot, heatmap, Pareto chart
4. statsmodels OLS 회귀분석: yield_score를 종속변수로 두고 공정 조건의 p-value 해석
5. x/y map hotspot과 defect_type Pareto를 연결한 원인 가설
6. 최종 권고안 3개

렌더링:
quarto render oled_deposition_report.qmd --to html`;

const LevelAdvanced = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.45 }}
    style={{ background: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)', borderRadius: '30px', padding: '3rem', marginBottom: '3rem' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
      <div style={{ background: palette.rose, color: 'white', padding: '0.8rem 1.5rem', borderRadius: '15px', fontWeight: 900 }}>
        고급
      </div>
      <h2 style={{ fontSize: '2rem', margin: 0, color: palette.slate, wordBreak: 'keep-all' }}>Quarto 문서로 문제 원인 분석 보고서 만들기</h2>
    </div>
    <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: palette.slate }}>Quarto 보고서 생성 프롬프트</h3>
      <PromptBox text={quartoPrompt} accent={palette.rose} />
    </div>
    <div style={{ background: 'white', borderRadius: '20px', padding: '2rem' }}>
      <ol style={{ fontSize: '1.08rem', lineHeight: 2, color: palette.slate, paddingLeft: '1.5rem' }}>
        <li>`.qmd` 문서 안에 Python 코드 셀과 해석 문장을 함께 작성합니다.</li>
        <li>그래프는 독립 이미지가 아니라 문서 안에서 재현되도록 코드 셀로 생성합니다.</li>
        <li>회귀분석 결과표에서 p-value가 0.05보다 작은 인자를 중심으로 원인 후보를 좁힙니다.</li>
        <li>x/y map hotspot, Pareto 상위 결함, 회귀분석 결과가 서로 같은 방향을 가리키는지 확인합니다.</li>
        <li>최종 HTML 보고서와 GitHub README를 제출합니다.</li>
      </ol>
    </div>
  </motion.div>
);

const EvaluationCriteria = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={sectionShell}>
    <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: palette.slate }}>평가 기준</h2>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem', minWidth: '780px' }}>
        <thead>
          <tr style={{ background: palette.indigo, color: 'white' }}>
            <th style={{ padding: '1rem', textAlign: 'left', borderRadius: '10px 0 0 0' }}>항목</th>
            <th style={{ padding: '1rem', textAlign: 'center' }}>초급</th>
            <th style={{ padding: '1rem', textAlign: 'center' }}>중급</th>
            <th style={{ padding: '1rem', textAlign: 'center', borderRadius: '0 10px 0 0' }}>고급</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['데이터 처리', 'CSV 읽기', '전처리와 그룹 분석', '재현 가능한 분석 파이프라인'],
            ['시각화', 'boxplot/scatter/heatmap', 'Pareto/correlation 추가', 'x/y map과 보고서 내 재현'],
            ['통계 분석', '기초 통계', '상관/회귀 분석', 'p-value 기반 원인 가설'],
            ['보고서', 'HTML 기본 보고서', '인사이트 중심 HTML', 'Quarto 기반 HTML 보고서'],
            ['제출물', '코드 + HTML + PNG', '코드 + HTML + 해석', 'QMD + HTML + README'],
          ].map((row, index) => (
            <tr key={row[0]} style={{ background: index % 2 === 0 ? '#f8fafc' : 'white' }}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cell}
                  style={{
                    padding: '1rem',
                    textAlign: cellIndex === 0 ? 'left' : 'center',
                    color: cellIndex === 0 ? palette.slate : palette.muted,
                    fontWeight: cellIndex === 0 ? 900 : 700,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

const InteractiveWorkshop = () => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const steps = [
    'CSV 다운로드 및 컬럼 의미 확인',
    'Seaborn Gallery에서 참고 그래프 3개 선택',
    'boxplot, scatter plot, heatmap 생성',
    'Pareto chart와 correlation heatmap으로 원인 후보 정리',
    '회귀분석과 p-value 해석 추가',
    'HTML 또는 Quarto HTML 보고서 생성',
    'GitHub README에 실행 방법과 결과 요약 작성',
  ];

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      style={{
        background: 'linear-gradient(135deg, #155e75 0%, #2563eb 100%)',
        borderRadius: '30px',
        padding: '3rem',
        marginBottom: '3rem',
        color: 'white',
      }}
    >
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>실습 체크리스트</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {steps.map((step, index) => (
          <motion.div
            key={step}
            whileHover={{ scale: 1.015 }}
            onClick={() => toggleCheck(index)}
            style={{
              background: checkedItems[index] ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
              padding: '1.3rem',
              borderRadius: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              border: checkedItems[index] ? '2px solid rgba(255, 255, 255, 0.5)' : '2px solid transparent',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: checkedItems[index] ? '#22c55e' : 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: '0 0 auto',
              }}
            >
              {checkedItems[index] && <Check size={20} />}
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Step {index + 1}</div>
              <div style={{ fontSize: '1.12rem', fontWeight: 900, wordBreak: 'keep-all' }}>{step}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Summary = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={sectionShell}>
    <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: palette.slate }}>완료 체크</h2>
    <div style={{ display: 'grid', gap: '1rem' }}>
      {[
        'OLED deposition CSV를 읽고 데이터 구조를 설명했다',
        'boxplot, scatter plot, heatmap을 포함했다',
        'Pareto chart 또는 x/y map으로 원인 후보를 좁혔다',
        '통계 분석 결과와 p-value를 보고서에 설명했다',
        'HTML 또는 Quarto HTML 보고서를 제출 가능한 형태로 만들었다',
      ].map((item) => (
        <div key={item} style={{ background: '#f8fafc', padding: '1.3rem', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <CheckCircle2 size={24} color="#22c55e" />
          <span style={{ fontSize: '1.08rem', color: palette.slate, wordBreak: 'keep-all' }}>{item}</span>
        </div>
      ))}
    </div>
    <div
      style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '20px',
        marginTop: '2rem',
        textAlign: 'center',
      }}
    >
      <Layers size={32} style={{ marginBottom: '1rem' }} />
      <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem' }}>좋은 보고서는 그래프 개수가 아니라 판단의 흐름이 보입니다.</h3>
      <p style={{ fontSize: '1.05rem', margin: 0, opacity: 0.94, lineHeight: 1.7 }}>
        분포를 보고, 관계를 확인하고, 위치 패턴을 찾고, 통계적으로 검증한 뒤 개선안을 쓰는 순서로 정리하세요.
      </p>
    </div>
  </motion.div>
);

function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)',
        padding: '2rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <ProjectOverview />
        <ProjectImage
          filename="oled-visual-report-overview.png"
          caption="OLED deposition x/y map preview: thickness error heatmap, chamber comparison, defect Pareto, and yield relationship."
        />
        <HintLink />
        <ProjectGoal />
        <DatasetSection />
        <ChartGuide />
        <LevelBeginner />
        <LevelIntermediate />
        <LevelAdvanced />
        <EvaluationCriteria />
        <InteractiveWorkshop />
        <Summary />
      </div>
    </div>
  );
}

export default App;
