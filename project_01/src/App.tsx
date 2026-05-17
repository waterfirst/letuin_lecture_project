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
  Github,
  Globe,
  Layers,
  Sparkles,
  Terminal,
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
// ============================================================================
// PROJECT 01: Display Portfolio Webpage
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
        <Globe size={48} />
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>프로젝트 1</h1>
          <p style={{ fontSize: '1.3rem', margin: '0.5rem 0 0 0', opacity: 0.95 }}>
            나의 디스플레이 관심 분야 소개 웹페이지
          </p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '1.5rem', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>제출 시기</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>4강 후 1주일 이내</div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '1.5rem', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>주요 도구</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Gemini</div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '1.5rem', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>배포 플랫폼</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>GitHub Pages</div>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectGoal = () => {
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
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1a1a1a' }}>프로젝트 목표</h2>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem', lineHeight: '1.8' }}>
        디스플레이 산업에 대한 관심 분야를 소개하는 <strong>단일 HTML 웹페이지</strong>를 만들고,
        GitHub Pages로 배포하여 포트폴리오로 활용합니다.
        Gemini를 활용하여 코딩 없이도 전문적인 웹페이지를 만들 수 있습니다.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {[
          { icon: Code, title: 'Gemini 활용', desc: 'AI로 코드 자동 생성' },
          { icon: Globe, title: 'GitHub Pages 배포', desc: '무료 웹 호스팅' },
          { icon: FileText, title: '포트폴리오 완성', desc: '취업용 자료로 활용' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                padding: '1.5rem',
                borderRadius: '20px',
                textAlign: 'center',
              }}
            >
              <Icon size={40} color="#667eea" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0', color: '#1a1a1a' }}>{item.title}</h3>
              <p style={{ fontSize: '0.95rem', margin: 0, color: '#666' }}>{item.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const LevelBeginner = () => {
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
        <h2 style={{ fontSize: '2rem', margin: 0, color: '#1a1a1a' }}>단계별 가이드 제공 (완전 초보자)</h2>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', marginBottom: '1rem' }}>
          <Sparkles size={24} color="#16A085" />
          Step 1: Gemini에게 프롬프트 전달
        </h3>
        <p style={{ fontSize: '1rem', color: '#666', marginBottom: '1.5rem' }}>
          Gemini를 열고 아래 프롬프트를 복사하여 실행하세요. [이름], [직무명]을 본인 정보로 수정하세요.
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
            whiteSpace: 'pre-wrap',
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
          <Terminal size={24} color="#16A085" />
          Step 2: 로컬에서 확인
        </h3>
        <p style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}>
          생성된 index.html 파일을 더블클릭하여 브라우저에서 확인합니다.
        </p>
        <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '10px' }}>
          <code style={{ fontSize: '0.95rem', color: '#333' }}>index.html 파일 더블클릭 → 브라우저에서 열림</code>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', marginBottom: '1rem' }}>
          <Github size={24} color="#16A085" />
          Step 3: GitHub Pages로 배포
        </h3>
        <ol style={{ fontSize: '1.1rem', lineHeight: '2', color: '#333', paddingLeft: '1.5rem' }}>
          <li>GitHub에서 새 Repository 생성 (예: my-display-portfolio)</li>
          <li>index.html 파일을 Repository에 업로드</li>
          <li>Settings → Pages → Branch: main → Save</li>
          <li>배포 URL 확인: https://[username].github.io/my-display-portfolio/</li>
        </ol>
        <div style={{
          background: '#D1F2EB',
          padding: '1.5rem',
          borderRadius: '15px',
          marginTop: '1.5rem',
          border: '2px solid #16A085'
        }}>
          <strong style={{ color: '#16A085', fontSize: '1.1rem' }}>제출 항목</strong>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem' }}>GitHub Repository URL + 배포된 웹페이지 URL</p>
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
      transition={{ delay: 0.4 }}
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
        <h2 style={{ fontSize: '2rem', margin: 0, color: '#1a1a1a' }}>힌트만 제공 (스스로 프롬프트 작성)</h2>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a1a1a' }}>요구사항</h3>
        <ul style={{ fontSize: '1.1rem', lineHeight: '2', color: '#333', paddingLeft: '1.5rem' }}>
          <li>단일 HTML 파일 (CSS, JS 모두 포함)</li>
          <li>디스플레이 산업 관련 내용 (OLED, LCD, Micro-LED 등)</li>
          <li>인터랙티브 요소 최소 2개 (버튼 클릭, 탭 전환 등)</li>
          <li>반응형 디자인 (모바일/태블릿/데스크톱)</li>
          <li>GitHub Pages 배포 완료</li>
        </ul>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', marginBottom: '1rem' }}>
          <Wrench size={24} color="#F39C12" />
          힌트
        </h3>
        <div style={{ fontSize: '1rem', color: '#666', lineHeight: '1.8' }}>
          <p><strong>프롬프트 작성 팁:</strong></p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>"디스플레이 기술 비교 테이블을 만들어줘"</li>
            <li>"탭 형태로 OLED/LCD/Micro-LED를 전환할 수 있게 해줘"</li>
            <li>"모던한 그라디언트 배경과 카드 디자인을 사용해줘"</li>
            <li>"모바일에서도 잘 보이도록 반응형으로 만들어줘"</li>
          </ul>
        </div>
        <div style={{
          background: '#FFF3CD',
          padding: '1.5rem',
          borderRadius: '15px',
          marginTop: '1.5rem',
          border: '2px solid #F39C12'
        }}>
          <strong style={{ color: '#F39C12', fontSize: '1.1rem' }}>제출 항목</strong>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem' }}>GitHub Repository URL + 배포된 웹페이지 URL</p>
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
      transition={{ delay: 0.5 }}
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
        <h2 style={{ fontSize: '2rem', margin: 0, color: '#1a1a1a' }}>요구사항만 제시 (힌트 없음)</h2>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '2rem' }}>
        <ol style={{ fontSize: '1.1rem', lineHeight: '2', color: '#333', paddingLeft: '1.5rem' }}>
          <li>단일 HTML 파일 (모든 리소스 내장)</li>
          <li>디스플레이 산업 실제 데이터 포함 (시장 점유율, 기술 비교 등)</li>
          <li>최소 5개 이상의 인터랙티브 요소</li>
          <li>애니메이션 효과 (Fade-in, Slide 등)</li>
          <li>다크모드/라이트모드 토글 기능</li>
          <li>모바일 우선 반응형 디자인</li>
          <li>SEO 최적화 (meta 태그, Open Graph)</li>
          <li>GitHub Pages 배포 + README/스크린샷 정리</li>
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
            GitHub Repository URL + 배포된 웹페이지 URL + README.md (기술 스택 설명)
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
      transition={{ delay: 0.6 }}
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
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>완성도</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>단계별 가이드 따라 완성</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>자율 프롬프트로 완성</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>고급 기능 모두 구현</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>디자인</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>기본 디자인</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>모던한 스타일</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>애니메이션 + 다크모드</td>
            </tr>
            <tr style={{ background: '#f8f9fa' }}>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>반응형</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>데스크톱만</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>모바일 대응</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>완벽한 반응형</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>배포</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>GitHub Pages</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>GitHub Pages</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>README/스크린샷</td>
            </tr>
            <tr style={{ background: '#f8f9fa' }}>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>내용</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>기본 소개</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>기술 비교 포함</td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>실제 데이터 기반</td>
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
    'Gemini로 index.html 생성',
    '로컬에서 브라우저로 확인',
    'GitHub Repository 생성',
    'index.html 파일 업로드',
    'GitHub Pages 설정 완료',
    '배포 URL 접속 확인',
    'README.md 작성 (선택)',
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
      transition={{ delay: 0.7 }}
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
      transition={{ delay: 0.8 }}
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
          'index.html 파일이 생성되었다',
          '로컬 브라우저에서 정상 작동한다',
          'GitHub에 Repository를 만들었다',
          'GitHub Pages가 활성화되었다',
          '배포 URL에 접속하면 웹페이지가 보인다',
          '디스플레이 산업 관련 내용이 포함되어 있다',
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
          첫 번째 웹 포트폴리오를 완성하고 GitHub Pages로 배포하는 데 성공했습니다!<br/>
          이제 이 URL을 이력서에 추가하여 취업 준비에 활용하세요.
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
      <ProjectImage filename="ai-rd-portfolio-overview.png" caption="Manufacturing R&D portfolio overview: problem, data, dashboard result, GitHub Pages, and interview-ready case study." />
        <ProjectGoal />
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
