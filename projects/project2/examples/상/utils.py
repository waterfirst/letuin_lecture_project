"""
utils.py — 공정 데이터 생성 및 통계 분석 유틸리티
프로젝트 2 [상] 모범 답안
"""

from __future__ import annotations

from datetime import datetime, timedelta

import numpy as np
import pandas as pd
from scipy import stats


# ─────────────────────────────────────────────
# 데이터 생성
# ─────────────────────────────────────────────

DEFECT_CAUSES = [
    "온도 이탈",
    "압력 불균일",
    "유량 변동",
    "진동 이상",
    "전력 불안정",
    "파티클 오염",
    "척 이상",
    "가스 비율",
    "정렬 오차",
    "습도 이탈",
]

PROCESS_PARAMS = {
    "temperature":  {"mean": 200.0, "std": 4.0,  "unit": "°C",    "target": 200.0, "tol": 5.0},
    "pressure":     {"mean": 1.50,  "std": 0.08, "unit": "atm",   "target": 1.50,  "tol": 0.10},
    "flow_rate":    {"mean": 50.0,  "std": 2.0,  "unit": "sccm",  "target": 50.0,  "tol": 3.0},
    "power":        {"mean": 500.0, "std": 15.0, "unit": "W",     "target": 500.0, "tol": 20.0},
    "thickness":    {"mean": 100.0, "std": 2.5,  "unit": "nm",    "target": 100.0, "tol": 4.0},
    "uniformity":   {"mean": 98.5,  "std": 0.8,  "unit": "%",     "target": 99.0,  "tol": 1.5},
}


def generate_process_data(
    n_samples: int = 500,
    n_wafers_per_row: int = 10,
    seed: int = 42,
    anomaly_rate: float = 0.07,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """
    공정 데이터와 웨이퍼 맵 데이터를 동시에 생성.

    Returns:
        df_process: 공정 파라미터 시계열 DataFrame
        df_wafer:   웨이퍼 그리드 DataFrame (히트맵용)
    """
    rng = np.random.default_rng(seed)
    timestamps = [datetime(2024, 6, 1) + timedelta(minutes=i * 2) for i in range(n_samples)]

    df = pd.DataFrame({"timestamp": timestamps})
    anomaly_flags: dict[str, np.ndarray] = {}

    for param, cfg in PROCESS_PARAMS.items():
        base = rng.normal(cfg["mean"], cfg["std"], n_samples)
        # 완만한 드리프트
        drift = np.linspace(0, rng.uniform(-cfg["std"], cfg["std"]), n_samples)
        values = base + drift

        # 이상 구간 삽입
        n_anomaly = int(n_samples * anomaly_rate)
        anomaly_idx = rng.choice(n_samples, size=n_anomaly, replace=False)
        direction = rng.choice([-1, 1], size=n_anomaly)
        values[anomaly_idx] += direction * rng.uniform(2.5, 4.0, n_anomaly) * cfg["std"]

        df[param] = values.round(4)
        anomaly_flags[param] = np.zeros(n_samples, dtype=bool)
        anomaly_flags[param][anomaly_idx] = True

    # 이상 플래그 통합
    df["is_anomaly"] = np.any(list(anomaly_flags.values()), axis=0)

    # 수율 계산 (파라미터 편차에 기반)
    yield_penalty = sum(
        np.abs(df[p] - PROCESS_PARAMS[p]["target"]) / PROCESS_PARAMS[p]["tol"]
        for p in PROCESS_PARAMS
    ) / len(PROCESS_PARAMS)
    df["yield_pct"] = (100 - 3.5 * yield_penalty + rng.normal(0, 0.5, n_samples)).clip(82, 100).round(2)

    # 불량 원인 (랜덤 — 실제로는 분류 모델 사용)
    cause_probs = np.array([0.22, 0.18, 0.12, 0.10, 0.09, 0.08, 0.07, 0.06, 0.05, 0.03])
    df["defect_cause"] = rng.choice(DEFECT_CAUSES, size=n_samples, p=cause_probs)
    df.loc[~df["is_anomaly"], "defect_cause"] = "정상"

    # 배치 ID
    df["batch_id"] = [f"LOT{i // 25 + 1:04d}" for i in range(n_samples)]

    # 웨이퍼 맵 (n_wafers_per_row x n_wafers_per_row 그리드)
    grid_size = n_wafers_per_row
    xx, yy = np.meshgrid(np.arange(grid_size), np.arange(grid_size))
    # 가우시안 불균일 + 노이즈
    cx, cy = grid_size / 2, grid_size / 2
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    thickness_map = 100 - 0.8 * dist + rng.normal(0, 1.2, (grid_size, grid_size))
    uniformity_map = 99 - 0.5 * dist + rng.normal(0, 0.6, (grid_size, grid_size))

    df_wafer = pd.DataFrame({
        "x": xx.ravel(),
        "y": yy.ravel(),
        "thickness": thickness_map.ravel().round(2),
        "uniformity": uniformity_map.ravel().round(2),
    })

    return df, df_wafer


# ─────────────────────────────────────────────
# 이상 감지
# ─────────────────────────────────────────────

def detect_anomalies_iqr(series: pd.Series, multiplier: float = 1.5) -> pd.Series:
    """IQR 기반 이상 감지. True = 이상."""
    q1, q3 = series.quantile(0.25), series.quantile(0.75)
    iqr = q3 - q1
    lower, upper = q1 - multiplier * iqr, q3 + multiplier * iqr
    return (series < lower) | (series > upper)


def detect_anomalies_zscore(series: pd.Series, threshold: float = 3.0) -> pd.Series:
    """Z-score 기반 이상 감지. True = 이상."""
    z = np.abs(stats.zscore(series.dropna()))
    result = pd.Series(False, index=series.index)
    result.iloc[series.dropna().index] = z > threshold
    return result


def combined_anomaly_score(df: pd.DataFrame, params: list[str]) -> pd.Series:
    """여러 파라미터의 Z-score 합산으로 종합 이상 점수 계산."""
    scores = pd.DataFrame(index=df.index)
    for p in params:
        z = pd.Series(
            np.abs(stats.zscore(df[p].fillna(df[p].mean()))),
            index=df.index,
        )
        scores[p] = z
    return scores.mean(axis=1)


def compute_spc_limits(series: pd.Series, sigma: float = 3.0) -> dict:
    """SPC 관리 한계 계산."""
    mean = series.mean()
    std  = series.std()
    return {
        "mean": mean,
        "std": std,
        "ucl": mean + sigma * std,
        "lcl": mean - sigma * std,
        "ucl_1s": mean + std,
        "lcl_1s": mean - std,
        "ucl_2s": mean + 2 * std,
        "lcl_2s": mean - 2 * std,
        "cpk": _compute_cpk(series),
    }


def _compute_cpk(series: pd.Series, usl: float | None = None, lsl: float | None = None) -> float:
    """공정 능력 지수 Cpk 계산 (USL/LSL 없으면 3-sigma 기준 추정)."""
    mean = series.mean()
    std  = series.std()
    if std == 0:
        return float("inf")
    if usl is None:
        usl = mean + 3 * std
    if lsl is None:
        lsl = mean - 3 * std
    cpu = (usl - mean) / (3 * std)
    cpl = (mean - lsl) / (3 * std)
    return round(min(cpu, cpl), 3)


# ─────────────────────────────────────────────
# Pareto 분석
# ─────────────────────────────────────────────

def compute_pareto(df: pd.DataFrame, cause_col: str = "defect_cause") -> pd.DataFrame:
    """
    Pareto 분석용 DataFrame 반환.
    정상 데이터는 제외.
    """
    counts = (
        df[df[cause_col] != "정상"][cause_col]
        .value_counts()
        .reset_index()
    )
    counts.columns = ["원인", "건수"]
    counts = counts.sort_values("건수", ascending=False).reset_index(drop=True)
    counts["누적비율"] = (counts["건수"].cumsum() / counts["건수"].sum() * 100).round(1)
    counts["비율"] = (counts["건수"] / counts["건수"].sum() * 100).round(1)
    return counts


# ─────────────────────────────────────────────
# 파라미터 최적화 제안
# ─────────────────────────────────────────────

def suggest_optimal_params(df: pd.DataFrame, yield_col: str = "yield_pct") -> dict:
    """
    수율 상위 10% 구간에서의 파라미터 평균값을 최적 조건으로 제안.
    실제 환경에서는 Bayesian 최적화 사용 권장.
    """
    top_quantile = df[yield_col].quantile(0.90)
    df_top = df[df[yield_col] >= top_quantile]

    result = {}
    for param, cfg in PROCESS_PARAMS.items():
        if param in df.columns:
            opt_mean = df_top[param].mean()
            opt_std  = df_top[param].std()
            result[param] = {
                "optimal_mean": round(float(opt_mean), 4),
                "optimal_std":  round(float(opt_std), 4),
                "target":       cfg["target"],
                "unit":         cfg["unit"],
                "deviation":    round(float(opt_mean - cfg["target"]), 4),
                "within_tol":   abs(opt_mean - cfg["target"]) <= cfg["tol"],
            }
    return result
