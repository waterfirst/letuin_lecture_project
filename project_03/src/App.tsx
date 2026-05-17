import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Award,
  BarChart3,
  Battery,
  Bot,
  Check,
  CheckCircle2,
  Code,
  Copy,
  Database,
  Dna,
  ExternalLink,
  FileText,
  Globe,
  Layers,
  LineChart,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Users,
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
      <div style={{ color: '#666', lineHeight: 1.6 }}>Telegram Bot, Gemini API, Google AI Studio, NotebookLM 연결법을 난이도별로 정리했습니다.</div>
    </div>
    <ExternalLink size={24} />
  </motion.a>
);
// ============================================================================
// PROJECT 03: Final AI Display Tool
// ============================================================================

const ProjectOverview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
        borderRadius: '30px',
        padding: '3rem',
        marginBottom: '3rem',
        color: 'white',
        boxShadow: '0 20px 60px rgba(255, 107, 107, 0.3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Award size={48} />
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>프로젝트 3 (최종)</h1>
          <p style={{ fontSize: '1.3rem', margin: '0.5rem 0 0 0', opacity: 0.95 }}>
            나만의 AI 디스플레이 도구
          </p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '1.5rem', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>제출 시기</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>16강 후 2주일 이내</div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '1.5rem', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>기술 조합</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>3가지 이상</div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '1.5rem', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>발표</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>3분 시연</div>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectIdeas = () => {
  const ideas = [
    { icon: Activity, title: '디스플레이 설비 이상 감지 + 텔레그램 알람 시스템', color: '#4285F4' },
    { icon: TrendingUp, title: '공정 파라미터 최적화 AI 어드바이저', color: '#34A853' },
    { icon: FileText, title: '디스플레이 특허/논문 키워드 분석 봇', color: '#FBBC04' },
    { icon: Sparkles, title: 'OLED 소재 배합 시뮬레이터 + 색역 예측', color: '#EA4335' },
    { icon: MessageSquare, title: '디스플레이 기술 면접 Q&A 챗봇', color: '#9334E6' },
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
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1a1a1a' }}>주제 아이디어 (자유 선택)</h2>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
        이 강의에서 배운 기술 중 최소 3가지를 조합하여 디스플레이 산업의 실제 문제를 해결하는 AI 도구를 만드세요.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {ideas.map((idea, idx) => {
          const Icon = idea.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -5 }}
              style={{
                background: `linear-gradient(135deg, ${idea.color}15 0%, ${idea.color}05 100%)`,
                padding: '1.5rem',
                borderRadius: '20px',
                border: `2px solid ${idea.color}30`,
                cursor: 'pointer',
              }}
            >
              <Icon size={32} color={idea.color} style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', color: '#1a1a1a', margin: 0 }}>{idea.title}</h3>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const TechStack = () => {
  const techs = [
    { name: 'Gemini', icon: Code, desc: '개발 도구' },
    { name: 'GitHub Actions', icon: Zap, desc: '코드 관리 & CI/CD' },
    { name: 'Python Streamlit', icon: Activity, desc: '웹 UI' },
    { name: 'pandas/plotly', icon: BarChart3, desc: '데이터 분석' },
    { name: 'Gemini API', icon: Sparkles, desc: 'AI 기능' },
    { name: 'Gemini Vision', icon: Bot, desc: '이미지 분석' },
    { name: 'Streamlit Cloud', icon: Globe, desc: '웹앱 플랫폼' },
    { name: 'Telegram Bot', icon: MessageSquare, desc: '알림/자동화' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        background: 'white',
        borderRadius: '30px',
        padding: '3rem',
        marginBottom: '3rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
      }}
    >
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#1a1a1a' }}>선택 가능한 기술 스택</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {techs.map((tech, idx) => {
          const Icon = tech.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                padding: '1.5rem',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
              }}
            >
              <Icon size={32} color="#667eea" />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1a1a1a' }}>{tech.name}</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>{tech.desc}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const PublicDatasets = () => {
  const datasets = [
    {
      name: 'SECOM (UCI)',
      url: 'https://archive.ics.uci.edu/dataset/179/secom',
      usage: '공정 센서 → 수율 이상 감지',
    },
    {
      name: '공공데이터포털',
      url: 'https://www.data.go.kr',
      usage: '제조업 생산/불량 통계',
    },
    {
      name: 'IEEE DataPort',
      url: 'https://ieee-dataport.org',
      usage: '실험 기반 센서 데이터',
    },
    {
      name: 'Kaggle 제조',
      url: 'https://www.kaggle.com/search?q=manufacturing+yield',
      usage: '수율 예측 데이터셋 다수',
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
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#1a1a1a' }}>추천 공개 데이터셋</h2>
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {datasets.map((dataset, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02, x: 10 }}
            style={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              padding: '1.5rem',
              borderRadius: '20px',
              cursor: 'pointer',
            }}
          >
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
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const LevelBeginner = () => {
  const [copied, setCopied] = useState(false);

  const promptText = `나는 디스플레이 [주제] 관련 AI 도구를 만들고 싶어.
필요한 기능 5가지, 기술 스택, 전체 폴더 구조를 제안해줘.
Streamlit + Gemini API + Telegram Bot 조합으로 만들어줘.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
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
          Step 1: 아이디어 구체화
        </h3>
        <p style={{ fontSize: '1rem', color: '#666', marginBottom: '1.5rem' }}>
          Gemini에게 다음을 질문하세요:
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
          Step 2: Gemini로 각 파트 순서대로 생성
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
{`프로젝트 폴더/
├── app.py              ← Streamlit UI
├── ai_utils.py         ← Gemini API 함수
├── telegram_bot.py     ← 텔레그램 봇
├── .env                ← API Key (GitHub에 올리지 말 것!)
├── .gitignore
└── requirements.txt`}
        </pre>
        <p style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}>
          Gemini에게 순서대로 요청:
        </p>
        <ol style={{ fontSize: '1rem', lineHeight: '2', color: '#333', paddingLeft: '1.5rem' }}>
          <li>"app.py 파일 만들어줘 — Streamlit으로 [주제] UI"</li>
          <li>"ai_utils.py 만들어줘 — Gemini API 연동"</li>
          <li>"telegram_bot.py 만들어줘 — 수율 임계값 초과 시 알람"</li>
          <li>"requirements.txt와 .gitignore 만들어줘"</li>
        </ol>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', marginBottom: '1rem' }}>
          <Zap size={24} color="#16A085" />
          Step 3: 배포
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
{`# GitHub push
git add app.py ai_utils.py telegram_bot.py requirements.txt .gitignore
git commit -m "Add AI display monitoring system"
git push

# Streamlit Cloud 배포
# share.streamlit.io에서 Repository 연결 → Deploy`}
        </pre>
        <div style={{
          background: '#D1F2EB',
          padding: '1.5rem',
          borderRadius: '15px',
          marginTop: '1.5rem',
          border: '2px solid #16A085'
        }}>
          <strong style={{ color: '#16A085', fontSize: '1.1rem' }}>제출 항목</strong>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem' }}>배포 URL + GitHub Repository URL + 30초 데모 영상 (선택)</p>
        </div>
      </div>
    </motion.div>
  );
};

const LevelIntermediate = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
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
          <li>3가지 이상 기술 스택 조합</li>
          <li>AI API 연동 (Gemini)</li>
          <li>실제 데이터 또는 현실적인 시뮬레이션 데이터 사용</li>
          <li>다른 사람이 실제로 사용할 수 있는 완성도</li>
          <li>README에 사용법 + 기술 스택 + 스크린샷 포함</li>
        </ul>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', marginBottom: '1rem' }}>
          <Wrench size={24} color="#F39C12" />
          힌트
        </h3>
        <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.8' }}>
          완성도보다 <strong>아이디어의 참신함과 현실성</strong>이 더 중요합니다.
          "이 도구가 실제로 디스플레이 공장에서 유용할까?"를 기준으로 평가합니다.
        </p>
        <div style={{
          background: '#FFF3CD',
          padding: '1.5rem',
          borderRadius: '15px',
          marginTop: '1.5rem',
          border: '2px solid #F39C12'
        }}>
          <strong style={{ color: '#F39C12', fontSize: '1.1rem' }}>제출 항목</strong>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem' }}>배포 URL + GitHub Repository URL + README 링크</p>
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
      transition={{ delay: 0.7 }}
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
          <li>디스플레이 실제 공정/데이터 기반 (논문, 특허, 공개 데이터셋)</li>
          <li>4가지 이상 기술 스택 통합</li>
          <li>자동화 파이프라인 포함 (GitHub Actions 또는 스케줄러)</li>
          <li>다국어 지원 (한국어 + 영어)</li>
          <li>사용자 인증 기능 (선택: Firebase Auth 또는 간단한 비밀번호)</li>
          <li>성능 측정 지표 포함 (응답 시간, API 호출 횟수 등)</li>
          <li>실제 사용자 테스트 후 피드백 반영 (README에 테스트 결과 기록)</li>
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
            배포 URL + GitHub URL + 발표 자료 + 2분 데모 영상
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Presentation = () => {
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
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '2rem', marginBottom: '2rem' }}>
        <Users size={32} />
        발표 (16강)
      </h2>
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '1.5rem', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>발표 시간</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>팀/개인당 3분</div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '1.5rem', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>발표 순서</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>시연 → 기술 설명 → 어려웠던 점</div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '1.5rem', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>피드백</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>서로 간단한 피드백 교환</div>
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
      transition={{ delay: 0.9 }}
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
            <tr style={{ background: '#FF6B6B', color: 'white' }}>
              <th style={{ padding: '1rem', textAlign: 'left', borderRadius: '10px 0 0 0' }}>항목</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>배점</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>하</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>중</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderRadius: '0 10px 0 0' }}>상</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: '#f8f9fa' }}>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>문제 정의의 현실성</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>30%</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>기본</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>현실적</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>실제 공정 기반</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>기술 구현 완성도</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>30%</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>동작만</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>완성도 있음</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>CI/CD 포함</td>
            </tr>
            <tr style={{ background: '#f8f9fa' }}>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>배포 및 사용성</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>20%</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>배포만</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>사용 가능</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>다국어 + 인증</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>GitHub 품질</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>20%</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>코드 있음</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>README 완성</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>영문 + 테스트</td>
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
    '주제 선택 및 기술 스택 조합 결정',
    'Gemini로 프로젝트 구조 생성',
    '각 파트별 기능 구현 (app.py, ai_utils.py 등)',
    'AI API 연동 테스트',
    '로컬에서 전체 기능 테스트',
    'GitHub에 push',
    'Streamlit Cloud 또는 기타 플랫폼에 배포',
    'README.md 작성 (사용법, 기술 스택, 스크린샷)',
    '발표 자료 준비 (3분 시연)',
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
      transition={{ delay: 1.0 }}
      style={{
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
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
      transition={{ delay: 1.1 }}
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
          '3가지 이상 기술 스택 조합 완료',
          'AI 도구가 로컬에서 정상 작동',
          'GitHub에 코드 push 완료',
          '배포 완료 (URL 접속 시 정상 작동)',
          'README.md 작성 완료',
          '발표 자료 준비 완료 (3분 시연)',
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
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '20px',
        marginTop: '2rem',
        textAlign: 'center',
      }}>
        <Award size={48} style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.8rem', margin: '0 0 1rem 0' }}>축하합니다!</h3>
        <p style={{ fontSize: '1.2rem', margin: 0, opacity: 0.95 }}>
          AI와 여러 기술을 조합한 디스플레이 도구를 성공적으로 완성했습니다!<br/>
          이제 취업 포트폴리오로 활용할 수 있습니다.
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
      <ProjectImage filename="final-ai-tool-overview.png" caption="Final integrated AI tool overview: upload, analysis, vision inspection, forecasting, report, alert, and portfolio output." />
        <HintLink />
        <ProjectIdeas />
        <TechStack />
        <PublicDatasets />
        <LevelBeginner />
        <LevelIntermediate />
        <LevelAdvanced />
        <Presentation />
        <EvaluationCriteria />
        <InteractiveWorkshop />
        <Summary />
      </div>
    </div>
  );
}

export default App;
