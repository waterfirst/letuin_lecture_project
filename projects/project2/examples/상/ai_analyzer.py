"""
ai_analyzer.py — Gemini AI 분석 모듈
프로젝트 2 [상] 모범 답안

실제 Gemini API 연동 + Mock 폴백 구조.
"""

from __future__ import annotations

import os
import random
import textwrap
from typing import Any


# ─────────────────────────────────────────────
# Mock 응답 템플릿
# ─────────────────────────────────────────────

_OVERVIEW_TEMPLATES = [
    """## 공정 현황 AI 분석 보고서

**분석 일시:** {timestamp}
**분석 대상:** {n_samples}개 샘플, {n_anomalies}건 이상 탐지

### 핵심 요약

현재 공정은 **{status}** 상태입니다.
이상 발생률 {anomaly_rate:.1f}%는 {rate_eval} 수준이며, 평균 수율 {avg_yield:.1f}%를 기록하고 있습니다.

### 주요 발견 사항

1. **온도·압력 연동 패턴**: 온도 이탈 시 압력 변동이 1.2~2.3분 내에 동반 발생하는 경향
2. **파레토 주요 원인**: 온도 이탈({top_cause_pct:.0f}%) + 압력 불균일이 전체 불량의 약 40% 차지
3. **시간대별 패턴**: {time_pattern}

### 권장 조치

- 온도 관리 범위를 ±{temp_tol}°C로 강화
- 압력 피드백 루프 응답 시간 단축 (현재 → 목표: 0.5분 이내)
- 다음 PM 주기에 가스 라인 점검 추가
""",

    """## 공정 이상 패턴 심층 분석

**분석 범위:** {n_samples}개 샘플 / 이상 {n_anomalies}건

### 통계적 공정 관리 (SPC) 요약

| 파라미터 | Cpk | 상태 | 비고 |
|---------|-----|------|------|
| 온도 | {cpk_temp:.2f} | {cpk_temp_status} | {cpk_temp_note} |
| 압력 | {cpk_pres:.2f} | {cpk_pres_status} | 모니터링 권장 |
| 유량 | {cpk_flow:.2f} | {cpk_flow_status} | 정상 범위 |
| 두께 | {cpk_thick:.2f} | {cpk_thick_status} | 드리프트 감지 |

### 수율 영향 분석

상위 수율(90% 이상) 구간과 하위 수율(85% 미만) 구간의 파라미터를 비교한 결과,
**온도 편차가 수율에 가장 큰 영향**(r = -{corr_temp:.2f})을 미치는 것으로 확인됩니다.

### 다음 단계 권장사항

1. 온도 제어 파라미터 PID 게인 재조정
2. 압력 센서 캘리브레이션 주기 단축 (분기 → 월 1회)
3. 두께 드리프트 보정을 위한 레시피 업데이트
""",
]

_OPTIMIZATION_TEMPLATES = [
    """## 최적 공정 조건 추천

수율 상위 10% 구간({top_n}개 샘플) 분석 결과:

### 추천 파라미터 설정값

| 파라미터 | 현재 목표 | AI 추천값 | 단위 | 허용 편차 |
|---------|---------|---------|------|---------|
| 온도 | 200.0 | {opt_temp:.1f} | °C | ±3.5 |
| 압력 | 1.500 | {opt_pres:.3f} | atm | ±0.08 |
| 유량 | 50.0 | {opt_flow:.1f} | sccm | ±2.0 |
| 전력 | 500.0 | {opt_power:.0f} | W | ±15 |
| 두께 | 100.0 | {opt_thick:.1f} | nm | ±3.0 |

### 기대 효과

- 예상 수율 개선: +{yield_improvement:.1f}%p
- 불량 감소 예상: -{defect_reduction:.0f}%

### 적용 절차

1. 엔지니어 검토 및 승인
2. 소규모 파일럿 런 (25 LOT) 실시
3. 통계적 유의성 확인 후 양산 적용
""",
]

_ANOMALY_TEMPLATES = [
    """## 이상 감지 세부 분석

**탐지 방법:** IQR ({iqr_factor}x) + Z-score ({z_threshold}σ)
**탐지 건수:** {n_iqr}건 (IQR) / {n_zscore}건 (Z-score) / 통합 {n_combined}건

### 이상 유형 분류

- **일시적 스파이크**: {spike_pct:.0f}% — 외부 충격이나 일시적 설비 오류 추정
- **지속적 드리프트**: {drift_pct:.0f}% — 소모품 열화 또는 레시피 편차 추정
- **주기적 패턴**: {periodic_pct:.0f}% — PM 주기와 연관 가능성

### 심각도 분류

| 심각도 | 건수 | 조치 |
|--------|------|------|
| 위험 (Critical) | {n_critical}건 | 즉시 라인 정지 검토 |
| 경고 (Warning) | {n_warning}건 | 24시간 내 점검 |
| 주의 (Monitor) | {n_monitor}건 | 다음 PM 시 확인 |

### 연관 이상 패턴

온도 이상 발생 후 평균 **{lag_time:.0f}분** 내에 수율 저하가 동반되는 패턴이 확인됩니다.
실시간 모니터링 임계값을 현재보다 20% 낮게 설정하는 것을 권장합니다.
""",
]


def _mock_overview(stats: dict[str, Any]) -> str:
    t = random.choice(_OVERVIEW_TEMPLATES)
    n_anomalies = stats.get("n_anomalies", 35)
    n_samples   = stats.get("n_samples", 500)
    avg_yield   = stats.get("avg_yield", 93.5)
    anomaly_rate = n_anomalies / max(n_samples, 1) * 100
    status = "안정" if anomaly_rate < 5 else "주의" if anomaly_rate < 10 else "위험"
    rate_eval = "양호" if anomaly_rate < 5 else "주의 필요" if anomaly_rate < 10 else "즉각 조치 필요"
    return t.format(
        timestamp=stats.get("timestamp", "2024-06-01 09:00"),
        n_samples=n_samples,
        n_anomalies=n_anomalies,
        status=status,
        anomaly_rate=anomaly_rate,
        avg_yield=avg_yield,
        rate_eval=rate_eval,
        top_cause_pct=random.uniform(20, 30),
        time_pattern="새벽 2~4시 사이 이상 발생률이 낮 시간대 대비 1.8배 높음",
        temp_tol=random.choice([2, 3, 4]),
        cpk_temp=random.uniform(0.9, 1.6),
        cpk_temp_status=random.choice(["양호", "주의", "개선 필요"]),
        cpk_temp_note="최근 드리프트 감지",
        cpk_pres=random.uniform(1.0, 1.5),
        cpk_pres_status="양호",
        cpk_flow=random.uniform(1.2, 1.8),
        cpk_flow_status="우수",
        cpk_thick=random.uniform(0.85, 1.3),
        cpk_thick_status="보통",
        corr_temp=random.uniform(0.45, 0.75),
    )


def _mock_optimization(stats: dict[str, Any]) -> str:
    t = random.choice(_OPTIMIZATION_TEMPLATES)
    top_n = int(stats.get("n_samples", 500) * 0.10)
    return t.format(
        top_n=top_n,
        opt_temp=random.uniform(198.5, 201.5),
        opt_pres=random.uniform(1.46, 1.54),
        opt_flow=random.uniform(48.5, 51.5),
        opt_power=random.uniform(490, 510),
        opt_thick=random.uniform(98.5, 101.5),
        yield_improvement=random.uniform(0.5, 2.5),
        defect_reduction=random.uniform(10, 25),
    )


def _mock_anomaly(stats: dict[str, Any]) -> str:
    t = random.choice(_ANOMALY_TEMPLATES)
    n_combined = stats.get("n_anomalies", 35)
    n_iqr    = int(n_combined * 0.85)
    n_zscore = int(n_combined * 0.70)
    return t.format(
        iqr_factor=stats.get("iqr_factor", 1.5),
        z_threshold=stats.get("z_threshold", 3.0),
        n_iqr=n_iqr,
        n_zscore=n_zscore,
        n_combined=n_combined,
        spike_pct=random.uniform(40, 60),
        drift_pct=random.uniform(25, 40),
        periodic_pct=random.uniform(5, 20),
        n_critical=max(1, int(n_combined * 0.10)),
        n_warning=max(2, int(n_combined * 0.35)),
        n_monitor=max(3, int(n_combined * 0.55)),
        lag_time=random.uniform(3, 12),
    )


# ─────────────────────────────────────────────
# 공개 API
# ─────────────────────────────────────────────

class ProcessAnalyzer:
    """
    Gemini API를 이용한 공정 분석기.
    API 키가 없으면 Mock 응답으로 동작.
    """

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "")
        self._has_real_api = bool(
            self.api_key and self.api_key not in ("", "your_gemini_api_key_here")
        )

    @property
    def mode(self) -> str:
        return "Gemini API" if self._has_real_api else "Mock AI"

    def analyze_overview(self, stats: dict[str, Any]) -> str:
        if self._has_real_api:
            return self._call_gemini(_build_overview_prompt(stats))
        return _mock_overview(stats)

    def analyze_anomalies(self, stats: dict[str, Any]) -> str:
        if self._has_real_api:
            return self._call_gemini(_build_anomaly_prompt(stats))
        return _mock_anomaly(stats)

    def suggest_optimization(self, stats: dict[str, Any]) -> str:
        if self._has_real_api:
            return self._call_gemini(_build_optimization_prompt(stats))
        return _mock_optimization(stats)

    def _call_gemini(self, prompt: str) -> str:
        """
        실제 Gemini API 호출.
        google-generativeai 패키지 필요.
        """
        try:
            import google.generativeai as genai  # type: ignore
            genai.configure(api_key=self.api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)
            return response.text
        except ImportError:
            return _mock_overview({}) + "\n\n*(google-generativeai 패키지를 설치해 주세요)*"
        except Exception as e:
            return f"API 호출 오류: {e}\n\n" + _mock_overview({})


# ─────────────────────────────────────────────
# 프롬프트 빌더
# ─────────────────────────────────────────────

def _build_overview_prompt(stats: dict) -> str:
    return textwrap.dedent(f"""
        당신은 반도체 제조 공정 전문가입니다.
        아래 공정 데이터 통계를 분석하고 한국어로 보고서를 작성해 주세요.

        ## 공정 데이터 통계
        - 총 샘플 수: {stats.get('n_samples', 'N/A')}
        - 이상 발생 건수: {stats.get('n_anomalies', 'N/A')}
        - 평균 수율: {stats.get('avg_yield', 'N/A')}%
        - 분석 기간: {stats.get('timestamp', 'N/A')}

        ## 요청 사항
        1. 현재 공정 상태를 한 문장으로 평가
        2. 주요 이상 원인 상위 3가지
        3. 즉각 조치 필요 사항
        4. 중장기 개선 방향

        Markdown 형식으로 작성해 주세요.
    """).strip()


def _build_anomaly_prompt(stats: dict) -> str:
    return textwrap.dedent(f"""
        당신은 제조 공정 이상 감지 전문가입니다.
        아래 이상 탐지 결과를 분석해 주세요.

        ## 탐지 결과
        - IQR 기반 이상: {stats.get('n_iqr', 'N/A')}건
        - Z-score 기반 이상: {stats.get('n_zscore', 'N/A')}건
        - 종합 이상 건수: {stats.get('n_anomalies', 'N/A')}건
        - IQR 배수: {stats.get('iqr_factor', 1.5)}
        - Z-score 임계값: {stats.get('z_threshold', 3.0)}σ

        ## 요청 사항
        1. 이상 패턴의 유형 분류 (스파이크/드리프트/주기적)
        2. 심각도 분류 (Critical/Warning/Monitor)
        3. 근본 원인 추정
        4. 예방 조치 권고

        Markdown 형식, 표 포함하여 작성해 주세요.
    """).strip()


def _build_optimization_prompt(stats: dict) -> str:
    return textwrap.dedent(f"""
        당신은 공정 최적화 전문가입니다.
        수율 상위 구간 데이터를 기반으로 최적 공정 조건을 추천해 주세요.

        ## 최적 구간 통계
        {stats.get('optimal_params', '파라미터 데이터 없음')}

        ## 요청 사항
        1. 최적 파라미터 설정값 (표 형식)
        2. 기대 수율 개선 효과
        3. 적용 시 주의 사항
        4. 단계적 적용 절차

        Markdown 형식으로 작성해 주세요.
    """).strip()
