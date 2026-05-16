import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Eye, Zap, AlertTriangle, CheckCircle2, XCircle,
  Image as ImageIcon, Layers, TrendingUp, Code, Download, Upload,
  Settings, Play, Pause, BarChart3, Activity, Battery, Dna,
  ChevronRight, FileCode, Terminal, Rocket, Brain, Target
} from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <Hero />
      <ProblemStatement />
      <VisionOverview />
      <DomainApplications />
      <BeforeAfterComparison />
      <ImageProcessingDeepDive />
      <DefectDetectionDeepDive />
      <BatchAutomationDeepDive />
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
      className="bg-black/30 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Camera className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Lecture 14</h1>
            <p className="text-sm text-purple-300">이미지 분석 자동화 with Gemini Vision API</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm">
            Advanced AI Vision
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
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-block mb-6"
        >
          <div className="relative">
            <Camera className="w-24 h-24 text-purple-400 mx-auto" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2"
            >
              <Brain className="w-12 h-12 text-green-400" />
            </motion.div>
          </div>
        </motion.div>

        <h1 className="text-6xl font-bold text-white mb-6">
          이미지 분석 자동화
        </h1>
        <p className="text-3xl text-purple-300 mb-4">
          Gemini Vision API로 품질검사 혁신하기
        </p>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          육안 검사에 몇 시간씩 걸리던 작업을 AI가 초 단위로 처리합니다.<br/>
          반도체 웨이퍼부터 배터리 셀까지, 모든 제조 공정의 이미지 분석을 자동화하세요.
        </p>
      </motion.div>
    </section>
  );
}

function ProblemStatement() {
  const problems = [
    {
      icon: Eye,
      title: '육안 검사의 한계',
      description: '사람이 하루 1000장 검사 → 피로도 ↑, 정확도 ↓',
      impact: '불량률 5-10% 누락',
      color: '#E74C3C'
    },
    {
      icon: AlertTriangle,
      title: '일관성 부족',
      description: '검사자마다 다른 기준, 시간대별 집중도 차이',
      impact: '품질 편차 발생',
      color: '#E67E22'
    },
    {
      icon: TrendingUp,
      title: '확장성 문제',
      description: '생산량 증가 시 검사 인력 비례 증가 필요',
      impact: '인건비 급증',
      color: '#F39C12'
    },
    {
      icon: Zap,
      title: '실시간 대응 불가',
      description: '불량 발견 후 조치까지 시간 지연',
      impact: '불량품 대량 생산',
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
        제조 현장의 이미지 검사 문제점
      </motion.h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {problems.map((problem, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
          >
            <problem.icon className="w-12 h-12 mb-4" style={{ color: problem.color }} />
            <h3 className="text-xl font-bold text-white mb-3">{problem.title}</h3>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">{problem.description}</p>
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
        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-500/30"
      >
        <div className="flex items-start gap-4">
          <Camera className="w-16 h-16 text-purple-400 flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">Gemini Vision API 솔루션</h3>
            <p className="text-xl text-gray-200 leading-relaxed mb-4">
              AI가 이미지를 "이해"하고 "판단"합니다. 단순 패턴 매칭이 아닌, 맥락을 고려한 지능형 검사가 가능합니다.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-black/30 rounded-lg p-4">
                <p className="text-green-400 text-2xl font-bold mb-1">99.8%</p>
                <p className="text-gray-300 text-sm">검사 정확도</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <p className="text-blue-400 text-2xl font-bold mb-1">0.5초</p>
                <p className="text-gray-300 text-sm">이미지당 처리시간</p>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <p className="text-purple-400 text-2xl font-bold mb-1">24/7</p>
                <p className="text-gray-300 text-sm">무중단 자동 검사</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function VisionOverview() {
  const capabilities = [
    {
      icon: Eye,
      title: '객체 인식',
      description: '이미지 속 객체, 위치, 크기 자동 파악',
      examples: ['스크래치 위치', '부품 배치', '라벨 텍스트']
    },
    {
      icon: Target,
      title: '결함 분류',
      description: '불량 유형을 자동으로 분류하고 심각도 평가',
      examples: ['표면 결함', '색상 이상', '형상 불량']
    },
    {
      icon: Brain,
      title: '맥락 이해',
      description: '이미지의 의미를 이해하고 자연어로 설명',
      examples: ['품질 판정', '원인 추론', '개선 제안']
    },
    {
      icon: Layers,
      title: '멀티모달',
      description: '이미지 + 텍스트 프롬프트로 정밀 제어',
      examples: ['조건부 검사', '맞춤형 기준', '상황별 대응']
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
        Gemini Vision API 핵심 기능
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-6">
        {capabilities.map((cap, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-start gap-4">
              <div className="bg-purple-500/20 rounded-xl p-3">
                <cap.icon className="w-8 h-8 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">{cap.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{cap.description}</p>
                <div className="space-y-2">
                  {cap.examples.map((example, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-300 text-sm">{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function DomainApplications() {
  const domains = [
    {
      icon: Activity,
      domain: '반도체 (Semiconductor)',
      useCase: '웨이퍼 표면 검사',
      images: ['웨이퍼 스크래치', '패턴 결함', 'Die 불량'],
      accuracy: '99.9%',
      speed: '0.3초/웨이퍼',
      benefit: '육안 검사 대비 50배 빠름',
      color: '#3498DB'
    },
    {
      icon: BarChart3,
      domain: '디스플레이 (Display)',
      useCase: '패널 픽셀 검사',
      images: ['데드 픽셀', '휘점', '색상 불균일'],
      accuracy: '99.7%',
      speed: '0.4초/패널',
      benefit: '불량률 3% → 0.1%로 감소',
      color: '#9B59B6'
    },
    {
      icon: Battery,
      domain: '배터리 (Battery)',
      useCase: '셀 표면 & 용접부 검사',
      images: ['표면 흠집', '용접 불량', '덴트 검출'],
      accuracy: '99.5%',
      speed: '0.5초/셀',
      benefit: '화재 사고 위험 90% 감소',
      color: '#1ABC9C'
    },
    {
      icon: Dna,
      domain: '바이오 (Bio)',
      useCase: '세포 이미지 분석',
      images: ['세포 형태', '염색 패턴', '이상 세포'],
      accuracy: '98.5%',
      speed: '0.6초/슬라이드',
      benefit: '병리학자 분석 시간 70% 단축',
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
        산업별 적용 사례
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8">
        {domains.map((domain, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-purple-500/20 rounded-xl p-3">
                <domain.icon className="w-10 h-10" style={{ color: domain.color }} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">{domain.domain}</h3>
                <p className="text-purple-300 text-lg">{domain.useCase}</p>
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                검사 대상 이미지
              </h4>
              <div className="flex flex-wrap gap-2">
                {domain.images.map((img, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-500/20 rounded-lg text-purple-300 text-sm">
                    {img}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                <p className="text-green-400 text-lg font-bold">{domain.accuracy}</p>
                <p className="text-gray-400 text-xs">정확도</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
                <p className="text-blue-400 text-lg font-bold">{domain.speed}</p>
                <p className="text-gray-400 text-xs">처리속도</p>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30 col-span-3">
                <p className="text-purple-300 text-sm font-semibold">✨ {domain.benefit}</p>
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
        Before vs After: 이미지 검사 자동화
      </motion.h2>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* BEFORE */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-red-500/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <XCircle className="w-10 h-10 text-red-400" />
            <h3 className="text-3xl font-bold text-white">Before</h3>
          </div>

          <div className="space-y-6">
            <div className="bg-black/40 rounded-xl p-6">
              <h4 className="text-red-300 font-bold mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                수동 육안 검사
              </h4>
              <div className="space-y-3 text-gray-300">
                <p className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">❌</span>
                  <span className="text-sm">검사자가 현미경으로 하나씩 확인</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">❌</span>
                  <span className="text-sm">육안 판단에 의존 → 일관성 부족</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">❌</span>
                  <span className="text-sm">엑셀에 수기로 불량 내역 기록</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">❌</span>
                  <span className="text-sm">하루 1000장 검사가 한계</span>
                </p>
              </div>
            </div>

            <div className="bg-red-500/20 rounded-xl p-4 border border-red-500/30">
              <p className="text-white font-bold mb-2">⏱️ 검사 시간</p>
              <p className="text-red-300 text-2xl font-bold">30초/이미지</p>
              <p className="text-gray-400 text-sm mt-2">1000장 검사: 약 8시간 소요</p>
            </div>

            <div className="bg-red-500/20 rounded-xl p-4 border border-red-500/30">
              <p className="text-white font-bold mb-2">🎯 검사 정확도</p>
              <p className="text-red-300 text-2xl font-bold">85-90%</p>
              <p className="text-gray-400 text-sm mt-2">피로도에 따라 변동</p>
            </div>
          </div>
        </motion.div>

        {/* PROMPT */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-purple-500/50"
        >
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-10 h-10 text-purple-400" />
            <h3 className="text-3xl font-bold text-white">Prompt</h3>
          </div>

          <div className="bg-black/60 rounded-xl p-6 font-mono text-sm mb-6">
            <div className="text-green-400 mb-4"># Gemini Vision API 호출</div>
            <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed">
{`import google.generativeai as genai
from PIL import Image

# 모델 설정
model = genai.GenerativeModel(
  'gemini-2.0-flash-exp'
)

# 이미지 로드
image = Image.open('wafer_001.jpg')

# 프롬프트 작성
prompt = """
이 반도체 웨이퍼 이미지를 분석해주세요:

1. 표면 결함 유무 (스크래치, 파티클)
2. 결함 위치 및 크기
3. 심각도 등급 (양호/주의/불량)
4. 불량 판정 시 상세 사유

JSON 형식으로 답변해주세요.
"""

# API 호출
response = model.generate_content(
  [prompt, image]
)

print(response.text)`}
            </pre>
          </div>

          <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/40">
            <p className="text-purple-300 text-sm font-semibold mb-2">✨ 핵심 포인트</p>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• 이미지 + 텍스트를 함께 전달</li>
              <li>• 구체적인 검사 기준 명시</li>
              <li>• JSON 형식으로 구조화된 결과</li>
              <li>• 0.3~0.6초만에 분석 완료</li>
            </ul>
          </div>
        </motion.div>

        {/* AFTER */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="bg-green-500/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-green-500/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
            <h3 className="text-3xl font-bold text-white">After</h3>
          </div>

          <div className="space-y-6">
            <div className="bg-black/40 rounded-xl p-6">
              <h4 className="text-green-300 font-bold mb-3 flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                AI 자동 검사
              </h4>
              <div className="space-y-3 text-gray-300">
                <p className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✅</span>
                  <span className="text-sm">이미지 업로드하면 자동 분석</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✅</span>
                  <span className="text-sm">일관된 기준으로 24/7 검사</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✅</span>
                  <span className="text-sm">결과를 DB에 자동 저장</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✅</span>
                  <span className="text-sm">대량 이미지 일괄 처리 가능</span>
                </p>
              </div>
            </div>

            <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
              <p className="text-white font-bold mb-2">⚡ 검사 시간</p>
              <p className="text-green-300 text-2xl font-bold">0.5초/이미지</p>
              <p className="text-gray-400 text-sm mt-2">1000장 검사: 약 10분 소요</p>
            </div>

            <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
              <p className="text-white font-bold mb-2">🎯 검사 정확도</p>
              <p className="text-green-300 text-2xl font-bold">99.5%+</p>
              <p className="text-gray-400 text-sm mt-2">일관된 높은 정확도 유지</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Impact Summary */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-8 border border-green-500/30"
      >
        <h3 className="text-2xl font-bold text-white mb-6 text-center">자동화 효과</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-green-400 mb-2">60배</p>
            <p className="text-gray-300">검사 속도 향상</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-400 mb-2">10%↑</p>
            <p className="text-gray-300">정확도 개선</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-purple-400 mb-2">90%↓</p>
            <p className="text-gray-300">인건비 절감</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-pink-400 mb-2">24/7</p>
            <p className="text-gray-300">무중단 가동</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function ImageProcessingDeepDive() {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'batch'>('basic');

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-12 border-2 border-indigo-500/30"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-indigo-500/30 rounded-2xl p-4">
            <ImageIcon className="w-12 h-12 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Deep Dive 1</h2>
            <p className="text-2xl text-indigo-300">이미지 전처리 & Vision API 기본</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          {[
            { key: 'basic', label: '기본 사용법' },
            { key: 'advanced', label: '고급 프롬프트' },
            { key: 'batch', label: '배치 처리' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'basic' && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-black/40 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Terminal className="w-6 h-6 text-green-400" />
                  Step 1: 이미지 전처리 (PIL 사용)
                </h3>
                <div className="bg-black/60 rounded-xl p-6 font-mono text-sm overflow-x-auto">
                  <pre className="text-gray-300 whitespace-pre">
{`from PIL import Image, ImageEnhance
import os

def preprocess_image(image_path, output_path):
    """
    이미지 전처리: 크기 조정, 밝기 보정, 노이즈 제거
    """
    # 이미지 로드
    img = Image.open(image_path)

    # 1. 크기 조정 (API 최적 사이즈: 1024x1024 이하)
    max_size = 1024
    img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)

    # 2. 밝기 보정 (어두운 이미지 개선)
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(1.2)  # 20% 밝게

    # 3. 선명도 향상
    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(1.5)

    # 4. 저장
    img.save(output_path, quality=95)
    print(f"✅ 전처리 완료: {output_path}")
    return img

# 사용 예시
processed_img = preprocess_image(
    'raw_wafer.jpg',
    'processed_wafer.jpg'
)`}
                  </pre>
                </div>
              </div>

              <div className="bg-black/40 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Code className="w-6 h-6 text-purple-400" />
                  Step 2: Gemini Vision API 호출
                </h3>
                <div className="bg-black/60 rounded-xl p-6 font-mono text-sm overflow-x-auto">
                  <pre className="text-gray-300 whitespace-pre">
{`import google.generativeai as genai
import os

# API 키 설정
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# 모델 초기화
model = genai.GenerativeModel('gemini-2.0-flash-exp')

def analyze_image(image_path, prompt):
    """
    이미지 분석 함수
    """
    # 이미지 로드
    img = Image.open(image_path)

    # API 호출
    response = model.generate_content([prompt, img])

    return response.text

# 사용 예시
prompt = """
이 반도체 웨이퍼 이미지를 검사해주세요:
1. 표면 결함이 있나요? (있음/없음)
2. 있다면 어떤 종류인가요? (스크래치/파티클/크랙)
3. 결함의 심각도는? (낮음/중간/높음)
4. 종합 판정: 합격/불합격

JSON 형식으로 답변해주세요.
"""

result = analyze_image('processed_wafer.jpg', prompt)
print(result)`}
                  </pre>
                </div>
              </div>

              <div className="bg-indigo-500/20 rounded-xl p-6 border border-indigo-500/40">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  실행 결과 예시
                </h4>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                  <pre className="text-green-400">
{`{
  "defect_detected": true,
  "defect_type": "스크래치",
  "severity": "중간",
  "location": "좌상단 영역 (100, 150) 근처",
  "size": "약 2mm 길이",
  "judgment": "불합격",
  "reason": "스크래치 길이가 허용 기준(1mm)을 초과함",
  "recommendation": "해당 웨이퍼 재가공 또는 폐기"
}`}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'advanced' && (
            <motion.div
              key="advanced"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-black/40 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Brain className="w-6 h-6 text-pink-400" />
                  고급 프롬프트 엔지니어링
                </h3>
                <div className="bg-black/60 rounded-xl p-6 font-mono text-sm overflow-x-auto">
                  <pre className="text-gray-300 whitespace-pre-wrap text-xs leading-relaxed">
{`# 정밀 검사용 고급 프롬프트
advanced_prompt = """
당신은 20년 경력의 반도체 품질 검사 전문가입니다.
다음 웨이퍼 이미지를 분석하여 상세 보고서를 작성하세요.

## 검사 기준:
- 스크래치: 1mm 이상 → 불합격
- 파티클: 지름 0.5mm 이상 → 불합격
- 크랙: 어떤 크기든 → 즉시 불합격
- 색상 불균일: 20% 이상 면적 → 주의

## 분석 항목:
1. 결함 탐지 (있음/없음)
2. 결함 유형 및 개수
3. 각 결함의 정확한 위치 (픽셀 좌표)
4. 각 결함의 크기 (mm 단위 추정)
5. 심각도 평가 (1-10점)
6. 종합 판정 (합격/주의/불합격)
7. 불합격 시 예상 원인
8. 개선 제안 사항

## 출력 형식:
반드시 JSON 형식으로 출력하되,
각 항목에 대한 상세한 설명을 포함하세요.

## 추가 지시사항:
- 미세한 결함도 놓치지 마세요
- 확실하지 않은 경우 "불확실"이라고 표시하세요
- 결함이 없어도 반드시 "검사 완료" 메시지를 출력하세요
"""

# 고급 분석 함수
def advanced_analysis(image_path):
    img = Image.open(image_path)
    response = model.generate_content([advanced_prompt, img])

    # JSON 파싱
    import json
    try:
        result = json.loads(response.text)
        return result
    except:
        return {"error": "JSON 파싱 실패", "raw": response.text}

# 실행
result = advanced_analysis('wafer_critical.jpg')
print(json.dumps(result, indent=2, ensure_ascii=False))`}
                  </pre>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-purple-500/20 rounded-xl p-6 border border-purple-500/40">
                  <h4 className="text-white font-bold mb-3">✨ 프롬프트 작성 팁</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• 역할 부여: "당신은 전문가입니다"</li>
                    <li>• 구체적 기준: 수치로 명확히 정의</li>
                    <li>• 출력 형식: JSON, 표, 리스트 등 지정</li>
                    <li>• 예외 처리: 불확실할 때 행동 정의</li>
                  </ul>
                </div>
                <div className="bg-pink-500/20 rounded-xl p-6 border border-pink-500/40">
                  <h4 className="text-white font-bold mb-3">⚡ 성능 최적화</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• 이미지 크기: 1024x1024 이하</li>
                    <li>• 프롬프트 길이: 2000자 이내 권장</li>
                    <li>• 배치 요청: 비동기 처리 활용</li>
                    <li>• 캐싱: 동일 이미지 재요청 방지</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'batch' && (
            <motion.div
              key="batch"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-black/40 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Layers className="w-6 h-6 text-blue-400" />
                  대량 이미지 일괄 처리
                </h3>
                <div className="bg-black/60 rounded-xl p-6 font-mono text-xs overflow-x-auto">
                  <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed">
{`import asyncio
from pathlib import Path
import pandas as pd
from datetime import datetime

class BatchImageAnalyzer:
    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        self.results = []

    async def analyze_single(self, image_path):
        """단일 이미지 비동기 분석"""
        try:
            img = Image.open(image_path)
            prompt = """
            이미지를 검사하고 다음을 JSON으로 반환:
            {"defect": true/false, "type": "결함 유형",
             "severity": "심각도", "judgment": "합격/불합격"}
            """
            response = self.model.generate_content([prompt, img])
            result = {
                'timestamp': datetime.now(),
                'image_path': str(image_path),
                'filename': image_path.name,
                'result': response.text,
                'status': 'success'
            }
        except Exception as e:
            result = {
                'timestamp': datetime.now(),
                'image_path': str(image_path),
                'filename': image_path.name,
                'result': None,
                'status': 'error',
                'error': str(e)
            }
        self.results.append(result)
        return result

    async def process_batch(self, image_folder, max_concurrent=10):
        """폴더 내 모든 이미지 일괄 처리"""
        image_paths = list(Path(image_folder).glob('*.jpg'))
        image_paths.extend(list(Path(image_folder).glob('*.png')))
        print(f"📁 총 {len(image_paths)}개 이미지 발견")

        # Semaphore로 동시 요청 수 제한
        semaphore = asyncio.Semaphore(max_concurrent)

        async def process_with_limit(path):
            async with semaphore:
                print(f"🔍 처리 중: {path.name}")
                return await self.analyze_single(path)

        # 병렬 처리
        tasks = [process_with_limit(path) for path in image_paths]
        await asyncio.gather(*tasks)

        # 결과를 DataFrame으로 변환
        df = pd.DataFrame(self.results)
        output_file = f'inspection_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        df.to_csv(output_file, index=False, encoding='utf-8-sig')
        print(f"\\n✅ 분석 완료! 결과 저장: {output_file}")
        return df

# 사용 예시
async def main():
    analyzer = BatchImageAnalyzer(api_key=os.getenv('GEMINI_API_KEY'))
    results = await analyzer.process_batch('./wafer_images', max_concurrent=5)

asyncio.run(main())`}
                  </pre>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-500/20 rounded-xl p-6 border border-blue-500/40">
                  <h4 className="text-white font-bold mb-3">⚡ 처리 속도</h4>
                  <p className="text-blue-300 text-2xl font-bold mb-2">1000장</p>
                  <p className="text-gray-400 text-sm">약 8-10분 소요</p>
                  <p className="text-gray-400 text-sm">(병렬 처리 시)</p>
                </div>
                <div className="bg-green-500/20 rounded-xl p-6 border border-green-500/40">
                  <h4 className="text-white font-bold mb-3">💰 비용 절감</h4>
                  <p className="text-green-300 text-2xl font-bold mb-2">90%</p>
                  <p className="text-gray-400 text-sm">인건비 대비</p>
                  <p className="text-gray-400 text-sm">(검사자 10명 → AI 1대)</p>
                </div>
                <div className="bg-purple-500/20 rounded-xl p-6 border border-purple-500/40">
                  <h4 className="text-white font-bold mb-3">🎯 정확도</h4>
                  <p className="text-purple-300 text-2xl font-bold mb-2">99.5%</p>
                  <p className="text-gray-400 text-sm">육안 검사: 85-90%</p>
                  <p className="text-gray-400 text-sm">(피로도 영향 없음)</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function DefectDetectionDeepDive() {
  const [selectedDefect, setSelectedDefect] = useState<string>('scratch');

  const defectTypes = {
    scratch: {
      name: '스크래치',
      icon: Activity,
      color: '#E74C3C'
    },
    particle: {
      name: '파티클',
      icon: Target,
      color: '#E67E22'
    },
    crack: {
      name: '크랙',
      icon: AlertTriangle,
      color: '#C0392B'
    },
    discoloration: {
      name: '변색',
      icon: Eye,
      color: '#F39C12'
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-lg rounded-3xl p-12 border-2 border-red-500/30"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-red-500/30 rounded-2xl p-4">
            <Target className="w-12 h-12 text-red-300" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Deep Dive 2</h2>
            <p className="text-2xl text-red-300">결함 유형별 검출 전략</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {Object.entries(defectTypes).map(([key, defect]) => (
            <button
              key={key}
              onClick={() => setSelectedDefect(key)}
              className={`p-4 rounded-xl font-semibold transition-all ${
                selectedDefect === key
                  ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white scale-105'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <defect.icon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">{defect.name}</p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDefect}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-black/40 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">{defectTypes[selectedDefect as keyof typeof defectTypes].name} 검출 코드</h3>
            <div className="bg-black/60 rounded-xl p-6 font-mono text-xs overflow-x-auto">
              <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed">
{selectedDefect === 'scratch' ? `# 스크래치 검출
prompt = """
이미지에서 스크래치(긁힘)를 찾아주세요.
- 선형 형태의 결함만 스크래치로 분류
- 길이 1mm 미만은 무시
- 여러 개 발견 시 모두 나열
JSON으로 출력: {"scratch_found": bool, "count": int, "locations": []}
"""` : selectedDefect === 'particle' ? `# 파티클 검출
prompt = """
이미지에서 파티클(이물질)을 찾아주세요.
- 점 형태의 이물질만 파티클로 분류
- 지름 0.5mm 미만은 무시
- 색상이 주변과 다른 점에 집중
JSON으로 출력: {"particle_found": bool, "count": int, "sizes": []}
"""` : selectedDefect === 'crack' ? `# 크랙 검출
prompt = """
이미지에서 크랙(균열)을 찾아주세요.
- 불규칙한 선 형태의 결함을 크랙으로 분류
- 크랙은 크기 관계없이 무조건 불합격
- 미세 균열도 놓치지 마세요
JSON으로 출력: {"crack_found": bool, "severity": "높음", "judgment": "불합격"}
"""` : `# 변색 검출
prompt = """
이미지에서 변색(색상 불균일)을 찾아주세요.
- 주변과 색상이 다른 영역 탐지
- 전체 면적의 20% 이상 변색 시 불합격
JSON으로 출력: {"discoloration_found": bool, "area_percent": float}
"""`}
              </pre>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function BatchAutomationDeepDive() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-lg rounded-3xl p-12 border-2 border-green-500/30"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-green-500/30 rounded-2xl p-4">
            <Rocket className="w-12 h-12 text-green-300" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Deep Dive 3</h2>
            <p className="text-2xl text-green-300">실시간 생산 라인 통합</p>
          </div>
        </div>

        <div className="bg-black/40 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">전체 자동화 시스템 아키텍처</h3>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { step: '1', title: '이미지 캡처', icon: Camera, desc: '생산 라인 카메라' },
              { step: '2', title: 'AI 분석', icon: Brain, desc: 'Gemini Vision API' },
              { step: '3', title: 'DB 저장', icon: Download, desc: '결과 자동 기록' },
              { step: '4', title: '알림 발송', icon: Zap, desc: '불량 시 즉시 통보' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                  <item.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-white font-bold mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-8 border border-green-500/30">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">실시간 시스템 성능</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-400 mb-2">0.5초</p>
                <p className="text-gray-300">검사 시간</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-400 mb-2">99.7%</p>
                <p className="text-gray-300">정확도</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-400 mb-2">1000+</p>
                <p className="text-gray-300">시간당 처리</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-pink-400 mb-2">&lt;1초</p>
                <p className="text-gray-300">알림 지연</p>
              </div>
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
    { title: '이미지 전처리', description: 'PIL로 이미지 크기 조정 및 밝기 보정' },
    { title: 'Vision API 호출', description: 'Gemini에 이미지 + 프롬프트 전송' },
    { title: '결과 파싱', description: 'JSON 응답에서 결함 정보 추출' },
    { title: 'DB 저장 & 알림', description: '결과 저장 및 불량 시 알림 발송' }
  ];

  const handleComplete = (index: number) => {
    if (!completed.includes(index)) {
      setCompleted([...completed, index]);
    }
    if (index < steps.length - 1) {
      setCurrentStep(index + 1);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
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
              className={`bg-white/5 backdrop-blur-lg rounded-2xl p-6 border-2 cursor-pointer ${
                currentStep === index
                  ? 'border-purple-500'
                  : completed.includes(index)
                  ? 'border-green-500'
                  : 'border-white/10'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  completed.includes(index)
                    ? 'bg-green-500'
                    : currentStep === index
                    ? 'bg-purple-500'
                    : 'bg-white/10'
                }`}>
                  {completed.includes(index) ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-white font-bold">{index + 1}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 sticky top-24 h-fit">
          <h3 className="text-2xl font-bold text-white mb-6">Step {currentStep + 1}</h3>
          <p className="text-gray-300 mb-6">{steps[currentStep].description}</p>

          <button
            onClick={() => handleComplete(currentStep)}
            disabled={completed.includes(currentStep)}
            className={`w-full py-3 rounded-xl font-semibold ${
              completed.includes(currentStep)
                ? 'bg-green-500 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600'
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
              <h4 className="text-2xl font-bold text-white mb-2">축하합니다! 🎉</h4>
              <p className="text-white/90">이미지 검사 자동화 완료!</p>
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
    'Gemini Vision API 키 발급 및 설정',
    'PIL로 이미지 전처리 코드 작성',
    'Vision API 호출 및 테스트',
    '결함 유형별 프롬프트 작성',
    '배치 처리로 대량 이미지 검사',
    'DB 저장 및 알림 시스템 구현'
  ];

  const progress = (checks.filter(Boolean).length / items.length) * 100;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
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
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            onClick={() => {
              const newChecks = [...checks];
              newChecks[index] = !newChecks[index];
              setChecks(newChecks);
            }}
            className={`bg-white/5 backdrop-blur-lg rounded-xl p-6 border-2 cursor-pointer ${
              checks[index] ? 'border-green-500' : 'border-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                checks[index] ? 'bg-green-500 border-green-500' : 'border-white/30'
              }`}>
                {checks[index] && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <p className={`text-lg ${checks[index] ? 'text-green-300 line-through' : 'text-white'}`}>
                {item}
              </p>
            </div>
          </motion.div>
        ))}

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-500/30">
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
  const topics = [
    { icon: Activity, title: 'Lecture 15', subtitle: '센서 데이터 예측', color: '#3498DB' },
    { icon: BarChart3, title: 'Lecture 16', subtitle: '통합 대시보드', color: '#9B59B6' },
    { icon: Rocket, title: 'Lecture 17', subtitle: '기술 면접 & 피칭', color: '#E67E22' }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-white mb-12 text-center"
      >
        What's Next?
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-8">
        {topics.map((topic, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
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
    <footer className="bg-black/30 backdrop-blur-md border-t border-purple-500/30 py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-gray-400">Letuin AI Lecture - Lecture 14</p>
        <p className="text-gray-500 text-sm mt-2">© 2026 Letuin Education</p>
      </div>
    </footer>
  );
}

export default App;
