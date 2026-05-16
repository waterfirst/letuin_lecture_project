import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Battery,
  Box,
  Check,
  CheckCircle2,
  Cloud,
  Code,
  Copy,
  Database,
  Dna,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  Globe,
  LineChart,
  Monitor,
  Package,
  PlayCircle,
  Quote,
  Rocket,
  Server,
  Settings,
  Sparkles,
  TrendingUp,
  Upload,
  Wrench,
  Zap,
} from 'lucide-react';

// ============================================================================
// DATA ARRAYS - Real-time Dashboard & Deployment
// ============================================================================

const projectLevels = [
  {
    level: 'Level 1',
    title: '초급 (Beginner)',
    subtitle: '기본 Streamlit 대시보드 & 정적 데이터',
    difficulty: 'beginner',
    duration: '2-3시간',
    techs: ['Streamlit', 'pandas', 'plotly', 'CSV'],
    goal: '로컬에서 실행 가능한 기본 대시보드 구축',
  },
  {
    level: 'Level 2',
    title: '중급 (Intermediate)',
    subtitle: '인터랙티브 대시보드 & 데이터베이스 연동',
    difficulty: 'intermediate',
    duration: '1주',
    techs: ['Streamlit', 'SQLite', 'Gemini API', 'Multi-page'],
    goal: '데이터베이스 연동 및 AI 인사이트 통합 대시보드',
  },
  {
    level: 'Level 3',
    title: '고급 (Advanced)',
    subtitle: '프로덕션 배포 & CI/CD & 모니터링',
    difficulty: 'advanced',
    duration: '2-3주',
    techs: ['Docker', 'GitHub Actions', 'Streamlit Cloud', 'Monitoring'],
    goal: '클라우드 배포 및 자동화 파이프라인 구축',
  },
];

const domainExamples = [
  {
    icon: Activity,
    domain: '반도체 (Semiconductor)',
    use: '공정 모니터링 대시보드',
    example: '수율, 불량률, 설비 가동률 실시간 모니터링',
    color: '#4285F4',
  },
  {
    icon: BarChart3,
    domain: '디스플레이 (Display)',
    use: '품질 관리 대시보드',
    example: '불량 유형 분포, 일별 추이, AI 인사이트',
    color: '#34A853',
  },
  {
    icon: Battery,
    domain: '배터리 (Battery)',
    use: '성능 분석 대시보드',
    example: '충전 사이클, 용량 감소율, 예측 수명',
    color: '#FBBC04',
  },
  {
    icon: Dna,
    domain: '바이오 (Bio)',
    use: '실험 결과 대시보드',
    example: '농도별 활성도, 최적 조건, 통계 요약',
    color: '#EA4335',
  },
];

const progressionPath = [
  { step: '1', title: '초급', focus: 'Streamlit 기본 대시보드 + 정적 CSV 데이터', time: '2-3시간' },
  { step: '2', title: '중급', focus: 'SQLite 연동 + Multi-page + Gemini AI', time: '1주' },
  { step: '3', title: '고급', focus: 'Docker 배포 + GitHub Actions CI/CD', time: '2-3주' },
];

const beginnerTechs = [
  { name: 'Streamlit', purpose: '웹 대시보드 프레임워크' },
  { name: 'pandas', purpose: 'CSV 데이터 로드 및 처리' },
  { name: 'plotly', purpose: '인터랙티브 차트 생성' },
];

const intermediateTechs = [
  { name: 'SQLite', purpose: '데이터베이스 연동 및 쿼리' },
  { name: 'Streamlit Multi-page', purpose: '페이지 구조화 및 네비게이션' },
  { name: 'Gemini API', purpose: 'AI 인사이트 자동 생성' },
  { name: 'st.cache_data', purpose: '성능 최적화' },
];

const advancedTechs = [
  { name: 'Docker', purpose: '컨테이너화 및 재현 가능한 배포' },
  { name: 'GitHub Actions', purpose: 'CI/CD 자동화 파이프라인' },
  { name: 'Streamlit Cloud', purpose: '클라우드 배포 및 호스팅' },
  { name: 'Prometheus + Grafana', purpose: '모니터링 및 알림' },
];

const beginnerChecklist = [
  'Streamlit이 로컬에서 정상 실행되는가?',
  'CSV 파일을 pandas로 로드할 수 있는가?',
  'plotly 차트가 표시되는가?',
  '사이드바 필터가 작동하는가?',
];

const intermediateChecklist = [
  'SQLite 데이터베이스에 연결되는가?',
  'Multi-page 구조가 정상 작동하는가?',
  'Gemini API로 인사이트가 생성되는가?',
  'st.cache_data로 성능이 최적화되었는가?',
];

const advancedChecklist = [
  'Docker 이미지가 정상 빌드되는가?',
  'GitHub Actions CI/CD가 작동하는가?',
  'Streamlit Cloud에 배포되었는가?',
  '모니터링 대시보드가 작동하는가?',
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function LevelBadge({ difficulty }: { difficulty: string }) {
  const config: { [key: string]: { bg: string; label: string } } = {
    beginner: { bg: '#D1F2EB', label: '초급' },
    intermediate: { bg: '#FFF3CD', label: '중급' },
    advanced: { bg: '#F8D7DA', label: '고급' },
  };
  const c = config[difficulty] || config.beginner;
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      background: c.bg,
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: 600,
    }}>
      {c.label}
    </span>
  );
}

function TechStack({ techs }: { techs: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
      {techs.map((tech) => (
        <span
          key={tech}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.4rem 0.8rem',
            background: '#f5f5f7',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 500,
          }}
        >
          <Code size={14} />
          {tech}
        </span>
      ))}
    </div>
  );
}

function VerifyChecklist({ points }: { points: string[] }) {
  return (
    <div className="verify-checklist">
      <span>검증 포인트</span>
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
// PROJECT OVERVIEW
// ============================================================================

function ProjectOverview() {
  return (
    <section className="overview-section">
      <span className="section-label">프로젝트 개요</span>
      <h2>실시간 대시보드 & 배포 - 3단계 프로그레시브 학습</h2>
      <p className="section-intro">
        로컬 대시보드 → 데이터베이스 연동 → 클라우드 배포까지,
        실무에서 바로 사용 가능한 웹 대시보드를 단계별로 구축하고 배포합니다.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {projectLevels.map((level) => (
          <motion.div
            key={level.level}
            className="learning-goal-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span>{level.level}</span>
              <LevelBadge difficulty={level.difficulty} />
            </div>
            <h3>{level.title}</h3>
            <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1rem' }}>{level.subtitle}</p>
            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>
              <strong>목표:</strong> {level.goal}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>
              <strong>학습 기간:</strong> {level.duration}
            </div>
            <TechStack techs={level.techs} />
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>도메인별 적용 사례</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {domainExamples.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.domain} style={{ padding: '1.5rem', background: '#f5f5f7', borderRadius: '12px', borderLeft: `4px solid ${item.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Icon size={20} color={item.color} />
                  <strong style={{ color: item.color }}>{item.domain}</strong>
                </div>
                <p style={{ fontSize: '0.9rem', margin: '0.5rem 0', color: '#555' }}>
                  <strong>적용:</strong> {item.use}
                </p>
                <p style={{ fontSize: '0.9rem', margin: '0.5rem 0', color: '#333' }}>
                  <strong>예시:</strong> {item.example}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lesson-timeline" aria-label="3단계 프로그레시브 경로" style={{ marginTop: '3rem' }}>
        {progressionPath.map((item) => (
          <div className="timeline-step" key={item.step}>
            <strong>{item.step}</strong>
            <span>{item.title}</span>
            <p style={{ fontSize: '0.85rem', color: '#666' }}>{item.focus}</p>
            <p style={{ fontSize: '0.8rem', color: '#999' }}>{item.time}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// LEVEL 1: BEGINNER
// ============================================================================

function BeginnerLevel() {
  const basicCode = `import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
import numpy as np

# 페이지 설정
st.set_page_config(
    page_title="공정 모니터링 대시보드",
    page_icon="📊",
    layout="wide"
)

# 타이틀
st.title("📊 공정 모니터링 대시보드")
st.markdown("---")

# 사이드바 필터
st.sidebar.header("필터 설정")
date_range = st.sidebar.date_input(
    "날짜 범위",
    value=(datetime.now() - timedelta(days=7), datetime.now())
)

# CSV 파일 로드
@st.cache_data
def load_data():
    """CSV 파일을 로드하고 캐싱"""
    df = pd.read_csv('fab_yield.csv')
    df['Date'] = pd.to_datetime(df['Date'])
    return df

df = load_data()

# 라인 선택
lines = st.sidebar.multiselect(
    "라인 선택",
    options=df['Line'].unique(),
    default=df['Line'].unique()
)

# 데이터 필터링
df_filtered = df[df['Line'].isin(lines)]

# KPI 카드
col1, col2, col3, col4 = st.columns(4)

with col1:
    avg_yield = df_filtered['Yield'].mean()
    st.metric(
        label="평균 수율",
        value=f"{avg_yield:.1f}%",
        delta=f"{avg_yield - 90:.1f}%"
    )

with col2:
    defect_rate = df_filtered['Defect_Rate'].mean()
    st.metric(
        label="평균 불량률",
        value=f"{defect_rate:.2f}%",
        delta=f"{defect_rate - 2:.2f}%",
        delta_color="inverse"
    )

with col3:
    total_lots = len(df_filtered)
    st.metric(
        label="총 LOT 수",
        value=f"{total_lots}"
    )

with col4:
    low_yield_lots = len(df_filtered[df_filtered['Yield'] < 90])
    st.metric(
        label="수율 미달 LOT",
        value=f"{low_yield_lots}",
        delta=f"{(low_yield_lots/total_lots*100):.1f}%",
        delta_color="inverse"
    )

st.markdown("---")

# 추세 차트
col1, col2 = st.columns(2)

with col1:
    st.subheader("📈 수율 추세")
    fig1 = px.line(
        df_filtered,
        x='Date',
        y='Yield',
        color='Line',
        title='라인별 수율 추세'
    )
    fig1.update_yaxes(range=[85, 100])
    st.plotly_chart(fig1, use_container_width=True)

with col2:
    st.subheader("🚨 불량률 추세")
    fig2 = px.line(
        df_filtered,
        x='Date',
        y='Defect_Rate',
        color='Line',
        title='라인별 불량률 추세'
    )
    st.plotly_chart(fig2, use_container_width=True)

# 데이터 테이블
st.subheader("📋 상세 데이터")
st.dataframe(
    df_filtered,
    use_container_width=True,
    height=300
)

# Footer
st.markdown("---")
st.caption("© 2026 공정 모니터링 대시보드 | Powered by Streamlit")`;

  return (
    <section>
      <span className="section-label">Level 1 - 초급 (Beginner)</span>
      <h2>기본 Streamlit 대시보드 & 정적 데이터</h2>
      <p className="section-intro">
        로컬에서 실행 가능한 기본 Streamlit 대시보드를 구축합니다.
        CSV 파일을 로드하여 KPI 카드, 추세 차트, 데이터 테이블을 표시합니다.
      </p>

      <div className="one-line-definition inline-definition">
        <span>학습 목표</span>
        <strong>Streamlit으로 CSV 데이터를 시각화하고 사이드바 필터를 추가한 인터랙티브 대시보드를 만듭니다.</strong>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>사용 기술 스택</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {beginnerTechs.map((tech) => (
            <div key={tech.name} style={{ padding: '1rem', background: '#f5f5f7', borderRadius: '8px' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#0071e3' }}>{tech.name}</strong>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>{tech.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="deep-dive" style={{ marginTop: '2rem' }}>
        <div className="deep-dive-heading">
          <span>Before → Prompt → After</span>
          <h3>Excel/PowerPoint → Streamlit 웹 대시보드</h3>
        </div>

        <div className="yield-case-compare vertical-case-flow">
          <article className="yield-case-panel manual-panel">
            <span>Before: Excel + PowerPoint</span>
            <h4>Excel 차트를 PowerPoint에 수동 복사</h4>
            <ul>
              <li>Excel에서 차트 생성</li>
              <li>PNG로 저장 후 PPT 붙여넣기</li>
              <li>데이터 변경 시 재작업 필요</li>
              <li>팀원과 공유 시 파일 이메일 전송</li>
              <li>인터랙티브 필터링 불가</li>
            </ul>
          </article>

          <article className="yield-case-panel prompt-panel">
            <span>Prompt: Streamlit 대시보드 지시</span>
            <h4>웹 대시보드로 실시간 공유</h4>
            <p>
              "Streamlit으로 공정 모니터링 대시보드를 만들어줘.
              KPI 카드 4개 (평균 수율, 불량률, LOT 수, 미달 LOT),
              라인별 추세 차트 2개, 상세 데이터 테이블을 포함하고,
              사이드바에서 날짜와 라인을 필터링할 수 있게 해줘."
            </p>
            <div className="aoi-rule-grid">
              <div><strong>KPI 카드</strong><span>주요 지표 요약</span></div>
              <div><strong>추세 차트</strong><span>plotly 인터랙티브</span></div>
              <div><strong>필터링</strong><span>사이드바 컨트롤</span></div>
            </div>
          </article>

          <article className="yield-case-panel result-panel">
            <span>After: AI 산출물</span>
            <h4>Streamlit 웹 대시보드 완성</h4>
            <div className="code-preview-box">
              <div className="visual-header">
                <span>Python Script</span>
                <strong>dashboard_app.py</strong>
              </div>
              <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.82rem', overflow: 'auto' }}>{basicCode}</pre>
            </div>
            <div className="aoi-impact-strip">
              <div><strong>실시간 업데이트</strong><span>CSV 변경 시 자동 반영</span></div>
              <div><strong>웹 공유</strong><span>URL로 팀원 접근</span></div>
              <div><strong>인터랙티브</strong><span>필터링 + 줌 가능</span></div>
            </div>
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>로컬 실행 방법</h4>
              <pre style={{ background: '#1e1e1e', color: '#10b981', padding: '0.75rem', borderRadius: '4px', fontSize: '0.9rem' }}>
{`# 패키지 설치
pip install streamlit pandas plotly

# 대시보드 실행
streamlit run dashboard_app.py

# 브라우저 자동 열림: http://localhost:8501`}
              </pre>
            </div>
          </article>
        </div>

        <p className="case-takeaway">
          핵심은 Excel/PPT 수동 작업을 Streamlit 웹 대시보드로 대체하여
          실시간 업데이트와 팀원 공유를 자동화하는 것입니다.
        </p>
        <VerifyChecklist points={beginnerChecklist} />
      </div>

      <div className="highlight-box" style={{ background: '#f5f5f7', borderLeftColor: '#0071e3', marginTop: '2rem' }}>
        <p style={{ fontWeight: 700 }}>초급 완료 후 다음 단계:</p>
        <p>SQLite 데이터베이스 연동과 Multi-page 구조로 확장하여 본격적인 웹 앱을 만듭니다 (중급 단계).</p>
      </div>
    </section>
  );
}

// ============================================================================
// LEVEL 2: INTERMEDIATE
// ============================================================================

function IntermediateLevel() {
  const multipageCode = `# 📁 프로젝트 구조
dashboard/
├── app.py                    # 메인 페이지
├── pages/
│   ├── 1_📊_Data_Analysis.py
│   ├── 2_🤖_AI_Insights.py
│   └── 3_⚙️_Settings.py
├── database.py               # SQLite 연결
├── requirements.txt
└── data/
    └── fab_data.db

# ============= app.py (메인 페이지) =============
import streamlit as st
import pandas as pd
import plotly.express as px
from database import get_connection, get_latest_data

st.set_page_config(
    page_title="통합 대시보드",
    page_icon="📊",
    layout="wide"
)

st.title("🏭 공정 통합 대시보드")
st.markdown("**실시간 데이터 모니터링 및 AI 인사이트**")
st.markdown("---")

# SQLite에서 데이터 로드
@st.cache_data(ttl=300)  # 5분마다 갱신
def load_dashboard_data():
    conn = get_connection()
    df = pd.read_sql_query(
        "SELECT * FROM yield_data ORDER BY date DESC LIMIT 1000",
        conn
    )
    return df

df = load_dashboard_data()

# 대시보드 레이아웃
col1, col2, col3 = st.columns(3)

with col1:
    st.metric("총 LOT 수", len(df))

with col2:
    avg_yield = df['yield'].mean()
    st.metric("평균 수율", f"{avg_yield:.1f}%")

with col3:
    alert_count = len(df[df['yield'] < 90])
    st.metric("알림", f"{alert_count}건")

# 추세 차트
st.subheader("📈 최근 추세")
fig = px.line(df, x='date', y='yield', color='line', title='라인별 수율 추세')
st.plotly_chart(fig, use_container_width=True)

# 페이지 네비게이션 안내
st.info("👈 왼쪽 사이드바에서 추가 페이지를 확인하세요!")

# ============= database.py (SQLite 연결) =============
import sqlite3
import pandas as pd

def get_connection():
    """SQLite 데이터베이스 연결"""
    conn = sqlite3.connect('data/fab_data.db', check_same_thread=False)
    return conn

def create_tables():
    """테이블 생성"""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS yield_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        line TEXT,
        yield REAL,
        defect_rate REAL,
        lot_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    conn.commit()
    conn.close()

def insert_data(df: pd.DataFrame):
    """데이터 삽입"""
    conn = get_connection()
    df.to_sql('yield_data', conn, if_exists='append', index=False)
    conn.close()

# ============= pages/2_🤖_AI_Insights.py =============
import streamlit as st
import google.generativeai as genai
import pandas as pd
from database import get_connection
import os

st.set_page_config(page_title="AI 인사이트", page_icon="🤖")

st.title("🤖 AI 인사이트 생성")
st.markdown("Gemini API로 데이터 패턴 분석 및 조치 방안 추천")

# 데이터 로드
@st.cache_data(ttl=300)
def load_analysis_data():
    conn = get_connection()
    df = pd.read_sql_query(
        "SELECT * FROM yield_data WHERE yield < 90 ORDER BY date DESC LIMIT 50",
        conn
    )
    return df

df = load_analysis_data()

st.subheader("📊 수율 미달 데이터")
st.dataframe(df, use_container_width=True)

# Gemini API 호출
if st.button("🚀 AI 인사이트 생성"):
    with st.spinner("Gemini가 분석 중입니다..."):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel('gemini-pro')

        prompt = f"""
        다음 수율 미달 데이터를 분석해줘:
        {df.to_string()}

        1. 주요 패턴 (라인, 시점, 추세)
        2. 원인 후보 TOP3
        3. 엔지니어 조치 방안
        4. 예측 및 권장사항
        """

        response = model.generate_content(prompt)

        st.success("✅ 분석 완료!")
        st.markdown("### 🧠 Gemini AI 분석 결과")
        st.markdown(response.text)

        # 결과 저장
        with open("ai_insights.md", "w", encoding="utf-8") as f:
            f.write(response.text)

        st.download_button(
            label="📥 Markdown 다운로드",
            data=response.text,
            file_name="ai_insights.md",
            mime="text/markdown"
        )`;

  return (
    <section style={{ marginTop: '4rem' }}>
      <span className="section-label">Level 2 - 중급 (Intermediate)</span>
      <h2>인터랙티브 대시보드 & 데이터베이스 연동</h2>
      <p className="section-intro">
        SQLite 데이터베이스와 연동하고, Multi-page 구조로 확장하며,
        Gemini API로 AI 인사이트를 자동 생성하는 고급 대시보드를 구축합니다.
      </p>

      <div className="one-line-definition inline-definition">
        <span>학습 목표</span>
        <strong>SQLite DB 연동, Multi-page 구조, Gemini AI 통합, st.cache_data 성능 최적화를 적용합니다.</strong>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>새롭게 추가되는 기술</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {intermediateTechs.map((tech) => (
            <div key={tech.name} style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#856404' }}>{tech.name}</strong>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>{tech.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="deep-dive" style={{ marginTop: '2rem' }}>
        <div className="deep-dive-heading">
          <span>Before → Prompt → After</span>
          <h3>단일 페이지 → Multi-page + DB 연동</h3>
        </div>

        <div className="yield-case-compare vertical-case-flow">
          <article className="yield-case-panel manual-panel">
            <span>Before: 단일 페이지 + CSV</span>
            <h4>하나의 app.py 파일에 모든 기능</h4>
            <ul>
              <li>모든 코드가 app.py에 집중</li>
              <li>CSV 파일 수동 업로드 필요</li>
              <li>데이터 쿼리 및 필터링 어려움</li>
              <li>AI 인사이트 별도 스크립트 필요</li>
              <li>캐싱 없이 매번 데이터 로드</li>
            </ul>
          </article>

          <article className="yield-case-panel prompt-panel">
            <span>Prompt: Multi-page + DB 지시</span>
            <h4>구조화된 웹 앱으로 확장</h4>
            <p>
              "Streamlit Multi-page 구조로 확장해줘.
              메인 페이지는 대시보드, 두 번째 페이지는 데이터 분석, 세 번째는 AI 인사이트.
              SQLite 데이터베이스에 연결해서 쿼리로 데이터를 가져오고,
              st.cache_data로 5분마다 자동 갱신되게 해줘."
            </p>
            <div className="aoi-rule-grid sensor-rule-grid">
              <div><strong>Multi-page</strong><span>페이지 구조화</span></div>
              <div><strong>SQLite DB</strong><span>쿼리 기반 조회</span></div>
              <div><strong>Gemini AI</strong><span>버튼 클릭 인사이트</span></div>
            </div>
          </article>

          <article className="yield-case-panel result-panel">
            <span>After: AI 산출물</span>
            <h4>Multi-page 구조 + DB 연동</h4>
            <div className="code-preview-box">
              <div className="visual-header">
                <span>Multi-page Structure</span>
                <strong>dashboard/ (프로젝트 구조)</strong>
              </div>
              <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.82rem', overflow: 'auto' }}>{multipageCode}</pre>
            </div>
            <div className="aoi-impact-strip sensor-impact-strip">
              <div><strong>Multi-page</strong><span>기능별 페이지 분리</span></div>
              <div><strong>SQLite</strong><span>쿼리 기반 데이터 조회</span></div>
              <div><strong>캐싱</strong><span>5분마다 자동 갱신</span></div>
            </div>
          </article>
        </div>

        <p className="case-takeaway">
          핵심은 단일 페이지를 Multi-page 구조로 확장하고, SQLite DB와 연동하여
          대규모 데이터를 효율적으로 처리하며, Gemini AI로 인사이트를 자동 생성하는 것입니다.
        </p>
        <VerifyChecklist points={intermediateChecklist} />
      </div>

      <div className="highlight-box" style={{ background: '#fff3cd', borderLeftColor: '#856404', marginTop: '2rem' }}>
        <p style={{ fontWeight: 700 }}>중급 완료 후 다음 단계:</p>
        <p>Docker 컨테이너화와 GitHub Actions CI/CD로 클라우드 배포를 자동화합니다 (고급 단계).</p>
      </div>
    </section>
  );
}

// ============================================================================
// LEVEL 3: ADVANCED
// ============================================================================

function AdvancedLevel() {
  const dockerCode = `# ============= Dockerfile =============
FROM python:3.10-slim

WORKDIR /app

# 시스템 패키지 설치
RUN apt-get update && apt-get install -y \\
    build-essential \\
    curl \\
    software-properties-common \\
    git \\
    && rm -rf /var/lib/apt/lists/*

# Python 패키지 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 앱 파일 복사
COPY . .

# 포트 노출
EXPOSE 8501

# Health check
HEALTHCHECK CMD curl --fail http://localhost:8501/_stcore/health || exit 1

# Streamlit 실행
ENTRYPOINT ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]

# ============= docker-compose.yml =============
version: '3.8'

services:
  streamlit-app:
    build: .
    container_name: dashboard-app
    ports:
      - "8501:8501"
    volumes:
      - ./data:/app/data
    environment:
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
    restart: unless-stopped

  # Prometheus 모니터링 (선택사항)
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    restart: unless-stopped

  # Grafana 대시보드 (선택사항)
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    restart: unless-stopped

# ============= .github/workflows/deploy.yml =============
name: Deploy Streamlit Dashboard

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt

      - name: Run tests
        run: |
          python -m pytest tests/

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: username/dashboard-app:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Streamlit Cloud
        run: |
          echo "Streamlit Cloud auto-deployment triggered"
          # Streamlit Cloud는 GitHub push 시 자동 배포

# ============= .streamlit/config.toml =============
[theme]
primaryColor = "#0071e3"
backgroundColor = "#ffffff"
secondaryBackgroundColor = "#f5f5f7"
textColor = "#1d1d1f"
font = "sans serif"

[server]
headless = true
port = 8501
enableCORS = false
enableXsrfProtection = true

# ============= requirements.txt =============
streamlit==1.32.0
pandas==2.2.0
plotly==5.19.0
google-generativeai==0.4.0
python-dotenv==1.0.1
prometheus-client==0.20.0`;

  return (
    <section style={{ marginTop: '4rem' }}>
      <span className="section-label">Level 3 - 고급 (Advanced)</span>
      <h2>프로덕션 배포 & CI/CD & 모니터링</h2>
      <p className="section-intro">
        Docker로 컨테이너화하고, GitHub Actions로 CI/CD 파이프라인을 구축하며,
        Streamlit Cloud에 배포하고, Prometheus + Grafana로 모니터링합니다.
      </p>

      <div className="one-line-definition inline-definition">
        <span>학습 목표</span>
        <strong>Docker 컨테이너화, GitHub Actions CI/CD, Streamlit Cloud 배포, 모니터링 대시보드까지 전체 MLOps 파이프라인을 구축합니다.</strong>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>새롭게 추가되는 기술</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {advancedTechs.map((tech) => (
            <div key={tech.name} style={{ padding: '1rem', background: '#f8d7da', borderRadius: '8px' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#721c24' }}>{tech.name}</strong>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>{tech.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="deep-dive" style={{ marginTop: '2rem' }}>
        <div className="deep-dive-heading">
          <span>Before → Prompt → After</span>
          <h3>로컬 실행 → Docker + CI/CD + Cloud</h3>
        </div>

        <div className="yield-case-compare vertical-case-flow">
          <article className="yield-case-panel manual-panel">
            <span>Before: 로컬 실행만 가능</span>
            <h4>개발자 PC에서만 작동</h4>
            <ul>
              <li>개발자 PC에서만 streamlit run 실행</li>
              <li>팀원은 직접 접근 불가</li>
              <li>배포 환경 수동 설정 필요</li>
              <li>코드 변경 시 수동 재시작</li>
              <li>모니터링 및 로그 없음</li>
            </ul>
          </article>

          <article className="yield-case-panel prompt-panel">
            <span>Prompt: 프로덕션 배포 지시</span>
            <h4>클라우드 자동 배포 파이프라인</h4>
            <p>
              "Docker로 컨테이너화하고, GitHub Actions로 CI/CD 파이프라인을 만들어줘.
              코드를 main 브랜치에 push하면 자동으로 테스트 → 빌드 → 배포되게 하고,
              Streamlit Cloud에 배포해서 공개 URL로 접근 가능하게 해줘.
              Prometheus와 Grafana로 모니터링 대시보드도 추가해줘."
            </p>
            <div className="aoi-rule-grid sensor-rule-grid">
              <div><strong>Docker</strong><span>컨테이너화</span></div>
              <div><strong>GitHub Actions</strong><span>CI/CD 자동화</span></div>
              <div><strong>Monitoring</strong><span>Prometheus + Grafana</span></div>
            </div>
          </article>

          <article className="yield-case-panel result-panel">
            <span>After: AI 산출물</span>
            <h4>전체 배포 파이프라인 구축</h4>
            <div className="code-preview-box">
              <div className="visual-header">
                <span>Docker + CI/CD</span>
                <strong>Dockerfile, docker-compose.yml, .github/workflows/deploy.yml</strong>
              </div>
              <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', overflow: 'auto' }}>{dockerCode}</pre>
            </div>
            <div className="aoi-impact-strip sensor-impact-strip">
              <div><strong>자동 배포</strong><span>push 시 자동 업데이트</span></div>
              <div><strong>공개 URL</strong><span>누구나 접근 가능</span></div>
              <div><strong>모니터링</strong><span>실시간 성능 추적</span></div>
            </div>
          </article>
        </div>

        <p className="case-takeaway">
          핵심은 로컬 개발 환경을 Docker로 컨테이너화하고, GitHub Actions로 자동 배포하며,
          Streamlit Cloud에 호스팅하여 팀원이 공개 URL로 접근 가능하게 만드는 것입니다.
        </p>
        <VerifyChecklist points={advancedChecklist} />
      </div>

      <div className="highlight-box" style={{ background: '#f8d7da', borderLeftColor: '#721c24', marginTop: '2rem' }}>
        <p style={{ fontWeight: 700 }}>고급 완료 후:</p>
        <p>GitHub 포트폴리오에 배포 URL을 추가하고, 기술 블로그에 구축 과정을 작성하여 취업 포트폴리오를 완성합니다.</p>
      </div>

      <div style={{ marginTop: '2rem', padding: '2rem', background: '#f0f7ff', borderRadius: '12px', border: '1px solid #d1e7ff' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#0071e3' }}>🚀 Streamlit Cloud 배포 가이드</h3>
        <ol style={{ lineHeight: '2', paddingLeft: '1.5rem' }}>
          <li><strong>GitHub 저장소 준비</strong>: app.py, pages/, requirements.txt, .streamlit/config.toml 업로드</li>
          <li><strong>Streamlit Cloud 로그인</strong>: <a href="https://share.streamlit.io" target="_blank" rel="noopener noreferrer">share.streamlit.io</a> 접속</li>
          <li><strong>New app 클릭</strong>: GitHub 저장소 선택 → main 브랜치 → app.py 지정</li>
          <li><strong>환경 변수 설정</strong>: GEMINI_API_KEY 등 Secret 추가</li>
          <li><strong>Deploy 클릭</strong>: 자동 빌드 및 배포 (2-3분 소요)</li>
          <li><strong>공개 URL 생성</strong>: https://your-app.streamlit.app 형식의 URL 획득</li>
        </ol>
      </div>
    </section>
  );
}

// ============================================================================
// INTERACTIVE WORKSHOP
// ============================================================================

function InteractiveWorkshop() {
  const [fields, setFields] = useState({
    level: '',
    status: '',
    url: '',
  });
  const [copied, setCopied] = useState(false);

  const hasContent = Object.values(fields).some(Boolean);

  const generated = hasContent
    ? `레벨: ${fields.level || '[선택 안 함]'}
진행 상태: ${fields.status || '[시작 전]'}
배포 URL: ${fields.url || '[미배포]'}

다음 단계: ${fields.level === '초급' ? 'SQLite DB 연동 및 Multi-page 확장' : fields.level === '중급' ? 'Docker 컨테이너화 및 CI/CD 구축' : fields.level === '고급' ? 'Streamlit Cloud 배포 및 모니터링' : 'Level 선택 필요'}`
    : '';

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const inputRows: { key: keyof typeof fields; label: string; placeholder: string }[] = [
    { key: 'level', label: 'Level 선택', placeholder: '초급 / 중급 / 고급' },
    { key: 'status', label: '진행 상태', placeholder: '로컬 실행 완료 / DB 연동 완료 등' },
    { key: 'url', label: '배포 URL', placeholder: 'https://your-app.streamlit.app' },
  ];

  return (
    <div className="interactive-workshop">
      <div className="iw-header">
        <FileText size={22} color="var(--accent)" />
        <strong>프로젝트 진행 현황 체크리스트</strong>
        <p>현재 진행 중인 Level과 배포 상태를 입력하세요.</p>
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
            <Database size={18} color="var(--accent)" />
            <strong>진행 현황 요약</strong>
          </div>
          <div className={`iw-generated-text ${hasContent ? 'active' : ''}`}>
            {generated || 'Level과 진행 상태를 입력하면\n현황이 표시됩니다.'}
          </div>
          <button
            className={`iw-copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            disabled={!hasContent}
          >
            {copied
              ? <><Check size={15} />복사됨!</>
              : <><Copy size={15} />현황 복사</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// NEXT STEPS
// ============================================================================

function NextSteps() {
  return (
    <section style={{ marginTop: '4rem' }}>
      <span className="section-label">Next Steps</span>
      <h2>프로젝트 완료 후 다음 단계</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div style={{ padding: '1.5rem', background: '#f5f5f7', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={20} color="#0071e3" />
            포트폴리오 완성
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1rem' }}>
            GitHub + 배포 URL
          </p>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.7' }}>
            프로젝트 1, 2, 3을 모두 GitHub에 공개하고, 각 프로젝트의 배포 URL을 README에 추가하여
            취업 시 실행 가능한 포트폴리오로 활용합니다.
          </p>
        </div>

        <div style={{ padding: '1.5rem', background: '#f5f5f7', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="#34A853" />
            실무 적용
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1rem' }}>
            현장 데이터 연동
          </p>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.7' }}>
            실제 공정 데이터를 API로 연동하고, MES/ERP 시스템과 통합하여
            실시간 모니터링 대시보드를 생산 라인에 배포합니다.
          </p>
        </div>

        <div style={{ padding: '1.5rem', background: '#f5f5f7', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="#FBBC04" />
            기술 블로그
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1rem' }}>
            구축 과정 작성
          </h3>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.7' }}>
            각 프로젝트의 구축 과정과 문제 해결 경험을 블로그에 작성하여
            기술 역량을 증명하고 취업 시 차별화된 포트폴리오로 활용합니다.
          </p>
        </div>
      </div>
    </section>
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
              src="/logo.png"
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
            <span className="header-tag">Real-time Dashboard & Deployment — 초급 → 중급 → 고급</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>프로젝트 03: 실시간 대시보드 & 배포</h1>
          <p className="subtitle">로컬 대시보드 → 데이터베이스 연동 → 클라우드 배포 — 3단계 프로그레시브 학습</p>
          <div className="lesson-meta" aria-label="project summary">
            <span>3단계 구조</span>
            <span>초급 2-3시간 | 중급 1주 | 고급 2-3주</span>
            <span>4개 도메인 적용</span>
            <span>결과물: 클라우드 배포 대시보드</span>
          </div>
        </motion.div>
      </header>

      <main>
        <ProjectOverview />
        <BeginnerLevel />
        <IntermediateLevel />
        <AdvancedLevel />

        <section className="workshop-section teaching-section" style={{ marginTop: '4rem' }}>
          <span className="section-label">Interactive Workshop</span>
          <h2>실습: 프로젝트 진행 현황 체크</h2>
          <p className="section-intro">
            현재 진행 중인 Level과 배포 상태를 입력하여 프로젝트 진행도를 관리하세요.
          </p>
          <InteractiveWorkshop />
        </section>

        <NextSteps />

        <section style={{ marginTop: '4rem' }}>
          <span className="section-label">Summary</span>
          <h2>프로젝트 완료 체크리스트</h2>
          <div className="checklist">
            <div className="check-item">
              <CheckCircle2 size={20} />
              <span>초급: Streamlit 기본 대시보드 로컬 실행 완료</span>
            </div>
            <div className="check-item">
              <CheckCircle2 size={20} />
              <span>중급: SQLite DB 연동 + Multi-page + Gemini AI 완료</span>
            </div>
            <div className="check-item">
              <CheckCircle2 size={20} />
              <span>고급: Docker 컨테이너화 + GitHub Actions CI/CD 완료</span>
            </div>
            <div className="check-item">
              <CheckCircle2 size={20} />
              <span>Streamlit Cloud 배포 및 공개 URL 생성 완료</span>
            </div>
            <div className="check-item">
              <CheckCircle2 size={20} />
              <span>GitHub README에 프로젝트 소개 및 URL 추가</span>
            </div>
          </div>
          <div className="wrap-message">
            <Quote size={36} color="var(--accent)" />
            <h3>"대시보드는 초급(로컬) → 중급(DB 연동) → 고급(클라우드 배포)로 발전합니다."</h3>
            <p>3개 프로젝트를 모두 완료하여 통합 포트폴리오를 만드세요!</p>
          </div>
        </section>

        <section className="professional-point">
          <div className="highlight-box" style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '24px' }}>
            <h3>Fine Tech Engineering Career Point</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '1rem', fontSize: '1.1rem' }}>
              "대시보드 프로젝트는 로컬 실행부터 시작하여 데이터베이스 연동과 클라우드 배포까지 확장합니다.
              초급 → 중급 → 고급 순서로 학습하면 누구나 실무에서 사용 가능한 웹 앱을 만들 수 있습니다."<br/>
              포트폴리오에 배포 URL을 포함하면 취업 시 실행 가능한 프로젝트로 강력한 무기가 됩니다.
            </p>
            <div className="point-strip">
              <span><Monitor size={16} /> Streamlit Dashboard</span>
              <span><Cloud size={16} /> Cloud Deployment</span>
              <span><Rocket size={16} /> CI/CD Automation</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 Real-time Dashboard & Deployment for Fine Tech Engineering | LettUin Edu</p>
      </footer>
    </div>
  );
}
