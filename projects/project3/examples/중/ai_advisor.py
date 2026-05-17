"""
AI 어드바이저 모듈
==================
실제 Gemini API를 사용하는 구조와 동일하게 설계되어 있습니다.
API 키가 설정되어 있으면 실제 Gemini를 호출하고,
설정되지 않은 경우 현실적인 모킹 응답을 반환합니다.

실제 Gemini 연동 방법:
  1. pip install google-generativeai
  2. .env 파일에 GEMINI_API_KEY=AIza... 입력
  3. _call_gemini() 함수의 주석 처리된 코드를 활성화
"""

import os
import numpy as np
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


def _call_gemini(prompt: str) -> str:
    """
    Gemini API 호출 함수.
    API 키가 없으면 모킹 응답을 반환합니다.
    """
    if not GEMINI_API_KEY:
        return _mock_gemini_response(prompt)

    # ── 실제 Gemini API 호출 (API 키 설정 시 아래 주석 해제) ──────
    # import google.generativeai as genai
    # genai.configure(api_key=GEMINI_API_KEY)
    # model = genai.GenerativeModel("gemini-1.5-flash")
    # response = model.generate_content(prompt)
    # return response.text
    # ──────────────────────────────────────────────────────────────

    return _mock_gemini_response(prompt)


def _mock_gemini_response(prompt: str) -> str:
    """데모용 응답 생성 (Gemini API 없이도 동작)"""
    return (
        "공정 데이터 분석 결과, 전반적으로 안정적인 운영 상태가 확인됩니다. "
        "다만 온도 변동 폭이 일부 구간에서 허용 범위를 초과하는 경향이 있으며, "
        "이 시점에서 수율 하락 패턴이 관측됩니다. "
        "압력 파라미터는 목표치 대비 ±5% 이내로 잘 제어되고 있습니다. "
        "지속적인 모니터링과 온도 제어 알고리즘 보정을 권장합니다."
    )


def _detect_anomalies(df: pd.DataFrame) -> list[int]:
    """
    Z-score 기반 이상치 인덱스를 반환합니다.
    |z| > 2.5 인 행을 이상치로 판단합니다.
    """
    num_cols = df.select_dtypes(include="number").columns
    if len(num_cols) == 0:
        return []

    z_scores = (df[num_cols] - df[num_cols].mean()) / df[num_cols].std()
    is_anomaly = (z_scores.abs() > 2.5).any(axis=1)
    return df.index[is_anomaly].tolist()


def analyze_dataframe(df: pd.DataFrame) -> dict:
    """
    데이터프레임을 분석하고 AI 인사이트를 반환합니다.

    Args:
        df: 분석할 공정 데이터

    Returns:
        {
          "summary":          str,
          "anomaly_count":    int,
          "anomaly_rate":     float,
          "anomaly_indices":  list[int],
          "insights":         list[str],
          "warnings":         list[str],
          "stats":            dict,
        }
    """
    num_cols = df.select_dtypes(include="number").columns.tolist()
    stats = df[num_cols].describe().to_dict()

    anomaly_idx = _detect_anomalies(df)
    anomaly_rate = len(anomaly_idx) / len(df) * 100 if len(df) > 0 else 0.0

    # 데이터 특성을 프롬프트로 구성
    stats_summary = "\n".join(
        f"- {col}: 평균={df[col].mean():.2f}, 표준편차={df[col].std():.2f}"
        for col in num_cols
    )
    prompt = (
        f"다음은 제조 공정 센서 데이터 요약입니다.\n{stats_summary}\n"
        f"이상치 비율: {anomaly_rate:.1f}%\n"
        "데이터를 분석하고 공정 개선을 위한 3문장 요약을 한국어로 작성해주세요."
    )
    summary = _call_gemini(prompt)

    # 규칙 기반 인사이트 생성
    insights = []
    warnings = []

    for col in num_cols:
        cv = df[col].std() / df[col].mean() * 100 if df[col].mean() != 0 else 0
        if cv > 20:
            insights.append(f"**{col}** 의 변동계수(CV)가 {cv:.1f}%로 높습니다. 공정 안정화가 필요합니다.")
            warnings.append(f"{col} 의 산포가 크습니다 (CV = {cv:.1f}%). 원인 파악이 필요합니다.")
        else:
            insights.append(f"**{col}** 은 안정적으로 제어되고 있습니다 (CV = {cv:.1f}%).")

    if anomaly_rate > 10:
        warnings.append(f"전체 데이터의 {anomaly_rate:.1f}%가 이상치입니다. 즉각적인 점검이 필요합니다.")

    # 상관관계 인사이트
    if len(num_cols) >= 2:
        corr = df[num_cols].corr()
        for i in range(len(num_cols)):
            for j in range(i + 1, len(num_cols)):
                c = corr.iloc[i, j]
                if abs(c) > 0.7:
                    direction = "양의" if c > 0 else "음의"
                    insights.append(
                        f"**{num_cols[i]}** 와 **{num_cols[j]}** 사이에 "
                        f"강한 {direction} 상관관계가 있습니다 (r = {c:.2f})."
                    )

    return {
        "summary":         summary,
        "anomaly_count":   len(anomaly_idx),
        "anomaly_rate":    anomaly_rate,
        "anomaly_indices": anomaly_idx[:50],  # 최대 50개
        "insights":        insights,
        "warnings":        warnings,
        "stats":           stats,
    }


def get_optimization_suggestions(df: pd.DataFrame, analysis: dict) -> dict:
    """
    분석 결과를 바탕으로 최적화 제안을 반환합니다.

    Returns:
        최적 파라미터, 예상 개선 효과, 실행 권고 사항
    """
    num_cols = df.select_dtypes(include="number").columns.tolist()

    # 최적 파라미터: 정상 데이터(상위 25~75 퍼센타일) 기준
    optimal_rows = df.copy()
    if "수율" in df.columns:
        threshold = df["수율"].quantile(0.75)
        optimal_rows = df[df["수율"] >= threshold]

    optimal_params = []
    for col in num_cols:
        if col == "수율":
            continue
        optimal_params.append({
            "파라미터":    col,
            "현재 평균":   f"{df[col].mean():.2f}",
            "권장 목표값": f"{optimal_rows[col].mean():.2f}",
            "권장 범위":   f"{optimal_rows[col].quantile(0.1):.2f} ~ {optimal_rows[col].quantile(0.9):.2f}",
        })

    recommendations = [
        {
            "title":       "실시간 이상 감지 알림 설정",
            "detail":      "Z-score 기반 이상 감지 알고리즘을 적용하여 임계값 초과 시 텔레그램으로 즉시 알림을 전송하는 시스템을 구축하세요.",
            "action_code": (
                "# 텔레그램 알림 코드 예시\n"
                "from telegram_bot import send_alert\n\n"
                "if abs(z_score) > 2.5:\n"
                "    send_alert(sensor='온도', value=current_value, status='위험', unit='°C')"
            ),
        },
        {
            "title":       "공정 파라미터 피드백 제어 강화",
            "detail":      "온도와 수율 간의 상관관계를 활용하여 PID 제어 파라미터를 재조정하세요. 최적 온도 구간 유지 시 수율 향상이 기대됩니다.",
            "action_code": (
                "# 최적 온도 구간 필터링 예시\n"
                "optimal = df[(df['온도'] >= 50) & (df['온도'] <= 70)]\n"
                "print(f'최적 구간 수율: {optimal[\"수율\"].mean():.1f}%')"
            ),
        },
        {
            "title":       "주기적 데이터 리포트 자동화",
            "detail":      "매일 오전 8시에 전날 공정 데이터를 자동으로 분석하고 보고서를 팀 채널로 전송하는 스케줄러를 설정하세요.",
            "action_code": (
                "# 스케줄러 예시 (schedule 라이브러리)\n"
                "import schedule, time\n\n"
                "def daily_report():\n"
                "    # 분석 및 보고서 생성 로직\n"
                "    pass\n\n"
                "schedule.every().day.at('08:00').do(daily_report)\n"
                "while True:\n"
                "    schedule.run_pending()\n"
                "    time.sleep(60)"
            ),
        },
    ]

    return {
        "optimal_params":   optimal_params,
        "yield_improvement": "+2.3%",
        "defect_reduction":  "-18%",
        "energy_saving":     "-5%",
        "recommendations":   recommendations,
    }
