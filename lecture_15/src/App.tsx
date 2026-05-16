import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, TrendingUp, AlertTriangle, CheckCircle2, XCircle, Zap,
  LineChart, Bell, Clock, Database, Mail, Smartphone, BarChart3,
  Battery, Thermometer, Gauge, ChevronRight, Code, Terminal, Rocket,
  Brain, Target, Eye, Layers, Settings, Play
} from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      <Hero />
      <ProblemStatement />
      <SensorDataOverview />
      <BeforeAfterComparison />
      <TimeSeriesDeepDive />
      <AnomalyDetectionDeepDive />
      <AlertSystemDeepDive />
      <InteractiveWorkshop />
      <VerificationChecklist />
      <NextSteps />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-black/30 backdrop-blur-md border-b border-blue-500/30 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Lecture 15</h1>
            <p className="text-sm text-blue-300">센서 데이터 예측 & 알림 시스템</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm">
            AI Prediction & Alert
          </span>
        </div>
      </div>
    </motion.header>
  );
}

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-block mb-6 relative"
        >
          <Activity className="w-24 h-24 text-blue-400 mx-auto" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2"
          >
            <Bell className="w-12 h-12 text-yellow-400" />
          </motion.div>
        </motion.div>

        <h1 className="text-6xl font-bold text-white mb-6">
          센서 데이터 예측 & 알림
        </h1>
        <p className="text-3xl text-blue-300 mb-4">
          시계열 분석으로 이상 징후를 미리 감지하세요
        </p>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto">
          배터리 온도, 공정 압력, 전력 소비량... 실시간 센서 데이터에서<br/>
          AI가 패턴을 학습하고 이상을 자동으로 감지하여 즉시 알려드립니다.
        </p>
      </motion.div>
    </section>
  );
}

function ProblemStatement() {
  const problems = [
    {
      icon: Clock,
      title: '사후 대응',
      description: '문제 발생 후에야 인지 → 이미 큰 손실',
      impact: '대량 불량 발생',
      color: '#E74C3C'
    },
    {
      icon: Eye,
      title: '수동 모니터링',
      description: '사람이 24시간 화면 주시 불가능',
      impact: '야간/휴일 사고',
      color: '#E67E22'
    },
    {
      icon: TrendingUp,
      title: '패턴 인식 실패',
      description: '미세한 변화 감지 못함',
      impact: '점진적 악화 방치',
      color: '#F39C12'
    },
    {
      icon: AlertTriangle,
      title: '알림 지연',
      description: '이상 감지 → 통보까지 시간 지연',
      impact: '골든타임 놓침',
      color: '#C0392B'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-white mb-12 text-center"
      >
        실시간 모니터링의 문제점
      </motion.h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {problems.map((problem, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
          >
            <problem.icon className="w-12 h-12 mb-4" style={{ color: problem.color }} />
            <h3 className="text-xl font-bold text-white mb-3">{problem.title}</h3>
            <p className="text-gray-300 mb-4 text-sm">{problem.description}</p>
            <div className="px-3 py-2 bg-red-500/20 rounded-lg">
              <p className="text-red-300 text-sm font-semibold">📉 {problem.impact}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-2xl p-8 border border-blue-500/30"
      >
        <div className="flex items-start gap-4">
          <Activity className="w-16 h-16 text-blue-400 flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">AI 예측 & 알림 솔루션</h3>
            <p className="text-xl text-gray-200 mb-4">
              시계열 데이터 분석으로 이상을 사전에 예측하고, 문제 발생 즉시 담당자에게 자동 알림을 보냅니다.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-black/30 rounded-lg p-4">
                <p className="text-green-400 text-2xl font-bold mb-1">15분 전</p>
                <p className="text-gray-300 text-sm">이상 사전 감지</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <p className="text-blue-400 text-2xl font-bold mb-1">3초 이내</p>
                <p className="text-gray-300 text-sm">실시간 알림 발송</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <p className="text-purple-400 text-2xl font-bold mb-1">95%</p>
                <p className="text-gray-300 text-sm">예측 정확도</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function SensorDataOverview() {
  const examples = [
    {
      icon: Battery,
      domain: '배터리',
      sensors: ['온도', '전압', '전류', '용량'],
      prediction: '충전 사이클별 용량 감소 예측',
      alert: '이상 온도 60℃ 초과 시 즉시 알림',
      color: '#1ABC9C'
    },
    {
      icon: Thermometer,
      domain: '반도체',
      sensors: ['온도', '압력', '가스농도', '습도'],
      prediction: '공정 챔버 압력 이상 15분 전 예측',
      alert: '압력 ±5% 이탈 시 알림',
      color: '#3498DB'
    },
    {
      icon: Gauge,
      domain: '디스플레이',
      sensors: ['전력', '휘도', '색온도', '전류'],
      prediction: '휘도 저하 추세 분석 및 예측',
      alert: '휘도 기준치 90% 미달 시 알림',
      color: '#9B59B6'
    },
    {
      icon: Activity,
      domain: '바이오',
      sensors: ['pH', '온도', '용존산소', '교반속도'],
      prediction: 'pH 변화 패턴 분석 및 이상 예측',
      alert: 'pH 7.0±0.5 이탈 시 즉시 알림',
      color: '#E67E22'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-white mb-12 text-center"
      >
        산업별 센서 데이터 예측 사례
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8">
        {examples.map((ex, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-blue-500/20 rounded-xl p-3">
                <ex.icon className="w-10 h-10" style={{ color: ex.color }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{ex.domain}</h3>
                <div className="flex flex-wrap gap-2">
                  {ex.sensors.map((sensor, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-500/20 rounded-lg text-blue-300 text-sm">
                      {sensor}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-black/30 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">🔮 예측</p>
                <p className="text-white font-semibold">{ex.prediction}</p>
              </div>
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
                <p className="text-gray-400 text-sm mb-1">🔔 알림</p>
                <p className="text-green-300 font-semibold">{ex.alert}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function BeforeAfterComparison() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-white mb-12 text-center"
      >
        Before vs After: 센서 모니터링 자동화
      </motion.h2>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-red-500/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <XCircle className="w-10 h-10 text-red-400" />
            <h3 className="text-3xl font-bold text-white">Before</h3>
          </div>

          <div className="space-y-6">
            <div className="bg-black/40 rounded-xl p-6">
              <h4 className="text-red-300 font-bold mb-3">수동 모니터링</h4>
              <div className="space-y-3 text-gray-300 text-sm">
                <p className="flex gap-2"><span className="text-red-400">❌</span>엔지니어가 화면 주시</p>
                <p className="flex gap-2"><span className="text-red-400">❌</span>엑셀로 데이터 기록</p>
                <p className="flex gap-2"><span className="text-red-400">❌</span>이상 발생 후 대응</p>
                <p className="flex gap-2"><span className="text-red-400">❌</span>수동으로 전화/문자</p>
              </div>
            </div>

            <div className="bg-red-500/20 rounded-xl p-4 border border-red-500/30">
              <p className="text-white font-bold mb-2">⏱️ 대응 시간</p>
              <p className="text-red-300 text-2xl font-bold">30분+</p>
              <p className="text-gray-400 text-sm mt-2">감지 → 조치</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500/20 to-green-500/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-blue-500/50"
        >
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-10 h-10 text-blue-400" />
            <h3 className="text-3xl font-bold text-white">Prompt</h3>
          </div>

          <div className="bg-black/60 rounded-xl p-6 font-mono text-sm mb-6">
            <div className="text-green-400 mb-4"># AI 이상 감지 & 알림</div>
            <pre className="text-gray-300 whitespace-pre-wrap text-xs">
{`import pandas as pd
from prophet import Prophet

# 시계열 예측
df = pd.read_csv('sensor_data.csv')
model = Prophet()
model.fit(df[['ds', 'y']])

# 미래 예측
future = model.make_future_dataframe(
  periods=60, freq='T'
)
forecast = model.predict(future)

# 이상 감지
if forecast['yhat'][-1] > threshold:
  send_alert(
    to='engineer@company.com',
    message='온도 이상 예측'
  )`}
            </pre>
          </div>

          <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/40">
            <p className="text-blue-300 text-sm font-semibold mb-2">✨ 핵심</p>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Prophet으로 시계열 예측</li>
              <li>• 임계값 초과 시 자동 알림</li>
              <li>• 15분 전 사전 경고</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-green-500/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-green-500/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
            <h3 className="text-3xl font-bold text-white">After</h3>
          </div>

          <div className="space-y-6">
            <div className="bg-black/40 rounded-xl p-6">
              <h4 className="text-green-300 font-bold mb-3">AI 자동 감지</h4>
              <div className="space-y-3 text-gray-300 text-sm">
                <p className="flex gap-2"><span className="text-green-400">✅</span>24/7 자동 모니터링</p>
                <p className="flex gap-2"><span className="text-green-400">✅</span>DB 자동 저장</p>
                <p className="flex gap-2"><span className="text-green-400">✅</span>15분 전 사전 예측</p>
                <p className="flex gap-2"><span className="text-green-400">✅</span>이메일/Slack 자동 발송</p>
              </div>
            </div>

            <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
              <p className="text-white font-bold mb-2">⚡ 대응 시간</p>
              <p className="text-green-300 text-2xl font-bold">3초</p>
              <p className="text-gray-400 text-sm mt-2">감지 → 알림</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mt-12 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-8 border border-green-500/30"
      >
        <h3 className="text-2xl font-bold text-white mb-6 text-center">자동화 효과</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-green-400 mb-2">600배</p>
            <p className="text-gray-300">대응 속도 향상</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-400 mb-2">95%</p>
            <p className="text-gray-300">예측 정확도</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-purple-400 mb-2">80%↓</p>
            <p className="text-gray-300">사고 발생률</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-pink-400 mb-2">24/7</p>
            <p className="text-gray-300">무중단 감시</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function TimeSeriesDeepDive() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 backdrop-blur-lg rounded-3xl p-12 border-2 border-indigo-500/30"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-indigo-500/30 rounded-2xl p-4">
            <LineChart className="w-12 h-12 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Deep Dive 1</h2>
            <p className="text-2xl text-indigo-300">시계열 데이터 분석 & 예측</p>
          </div>
        </div>

        <div className="bg-black/40 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Prophet으로 센서 데이터 예측</h3>
          <div className="bg-black/60 rounded-xl p-6 font-mono text-xs overflow-x-auto">
            <pre className="text-gray-300 whitespace-pre-wrap">
{`import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt

# 1. 데이터 로드
df = pd.read_csv('battery_temp.csv')
df = df.rename(columns={'timestamp': 'ds', 'temperature': 'y'})

# 2. Prophet 모델 학습
model = Prophet(
    changepoint_prior_scale=0.05,  # 추세 변화 민감도
    seasonality_mode='multiplicative'
)
model.fit(df)

# 3. 미래 60분 예측
future = model.make_future_dataframe(periods=60, freq='T')
forecast = model.predict(future)

# 4. 이상 감지 (60℃ 초과)
threshold = 60
alerts = forecast[forecast['yhat'] > threshold]

if len(alerts) > 0:
    print(f"⚠️ 경고: {len(alerts)}개 시점에서 {threshold}℃ 초과 예상")
    early_warning = alerts.iloc[0]['ds'] - pd.Timedelta(minutes=15)
    send_alert(early_warning_time)

# 5. 시각화
fig = model.plot(forecast)
plt.axhline(y=threshold, color='r', linestyle='--')
plt.show()`}
            </pre>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-indigo-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-3">📊 Prophet 장점</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• 추세 자동 감지</li>
                <li>• 계절성 패턴 학습</li>
                <li>• 결측치 처리 자동</li>
                <li>• 사용법 간단</li>
              </ul>
            </div>
            <div className="bg-blue-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-3">⚡ 실시간 예측</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• 1분마다 재예측</li>
                <li>• 최근 데이터 반영</li>
                <li>• 동적 임계값 조정</li>
                <li>• 예측 신뢰구간 제공</li>
              </ul>
            </div>
            <div className="bg-purple-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-3">🎯 정확도</h4>
              <p className="text-3xl font-bold text-purple-300 mb-2">95%+</p>
              <p className="text-gray-400 text-sm">15분 후 예측 정확도</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function AnomalyDetectionDeepDive() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-lg rounded-3xl p-12 border-2 border-red-500/30"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-red-500/30 rounded-2xl p-4">
            <AlertTriangle className="w-12 h-12 text-red-300" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Deep Dive 2</h2>
            <p className="text-2xl text-red-300">이상 감지 알고리즘</p>
          </div>
        </div>

        <div className="bg-black/40 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">다층 이상 감지 시스템</h3>
          <div className="bg-black/60 rounded-xl p-6 font-mono text-xs overflow-x-auto">
            <pre className="text-gray-300 whitespace-pre-wrap">
{`from sklearn.ensemble import IsolationForest
import numpy as np

class MultiLayerAnomalyDetector:
    def __init__(self):
        self.isolation_forest = IsolationForest(contamination=0.01)

    def detect_statistical(self, data):
        """통계적 이상 감지 (3-sigma)"""
        mean, std = np.mean(data), np.std(data)
        threshold_upper = mean + 3 * std
        threshold_lower = mean - 3 * std
        anomalies = (data > threshold_upper) | (data < threshold_lower)
        return anomalies, threshold_upper, threshold_lower

    def detect_ml(self, data):
        """ML 이상 감지 (Isolation Forest)"""
        data_reshaped = data.reshape(-1, 1)
        predictions = self.isolation_forest.fit_predict(data_reshaped)
        return predictions == -1

    def detect_trend(self, data, window=10):
        """추세 이상 감지"""
        rolling_mean = pd.Series(data).rolling(window=window).mean()
        diff = np.abs(data - rolling_mean)
        threshold = np.percentile(diff, 95)
        return diff > threshold

    def combined_detect(self, data):
        """3가지 방법 종합 판단 (2개 이상 일치 시 확정)"""
        stat_anomalies, _, _ = self.detect_statistical(data)
        ml_anomalies = self.detect_ml(data)
        trend_anomalies = self.detect_trend(data)

        combined = (
            stat_anomalies.astype(int) +
            ml_anomalies.astype(int) +
            trend_anomalies.astype(int)
        ) >= 2
        return combined

# 사용 예시
detector = MultiLayerAnomalyDetector()
sensor_data = pd.read_csv('sensor_log.csv')['temperature'].values
anomalies = detector.combined_detect(sensor_data)
print(f"이상 감지: {np.sum(anomalies)}개 시점")`}
            </pre>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-red-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-3">📈 통계적 방법</h4>
              <p className="text-gray-300 text-sm">3-sigma rule</p>
            </div>
            <div className="bg-orange-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-3">🤖 ML 방법</h4>
              <p className="text-gray-300 text-sm">Isolation Forest</p>
            </div>
            <div className="bg-yellow-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-3">📊 추세 방법</h4>
              <p className="text-gray-300 text-sm">Rolling mean 기반</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function AlertSystemDeepDive() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-lg rounded-3xl p-12 border-2 border-green-500/30"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-green-500/30 rounded-2xl p-4">
            <Bell className="w-12 h-12 text-green-300" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Deep Dive 3</h2>
            <p className="text-2xl text-green-300">멀티채널 알림 시스템</p>
          </div>
        </div>

        <div className="bg-black/40 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">실시간 알림 자동화</h3>
          <div className="bg-black/60 rounded-xl p-6 font-mono text-xs overflow-x-auto">
            <pre className="text-gray-300 whitespace-pre-wrap">
{`import smtplib
from slack_sdk import WebClient

class AlertSystem:
    def __init__(self):
        self.email_server = smtplib.SMTP('smtp.gmail.com', 587)
        self.slack_client = WebClient(token=os.getenv('SLACK_TOKEN'))

    def send_email(self, to, subject, body):
        """이메일 알림"""
        msg = f"Subject: {subject}\\n\\n{body}"
        self.email_server.sendmail('alert@company.com', to, msg)

    def send_slack(self, channel, message):
        """Slack 알림"""
        self.slack_client.chat_postMessage(channel=channel, text=message)

    def send_sms(self, phone, message):
        """SMS 알림"""
        from twilio.rest import Client
        client = Client(os.getenv('TWILIO_SID'), os.getenv('TWILIO_TOKEN'))
        client.messages.create(to=phone, from_='+1234567890', body=message)

    def send_alert(self, severity, sensor, value, threshold):
        """멀티채널 알림 발송"""
        message = f"""
⚠️ 센서 이상 감지
- 센서: {sensor}
- 현재값: {value:.2f}
- 임계값: {threshold:.2f}
- 심각도: {severity}
"""

        if severity == 'HIGH':
            # 긴급: 이메일 + Slack + SMS
            self.send_email('engineer@company.com', '긴급: 센서 이상', message)
            self.send_slack('#alerts', message)
            self.send_sms('+821012345678', f"{sensor} 긴급 이상")
        elif severity == 'MEDIUM':
            # 중간: 이메일 + Slack
            self.send_email('engineer@company.com', '주의: 센서 경고', message)
            self.send_slack('#alerts', message)
        else:
            # 낮음: Slack만
            self.send_slack('#monitoring', message)

# 실시간 모니터링
alert_system = AlertSystem()
while True:
    current_temp = get_sensor_value('temperature')
    if current_temp > 60:
        alert_system.send_alert('HIGH', 'Temperature', current_temp, 60)
    time.sleep(60)`}
            </pre>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-green-500/20 rounded-xl p-6">
              <Mail className="w-8 h-8 text-green-400 mb-3" />
              <h4 className="text-white font-bold mb-2">Email</h4>
              <p className="text-gray-300 text-sm">상세 보고서 첨부</p>
            </div>
            <div className="bg-blue-500/20 rounded-xl p-6">
              <Smartphone className="w-8 h-8 text-blue-400 mb-3" />
              <h4 className="text-white font-bold mb-2">Slack</h4>
              <p className="text-gray-300 text-sm">실시간 팀 공유</p>
            </div>
            <div className="bg-purple-500/20 rounded-xl p-6">
              <Bell className="w-8 h-8 text-purple-400 mb-3" />
              <h4 className="text-white font-bold mb-2">SMS</h4>
              <p className="text-gray-300 text-sm">긴급 상황 즉시 통보</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function InteractiveWorkshop() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  const steps = [
    { title: '센서 데이터 수집', description: 'CSV 파일 로드 및 전처리' },
    { title: '시계열 예측', description: 'Prophet으로 미래 값 예측' },
    { title: '이상 감지', description: '3가지 방법으로 이상 탐지' },
    { title: '알림 발송', description: '멀티채널 자동 알림' }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-4xl font-bold text-white mb-12 text-center"
      >
        Interactive Workshop
      </motion.h2>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/5 rounded-2xl p-6 border-2 cursor-pointer ${
                currentStep === index ? 'border-blue-500' : completed.includes(index) ? 'border-green-500' : 'border-white/10'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  completed.includes(index) ? 'bg-green-500' : currentStep === index ? 'bg-blue-500' : 'bg-white/10'
                }`}>
                  {completed.includes(index) ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-white font-bold">{index + 1}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-2xl p-8 border border-blue-500/30 sticky top-24 h-fit">
          <h3 className="text-2xl font-bold text-white mb-6">Step {currentStep + 1}</h3>
          <p className="text-gray-300 mb-6">{steps[currentStep].description}</p>

          <button
            onClick={() => {
              if (!completed.includes(currentStep)) {
                setCompleted([...completed, currentStep]);
              }
              if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
              }
            }}
            disabled={completed.includes(currentStep)}
            className={`w-full py-3 rounded-xl font-semibold ${
              completed.includes(currentStep) ? 'bg-green-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {completed.includes(currentStep) ? '✅ Complete!' : '완료하기'}
          </button>

          {completed.length === steps.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-center"
            >
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
    'Prophet 설치 및 시계열 예측 코드 작성',
    '이상 감지 알고리즘 3가지 구현',
    '임계값 설정 및 동적 조정',
    '이메일 알림 시스템 구축',
    'Slack 웹훅 연동',
    'SMS 알림 (선택) 구현'
  ];

  const progress = (checks.filter(Boolean).length / items.length) * 100;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-4xl font-bold text-white mb-12 text-center"
      >
        Verification Checklist
      </motion.h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => {
              const newChecks = [...checks];
              newChecks[index] = !newChecks[index];
              setChecks(newChecks);
            }}
            className={`bg-white/5 rounded-xl p-6 border-2 cursor-pointer ${checks[index] ? 'border-green-500' : 'border-white/10'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                checks[index] ? 'bg-green-500 border-green-500' : 'border-white/30'
              }`}>
                {checks[index] && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <p className={`text-lg ${checks[index] ? 'text-green-300 line-through' : 'text-white'}`}>{item}</p>
            </div>
          </motion.div>
        ))}

        <div className="bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-2xl p-8 border border-blue-500/30">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>진행률</span>
            <span>{checks.filter(Boolean).length} / {items.length}</span>
          </div>
          <div className="h-4 bg-black/40 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-green-500 to-blue-500"
            />
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
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-4xl font-bold text-white mb-12 text-center"
      >
        What's Next?
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: BarChart3, title: 'Lecture 16', subtitle: '통합 대시보드', color: '#9B59B6' },
          { icon: Rocket, title: 'Lecture 17', subtitle: '기술 면접 & 피칭', color: '#E67E22' },
          { icon: Activity, title: 'Projects', subtitle: '실전 프로젝트', color: '#1ABC9C' }
        ].map((topic, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 rounded-2xl p-8 border border-white/10"
          >
            <topic.icon className="w-16 h-16 mb-4" style={{ color: topic.color }} />
            <h3 className="text-2xl font-bold text-white mb-2">{topic.title}</h3>
            <p className="text-xl" style={{ color: topic.color }}>{topic.subtitle}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black/30 backdrop-blur-md border-t border-blue-500/30 py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-gray-400">Letuin AI Lecture - Lecture 15</p>
        <p className="text-gray-500 text-sm mt-2">© 2026 Letuin Education</p>
      </div>
    </footer>
  );
}

export default App;
