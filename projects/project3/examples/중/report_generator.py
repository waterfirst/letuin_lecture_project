"""
보고서 생성 모듈
================
분석 결과를 마크다운 형식의 보고서로 변환합니다.
Streamlit 앱에서 다운로드 버튼과 연동됩니다.
"""

from datetime import datetime
import pandas as pd


def generate_report(df: pd.DataFrame, analysis: dict, suggestions: dict) -> str:
    """
    분석 결과와 최적화 제안을 마크다운 보고서로 생성합니다.

    Args:
        df:          원본 데이터프레임
        analysis:    analyze_dataframe() 반환값
        suggestions: get_optimization_suggestions() 반환값

    Returns:
        마크다운 형식의 보고서 문자열
    """
    now = datetime.now().strftime("%Y년 %m월 %d일 %H:%M")
    num_cols = df.select_dtypes(include="number").columns.tolist()

    # ── 기초 통계 테이블 ──────────────────────────────────────────
    stats_lines = ["| 파라미터 | 평균 | 표준편차 | 최솟값 | 최댓값 |",
                   "|---------|------|---------|-------|-------|"]
    for col in num_cols:
        stats_lines.append(
            f"| {col} "
            f"| {df[col].mean():.2f} "
            f"| {df[col].std():.2f} "
            f"| {df[col].min():.2f} "
            f"| {df[col].max():.2f} |"
        )
    stats_table = "\n".join(stats_lines)

    # ── 최적 파라미터 테이블 ───────────────────────────────────────
    param_lines = ["| 파라미터 | 현재 평균 | 권장 목표값 | 권장 범위 |",
                   "|---------|---------|----------|--------|"]
    for row in suggestions["optimal_params"]:
        param_lines.append(
            f"| {row['파라미터']} "
            f"| {row['현재 평균']} "
            f"| {row['권장 목표값']} "
            f"| {row['권장 범위']} |"
        )
    param_table = "\n".join(param_lines)

    # ── 인사이트 목록 ─────────────────────────────────────────────
    insights_text = "\n".join(f"- {i}" for i in analysis["insights"])
    warnings_text = "\n".join(f"- ⚠️ {w}" for w in analysis["warnings"]) if analysis["warnings"] else "- 없음"

    # ── 권고 사항 ─────────────────────────────────────────────────
    rec_text = ""
    for i, rec in enumerate(suggestions["recommendations"], start=1):
        rec_text += f"\n### {i}. {rec['title']}\n{rec['detail']}\n\n"
        rec_text += f"```python\n{rec['action_code']}\n```\n"

    # ── 최종 보고서 조립 ──────────────────────────────────────────
    report = f"""# AI 공정 분석 보고서

**생성 일시**: {now}
**분석 대상**: {len(df):,}개 데이터 포인트 / {len(num_cols)}개 파라미터

---

## 1. 분석 요약

{analysis["summary"]}

---

## 2. 이상 감지 결과

| 항목 | 값 |
|-----|---|
| 이상 포인트 수 | {analysis["anomaly_count"]}개 |
| 이상 비율 | {analysis["anomaly_rate"]:.1f}% |
| 데이터 전체 행 수 | {len(df):,}개 |

---

## 3. 기초 통계

{stats_table}

---

## 4. AI 인사이트

{insights_text}

---

## 5. 주요 경고

{warnings_text}

---

## 6. 최적 공정 파라미터

{param_table}

### 예상 개선 효과

| 지표 | 개선 효과 |
|-----|---------|
| 수율 개선 | {suggestions["yield_improvement"]} |
| 불량률 감소 | {suggestions["defect_reduction"]} |
| 에너지 절감 | {suggestions["energy_saving"]} |

---

## 7. 실행 권고 사항

{rec_text}

---

*본 보고서는 AI 공정 어드바이저 시스템에 의해 자동 생성되었습니다.*
*실제 의사결정에 앞서 엔지니어링 팀의 검토를 거치시기 바랍니다.*
"""
    return report
