import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Battery,
  Bell,
  Brain,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code,
  Copy,
  Eye,
  Gauge,
  LineChart,
  Mail,
  Quote,
  Smartphone,
  Target,
  Thermometer,
  TrendingUp,
  Wrench,
  Zap,
} from 'lucide-react';

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}${filename}`;

// ============================================================================
// DATA ARRAYS - Sensor Forecast & Alert
// ============================================================================

const learningGoals = [
  {
    step: '학습목표 1',
    title: 'Prophet으로 시계열 예측',
    body: '센서 CSV를 Prophet 모델에 학습시키고 60분 뒤까지의 추세를 예측해 임계 초과 시점을 찾아냅니다.',
    type: 'api',
  },
  {
    step: '학습목표 2',
    title: '3가지 이상 감지 로직 결합',
    body: '3-sigma, Isolation Forest, Rolling 추세 3가지 방법을 결합해 오탐을 줄이고 확실한 이상만 잡습니다.',
    type: 'knowledge',
  },
  {
    step: '학습목표 3',
    title: '멀티채널 알림 자동화',
    body: 'Email, Slack, SMS를 심각도에 따라 분기 발송하고 골든타임 안에 담당자에게 도달시킵니다.',
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
  { owner: '엔지니어', task: '임계값 정의, 알림 규칙 설계, 결과 검토' },
  { owner: 'Prophet', task: '추세·계절성 학습, 미래 60분 예측' },
  { owner: 'Detector', task: '3가지 방법으로 이상 탐지·확정' },
  { owner: 'Alert', task: 'Email·Slack·SMS 분기 발송' },
];

const sensorCapabilities = [
  {
    icon: Battery,
    title: '배터리',
    description: '온도·전압·전류·용량을 학습해 충전 사이클별 용량 감소를 예측합니다.',
    features: ['60℃ 초과 즉시 알림', '사이클별 SOH 추정', 'BMS 연동'],
    cost: '15분 사전 예측',
    freeQuota: '24/7 무중단',
  },
  {
    icon: Thermometer,
    title: '반도체',
    description: '공정 챔버의 온도·압력·가스농도·습도를 모니터링합니다.',
    features: ['압력 ±5% 이탈', '챔버 이상 15분 전', '레시피별 임계값'],
    cost: 'Prophet 예측',
    freeQuota: '실시간 1분 주기',
  },
  {
    icon: Gauge,
    title: '디스플레이',
    description: '패널의 전력·휘도·색온도·전류 변화를 분석합니다.',
    features: ['휘도 90% 미달', '추세 기반 수명 예측', '품질 등급 추적'],
    cost: 'JSON 알림',
    freeQuota: '라인별 분리',
  },
  {
    icon: Activity,
    title: '바이오',
    description: '배양 공정의 pH·온도·용존산소·교반속도를 추적합니다.',
    features: ['pH 7.0±0.5 이탈', '배양 곡선 패턴 학습', '오염 조기 경보'],
    cost: '심각도 자동 판정',
    freeQuota: '멀티채널 통보',
  },
];

const fieldScenarios = [
  {
    icon: Battery,
    title: '배터리: 온도 폭주 사전 예측',
    before: '온도 모니터를 사람이 화면으로 주시하다가 폭주가 시작된 뒤에야 인지',
    intent: '최근 24시간 배터리 셀 온도를 Prophet으로 학습해 60℃ 초과 시점을 15분 전 예측하고 담당자에게 알림을 보내줘.',
    output: '15분 사전 경보 + 셀 위치·상승률·예상 도달 시간 JSON',
  },
  {
    icon: Thermometer,
    title: '반도체: 챔버 압력 이탈 감지',
    before: '오퍼레이터가 분당 한 번 화면을 보고 압력 이탈을 수기로 기록',
    intent: '챔버 압력 데이터를 3-sigma·Isolation Forest·Rolling 추세 3가지 방법으로 검사해 2개 이상 일치할 때만 이상으로 확정해줘.',
    output: '확정 이상 카운트 + 시점별 좌표 + 심각도 등급',
  },
  {
    icon: Gauge,
    title: '디스플레이: 휘도 저하 추세 분석',
    before: '주간 점검 때만 휘도를 측정해 저하 추세를 놓침',
    intent: '시간당 휘도 로그에서 추세선을 추출해 90% 기준치 도달 시점을 예측하고 라인 매니저에게 Slack으로 알려줘.',
    output: '휘도 90% 도달 예상일 + Slack 채널 자동 발송',
  },
  {
    icon: Activity,
    title: '바이오: pH 이탈 즉시 통보',
    before: 'pH 미터를 야간 교대 근무자가 1시간마다 수동 확인',
    intent: '발효조 pH가 7.0±0.5 이탈하면 즉시 SMS와 Email로 통보하고 마지막 10분 추세 그래프를 첨부해줘.',
    output: '심각도 HIGH → Email+Slack+SMS 동시 발송',
  },
];

const apiSteps = [
  { step: '1', title: 'pip install prophet', body: 'Prophet과 scikit-learn 준비', duration: '1분' },
  { step: '2', title: 'CSV 로드 & 정리', body: 'timestamp/value를 ds/y로 리네임', duration: '30초' },
  { step: '3', title: 'Prophet 모델 학습', body: 'fit() 후 60분 future 생성', duration: '20초' },
  { step: '4', title: '임계 초과 알림', body: 'send_alert로 멀티채널 발송', duration: '3초' },
];

const intentChecklist = [
  '센서 CSV가 ds/y 컬럼으로 정리되었는가?',
  'Prophet 모델 학습과 60분 예측이 동작하는가?',
  '3-sigma·Isolation Forest·Rolling 3가지 감지가 결합되었는가?',
  '심각도 HIGH/MEDIUM/LOW 별 알림 분기가 정의되었는가?',
  'Email/Slack 토큰이 .env에 안전하게 저장되었는가?',
];

const forecastVerifyPoints = [
  '시간 컬럼이 datetime으로 파싱되었는가?',
  'Prophet 신뢰구간(yhat_lower/upper)이 확보되었는가?',
  '재학습 주기(1분/5분)가 운영에 맞게 설정되었는가?',
];

const anomalyVerifyPoints = [
  '3가지 방법 중 2개 이상 일치할 때만 확정되는가?',
  'Isolation Forest contamination이 데이터에 맞게 튜닝되었는가?',
  'Rolling window 크기가 데이터 주기와 어긋나지 않는가?',
];

const alertVerifyPoints = [
  '심각도별 채널 분기(HIGH/MEDIUM/LOW)가 명확한가?',
  'SMTP·Slack·Twilio 자격증명이 환경변수로 분리되었는가?',
  '실패 시 재시도와 로그가 남는가?',
];

const responseComparison = [
  { model: 'AI 예측 + 자동 알림', price: '3초 대응', context: '15분 사전 예측', free: '24/7 무중단', score: 96 },
  { model: '수동 모니터링', price: '30분+', context: '사후 인지', free: '주간만 가능', score: 55 },
  { model: '단순 임계 알림', price: '즉시', context: '추세 미반영', free: '오탐 다수', score: 70 },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function GoalVisual({ type }: { type: string }) {
  if (type === 'api') {
    return (
      <div className="goal-visual definition">
        <div className="visual-item person">
          <LineChart size={18} />
          <span>Sensor</span>
        </div>
        <ArrowRight size={14} className="visual-arrow" />
        <div className="visual-item ai">
          <TrendingUp size={18} />
          <span>Forecast</span>
        </div>
      </div>
    );
  }
  if (type === 'knowledge') {
    return (
      <div className="goal-visual elements">
        <div className="element-tag">3-sigma</div>
        <div className="element-tag">IsolationForest</div>
        <div className="element-tag">Rolling</div>
      </div>
    );
  }
  if (type === 'deploy') {
    return (
      <div className="goal-visual field">
        <div className="field-icons">
          <div className="f-icon"><Mail size={18} /></div>
          <div className="f-icon"><Bell size={18} /></div>
        </div>
        <div className="success-indicator">
          <CheckCircle2 size={12} />
          <span>3초 자동 알림</span>
        </div>
      </div>
    );
  }
  return null;
}

function ResponseChart() {
  const max = Math.max(...responseComparison.map((item) => item.score));

  return (
    <div className="visual-card">
      <div className="visual-header">
        <span>대응 방식 비교</span>
        <strong>종합 점수</strong>
      </div>
      <div className="bar-chart" role="img" aria-label="대응 방식 비교 차트">
        {responseComparison.map((item) => (
          <div className="bar-row" key={item.model}>
            <span>{item.model}</span>
            <div>
              <i style={{ width: `${(item.score / max) * 100}%` }} />
            </div>
            <strong>{item.score}</strong>
          </div>
        ))}
      </div>
      <p>AI 예측은 15분 전 사전 경보와 3초 자동 알림으로 골든타임을 확보합니다.</p>
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

function TimeSeriesDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 01 Deep Dive</span>
        <h3>시계열 예측: Prophet으로 60분 뒤 센서값까지 미리 보기</h3>
        <p>
          센서 로그를 Prophet 모델에 학습시키면 추세·계절성을 자동으로 분리해 60분 뒤까지의
          예측값과 신뢰구간을 받을 수 있습니다. 임계 초과 시점을 사전에 잡습니다.
        </p>
        <LectureImage
          src="sensor-forecast-alert-overview.png"
          alt="센서 데이터 수집부터 예측, 이상 감지, 알림 발송까지 이어지는 운영 흐름"
          caption="센서 수집 → 시계열 예측 → 이상 감지 → 멀티채널 알림으로 이어지는 전체 파이프라인입니다."
        />
      </div>

      <div className="yield-case-compare vertical-case-flow" aria-label="시계열 예측 Before Prompt After">
        <article className="yield-case-panel manual-panel">
          <span>Before: 수동 모니터링</span>
          <h4>화면 주시와 엑셀 기록으로 추세를 따라가던 방식</h4>
          <ul>
            <li>엔지니어가 모니터 앞에서 센서 그래프를 직접 주시</li>
            <li>이상이 시작된 뒤에야 엑셀에 수기 기록</li>
            <li>야간·휴일에는 사실상 감시 공백</li>
            <li>미세한 추세 변화는 사람이 잡아내기 어려움</li>
          </ul>
          <div className="mini-excel dense-excel">
            <strong>수동 모니터링 흐름</strong>
            <div style={{ padding: '1rem', background: '#f5f5f7', borderRadius: '8px', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                1. 모니터에서 센서 값 확인<br/>
                2. 이상치 발견 시 엑셀에 입력<br/>
                3. 전화로 담당자에게 통보<br/>
                4. 30분+ 지난 뒤에야 조치<br/>
                5. 야간/휴일에는 사후 보고
              </p>
            </div>
          </div>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: Prophet 예측 지시</span>
          <h4>Prophet으로 60분 미래값과 임계 초과 시점을 추출합니다</h4>
          <p>
            "battery_temp.csv를 timestamp/temperature 컬럼으로 읽어서 ds/y로 리네임하고,
            changepoint_prior_scale=0.05로 Prophet 학습 후 60분 후까지 분 단위로 예측해줘.
            예측값(yhat)이 60℃를 초과하는 첫 시점을 찾아 15분 사전 알림 시각도 함께 알려줘."
          </p>
          <div className="aoi-rule-grid sensor-rule-grid">
            <div><strong>모델</strong><span>Prophet (additive trend)</span></div>
            <div><strong>주기</strong><span>1분 freq, 60 periods</span></div>
            <div><strong>임계</strong><span>60℃ 초과 사전 경보</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 산출물</span>
          <h4>예측 추세선과 임계 초과 시점이 코드로 자동 산출됩니다</h4>
          <div className="code-preview-box">
            <div className="visual-header">
              <span>Python Script</span>
              <strong>forecast_battery.py</strong>
            </div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.82rem', overflow: 'auto' }}>{`import pandas as pd
from prophet import Prophet

# 1. 데이터 로드 & 컬럼 매핑
df = pd.read_csv('battery_temp.csv')
df = df.rename(columns={'timestamp': 'ds', 'temperature': 'y'})

# 2. Prophet 모델 학습
model = Prophet(
    changepoint_prior_scale=0.05,
    seasonality_mode='multiplicative'
)
model.fit(df)

# 3. 미래 60분 예측
future = model.make_future_dataframe(periods=60, freq='T')
forecast = model.predict(future)

# 4. 임계 초과 시점 탐색 (60℃)
threshold = 60
alerts = forecast[forecast['yhat'] > threshold]

if len(alerts) > 0:
    first_hit = alerts.iloc[0]['ds']
    early_warning = first_hit - pd.Timedelta(minutes=15)
    print(f"WARN: {first_hit} 초과 예상, 사전 경보: {early_warning}")
    send_alert(early_warning)`}</pre>
          </div>
          <div className="aoi-impact-strip sensor-impact-strip">
            <div><strong>15분 전</strong><span>임계 초과 사전 예측</span></div>
            <div><strong>95%+</strong><span>15분 후 예측 정확도</span></div>
            <div><strong>1분 주기</strong><span>재학습으로 추세 반영</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 Prophet이 미래값을 단정짓는 것이 아니라, 신뢰구간을 가진 예측을 통해 엔지니어가
        조치할 수 있는 골든타임을 만들어주는 것입니다.
      </p>
      <VerifyChecklist points={forecastVerifyPoints} />
    </div>
  );
}

function AnomalyDetectionDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 02 Deep Dive</span>
        <h3>이상 감지: 3가지 방법을 결합해 오탐을 줄이는 다층 디텍터</h3>
        <p>
          단일 알고리즘은 오탐과 누락을 동시에 줄이기 어렵습니다. 3-sigma·Isolation Forest·
          Rolling 추세 3가지를 결합하고 2개 이상 일치할 때만 이상으로 확정합니다.
        </p>
        <LectureImage
          src="lecture-15-sensor-alert.png"
          alt="3가지 이상 감지 방법(통계·ML·추세)을 결합해 이상을 확정하는 다층 구조"
          caption="통계 기반, ML 기반, 추세 기반 3가지를 결합하면 오탐과 누락이 동시에 줄어듭니다."
        />
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: 단순 임계 비교</span>
          <h4>"값이 임계값을 넘으면 알림" 한 줄 로직</h4>
          <ul>
            <li>단일 임계값으로만 판단해 추세를 반영하지 못함</li>
            <li>노이즈 한 번에도 알림이 발생해 알림 피로 증가</li>
            <li>완만한 추세 상승은 임계 직전까지 감지 못함</li>
            <li>오탐 다수 → 결국 사람이 알림을 무시</li>
          </ul>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: 다층 디텍터 지시</span>
          <h4>3-sigma·Isolation Forest·Rolling 3가지 결합 로직</h4>
          <p>
            "MultiLayerAnomalyDetector 클래스를 만들어줘. 3-sigma로 통계적 이상,
            IsolationForest(contamination=0.01)로 ML 이상, Rolling mean 95퍼센타일로 추세
            이상을 각각 계산하고, 3가지 중 2개 이상이 True인 시점만 이상으로 확정해줘."
          </p>
          <div className="aoi-rule-grid">
            <div><strong>3-sigma</strong><span>평균 ± 3σ 범위 이탈</span></div>
            <div><strong>Isolation Forest</strong><span>contamination=0.01</span></div>
            <div><strong>Rolling 추세</strong><span>window=10, p95 임계</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 산출물</span>
          <h4>3가지가 합의한 시점만 알림으로 올라와 오탐이 사라집니다</h4>
          <div className="notebooklm-result-box">
            <div className="visual-header">
              <span>Detector Code</span>
              <strong>multi_detector.py</strong>
            </div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.82rem', overflow: 'auto' }}>{`from sklearn.ensemble import IsolationForest
import numpy as np
import pandas as pd

class MultiLayerAnomalyDetector:
    def __init__(self):
        self.iforest = IsolationForest(contamination=0.01)

    def detect_statistical(self, data):
        mean, std = np.mean(data), np.std(data)
        upper, lower = mean + 3*std, mean - 3*std
        return (data > upper) | (data < lower)

    def detect_ml(self, data):
        preds = self.iforest.fit_predict(data.reshape(-1, 1))
        return preds == -1

    def detect_trend(self, data, window=10):
        roll = pd.Series(data).rolling(window).mean()
        diff = np.abs(data - roll)
        return diff > np.percentile(diff, 95)

    def combined_detect(self, data):
        votes = (
            self.detect_statistical(data).astype(int)
            + self.detect_ml(data).astype(int)
            + self.detect_trend(data).astype(int)
        )
        return votes >= 2

detector = MultiLayerAnomalyDetector()
anomalies = detector.combined_detect(values)
print(f"확정 이상: {np.sum(anomalies)}건")`}</pre>
          </div>
          <div className="aoi-impact-strip">
            <div><strong>오탐 60%↓</strong><span>2개 이상 일치 조건</span></div>
            <div><strong>누락 감소</strong><span>추세 변화도 포착</span></div>
            <div><strong>설명 가능</strong><span>어느 디텍터가 반응했는지 로깅</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 어느 알고리즘이 좋은가가 아니라, 서로 다른 가정의 디텍터를 합쳐 한 가지 오류에
        흔들리지 않는 의사결정 구조를 만드는 것입니다.
      </p>
      <VerifyChecklist points={anomalyVerifyPoints} />
    </div>
  );
}

function AlertSystemDeepDive() {
  return (
    <div className="deep-dive">
      <div className="deep-dive-heading">
        <span>Case 03 Deep Dive</span>
        <h3>멀티채널 알림: 심각도별로 Email·Slack·SMS 분기 발송</h3>
        <p>
          모든 이상을 같은 채널로 보내면 알림 피로가 쌓입니다. HIGH/MEDIUM/LOW 심각도에 따라
          Email, Slack, SMS를 분기해 골든타임을 지키면서도 채널 부담을 분산합니다.
        </p>
        <LectureImage
          src="lecture-15-sensor-alert.png"
          alt="센서 감지에서 심각도 분류, 멀티채널 알림 발송까지의 아키텍처 다이어그램"
          caption="감지·분류·발송을 분리한 알림 아키텍처입니다. 채널 추가는 어댑터만 늘리면 됩니다."
          variant="poster"
        />
      </div>

      <div className="yield-case-compare vertical-case-flow">
        <article className="yield-case-panel manual-panel">
          <span>Before: 수동 전화·문자</span>
          <h4>이상 발생 후 사람이 전화/문자를 돌리는 방식</h4>
          <ul>
            <li>이상 발생 → 담당자에게 직접 전화/문자</li>
            <li>야간엔 연락 누락, 휴일엔 도달까지 30분+</li>
            <li>전달 메시지가 일관되지 않아 재확인 필요</li>
            <li>로그가 없어 사후 분석에 어려움</li>
          </ul>
        </article>

        <article className="yield-case-panel prompt-panel">
          <span>Prompt: 멀티채널 알림 지시</span>
          <h4>심각도에 따라 채널 조합을 자동 분기합니다</h4>
          <p>
            "AlertSystem 클래스를 만들어줘. send_alert(severity, sensor, value, threshold)를
            받으면 HIGH는 Email+Slack+SMS, MEDIUM은 Email+Slack, LOW는 Slack만 보내고,
            SMTP·Slack·Twilio 자격증명은 환경변수에서 읽도록 해줘."
          </p>
          <div className="aoi-rule-grid sensor-rule-grid">
            <div><strong>HIGH</strong><span>Email + Slack + SMS</span></div>
            <div><strong>MEDIUM</strong><span>Email + Slack</span></div>
            <div><strong>LOW</strong><span>Slack 채널 모니터링</span></div>
          </div>
        </article>

        <article className="yield-case-panel result-panel">
          <span>After: AI 산출물</span>
          <h4>심각도별 라우팅이 3초 안에 자동으로 끝납니다</h4>
          <div className="firebase-result-box">
            <div className="visual-header">
              <span>Alert System</span>
              <strong>alert_system.py</strong>
            </div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.82rem', overflow: 'auto' }}>{`import os, smtplib
from slack_sdk import WebClient
from twilio.rest import Client

class AlertSystem:
    def __init__(self):
        self.slack = WebClient(token=os.getenv('SLACK_TOKEN'))
        self.twilio = Client(os.getenv('TWILIO_SID'),
                             os.getenv('TWILIO_TOKEN'))

    def send_email(self, to, subject, body):
        # SMTP send 생략
        ...

    def send_slack(self, channel, message):
        self.slack.chat_postMessage(channel=channel, text=message)

    def send_sms(self, phone, message):
        self.twilio.messages.create(
            to=phone, from_='+1234567890', body=message
        )

    def send_alert(self, severity, sensor, value, threshold):
        msg = (f"센서 이상\\n- 센서: {sensor}\\n"
               f"- 현재값: {value:.2f}\\n- 임계: {threshold:.2f}")

        if severity == 'HIGH':
            self.send_email('engineer@company.com', '긴급', msg)
            self.send_slack('#alerts', msg)
            self.send_sms('+821012345678', f"{sensor} 긴급")
        elif severity == 'MEDIUM':
            self.send_email('engineer@company.com', '주의', msg)
            self.send_slack('#alerts', msg)
        else:
            self.send_slack('#monitoring', msg)`}</pre>
          </div>
          <div className="aoi-impact-strip sensor-impact-strip">
            <div><strong>30분 → 3초</strong><span>감지에서 알림 도달까지</span></div>
            <div><strong>채널 분기</strong><span>알림 피로 분산</span></div>
            <div><strong>로그 보존</strong><span>사후 분석 가능</span></div>
          </div>
        </article>
      </div>

      <p className="case-takeaway">
        핵심은 채널을 많이 쓰는 것이 아니라, 심각도와 채널을 명확히 묶어 담당자가 무시하지
        않을 알림 규칙을 만드는 것입니다.
      </p>
      <VerifyChecklist points={alertVerifyPoints} />
    </div>
  );
}

function InteractiveWorkshop() {
  const [fields, setFields] = useState({
    forecast: '',
    detect: '',
    alert: '',
  });
  const [copied, setCopied] = useState(false);

  const hasContent = Object.values(fields).some(Boolean);

  const generated = hasContent
    ? `1. 예측 설정: ${fields.forecast || '[예: Prophet 60분 예측, 임계 60℃]'}
2. 이상 감지: ${fields.detect || '[예: 3-sigma + IsolationForest + Rolling 결합]'}
3. 알림 채널: ${fields.alert || '[예: HIGH=Email+Slack+SMS, MEDIUM=Email+Slack]'}

다음 단계: 1개 센서 검증 → 4개 센서 확장 → 라인 전체 적용`
    : '';

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const inputRows: { key: keyof typeof fields; label: string; placeholder: string }[] = [
    { key: 'forecast', label: '시계열 예측 설정', placeholder: '예: Prophet 60분 예측, 임계 60℃ 초과' },
    { key: 'detect', label: '이상 감지 조합', placeholder: '예: 3-sigma + IsolationForest + Rolling 2개 이상 일치' },
    { key: 'alert', label: '알림 채널 규칙', placeholder: '예: HIGH=Email+Slack+SMS, MEDIUM=Email+Slack' },
  ];

  return (
    <div className="interactive-workshop">
      <div className="iw-header">
        <Bell size={22} color="var(--accent)" />
        <strong>3단계 예측·감지·알림 파이프라인 체크</strong>
        <p>예측 / 감지 / 알림 3단계를 입력하면 실습 체크리스트가 자동 생성됩니다.</p>
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
        <strong>지금 바로 해보기 — Prophet 첫 예측</strong>
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
        <span>16강 미리보기</span>
        <h3>통합 대시보드: 센서·이미지·알림을 한 화면으로</h3>
        <p>이번 강의에서 만든 예측·감지·알림 파이프라인을 한 화면에 모아 실시간 대시보드로 시각화합니다.</p>
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
            <span className="header-tag">센서 예측과 알림으로 골든타임 확보</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Ch.15 센서 데이터 예측 & 알림 시스템</h1>
          <p className="subtitle">Prophet 시계열 예측, 다층 이상 감지, 멀티채널 알림으로 24/7 자동 모니터링 구축</p>
          <div className="lesson-meta" aria-label="lesson summary">
            <span>40분</span>
            <span>실습 중심</span>
            <span>Prophet + Alert</span>
            <span>결과물: 예측·알림 파이프라인</span>
          </div>
        </motion.div>
      </header>

      <main>
        <section className="overview-section">
          <span className="section-label">01. 오프닝 및 학습목표</span>
          <h2>오늘 여러분은 센서 데이터를 <mark>15분 전에 예측</mark>하고 3초 안에 알림을 보냅니다</h2>
          <p className="section-intro">
            사람이 24시간 화면을 보던 모니터링을, Prophet 예측·다층 이상 감지·멀티채널 알림으로
            연결해 사후 대응을 사전 대응으로 바꿉니다. 골든타임을 자동으로 확보합니다.
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
              src={assetUrl('lecture-15-sensor-alert.png')}
              alt="센서 예측·알림 코믹"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          </div>
        </section>

        <section className="definition-section">
          <span className="section-label">02. 센서 데이터 예측이란?</span>
          <h2>예측은 단순 임계 비교가 아니라 <mark>추세를 학습한 사전 경보</mark>입니다</h2>
          <p className="section-intro">
            센서값 자체가 아니라 시간에 따른 추세·계절성을 학습해 미래 시점을 예측합니다. 예측값이
            임계를 넘는 순간을 미리 잡아내고, 다층 이상 감지와 멀티채널 알림으로 연결합니다.
          </p>
          <div className="one-line-definition inline-definition">
            <span>한 문장 정의</span>
            <strong>센서 예측 & 알림은 시계열 학습·다층 감지·멀티채널 발송을 묶어 사후 대응을 15분 전 사전 대응으로 바꾸는 운영 시스템입니다.</strong>
          </div>
          <LectureImage
            src="lecture-15-sensor-alert.png"
            alt="배터리·반도체·디스플레이·바이오 산업의 센서 데이터 예측 사례 요약"
            caption="산업마다 센서 종류는 다르지만 예측·감지·알림 3단계 구조는 동일합니다."
          />
          <div className="role-flow" aria-label="센서 예측 파이프라인 역할 분리">
            {roleFlow.map((item, index) => (
              <div className="role-step" key={`${item.owner}-${item.task}`}>
                <span>{item.owner}</span>
                <strong>{item.task}</strong>
                {index < roleFlow.length - 1 && <ArrowRight size={22} />}
              </div>
            ))}
          </div>
          <div className="scenario-grid">
            {sensorCapabilities.map((item) => {
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
              <img src={assetUrl('lecture-15-sensor-alert.png')} alt="전통적인 수동 모니터링" />
              <div className="compare-content">
                <span className="compare-kicker">Traditional (Manual Monitoring)</span>
                <h3>사람이 화면을 보고 엑셀로 기록</h3>
                <p>
                  엔지니어가 모니터 앞에서 센서 값을 주시하고, 이상 발생 후에야 엑셀에 기록하며
                  전화로 통보합니다. 야간·휴일에는 사실상 감시 공백이 생깁니다.
                </p>
                <ul>
                  <li>대응 시간 30분+ (사후 인지)</li>
                  <li>피로·휴일에 따라 누락 발생</li>
                  <li>추세 변화 미세 감지가 어려움</li>
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
              <img src={assetUrl('lecture-15-sensor-alert.png')} alt="AI 예측·자동 알림" />
              <div className="compare-content">
                <span className="compare-kicker">AI Forecast (Automated Alert)</span>
                <h3>Prophet 예측 + 다층 감지 + 자동 알림</h3>
                <p>
                  Prophet으로 추세를 학습해 15분 전 사전 경보를 만들고, 3가지 이상 감지로
                  오탐을 줄이며, Email·Slack·SMS로 즉시 알림이 도달합니다.
                </p>
                <ul>
                  <li>15분 전 사전 예측, 3초 자동 알림</li>
                  <li>3가지 디텍터 결합으로 오탐 60%↓</li>
                  <li>심각도별 채널 분기 + 로그 보존</li>
                </ul>
              </div>
            </motion.article>
          </div>
        </section>

        <section>
          <span className="section-label">03. 왜 시계열 예측인가?</span>
          <h2>수동 모니터링과 단순 임계 알림 대비 골든타임이 압도적입니다</h2>
          <p className="section-intro">
            수동은 사후 대응에 30분+, 단순 임계는 추세를 반영 못해 오탐이 많습니다. Prophet 기반
            예측과 다층 감지를 결합하면 15분 사전 경보와 3초 자동 알림이 함께 동작합니다.
          </p>
          <ResponseChart />
          <div className="highlight-box" style={{ background: '#f5f5f7', borderLeftColor: '#333' }}>
            <p style={{ fontWeight: 700 }}>Target Point:</p>
            <p>"시계열 예측의 진짜 가치는 정확도 자체보다도, 신뢰구간을 통해 사람이 조치할 수 있는 15분 골든타임을 만들어 주는 것입니다."</p>
          </div>
        </section>

        <section>
          <span className="section-label">04. 첨단 공정기술 사례</span>
          <h2>배터리·반도체·디스플레이·바이오 엔지니어가 예측·알림을 쓰는 법</h2>
          <p className="section-intro">
            배터리 온도 폭주, 챔버 압력 이탈, 휘도 저하 추세, pH 이탈까지 — 같은 예측·감지·알림
            3단계 구조로 4개 산업의 문제를 동일하게 해결합니다.
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
          <TimeSeriesDeepDive />
          <AnomalyDetectionDeepDive />
          <AlertSystemDeepDive />
        </section>

        <section className="workshop-section teaching-section">
          <span className="section-label">05. 미니 워크숍</span>
          <h2>실습: 내 첫 <mark>센서 예측·알림 파이프라인</mark> 설계하기</h2>
          <p className="section-intro">
            예측·감지·알림 3단계를 정의해 체크리스트로 복사한 뒤, 1개 센서 → 4개 센서 → 라인 전체
            순으로 확장하세요.
          </p>
          <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <img
              src={assetUrl('lecture-15-sensor-alert.png')}
              alt="센서 예측·알림 실습 가이드"
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
            <h3>"센서 예측·알림의 본질은 정확한 점이 아니라, 사람이 조치할 수 있는 골든타임을 만들어내는 것입니다."</h3>
            <p>다음 강의: 통합 대시보드 — 센서·이미지·알림을 한 화면으로 (16강)</p>
          </div>
          <NextLecturePreview />
        </section>

        <section className="professional-point">
          <div className="highlight-box" style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '24px' }}>
            <h3>Advanced Process Engineering Point</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '1rem', fontSize: '1.1rem' }}>
              "센서 예측·알림은 사람의 야간·휴일 감시를 대체하는 것이 아니라, 시계열 추세를 미리
              읽고 멀티채널 알림으로 골든타임을 만들어 엔지니어가 진짜 조치에 집중하도록 만듭니다."<br/>
              임계·심각도·채널 규칙은 엔지니어가 정의하고, 반복 감지와 발송은 시스템이 맡습니다.
            </p>
            <div className="point-strip">
              <span><TrendingUp size={16} /> Prophet은 골든타임 엔진</span>
              <span><Target size={16} /> 다층 감지는 오탐 방지</span>
              <span><Bell size={16} /> 멀티채널은 도달성 보장</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 Sensor Forecast & Alert for Fine Tech Engineering | LettUin Edu</p>
      </footer>
    </div>
  );
}
