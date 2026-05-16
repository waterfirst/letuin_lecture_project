import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Users, MessageSquare, CheckCircle2, XCircle, Code,
  Target, Trophy, Lightbulb, FileText, Github, Linkedin,
  Mail, Phone, Star, Award, TrendingUp, Zap, Rocket,
  ChevronRight, Terminal, Eye, Brain, Activity, BarChart3
} from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
      <Header />
      <Hero />
      <InterviewOverview />
      <TechnicalInterviewDeepDive />
      <ProjectPresentationDeepDive />
      <BehavioralInterviewDeepDive />
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
      className="bg-black/30 backdrop-blur-md border-b border-orange-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-orange-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Lecture 17</h1>
            <p className="text-sm text-orange-300">기술 면접 & 실무 피칭 전략</p>
          </div>
        </div>
        <span className="px-4 py-2 bg-orange-500/20 rounded-full text-orange-300 text-sm">
          Career Ready
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
          <Briefcase className="w-24 h-24 text-orange-400 mx-auto" />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2">
            <Trophy className="w-12 h-12 text-yellow-400" />
          </motion.div>
        </motion.div>
        <h1 className="text-6xl font-bold text-white mb-6">기술 면접 & 실무 피칭</h1>
        <p className="text-3xl text-orange-300 mb-4">포트폴리오를 무기로 취업 성공하기</p>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto">
          13~16강에서 만든 AI 프로젝트를 면접관에게 효과적으로 전달하고<br/>
          반도체/디스플레이/배터리/바이오 기업 취업을 성공시킵니다.
        </p>
      </motion.div>
    </section>
  );
}

function InterviewOverview() {
  const stages = [
    {
      icon: FileText,
      title: '서류 전형',
      key: 'GitHub 포트폴리오',
      tip: 'README 잘 작성, 실행 가능한 코드',
      success: '통과율 80%',
      color: '#3498DB'
    },
    {
      icon: Code,
      title: '기술 면접',
      key: '프로젝트 설명 + 코딩 테스트',
      tip: 'Gemini API 동작 원리 설명',
      success: '합격률 60%',
      color: '#9B59B6'
    },
    {
      icon: Users,
      title: '실무 면접',
      key: '문제 해결 능력 + 협업',
      tip: '실제 사례로 증명',
      success: '합격률 50%',
      color: '#1ABC9C'
    },
    {
      icon: Trophy,
      title: '최종 합격',
      key: '종합 평가',
      tip: '열정 + 성장 가능성',
      success: '최종 30%',
      color: '#F39C12'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.h2 initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        className="text-4xl font-bold text-white mb-12 text-center">
        취업 프로세스 4단계
      </motion.h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stage, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.15 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <div className="bg-orange-500/20 rounded-xl p-3 mb-4 w-fit">
              <stage.icon className="w-10 h-10" style={{ color: stage.color }} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{stage.title}</h3>
            <div className="space-y-3">
              <div className="bg-black/30 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">핵심</p>
                <p className="text-white text-sm font-semibold">{stage.key}</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">팁</p>
                <p className="text-blue-300 text-sm">{stage.tip}</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3">
                <p className="text-green-400 text-sm font-bold">{stage.success}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TechnicalInterviewDeepDive() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-12 border-2 border-indigo-500/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-indigo-500/30 rounded-2xl p-4">
            <Code className="w-12 h-12 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Deep Dive 1</h2>
            <p className="text-2xl text-indigo-300">기술 면접 준비 전략</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-black/40 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">예상 질문 TOP 10</h3>

            <div className="space-y-6">
              {[
                {
                  q: '1. Gemini API를 선택한 이유는?',
                  a: '멀티모달 지원(텍스트+이미지), 무료 티어, 최신 AI 모델'
                },
                {
                  q: '2. Vision API로 이미지 검사 시 정확도는?',
                  a: '테스트 결과 99.5%, 육안 검사(85%) 대비 14% 향상'
                },
                {
                  q: '3. Prophet을 사용한 이유는?',
                  a: '시계열 예측에 특화, 자동 계절성 감지, Facebook 제공'
                },
                {
                  q: '4. 실시간 알림은 어떻게 구현했나?',
                  a: 'SMTP(이메일), Slack API, Twilio(SMS) 멀티채널 통합'
                },
                {
                  q: '5. 데이터 보안은 어떻게 처리했나?',
                  a: '.env 파일 사용, GitHub Secrets, API 키 암호화'
                },
                {
                  q: '6. 배치 처리는 어떻게 최적화했나?',
                  a: 'asyncio 비동기 처리, Semaphore로 동시 요청 제한'
                },
                {
                  q: '7. 에러 핸들링은?',
                  a: 'try-except, 로깅, 재시도 로직, 사용자 친화적 에러 메시지'
                },
                {
                  q: '8. 이 프로젝트의 실무 적용 가능성은?',
                  a: '제조 현장에 즉시 적용 가능, 비용 90% 절감 효과'
                },
                {
                  q: '9. 가장 어려웠던 부분은?',
                  a: '시계열 예측 정확도 향상, 프롬프트 엔지니어링 최적화'
                },
                {
                  q: '10. 향후 개선 계획은?',
                  a: '실시간 스트리밍 처리, 커스텀 모델 fine-tuning, 모바일 앱'
                }
              ].map((item, i) => (
                <div key={i} className="bg-black/60 rounded-xl p-6">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    {item.q}
                  </h4>
                  <p className="text-green-300 pl-7 leading-relaxed">
                    💡 <span className="font-semibold">답변:</span> {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-indigo-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                면접 성공 팁
              </h4>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>프로젝트를 직접 실행해서 보여주기 (데모 필수)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>숫자로 성과 증명 (처리속도, 정확도, 비용 절감)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>코드 설명 시 왜(Why)에 집중</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>실패 경험도 솔직하게 공유</span>
                </li>
              </ul>
            </div>

            <div className="bg-red-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                주의사항
              </h4>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>"그냥 튜토리얼 따라했어요" (×)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>너무 기술 용어만 나열 (×)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>실행이 안 되는 코드 (×)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>README 없는 GitHub (×)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function ProjectPresentationDeepDive() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-lg rounded-3xl p-12 border-2 border-green-500/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-green-500/30 rounded-2xl p-4">
            <Target className="w-12 h-12 text-green-300" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Deep Dive 2</h2>
            <p className="text-2xl text-green-300">프로젝트 피칭 3분 전략</p>
          </div>
        </div>

        <div className="bg-black/40 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">3분 피칭 템플릿</h3>

          <div className="space-y-6">
            <div className="bg-black/60 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h4 className="text-xl font-bold text-white">문제 정의 (30초)</h4>
              </div>
              <div className="pl-13 space-y-3">
                <p className="text-gray-300 leading-relaxed">
                  "제조 현장에서 이미지 검사에 하루 8시간이 소요되고, 육안 검사 정확도가 85%에 불과합니다.
                  이는 불량률 5-10% 누락으로 이어지며, 연간 수억 원의 손실을 발생시킵니다."
                </p>
                <div className="bg-red-500/20 rounded-lg p-4">
                  <p className="text-red-300 font-semibold">💡 핵심: 숫자로 문제의 심각성 전달</p>
                </div>
              </div>
            </div>

            <div className="bg-black/60 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h4 className="text-xl font-bold text-white">솔루션 제시 (60초)</h4>
              </div>
              <div className="pl-13 space-y-3">
                <p className="text-gray-300 leading-relaxed">
                  "Gemini Vision API를 활용한 AI 자동 검사 시스템을 개발했습니다.
                  이미지 업로드 시 0.5초 만에 결함을 검출하며, 정확도는 99.5%입니다.
                  Prophet 시계열 분석으로 이상을 15분 전에 예측하고, 멀티채널 알림으로 즉시 대응합니다."
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-lg font-bold">60배</p>
                    <p className="text-gray-400 text-sm">검사 속도 향상</p>
                  </div>
                  <div className="bg-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-400 text-lg font-bold">99.5%</p>
                    <p className="text-gray-400 text-sm">검사 정확도</p>
                  </div>
                  <div className="bg-purple-500/20 rounded-lg p-3">
                    <p className="text-purple-400 text-lg font-bold">90%↓</p>
                    <p className="text-gray-400 text-sm">비용 절감</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/60 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h4 className="text-xl font-bold text-white">데모 시연 (60초)</h4>
              </div>
              <div className="pl-13 space-y-3">
                <p className="text-gray-300 leading-relaxed">
                  "실제 시스템을 보여드리겠습니다. (화면 공유)
                  CSV 파일을 업로드하면 자동으로 그래프가 생성되고, Gemini가 인사이트를 제공합니다.
                  이미지 검사는 실시간으로 결함을 표시하며, 센서 데이터는 미래 값을 예측합니다."
                </p>
                <div className="bg-orange-500/20 rounded-lg p-4">
                  <p className="text-orange-300 font-semibold">💡 핵심: 실제 동작하는 시스템 보여주기</p>
                </div>
              </div>
            </div>

            <div className="bg-black/60 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                  4
                </div>
                <h4 className="text-xl font-bold text-white">차별화 포인트 (30초)</h4>
              </div>
              <div className="pl-13 space-y-3">
                <p className="text-gray-300 leading-relaxed">
                  "기존 솔루션은 단일 기능만 제공하지만, 저희 시스템은 데이터 분석, 이미지 검사, 센서 예측을 하나로 통합했습니다.
                  GitHub에 오픈소스로 공개하여 누구나 사용 가능하며, Streamlit으로 웹 배포까지 완료했습니다."
                </p>
                <div className="bg-blue-500/20 rounded-lg p-4">
                  <p className="text-blue-300 font-semibold">💡 핵심: 경쟁사 대비 우위 강조</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function BehavioralInterviewDeepDive() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-3xl p-12 border-2 border-orange-500/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-orange-500/30 rounded-2xl p-4">
            <Users className="w-12 h-12 text-orange-300" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Deep Dive 3</h2>
            <p className="text-2xl text-orange-300">인성 면접 & STAR 기법</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-black/40 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">STAR 기법으로 답변하기</h3>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                {
                  letter: 'S',
                  title: 'Situation',
                  desc: '상황 설명',
                  example: '"제조 현장에서 불량률이 급증하는 문제가 있었습니다"'
                },
                {
                  letter: 'T',
                  title: 'Task',
                  desc: '주어진 과제',
                  example: '"AI로 실시간 검사 시스템을 만들어 불량률을 낮추는 임무를 맡았습니다"'
                },
                {
                  letter: 'A',
                  title: 'Action',
                  desc: '취한 행동',
                  example: '"Gemini API를 학습하고, 3주간 프로토타입을 개발했습니다"'
                },
                {
                  letter: 'R',
                  title: 'Result',
                  desc: '결과/성과',
                  example: '"불량률을 5%에서 0.5%로 낮추고, 검사 시간을 90% 단축했습니다"'
                }
              ].map((item, i) => (
                <div key={i} className="bg-black/60 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-xl">
                      {item.letter}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm italic pl-15">
                    {item.example}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-orange-500/20 rounded-xl p-6">
              <h4 className="text-white font-bold mb-4">💬 인성 면접 예상 질문 & 모범 답안</h4>
              <div className="space-y-4">
                <div className="bg-black/40 rounded-lg p-4">
                  <p className="text-orange-300 font-semibold mb-2">Q: "팀 프로젝트에서 갈등이 생긴 경험은?"</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    A: (S) 프로젝트 방향성에 대한 의견 차이로 팀원 간 갈등이 있었습니다.
                    (T) 기한 내 완성을 위해 중재자 역할을 맡았습니다.
                    (A) 각자의 의견을 듣고, 데이터로 비교 분석하여 최선의 방안을 제시했습니다.
                    (R) 합의를 이끌어내고, 예정보다 3일 빨리 프로젝트를 완료했습니다.
                  </p>
                </div>

                <div className="bg-black/40 rounded-lg p-4">
                  <p className="text-orange-300 font-semibold mb-2">Q: "실패한 경험과 배운 점은?"</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    A: (S) 처음 Vision API를 사용할 때 정확도가 60%에 불과했습니다.
                    (T) 90% 이상으로 끌어올려야 했습니다.
                    (A) 프롬프트 엔지니어링을 집중 학습하고, 100회 이상 테스트했습니다.
                    (R) 최종적으로 99.5% 정확도를 달성했고, 프롬프트의 중요성을 깨달았습니다.
                  </p>
                </div>

                <div className="bg-black/40 rounded-lg p-4">
                  <p className="text-orange-300 font-semibold mb-2">Q: "우리 회사에 지원한 이유는?"</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    A: 귀사는 반도체 제조 공정 자동화에 선도적이며, AI 기술 도입에 적극적입니다.
                    저는 13~16강에서 제조 현장에 바로 적용 가능한 AI 시스템을 개발했고,
                    이 경험을 귀사의 스마트 팩토리 구축에 기여하고 싶습니다.
                  </p>
                </div>
              </div>
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
    { title: '면접 예상 질문 10개 준비', desc: 'STAR 기법으로 답변 작성' },
    { title: '3분 피칭 스크립트 작성', desc: '문제→솔루션→데모→차별화' },
    { title: '포트폴리오 최종 점검', desc: 'GitHub, README, 실행 확인' },
    { title: '모의 면접 연습', desc: '동료/가족 앞에서 3회 이상' }
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
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-8 border border-orange-500/30 sticky top-24 h-fit">
          <h3 className="text-2xl font-bold text-white mb-6">준비도</h3>
          <p className="text-gray-300 mb-6">{completed.length} / {steps.length} 완료</p>
          <div className="h-4 bg-black/40 rounded-full overflow-hidden mb-6">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(completed.length / steps.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-green-500 to-blue-500" />
          </div>
          {completed.length === steps.length && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-center">
              <Trophy className="w-16 h-16 text-white mx-auto mb-3" />
              <h4 className="text-2xl font-bold text-white">면접 준비 완료! 🎉</h4>
              <p className="text-white/90 mt-2">자신감 있게 면접에 임하세요!</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function VerificationChecklist() {
  const [checks, setChecks] = useState<boolean[]>(Array(8).fill(false));
  const items = [
    '기술 면접 예상 질문 10개 답변 준비',
    '3분 피칭 스크립트 완성',
    'STAR 기법 답변 3개 이상 작성',
    'GitHub 포트폴리오 최종 점검',
    'README.md 완성도 확인',
    '프로젝트 실행 테스트 (3회)',
    '모의 면접 연습 (3회 이상)',
    '자기소개서 & 이력서 완성'
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
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-8 border border-orange-500/30">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>준비도</span><span>{checks.filter(Boolean).length} / {items.length}</span>
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
      <motion.h2 className="text-4xl font-bold text-white mb-12 text-center">취업 성공의 마지막 단계</motion.h2>
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {[
          { icon: Github, title: 'GitHub 포트폴리오', desc: '13~16강 프로젝트 Public 공개', color: '#333' },
          { icon: Linkedin, title: 'LinkedIn 프로필', desc: '프로젝트 링크 & 성과 기재', color: '#0A66C2' },
          { icon: Mail, title: '지원서 제출', desc: '맞춤형 자기소개서 작성', color: '#EA4335' }
        ].map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05 }}
            className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <step.icon className="w-16 h-16 mb-4" style={{ color: step.color }} />
            <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
            <p className="text-gray-300">{step.desc}</p>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl p-8 border border-orange-500/30 text-center">
        <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-3xl font-bold text-white mb-4">축하합니다! 🎉</h3>
        <p className="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
          13~17강 모든 과정을 완료했습니다.<br/>
          이제 자신 있게 면접에 임하고, AI 엔지니어로서 취업 시장에 진출하세요!
        </p>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black/30 backdrop-blur-md border-t border-orange-500/30 py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-gray-400">Letuin AI Lecture - Lecture 17</p>
        <p className="text-gray-500 text-sm mt-2">© 2026 Letuin Education. 취업 성공을 기원합니다!</p>
      </div>
    </footer>
  );
}

export default App;
