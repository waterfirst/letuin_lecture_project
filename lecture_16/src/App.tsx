import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Layout, Globe, Github, CheckCircle2, XCircle, Code,
  Layers, Database, Image, Activity, Zap, FileText, Download,
  Share2, Star, Eye, ChevronRight, Terminal, Rocket, Target, Settings,
  Users, Package, Cloud, Smartphone, Mail, Bell
} from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <Hero />
      <ProblemStatement />
      <DashboardOverview />
      <BeforeAfterComparison />
      <StreamlitDeepDive />
      <IntegrationDeepDive />
      <PortfolioDeepDive />
      <InteractiveWorkshop />
      <VerificationChecklist />
      <NextSteps />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <motion.header initial={{ y: -100 }} animate={{ y: 0 }}
      className="bg-black/30 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layout className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Lecture 16</h1>
            <p className="text-sm text-purple-300">통합 대시보드 & 포트폴리오 완성</p>
          </div>
        </div>
        <span className="px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm">
          Final Integration
        </span>
      </div>
    </motion.header>
  );
}

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-block mb-6 relative">
          <Layout className="w-24 h-24 text-purple-400 mx-auto" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute -top-2 -right-2">
            <Rocket className="w-12 h-12 text-green-400" />
          </motion.div>
        </motion.div>
        <h1 className="text-6xl font-bold text-white mb-6">통합 대시보드 & 포트폴리오</h1>
        <p className="text-3xl text-purple-300 mb-4">13~15강의 모든 기능을 하나로 통합하세요</p>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto">
          데이터 분석, 이미지 검사, 센서 예측을 한 화면에서 관리하고<br/>
          GitHub 포트폴리오로 취업 시장에 공개합니다.
        </p>
      </motion.div>
    </section>
  );
}

function ProblemStatement() {
  const problems = [
    { icon: Layers, title: '분산된 스크립트', description: '기능별로 따로 실행', impact: '관리 어려움', color: '#E74C3C' },
    { icon: Eye, title: '시각화 부족', description: '터미널 출력만 존재', impact: '직관성 저하', color: '#E67E22' },
    { icon: Share2, title: '공유 불가', description: '다른 사람 실행 어려움', impact: '협업 장벽', color: '#F39C12' },
    { icon: FileText, title: '문서화 미흡', description: 'README 없음', impact: '이해도 저하', color: '#C0392B' }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2 initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        className="text-4xl font-bold text-white mb-12 text-center">
        개별 스크립트의 한계
      </motion.h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {problems.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <p.icon className="w-12 h-12 mb-4" style={{ color: p.color }} />
            <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
            <p className="text-gray-300 mb-4 text-sm">{p.description}</p>
            <div className="px-3 py-2 bg-red-500/20 rounded-lg">
              <p className="text-red-300 text-sm font-semibold">📉 {p.impact}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        className="bg-gradient-to-r from-purple-500/20 to-green-500/20 rounded-2xl p-8 border border-purple-500/30">
        <div className="flex items-start gap-4">
          <Layout className="w-16 h-16 text-purple-400 flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">통합 대시보드 솔루션</h3>
            <p className="text-xl text-gray-200 mb-4">
              모든 기능을 Streamlit 웹 앱으로 통합하고, GitHub에 포트폴리오로 공개하여 누구나 접근 가능하게 만듭니다.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-black/30 rounded-lg p-4">
                <p className="text-green-400 text-2xl font-bold mb-1">1개</p>
                <p className="text-gray-300 text-sm">통합 웹 앱</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <p className="text-blue-400 text-2xl font-bold mb-1">3개</p>
                <p className="text-gray-300 text-sm">페이지</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <p className="text-purple-400 text-2xl font-bold mb-1">Public</p>
                <p className="text-gray-300 text-sm">GitHub 배포</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function DashboardOverview() {
  const features = [
    { icon: Database, title: '데이터 분석', desc: 'CSV 업로드 & Gemini 인사이트', color: '#3498DB' },
    { icon: Image, title: '이미지 검사', desc: 'Vision API 결함 검출', color: '#9B59B6' },
    { icon: Activity, title: '센서 예측', desc: 'Prophet 시계열 & 알림', color: '#1ABC9C' },
    { icon: BarChart3, title: '통합 리포트', desc: '모든 결과 종합 표시', color: '#E67E22' }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2 initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        className="text-4xl font-bold text-white mb-12 text-center">
        통합 대시보드 구성
      </motion.h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.15 }} className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <div className="bg-purple-500/20 rounded-xl p-3 mb-4 w-fit">
              <f.icon className="w-10 h-10" style={{ color: f.color }} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{f.title}</h3>
            <p className="text-gray-300 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function BeforeAfterComparison() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2 initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        className="text-4xl font-bold text-white mb-12 text-center">
        Before vs After: 프로젝트 통합
      </motion.h2>
      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}
          className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-red-500/30">
          <div className="flex items-center gap-3 mb-6">
            <XCircle className="w-10 h-10 text-red-400" />
            <h3 className="text-3xl font-bold text-white">Before</h3>
          </div>
          <div className="space-y-6">
            <div className="bg-black/40 rounded-xl p-6">
              <h4 className="text-red-300 font-bold mb-3">개별 스크립트</h4>
              <div className="space-y-3 text-gray-300 text-sm">
                <p className="flex gap-2"><span className="text-red-400">❌</span>analyze_data.py</p>
                <p className="flex gap-2"><span className="text-red-400">❌</span>check_images.py</p>
                <p className="flex gap-2"><span className="text-red-400">❌</span>monitor_sensors.py</p>
                <p className="flex gap-2"><span className="text-red-400">❌</span>각각 따로 실행</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-green-500/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-purple-500/50">
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-10 h-10 text-purple-400" />
            <h3 className="text-3xl font-bold text-white">Prompt</h3>
          </div>
          <div className="bg-black/60 rounded-xl p-6 font-mono text-sm mb-6">
            <div className="text-green-400 mb-4"># Streamlit 멀티페이지</div>
            <pre className="text-gray-300 whitespace-pre-wrap text-xs">
{`import streamlit as st

st.title("AI 자동화 대시보드")

page = st.sidebar.selectbox(
  "페이지 선택",
  ["데이터 분석",
   "이미지 검사",
   "센서 예측"]
)

if page == "데이터 분석":
    run_data_analysis()
elif page == "이미지 검사":
    run_image_inspection()
else:
    run_sensor_prediction()`}
            </pre>
          </div>
          <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/40">
            <p className="text-purple-300 text-sm font-semibold mb-2">✨ 핵심</p>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• 하나의 웹 앱으로 통합</li>
              <li>• 사이드바 메뉴</li>
              <li>• 실시간 UI</li>
            </ul>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
          className="bg-green-500/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-green-500/30">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
            <h3 className="text-3xl font-bold text-white">After</h3>
          </div>
          <div className="space-y-6">
            <div className="bg-black/40 rounded-xl p-6">
              <h4 className="text-green-300 font-bold mb-3">통합 대시보드</h4>
              <div className="space-y-3 text-gray-300 text-sm">
                <p className="flex gap-2"><span className="text-green-400">✅</span>1개 웹 앱</p>
                <p className="flex gap-2"><span className="text-green-400">✅</span>3개 페이지 통합</p>
                <p className="flex gap-2"><span className="text-green-400">✅</span>실시간 차트</p>
                <p className="flex gap-2"><span className="text-green-400">✅</span>GitHub 배포</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        className="mt-12 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-8 border border-green-500/30">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">통합 효과</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-green-400 mb-2">3→1</p>
            <p className="text-gray-300">스크립트 통합</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-400 mb-2">100%</p>
            <p className="text-gray-300">웹 UI 제공</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-purple-400 mb-2">Public</p>
            <p className="text-gray-300">GitHub 공개</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-pink-400 mb-2">24/7</p>
            <p className="text-gray-300">클라우드 운영</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function StreamlitDeepDive() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-12 border-2 border-indigo-500/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-indigo-500/30 rounded-2xl p-4">
            <Layout className="w-12 h-12 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Deep Dive 1</h2>
            <p className="text-2xl text-indigo-300">Streamlit 멀티페이지 구조</p>
          </div>
        </div>
        <div className="bg-black/40 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">프로젝트 구조</h3>
          <div className="bg-black/60 rounded-xl p-6 font-mono text-xs">
            <pre className="text-gray-300 whitespace-pre-wrap">
{`ai_dashboard/
├── app.py                    # 메인 앱
├── pages/
│   ├── 1_📊_데이터분석.py
│   ├── 2_📷_이미지검사.py
│   └── 3_📈_센서예측.py
├── utils/
│   ├── data_analyzer.py
│   ├── image_inspector.py
│   └── sensor_predictor.py
├── requirements.txt
└── README.md

# app.py
import streamlit as st

st.set_page_config(page_title="AI Dashboard", layout="wide")
st.title("🚀 AI 자동화 통합 대시보드")
st.markdown("13~15강 모든 기능 통합")

col1, col2, col3 = st.columns(3)
with col1:
    st.metric("총 분석", "1,234", "+12%")
with col2:
    st.metric("이미지 검사", "567", "+8%")
with col3:
    st.metric("센서 알림", "89", "-5%")

# pages/1_📊_데이터분석.py
import streamlit as st
import pandas as pd

st.title("📊 데이터 분석")

uploaded_file = st.file_uploader("CSV 업로드", type="csv")
if uploaded_file:
    df = pd.read_csv(uploaded_file)
    st.dataframe(df)

    if st.button("Gemini 분석 실행"):
        insights = get_gemini_insights(df)
        st.success("분석 완료!")
        st.write(insights)`}
            </pre>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-indigo-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-3">📁 구조</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• app.py: 메인 페이지</li>
                <li>• pages/: 서브 페이지</li>
                <li>• utils/: 유틸리티</li>
              </ul>
            </div>
            <div className="bg-blue-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-3">🎨 위젯</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• file_uploader</li>
                <li>• dataframe</li>
                <li>• button, metric</li>
              </ul>
            </div>
            <div className="bg-purple-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-3">⚡ 실행</h4>
              <p className="text-gray-300 text-sm">streamlit run app.py</p>
              <p className="text-gray-400 text-xs mt-2">자동으로 브라우저 열림</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function IntegrationDeepDive() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-lg rounded-3xl p-12 border-2 border-green-500/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-green-500/30 rounded-2xl p-4">
            <Layers className="w-12 h-12 text-green-300" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Deep Dive 2</h2>
            <p className="text-2xl text-green-300">3개 시스템 통합</p>
          </div>
        </div>
        <div className="bg-black/40 rounded-2xl p-8">
          <div className="bg-black/60 rounded-xl p-6 font-mono text-xs">
            <pre className="text-gray-300 whitespace-pre-wrap">
{`# utils/integrated_analyzer.py
class IntegratedAnalyzer:
    def __init__(self):
        self.data_analyzer = DataAnalyzer()
        self.image_inspector = ImageInspector()
        self.sensor_predictor = SensorPredictor()

    def generate_report(self):
        """모든 분석 결과 통합"""

        # 1. 데이터 분석
        data_results = self.data_analyzer.get_latest()

        # 2. 이미지 검사
        image_results = self.image_inspector.get_summary()

        # 3. 센서 예측
        sensor_results = self.sensor_predictor.get_alerts()

        # 4. 통합 리포트
        report = {
            'timestamp': datetime.now(),
            'data': {
                'status': data_results['status'],
                'insights': data_results['insights']
            },
            'image': {
                'total': image_results['count'],
                'defects': image_results['defects']
            },
            'sensor': {
                'alerts': sensor_results['alerts'],
                'predictions': sensor_results['predictions']
            },
            'health_score': self.calculate_health()
        }

        return report

# Streamlit에서 사용
if st.button("통합 리포트 생성"):
    analyzer = IntegratedAnalyzer()
    report = analyzer.generate_report()

    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("데이터", report['data']['status'])
    with col2:
        st.metric("불량", report['image']['defects'])
    with col3:
        st.metric("알림", report['sensor']['alerts'])

    # 상세 리포트
    st.json(report)`}
            </pre>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function PortfolioDeepDive() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-lg rounded-3xl p-12 border-2 border-blue-500/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-500/30 rounded-2xl p-4">
            <Github className="w-12 h-12 text-blue-300" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Deep Dive 3</h2>
            <p className="text-2xl text-blue-300">GitHub 포트폴리오 배포</p>
          </div>
        </div>
        <div className="bg-black/40 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">README.md 작성</h3>
          <div className="bg-black/60 rounded-xl p-6 font-mono text-xs overflow-x-auto">
            <pre className="text-gray-300 whitespace-pre-wrap">
{`# 🚀 AI 자동화 통합 대시보드

제조 현장의 데이터 분석, 이미지 검사, 센서 예측을 하나로 통합한 웹 대시보드

## ✨ 주요 기능

- **📊 데이터 분석**: CSV 업로드 후 Gemini API로 인사이트 자동 추출
- **📷 이미지 검사**: Vision API로 제조 결함 자동 검출
- **📈 센서 예측**: Prophet으로 시계열 예측 및 이상 알림

## 🛠️ 기술 스택

- Python 3.10+
- Streamlit
- Google Gemini API
- Prophet
- Plotly

## 🚀 실행 방법

\\\`\\\`\\\`bash
# 1. 클론
git clone https://github.com/username/ai-dashboard.git
cd ai-dashboard

# 2. 패키지 설치
pip install -r requirements.txt

# 3. 환경 변수
cp .env.example .env
# .env에 GEMINI_API_KEY 입력

# 4. 실행
streamlit run app.py
\\\`\\\`\\\`

## 📸 스크린샷

[메인 대시보드]
[데이터 분석 페이지]
[이미지 검사 페이지]

## 📄 라이선스

MIT License`}
            </pre>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-blue-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <Github className="w-5 h-5" />
                GitHub Actions
              </h4>
              <p className="text-gray-300 text-sm mb-3">자동 배포 설정</p>
              <code className="text-xs text-green-400">git push → 자동 테스트 → 배포</code>
            </div>
            <div className="bg-indigo-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                Streamlit Cloud
              </h4>
              <p className="text-gray-300 text-sm mb-3">무료 호스팅</p>
              <code className="text-xs text-blue-400">streamlit.app에서 공개</code>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function InteractiveWorkshop() {
  const [completed, setCompleted] = useState<number[]>([]);
  const steps = [
    { title: 'Streamlit 구조 생성', desc: 'app.py + pages/' },
    { title: '3개 페이지 통합', desc: '데이터/이미지/센서' },
    { title: 'README 작성', desc: 'GitHub 문서화' },
    { title: 'GitHub 배포', desc: 'Public 저장소' }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2 className="text-4xl font-bold text-white mb-12 text-center">Interactive Workshop</motion.h2>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div key={i}
              className={`bg-white/5 rounded-2xl p-6 border-2 cursor-pointer ${completed.includes(i) ? 'border-green-500' : 'border-white/10'}`}
              onClick={() => !completed.includes(i) && setCompleted([...completed, i])}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${completed.includes(i) ? 'bg-green-500' : 'bg-white/10'}`}>
                  {completed.includes(i) ? <CheckCircle2 className="w-6 h-6 text-white" /> : <span className="text-white font-bold">{i + 1}</span>}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-green-500/20 rounded-2xl p-8 border border-purple-500/30 sticky top-24 h-fit">
          <h3 className="text-2xl font-bold text-white mb-6">진행 상황</h3>
          <p className="text-gray-300 mb-6">{completed.length} / {steps.length} 완료</p>
          {completed.length === steps.length && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-center">
              <Rocket className="w-16 h-16 text-white mx-auto mb-3" />
              <h4 className="text-2xl font-bold text-white">완료! 🎉</h4>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function VerificationChecklist() {
  const [checks, setChecks] = useState<boolean[]>(Array(6).fill(false));
  const items = [
    'Streamlit 멀티페이지 앱 생성',
    '3개 페이지 통합 완료',
    '통합 리포트 구현',
    'README.md 작성',
    'GitHub Public 저장소',
    '스크린샷 & 문서화'
  ];
  const progress = (checks.filter(Boolean).length / items.length) * 100;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2 className="text-4xl font-bold text-white mb-12 text-center">Verification Checklist</motion.h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {items.map((item, i) => (
          <motion.div key={i}
            onClick={() => { const n = [...checks]; n[i] = !n[i]; setChecks(n); }}
            className={`bg-white/5 rounded-xl p-6 border-2 cursor-pointer ${checks[i] ? 'border-green-500' : 'border-white/10'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${checks[i] ? 'bg-green-500 border-green-500' : 'border-white/30'}`}>
                {checks[i] && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <p className={`text-lg ${checks[i] ? 'text-green-300 line-through' : 'text-white'}`}>{item}</p>
            </div>
          </motion.div>
        ))}
        <div className="bg-gradient-to-br from-purple-500/20 to-green-500/20 rounded-2xl p-8 border border-purple-500/30">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>진행률</span><span>{checks.filter(Boolean).length} / {items.length}</span>
          </div>
          <div className="h-4 bg-black/40 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-green-500 to-blue-500" />
          </div>
          <p className="text-center text-3xl font-bold text-white mt-4">{Math.round(progress)}%</p>
        </div>
      </div>
    </section>
  );
}

function NextSteps() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2 className="text-4xl font-bold text-white mb-12 text-center">What's Next?</motion.h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Rocket, title: 'Lecture 17', subtitle: '기술 면접 & 피칭', color: '#E67E22' },
          { icon: Target, title: 'Projects', subtitle: '실전 프로젝트', color: '#1ABC9C' },
          { icon: Star, title: 'Portfolio', subtitle: '취업 준비 완료', color: '#F39C12' }
        ].map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05 }}
            className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <t.icon className="w-16 h-16 mb-4" style={{ color: t.color }} />
            <h3 className="text-2xl font-bold text-white mb-2">{t.title}</h3>
            <p className="text-xl" style={{ color: t.color }}>{t.subtitle}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black/30 backdrop-blur-md border-t border-purple-500/30 py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-gray-400">Letuin AI Lecture - Lecture 16</p>
        <p className="text-gray-500 text-sm mt-2">© 2026 Letuin Education</p>
      </div>
    </footer>
  );
}

export default App;
