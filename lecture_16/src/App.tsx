import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Code,
  Copy,
  Database,
  FileText,
  Github,
  Image as ImageIcon,
  Layers,
  Layout,
  Quote,
  Rocket,
  Share2,
  Star,
  Target,
  Wrench,
  Zap,
} from 'lucide-react';

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}${filename}`;

// ============================================================================
// DATA ARRAYS - Integrated Dashboard & Portfolio
// ============================================================================

const learningGoals = [
  {
    step: '학습목표 1',
    title: 'Streamlit 멀티페이지 앱 구성',
    body: 'app.py와 pages/ 구조로 데이터·이미지·센서 페이지를 하나의 웹 앱으로 묶습니다.',
    type: 'api',
  },
  {
    step: '학습목표 2',
    title: '13~15강 기능 통합',
    body: 'DataAnalyzer, ImageInspector, SensorPredictor를 IntegratedAnalyzer로 묶어 통합 리포트를 만듭니다.',
    type: 'knowledge',
  },
  {
    step: '학습목표 3',
    title: 'GitHub 포트폴리오 배포',
    body: 'README.md 작성, Streamlit Cloud 호스팅, GitHub Public 저장소까지 취업용 포트폴리오를 완성합니다.',
    type: 'deploy',
  },
];

const lessonFlow = [
  { time: '3분', label: '목표 확인' },
  { time: '7분', label: '개념·비유' },
  { time: '8분', label: '실무 사례' },
  { time: '17분', label: '지시문·실습' },
  { time: '5분', label: '검증·정리' },
];

const roleFlow = [
  { owner: '엔지니어', task: '페이지 구조 설계, README 작성, 배포 관리' },
  { owner: 'Streamlit', task: '멀티페이지 라우팅, 위젯 UI, 실시간 차트' },
  { owner: 'IntegratedAnalyzer', task: '데이터·이미지·센서 결과 통합' },
  { owner: 'GitHub', task: 'Public 저장소, Streamlit Cloud 자동 배포' },
];

const dashboardFeatures = [
  {
    icon: Database,
    title: '데이터 분석 페이지',
    description: 'CSV 업로드 후 Gemini API로 인사이트를 자동 추출합니다.',
    features: ['file_uploader 위젯', 'dataframe 미리보기', 'Gemini 인사이트 호출'],
    cost: 'Streamlit + Gemini',
    freeQuota: '13강 자산 재사용',
  },
  {
    icon: ImageIcon,
    title: '이미지 검사 페이지',
    description: 'Vision API로 제조 결함을 자동 검출하고 JSON 결과를 표시합니다.',
    features: ['이미지 업로드', '결함 좌표 시각화', 'JSON 결과 표시'],
    cost: 'Vision + PIL',
    freeQuota: '14강 자산 재사용',
  },
  {
    icon: Activity,
    title: '센서 예측 페이지',
    description: 'Prophet 시계열 예측과 이상 알림을 실시간으로 표시합니다.',
    features: ['Prophet 예측 차트', '이상치 알림', '실시간 갱신'],
    cost: 'Prophet + Plotly',
    freeQuota: '15강 자산 재사용',
  },
  {
    icon: BarChart3,
    title: '통합 리포트',
    description: '3개 시스템 결과를 종합해 헬스 스코어로 요약합니다.',
    features: ['통합 메트릭', 'JSON 리포트', '헬스 스코어'],
    cost: 'IntegratedAnalyzer',
    freeQuota: '한 번의 클릭',
  },
];

const fieldScenarios = [
  {
    icon: Database,
    title: '반도체: 통합 운영 대시보드',
    before: '수율 분석, 결함 검사, 센서 모니터링을 각각 다른 스크립트로 실행',
    intent: '세 시스템을 하나의 Streamlit 앱으로 묶고, 사이드바에서 페이지를 전환하면서 통합 리포트를 만들어줘.',
    output: 'Streamlit 앱이 3개 페이지를 통합하고 통합 메트릭/JSON 리포트 제공',
  },
  {
    icon: ImageIcon,
    title: '디스플레이: 라인 통합 모니터',
    before: '패널 검사 결과는 엑셀, 픽셀 결함은 별도 폴더, 알림은 SMS로 분산',
    intent: '검사·결함·알림 데이터를 하나의 페이지에서 차트로 확인할 수 있게 통합해줘.',
    output: '한 화면에서 데이터·이미지·알림을 통합 시각화 + Streamlit Cloud로 공유',
  },
  {
    icon: Github,
    title: '취업 포트폴리오',
    before: '코드는 로컬에만 있고 README 없음, 회사에 보여줄 결과물 부재',
    intent: 'README와 스크린샷, 실행 방법을 정리해 GitHub Public + Streamlit Cloud로 공개해줘.',
    output: 'github.com/username/ai-dashboard 공개 + 채용 담당자가 바로 클릭하는 데모 URL',
  },
];

const setupSteps = [
  { step: '1', title: '프로젝트 구조 생성', body: 'app.py + pages/ + utils/ 폴더', duration: '2분' },
  { step: '2', title: '3개 페이지 작성', body: '데이터/이미지/센서 페이지 통합', duration: '15분' },
  { step: '3', title: 'README & requirements', body: 'README.md, requirements.txt 작성', duration: '5분' },
  { step: '4', title: 'GitHub & Streamlit Cloud', body: 'Public 저장소 푸시, 클라우드 배포', duration: '8분' },
];

const intentChecklist = [
  'Streamlit 멀티페이지 구조(app.py + pages/)가 만들어졌는가?',
  '데이터·이미지·센서 페이지가 모두 동작하는가?',
  'IntegratedAnalyzer가 3개 결과를 하나의 JSON으로 묶는가?',
  'README.md에 기능·기술 스택·실행 방법이 모두 적혔는가?',
  'GitHub Public 저장소와 Streamlit Cloud 데모가 열리는가?',
];

const streamlitVerifyPoints = [
  'app.py가 set_page_config로 wide 레이아웃을 설정하는가?',
  'pages/ 폴더의 파일명이 사이드바 메뉴로 잘 노출되는가?',
  'st.metric, st.dataframe, st.file_uploader가 정상 동작하는가?',
];

const integrationVerifyPoints = [
  'IntegratedAnalyzer가 3개 모듈을 모두 인스턴스화하는가?',
  'generate_report 반환 JSON에 timestamp가 포함되는가?',
  'health_score가 0~100 범위로 계산되는가?',
];

const portfolioVerifyPoints = [
  'README.md에 스크린샷·실행 명령·라이선스가 모두 포함됐는가?',
  '.env.example로 GEMINI_API_KEY 입력 위치를 안내했는가?',
  'Streamlit Cloud 데모 URL이 README 최상단에 있는가?',
];

const dashboardComparison = [
  { model: '통합 Streamlit', price: '무료 Cloud', context: '1개 앱·웹 UI', free: '24/7 공개', score: 96 },
  { model: '개별 스크립트', price: '실행 환경 필수', context: '터미널 출력', free: '공유 어려움', score: 55 },
  { model: '엑셀 + 폴더', price: '수기 정리', context: '시각화 없음', free: '버전 관리 X', score: 40 },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function GoalVisual({ type }: { type: string }) {
  if (type === 'api') {
    return (
      <div className="goal-visual definition">
        <div className="visual-item person">
          <Code size={18} />
          <span>app.py</span>
        </div>
        <ArrowRight size={14} className="visual-arrow" />
        <div className="visual-item ai">
          <Layout size={18} />
          <span>pages/</span>
        </div>
      </div>
    );
  }
  if (type === 'knowledge') {
    return (
      <div className="goal-visual elements">
        <div className="element-tag">데이터</div>
        <div className="element-tag">이미지</div>
        <div className="element-tag">센서</div>
      </div>
    );
  }
  if (type === 'deploy') {
    return (
      <div className="goal-visual field">
        <div className="field-icons">
          <div className="f-icon"><Github size={18} /></div>
          <div className="f-icon"><Cloud size={18} /></div>
        </div>
        <div className="success-indicator">
          <CheckCircle2 size={12} />
          <span>Public 배포 완료</span>
        </div>
      </div>
    );
  }
  return null;
}

function DashboardChart() {
  const max = Math.max(...dashboardComparison.map((item) => item.score));

  return (
    <div className="visual-card">
      <div className="visual-header">
        <span>관리 방식 비교</span>
        <strong>종합 점수</strong>
      </div>
      <div className="bar-chart" role="img" aria-label="대시보드 통합 방식 비교 차트">
        {dashboardComparison.map((item) => (
          <div className="bar-row" key={item.model}>
            <span>{item.model}</span>
            <div>
              <i style={{ width: `${(item.score / max) * 100}%` }} />
            </div>
            <strong>{item.score}</strong>
          </div>
        ))}
      </div>
      <p>Streamlit 통합 앱은 웹 UI, 24/7 공유, 무료 클라우드 호스팅까지 한 번에 해결합니다.</p>
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

function StreamlitDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 01 Deep Dive</span>
        <h3>Streamlit 멀티페이지 구조: app.py + pages/ 하나로 묶기</h3>
        <p>
          분산된 .py 스크립트를 Streamlit 멀티페이지 앱으로 정리하면, 사이드바 자동 메뉴와
          공통 위젯으로 데이터·이미지·센서 페이지를 한 번에 운영할 수 있습니다.
        </p>
        <LectureImage
          src="lecture-16-dashboard.png"
          alt="Streamlit app.py와 pages/ 폴더 구조, 사이드바 자동 메뉴 다이어그램"
          caption="app.py는 메인 페이지, pages/ 폴더의 파일이 자동으로 사이드바 메뉴가 됩니다."
        />
      </div>

      <div className="yield-case-compare vertical-case-flow" aria-label="Streamlit 멀티페이지 Before Prompt After">
        <article className="yield-case-panel manual-panel">
          <span>Before: 분산된 .py 스크립트</span>
          <h4>analyze_data.py, check_images.py, monitor_sensors.py를 각각 터미널로 실행</h4>
          <ul>
            <li>기능마다 별도 파이썬 파일을 따로 실행</li>
            <li>결과는 print 출력 또는 로컬 CSV로만 확인</li>
            <li>동료와 공유하려면 환경 설치부터 다시 안내</li>
            <li>실시간 차트나 위젯이 없어 보고용으로 부적합</li>
          </ul>
          <div className="mini-excel dense-excel">
            <strong>분산 스크립트 흐름</strong>
            <div style={{ padding: '1rem', background: '#f5f5f7', borderRadius: '8px', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                1. python analyze_data.py<br/>
                2. python check_images.py<br/>
                3. python monitor_sensors.py<br/>
                4. 결과를 엑셀로 옮겨 보고<br/>
                5. 매번 환경/경로 설명 반복
              </p>
            </div>
          </div>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: Streamlit 통합 지시</span>
          <h4>app.py + pages/ 구조로 한 번에 묶어주세요</h4>
          <p>
            "Streamlit 멀티페이지 구조로 묶어줘. app.py는 set_page_config(layout='wide')과
            대시보드 메트릭을 보여주고, pages/ 폴더에 데이터분석/이미지검사/센서예측 페이지를
            한국어 파일명으로 만들어줘. 각 페이지에는 file_uploader, dataframe, button 위젯과
            결과 표시 영역을 배치해줘."
          </p>
          <div className="aoi-rule-grid sensor-rule-grid">
            <div><strong>app.py</strong><span>set_page_config + metric</span></div>
            <div><strong>pages/</strong><span>한국어 파일명 자동 메뉴</span></div>
            <div><strong>위젯</strong><span>file_uploader, dataframe</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 산출물</span>
          <h4>streamlit run app.py 한 줄로 통합 대시보드가 열립니다</h4>
          <div className="code-preview-box">
            <div className="visual-header">
              <span>Streamlit App</span>
              <strong>app.py + pages/</strong>
            </div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.82rem', overflow: 'auto' }}>{`ai_dashboard/
├── app.py
├── pages/
│   ├── 1_데이터분석.py
│   ├── 2_이미지검사.py
│   └── 3_센서예측.py
├── utils/
│   ├── data_analyzer.py
│   ├── image_inspector.py
│   └── sensor_predictor.py
├── requirements.txt
└── README.md

# app.py
import streamlit as st

st.set_page_config(page_title="AI Dashboard", layout="wide")
st.title("AI 자동화 통합 대시보드")
st.markdown("13~15강 모든 기능 통합")

col1, col2, col3 = st.columns(3)
with col1:
    st.metric("총 분석", "1,234", "+12%")
with col2:
    st.metric("이미지 검사", "567", "+8%")
with col3:
    st.metric("센서 알림", "89", "-5%")

# pages/1_데이터분석.py
import streamlit as st
import pandas as pd

st.title("데이터 분석")
uploaded_file = st.file_uploader("CSV 업로드", type="csv")
if uploaded_file:
    df = pd.read_csv(uploaded_file)
    st.dataframe(df)
    if st.button("Gemini 분석 실행"):
        insights = get_gemini_insights(df)
        st.success("분석 완료!")
        st.write(insights)`}</pre>
          </div>
          <div className="aoi-impact-strip sensor-impact-strip">
            <div><strong>3개 → 1개</strong><span>실행 명령 단순화</span></div>
            <div><strong>웹 UI</strong><span>file_uploader/metric</span></div>
            <div><strong>자동 메뉴</strong><span>pages/ 파일명 기반</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 Streamlit이 자동으로 라우팅을 만들어주는 구조를 활용해, 13~15강에서 만든
        모듈을 그대로 import해 페이지로 노출하는 것입니다.
      </p>
      <VerifyChecklist points={streamlitVerifyPoints} />
    </div>
  );
}

function IntegrationDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 02 Deep Dive</span>
        <h3>3개 시스템 통합: IntegratedAnalyzer로 한 번에 리포트 만들기</h3>
        <p>
          DataAnalyzer, ImageInspector, SensorPredictor를 한 클래스로 감싸고 generate_report()를
          호출하면, 세 시스템의 최신 결과가 하나의 JSON으로 정리됩니다.
        </p>
        <LectureImage
          src="lecture-16-dashboard.png"
          alt="IntegratedAnalyzer가 데이터·이미지·센서 결과를 통합 리포트로 합치는 구조"
          caption="한 번의 호출로 3개 모듈 결과를 합치고, 통합 메트릭과 헬스 스코어까지 함께 반환합니다."
        />
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: 결과 수동 조합</span>
          <h4>분석 결과를 엑셀에 직접 옮겨 비교</h4>
          <ul>
            <li>데이터 분석 결과는 CSV, 이미지 결함은 JSON, 센서 알림은 로그</li>
            <li>3가지 결과를 사람이 엑셀에 복사·붙여넣기로 정리</li>
            <li>버전·시점이 어긋나 어제/오늘 자료가 섞이기 쉬움</li>
            <li>헬스 스코어 같은 종합 지표는 만들 수 없음</li>
          </ul>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: 통합 리포트 지시</span>
          <h4>IntegratedAnalyzer 클래스로 묶어주세요</h4>
          <p>
            "DataAnalyzer, ImageInspector, SensorPredictor를 멤버로 갖는 IntegratedAnalyzer
            클래스를 만들어줘. generate_report()는 timestamp, data, image, sensor, health_score
            키를 갖는 dict를 반환하고, calculate_health()로 0~100 점수를 계산해줘."
          </p>
          <div className="aoi-rule-grid">
            <div><strong>클래스</strong><span>IntegratedAnalyzer</span></div>
            <div><strong>출력</strong><span>timestamp + 3개 결과 + score</span></div>
            <div><strong>호출</strong><span>generate_report() 한 줄</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 산출물</span>
          <h4>Streamlit 버튼 한 번이면 통합 리포트가 화면에 뜹니다</h4>
          <div className="notebooklm-result-box">
            <div className="visual-header">
              <span>Integrated Report</span>
              <strong>JSON 통합 출력</strong>
            </div>
            <div style={{ padding: '1rem', background: '#f0f7ff', borderRadius: '8px', border: '1px solid #d1e7ff' }}>
              <pre style={{ fontSize: '0.82rem', lineHeight: '1.7', color: '#1d1d1f', margin: 0 }}>{`# utils/integrated_analyzer.py
class IntegratedAnalyzer:
    def __init__(self):
        self.data_analyzer = DataAnalyzer()
        self.image_inspector = ImageInspector()
        self.sensor_predictor = SensorPredictor()

    def generate_report(self):
        data_results = self.data_analyzer.get_latest()
        image_results = self.image_inspector.get_summary()
        sensor_results = self.sensor_predictor.get_alerts()

        return {
          'timestamp': datetime.now(),
          'data': data_results,
          'image': image_results,
          'sensor': sensor_results,
          'health_score': self.calculate_health(),
        }

# pages/통합리포트.py
if st.button("통합 리포트 생성"):
    report = IntegratedAnalyzer().generate_report()
    col1, col2, col3 = st.columns(3)
    col1.metric("데이터", report['data']['status'])
    col2.metric("불량", report['image']['defects'])
    col3.metric("알림", report['sensor']['alerts'])
    st.json(report)`}</pre>
            </div>
          </div>
          <div className="aoi-impact-strip">
            <div><strong>1회 클릭</strong><span>3개 결과 동시 갱신</span></div>
            <div><strong>일관된 시점</strong><span>timestamp 공유</span></div>
            <div><strong>헬스 스코어</strong><span>0~100 종합 지표</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 3개 모듈을 강제로 합치는 것이 아니라, 인터페이스(get_latest/get_summary/get_alerts)를
        통일해 IntegratedAnalyzer가 그대로 조립할 수 있도록 만드는 것입니다.
      </p>
      <VerifyChecklist points={integrationVerifyPoints} />
    </div>
  );
}

function PortfolioDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 03 Deep Dive</span>
        <h3>GitHub & Streamlit Cloud: 채용 담당자가 바로 클릭하는 포트폴리오</h3>
        <p>
          README, requirements.txt, .env.example을 갖춘 Public 저장소를 만들고 Streamlit Cloud에
          연결하면, 누구나 데모 URL 하나로 프로젝트를 체험할 수 있습니다.
        </p>
        <LectureImage
          src="lecture-16-dashboard.png"
          alt="GitHub Public 저장소와 Streamlit Cloud 배포 흐름"
          caption="git push가 일어나면 GitHub Actions가 검사하고 Streamlit Cloud가 자동으로 배포합니다."
          variant="poster"
        />
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: 로컬에만 있는 코드</span>
          <h4>면접 때 노트북을 열어 보여줘야 하는 프로젝트</h4>
          <ul>
            <li>README가 없거나 한 줄짜리</li>
            <li>requirements.txt 없이 패키지 버전 일치 어려움</li>
            <li>채용 담당자는 코드를 실행해보지 못하고 글만 읽음</li>
            <li>면접에서 시간 안에 시연이 어려움</li>
          </ul>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: 포트폴리오 배포 지시</span>
          <h4>README와 클라우드 배포까지 한 번에 정리해주세요</h4>
          <p>
            "AI 자동화 통합 대시보드 README를 작성해줘. 주요 기능, 기술 스택, 실행 방법
            (git clone, pip install, .env 설정, streamlit run), 스크린샷 위치, 라이선스(MIT)를
            포함하고, GitHub Public 저장소와 Streamlit Cloud 무료 호스팅을 연결하는 절차도
            함께 알려줘."
          </p>
          <div className="aoi-rule-grid sensor-rule-grid">
            <div><strong>README</strong><span>기능·스택·실행</span></div>
            <div><strong>GitHub</strong><span>Public 저장소</span></div>
            <div><strong>Streamlit Cloud</strong><span>무료 호스팅 URL</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 산출물</span>
          <h4>README + 데모 URL이 채용 담당자 손에 바로 닿습니다</h4>
          <div className="firebase-result-box">
            <div className="visual-header">
              <span>Portfolio Package</span>
              <strong>README + Cloud URL</strong>
            </div>
            <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <pre style={{ fontSize: '0.82rem', lineHeight: '1.7', color: '#1d1d1f', margin: 0 }}>{`# AI 자동화 통합 대시보드

제조 현장 데이터 분석, 이미지 검사, 센서 예측을
하나로 통합한 Streamlit 웹 대시보드.

## 주요 기능
- 데이터 분석: CSV 업로드 → Gemini 인사이트
- 이미지 검사: Vision API 결함 검출
- 센서 예측: Prophet 시계열 + 알림

## 기술 스택
- Python 3.10+, Streamlit, Gemini API
- Prophet, Plotly, Pandas

## 실행 방법
git clone https://github.com/username/ai-dashboard.git
cd ai-dashboard
pip install -r requirements.txt
cp .env.example .env  # GEMINI_API_KEY 입력
streamlit run app.py

## 데모
https://ai-dashboard.streamlit.app

## 라이선스
MIT License`}</pre>
            </div>
          </div>
          <div className="aoi-impact-strip sensor-impact-strip">
            <div><strong>Public 공개</strong><span>채용 담당자 즉시 확인</span></div>
            <div><strong>데모 URL</strong><span>설치 없이 클릭 실행</span></div>
            <div><strong>자동 배포</strong><span>git push → 자동 빌드</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 "코드가 깔끔한가"가 아니라 "처음 보는 사람도 5분 안에 실행해볼 수 있는가"입니다.
        README와 데모 URL이 두 가지 모두를 책임집니다.
      </p>
      <VerifyChecklist points={portfolioVerifyPoints} />
    </div>
  );
}

function InteractiveWorkshop() {
  const [fields, setFields] = useState({
    streamlit: '',
    integration: '',
    portfolio: '',
  });
  const [copied, setCopied] = useState(false);

  const hasContent = Object.values(fields).some(Boolean);

  const generated = hasContent
    ? `1. Streamlit 구조: ${fields.streamlit || '[예: app.py + pages/ 3개 + utils/]'}
2. 통합 리포트: ${fields.integration || '[예: IntegratedAnalyzer.generate_report()]'}
3. 포트폴리오 배포: ${fields.portfolio || '[예: GitHub Public + Streamlit Cloud URL]'}

다음 단계: 로컬 streamlit run → GitHub push → Streamlit Cloud 연결`
    : '';

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const inputRows: { key: keyof typeof fields; label: string; placeholder: string }[] = [
    { key: 'streamlit', label: 'Streamlit 구조', placeholder: '예: app.py + pages/1_데이터분석.py 등 3개 페이지' },
    { key: 'integration', label: '통합 리포트 구성', placeholder: '예: IntegratedAnalyzer.generate_report() + health_score' },
    { key: 'portfolio', label: '포트폴리오 배포', placeholder: '예: GitHub Public + Streamlit Cloud 데모 URL' },
  ];

  return (
    <div className="interactive-workshop">
      <div className="iw-header">
        <Layout size={22} color="var(--accent)" />
        <strong>3단계 통합 대시보드 체크</strong>
        <p>구조·통합·배포를 입력하면 실습 체크리스트가 자동 생성됩니다.</p>
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
            <Rocket size={18} color="var(--accent)" />
            <strong>실습 체크리스트</strong>
          </div>
          <div className={`iw-generated-text ${hasContent ? 'active' : ''}`}>
            {generated || '위 3단계를 입력하면\n실습 체크리스트가 표시됩니다.'}
          </div>
          <button
            className={`iw-copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            disabled={!hasContent}
          >
            {copied
              ? <><Check size={15} />복사됨!</>
              : <><Copy size={15} />체크리스트 복사</>}
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
        <ChevronRight size={18} color="var(--accent)" />
        <strong>지금 바로 해보기 — 통합 대시보드 첫 배포</strong>
      </div>
      <div className="frg-steps">
        {setupSteps.map((item) => (
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
        <span>17강 미리보기</span>
        <h3>기술 면접 & 피칭: 포트폴리오를 무기로 만드는 법</h3>
        <p>완성된 통합 대시보드를 자기소개·면접·피칭 자료로 어떻게 활용할지, STAR 기법과 함께 정리합니다.</p>
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
            <span className="header-tag">통합 대시보드 & 포트폴리오 완성</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Ch.16 통합 대시보드 & 포트폴리오</h1>
          <p className="subtitle">13~15강 기능을 Streamlit으로 통합하고 GitHub Public + Streamlit Cloud로 공개합니다</p>
          <div className="lesson-meta" aria-label="lesson summary">
            <span>40분</span>
            <span>실습 중심</span>
            <span>Streamlit + GitHub</span>
            <span>결과물: Public 데모 URL</span>
          </div>
        </motion.div>
      </header>

      <main>
        <section className="overview-section">
          <span className="section-label">01. 오프닝 및 학습목표</span>
          <h2>오늘 여러분은 13~15강을 묶어 <mark>통합 대시보드 포트폴리오</mark>를 완성합니다</h2>
          <p className="section-intro">
            분산된 분석 스크립트를 Streamlit 멀티페이지로 묶고, IntegratedAnalyzer로 결과를
            합친 다음, GitHub Public + Streamlit Cloud로 누구나 클릭 가능한 데모로 공개합니다.
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
              src={assetUrl('lecture-16-dashboard.png')}
              alt="통합 대시보드 코믹"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          </div>
        </section>

        <section className="definition-section">
          <span className="section-label">02. 통합 대시보드란?</span>
          <h2>Streamlit + 통합 클래스 + Public 배포가 합쳐진 <mark>한 화면 운영 시스템</mark>입니다</h2>
          <p className="section-intro">
            데이터 분석, 이미지 검사, 센서 예측이 모두 한 곳에 모이고, 사이드바 하나로 전환되며,
            URL 하나로 누구에게나 공유됩니다.
          </p>
          <div className="one-line-definition inline-definition">
            <span>한 문장 정의</span>
            <strong>통합 대시보드는 13~15강 결과를 Streamlit 멀티페이지 + 통합 리포트 + Public 배포로 묶은 운영 가능한 포트폴리오입니다.</strong>
          </div>
          <LectureImage
            src="integrated-dashboard-overview.png"
            alt="데이터 분석, 이미지 검사, 센서 예측, 통합 리포트가 하나의 대시보드로 묶이는 개요"
            caption="데이터·이미지·센서·리포트·포트폴리오까지 하나의 Streamlit 앱으로 패키징합니다."
          />
          <div className="role-flow" aria-label="통합 대시보드 역할 분리">
            {roleFlow.map((item, index) => (
              <div className="role-step" key={`${item.owner}-${item.task}`}>
                <span>{item.owner}</span>
                <strong>{item.task}</strong>
                {index < roleFlow.length - 1 && <ArrowRight size={22} />}
              </div>
            ))}
          </div>
          <div className="scenario-grid">
            {dashboardFeatures.map((item) => {
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
                    <span>대표 위젯/기능</span>
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
              <img src={assetUrl('lecture-16-dashboard.png')} alt="분산된 개별 스크립트" />
              <div className="compare-content">
                <span className="compare-kicker">Traditional (Separate Scripts)</span>
                <h3>기능마다 따로 실행하는 개별 스크립트</h3>
                <p>
                  데이터 분석, 이미지 검사, 센서 예측이 각각 다른 .py 파일에 흩어져 있어
                  실행 명령과 결과 경로가 매번 달라지고, 공유와 시각화가 어렵습니다.
                </p>
                <ul>
                  <li>매번 터미널에서 별도 명령 실행</li>
                  <li>결과를 사람이 엑셀에 옮겨 정리</li>
                  <li>README 없음, 공유·재현 어려움</li>
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
              <img src={assetUrl('lecture-16-dashboard.png')} alt="Streamlit 통합 대시보드" />
              <div className="compare-content">
                <span className="compare-kicker">Integrated Dashboard (Streamlit + GitHub)</span>
                <h3>한 화면·한 URL로 운영되는 통합 대시보드</h3>
                <p>
                  Streamlit 멀티페이지로 3개 시스템을 묶고, IntegratedAnalyzer로 결과를
                  합쳐 GitHub Public 저장소와 Streamlit Cloud URL로 누구에게나 공유합니다.
                </p>
                <ul>
                  <li>streamlit run app.py 한 줄로 실행</li>
                  <li>통합 메트릭과 JSON 리포트 자동 생성</li>
                  <li>Public URL로 채용 담당자가 즉시 시연 가능</li>
                </ul>
              </div>
            </motion.article>
          </div>
        </section>

        <section>
          <span className="section-label">03. 왜 통합 대시보드인가?</span>
          <h2>분산 스크립트·엑셀 폴더 대비 운영성과 공유성에서 차원이 다릅니다</h2>
          <p className="section-intro">
            개별 스크립트는 실행할 사람만 결과를 봅니다. 통합 대시보드는 한 URL로 누구나 보며,
            결과는 항상 같은 인터페이스로 정리됩니다.
          </p>
          <DashboardChart />
          <div className="highlight-box" style={{ background: '#f5f5f7', borderLeftColor: '#333' }}>
            <p style={{ fontWeight: 700 }}>Target Point:</p>
            <p>"통합 대시보드의 진짜 가치는 화려한 UI가 아니라, 13~15강 결과를 한 URL로 24/7 공유하면서 통합 리포트로 운영 의사결정을 돕는다는 점입니다."</p>
          </div>
        </section>

        <section>
          <span className="section-label">04. 첨단 공정기술 사례</span>
          <h2>반도체·디스플레이·취업 포트폴리오에 통합 대시보드를 적용하는 법</h2>
          <p className="section-intro">
            현장 운영 모니터링, 라인 통합 대시보드, 그리고 채용용 포트폴리오까지 — 통합
            대시보드는 같은 구조로 모두 활용 가능합니다.
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
                    <span>의도 지시문</span>
                    <p>{item.intent}</p>
                  </div>
                  <p className="scenario-output">{item.output}</p>
                </motion.div>
              );
            })}
          </div>
          <StreamlitDeepDive />
          <IntegrationDeepDive />
          <PortfolioDeepDive />
        </section>

        <section className="workshop-section teaching-section">
          <span className="section-label">05. 미니 워크숍</span>
          <h2>실습: 내 첫 <mark>통합 대시보드 포트폴리오</mark> 설계하기</h2>
          <p className="section-intro">
            구조·통합·배포 3단계를 정의해 체크리스트로 복사한 뒤, 로컬 실행 → GitHub 푸시 →
            Streamlit Cloud 배포 순으로 차례대로 진행하세요.
          </p>
          <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <img
              src={assetUrl('lecture-16-dashboard.png')}
              alt="통합 대시보드 실습 가이드"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>
          <InteractiveWorkshop />
          <FirstRunGuide />
        </section>

        <section>
          <span className="section-label">06. 품질 점검 및 정리</span>
          <h2>배포 전, 이 5가지만 확인하세요</h2>
          <div className="checklist">
            {intentChecklist.map((item) => (
              <div className="check-item" key={item}>
                <CheckCircle2 size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="wrap-message">
            <Quote size={36} color="var(--accent)" />
            <h3>"통합 대시보드의 본질은 '한 URL로 시연 가능한 운영 가능한 포트폴리오'입니다. 코드의 양보다 사용자가 5분 안에 체험할 수 있는지가 중요합니다."</h3>
            <p>다음 강의: 기술 면접 & 피칭 — 포트폴리오를 무기로 (17강)</p>
          </div>
          <NextLecturePreview />
        </section>

        <section className="professional-point">
          <div className="highlight-box" style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '24px' }}>
            <h3>Advanced Process Engineering Point</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '1rem', fontSize: '1.1rem' }}>
              "통합 대시보드는 기능을 새로 만드는 것이 아니라, 13~15강에서 만든 모듈을 동일한 인터페이스로
              묶고 한 URL로 공개하는 작업입니다. 엔지니어가 인터페이스를 정의하고, Streamlit이 화면을 만들며,
              GitHub과 Streamlit Cloud가 배포를 책임집니다."<br/>
              결과물은 코드가 아니라 '클릭 가능한 시연'입니다.
            </p>
            <div className="point-strip">
              <span><Layout size={16} /> Streamlit은 화면 엔진</span>
              <span><Layers size={16} /> IntegratedAnalyzer는 통합 허브</span>
              <span><Github size={16} /> GitHub은 시연 채널</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 Integrated Dashboard for Fine Tech Engineering | LettUin Edu</p>
      </footer>
    </div>
  );
}
