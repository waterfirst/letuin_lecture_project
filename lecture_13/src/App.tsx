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
  LineChart,
  Quote,
  Sparkles,
  TrendingUp,
  Upload,
  Wrench,
  Zap,
} from 'lucide-react';

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}${filename}`;

// ============================================================================
// DATA ARRAYS - Data Analysis Automation
// ============================================================================

const learningGoals = [
  {
    step: '학습목표 1',
    title: 'CSV 파일 업로드 & 자동 시각화',
    body: 'CSV 파일을 업로드하면 자동으로 추세 그래프와 통계 차트를 생성합니다.',
    type: 'upload'
  },
  {
    step: '학습목표 2',
    title: 'Gemini API로 AI 인사이트 자동 추출',
    body: '데이터를 Gemini에게 보내면 이상 패턴, 원인 후보, 조치 방안을 자동 추천받습니다.',
    type: 'insight'
  },
  {
    step: '학습목표 3',
    title: 'Streamlit 대시보드 자동 생성',
    body: '모든 분석 결과를 하나의 인터랙티브 대시보드로 통합합니다.',
    type: 'dashboard'
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
  { owner: '엔지니어', task: 'CSV 파일 준비, 분석 목표 정의, 결과 검증' },
  { owner: 'Python', task: 'pandas로 데이터 로드, plotly로 시각화' },
  { owner: 'Gemini', task: '데이터 패턴 분석, 인사이트 추출, 조치 방안 추천' },
  { owner: 'Streamlit', task: '대시보드 자동 생성, 인터랙티브 UI 제공' },
];

const domainExamples = [
  {
    icon: Activity,
    domain: '반도체 (Semiconductor)',
    data: 'fab_yield.csv',
    columns: 'Date, Line, Process, Yield, Defect_Rate',
    question: '최근 7일 수율 3% 이상 하락한 라인 찾기',
    output: '라인별 추세 그래프 + 하락 원인 TOP3 + 조치 방안',
    color: '#4285F4',
  },
  {
    icon: BarChart3,
    domain: '디스플레이 (Display)',
    data: 'panel_defect.csv',
    columns: 'Date, Model, Mura, Particle, Scratch',
    question: '불량 유형별 발생 추이와 급증 시점 분석',
    output: '파레토 차트 + 시계열 그래프 + 원인 후보',
    color: '#34A853',
  },
  {
    icon: Battery,
    domain: '배터리 (Battery)',
    data: 'battery_cycle.csv',
    columns: 'Cycle, Voltage, Capacity, Temperature',
    question: '충전 사이클별 용량 감소율과 이상 온도 구간',
    output: '용량 감소 추세 + 온도 이상 구간 + 수명 예측',
    color: '#FBBC04',
  },
  {
    icon: Dna,
    domain: '바이오 (Bio)',
    data: 'experiment_result.csv',
    columns: 'Sample, Concentration, Activity, pH',
    question: '농도별 활성도 상관관계와 최적 조건 탐색',
    output: '산점도 + 상관계수 + 최적 조건 추천',
    color: '#EA4335',
  },
];

const fieldScenarios = [
  {
    icon: FileText,
    title: '수동 Excel 분석 → Python 자동화',
    before: 'Excel 피벗 테이블, 필터, 조건부 서식을 수동 적용',
    intent: 'CSV 파일을 업로드하면 자동으로 통계와 그래프를 생성해줘.',
    output: 'pandas + plotly로 자동 분석 스크립트 생성',
  },
  {
    icon: Sparkles,
    title: '단순 차트 → Gemini AI 인사이트',
    before: '그래프만 보고 사람이 직접 패턴 해석',
    intent: '데이터를 Gemini에게 보내서 이상 패턴과 원인 후보를 추천받아줘.',
    output: 'Gemini가 자동으로 인사이트 텍스트 생성',
  },
  {
    icon: TrendingUp,
    title: '정적 그래프 → 인터랙티브 대시보드',
    before: 'PNG 이미지로 저장한 그래프를 PPT에 붙임',
    intent: 'Streamlit으로 필터링 가능한 인터랙티브 대시보드를 만들어줘.',
    output: '웹 URL로 실시간 공유 가능한 대시보드',
  },
];

const automationSteps = [
  { step: '1', title: 'CSV 파일 준비', body: 'fab_yield.csv (100행)', duration: '1분' },
  { step: '2', title: 'Python 스크립트 작성', body: 'pandas + plotly', duration: '3분' },
  { step: '3', title: 'Gemini API 호출', body: '인사이트 추출', duration: '2분' },
  { step: '4', title: 'Streamlit 대시보드', body: 'app.py 실행', duration: '1분' },
];

const insightExamples = [
  {
    title: '이상 패턴 감지',
    before: '사람이 그래프를 보고 눈으로 판단',
    after: 'Gemini: "Line A에서 D-2일부터 수율 4% 하락, Recipe 변경 이력 확인 필요"',
  },
  {
    title: '원인 후보 추천',
    before: '여러 변수를 수동으로 교차 분석',
    after: 'Gemini: "온도 상승(+3°C)과 동시 발생, Chiller 점검 권장"',
  },
  {
    title: '조치 방안 제시',
    before: '경험에 의존하여 대응 방법 결정',
    after: 'Gemini: "PM 주기 앞당기기, 동일 모델 타 라인 비교 분석"',
  },
];

const intentChecklist = [
  'CSV 파일이 준비되어 있는가?',
  'pandas로 데이터를 정상 로드할 수 있는가?',
  'Gemini API Key가 설정되어 있는가?',
  '시각화 라이브러리(plotly)가 설치되어 있는가?',
  'Streamlit 대시보드가 실행되는가?',
];

const uploadVerifyPoints = [
  'CSV 파일이 정상적으로 로드되는가?',
  'pandas로 데이터프레임이 생성되는가?',
  'plotly 차트가 표시되는가?',
];

const insightVerifyPoints = [
  'Gemini API가 정상 응답하는가?',
  '추출된 인사이트가 데이터와 일치하는가?',
  '원인 후보가 구체적으로 제시되는가?',
];

const dashboardVerifyPoints = [
  'Streamlit 앱이 로컬에서 실행되는가?',
  '필터링과 인터랙션이 작동하는가?',
  'Streamlit Community Cloud 배포가 가능한가?',
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function GoalVisual({ type }: { type: string }) {
  if (type === 'upload') {
    return (
      <div className="goal-visual definition">
        <div className="visual-item person">
          <Upload size={18} />
          <span>CSV</span>
        </div>
        <ArrowRight size={14} className="visual-arrow" />
        <div className="visual-item ai">
          <LineChart size={18} />
          <span>차트</span>
        </div>
      </div>
    );
  }
  if (type === 'insight') {
    return (
      <div className="goal-visual elements">
        <div className="element-tag">패턴</div>
        <div className="element-tag">원인</div>
        <div className="element-tag">조치</div>
      </div>
    );
  }
  if (type === 'dashboard') {
    return (
      <div className="goal-visual field">
        <div className="field-icons">
          <div className="f-icon"><BarChart3 size={18} /></div>
          <div className="f-icon"><TrendingUp size={18} /></div>
        </div>
        <div className="success-indicator">
          <CheckCircle2 size={12} />
          <span>대시보드</span>
        </div>
      </div>
    );
  }
  return null;
}

function DomainExampleChart() {
  return (
    <div className="visual-card">
      <div className="visual-header">
        <span>4개 도메인 적용 가능</span>
        <strong>범용 템플릿</strong>
      </div>
      <div style={{ padding: '1.5rem' }}>
        {domainExamples.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.domain} style={{ marginBottom: '1rem', padding: '1rem', background: '#f5f5f7', borderRadius: '8px', borderLeft: `4px solid ${item.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Icon size={20} color={item.color} />
                <strong style={{ color: item.color }}>{item.domain}</strong>
              </div>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0', color: '#555' }}>
                <strong>데이터:</strong> {item.data}
              </p>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0', color: '#555' }}>
                <strong>질문:</strong> {item.question}
              </p>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0', color: '#333' }}>
                <strong>결과:</strong> {item.output}
              </p>
            </div>
          );
        })}
      </div>
      <p>모든 도메인이 동일한 CSV 구조를 사용하므로 코드 재사용이 가능합니다.</p>
    </div>
  );
}

function LectureImage({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="lecture-image">
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

function CSVAutomationDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 01 Deep Dive</span>
        <h3>수동 Excel 분석 → Python pandas 자동화</h3>
        <p>
          Excel 피벗 테이블과 조건부 서식을 수동으로 적용하는 대신,
          CSV 파일을 pandas로 읽어 자동으로 통계와 그래프를 생성합니다.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img
            src={assetUrl('lecture-13-data-automation.png')}
            alt="CSV 자동화"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        </div>
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: 수동 Excel 분석</span>
          <h4>Excel 파일을 열고 피벗, 필터, 조건부 서식을 반복</h4>
          <ul>
            <li>fab_yield.xlsx 파일 열기</li>
            <li>피벗 테이블로 라인별 평균 계산</li>
            <li>조건부 서식으로 90% 미만 빨간색</li>
            <li>차트 삽입 후 PNG로 저장</li>
            <li>PPT에 붙여넣기 (매주 반복)</li>
          </ul>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: pandas 자동화 지시</span>
          <h4>CSV 파일을 pandas로 읽어 자동 분석합니다</h4>
          <p>
            "fab_yield.csv 파일을 pandas로 읽고, 라인별 평균 수율을 계산해줘.
            90% 미만인 라인을 필터링하고, plotly로 추세 그래프를 그려줘.
            결과를 HTML 파일로 저장해서 팀원과 공유할 수 있게 해줘."
          </p>
          <div className="aoi-rule-grid">
            <div><strong>pandas</strong><span>데이터 로드 & 계산</span></div>
            <div><strong>plotly</strong><span>인터랙티브 차트</span></div>
            <div><strong>HTML 저장</strong><span>팀원 공유</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 산출물</span>
          <h4>Python 스크립트가 자동으로 분석하고 차트를 생성합니다</h4>
          <div className="code-preview-box">
            <div className="visual-header">
              <span>Python Script</span>
              <strong>analyze_yield.py</strong>
            </div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', overflow: 'auto' }}>{`import pandas as pd
import plotly.express as px

# CSV 파일 로드
df = pd.read_csv('fab_yield.csv')

# 라인별 평균 수율 계산
avg_yield = df.groupby('Line')['Yield'].mean().reset_index()

# 90% 미만 필터링
low_yield = avg_yield[avg_yield['Yield'] < 90]

print("🚨 수율 90% 미만 라인:")
print(low_yield)

# plotly 추세 그래프
fig = px.line(df, x='Date', y='Yield', color='Line',
              title='라인별 수율 추세')
fig.update_yaxes(range=[85, 100])

# HTML로 저장
fig.write_html('yield_report.html')
print("✅ 저장 완료: yield_report.html")`}</pre>
          </div>
          <div className="aoi-impact-strip">
            <div><strong>30분 → 10초</strong><span>분석 시간 단축</span></div>
            <div><strong>HTML 공유</strong><span>팀원에게 URL 전송</span></div>
            <div><strong>자동 업데이트</strong><span>매주 실행만 하면 끝</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 Excel 수동 작업을 pandas로 자동화하여 반복 업무를 제거하고,
        plotly HTML로 팀원과 인터랙티브하게 공유하는 것입니다.
      </p>
      <VerifyChecklist points={uploadVerifyPoints} />
    </div>
  );
}

function GeminiInsightDeepDive() {
  const codeExample = `import google.generativeai as genai
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# CSV 로드
df = pd.read_csv('fab_yield.csv')

# Gemini에게 분석 요청
model = genai.GenerativeModel('gemini-pro')
prompt = f"""
다음 수율 데이터를 분석해줘:
{df.to_string()}

1. 수율 3% 이상 하락 라인와 시점
2. 원인 후보 TOP3
3. 조치 방안
"""

response = model.generate_content(prompt)
print(response.text)

# Markdown 파일로 저장
with open('insight_report.md', 'w') as f:
    f.write(response.text)

print("✅ 인사이트 저장: insight_report.md")`;

  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 02 Deep Dive</span>
        <h3>단순 차트 → Gemini AI 인사이트 자동 추출</h3>
        <p>
          그래프만 보고 사람이 직접 패턴을 해석하는 대신,
          데이터를 Gemini에게 보내면 이상 패턴, 원인 후보, 조치 방안을 자동 추천받습니다.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img
            src={assetUrl('lecture-13-data-automation.png')}
            alt="Gemini 인사이트"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        </div>
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: 사람이 직접 해석</span>
          <h4>그래프를 보고 패턴을 눈으로 판단</h4>
          <ul>
            <li>추세 그래프를 눈으로 확인</li>
            <li>수율 하락 구간을 수동으로 찾기</li>
            <li>다른 변수(온도, 압력)와 교차 분석</li>
            <li>경험에 의존하여 원인 추정</li>
            <li>보고서에 직접 텍스트 작성</li>
          </ul>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: Gemini 인사이트 지시</span>
          <h4>데이터를 Gemini에게 보내 자동 분석합니다</h4>
          <p>
            "fab_yield.csv 데이터를 분석해서 다음을 알려줘:
            1) 수율이 3% 이상 하락한 라인과 시점
            2) 하락의 가능성 있는 원인 TOP3 (온도, 압력, Recipe 변경 등)
            3) 엔지니어가 확인해야 할 조치 방안
            결과는 Markdown 형식으로 출력해줘."
          </p>
          <div className="aoi-rule-grid sensor-rule-grid">
            <div><strong>이상 패턴</strong><span>자동 감지</span></div>
            <div><strong>원인 후보</strong><span>TOP3 추천</span></div>
            <div><strong>조치 방안</strong><span>구체적 제시</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 산출물</span>
          <h4>Gemini가 자동으로 인사이트를 텍스트로 생성합니다</h4>
          <div className="gemini-insight-result-box">
            <div className="visual-header">
              <span>Gemini AI Insight</span>
              <strong>자동 생성 리포트</strong>
            </div>
            <div style={{ padding: '1.5rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>📊 수율 분석 결과</h4>

              <h5 style={{ fontSize: '0.95rem', marginTop: '1rem', color: '#E74C3C' }}>🚨 이상 패턴 감지</h5>
              <ul style={{ lineHeight: '1.8', paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                <li><strong>Line A</strong>: 2026-05-12부터 수율 4.2% 하락 (94.1% → 89.9%)</li>
                <li><strong>Line C</strong>: 2026-05-14에 급격한 하락 3.7% (91.6% → 87.9%)</li>
              </ul>

              <h5 style={{ fontSize: '0.95rem', marginTop: '1rem', color: '#F39C12' }}>🔍 원인 후보 TOP3</h5>
              <ol style={{ lineHeight: '1.8', paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                <li><strong>Recipe 변경</strong>: Line A에서 5/12 Recipe 업데이트 이력</li>
                <li><strong>온도 상승</strong>: Chiller 온도 +3°C 증가 (72°C → 75°C)</li>
                <li><strong>설비 PM 지연</strong>: Line C PM 예정일 3일 초과</li>
              </ol>

              <h5 style={{ fontSize: '0.95rem', marginTop: '1rem', color: '#27AE60' }}>✅ 조치 방안</h5>
              <ul style={{ lineHeight: '1.8', paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                <li>Line A: Recipe 롤백 후 재테스트</li>
                <li>공통: Chiller 온도 정상 범위 복구 (70°C ± 2°C)</li>
                <li>Line C: PM 즉시 실시 후 수율 재측정</li>
              </ul>
            </div>
          </div>
          <div className="code-preview-box" style={{ marginTop: '1rem' }}>
            <div className="visual-header">
              <span>Python + Gemini</span>
              <strong>gemini_insight.py</strong>
            </div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', overflow: 'auto' }}>{codeExample}</pre>
          </div>
          <div className="aoi-impact-strip sensor-impact-strip">
            <div><strong>해석 자동화</strong><span>사람 판단 불필요</span></div>
            <div><strong>원인 추천</strong><span>경험 + AI 결합</span></div>
            <div><strong>Markdown 저장</strong><span>팀 보고서 즉시 작성</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 사람이 그래프를 해석하는 시간을 제거하고, Gemini가 데이터 패턴을 읽어
        구체적인 원인과 조치 방안을 텍스트로 제공하는 것입니다.
      </p>
      <VerifyChecklist points={insightVerifyPoints} />
    </div>
  );
}

function StreamlitDashboardDeepDive() {
  const streamlitCode = `import streamlit as st
import pandas as pd
import plotly.express as px
import google.generativeai as genai
import os

st.set_page_config(page_title="수율 분석 대시보드", layout="wide")

# CSV 업로드
uploaded_file = st.file_uploader("CSV 파일 업로드", type=['csv'])

if uploaded_file:
    df = pd.read_csv(uploaded_file)

    # 사이드바 필터
    st.sidebar.header("필터")
    lines = st.sidebar.multiselect("라인 선택", df['Line'].unique())
    date_range = st.sidebar.date_input("날짜 범위", [])

    # 필터 적용
    if lines:
        df_filtered = df[df['Line'].isin(lines)]
    else:
        df_filtered = df

    # 추세 그래프
    st.header("📊 수율 추세")
    fig = px.line(df_filtered, x='Date', y='Yield', color='Line')
    st.plotly_chart(fig, use_container_width=True)

    # Gemini 인사이트
    if st.button("🤖 AI 인사이트 생성"):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel('gemini-pro')
        prompt = f"다음 수율 데이터 분석: {df_filtered.to_string()}"
        response = model.generate_content(prompt)
        st.markdown(response.text)

    # 통계 요약
    st.header("📈 통계 요약")
    st.dataframe(df_filtered.groupby('Line')['Yield'].mean())`;

  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 03 Deep Dive</span>
        <h3>정적 그래프 → Streamlit 인터랙티브 대시보드</h3>
        <p>
          PNG 이미지로 저장한 그래프를 PPT에 붙이는 대신,
          Streamlit으로 필터링 가능한 인터랙티브 대시보드를 만들어 웹 URL로 공유합니다.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <img
            src={assetUrl('lecture-13-data-automation.png')}
            alt="Streamlit 대시보드"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
        </div>
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: 정적 PNG 차트</span>
          <h4>그래프를 이미지로 저장하여 PPT에 붙임</h4>
          <ul>
            <li>plotly 차트를 PNG로 저장</li>
            <li>PPT에 이미지 삽입</li>
            <li>필터링 불가 (고정된 이미지)</li>
            <li>업데이트 시 PPT 재작성</li>
            <li>팀원이 데이터 탐색 불가</li>
          </ul>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: Streamlit 대시보드 지시</span>
          <h4>Streamlit으로 인터랙티브 웹 대시보드를 만듭니다</h4>
          <p>
            "Streamlit 앱을 만들어줘. 사용자가 라인을 선택하면 해당 라인의 수율 추세가 표시되고,
            날짜 범위를 필터링할 수 있게 해줘. Gemini 인사이트도 함께 표시하고,
            Streamlit Community Cloud에 배포해서 팀원과 공유할 수 있게 해줘."
          </p>
          <div className="aoi-rule-grid sensor-rule-grid">
            <div><strong>인터랙티브</strong><span>필터링 가능</span></div>
            <div><strong>실시간 업데이트</strong><span>CSV 재업로드</span></div>
            <div><strong>웹 공유</strong><span>URL 전송</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 산출물</span>
          <h4>Streamlit 대시보드가 웹에서 실행됩니다</h4>
          <div className="code-preview-box">
            <div className="visual-header">
              <span>Streamlit App</span>
              <strong>app.py</strong>
            </div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', overflow: 'auto' }}>{streamlitCode}</pre>
          </div>
          <div className="aoi-impact-strip sensor-impact-strip">
            <div><strong>인터랙티브</strong><span>라인/날짜 필터링</span></div>
            <div><strong>AI 통합</strong><span>버튼 클릭으로 인사이트</span></div>
            <div><strong>웹 배포</strong><span>URL 공유로 팀 협업</span></div>
          </div>
          <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#f0f7ff', borderRadius: '8px', border: '1px solid #d1e7ff' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#0071e3' }}>Streamlit Community Cloud 배포</h4>
            <ol style={{ lineHeight: '1.8', paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
              <li>GitHub에 app.py, requirements.txt 업로드</li>
              <li>streamlit.io에서 "New app" 클릭</li>
              <li>GitHub 저장소 선택 → Deploy</li>
              <li>✅ URL 생성: https://your-app.streamlit.app</li>
            </ol>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 정적 이미지를 버리고 Streamlit으로 인터랙티브 대시보드를 만들어
        팀원이 직접 데이터를 탐색하고 AI 인사이트를 즉시 확인할 수 있게 하는 것입니다.
      </p>
      <VerifyChecklist points={dashboardVerifyPoints} />
    </div>
  );
}

function InteractiveWorkshop() {
  const [fields, setFields] = useState({
    csv: '',
    analysis: '',
    dashboard: '',
  });
  const [copied, setCopied] = useState(false);

  const hasContent = Object.values(fields).some(Boolean);

  const generated = hasContent
    ? `1. CSV 파일: ${fields.csv || '[준비 예정]'}
2. 분석 스크립트: ${fields.analysis || '[작성 예정]'}
3. Streamlit 대시보드: ${fields.dashboard || '[배포 예정]'}

다음 단계: pandas 분석 → Gemini 인사이트 → Streamlit 배포`
    : '';

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const inputRows: { key: keyof typeof fields; label: string; placeholder: string }[] = [
    { key: 'csv', label: 'CSV 파일 준비', placeholder: '예: fab_yield.csv (100행)' },
    { key: 'analysis', label: '분석 스크립트', placeholder: '예: pandas + plotly 작성 완료' },
    { key: 'dashboard', label: 'Streamlit 배포', placeholder: '예: https://my-app.streamlit.app' },
  ];

  return (
    <div className="interactive-workshop">
      <div className="iw-header">
        <FileText size={22} color="var(--accent)" />
        <strong>3단계 자동화 체크리스트</strong>
        <p>CSV 준비 → 분석 → 대시보드 배포를 확인하세요.</p>
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
            <strong>자동화 진행 현황</strong>
          </div>
          <div className={`iw-generated-text ${hasContent ? 'active' : ''}`}>
            {generated || '위 3단계를 입력하면\n자동화 진행 현황이 표시됩니다.'}
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
        <ExternalLink size={18} color="var(--accent)" />
        <strong>지금 바로 해보기 — CSV 자동 분석 & 대시보드</strong>
      </div>
      <div className="frg-steps">
        {automationSteps.map((item) => (
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
        <span>14강 미리보기</span>
        <h3>이미지 분석 자동화: Gemini Vision API</h3>
        <p>AOI 불량 이미지를 Gemini Vision API로 자동 분류하고 통계 리포트를 생성합니다. 수백 장 이미지를 몇 초만에 분석.</p>
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
            <span className="header-tag">CSV → pandas → Gemini → Streamlit 자동화</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Ch.13 데이터 분석 자동화 & AI 인사이트 추출</h1>
          <p className="subtitle">CSV 업로드 → pandas 자동 분석 → Gemini AI 인사이트 → Streamlit 대시보드 — 반복 업무 제거</p>
          <div className="lesson-meta" aria-label="lesson summary">
            <span>40분</span>
            <span>자동화 실습</span>
            <span>4개 도메인</span>
            <span>결과물: 인터랙티브 대시보드</span>
          </div>
        </motion.div>
        <LectureImage
          src="data-automation-overview.png"
          alt="CSV에서 pandas 분석, Gemini 인사이트, Streamlit 대시보드까지 이어지는 데이터 자동화 흐름입니다."
          caption="CSV에서 pandas 분석, Gemini 인사이트, Streamlit 대시보드까지 이어지는 데이터 자동화 흐름입니다."
        />
      </header>

      <main>
        <section className="overview-section">
          <span className="section-label">01. 오프닝 및 학습목표</span>
          <h2>Excel 수동 분석을 AI 자동화로 — 30분 작업이 10초로</h2>
          <p className="section-intro">
            CSV 파일을 업로드하면 pandas가 자동 분석하고, Gemini가 인사이트를 추출하며,
            Streamlit이 인터랙티브 대시보드를 생성합니다. 모든 전공에 적용 가능한 범용 템플릿입니다.
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
              src={assetUrl('lecture-13-data-automation.png')}
              alt="데이터 분석 자동화"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          </div>
        </section>

        <section className="definition-section">
          <span className="section-label">02. 데이터 분석 자동화란?</span>
          <h2>CSV 파일 하나면 모든 도메인에 적용 가능한 범용 템플릿</h2>
          <p className="section-intro">
            반도체, 디스플레이, 배터리, 바이오 — 모두 동일한 CSV 구조를 사용하므로
            코드 재사용이 가능합니다. pandas로 데이터를 로드하고, Gemini가 인사이트를 추출합니다.
          </p>
          <div className="one-line-definition inline-definition">
            <span>한 문장 정의</span>
            <strong>데이터 분석 자동화는 CSV 파일을 pandas로 읽고 Gemini가 인사이트를 추출하여 Streamlit으로 대시보드를 만드는 전체 흐름입니다.</strong>
          </div>
          <div className="role-flow" aria-label="자동화 역할 분리">
            {roleFlow.map((item, index) => (
              <div className="role-step" key={`${item.owner}-${item.task}`}>
                <span>{item.owner}</span>
                <strong>{item.task}</strong>
                {index < roleFlow.length - 1 && <ArrowRight size={22} />}
              </div>
            ))}
          </div>
          <DomainExampleChart />
        </section>

        <section>
          <span className="section-label">03. 왜 자동화인가?</span>
          <h2>Excel 수동 작업 30분 → Python 자동화 10초</h2>
          <p className="section-intro">
            피벗 테이블, 조건부 서식, 차트 삽입을 반복하는 대신,
            pandas 스크립트 한 번으로 모든 분석이 자동화됩니다.
          </p>
          <div className="impact-grid">
            {insightExamples.map((item) => (
              <div className="impact-card" key={item.title}>
                <h3>{item.title}</h3>
                <div>
                  <span>Before</span>
                  <p>{item.before}</p>
                </div>
                <div>
                  <span>After AI</span>
                  <p>{item.after}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="highlight-box" style={{ background: '#f5f5f7', borderLeftColor: '#333' }}>
            <p style={{ fontWeight: 700 }}>Target Point:</p>
            <p>"Gemini가 데이터 패턴을 읽고 원인과 조치 방안을 텍스트로 제공하므로, 엔지니어는 검증과 의사결정에만 집중합니다."</p>
          </div>
        </section>

        <section>
          <span className="section-label">04. 도메인별 적용 사례</span>
          <h2>반도체·디스플레이·배터리·바이오 모두 적용 가능</h2>
          <p className="section-intro">
            CSV 구조만 맞추면 어떤 도메인에서도 동일한 코드로 자동화할 수 있습니다.
            pandas + Gemini + Streamlit 템플릿을 재사용합니다.
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
          <CSVAutomationDeepDive />
          <GeminiInsightDeepDive />
          <StreamlitDashboardDeepDive />
        </section>

        <section className="workshop-section teaching-section">
          <span className="section-label">05. 미니 워크숍</span>
          <h2>실습: 내 첫 <mark>자동 분석 대시보드</mark> 만들기</h2>
          <p className="section-intro">
            CSV 파일 준비 → pandas 분석 → Gemini 인사이트 → Streamlit 배포를 차례로 완료하세요.
          </p>
          <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <img
              src={assetUrl('lecture-13-data-automation.png')}
              alt="자동 분석 대시보드"
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
            <h3>"Excel 수동 작업을 pandas로 자동화하고, Gemini가 인사이트를 추출하며, Streamlit이 대시보드를 제공합니다."</h3>
            <p>다음 강의: 이미지 분석 자동화 (Gemini Vision API) — 14강</p>
          </div>
          <NextLecturePreview />
        </section>

        <section className="professional-point">
          <div className="highlight-box" style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '24px' }}>
            <h3>Advanced Process Engineering Point</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '1rem', fontSize: '1.1rem' }}>
              "데이터 분석 자동화는 반복 업무를 제거하고 AI가 인사이트를 제공하여
              엔지니어는 검증과 의사결정에만 집중합니다. 모든 도메인에 적용 가능한 범용 템플릿입니다."<br/>
              CSV 파일 하나면 모든 도메인에서 사용 가능합니다.
            </p>
            <div className="point-strip">
              <span><Database size={16} /> pandas는 데이터 처리</span>
              <span><Sparkles size={16} /> Gemini는 인사이트</span>
              <span><TrendingUp size={16} /> Streamlit은 대시보드</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 Data Analysis Automation for Fine Tech Engineering | LettUin Edu</p>
      </footer>
    </div>
  );
}
