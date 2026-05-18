import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Battery,
  Brain,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Code,
  Copy,
  Dna,
  Eye,
  Image as ImageIcon,
  Layers,
  Quote,
  Rocket,
  Target,
  Wrench,
  Zap,
} from 'lucide-react';

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}${filename}`;

// ============================================================================
// DATA ARRAYS - Gemini Vision API
// ============================================================================

const learningGoals = [
  {
    step: '학습목표 1',
    title: 'Gemini Vision API 첫 호출',
    body: 'PIL로 이미지를 전처리하고 Gemini Vision API에 이미지+프롬프트를 함께 전달해 첫 분석 결과를 받습니다.',
    type: 'api',
  },
  {
    step: '학습목표 2',
    title: '결함 유형별 프롬프트 설계',
    body: '스크래치, 파티클, 크랙, 변색 등 결함 유형에 맞춘 JSON 출력 프롬프트를 작성합니다.',
    type: 'knowledge',
  },
  {
    step: '학습목표 3',
    title: '대량 이미지 배치 자동화',
    body: 'asyncio로 폴더 내 1000장을 병렬 분석하고 CSV/DB에 결과를 자동 저장합니다.',
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
  { owner: '엔지니어', task: '검사 기준 정의, 프롬프트 작성, 결과 검토' },
  { owner: 'PIL', task: '이미지 리사이즈, 밝기/선명도 보정' },
  { owner: 'Gemini Vision', task: '객체 인식, 결함 분류, 자연어 판정' },
  { owner: '저장소', task: 'CSV/DB 적재, 불량 알림' },
];

const visionCapabilities = [
  {
    icon: Eye,
    title: '객체 인식',
    description: '이미지 속 객체와 위치, 크기를 자동으로 파악합니다.',
    features: ['스크래치 위치', '부품 배치', '라벨 텍스트'],
    cost: '0.3~0.6초',
    freeQuota: '15 req/min',
  },
  {
    icon: Target,
    title: '결함 분류',
    description: '불량 유형을 분류하고 심각도를 평가합니다.',
    features: ['표면 결함', '색상 이상', '형상 불량'],
    cost: 'JSON 출력',
    freeQuota: '구조화 응답',
  },
  {
    icon: Brain,
    title: '맥락 이해',
    description: '이미지의 의미를 이해하고 자연어로 설명합니다.',
    features: ['품질 판정', '원인 추론', '개선 제안'],
    cost: '전문가 수준',
    freeQuota: '20년 경력 페르소나',
  },
  {
    icon: Layers,
    title: '멀티모달',
    description: '이미지+텍스트 프롬프트로 정밀 제어합니다.',
    features: ['조건부 검사', '맞춤 기준', '상황별 대응'],
    cost: 'gemini-2.0-flash',
    freeQuota: '실시간 처리',
  },
];

const fieldScenarios = [
  {
    icon: Activity,
    title: '반도체: 웨이퍼 표면 검사',
    before: '검사자가 현미경으로 웨이퍼 1장씩 확인하며 엑셀에 수기 기록',
    intent: '이 웨이퍼 이미지에서 스크래치/파티클/크랙을 찾아 위치와 크기, 심각도, 합/불합 판정을 JSON으로 반환해줘.',
    output: 'Gemini Vision이 0.3초 안에 결함 좌표·심각도·판정 사유 JSON 생성',
  },
  {
    icon: BarChart3,
    title: '디스플레이: 패널 픽셀 검사',
    before: '데드 픽셀과 휘점, 색상 불균일을 수동 점등 시험으로 분류',
    intent: '이 패널 이미지에서 데드 픽셀과 휘점의 좌표를 찾고 색상 불균일이 20%를 넘는지 알려줘.',
    output: '결함 좌표 리스트 + 면적 비율 + 등급 판정 자동 산출',
  },
  {
    icon: Battery,
    title: '배터리: 셀 표면·용접부 검사',
    before: '셀 표면 흠집과 용접부 덴트를 야간 교대로 육안 확인',
    intent: '셀 표면 흠집, 용접 불량, 덴트를 찾아 심각도와 권장 조치를 JSON으로 정리해줘.',
    output: '불량 유형별 카운트 + 위험도 등급 + 재작업 권고',
  },
  {
    icon: Dna,
    title: '바이오: 세포 이미지 분석',
    before: '병리학자가 슬라이드를 한 장씩 살펴 이상 세포를 표시',
    intent: '세포 형태와 염색 패턴을 분석해 이상 세포 후보의 위치와 신뢰도를 알려줘.',
    output: '이상 세포 좌표·신뢰도 점수 + 자연어 소견 요약',
  },
];

const apiSteps = [
  { step: '1', title: 'PIL로 이미지 전처리', body: '리사이즈·밝기·선명도 조정', duration: '30초' },
  { step: '2', title: 'API Key 환경변수 설정', body: 'GEMINI_API_KEY 등록', duration: '20초' },
  { step: '3', title: 'Vision 모델 초기화', body: 'gemini-2.0-flash-exp 로드', duration: '10초' },
  { step: '4', title: '이미지+프롬프트 호출', body: 'generate_content 실행', duration: '0.5초' },
];

const intentChecklist = [
  'Gemini Vision API 키가 .env에 안전하게 저장되었는가?',
  'PIL 전처리(리사이즈·밝기·선명도)가 적용되었는가?',
  '결함 유형별 JSON 출력 프롬프트가 작성되었는가?',
  '배치 처리(asyncio)에 동시 요청 제한이 걸렸는가?',
  '결과 CSV/DB 저장 및 불량 알림이 동작하는가?',
];

const basicVerifyPoints = [
  '이미지 크기가 1024px 이하로 리사이즈 되었는가?',
  '프롬프트에 JSON 출력 형식이 명시되었는가?',
  '응답이 0.5초 이내에 도착했는가?',
];

const defectVerifyPoints = [
  '결함 유형별로 검사 기준이 수치로 정의되었는가?',
  '불확실한 경우의 행동이 프롬프트에 정의되었는가?',
  '크랙은 크기 무관하게 즉시 불합격 처리되는가?',
];

const batchVerifyPoints = [
  '폴더 내 .jpg/.png가 모두 수집되었는가?',
  'Semaphore로 동시 요청 수가 제한되었는가?',
  '결과 CSV가 UTF-8(BOM)으로 저장되어 한글이 깨지지 않는가?',
];

const accuracyComparison = [
  { model: 'Gemini Vision', price: '$0.0003/img', context: '이미지+텍스트', free: '15 req/min', score: 96 },
  { model: '육안 검사', price: '인건비 高', context: '검사자 의존', free: '하루 1000장', score: 70 },
  { model: '기존 룰베이스', price: '튜닝 비용', context: '고정 패턴', free: '환경 변화 취약', score: 75 },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function GoalVisual({ type }: { type: string }) {
  if (type === 'api') {
    return (
      <div className="goal-visual definition">
        <div className="visual-item person">
          <ImageIcon size={18} />
          <span>Image</span>
        </div>
        <ArrowRight size={14} className="visual-arrow" />
        <div className="visual-item ai">
          <Brain size={18} />
          <span>Vision</span>
        </div>
      </div>
    );
  }
  if (type === 'knowledge') {
    return (
      <div className="goal-visual elements">
        <div className="element-tag">스크래치</div>
        <div className="element-tag">파티클</div>
        <div className="element-tag">크랙</div>
      </div>
    );
  }
  if (type === 'deploy') {
    return (
      <div className="goal-visual field">
        <div className="field-icons">
          <div className="f-icon"><Layers size={18} /></div>
          <div className="f-icon"><Rocket size={18} /></div>
        </div>
        <div className="success-indicator">
          <CheckCircle2 size={12} />
          <span>1000장 자동 검사</span>
        </div>
      </div>
    );
  }
  return null;
}

function AccuracyChart() {
  const max = Math.max(...accuracyComparison.map((item) => item.score));

  return (
    <div className="visual-card">
      <div className="visual-header">
        <span>검사 방식 비교</span>
        <strong>종합 점수</strong>
      </div>
      <div className="bar-chart" role="img" aria-label="검사 방식 비교 차트">
        {accuracyComparison.map((item) => (
          <div className="bar-row" key={item.model}>
            <span>{item.model}</span>
            <div>
              <i style={{ width: `${(item.score / max) * 100}%` }} />
            </div>
            <strong>{item.score}</strong>
          </div>
        ))}
      </div>
      <p>Gemini Vision은 일관된 정확도와 0.5초 처리속도로 24/7 무중단 검사에 적합합니다.</p>
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

function BasicVisionDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 01 Deep Dive</span>
        <h3>이미지 전처리 & Vision API 기본 호출</h3>
        <p>
          PIL로 이미지를 1024px 이하로 리사이즈하고 밝기·선명도를 보정한 뒤, Gemini Vision에
          텍스트 프롬프트와 함께 전달하면 0.5초 안에 JSON 판정이 돌아옵니다.
        </p>
        <LectureImage
          src="vision-inspection-overview.png"
          alt="Gemini Vision API로 이미지 전처리, 결함 분류, 리포트까지 자동화하는 흐름"
          caption="이미지 캡처 → 전처리 → Vision API 분석 → 결함 리포트로 이어지는 실습 흐름입니다."
        />
      </div>

      <div className="yield-case-compare vertical-case-flow" aria-label="Vision API Before Prompt After">
        <article className="yield-case-panel manual-panel">
          <span>Before: 수동 육안 검사</span>
          <h4>현미경으로 한 장씩 확인하고 엑셀에 수기로 기록</h4>
          <ul>
            <li>검사자가 현미경으로 웨이퍼/패널/셀을 한 장씩 확인</li>
            <li>육안 판단에 의존 → 검사자별 기준이 달라짐</li>
            <li>불량 내역을 엑셀에 수기로 입력</li>
            <li>하루 1000장이 사실상 한계 (30초/장)</li>
          </ul>
          <div className="mini-excel dense-excel">
            <strong>수동 검사 흐름</strong>
            <div style={{ padding: '1rem', background: '#f5f5f7', borderRadius: '8px', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                1. 검사대 위에 샘플 배치<br/>
                2. 현미경 초점 맞춤<br/>
                3. 결함 유형 육안 판정<br/>
                4. 엑셀에 결함 좌표 수기 입력<br/>
                5. 다음 샘플로 반복
              </p>
            </div>
          </div>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: Vision API 지시</span>
          <h4>PIL 전처리 후 이미지+프롬프트로 Vision API를 호출합니다</h4>
          <p>
            "PIL로 이미지를 1024px 이하로 리사이즈하고 밝기를 1.2배, 선명도를 1.5배 올려줘.
            그 다음 gemini-2.0-flash-exp 모델에 '표면 결함, 위치, 크기, 심각도, 합/불합 판정'을
            JSON으로 반환하라는 프롬프트와 함께 이미지를 전달해줘."
          </p>
          <div className="aoi-rule-grid sensor-rule-grid">
            <div><strong>리사이즈</strong><span>최대 1024px</span></div>
            <div><strong>모델</strong><span>gemini-2.0-flash-exp</span></div>
            <div><strong>출력</strong><span>JSON 구조화</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 산출물</span>
          <h4>0.5초 안에 결함 좌표·심각도·판정 사유가 JSON으로 도착합니다</h4>
          <div className="code-preview-box">
            <div className="visual-header">
              <span>Python Script</span>
              <strong>vision_basic.py</strong>
            </div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.82rem', overflow: 'auto' }}>{`import google.generativeai as genai
from PIL import Image, ImageEnhance
import os

genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-2.0-flash-exp')

def preprocess(path):
    img = Image.open(path)
    img.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
    img = ImageEnhance.Brightness(img).enhance(1.2)
    img = ImageEnhance.Sharpness(img).enhance(1.5)
    return img

prompt = """
이 웨이퍼 이미지를 검사하고 JSON으로 답해줘:
- defect_detected (bool)
- defect_type (스크래치/파티클/크랙)
- severity (낮음/중간/높음)
- judgment (합격/불합격)
"""

img = preprocess('wafer_001.jpg')
response = model.generate_content([prompt, img])
print(response.text)`}</pre>
          </div>
          <div className="aoi-impact-strip sensor-impact-strip">
            <div><strong>30초 → 0.5초</strong><span>장당 분석 시간</span></div>
            <div><strong>JSON 출력</strong><span>구조화된 판정</span></div>
            <div><strong>99.5%</strong><span>일관된 정확도</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 Vision API가 검사 결과를 확정하는 것이 아니라, 검사자가 검토할 수 있는
        구조화된 JSON 후보를 0.5초 안에 만들어 주는 것입니다.
      </p>
      <VerifyChecklist points={basicVerifyPoints} />
    </div>
  );
}

function DefectPromptDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 02 Deep Dive</span>
        <h3>결함 유형별 프롬프트 설계: 스크래치·파티클·크랙·변색</h3>
        <p>
          단일 프롬프트로는 모든 결함을 정확히 잡기 어렵습니다. 유형별 검사 기준을 수치로
          명시하고 JSON 스키마를 분리하면 오탐과 누락이 모두 줄어듭니다.
        </p>
        <LectureImage
          src="lecture-14-vision-inspection.png"
          alt="결함 유형별로 분리된 프롬프트 템플릿 예시"
          caption="유형별로 프롬프트를 분리하면 기준이 명확해지고 JSON 스키마도 단순해집니다."
        />
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: 단일 프롬프트</span>
          <h4>"결함이 있나요?" 같은 모호한 질문</h4>
          <ul>
            <li>결함 유형을 정의하지 않고 단순 질문</li>
            <li>응답 형식이 매번 달라져 파싱 실패</li>
            <li>미세 결함은 무시되거나 과도하게 검출</li>
            <li>JSON 키가 일관적이지 않아 DB 적재 어려움</li>
          </ul>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: 유형별 프롬프트</span>
          <h4>유형마다 기준·임계값·JSON 스키마를 따로 정의합니다</h4>
          <p>
            "당신은 20년 경력의 반도체 품질 검사 전문가입니다. 스크래치는 1mm 이상 불합격,
            파티클은 0.5mm 이상 불합격, 크랙은 크기 무관 즉시 불합격, 변색은 면적 20% 이상
            불합격입니다. 각 유형별 JSON 스키마를 따라 출력하세요."
          </p>
          <div className="aoi-rule-grid">
            <div><strong>스크래치</strong><span>1mm 이상 → 불합격</span></div>
            <div><strong>파티클</strong><span>0.5mm 이상 → 불합격</span></div>
            <div><strong>크랙</strong><span>크기 무관 즉시 불합격</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 산출물</span>
          <h4>유형별로 일관된 JSON이 돌아오고 DB 적재가 단순해집니다</h4>
          <div className="notebooklm-result-box">
            <div className="visual-header">
              <span>Defect JSON</span>
              <strong>유형별 출력</strong>
            </div>
            <div style={{ padding: '1rem', background: '#f0f7ff', borderRadius: '8px', border: '1px solid #d1e7ff' }}>
              <pre style={{ fontSize: '0.85rem', lineHeight: '1.7', color: '#1d1d1f', margin: 0 }}>{`{
  "scratch": {"found": true, "count": 2, "max_len_mm": 1.4, "judgment": "불합격"},
  "particle": {"found": false, "count": 0, "judgment": "합격"},
  "crack": {"found": false, "judgment": "합격"},
  "discoloration": {"area_percent": 8.2, "judgment": "합격"}
}`}</pre>
            </div>
          </div>
          <div className="aoi-impact-strip">
            <div><strong>오탐 70%↓</strong><span>유형별 임계값 분리</span></div>
            <div><strong>JSON 일관성</strong><span>DB 적재 자동화</span></div>
            <div><strong>불확실 분기</strong><span>"불확실" 라벨로 분류</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 프롬프트가 "잘 써졌는가"가 아니라 "검사 기준이 수치로 분리되었는가"입니다.
        기준을 분리하면 모델 교체에도 결과 형식이 흔들리지 않습니다.
      </p>
      <VerifyChecklist points={defectVerifyPoints} />
    </div>
  );
}

function BatchDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 03 Deep Dive</span>
        <h3>대량 이미지 배치 자동화: asyncio + CSV/DB 적재</h3>
        <p>
          폴더 안 1000장을 직렬로 호출하면 하루가 걸립니다. asyncio Semaphore로 동시 요청 수를
          제어하면서 병렬 처리하면 8~10분 안에 마칠 수 있습니다.
        </p>
        <LectureImage
          src="lecture-14-vision-inspection.png"
          alt="이미지 캡처 → AI 분석 → DB 저장 → 알림으로 이어지는 자동화 아키텍처"
          caption="생산 라인 카메라부터 알림 발송까지를 하나의 비동기 파이프라인으로 묶습니다."
          variant="poster"
        />
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: 단일 직렬 호출</span>
          <h4>한 장씩 호출하고 결과를 사람이 정리</h4>
          <ul>
            <li>이미지 1장 호출 → 결과 출력 → 다음 이미지 (직렬)</li>
            <li>1000장 처리에 하루가 걸리고 중간 실패 복구 어려움</li>
            <li>결과를 사람이 엑셀로 옮기다 보니 오타·누락 발생</li>
            <li>불량 발생을 알아채는 데 시간이 걸려 대량 불량 위험</li>
          </ul>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: 배치 자동화 지시</span>
          <h4>폴더 전체를 비동기로 병렬 분석하고 CSV에 적재</h4>
          <p>
            "지정 폴더 내 .jpg/.png를 모두 수집해서 asyncio Semaphore로 동시 5건씩 Gemini Vision에
            호출하고, 결과를 timestamp/filename/result 컬럼으로 CSV에 저장해줘. 실패 항목은
            error 컬럼에 사유를 기록해줘."
          </p>
          <div className="aoi-rule-grid sensor-rule-grid">
            <div><strong>병렬</strong><span>asyncio.gather</span></div>
            <div><strong>제어</strong><span>Semaphore(5)</span></div>
            <div><strong>적재</strong><span>UTF-8 BOM CSV</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 산출물</span>
          <h4>1000장이 8~10분 안에 CSV로 정리되고 불량 알림이 발송됩니다</h4>
          <div className="firebase-result-box">
            <div className="visual-header">
              <span>Batch Pipeline</span>
              <strong>실행 로그</strong>
            </div>
            <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <pre style={{ fontSize: '0.85rem', lineHeight: '1.7', color: '#1d1d1f', margin: 0 }}>{`📁 총 1024개 이미지 발견
🔍 처리 중: wafer_0001.jpg
🔍 처리 중: wafer_0002.jpg
...
✅ 분석 완료! 저장: inspection_20260517_142300.csv
⚠️  불량 32건 → Telegram Bot 알림 전송`}</pre>
            </div>
          </div>
          <div className="aoi-impact-strip sensor-impact-strip">
            <div><strong>8시간 → 10분</strong><span>1000장 처리</span></div>
            <div><strong>5건 동시</strong><span>Semaphore 제어</span></div>
            <div><strong>실패 격리</strong><span>error 컬럼 기록</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 "빠르게 호출하는 것"이 아니라, 실패를 격리하고 결과를 사람이 검토 가능한
        포맷으로 자동 적재하는 것입니다. 알림은 마지막 단계에 붙입니다.
      </p>
      <VerifyChecklist points={batchVerifyPoints} />
    </div>
  );
}

function InteractiveWorkshop() {
  const [fields, setFields] = useState({
    preprocess: '',
    prompt: '',
    batch: '',
  });
  const [copied, setCopied] = useState(false);

  const hasContent = Object.values(fields).some(Boolean);

  const generated = hasContent
    ? `1. 이미지 전처리: ${fields.preprocess || '[예: 1024px 리사이즈 + 밝기 1.2배]'}
2. 결함 프롬프트: ${fields.prompt || '[예: 스크래치 1mm 이상 불합격, JSON 출력]'}
3. 배치 구성: ${fields.batch || '[예: asyncio Semaphore=5, CSV 저장]'}

다음 단계: 1장 호출 검증 → 10장 샘플 배치 → 1000장 전체 배치`
    : '';

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const inputRows: { key: keyof typeof fields; label: string; placeholder: string }[] = [
    { key: 'preprocess', label: '이미지 전처리 설정', placeholder: '예: PIL thumbnail 1024px + 밝기 1.2배' },
    { key: 'prompt', label: '결함 프롬프트 핵심', placeholder: '예: 스크래치 1mm 이상 불합격, JSON 스키마 명시' },
    { key: 'batch', label: '배치 처리 구성', placeholder: '예: asyncio Semaphore=5, UTF-8 BOM CSV 적재' },
  ];

  return (
    <div className="interactive-workshop">
      <div className="iw-header">
        <Camera size={22} color="var(--accent)" />
        <strong>3단계 Vision 파이프라인 체크</strong>
        <p>전처리 / 프롬프트 / 배치를 입력하면 실습 체크리스트가 자동 생성됩니다.</p>
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
            <Brain size={18} color="var(--accent)" />
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
        <strong>지금 바로 해보기 — Vision API 첫 분석</strong>
      </div>
      <div className="frg-steps">
        {apiSteps.map((item) => (
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
        <span>15강 미리보기</span>
        <h3>센서 데이터 예측: 시계열 + LLM 하이브리드</h3>
        <p>이번 강에서 만든 검사 결과를 시계열 센서 데이터와 결합해, 불량을 사전 예측하는 모델로 확장합니다.</p>
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
            <span className="header-tag">Gemini Vision으로 품질검사 자동화</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Ch.14 이미지 분석 자동화</h1>
          <p className="subtitle">Gemini Vision API로 웨이퍼·패널·셀 이미지를 0.5초 안에 검사하는 파이프라인 구축</p>
          <div className="lesson-meta" aria-label="lesson summary">
            <span>40분</span>
            <span>실습 중심</span>
            <span>Vision API</span>
            <span>결과물: 배치 검사 스크립트</span>
          </div>
        </motion.div>
      </header>

      <main>
        <section className="overview-section">
          <span className="section-label">01. 오프닝 및 학습목표</span>
          <h2>오늘 여러분은 Gemini Vision API로 이미지 검사를 <mark>0.5초 자동화</mark>합니다</h2>
          <p className="section-intro">
            육안 검사에 30초씩 걸리던 작업을 PIL 전처리, 유형별 프롬프트, asyncio 배치 처리로
            연결해 0.5초/장으로 단축합니다. 1000장이 10분 안에 끝납니다.
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
              src={assetUrl('lecture-14-vision-inspection.png')}
              alt="이미지 검사 자동화 코믹"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          </div>
        </section>

        <section className="definition-section">
          <span className="section-label">02. Gemini Vision API란?</span>
          <h2>Vision은 단순 OCR이 아니라 <mark>이미지를 이해하는 멀티모달 AI</mark>입니다</h2>
          <p className="section-intro">
            객체 인식·결함 분류·맥락 이해·멀티모달 4가지 능력이 하나로 묶여 있습니다. 이미지와
            텍스트 프롬프트를 함께 던지면, 검사 기준에 따른 JSON 판정이 돌아옵니다.
          </p>
          <div className="one-line-definition inline-definition">
            <span>한 문장 정의</span>
            <strong>Gemini Vision API는 이미지와 텍스트 프롬프트를 함께 받아 객체·결함·맥락을 JSON으로 반환하는 멀티모달 추론 엔진입니다.</strong>
          </div>
          <LectureImage
            src="lecture-14-vision-inspection.png"
            alt="Vision API의 객체 인식·결함 분류·맥락 이해·멀티모달 4가지 능력을 정리한 다이어그램"
            caption="객체 인식, 결함 분류, 맥락 이해, 멀티모달 입력이 하나의 호출로 통합되어 있습니다."
          />
          <div className="role-flow" aria-label="Vision 파이프라인 역할 분리">
            {roleFlow.map((item, index) => (
              <div className="role-step" key={`${item.owner}-${item.task}`}>
                <span>{item.owner}</span>
                <strong>{item.task}</strong>
                {index < roleFlow.length - 1 && <ArrowRight size={22} />}
              </div>
            ))}
          </div>
          <div className="scenario-grid">
            {visionCapabilities.map((item) => {
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
                    <span>대표 활용</span>
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
              <img src={assetUrl('lecture-14-vision-inspection.png')} alt="전통적인 수동 육안 검사" />
              <div className="compare-content">
                <span className="compare-kicker">Traditional (Manual Inspection)</span>
                <h3>현미경 앞에서 한 장씩 육안으로 판정</h3>
                <p>
                  검사자가 샘플을 한 장씩 올리고 현미경 초점을 맞춰 결함을 찾습니다.
                  기준이 사람마다 달라 일관성이 떨어지고 하루 1000장이 한계입니다.
                </p>
                <ul>
                  <li>30초/장, 하루 1000장이 한계</li>
                  <li>피로도에 따라 정확도 85~90%로 변동</li>
                  <li>엑셀 수기 입력으로 누락·오타 발생</li>
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
              <img src={assetUrl('lecture-14-vision-inspection.png')} alt="Gemini Vision 자동 검사" />
              <div className="compare-content">
                <span className="compare-kicker">Gemini Vision (Automated)</span>
                <h3>이미지+프롬프트로 JSON 판정을 자동 생성</h3>
                <p>
                  PIL 전처리 후 Vision API에 이미지와 검사 기준을 함께 전달하면, 결함 좌표·심각도·
                  판정 사유가 JSON으로 돌아옵니다.
                </p>
                <ul>
                  <li>0.5초/장, 1000장이 약 10분</li>
                  <li>일관된 99.5%+ 정확도, 24/7 가동</li>
                  <li>CSV/DB 자동 적재 + 불량 알림</li>
                </ul>
              </div>
            </motion.article>
          </div>
        </section>

        <section>
          <span className="section-label">03. 왜 Vision API인가?</span>
          <h2>육안 검사·룰베이스 대비 일관성과 확장성에서 압도적입니다</h2>
          <p className="section-intro">
            육안 검사는 사람 피로에 좌우되고, 룰베이스는 환경 변화에 약합니다. Vision API는
            맥락을 이해해 새로운 결함 유형에도 빠르게 적응합니다.
          </p>
          <AccuracyChart />
          <div className="highlight-box" style={{ background: '#f5f5f7', borderLeftColor: '#333' }}>
            <p style={{ fontWeight: 700 }}>Target Point:</p>
            <p>"Vision API의 진짜 가치는 정확도 그 자체가 아니라, 24/7 일관된 기준으로 검사하면서 새로운 결함 유형도 프롬프트 한 줄로 추가할 수 있다는 점입니다."</p>
          </div>
        </section>

        <section>
          <span className="section-label">04. 첨단 공정기술 사례</span>
          <h2>반도체·디스플레이·배터리·바이오 엔지니어가 Vision을 쓰는 법</h2>
          <p className="section-intro">
            웨이퍼 스크래치, 패널 데드 픽셀, 셀 용접 불량, 세포 이상까지 — 이미지 한 장에
            프롬프트 한 줄로 JSON 판정을 만들어냅니다.
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
          <BasicVisionDeepDive />
          <DefectPromptDeepDive />
          <BatchDeepDive />
        </section>

        <section className="workshop-section teaching-section">
          <span className="section-label">05. 미니 워크숍</span>
          <h2>실습: 내 첫 <mark>Vision 검사 파이프라인</mark> 설계하기</h2>
          <p className="section-intro">
            전처리·프롬프트·배치 3단계를 정의해 체크리스트로 복사한 뒤, 1장 → 10장 → 1000장
            순으로 확장하세요.
          </p>
          <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <img
              src={assetUrl('lecture-14-vision-inspection.png')}
              alt="Vision 검사 실습 가이드"
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
            <h3>"Vision API의 본질은 '이미지를 이해하는 멀티모달 추론'이며, 검사 기준의 정의는 여전히 엔지니어의 몫입니다."</h3>
            <p>다음 강의: 센서 데이터 예측 — 시계열 + LLM 하이브리드 (15강)</p>
          </div>
          <NextLecturePreview />
        </section>

        <section className="professional-point">
          <div className="highlight-box" style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '24px' }}>
            <h3>Advanced Process Engineering Point</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '1rem', fontSize: '1.1rem' }}>
              "Vision API는 검사자를 대체하는 것이 아니라, 검사 기준을 코드와 프롬프트로 명문화하고
              1000장 단위의 반복 검토를 자동화해 엔지니어가 진짜 의사결정에 집중하도록 만듭니다."<br/>
              결함 정의와 임계값 설정은 엔지니어가, 반복 분류는 AI가 맡습니다.
            </p>
            <div className="point-strip">
              <span><Wrench size={16} /> PIL은 입력 품질 보정</span>
              <span><Code size={16} /> 프롬프트는 검사 기준 명세</span>
              <span><Zap size={16} /> 배치는 24/7 확장 엔진</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 Gemini Vision for Fine Tech Engineering | LettUin Edu</p>
      </footer>
    </div>
  );
}
