import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database, TrendingUp, CheckCircle2, XCircle, Code, Zap,
  BarChart3, Activity, FileText, Download, Upload, Settings,
  ChevronRight, Terminal, Rocket, Target, Star, Award, Trophy,
  Layers, Eye, Brain, Lightbulb, Play
} from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      <Hero />
      <ProjectOverview />
      <BeginnerLevel />
      <IntermediateLevel />
      <AdvancedLevel />
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
      className="bg-black/30 backdrop-blur-md border-b border-blue-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Project 01</h1>
            <p className="text-sm text-blue-300">데이터 분석 자동화 (초급 → 중급 → 고급)</p>
          </div>
        </div>
        <span className="px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm">
          3-Tier Project
        </span>
      </div>
    </motion.header>
  );
}

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
          className="inline-block mb-6 relative">
          <Database className="w-24 h-24 text-blue-400 mx-auto" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-2">
            <Brain className="w-12 h-12 text-purple-400" />
          </motion.div>
        </motion.div>
        <h1 className="text-6xl font-bold text-white mb-6">데이터 분석 자동화</h1>
        <p className="text-3xl text-blue-300 mb-4">초급 → 중급 → 고급 3단계 프로젝트</p>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto">
          CSV 파일 분석부터 실시간 데이터 파이프라인까지<br/>
          단계별로 AI 데이터 분석 시스템을 구축합니다.
        </p>
      </motion.div>
    </section>
  );
}

function ProjectOverview() {
  const levels = [
    {
      level: '초급',
      icon: Star,
      title: 'CSV 기본 분석',
      skills: ['pandas', 'plotly', 'Gemini API'],
      output: '단일 CSV 분석 리포트',
      time: '1주',
      color: '#3498DB'
    },
    {
      level: '중급',
      icon: Award,
      title: '멀티 파일 자동화',
      skills: ['파일 자동 탐색', '배치 처리', 'DB 저장'],
      output: '폴더 내 모든 CSV 자동 분석',
      time: '2주',
      color: '#9B59B6'
    },
    {
      level: '고급',
      icon: Trophy,
      title: '실시간 파이프라인',
      skills: ['스트리밍', 'ML 예측', 'API 배포'],
      output: '실시간 분석 & 예측 시스템',
      time: '3주',
      color: '#1ABC9C'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2 initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        className="text-4xl font-bold text-white mb-12 text-center">
        프로젝트 로드맵
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-8">
        {levels.map((level, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.2 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500/20 rounded-xl p-3">
                <level.icon className="w-10 h-10" style={{ color: level.color }} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{level.level}</p>
                <h3 className="text-2xl font-bold text-white">{level.title}</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-black/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">핵심 기술</p>
                <div className="space-y-1">
                  {level.skills.map((skill, j) => (
                    <p key={j} className="text-white text-sm flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                      {skill}
                    </p>
                  ))}
                </div>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">결과물</p>
                <p className="text-blue-300 font-semibold">{level.output}</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">예상 기간</p>
                <p className="text-green-300 font-bold">{level.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function BeginnerLevel() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-3xl p-12 border-2 border-blue-500/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-500/30 rounded-2xl p-4">
            <Star className="w-12 h-12 text-blue-300" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Level 1: 초급</h2>
            <p className="text-2xl text-blue-300">CSV 파일 기본 분석</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-black/40 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">프로젝트 목표</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              단일 CSV 파일을 업로드하면 자동으로 그래프를 생성하고, Gemini API가 데이터를 분석하여 인사이트를 제공합니다.
            </p>

            <div className="bg-black/60 rounded-xl p-6 font-mono text-xs">
              <div className="text-green-400 mb-4"># Step 1: CSV 로드 & 기본 통계</div>
              <pre className="text-gray-300 whitespace-pre-wrap">
{`import pandas as pd
import plotly.express as px
import google.generativeai as genai

# CSV 로드
df = pd.read_csv('data.csv')

# 기본 통계
print(df.describe())
print(df.info())

# 결측치 확인
print(df.isnull().sum())

# 시각화
fig = px.line(df, x='Date', y='Value', title='Trend Analysis')
fig.show()

# Gemini 분석
genai.configure(api_key='YOUR_API_KEY')
model = genai.GenerativeModel('gemini-2.0-flash-exp')

prompt = f"""
다음 데이터를 분석해주세요:
{df.head(10).to_string()}

1. 주요 트렌드
2. 이상 패턴
3. 개선 방안
"""

response = model.generate_content(prompt)
print(response.text)`}
              </pre>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-4">✨ 학습 포인트</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• pandas로 CSV 읽기</li>
                <li>• 기본 통계량 계산</li>
                <li>• plotly 차트 생성</li>
                <li>• Gemini API 호출</li>
              </ul>
            </div>
            <div className="bg-green-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-4">🎯 결과물</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• analyze_csv.py</li>
                <li>• 트렌드 그래프 (HTML)</li>
                <li>• AI 분석 리포트 (TXT)</li>
                <li>• README.md</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function IntermediateLevel() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-12 border-2 border-purple-500/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-purple-500/30 rounded-2xl p-4">
            <Award className="w-12 h-12 text-purple-300" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Level 2: 중급</h2>
            <p className="text-2xl text-purple-300">멀티 파일 배치 처리</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-black/40 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">프로젝트 목표</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              폴더 내 모든 CSV 파일을 자동으로 탐색하고 배치 처리하여, 결과를 데이터베이스에 저장하고 통합 리포트를 생성합니다.
            </p>

            <div className="bg-black/60 rounded-xl p-6 font-mono text-xs">
              <div className="text-purple-400 mb-4"># Step 2: 배치 처리 & DB 저장</div>
              <pre className="text-gray-300 whitespace-pre-wrap">
{`import os
from pathlib import Path
import sqlite3
from datetime import datetime

class BatchAnalyzer:
    def __init__(self, folder_path, db_path='results.db'):
        self.folder_path = folder_path
        self.db_path = db_path
        self.setup_database()

    def setup_database(self):
        """SQLite DB 초기화"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS analysis_results (
                id INTEGER PRIMARY KEY,
                timestamp TEXT,
                filename TEXT,
                row_count INTEGER,
                insights TEXT,
                status TEXT
            )
        ''')
        conn.commit()
        conn.close()

    def find_csv_files(self):
        """폴더 내 모든 CSV 찾기"""
        csv_files = list(Path(self.folder_path).glob('**/*.csv'))
        print(f"Found {len(csv_files)} CSV files")
        return csv_files

    def analyze_file(self, file_path):
        """단일 파일 분석"""
        try:
            df = pd.read_csv(file_path)

            # Gemini 분석
            prompt = f"Analyze this data: {df.head().to_string()}"
            response = model.generate_content(prompt)

            # DB 저장
            self.save_to_db(
                filename=file_path.name,
                row_count=len(df),
                insights=response.text,
                status='success'
            )

            return {'status': 'success', 'insights': response.text}
        except Exception as e:
            self.save_to_db(
                filename=file_path.name,
                row_count=0,
                insights=str(e),
                status='error'
            )
            return {'status': 'error', 'error': str(e)}

    def save_to_db(self, filename, row_count, insights, status):
        """결과를 DB에 저장"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        c.execute('''
            INSERT INTO analysis_results
            (timestamp, filename, row_count, insights, status)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            datetime.now().isoformat(),
            filename,
            row_count,
            insights,
            status
        ))
        conn.commit()
        conn.close()

    def process_all(self):
        """전체 파일 배치 처리"""
        csv_files = self.find_csv_files()

        results = []
        for i, file_path in enumerate(csv_files, 1):
            print(f"[{i}/{len(csv_files)}] Processing: {file_path.name}")
            result = self.analyze_file(file_path)
            results.append(result)

        # 통합 리포트 생성
        self.generate_summary_report()
        return results

    def generate_summary_report(self):
        """통합 리포트 생성"""
        conn = sqlite3.connect(self.db_path)
        df = pd.read_sql_query("SELECT * FROM analysis_results", conn)
        conn.close()

        print(f"\\n=== Summary Report ===")
        print(f"Total files: {len(df)}")
        print(f"Success: {len(df[df['status']=='success'])}")
        print(f"Error: {len(df[df['status']=='error'])}")

# 실행
analyzer = BatchAnalyzer('./data_folder')
results = analyzer.process_all()`}
              </pre>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-4">🚀 새로운 기술</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Path.glob() 파일 탐색</li>
                <li>• SQLite 데이터베이스</li>
                <li>• 배치 처리 로직</li>
                <li>• 에러 핸들링</li>
              </ul>
            </div>
            <div className="bg-pink-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-4">📦 결과물</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• batch_analyzer.py</li>
                <li>• results.db (SQLite)</li>
                <li>• summary_report.html</li>
                <li>• 로그 파일</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function AdvancedLevel() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-lg rounded-3xl p-12 border-2 border-green-500/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-green-500/30 rounded-2xl p-4">
            <Trophy className="w-12 h-12 text-green-300" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Level 3: 고급</h2>
            <p className="text-2xl text-green-300">실시간 데이터 파이프라인</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-black/40 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">프로젝트 목표</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              실시간으로 들어오는 데이터를 스트리밍 방식으로 처리하고, ML 모델로 예측하며, REST API로 결과를 제공합니다.
            </p>

            <div className="bg-black/60 rounded-xl p-6 font-mono text-xs">
              <div className="text-green-400 mb-4"># Step 3: 실시간 파이프라인 & API</div>
              <pre className="text-gray-300 whitespace-pre-wrap">
{`import asyncio
from fastapi import FastAPI, UploadFile
from prophet import Prophet
import pandas as pd

app = FastAPI()

class RealtimePipeline:
    def __init__(self):
        self.prophet_model = None
        self.data_buffer = []

    async def stream_processor(self, data_stream):
        """실시간 스트리밍 처리"""
        async for data in data_stream:
            # 1. 데이터 전처리
            processed = self.preprocess(data)

            # 2. 이상 감지
            anomaly = self.detect_anomaly(processed)

            # 3. ML 예측
            prediction = self.predict_next(processed)

            # 4. 결과 저장
            await self.save_result({
                'data': processed,
                'anomaly': anomaly,
                'prediction': prediction
            })

    def detect_anomaly(self, data):
        """실시간 이상 감지"""
        # Isolation Forest 등 사용
        pass

    def predict_next(self, data):
        """Prophet으로 다음 값 예측"""
        if not self.prophet_model:
            self.train_model(self.data_buffer)

        future = self.prophet_model.make_future_dataframe(periods=1)
        forecast = self.prophet_model.predict(future)
        return forecast['yhat'].iloc[-1]

@app.post("/analyze")
async def analyze_csv(file: UploadFile):
    """API 엔드포인트: CSV 분석"""
    df = pd.read_csv(file.file)

    # 분석 실행
    pipeline = RealtimePipeline()
    result = await pipeline.analyze(df)

    return {
        'status': 'success',
        'insights': result['insights'],
        'predictions': result['predictions']
    }

@app.get("/health")
async def health_check():
    return {'status': 'healthy'}

# 실행: uvicorn main:app --reload`}
              </pre>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-4">⚡ 고급 기술</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• FastAPI REST API</li>
                <li>• 비동기 처리 (asyncio)</li>
                <li>• Prophet ML 예측</li>
                <li>• Docker 배포</li>
              </ul>
            </div>
            <div className="bg-teal-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-4">🎯 성능</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• 1000 req/sec</li>
                <li>• 실시간 스트리밍</li>
                <li>• 자동 스케일링</li>
                <li>• 99.9% 가동률</li>
              </ul>
            </div>
            <div className="bg-blue-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-4">📦 결과물</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• FastAPI 서버</li>
                <li>• Docker 이미지</li>
                <li>• API 문서</li>
                <li>• 배포 스크립트</li>
              </ul>
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
    { title: '초급 프로젝트 완성', desc: 'CSV 기본 분석' },
    { title: '중급 프로젝트 완성', desc: '배치 처리 & DB' },
    { title: '고급 프로젝트 완성', desc: '실시간 파이프라인' },
    { title: 'GitHub 배포', desc: 'Public 저장소' }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2 className="text-4xl font-bold text-white mb-12 text-center">Progress Tracker</motion.h2>
      <div className="max-w-3xl mx-auto space-y-4">
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
        {completed.length === steps.length && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-center">
            <Trophy className="w-16 h-16 text-white mx-auto mb-3" />
            <h4 className="text-2xl font-bold text-white">프로젝트 완성! 🎉</h4>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function VerificationChecklist() {
  const [checks, setChecks] = useState<boolean[]>(Array(6).fill(false));
  const items = [
    '초급: CSV 분석 스크립트 작동',
    '중급: 배치 처리 & DB 저장',
    '고급: FastAPI 서버 실행',
    'README.md 작성',
    'GitHub 배포',
    'API 문서 완성'
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
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-blue-500/30">
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
      <motion.h2 className="text-4xl font-bold text-white mb-12 text-center">Next: Project 02</motion.h2>
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-blue-500/30 text-center">
        <Rocket className="w-20 h-20 text-blue-400 mx-auto mb-4" />
        <h3 className="text-3xl font-bold text-white mb-4">이미지 분석 & 비전 AI</h3>
        <p className="text-xl text-gray-200">
          다음 프로젝트에서는 Gemini Vision API로<br/>
          3단계 이미지 분석 시스템을 구축합니다.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black/30 backdrop-blur-md border-t border-blue-500/30 py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-gray-400">Letuin AI Lecture - Project 01</p>
        <p className="text-gray-500 text-sm mt-2">© 2026 Letuin Education</p>
      </div>
    </footer>
  );
}

export default App;
