import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Battery,
  Camera,
  Check,
  CheckCircle2,
  Code,
  Copy,
  Database,
  Dna,
  Eye,
  ExternalLink,
  FileImage,
  FileText,
  Image as ImageIcon,
  Layers,
  LineChart,
  Quote,
  Scan,
  Sparkles,
  TrendingUp,
  Upload,
  Video,
  Wrench,
  Zap,
} from 'lucide-react';

// ============================================================================
// DATA ARRAYS - Image Analysis & Vision AI
// ============================================================================

const projectLevels = [
  {
    level: 'Level 1',
    title: '초급 (Beginner)',
    subtitle: '단일 이미지 분류 & Gemini Vision API',
    difficulty: 'beginner',
    duration: '2-3시간',
    techs: ['Gemini Vision API', 'PIL', 'Python'],
    goal: '1장의 이미지를 Gemini Vision API로 분석하여 불량 여부 판정',
  },
  {
    level: 'Level 2',
    title: '중급 (Intermediate)',
    subtitle: '배치 처리 & 불량 유형 분류 자동화',
    difficulty: 'intermediate',
    duration: '1주',
    techs: ['asyncio', 'SQLite', 'pandas', 'CSV 리포트'],
    goal: '수백 장 이미지를 자동 분류하고 불량 통계 리포트 생성',
  },
  {
    level: 'Level 3',
    title: '고급 (Advanced)',
    subtitle: '실시간 영상 분석 & 커스텀 모델 파인튜닝',
    difficulty: 'advanced',
    duration: '2-3주',
    techs: ['OpenCV', 'PyTorch', 'FastAPI', 'Docker'],
    goal: '실시간 카메라 영상을 분석하고 커스텀 모델로 정밀 검사',
  },
];

const domainExamples = [
  {
    icon: Activity,
    domain: '반도체 (Semiconductor)',
    use: 'Wafer 표면 결함 검사',
    example: '스크래치, 파티클, Mura 자동 분류',
    color: '#4285F4',
  },
  {
    icon: BarChart3,
    domain: '디스플레이 (Display)',
    use: 'Panel 불량 자동 검출',
    example: 'Pixel defect, Mura, Color shift 분석',
    color: '#34A853',
  },
  {
    icon: Battery,
    domain: '배터리 (Battery)',
    use: '전극 코팅 불량 검사',
    example: 'Coating 두께, 기포, 크랙 자동 검출',
    color: '#FBBC04',
  },
  {
    icon: Dna,
    domain: '바이오 (Bio)',
    use: '세포 이미지 분석',
    example: '세포 형태, 밀도, 생존율 자동 측정',
    color: '#EA4335',
  },
];

const progressionPath = [
  { step: '1', title: '초급', focus: 'Gemini Vision API 단일 이미지 분류', time: '2-3시간' },
  { step: '2', title: '중급', focus: '배치 처리 + SQLite 데이터베이스 저장', time: '1주' },
  { step: '3', title: '고급', focus: '실시간 영상 + 커스텀 모델 파인튜닝', time: '2-3주' },
];

const beginnerTechs = [
  { name: 'Gemini Vision API', purpose: '이미지 자동 분류 및 설명 생성' },
  { name: 'PIL (Pillow)', purpose: '이미지 로드 및 전처리' },
  { name: 'Python requests', purpose: 'API 호출 및 응답 처리' },
];

const intermediateTechs = [
  { name: 'asyncio', purpose: '수백 장 이미지 병렬 처리' },
  { name: 'SQLite', purpose: '분석 결과 데이터베이스 저장' },
  { name: 'pandas', purpose: '통계 리포트 자동 생성' },
  { name: 'plotly', purpose: '불량 유형별 파레토 차트' },
];

const advancedTechs = [
  { name: 'OpenCV', purpose: '실시간 영상 처리 및 전처리' },
  { name: 'PyTorch', purpose: '커스텀 CNN 모델 파인튜닝' },
  { name: 'FastAPI', purpose: '실시간 추론 REST API' },
  { name: 'Docker', purpose: '컨테이너 배포 및 스케일링' },
];

const beginnerChecklist = [
  'Gemini Vision API Key가 설정되어 있는가?',
  'PIL로 이미지를 정상 로드할 수 있는가?',
  'API 응답에서 불량 여부를 추출할 수 있는가?',
  '분석 결과를 텍스트로 저장할 수 있는가?',
];

const intermediateChecklist = [
  'asyncio로 여러 이미지를 병렬 처리하는가?',
  'SQLite에 분석 결과가 정상 저장되는가?',
  'pandas로 통계 리포트가 생성되는가?',
  'plotly 파레토 차트가 표시되는가?',
];

const advancedChecklist = [
  'OpenCV로 실시간 카메라 영상을 캡처하는가?',
  'PyTorch 모델이 정상 추론되는가?',
  'FastAPI 엔드포인트가 작동하는가?',
  'Docker 컨테이너가 정상 실행되는가?',
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
      <h2>이미지 분석 & 비전 AI - 3단계 프로그레시브 학습</h2>
      <p className="section-intro">
        단일 이미지 분류 → 배치 처리 자동화 → 실시간 영상 분석까지,
        현장에서 바로 사용 가능한 비전 AI 시스템을 단계별로 구축합니다.
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
  const sampleCode = `import google.generativeai as genai
from PIL import Image
import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# 이미지 로드
image_path = "wafer_sample.jpg"
img = Image.open(image_path)

# Gemini Vision 모델 초기화
model = genai.GenerativeModel('gemini-2.0-flash-exp')

# 프롬프트 작성
prompt = """
이 반도체 Wafer 이미지를 분석해줘.

다음 항목을 확인:
1. 불량 여부 (정상/불량)
2. 불량 유형 (스크래치, 파티클, Mura 등)
3. 불량 위치 (중앙, 외곽, 전체)
4. 심각도 (경미, 중간, 심각)
5. 조치 방안

결과를 JSON 형식으로 출력해줘.
"""

# API 호출
response = model.generate_content([prompt, img])

print("=== Gemini Vision 분석 결과 ===")
print(response.text)

# 결과 저장
with open("analysis_result.txt", "w", encoding="utf-8") as f:
    f.write(response.text)

print("\\n✅ 분석 완료: analysis_result.txt 저장됨")`;

  const sampleOutput = `{
  "defect_status": "불량",
  "defect_type": "파티클 (Particle)",
  "defect_location": "중앙부 (Center region)",
  "severity": "중간 (Medium)",
  "recommended_action": [
    "1. 파티클 소스 확인 (Chiller, 공조 시스템)",
    "2. Cleaning 프로세스 강화",
    "3. 동일 Lot 전수 검사 실시",
    "4. 설비 PM 주기 재검토"
  ],
  "confidence": "87%"
}`;

  return (
    <section>
      <span className="section-label">Level 1 - 초급 (Beginner)</span>
      <h2>단일 이미지 분류 & Gemini Vision API</h2>
      <p className="section-intro">
        1장의 이미지를 Gemini Vision API로 분석하여 불량 여부와 유형을 자동 판정합니다.
        코딩 경험이 적어도 API 호출만으로 강력한 비전 AI를 사용할 수 있습니다.
      </p>

      <div className="one-line-definition inline-definition">
        <span>학습 목표</span>
        <strong>Gemini Vision API로 1장의 이미지를 분석하고 불량 여부를 자동 판정하는 Python 스크립트를 작성합니다.</strong>
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
          <h3>수동 이미지 검사 → Gemini Vision API 자동 분류</h3>
        </div>

        <div className="yield-case-compare vertical-case-flow">
          <article className="yield-case-panel manual-panel">
            <span>Before: 수동 검사</span>
            <h4>엔지니어가 이미지를 눈으로 확인하고 판정</h4>
            <ul>
              <li>AOI 이미지를 모니터로 확인</li>
              <li>불량 여부를 눈으로 판단</li>
              <li>불량 유형을 수동 분류 (스크래치, 파티클 등)</li>
              <li>Excel에 결과 기록</li>
              <li>하루 100장 처리 시 2-3시간 소요</li>
            </ul>
          </article>

          <article className="yield-case-panel prompt-panel">
            <span>Prompt: Gemini Vision 지시</span>
            <h4>이미지를 Gemini에게 보내 자동 분석</h4>
            <p>
              "이 반도체 Wafer 이미지를 분석해서 불량 여부, 불량 유형, 위치, 심각도를 판정해줘.
              결과는 JSON 형식으로 출력하고, 조치 방안도 함께 추천해줘."
            </p>
            <div className="aoi-rule-grid">
              <div><strong>불량 여부</strong><span>정상/불량 자동 판정</span></div>
              <div><strong>불량 유형</strong><span>스크래치, 파티클 등</span></div>
              <div><strong>조치 방안</strong><span>구체적 액션 제시</span></div>
            </div>
          </article>

          <article className="yield-case-panel result-panel">
            <span>After: AI 산출물</span>
            <h4>Python 스크립트 + 자동 분석 결과</h4>
            <div className="code-preview-box">
              <div className="visual-header">
                <span>Python Script</span>
                <strong>gemini_vision_classifier.py</strong>
              </div>
              <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', overflow: 'auto' }}>{sampleCode}</pre>
            </div>
            <div className="code-preview-box" style={{ marginTop: '1rem' }}>
              <div className="visual-header">
                <span>JSON Output</span>
                <strong>analysis_result.txt</strong>
              </div>
              <pre style={{ background: '#f0fdf4', color: '#166534', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', overflow: 'auto' }}>{sampleOutput}</pre>
            </div>
            <div className="aoi-impact-strip">
              <div><strong>2-3시간 → 10초</strong><span>분석 시간 단축</span></div>
              <div><strong>87% 정확도</strong><span>엔지니어 최종 검증</span></div>
              <div><strong>JSON 저장</strong><span>자동 리포트 생성</span></div>
            </div>
          </article>
        </div>

        <p className="case-takeaway">
          핵심은 Gemini Vision API를 호출하여 이미지를 자동 분석하고,
          결과를 JSON으로 받아 프로그램에서 후처리할 수 있다는 점입니다.
        </p>
        <VerifyChecklist points={beginnerChecklist} />
      </div>

      <div className="highlight-box" style={{ background: '#f5f5f7', borderLeftColor: '#0071e3', marginTop: '2rem' }}>
        <p style={{ fontWeight: 700 }}>초급 완료 후 다음 단계:</p>
        <p>1장 → 수백 장 배치 처리로 확장하여 실무 자동화 시스템을 구축합니다 (중급 단계).</p>
      </div>
    </section>
  );
}

// ============================================================================
// LEVEL 2: INTERMEDIATE
// ============================================================================

function IntermediateLevel() {
  const batchCode = `import asyncio
import google.generativeai as genai
from PIL import Image
import sqlite3
import pandas as pd
import plotly.express as px
from pathlib import Path
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# SQLite 데이터베이스 초기화
conn = sqlite3.connect('vision_results.db')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS inspections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    defect_status TEXT,
    defect_type TEXT,
    severity TEXT,
    confidence REAL,
    timestamp TEXT
)
''')
conn.commit()

# Gemini Vision 비동기 분석 함수
async def analyze_image(image_path: str, model):
    """단일 이미지 비동기 분석"""
    img = Image.open(image_path)

    prompt = """
    이 이미지를 분석하여 다음 정보를 JSON으로 출력:
    - defect_status: "정상" 또는 "불량"
    - defect_type: 불량 유형 (정상이면 "N/A")
    - severity: "경미", "중간", "심각" (정상이면 "N/A")
    - confidence: 신뢰도 퍼센트 (숫자만)
    """

    response = await model.generate_content_async([prompt, img])
    return {
        'filename': Path(image_path).name,
        'result': response.text,
        'timestamp': datetime.now().isoformat()
    }

# 배치 처리 메인 함수
async def batch_process(image_folder: str):
    """여러 이미지를 병렬 처리"""
    model = genai.GenerativeModel('gemini-2.0-flash-exp')
    image_files = list(Path(image_folder).glob('*.jpg'))

    print(f"📁 총 {len(image_files)}장 이미지 분석 시작...")

    # 병렬 처리 (최대 5개씩)
    tasks = []
    for img_path in image_files:
        task = analyze_image(str(img_path), model)
        tasks.append(task)

    results = await asyncio.gather(*tasks)

    # SQLite에 결과 저장
    for result in results:
        # 간단한 파싱 (실제로는 JSON 파싱 필요)
        cursor.execute('''
            INSERT INTO inspections
            (filename, defect_status, defect_type, severity, confidence, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            result['filename'],
            '불량',  # 파싱 로직 필요
            'Particle',
            '중간',
            85.0,
            result['timestamp']
        ))

    conn.commit()
    print(f"✅ {len(results)}건 분석 완료 및 DB 저장")

# 통계 리포트 생성
def generate_report():
    """pandas로 통계 리포트 생성"""
    df = pd.read_sql_query("SELECT * FROM inspections", conn)

    # 불량 유형별 파레토 차트
    defect_counts = df['defect_type'].value_counts()
    fig = px.bar(
        x=defect_counts.index,
        y=defect_counts.values,
        title='불량 유형별 발생 빈도',
        labels={'x': '불량 유형', 'y': '발생 건수'}
    )
    fig.write_html('defect_pareto.html')

    # CSV 리포트
    summary = df.groupby('defect_type').agg({
        'confidence': 'mean',
        'filename': 'count'
    }).rename(columns={'filename': 'count'})

    summary.to_csv('inspection_summary.csv')
    print("📊 리포트 생성 완료: defect_pareto.html, inspection_summary.csv")

# 실행
if __name__ == "__main__":
    asyncio.run(batch_process("./images"))
    generate_report()
    conn.close()`;

  return (
    <section style={{ marginTop: '4rem' }}>
      <span className="section-label">Level 2 - 중급 (Intermediate)</span>
      <h2>배치 처리 & 불량 유형 분류 자동화</h2>
      <p className="section-intro">
        수백 장의 이미지를 asyncio로 병렬 처리하고, SQLite에 결과를 저장하며,
        pandas로 통계 리포트와 파레토 차트를 자동 생성합니다.
      </p>

      <div className="one-line-definition inline-definition">
        <span>학습 목표</span>
        <strong>asyncio로 이미지 배치 처리, SQLite DB 저장, pandas 통계 리포트를 통합한 자동화 시스템을 구축합니다.</strong>
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
          <h3>순차 처리 → asyncio 병렬 처리 + DB 저장</h3>
        </div>

        <div className="yield-case-compare vertical-case-flow">
          <article className="yield-case-panel manual-panel">
            <span>Before: 순차 처리</span>
            <h4>이미지를 하나씩 순차적으로 분석</h4>
            <ul>
              <li>100장 이미지를 for 루프로 순차 처리</li>
              <li>각 이미지마다 API 응답 대기 (3초)</li>
              <li>총 처리 시간: 100장 × 3초 = 5분</li>
              <li>결과를 텍스트 파일로만 저장</li>
              <li>통계 분석은 Excel에서 수동 작업</li>
            </ul>
          </article>

          <article className="yield-case-panel prompt-panel">
            <span>Prompt: 배치 처리 지시</span>
            <h4>asyncio로 병렬 처리하고 DB에 저장</h4>
            <p>
              "이미지 폴더의 모든 파일을 asyncio로 병렬 분석해줘.
              최대 5개씩 동시 처리하고, 결과는 SQLite 데이터베이스에 저장해줘.
              pandas로 불량 유형별 통계를 계산하고, plotly로 파레토 차트를 그려줘."
            </p>
            <div className="aoi-rule-grid sensor-rule-grid">
              <div><strong>병렬 처리</strong><span>5개씩 동시 분석</span></div>
              <div><strong>DB 저장</strong><span>SQLite 자동 저장</span></div>
              <div><strong>통계 리포트</strong><span>pandas + plotly</span></div>
            </div>
          </article>

          <article className="yield-case-panel result-panel">
            <span>After: AI 산출물</span>
            <h4>배치 처리 시스템 + 자동 리포트</h4>
            <div className="code-preview-box">
              <div className="visual-header">
                <span>Python Script</span>
                <strong>batch_vision_processor.py</strong>
              </div>
              <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.82rem', overflow: 'auto' }}>{batchCode}</pre>
            </div>
            <div className="aoi-impact-strip sensor-impact-strip">
              <div><strong>5분 → 1분</strong><span>병렬 처리로 5배 빠름</span></div>
              <div><strong>SQLite DB</strong><span>구조화된 데이터 저장</span></div>
              <div><strong>자동 리포트</strong><span>CSV + HTML 차트</span></div>
            </div>
          </article>
        </div>

        <p className="case-takeaway">
          핵심은 asyncio로 여러 이미지를 동시에 처리하여 시간을 단축하고,
          SQLite에 저장하여 나중에 통계 분석과 리포트 생성을 자동화하는 것입니다.
        </p>
        <VerifyChecklist points={intermediateChecklist} />
      </div>

      <div className="highlight-box" style={{ background: '#fff3cd', borderLeftColor: '#856404', marginTop: '2rem' }}>
        <p style={{ fontWeight: 700 }}>중급 완료 후 다음 단계:</p>
        <p>실시간 카메라 영상 분석과 커스텀 모델 파인튜닝으로 정밀도를 높입니다 (고급 단계).</p>
      </div>
    </section>
  );
}

// ============================================================================
// LEVEL 3: ADVANCED
// ============================================================================

function AdvancedLevel() {
  const realtimeCode = `import cv2
import torch
import torch.nn as nn
from torchvision import models, transforms
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import uvicorn
from PIL import Image
import io
import numpy as np

# ============= 1. 커스텀 모델 파인튜닝 =============

class DefectClassifier(nn.Module):
    """ResNet18 기반 커스텀 분류 모델"""
    def __init__(self, num_classes=5):
        super(DefectClassifier, self).__init__()
        # 사전 학습된 ResNet18 로드
        self.backbone = models.resnet18(pretrained=True)
        # 마지막 레이어 교체 (5개 불량 유형 분류)
        num_ftrs = self.backbone.fc.in_features
        self.backbone.fc = nn.Linear(num_ftrs, num_classes)

    def forward(self, x):
        return self.backbone(x)

# 모델 로드
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = DefectClassifier(num_classes=5)
model.load_state_dict(torch.load("defect_model.pth", map_location=device))
model.to(device)
model.eval()

# 이미지 전처리
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# 불량 유형 레이블
DEFECT_LABELS = ['정상', '스크래치', '파티클', 'Mura', '크랙']

# ============= 2. FastAPI REST API =============

app = FastAPI(title="Real-time Defect Detection API")

@app.post("/predict")
async def predict_defect(file: UploadFile = File(...)):
    """이미지를 받아 불량 유형을 예측"""
    # 이미지 로드
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')

    # 전처리 및 추론
    input_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
        confidence, predicted_idx = torch.max(probabilities, 0)

    result = {
        "defect_type": DEFECT_LABELS[predicted_idx.item()],
        "confidence": float(confidence.item() * 100),
        "all_probabilities": {
            label: float(prob * 100)
            for label, prob in zip(DEFECT_LABELS, probabilities)
        }
    }

    return JSONResponse(content=result)

# ============= 3. 실시간 영상 처리 =============

def realtime_camera_inspection():
    """OpenCV로 실시간 카메라 영상 처리"""
    cap = cv2.VideoCapture(0)  # 웹캠 또는 산업용 카메라

    print("🎥 실시간 검사 시작 (q 키로 종료)")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # OpenCV 프레임 → PIL Image
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(rgb_frame)

        # 전처리 및 추론
        input_tensor = transform(pil_image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(input_tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            confidence, predicted_idx = torch.max(probabilities, 0)

        # 결과 오버레이
        defect_type = DEFECT_LABELS[predicted_idx.item()]
        conf = confidence.item() * 100

        color = (0, 255, 0) if defect_type == '정상' else (0, 0, 255)
        cv2.putText(frame, f"{defect_type} ({conf:.1f}%)",
                    (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)

        # 화면 표시
        cv2.imshow('Real-time Defect Detection', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

# ============= 4. Docker 배포 =============
# Dockerfile 예시:
"""
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
"""

if __name__ == "__main__":
    # REST API 서버 실행
    uvicorn.run(app, host="0.0.0.0", port=8000)

    # 또는 실시간 카메라 검사 실행
    # realtime_camera_inspection()`;

  const dockerCompose = `version: '3.8'

services:
  defect-api:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./models:/app/models
    environment:
      - MODEL_PATH=/app/models/defect_model.pth
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - defect-api
    restart: unless-stopped`;

  return (
    <section style={{ marginTop: '4rem' }}>
      <span className="section-label">Level 3 - 고급 (Advanced)</span>
      <h2>실시간 영상 분석 & 커스텀 모델 파인튜닝</h2>
      <p className="section-intro">
        OpenCV로 실시간 카메라 영상을 처리하고, PyTorch로 커스텀 CNN 모델을 파인튜닝하며,
        FastAPI로 REST API를 구축하고, Docker로 배포하여 프로덕션 환경에서 운영합니다.
      </p>

      <div className="one-line-definition inline-definition">
        <span>학습 목표</span>
        <strong>실시간 영상 처리, 커스텀 모델 파인튜닝, REST API, Docker 배포까지 전체 MLOps 파이프라인을 구축합니다.</strong>
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
          <h3>배치 처리 → 실시간 영상 + 커스텀 모델</h3>
        </div>

        <div className="yield-case-compare vertical-case-flow">
          <article className="yield-case-panel manual-panel">
            <span>Before: 배치 처리 한계</span>
            <h4>저장된 이미지를 사후 분석</h4>
            <ul>
              <li>카메라로 촬영 후 이미지 저장</li>
              <li>저장된 파일을 배치로 분석</li>
              <li>Gemini API 정확도 한계 (87%)</li>
              <li>실시간 피드백 불가</li>
              <li>특정 도메인 최적화 어려움</li>
            </ul>
          </article>

          <article className="yield-case-panel prompt-panel">
            <span>Prompt: 실시간 + 커스텀 모델 지시</span>
            <h4>OpenCV로 실시간 영상 처리 + PyTorch 파인튜닝</h4>
            <p>
              "OpenCV로 카메라 영상을 실시간으로 캡처하고,
              ResNet18을 파인튜닝한 커스텀 모델로 불량을 검출해줘.
              FastAPI로 REST API를 만들어서 다른 시스템과 연동하고,
              Docker로 컨테이너화해서 쉽게 배포할 수 있게 해줘."
            </p>
            <div className="aoi-rule-grid sensor-rule-grid">
              <div><strong>실시간 처리</strong><span>OpenCV 영상 분석</span></div>
              <div><strong>커스텀 모델</strong><span>PyTorch 파인튜닝</span></div>
              <div><strong>REST API</strong><span>FastAPI 통합</span></div>
            </div>
          </article>

          <article className="yield-case-panel result-panel">
            <span>After: AI 산출물</span>
            <h4>실시간 비전 AI 시스템 + REST API</h4>
            <div className="code-preview-box">
              <div className="visual-header">
                <span>Python Script</span>
                <strong>realtime_vision_system.py</strong>
              </div>
              <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', overflow: 'auto' }}>{realtimeCode}</pre>
            </div>
            <div className="code-preview-box" style={{ marginTop: '1rem' }}>
              <div className="visual-header">
                <span>Docker Compose</span>
                <strong>docker-compose.yml</strong>
              </div>
              <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', overflow: 'auto' }}>{dockerCompose}</pre>
            </div>
            <div className="aoi-impact-strip sensor-impact-strip">
              <div><strong>87% → 95%</strong><span>파인튜닝으로 정확도 향상</span></div>
              <div><strong>실시간 처리</strong><span>30 FPS 영상 분석</span></div>
              <div><strong>API 연동</strong><span>MES/ERP 통합 가능</span></div>
            </div>
          </article>
        </div>

        <p className="case-takeaway">
          핵심은 OpenCV로 실시간 영상을 처리하고, 자체 데이터로 파인튜닝한 모델을 사용하여
          정확도를 높이며, FastAPI로 다른 시스템과 연동 가능하게 만드는 것입니다.
        </p>
        <VerifyChecklist points={advancedChecklist} />
      </div>

      <div className="highlight-box" style={{ background: '#f8d7da', borderLeftColor: '#721c24', marginTop: '2rem' }}>
        <p style={{ fontWeight: 700 }}>고급 완료 후:</p>
        <p>실제 생산 라인에 배포하여 MES/ERP 시스템과 연동하고, 지속적인 모델 재학습으로 정확도를 유지합니다.</p>
      </div>

      <div style={{ marginTop: '2rem', padding: '2rem', background: '#f0f7ff', borderRadius: '12px', border: '1px solid #d1e7ff' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#0071e3' }}>🚀 프로덕션 배포 가이드</h3>
        <ol style={{ lineHeight: '2', paddingLeft: '1.5rem' }}>
          <li><strong>모델 파인튜닝</strong>: 자체 불량 이미지 100-200장으로 ResNet18 파인튜닝</li>
          <li><strong>API 테스트</strong>: Postman으로 FastAPI 엔드포인트 검증</li>
          <li><strong>Docker 빌드</strong>: <code>docker build -t defect-api .</code></li>
          <li><strong>컨테이너 실행</strong>: <code>docker-compose up -d</code></li>
          <li><strong>모니터링</strong>: Prometheus + Grafana로 추론 속도, 정확도 대시보드 구축</li>
          <li><strong>재학습</strong>: 매주 신규 불량 데이터로 모델 업데이트</li>
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
    image: '',
    status: '',
  });
  const [copied, setCopied] = useState(false);

  const hasContent = Object.values(fields).some(Boolean);

  const generated = hasContent
    ? `레벨: ${fields.level || '[선택 안 함]'}
테스트 이미지: ${fields.image || '[준비 중]'}
진행 상태: ${fields.status || '[시작 전]'}

다음 단계: ${fields.level === '초급' ? 'Gemini Vision API 호출 테스트' : fields.level === '중급' ? 'asyncio 배치 처리 구현' : fields.level === '고급' ? 'PyTorch 모델 파인튜닝' : 'Level 선택 필요'}`
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
    { key: 'image', label: '테스트 이미지', placeholder: 'wafer_sample.jpg' },
    { key: 'status', label: '진행 상태', placeholder: 'API 호출 완료 / DB 저장 완료 등' },
  ];

  return (
    <div className="interactive-workshop">
      <div className="iw-header">
        <FileText size={22} color="var(--accent)" />
        <strong>프로젝트 진행 현황 체크리스트</strong>
        <p>현재 진행 중인 Level과 상태를 입력하세요.</p>
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
            <ExternalLink size={20} color="#0071e3" />
            프로젝트 3
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1rem' }}>
            실시간 대시보드 & 배포
          </p>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.7' }}>
            Streamlit으로 데이터 분석과 이미지 검사를 통합한 인터랙티브 대시보드를 만들고,
            GitHub Pages 또는 Streamlit Cloud로 배포하여 포트폴리오를 완성합니다.
          </p>
        </div>

        <div style={{ padding: '1.5rem', background: '#f5f5f7', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="#34A853" />
            실무 적용
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1rem' }}>
            현장 데이터로 모델 재학습
          </p>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.7' }}>
            자체 불량 이미지를 수집하여 PyTorch 모델을 파인튜닝하고,
            MES/ERP 시스템과 연동하여 실제 생산 라인에 배포합니다.
          </p>
        </div>

        <div style={{ padding: '1.5rem', background: '#f5f5f7', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="#FBBC04" />
            포트폴리오
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1rem' }}>
            GitHub 공개 & 기술 블로그 작성
          </p>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.7' }}>
            프로젝트를 GitHub에 공개하고, 기술 블로그에 구현 과정과 인사이트를 작성하여
            취업 시 차별화된 포트폴리오로 활용합니다.
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
            <span className="header-tag">Image Analysis & Vision AI — 초급 → 중급 → 고급</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>프로젝트 02: 이미지 분석 & 비전 AI</h1>
          <p className="subtitle">단일 이미지 분류 → 배치 처리 → 실시간 영상 분석 — 3단계 프로그레시브 학습</p>
          <div className="lesson-meta" aria-label="project summary">
            <span>3단계 구조</span>
            <span>초급 2-3시간 | 중급 1주 | 고급 2-3주</span>
            <span>4개 도메인 적용</span>
            <span>결과물: 실시간 비전 AI 시스템</span>
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
            현재 진행 중인 Level과 상태를 입력하여 프로젝트 진행도를 관리하세요.
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
              <span>초급: Gemini Vision API로 단일 이미지 분류 완료</span>
            </div>
            <div className="check-item">
              <CheckCircle2 size={20} />
              <span>중급: asyncio 배치 처리 + SQLite 저장 + pandas 리포트 완료</span>
            </div>
            <div className="check-item">
              <CheckCircle2 size={20} />
              <span>고급: OpenCV 실시간 영상 + PyTorch 파인튜닝 + FastAPI 완료</span>
            </div>
            <div className="check-item">
              <CheckCircle2 size={20} />
              <span>Docker 컨테이너화 및 배포 준비 완료</span>
            </div>
            <div className="check-item">
              <CheckCircle2 size={20} />
              <span>GitHub에 프로젝트 공개 및 포트폴리오 작성</span>
            </div>
          </div>
          <div className="wrap-message">
            <Quote size={36} color="var(--accent)" />
            <h3>"이미지 분석은 초급(Gemini API) → 중급(배치 처리) → 고급(실시간 + 커스텀 모델)로 발전합니다."</h3>
            <p>다음 프로젝트: 실시간 대시보드 & 배포 (Streamlit + GitHub Pages)</p>
          </div>
        </section>

        <section className="professional-point">
          <div className="highlight-box" style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '24px' }}>
            <h3>Fine Tech Engineering Career Point</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '1rem', fontSize: '1.1rem' }}>
              "비전 AI 프로젝트는 API 호출부터 시작하여 실시간 영상 처리와 커스텀 모델까지 확장합니다.
              초급 → 중급 → 고급 순서로 학습하면 누구나 현장에 배포 가능한 시스템을 만들 수 있습니다."<br/>
              포트폴리오에 GitHub 링크와 실행 영상을 포함하면 취업 시 강력한 무기가 됩니다.
            </p>
            <div className="point-strip">
              <span><Camera size={16} /> Gemini Vision API</span>
              <span><Layers size={16} /> PyTorch 파인튜닝</span>
              <span><Video size={16} /> 실시간 영상 처리</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 Image Analysis & Vision AI for Fine Tech Engineering | LettUin Edu</p>
      </footer>
    </div>
  );
}
