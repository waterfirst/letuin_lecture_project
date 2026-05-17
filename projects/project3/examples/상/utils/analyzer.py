"""
통계 분석 모듈
==============
Z-score 기반 이상 감지, 공정 능력 지수(Cp/Cpk), 트렌드 분석 등
공정 데이터 분석에 필요한 통계 함수를 모아 놓았습니다.
"""

import numpy as np
import pandas as pd
from scipy import stats as scipy_stats


# ── 이상 감지 ─────────────────────────────────────────────────────

def detect_anomalies_zscore(series: pd.Series, threshold: float = 2.5) -> pd.Series:
    """
    Z-score 기반 이상치 마스크를 반환합니다.

    Args:
        series:    분석할 시계열
        threshold: Z-score 임계값 (기본 2.5)

    Returns:
        이상치인 경우 True인 Boolean Series
    """
    z = (series - series.mean()) / series.std()
    return z.abs() > threshold


def detect_anomalies_iqr(series: pd.Series, factor: float = 1.5) -> pd.Series:
    """
    IQR 기반 이상치 마스크를 반환합니다.

    Args:
        series: 분석할 시계열
        factor: IQR 배수 (기본 1.5, 3.0이면 극단적 이상치)

    Returns:
        이상치인 경우 True인 Boolean Series
    """
    q1 = series.quantile(0.25)
    q3 = series.quantile(0.75)
    iqr = q3 - q1
    return (series < q1 - factor * iqr) | (series > q3 + factor * iqr)


def get_anomaly_summary(df: pd.DataFrame, columns: list[str], method: str = "zscore") -> pd.DataFrame:
    """
    각 컬럼의 이상치 개수와 비율을 요약합니다.

    Args:
        df:      분석할 데이터프레임
        columns: 검사할 컬럼 목록
        method:  "zscore" 또는 "iqr"

    Returns:
        컬럼별 이상치 통계 데이터프레임
    """
    results = []
    for col in columns:
        if col not in df.columns:
            continue
        mask = (
            detect_anomalies_zscore(df[col]) if method == "zscore"
            else detect_anomalies_iqr(df[col])
        )
        results.append({
            "센서":      col,
            "이상치 수": mask.sum(),
            "이상치 비율(%)": round(mask.mean() * 100, 2),
            "이상치 최솟값": df.loc[mask, col].min() if mask.any() else None,
            "이상치 최댓값": df.loc[mask, col].max() if mask.any() else None,
        })
    return pd.DataFrame(results)


# ── 공정 능력 지수 ────────────────────────────────────────────────

def calculate_cp(series: pd.Series, usl: float, lsl: float) -> float:
    """
    공정 능력 지수 Cp를 계산합니다.
    Cp = (USL - LSL) / (6 * sigma)
    Cp >= 1.33이면 양호한 공정입니다.
    """
    sigma = series.std()
    if sigma == 0:
        return float("inf")
    return (usl - lsl) / (6 * sigma)


def calculate_cpk(series: pd.Series, usl: float, lsl: float) -> float:
    """
    공정 능력 지수 Cpk를 계산합니다.
    Cpk = min((USL - mu) / (3*sigma), (mu - LSL) / (3*sigma))
    Cpk >= 1.33이면 양호한 공정입니다.
    """
    mu = series.mean()
    sigma = series.std()
    if sigma == 0:
        return float("inf")
    return min((usl - mu) / (3 * sigma), (mu - lsl) / (3 * sigma))


def process_capability_report(df: pd.DataFrame, specs: dict) -> pd.DataFrame:
    """
    여러 센서의 공정 능력 지수를 한 번에 계산합니다.

    Args:
        df:    분석할 데이터프레임
        specs: {"온도": {"lsl": 55, "usl": 75}, ...}

    Returns:
        센서별 Cp, Cpk 및 판정 결과 데이터프레임
    """
    rows = []
    for sensor, limits in specs.items():
        if sensor not in df.columns:
            continue
        series = df[sensor].dropna()
        cp  = calculate_cp(series, limits["usl"], limits["lsl"])
        cpk = calculate_cpk(series, limits["usl"], limits["lsl"])
        judgment = "우수" if cpk >= 1.67 else ("양호" if cpk >= 1.33 else ("주의" if cpk >= 1.0 else "불량"))
        rows.append({
            "센서":  sensor,
            "LSL":   limits["lsl"],
            "USL":   limits["usl"],
            "평균":  round(series.mean(), 3),
            "표준편차": round(series.std(), 3),
            "Cp":    round(cp, 3),
            "Cpk":   round(cpk, 3),
            "판정":  judgment,
        })
    return pd.DataFrame(rows)


# ── 트렌드 분석 ──────────────────────────────────────────────────

def linear_trend(series: pd.Series) -> dict:
    """
    선형 트렌드(기울기, 절편, R²)를 반환합니다.

    Returns:
        {"slope": float, "intercept": float, "r_squared": float, "trend": str}
    """
    x = np.arange(len(series))
    slope, intercept, r, _, _ = scipy_stats.linregress(x, series.values)
    trend = "상승" if slope > 0.001 else ("하강" if slope < -0.001 else "안정")
    return {
        "slope":     round(slope, 6),
        "intercept": round(intercept, 4),
        "r_squared": round(r ** 2, 4),
        "trend":     trend,
    }


def rolling_stats(series: pd.Series, window: int = 10) -> pd.DataFrame:
    """
    이동 평균, 이동 표준편차, 이동 z-score를 계산합니다.

    Returns:
        rolling_mean, rolling_std, rolling_z 컬럼을 포함한 데이터프레임
    """
    rm = series.rolling(window=window, min_periods=1).mean()
    rs = series.rolling(window=window, min_periods=1).std()
    rz = (series - rm) / rs.replace(0, np.nan)
    return pd.DataFrame({
        "값":          series,
        "이동평균":    rm.round(3),
        "이동표준편차": rs.round(3),
        "이동Z점수":   rz.round(3),
    })


# ── 상관관계 분석 ─────────────────────────────────────────────────

def find_strong_correlations(df: pd.DataFrame, threshold: float = 0.6) -> pd.DataFrame:
    """
    강한 상관관계(|r| >= threshold)를 가진 컬럼 쌍을 반환합니다.

    Returns:
        변수1, 변수2, 상관계수, 관계 컬럼을 포함한 데이터프레임
    """
    num_cols = df.select_dtypes(include="number").columns
    corr = df[num_cols].corr()
    rows = []
    for i in range(len(num_cols)):
        for j in range(i + 1, len(num_cols)):
            c = corr.iloc[i, j]
            if abs(c) >= threshold:
                rows.append({
                    "변수1":   num_cols[i],
                    "변수2":   num_cols[j],
                    "상관계수": round(c, 4),
                    "관계":    "강한 양의 상관" if c > 0 else "강한 음의 상관",
                })
    return pd.DataFrame(rows).sort_values("상관계수", key=abs, ascending=False)
