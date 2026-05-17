"""
현실적인 합성 공장 데이터 생성 모듈
====================================
실제 반도체/디스플레이 공장의 센서 패턴을 모사합니다:
  - 일중 온도 사이클 (낮/밤 변동)
  - 장비 워밍업 구간
  - 랜덤 이벤트 (스파이크, 드리프트)
  - 복수 설비 (EQ1 ~ EQ3)
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta


EQUIPMENT_LIST = ["EQ-01", "EQ-02", "EQ-03"]

SENSOR_CONFIG = {
    "온도":  {"base": 65.0, "amplitude": 8.0,  "noise": 1.5,  "unit": "°C",    "normal": (55, 75)},
    "압력":  {"base": 1.05, "amplitude": 0.1,  "noise": 0.02, "unit": "bar",   "normal": (0.9, 1.2)},
    "습도":  {"base": 42.0, "amplitude": 5.0,  "noise": 1.2,  "unit": "%",     "normal": (35, 55)},
    "진동":  {"base": 1.2,  "amplitude": 0.4,  "noise": 0.3,  "unit": "mm/s",  "normal": (0, 2.5)},
    "전류":  {"base": 12.5, "amplitude": 1.5,  "noise": 0.4,  "unit": "A",     "normal": (10, 15)},
}


def generate_factory_data(
    hours: int = 24,
    freq_sec: int = 60,
    anomaly_ratio: float = 0.04,
    seed: int = 42,
) -> pd.DataFrame:
    """
    공장 센서 데이터를 생성합니다.

    Args:
        hours:         생성할 시간 범위 (시간)
        freq_sec:      샘플링 간격 (초)
        anomaly_ratio: 인위적으로 삽입할 이상치 비율
        seed:          재현성을 위한 랜덤 시드

    Returns:
        시각, 설비, 센서 값, 수율, 이상 여부를 포함한 데이터프레임
    """
    rng = np.random.default_rng(seed)
    periods = hours * 3600 // freq_sec
    timestamps = [datetime(2025, 1, 1) + timedelta(seconds=i * freq_sec) for i in range(periods)]

    rows = []
    for eq in EQUIPMENT_LIST:
        eq_offset = EQUIPMENT_LIST.index(eq) * 1.5  # 설비별 오프셋

        for i, ts in enumerate(timestamps):
            t = i / periods * 2 * np.pi * (hours / 24)  # 일주기 사이클
            hour_of_day = ts.hour + ts.minute / 60

            # 일중 사이클 (낮에 온도 높음)
            day_cycle = np.sin(2 * np.pi * hour_of_day / 24 - np.pi / 2)

            row = {"시각": ts, "설비": eq}
            is_anomaly = rng.random() < anomaly_ratio

            for sensor, cfg in SENSOR_CONFIG.items():
                val = (
                    cfg["base"]
                    + eq_offset * 0.3
                    + cfg["amplitude"] * day_cycle
                    + rng.normal(0, cfg["noise"])
                )
                if is_anomaly:
                    # 이상 이벤트: 2~4 시그마 수준의 스파이크
                    spike = rng.choice([-1, 1]) * rng.uniform(2.5, 4.0) * cfg["noise"] * 3
                    val += spike

                row[sensor] = round(val, 3)

            # 수율 계산 (온도와 압력에 의존)
            temp_penalty = max(0, abs(row["온도"] - 65) - 5) * 0.3
            pres_penalty = max(0, abs(row["압력"] - 1.05) - 0.1) * 5
            row["수율"] = round(
                min(99.5, max(80.0, 96.5 - temp_penalty - pres_penalty + rng.normal(0, 0.5))),
                2,
            )
            row["이상여부"] = int(is_anomaly)

            rows.append(row)

    df = pd.DataFrame(rows)
    df["시각"] = pd.to_datetime(df["시각"])
    return df


def get_latest_readings(df: pd.DataFrame) -> pd.DataFrame:
    """설비별 최신 센서 값을 반환합니다."""
    return df.sort_values("시각").groupby("설비").last().reset_index()


def get_equipment_stats(df: pd.DataFrame) -> pd.DataFrame:
    """설비별 통계 요약을 반환합니다."""
    sensor_cols = list(SENSOR_CONFIG.keys()) + ["수율"]
    return df.groupby("설비")[sensor_cols].agg(["mean", "std", "min", "max"]).round(3)
