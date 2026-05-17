import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Battery,
  Check,
  CheckCircle2,
  Code,
  Copy,
  Database,
  Dna,
  ExternalLink,
  FileText,
  Layers,
  LineChart,
  Sparkles,
  TrendingUp,
  Wrench,
  Zap,
} from 'lucide-react';

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}${filename}`;


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
    <img src={assetUrl(filename)} alt={caption} style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block' }} loading="lazy" />
    <figcaption style={{ padding: '1rem 1.25rem', color: '#555', lineHeight: 1.6, fontSize: '0.98rem' }}>{caption}</figcaption>
  </motion.figure>
);
// ============================================================================
// PROJECT 02: Streamlit Display Process Simulator
// ============================================================================

const ProjectOverview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '30px',
        padding: '3rem',
        marginBottom: '3rem',
        color: 'white',
        boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Activity size={48} />
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>프로젝트 2</h1>
          <p style={{ fontSize: '1.3rem', margin: '0.5rem 0 0 0', opacity: 0.95 }}>
            디스플레이 공정 시뮬레이터 or 데이터 분석 앱
          </p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '1.5rem', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>제출 시기</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>10강 후 1주일 이내</div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '1.5rem', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>주요 도구</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Streamlit / R Shiny</div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '1.5rem', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>핵심 목표</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>인터랙티브 앱 배포</div>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectThemes = () => {
  const themes = [
    { icon: BarChart3, title: 'OLED/LCD 비교 분석 도구', color: '#4285F4' },
    { icon: Layers, title: '포토공정 노광 조건 시뮬레이터', color: '#34A853' },
    { icon: Activity, title: '잉크젯 도포 균일성 분석기', color: '#FBBC04' },
    { icon: Sparkles, title: 'RGB 색공간 변환기', color: '#EA4335' },
    { icon: TrendingUp, title: '수율 데이터 이상치 탐지기', color: '#9334E6' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        background: 'white',
        borderRadius: '30px',
        padding: '3rem',
        marginBottom: '3rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
      }}
    >
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1a1a1a' }}>주제 선택 예시</h2>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
        아래 주제 중 하나를 선택하거나, 자유롭게 디스플레이 산업 관련 주제를 정하세요.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {themes.map((theme, idx) => {
          const Icon = theme.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -5 }}
              style={{
                background: `linear-gradient(135deg, ${theme.color}15 0%, ${theme.color}05 100%)`,
                padding: '1.5rem',
                borderRadius: '20px',
                border: `2px solid ${theme.color}30`,
                cursor: 'pointer',
              }}
            >
              <Icon size={32} color={theme.color} style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', color: '#1a1a1a', margin: 0 }}>{theme.title}</h3>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const LevelBeginner = () => {
  const [copied, setCopied] = useState(false);

  const promptText = `나는 [주제]에 대한 Streamlit 앱을 만들고 싶어.
필요한 데이터 구조, 주요 기능, 코드 전체를 작성해줘.
수준은 입문자가 이해할 수 있는 것으로.
사용 라이브러리는 streamlit, pandas, plotly만 써줘.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        background: 'linear-gradient(135deg, #D1F2EB 0%, #A9DFBF 100%)',
        borderRadius: '30px',
        padding: '3rem',
        marginBottom: '3rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{
          background: '#16A085',
          color: 'white',
          padding: '0.8rem 1.5rem',
          borderRadius: '15px',
          fontWeight: 'bold',
          fontSize: '1.1rem'
        }}>
          [하] 난이도
        </div>
        <h2 style={{ fontSize: '2rem', margin: 0, color: '#1a1a1a' }}>단계별 가이드 제공</h2>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', marginBottom: '1rem' }}>
          <Sparkles size={24} color="#16A085" />
          Step 1: 아이디어 구체화 (Gemini에게 물어보기)
        </h3>
        <p style={{ fontSize: '1rem', color: '#666', marginBottom: '1.5rem' }}>
          Gemini를 열고 아래 프롬프트를 복사하여 실행하세요.
        </p>
        <div style={{ position: 'relative' }}>
          <pre style={{
            background: '#1a1a1a',
            color: '#00ff00',
            padding: '1.5rem',
            borderRadius: '15px',
            overflow: 'auto',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            fontFamily: '"Fira Code", "Consolas", monospace',
          }}>
            {promptText}
          </pre>
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: copied ? '#16A085' : '#667eea',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? '복사됨!' : '복사'}
          </button>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', marginBottom: '1rem' }}>
          <Code size={24} color="#16A085" />
          Step 2: 파일 저장 및 로컬 실행 확인
        </h3>
        <pre style={{
          background: '#1a1a1a',
          color: '#00ff00',
          padding: '1.5rem',
          borderRadius: '15px',
          overflow: 'auto',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          fontFamily: '"Fira Code", "Consolas", monospace',
        }}>
{`# requirements.txt 생성 (Gemini에게 요청)
pip install -r requirements.txt

# 로컬 실행 확인
streamlit run app.py`}
        </pre>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', marginBottom: '1rem' }}>
          <Zap size={24} color="#16A085" />
          Step 3: Streamlit Community Cloud 배포
        </h3>
        <ol style={{ fontSize: '1.1rem', lineHeight: '2', color: '#333', paddingLeft: '1.5rem' }}>
          <li>GitHub에 push</li>
          <li><a href="https://share.streamlit.io" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>share.streamlit.io</a> 접속 → New app</li>
          <li>GitHub Repository 연결 → app.py 선택 → Deploy</li>
        </ol>
        <div style={{
          background: '#D1F2EB',
          padding: '1.5rem',
          borderRadius: '15px',
          marginTop: '1.5rem',
          border: '2px solid #16A085'
        }}>
          <strong style={{ color: '#16A085', fontSize: '1.1rem' }}>제출 항목</strong>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem' }}>배포 URL + GitHub Repository URL</p>
        </div>
      </div>
    </motion.div>
  );
};

const PublicDatasets = () => {
  const datasets = [
    {
      name: '공공데이터포털',
      url: 'https://www.data.go.kr',
      usage: '제조업 생산 통계, 불량률 데이터',
      icon: Database,
    },
    {
      name: 'IEEE DataPort',
      url: 'https://ieee-dataport.org',
      usage: '센서/제조 공정 실험 데이터',
      icon: Activity,
    },
    {
      name: 'Kaggle',
      url: 'https://www.kaggle.com/datasets',
      usage: '제조 이상 감지, 시계열 데이터',
      icon: TrendingUp,
    },
    {
      name: 'UCI ML Repository',
      url: 'https://archive.ics.uci.edu',
      usage: '공정 이상 감지 (SECOM 데이터셋 등)',
      icon: BarChart3,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      style={{
        background: 'white',
        borderRadius: '30px',
        padding: '3rem',
        marginBottom: '3rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
      }}
    >
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1a1a1a' }}>공개 데이터셋 모음</h2>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
        실제 데이터가 필요한 경우 아래 출처를 활용하세요.
      </p>
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {datasets.map((dataset, idx) => {
          const Icon = dataset.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02, x: 10 }}
              style={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                padding: '1.5rem',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                cursor: 'pointer',
              }}
            >
              <Icon size={40} color="#667eea" />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.5rem 0', color: '#1a1a1a' }}>{dataset.name}</h3>
                <p style={{ fontSize: '0.95rem', margin: '0 0 0.5rem 0', color: '#666' }}>{dataset.usage}</p>
                <a
                  href={dataset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#667eea', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  {dataset.url} <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div style={{
        background: 'linear-gradient(135deg, #FFF3CD 0%, #FFE69C 100%)',
        padding: '1.5rem',
        borderRadius: '20px',
        marginTop: '2rem',
        border: '2px solid #F39C12',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Sparkles size={20} color="#F39C12" />
          <strong style={{ color: '#F39C12', fontSize: '1.1rem' }}>추천 데이터셋</strong>
        </div>
        <p style={{ margin: 0, fontSize: '1rem', color: '#333' }}>
          <strong>SECOM 데이터셋 (UCI)</strong>: 반도체/디스플레이 공정 센서 데이터 + 수율 레이블 — 프로젝트 2에 최적
        </p>
      </div>
    </motion.div>
  );
};

const LevelIntermediate = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      style={{
        background: 'linear-gradient(135deg, #FFF3CD 0%, #FFEAA7 100%)',
        borderRadius: '30px',
        padding: '3rem',
        marginBottom: '3rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{
          background: '#F39C12',
          color: 'white',
          padding: '0.8rem 1.5rem',
          borderRadius: '15px',
          fontWeight: 'bold',
          fontSize: '1.1rem'
        }}>
          [중] 난이도
        </div>
        <h2 style={{ fontSize: '2rem', margin: 0, color: '#1a1a1a' }}>방향 제시</h2>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a1a1a' }}>요구사항</h3>
        <ul style={{ fontSize: '1.1rem', lineHeight: '2', color: '#333', paddingLeft: '1.5rem' }}>
          <li><strong>AI API(Gemini) 연동 필수</strong></li>
          <li>사용자 입력에 따라 AI가 인사이트를 제공하는 기능 포함</li>
          <li>위 공개 데이터셋 중 1개 이상 활용</li>
          <li>README.md에 앱 사용 방법 + 스크린샷 설명</li>
        </ul>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', marginBottom: '1rem' }}>
          <Wrench size={24} color="#F39C12" />
          힌트
        </h3>
        <pre style={{
          background: '#1a1a1a',
          color: '#00ff00',
          padding: '1.5rem',
          borderRadius: '15px',
          overflow: 'auto',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          fontFamily: '"Fira Code", "Consolas", monospace',
          marginBottom: '1rem',
        }}>
{`# .env 파일로 API Key 관리
GEMINI_API_KEY=your_key_here

# python-dotenv 라이브러리로 로드
from dotenv import load_dotenv
load_dotenv()

# .gitignore에 .env 반드시 추가!`}
        </pre>
        <div style={{
          background: '#FFF3CD',
          padding: '1.5rem',
          borderRadius: '15px',
          marginTop: '1.5rem',
          border: '2px solid #F39C12'
        }}>
          <strong style={{ color: '#F39C12', fontSize: '1.1rem' }}>제출 항목</strong>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem' }}>배포 URL + GitHub Repository URL</p>
        </div>
      </div>
    </motion.div>
  );
};

const LevelAdvanced = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      style={{
        background: 'linear-gradient(135deg, #F8D7DA 0%, #F5C6CB 100%)',
        borderRadius: '30px',
        padding: '3rem',
        marginBottom: '3rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{
          background: '#C0392B',
          color: 'white',
          padding: '0.8rem 1.5rem',
          borderRadius: '15px',
          fontWeight: 'bold',
          fontSize: '1.1rem'
        }}>
          [상] 난이도
        </div>
        <h2 style={{ fontSize: '2rem', margin: 0, color: '#1a1a1a' }}>요구사항만 (힌트 없음)</h2>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem' }}>
        <ol style={{ fontSize: '1.1rem', lineHeight: '2', color: '#333', paddingLeft: '1.5rem' }}>
          <li>디스플레이 실제 공정 데이터 기반 (논문, 특허, 공개 데이터셋)</li>
          <li>AI API 연동으로 데이터 자동 해석 기능</li>
          <li>사용자 입력 → 공정 최적화 제안 기능</li>
          <li>모바일 반응형 UI</li>
          <li>Streamlit Cloud Secrets와 README 배포 가이드 정리</li>
          <li>앱 내 한국어/영어 전환 기능</li>
        </ol>
        <div style={{
          background: '#F8D7DA',
          padding: '1.5rem',
          borderRadius: '15px',
          marginTop: '2rem',
          border: '2px solid #C0392B'
        }}>
          <strong style={{ color: '#C0392B', fontSize: '1.1rem' }}>제출 항목</strong>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem' }}>
            배포 URL + GitHub Repository URL + 기능 설명 영상 (2분 이내)
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const EvaluationCriteria = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      style={{
        background: 'white',
        borderRadius: '30px',
        padding: '3rem',
        marginBottom: '3rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
      }}
    >
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#1a1a1a' }}>평가 기준</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
          <thead>
            <tr style={{ background: '#667eea', color: 'white' }}>
              <th style={{ padding: '1rem', textAlign: 'left', borderRadius: '10px 0 0 0' }}>항목</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>하</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>중</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderRadius: '0 10px 0 0' }}>상</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: '#f8f9fa' }}>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>배포 완료</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>필수</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>필수</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>필수</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>인터랙티브 차트</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>1개 이상</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>2개 이상</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>3개 이상</td>
            </tr>
            <tr style={{ background: '#f8f9fa' }}>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>AI API 연동</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>없어도 됨</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>필수</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>필수</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>실제 데이터</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>샘플 데이터 OK</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>공개 데이터</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>공정 데이터</td>
            </tr>
            <tr style={{ background: '#f8f9fa' }}>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>코드 품질</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>동작만 하면 됨</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>구조화 권장</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>CI/CD 필수</td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const InteractiveWorkshop = () => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const steps = [
    '주제 선택 및 아이디어 구체화',
    'Gemini로 Streamlit app.py 생성',
    'requirements.txt 생성',
    '로컬에서 streamlit run app.py 테스트',
    'GitHub에 push',
    'Streamlit Community Cloud에서 배포',
    '배포 URL 확인 및 제출',
  ];

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            key={index}
            whileHover={{ scale: 1.02 }}
            onClick={() => toggleCheck(index)}
            style={{
              background: checkedItems[index] ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
              padding: '1.5rem',
              borderRadius: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              backdropFilter: 'blur(10px)',
              border: checkedItems[index] ? '2px solid rgba(255, 255, 255, 0.5)' : '2px solid transparent',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: checkedItems[index] ? '#34A853' : 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}>
              {checkedItems[index] && <Check size={20} />}
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Step {index + 1}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{step}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Summary = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      style={{
        background: 'white',
        borderRadius: '30px',
        padding: '3rem',
        marginBottom: '3rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
      }}
    >
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#1a1a1a' }}>프로젝트 완료 체크리스트</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {[
          'Streamlit 앱이 로컬에서 정상 작동',
          'GitHub에 코드 push 완료',
          'Streamlit Community Cloud에 배포 완료',
          '배포 URL 접속 시 앱이 정상 작동',
          'README.md에 사용 방법 작성 완료',
        ].map((item, index) => (
          <div
            key={index}
            style={{
              background: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <CheckCircle2 size={24} color="#34A853" />
            <span style={{ fontSize: '1.1rem', color: '#333' }}>{item}</span>
          </div>
        ))}
      </div>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '20px',
        marginTop: '2rem',
        textAlign: 'center',
      }}>
        <Sparkles size={32} style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0' }}>축하합니다!</h3>
        <p style={{ fontSize: '1.1rem', margin: 0, opacity: 0.95 }}>
          디스플레이 산업 관련 인터랙티브 앱을 만들고 배포하는 데 성공했습니다!
        </p>
      </div>
    </motion.div>
  );
};

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <ProjectOverview />
      <ProjectImage filename="process-simulator-overview.png" caption="Manufacturing process simulator overview: parameter controls, yield prediction, color gamut, defect risk, and what-if analysis." />
        <ProjectThemes />
        <LevelBeginner />
        <PublicDatasets />
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
