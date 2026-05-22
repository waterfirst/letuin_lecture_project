from __future__ import annotations

import html
import math
import textwrap
from pathlib import Path

import numpy as np
import pandas as pd
from PIL import Image, ImageDraw, ImageFont


BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parents[2]
DATA_PATH = ROOT_DIR / "project_02" / "public" / "oled_deposition_xymap.csv"
ASSET_DIR = BASE_DIR / "assets"

LEVEL_DIRS = {
    "beginner": BASE_DIR / "beginner",
    "intermediate": BASE_DIR / "intermediate",
    "advanced": BASE_DIR / "advanced",
}

PALETTE = {
    "ink": (28, 32, 38),
    "muted": (97, 108, 121),
    "grid": (221, 226, 232),
    "paper": (255, 255, 255),
    "blue": (44, 105, 176),
    "green": (47, 133, 90),
    "gold": (207, 145, 31),
    "red": (196, 63, 56),
    "violet": (111, 85, 178),
    "teal": (28, 137, 146),
}

CHAMBER_COLORS = {
    "C1": PALETTE["blue"],
    "C2": PALETTE["red"],
    "C3": PALETTE["green"],
    "C4": PALETTE["violet"],
}


def font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    candidates = [
        Path("C:/Windows/Fonts/malgunbd.ttf" if bold else "C:/Windows/Fonts/malgun.ttf"),
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


FONT_TITLE = font(30, True)
FONT_SUBTITLE = font(20, True)
FONT_BODY = font(18)
FONT_SMALL = font(15)
FONT_TINY = font(13)


def prepare_dirs() -> None:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    for level_dir in LEVEL_DIRS.values():
        level_dir.mkdir(parents=True, exist_ok=True)


def text_size(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.ImageFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def draw_centered(
    draw: ImageDraw.ImageDraw,
    xy: tuple[float, float],
    text: str,
    fnt: ImageFont.ImageFont,
    fill: tuple[int, int, int] = PALETTE["ink"],
) -> None:
    w, h = text_size(draw, text, fnt)
    draw.text((xy[0] - w / 2, xy[1] - h / 2), text, font=fnt, fill=fill)


def map_value(value: float, lo: float, hi: float, out_lo: float, out_hi: float) -> float:
    if hi == lo:
        return (out_lo + out_hi) / 2
    return out_lo + (value - lo) * (out_hi - out_lo) / (hi - lo)


def interp(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    t = max(0.0, min(1.0, t))
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def diverging_color(value: float, limit: float) -> tuple[int, int, int]:
    if pd.isna(value):
        return (232, 236, 240)
    value = max(-limit, min(limit, float(value)))
    if value < 0:
        return interp((37, 87, 163), (248, 249, 250), (value + limit) / limit)
    return interp((248, 249, 250), (194, 67, 59), value / limit)


def sequential_color(value: float, lo: float, hi: float) -> tuple[int, int, int]:
    t = 0.0 if hi == lo else (value - lo) / (hi - lo)
    return interp((234, 244, 243), (20, 121, 129), t)


def save_boxplot(df: pd.DataFrame, output: Path) -> None:
    width, height = 1180, 760
    margin = (95, 85, 60, 100)
    left, top, right, bottom = margin[0], margin[1], width - margin[2], height - margin[3]
    img = Image.new("RGB", (width, height), PALETTE["paper"])
    draw = ImageDraw.Draw(img)
    draw.text((left, 24), "Chamber별 두께 오차 분포", font=FONT_TITLE, fill=PALETTE["ink"])
    draw.text((left, 58), "thickness_error_nm: 목표 두께 대비 실제 증착 두께 편차", font=FONT_BODY, fill=PALETTE["muted"])

    groups = sorted(df["chamber"].unique())
    stats = {}
    all_values = []
    for group in groups:
        values = df.loc[df["chamber"] == group, "thickness_error_nm"].astype(float).to_numpy()
        stats[group] = np.percentile(values, [5, 25, 50, 75, 95])
        all_values.extend(values.tolist())
    y_min = math.floor(np.percentile(all_values, 1) - 0.5)
    y_max = math.ceil(np.percentile(all_values, 99) + 0.5)

    for tick in np.linspace(y_min, y_max, 7):
        y = map_value(float(tick), y_min, y_max, bottom, top)
        draw.line((left, y, right, y), fill=PALETTE["grid"], width=1)
        draw.text((28, y - 10), f"{tick:.1f}", font=FONT_SMALL, fill=PALETTE["muted"])
    draw.line((left, top, left, bottom), fill=PALETTE["ink"], width=2)
    draw.line((left, bottom, right, bottom), fill=PALETTE["ink"], width=2)
    draw_centered(draw, (38, (top + bottom) / 2), "nm", FONT_SMALL, PALETTE["muted"])

    x_positions = np.linspace(left + 105, right - 105, len(groups))
    box_width = 92
    for x, group in zip(x_positions, groups):
        p5, q1, med, q3, p95 = stats[group]
        y_p5 = map_value(p5, y_min, y_max, bottom, top)
        y_q1 = map_value(q1, y_min, y_max, bottom, top)
        y_med = map_value(med, y_min, y_max, bottom, top)
        y_q3 = map_value(q3, y_min, y_max, bottom, top)
        y_p95 = map_value(p95, y_min, y_max, bottom, top)
        color = CHAMBER_COLORS[group]
        draw.line((x, y_p95, x, y_q3), fill=color, width=4)
        draw.line((x, y_q1, x, y_p5), fill=color, width=4)
        draw.line((x - 35, y_p95, x + 35, y_p95), fill=color, width=4)
        draw.line((x - 35, y_p5, x + 35, y_p5), fill=color, width=4)
        draw.rounded_rectangle((x - box_width / 2, y_q3, x + box_width / 2, y_q1), radius=8, fill=interp(color, (255, 255, 255), 0.68), outline=color, width=3)
        draw.line((x - box_width / 2, y_med, x + box_width / 2, y_med), fill=PALETTE["ink"], width=4)
        draw_centered(draw, (x, bottom + 28), group, FONT_SUBTITLE, PALETTE["ink"])
        draw_centered(draw, (x, bottom + 56), f"median {med:.2f}", FONT_SMALL, PALETTE["muted"])

    img.save(output)


def save_scatter(df: pd.DataFrame, output: Path) -> None:
    width, height = 1180, 760
    left, top, right, bottom = 92, 95, width - 70, height - 95
    img = Image.new("RGB", (width, height), PALETTE["paper"])
    overlay = Image.new("RGBA", (width, height), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    dots = ImageDraw.Draw(overlay)
    draw.text((left, 24), "압력과 수율 점수의 관계", font=FONT_TITLE, fill=PALETTE["ink"])
    draw.text((left, 58), "샘플링 산점도와 선형 추세선. 점 색상은 chamber를 의미합니다.", font=FONT_BODY, fill=PALETTE["muted"])

    x_col, y_col = "pressure_mTorr", "yield_score"
    sample = df.sample(min(2500, len(df)), random_state=42)
    x_min, x_max = df[x_col].quantile([0.005, 0.995]).to_numpy()
    y_min, y_max = df[y_col].quantile([0.005, 0.995]).to_numpy()
    y_min = min(y_min, 68)
    y_max = max(y_max, 100)

    for tick in np.linspace(x_min, x_max, 6):
        x = map_value(float(tick), x_min, x_max, left, right)
        draw.line((x, top, x, bottom), fill=PALETTE["grid"], width=1)
        draw_centered(draw, (x, bottom + 28), f"{tick:.2f}", FONT_SMALL, PALETTE["muted"])
    for tick in np.linspace(y_min, y_max, 6):
        y = map_value(float(tick), y_min, y_max, bottom, top)
        draw.line((left, y, right, y), fill=PALETTE["grid"], width=1)
        draw.text((34, y - 9), f"{tick:.1f}", font=FONT_SMALL, fill=PALETTE["muted"])

    for _, row in sample.iterrows():
        x = map_value(float(row[x_col]), x_min, x_max, left, right)
        y = map_value(float(row[y_col]), y_min, y_max, bottom, top)
        color = CHAMBER_COLORS.get(row["chamber"], PALETTE["blue"])
        dots.ellipse((x - 2, y - 2, x + 2, y + 2), fill=(*color, 70))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    coeff = np.polyfit(df[x_col], df[y_col], 1)
    line_x = np.array([x_min, x_max])
    line_y = coeff[0] * line_x + coeff[1]
    draw.line(
        (
            map_value(float(line_x[0]), x_min, x_max, left, right),
            map_value(float(line_y[0]), y_min, y_max, bottom, top),
            map_value(float(line_x[1]), x_min, x_max, left, right),
            map_value(float(line_y[1]), y_min, y_max, bottom, top),
        ),
        fill=PALETTE["ink"],
        width=4,
    )
    draw.line((left, top, left, bottom), fill=PALETTE["ink"], width=2)
    draw.line((left, bottom, right, bottom), fill=PALETTE["ink"], width=2)
    draw_centered(draw, ((left + right) / 2, height - 34), "pressure_mTorr", FONT_BODY, PALETTE["ink"])
    draw.text((18, 95), "yield_score", font=FONT_BODY, fill=PALETTE["ink"])

    legend_x = right - 245
    legend_y = top + 15
    draw.rounded_rectangle((legend_x - 15, legend_y - 12, right - 12, legend_y + 118), radius=8, fill=(255, 255, 255), outline=PALETTE["grid"])
    for i, chamber in enumerate(sorted(CHAMBER_COLORS)):
        y = legend_y + i * 28
        draw.ellipse((legend_x, y, legend_x + 14, y + 14), fill=CHAMBER_COLORS[chamber])
        draw.text((legend_x + 24, y - 3), chamber, font=FONT_SMALL, fill=PALETTE["ink"])

    img.save(output)


def save_xy_heatmap(df: pd.DataFrame, output: Path, panel_id: str, value_col: str, title: str, limit: float | None = None) -> None:
    width, height = 1180, 760
    left, top, right, bottom = 105, 95, width - 70, height - 90
    img = Image.new("RGB", (width, height), PALETTE["paper"])
    draw = ImageDraw.Draw(img)
    draw.text((left, 24), title, font=FONT_TITLE, fill=PALETTE["ink"])
    draw.text((left, 58), f"panel_id={panel_id}, 값={value_col}", font=FONT_BODY, fill=PALETTE["muted"])

    panel = df[df["panel_id"] == panel_id]
    grid = panel.pivot_table(index="y_index", columns="x_index", values=value_col, aggfunc="mean").sort_index(ascending=False)
    arr = grid.to_numpy()
    if limit is None:
        limit = float(np.nanmax(np.abs(np.nanpercentile(arr, [2, 98]))))
    heat = Image.new("RGB", (grid.shape[1], grid.shape[0]), PALETTE["paper"])
    pixels = heat.load()
    for y in range(grid.shape[0]):
        for x in range(grid.shape[1]):
            pixels[x, y] = diverging_color(float(arr[y, x]), limit)
    try:
        resample = Image.Resampling.NEAREST
    except AttributeError:
        resample = Image.NEAREST
    heat = heat.resize((right - left, bottom - top), resample)
    img.paste(heat, (left, top))
    draw.rectangle((left, top, right, bottom), outline=PALETTE["ink"], width=2)

    for tick in range(0, 97, 16):
        x = map_value(tick, 0, 95, left, right)
        draw.line((x, bottom, x, bottom + 8), fill=PALETTE["ink"], width=2)
        draw_centered(draw, (x, bottom + 27), str(tick), FONT_SMALL, PALETTE["muted"])
    for tick in range(0, 65, 16):
        y = map_value(tick, 0, 63, bottom, top)
        draw.line((left - 8, y, left, y), fill=PALETTE["ink"], width=2)
        draw.text((55, y - 9), str(tick), font=FONT_SMALL, fill=PALETTE["muted"])
    draw_centered(draw, ((left + right) / 2, height - 34), "x_index", FONT_BODY, PALETTE["ink"])
    draw.text((18, (top + bottom) / 2 - 10), "y_index", font=FONT_BODY, fill=PALETTE["ink"])

    bar_x = right - 28
    bar_top, bar_bottom = top, bottom
    for i in range(bar_bottom - bar_top):
        value = map_value(i, 0, bar_bottom - bar_top - 1, limit, -limit)
        draw.line((bar_x, bar_top + i, bar_x + 18, bar_top + i), fill=diverging_color(value, limit), width=1)
    draw.rectangle((bar_x, bar_top, bar_x + 18, bar_bottom), outline=PALETTE["ink"], width=1)
    draw.text((bar_x - 14, bar_top - 25), f"+{limit:.1f}", font=FONT_TINY, fill=PALETTE["muted"])
    draw.text((bar_x - 10, bar_bottom + 8), f"-{limit:.1f}", font=FONT_TINY, fill=PALETTE["muted"])
    img.save(output)


def save_pareto(df: pd.DataFrame, output: Path) -> None:
    width, height = 1180, 760
    left, top, right, bottom = 100, 95, width - 90, height - 120
    img = Image.new("RGB", (width, height), PALETTE["paper"])
    draw = ImageDraw.Draw(img)
    draw.text((left, 24), "Defect Pareto Chart", font=FONT_TITLE, fill=PALETTE["ink"])
    draw.text((left, 58), "none을 제외한 결함 유형별 빈도와 누적 비율", font=FONT_BODY, fill=PALETTE["muted"])

    counts = df.loc[df["defect_type"] != "none", "defect_type"].value_counts()
    labels = counts.index.tolist()
    values = counts.to_numpy()
    max_value = int(values.max())
    cumulative = values.cumsum() / values.sum() * 100

    for tick in np.linspace(0, max_value, 6):
        y = map_value(float(tick), 0, max_value, bottom, top)
        draw.line((left, y, right, y), fill=PALETTE["grid"], width=1)
        draw.text((36, y - 9), f"{int(tick)}", font=FONT_SMALL, fill=PALETTE["muted"])
    for tick in range(0, 101, 20):
        y = map_value(tick, 0, 100, bottom, top)
        draw.text((right + 22, y - 9), f"{tick}%", font=FONT_SMALL, fill=PALETTE["muted"])

    gap = 32
    bar_width = (right - left - gap * (len(labels) - 1)) / len(labels)
    points = []
    colors = [PALETTE["red"], PALETTE["gold"], PALETTE["teal"], PALETTE["violet"], PALETTE["blue"]]
    for i, (label, value) in enumerate(zip(labels, values)):
        x0 = left + i * (bar_width + gap)
        x1 = x0 + bar_width
        y = map_value(float(value), 0, max_value, bottom, top)
        draw.rounded_rectangle((x0, y, x1, bottom), radius=6, fill=colors[i % len(colors)])
        draw_centered(draw, ((x0 + x1) / 2, y - 18), str(int(value)), FONT_SMALL, PALETTE["ink"])
        draw_centered(draw, ((x0 + x1) / 2, bottom + 25), label, FONT_SMALL, PALETTE["ink"])
        points.append(((x0 + x1) / 2, map_value(float(cumulative[i]), 0, 100, bottom, top)))

    draw.line((left, top, left, bottom), fill=PALETTE["ink"], width=2)
    draw.line((right, top, right, bottom), fill=PALETTE["muted"], width=2)
    draw.line((left, bottom, right, bottom), fill=PALETTE["ink"], width=2)
    for a, b in zip(points, points[1:]):
        draw.line((a[0], a[1], b[0], b[1]), fill=PALETTE["ink"], width=4)
    for x, y in points:
        draw.ellipse((x - 7, y - 7, x + 7, y + 7), fill=PALETTE["paper"], outline=PALETTE["ink"], width=3)
    img.save(output)


def save_corr_heatmap(df: pd.DataFrame, output: Path) -> None:
    keys = [
        ("abs_error_nm", "abs_err"),
        ("particle_count", "particle"),
        ("dark_spot_count", "darkspot"),
        ("pressure_mTorr", "pressure"),
        ("oxygen_flow_sccm", "oxygen"),
        ("deposition_rate_a_s", "rate"),
        ("luminance_cd_m2", "luminance"),
        ("voltage_v", "voltage"),
        ("yield_score", "yield"),
    ]
    cols = [k[0] for k in keys]
    labels = [k[1] for k in keys]
    corr = df[cols].corr().to_numpy()
    width, height = 1180, 860
    left, top = 245, 130
    cell = 68
    img = Image.new("RGB", (width, height), PALETTE["paper"])
    draw = ImageDraw.Draw(img)
    draw.text((90, 28), "주요 수치 컬럼 상관관계", font=FONT_TITLE, fill=PALETTE["ink"])
    draw.text((90, 62), "yield_score와 함께 움직이는 변수와 반대로 움직이는 변수를 확인합니다.", font=FONT_BODY, fill=PALETTE["muted"])
    for i, row_label in enumerate(labels):
        draw.text((95, top + i * cell + 22), row_label, font=FONT_SMALL, fill=PALETTE["ink"])
    for j, col_label in enumerate(labels):
        draw_centered(draw, (left + j * cell + cell / 2, top - 22), col_label, FONT_SMALL, PALETTE["ink"])
    for i in range(len(labels)):
        for j in range(len(labels)):
            x0 = left + j * cell
            y0 = top + i * cell
            value = float(corr[i, j])
            draw.rectangle((x0, y0, x0 + cell, y0 + cell), fill=diverging_color(value, 1.0), outline=PALETTE["paper"])
            fill = PALETTE["paper"] if abs(value) > 0.55 else PALETTE["ink"]
            draw_centered(draw, (x0 + cell / 2, y0 + cell / 2), f"{value:.2f}", FONT_TINY, fill)
    img.save(output)


def save_bar_summary(chamber_stats: pd.DataFrame, output: Path) -> None:
    width, height = 1180, 760
    left, top, right, bottom = 100, 95, width - 70, height - 105
    img = Image.new("RGB", (width, height), PALETTE["paper"])
    draw = ImageDraw.Draw(img)
    draw.text((left, 24), "Chamber별 평균 수율과 불량률", font=FONT_TITLE, fill=PALETTE["ink"])
    draw.text((left, 58), "C2와 C4가 평균 수율이 낮고 fail_rate가 높습니다.", font=FONT_BODY, fill=PALETTE["muted"])

    labels = chamber_stats.index.tolist()
    y_values = chamber_stats["yield_mean"].to_numpy()
    fail_values = chamber_stats["fail_rate"].to_numpy() * 100
    y_min = 90
    y_max = 100

    for tick in np.linspace(y_min, y_max, 6):
        y = map_value(float(tick), y_min, y_max, bottom, top)
        draw.line((left, y, right, y), fill=PALETTE["grid"], width=1)
        draw.text((40, y - 9), f"{tick:.0f}", font=FONT_SMALL, fill=PALETTE["muted"])
    gap = 56
    group_width = (right - left - gap * (len(labels) - 1)) / len(labels)
    for i, label in enumerate(labels):
        x0 = left + i * (group_width + gap)
        x1 = x0 + group_width * 0.55
        y = map_value(float(y_values[i]), y_min, y_max, bottom, top)
        draw.rounded_rectangle((x0, y, x1, bottom), radius=6, fill=CHAMBER_COLORS[label])
        draw_centered(draw, ((x0 + x1) / 2, y - 18), f"{y_values[i]:.2f}", FONT_SMALL, PALETTE["ink"])
        fx0 = x1 + 16
        fx1 = x0 + group_width
        fy = map_value(float(fail_values[i]), 0, 25, bottom, top)
        draw.rounded_rectangle((fx0, fy, fx1, bottom), radius=6, fill=PALETTE["gold"])
        draw_centered(draw, ((fx0 + fx1) / 2, fy - 18), f"{fail_values[i]:.1f}%", FONT_SMALL, PALETTE["ink"])
        draw_centered(draw, ((x0 + group_width / 2), bottom + 28), label, FONT_SUBTITLE, PALETTE["ink"])
    draw.line((left, top, left, bottom), fill=PALETTE["ink"], width=2)
    draw.line((left, bottom, right, bottom), fill=PALETTE["ink"], width=2)
    draw.text((left, bottom + 60), "색상 막대: 평균 yield_score, 금색 막대: fail_rate", font=FONT_SMALL, fill=PALETTE["muted"])
    img.save(output)


def save_regression_coefficients(ols_table: pd.DataFrame, output: Path) -> None:
    plot = ols_table[ols_table["term"] != "intercept"].copy()
    width, height = 1180, 760
    left, top, right, bottom = 270, 105, width - 90, height - 80
    img = Image.new("RGB", (width, height), PALETTE["paper"])
    draw = ImageDraw.Draw(img)
    draw.text((80, 24), "표준화 회귀계수: yield_score 영향 방향", font=FONT_TITLE, fill=PALETTE["ink"])
    draw.text((80, 58), "음수 계수가 클수록 수율 점수를 낮추는 영향이 큽니다.", font=FONT_BODY, fill=PALETTE["muted"])
    x_min, x_max = -0.62, 0.08
    zero_x = map_value(0, x_min, x_max, left, right)
    draw.line((zero_x, top - 10, zero_x, bottom + 10), fill=PALETTE["ink"], width=2)
    for tick in np.linspace(x_min, x_max, 8):
        x = map_value(float(tick), x_min, x_max, left, right)
        draw.line((x, top, x, bottom), fill=PALETTE["grid"], width=1)
        draw_centered(draw, (x, bottom + 28), f"{tick:.2f}", FONT_TINY, PALETTE["muted"])
    step = (bottom - top) / len(plot)
    for i, row in enumerate(plot.itertuples(index=False)):
        y = top + i * step + step / 2
        coef = float(row.coef)
        x = map_value(coef, x_min, x_max, left, right)
        color = PALETTE["red"] if coef < 0 else PALETTE["green"]
        x0, x1 = sorted((zero_x, x))
        draw.rounded_rectangle((x0, y - 14, x1, y + 14), radius=5, fill=color)
        draw.text((80, y - 10), str(row.term), font=FONT_SMALL, fill=PALETTE["ink"])
        p_label = "<0.001" if float(row.p_norm_approx) < 0.001 else f"{float(row.p_norm_approx):.3f}"
        draw.text((right + 12, y - 10), f"p={p_label}", font=FONT_SMALL, fill=PALETTE["muted"])
        draw_centered(draw, (x - 36 if coef < 0 else x + 36, y), f"{coef:.3f}", FONT_TINY, PALETTE["ink"])
    img.save(output)


def compute_ols(df: pd.DataFrame) -> tuple[pd.DataFrame, float]:
    predictors = [
        "abs_error_nm",
        "particle_count",
        "dark_spot_count",
        "pressure_mTorr",
        "substrate_temp_c",
        "oxygen_flow_sccm",
        "deposition_rate_a_s",
    ]
    x = df[predictors].astype(float).to_numpy()
    y = df["yield_score"].astype(float).to_numpy()
    x_std = (x - x.mean(axis=0)) / x.std(axis=0, ddof=0)
    y_std = (y - y.mean()) / y.std(ddof=0)
    x_design = np.column_stack([np.ones(len(df)), x_std])
    beta, *_ = np.linalg.lstsq(x_design, y_std, rcond=None)
    fitted = x_design @ beta
    residual = y_std - fitted
    n, k = x_design.shape
    sigma2 = float((residual @ residual) / (n - k))
    xtx_inv = np.linalg.inv(x_design.T @ x_design)
    se = np.sqrt(np.diag(sigma2 * xtx_inv))
    t_values = beta / se
    p_values = [math.erfc(abs(float(t)) / math.sqrt(2)) for t in t_values]
    r2 = 1 - float(residual @ residual) / float(((y_std - y_std.mean()) @ (y_std - y_std.mean())))
    rows = []
    for i, coef in enumerate(beta):
        rows.append(
            {
                "term": "intercept" if i == 0 else predictors[i - 1],
                "coef": float(coef),
                "t_approx": float(t_values[i]),
                "p_norm_approx": float(p_values[i]),
            }
        )
    return pd.DataFrame(rows), float(r2)


def df_to_html_table(df: pd.DataFrame, index: bool = True, classes: str = "data-table") -> str:
    return df.to_html(index=index, border=0, classes=classes, escape=False, float_format=lambda x: f"{x:.3f}")


def df_to_markdown_table(df: pd.DataFrame) -> str:
    headers = [str(column) for column in df.columns]
    rows = [[str(value) for value in row] for row in df.to_numpy()]

    def clean(value: str) -> str:
        return value.replace("|", "\\|").replace("\n", " ")

    lines = [
        "| " + " | ".join(clean(header) for header in headers) + " |",
        "| " + " | ".join("---" for _ in headers) + " |",
    ]
    for row in rows:
        lines.append("| " + " | ".join(clean(value) for value in row) + " |")
    return "\n".join(lines)


def html_page(title: str, subtitle: str, body: str) -> str:
    return f"""<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(title)}</title>
  <style>
    :root {{
      --ink: #1c2026;
      --muted: #65707d;
      --line: #dde3ea;
      --panel: #f7f9fb;
      --blue: #2c69b0;
      --red: #c43f38;
      --green: #2f855a;
    }}
    body {{
      margin: 0;
      font-family: "Malgun Gothic", "Apple SD Gothic Neo", Arial, sans-serif;
      color: var(--ink);
      background: #ffffff;
      line-height: 1.65;
    }}
    header {{
      padding: 44px min(6vw, 72px) 32px;
      border-bottom: 1px solid var(--line);
      background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
    }}
    main {{
      max-width: 1180px;
      margin: 0 auto;
      padding: 34px 24px 64px;
    }}
    h1 {{
      margin: 0 0 8px;
      font-size: 34px;
      letter-spacing: 0;
    }}
    h2 {{
      margin-top: 38px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--line);
      font-size: 24px;
      letter-spacing: 0;
    }}
    h3 {{
      margin-top: 26px;
      font-size: 19px;
      letter-spacing: 0;
    }}
    .subtitle {{
      color: var(--muted);
      font-size: 17px;
      margin: 0;
    }}
    .note {{
      background: var(--panel);
      border-left: 4px solid var(--blue);
      padding: 14px 18px;
      margin: 18px 0;
    }}
    .warning {{
      border-left-color: var(--red);
    }}
    .grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 14px;
    }}
    .metric {{
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 14px 16px;
      background: #fff;
    }}
    .metric strong {{
      display: block;
      font-size: 24px;
    }}
    img.figure {{
      display: block;
      width: 100%;
      max-width: 1120px;
      margin: 16px 0 10px;
      border: 1px solid var(--line);
      border-radius: 8px;
    }}
    table.data-table {{
      border-collapse: collapse;
      width: 100%;
      margin: 14px 0 22px;
      font-size: 14px;
    }}
    table.data-table th,
    table.data-table td {{
      border: 1px solid var(--line);
      padding: 8px 9px;
      text-align: left;
      vertical-align: top;
    }}
    table.data-table th {{
      background: #f1f5f9;
    }}
    code {{
      background: #f1f5f9;
      padding: 2px 5px;
      border-radius: 4px;
    }}
  </style>
</head>
<body>
  <header>
    <h1>{html.escape(title)}</h1>
    <p class="subtitle">{html.escape(subtitle)}</p>
  </header>
  <main>
{body}
  </main>
</body>
</html>
"""


def make_column_dictionary(df: pd.DataFrame) -> None:
    descriptions = {
        "lot_id": "생산 lot 식별자",
        "run_id": "증착 run 식별자",
        "panel_id": "측정 panel 식별자",
        "tool_id": "증착 장비 식별자",
        "chamber": "장비 내 chamber",
        "sample_id": "panel 내 측정 sample ID",
        "x_index": "x 방향 격자 좌표",
        "y_index": "y 방향 격자 좌표",
        "x_mm": "x 방향 실제 위치(mm)",
        "y_mm": "y 방향 실제 위치(mm)",
        "zone": "panel 위치 영역(center, middle, edge)",
        "source_temp_c": "증착 source 온도(섭씨)",
        "substrate_temp_c": "기판 온도(섭씨)",
        "pressure_mTorr": "chamber 압력(mTorr)",
        "oxygen_flow_sccm": "산소 유량(sccm)",
        "nitrogen_flow_sccm": "질소 유량(sccm)",
        "deposition_rate_a_s": "증착 속도(Angstrom/sec)",
        "target_thickness_nm": "목표 두께(nm)",
        "thickness_nm": "측정 두께(nm)",
        "thickness_error_nm": "측정 두께 - 목표 두께(nm)",
        "abs_error_nm": "두께 오차 절댓값(nm)",
        "sheet_resistance_ohm_sq": "면저항(ohm/sq)",
        "luminance_cd_m2": "휘도(cd/m2)",
        "voltage_v": "구동 전압(V)",
        "particle_count": "측정 좌표 주변 particle 개수",
        "dark_spot_count": "dark spot 개수",
        "defect_type": "주요 결함 유형",
        "pass_fail": "좌표 단위 품질 판정",
        "yield_score": "좌표 단위 수율 점수",
    }
    rows = []
    for column in df.columns:
        rows.append(
            {
                "column": column,
                "dtype": str(df[column].dtype),
                "meaning": descriptions.get(column, ""),
                "example": df[column].iloc[0],
                "n_unique": int(df[column].nunique(dropna=False)),
            }
        )
    out = BASE_DIR / "column_dictionary.md"
    table = df_to_markdown_table(pd.DataFrame(rows))
    out.write_text(
        "# OLED deposition CSV 컬럼 사전\n\n"
        f"- 원본 파일: `{DATA_PATH.relative_to(ROOT_DIR).as_posix()}`\n"
        f"- 행/열: {df.shape[0]:,}행, {df.shape[1]}개 컬럼\n"
        "- 이 파일은 모범답안을 만들 때 실제 CSV를 읽어 자동 생성했습니다.\n\n"
        f"{table}\n",
        encoding="utf-8",
    )


def make_readme(df: pd.DataFrame, chamber_stats: pd.DataFrame, ols_r2: float) -> None:
    fail_rate = (df["pass_fail"] == "fail").mean() * 100
    worst_chamber = chamber_stats["fail_rate"].idxmax()
    best_chamber = chamber_stats["yield_mean"].idxmax()
    body = f"""# Project 2 채점용 모범답안

이 폴더는 Project 2의 초급, 중급, 고급 제출물을 채점할 때 비교 기준으로 쓰기 위한 모범답안입니다.
원본 CSV는 복사본이 아니라 `project_02/public/oled_deposition_xymap.csv`를 직접 읽어 분석했습니다.

## 생성 방법

```bash
python projects/project2/model_answers/build_model_answers.py
```

현재 저장된 HTML 보고서와 그림은 위 스크립트로 재생성할 수 있습니다. 실행 환경에 `pandas`, `numpy`, `Pillow`가 있으면 보고서 생성이 가능하고, 학생용 예시 코드는 `seaborn`, `matplotlib`, `statsmodels`, `quarto` 사용을 전제로 작성했습니다.

## 단계별 산출물

| 단계 | 파일 |
|---|---|
| 초급 | `beginner/report_beginner.html`, `beginner/answer_beginner.py`, `beginner/hints_beginner.md` |
| 중급 | `intermediate/report_intermediate.html`, `intermediate/answer_intermediate.py`, `intermediate/hints_intermediate.md` |
| 고급 | `advanced/report_advanced.html`, `advanced/oled_deposition_report.qmd`, `advanced/answer_advanced.py`, `advanced/hints_advanced.md` |
| 공통 | `column_dictionary.md`, `assets/*.png` |

## 기준 인사이트

- 데이터 크기: {df.shape[0]:,}행, {df.shape[1]}개 컬럼
- 전체 fail rate: {fail_rate:.2f}%
- 평균 수율이 가장 좋은 chamber: {best_chamber}
- fail rate가 가장 높은 chamber: {worst_chamber}
- 결함 Pareto 1순위: particle
- 표준화 OLS 기준 R-squared: {ols_r2:.4f}

## 채점 시 확인할 핵심

1. 제출자가 CSV를 먼저 읽고 `df.columns`, `df.shape`, 주요 컬럼 의미를 확인했는가.
2. x/y 좌표가 있는 데이터라는 점을 살려 heatmap 또는 x/y map을 만들었는가.
3. 단순 그래프 나열이 아니라 chamber, zone, defect_type, yield_score 사이의 관계를 설명했는가.
4. 중급 이상은 Pareto, correlation, 회귀분석 또는 그룹 비교를 통해 원인 후보를 좁혔는가.
5. 고급은 Quarto 문서 또는 그에 준하는 재현 가능한 HTML 보고서로 코드와 해석을 함께 남겼는가.
"""
    (BASE_DIR / "README.md").write_text(body, encoding="utf-8")


def write_answer_scripts() -> None:
    beginner = r'''
from pathlib import Path

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt


ROOT = Path(__file__).resolve().parents[4]
DATA = ROOT / "project_02" / "public" / "oled_deposition_xymap.csv"
OUT = Path(__file__).resolve().parent / "outputs"
OUT.mkdir(exist_ok=True)

sns.set_theme(style="whitegrid", font="Malgun Gothic")
df = pd.read_csv(DATA)

print("shape:", df.shape)
print("columns:", df.columns.tolist())
print(df[["thickness_error_nm", "particle_count", "yield_score"]].describe())

plt.figure(figsize=(8, 5))
sns.boxplot(data=df, x="chamber", y="thickness_error_nm")
plt.title("Chamber별 thickness_error_nm 분포")
plt.tight_layout()
plt.savefig(OUT / "boxplot_chamber.png", dpi=160)
plt.close()

plt.figure(figsize=(8, 5))
sample = df.sample(min(3000, len(df)), random_state=42)
sns.scatterplot(data=sample, x="pressure_mTorr", y="yield_score", hue="chamber", alpha=0.35, s=18)
plt.title("pressure_mTorr와 yield_score 산점도")
plt.tight_layout()
plt.savefig(OUT / "scatter_pressure_yield.png", dpi=160)
plt.close()

panel = df[df["panel_id"] == "PNL_A02"]
heat = panel.pivot_table(index="y_index", columns="x_index", values="thickness_error_nm", aggfunc="mean")
plt.figure(figsize=(10, 6))
sns.heatmap(heat.sort_index(ascending=False), cmap="coolwarm", center=0)
plt.title("PNL_A02 thickness_error_nm x/y heatmap")
plt.tight_layout()
plt.savefig(OUT / "heatmap_pnl_a02.png", dpi=160)
plt.close()

report = f"""
<!doctype html>
<html lang="ko">
<meta charset="utf-8">
<title>초급 모범답안</title>
<h1>초급 모범답안: OLED deposition 기본 시각화</h1>
<p>CSV shape: {df.shape[0]:,} rows x {df.shape[1]} columns</p>
<p>확인 컬럼: {", ".join(df.columns)}</p>
<h2>Boxplot</h2><img src="outputs/boxplot_chamber.png" width="760">
<p>C2와 C4는 두께 오차의 중심값이 양의 방향으로 치우쳐 수율 저하 후보입니다.</p>
<h2>Scatter</h2><img src="outputs/scatter_pressure_yield.png" width="760">
<p>압력이 높아지는 구간에서 yield_score가 낮아지는 경향을 확인합니다.</p>
<h2>Heatmap</h2><img src="outputs/heatmap_pnl_a02.png" width="760">
<p>PNL_A02의 edge 일부에 두께 오차 hotspot이 나타납니다.</p>
</html>
"""
(OUT / "report_beginner.html").write_text(report, encoding="utf-8")
'''

    intermediate = r'''
from pathlib import Path

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import statsmodels.formula.api as smf


ROOT = Path(__file__).resolve().parents[4]
DATA = ROOT / "project_02" / "public" / "oled_deposition_xymap.csv"
OUT = Path(__file__).resolve().parent / "outputs"
OUT.mkdir(exist_ok=True)

sns.set_theme(style="whitegrid", font="Malgun Gothic")
df = pd.read_csv(DATA)

print("shape:", df.shape)
print("columns:", df.columns.tolist())

def savefig(name):
    plt.tight_layout()
    plt.savefig(OUT / name, dpi=160)
    plt.close()

plt.figure(figsize=(8, 5))
sns.boxplot(data=df, x="chamber", y="thickness_error_nm")
savefig("01_boxplot_chamber.png")

plt.figure(figsize=(8, 5))
sample = df.sample(min(3000, len(df)), random_state=42)
sns.scatterplot(data=sample, x="abs_error_nm", y="yield_score", hue="chamber", alpha=0.35, s=18)
savefig("02_scatter_abs_error_yield.png")

panel = df[df["panel_id"] == "PNL_A02"]
heat = panel.pivot_table(index="y_index", columns="x_index", values="yield_score", aggfunc="mean")
plt.figure(figsize=(10, 6))
sns.heatmap(heat.sort_index(ascending=False), cmap="viridis")
savefig("03_heatmap_pnl_a02_yield.png")

defects = df[df["defect_type"] != "none"]["defect_type"].value_counts()
pareto = defects.to_frame("count")
pareto["cum_pct"] = pareto["count"].cumsum() / pareto["count"].sum() * 100
fig, ax1 = plt.subplots(figsize=(8, 5))
sns.barplot(x=pareto.index, y=pareto["count"], ax=ax1, color="#2c69b0")
ax2 = ax1.twinx()
ax2.plot(range(len(pareto)), pareto["cum_pct"], color="#c43f38", marker="o")
ax2.set_ylim(0, 105)
ax1.set_title("Defect Pareto")
savefig("04_pareto_defect.png")

numeric = ["abs_error_nm", "particle_count", "dark_spot_count", "pressure_mTorr", "oxygen_flow_sccm", "deposition_rate_a_s", "luminance_cd_m2", "voltage_v", "yield_score"]
plt.figure(figsize=(9, 7))
sns.heatmap(df[numeric].corr(), cmap="coolwarm", center=0, annot=True, fmt=".2f")
savefig("05_correlation_heatmap.png")

model = smf.ols("yield_score ~ abs_error_nm + particle_count + dark_spot_count + pressure_mTorr + oxygen_flow_sccm + C(chamber) + C(zone)", data=df).fit()
significant = model.pvalues[model.pvalues < 0.05].sort_values()

report = f"""
<!doctype html>
<html lang="ko">
<meta charset="utf-8">
<title>중급 모범답안</title>
<h1>중급 모범답안: 그래프와 통계분석으로 원인 후보 좁히기</h1>
<p>데이터: {df.shape[0]:,} rows x {df.shape[1]} columns</p>
<h2>주요 결과</h2>
<ul>
<li>fail rate: {(df["pass_fail"].eq("fail").mean()*100):.2f}%</li>
<li>particle 결함이 none 제외 Pareto 1순위입니다.</li>
<li>abs_error_nm, particle_count, dark_spot_count는 yield_score와 강한 음의 관계를 보입니다.</li>
<li>OLS 유의 변수: {", ".join(significant.index[:8])}</li>
</ul>
<img src="outputs/01_boxplot_chamber.png" width="760">
<img src="outputs/02_scatter_abs_error_yield.png" width="760">
<img src="outputs/03_heatmap_pnl_a02_yield.png" width="760">
<img src="outputs/04_pareto_defect.png" width="760">
<img src="outputs/05_correlation_heatmap.png" width="760">
<h2>회귀분석 요약</h2>
<pre>{model.summary().as_text()}</pre>
</html>
"""
(OUT / "report_intermediate.html").write_text(report, encoding="utf-8")
'''

    advanced = r'''
from pathlib import Path

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import statsmodels.formula.api as smf


ROOT = Path(__file__).resolve().parents[4]
DATA = ROOT / "project_02" / "public" / "oled_deposition_xymap.csv"
OUT = Path(__file__).resolve().parent / "outputs"
OUT.mkdir(exist_ok=True)

df = pd.read_csv(DATA)
print(df.shape)
print(df.columns.tolist())

model = smf.ols(
    "yield_score ~ abs_error_nm + particle_count + dark_spot_count + pressure_mTorr + oxygen_flow_sccm + deposition_rate_a_s + C(chamber) + C(zone)",
    data=df,
).fit()

print(model.summary())
model.summary2().tables[1].to_csv(OUT / "ols_coefficients.csv")
'''

    (LEVEL_DIRS["beginner"] / "answer_beginner.py").write_text(textwrap.dedent(beginner).strip() + "\n", encoding="utf-8")
    (LEVEL_DIRS["intermediate"] / "answer_intermediate.py").write_text(textwrap.dedent(intermediate).strip() + "\n", encoding="utf-8")
    (LEVEL_DIRS["advanced"] / "answer_advanced.py").write_text(textwrap.dedent(advanced).strip() + "\n", encoding="utf-8")

    qmd = r'''---
title: "OLED Deposition 원인 분석 모범답안"
format:
  html:
    toc: true
    code-fold: true
    theme: cosmo
execute:
  echo: true
  warning: false
  message: false
---

## 분석 목적

OLED deposition x/y map CSV를 읽고 두께 오차, 결함, 공정 조건이 수율 점수에 어떤 영향을 주는지 확인한다.
목표는 단순한 그래프 작성이 아니라 공정 개선으로 이어질 수 있는 원인 후보를 찾는 것이다.

```{python}
from pathlib import Path
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import statsmodels.formula.api as smf

sns.set_theme(style="whitegrid", font="Malgun Gothic")
DATA = Path("../../../../project_02/public/oled_deposition_xymap.csv").resolve()
df = pd.read_csv(DATA)
df.shape, df.columns.tolist()
```

## 컬럼 확인

```{python}
df.dtypes.to_frame("dtype")
```

```{python}
df[["thickness_nm", "thickness_error_nm", "abs_error_nm", "particle_count", "dark_spot_count", "yield_score"]].describe()
```

## 기본 시각화

```{python}
plt.figure(figsize=(8, 5))
sns.boxplot(data=df, x="chamber", y="thickness_error_nm")
plt.title("Chamber별 두께 오차")
plt.show()
```

```{python}
sample = df.sample(min(3000, len(df)), random_state=42)
plt.figure(figsize=(8, 5))
sns.scatterplot(data=sample, x="abs_error_nm", y="yield_score", hue="chamber", alpha=0.35, s=18)
plt.title("두께 절대오차와 수율 점수")
plt.show()
```

```{python}
panel = df[df["panel_id"] == "PNL_A02"]
heat = panel.pivot_table(index="y_index", columns="x_index", values="thickness_error_nm", aggfunc="mean")
plt.figure(figsize=(11, 6))
sns.heatmap(heat.sort_index(ascending=False), cmap="coolwarm", center=0)
plt.title("PNL_A02 thickness_error_nm x/y map")
plt.show()
```

## Pareto와 상관관계

```{python}
defects = df[df["defect_type"] != "none"]["defect_type"].value_counts()
pareto = defects.to_frame("count")
pareto["cum_pct"] = pareto["count"].cumsum() / pareto["count"].sum() * 100
pareto
```

```{python}
fig, ax1 = plt.subplots(figsize=(8, 5))
sns.barplot(x=pareto.index, y=pareto["count"], ax=ax1, color="#2c69b0")
ax2 = ax1.twinx()
ax2.plot(range(len(pareto)), pareto["cum_pct"], color="#c43f38", marker="o")
ax2.set_ylim(0, 105)
ax1.set_title("Defect Pareto")
plt.show()
```

```{python}
numeric = ["abs_error_nm", "particle_count", "dark_spot_count", "pressure_mTorr", "oxygen_flow_sccm", "deposition_rate_a_s", "luminance_cd_m2", "voltage_v", "yield_score"]
plt.figure(figsize=(9, 7))
sns.heatmap(df[numeric].corr(), cmap="coolwarm", center=0, annot=True, fmt=".2f")
plt.title("Correlation heatmap")
plt.show()
```

## 회귀분석과 p-value

```{python}
model = smf.ols(
    "yield_score ~ abs_error_nm + particle_count + dark_spot_count + pressure_mTorr + oxygen_flow_sccm + deposition_rate_a_s + C(chamber) + C(zone)",
    data=df,
).fit()
model.summary()
```

## 원인 후보와 개선 제안

1. `particle_count`, `dark_spot_count`, `abs_error_nm`가 수율을 강하게 낮춘다. particle 관리와 dark spot 검사 조건을 우선 점검한다.
2. C2와 C4는 fail rate가 높고 두께 오차가 양의 방향으로 치우친다. chamber별 source 온도, 압력, 유량 보정 이력을 확인한다.
3. PNL_A02 edge 영역의 hotspot은 위치 의존 패턴이므로 shadow mask 정렬, edge gas flow, edge temperature uniformity를 확인한다.
'''
    (LEVEL_DIRS["advanced"] / "oled_deposition_report.qmd").write_text(textwrap.dedent(qmd).strip() + "\n", encoding="utf-8")


def write_hints() -> None:
    hints = {
        "beginner": """# 초급 힌트

1. CSV를 바로 그래프로 그리지 말고 `df.shape`, `df.columns`, `df.head()`를 먼저 출력한다.
2. heatmap은 `pivot_table(index="y_index", columns="x_index", values="thickness_error_nm")`처럼 x/y 좌표를 2차원 표로 바꾼 뒤 그린다.
3. 산점도는 전체 24,576점을 모두 찍으면 느리거나 흐려질 수 있으니 `sample(random_state=42)`로 일부만 확인해도 된다.
4. `ModuleNotFoundError: seaborn`이 나오면 `pip install pandas seaborn matplotlib`을 실행한다.
5. HTML에서 그림이 안 보이면 HTML 파일 기준 상대경로가 맞는지 확인한다.
""",
        "intermediate": """# 중급 힌트

1. Pareto chart를 만들 때 `defect_type == "none"`을 포함하면 결함 원인이 잘 보이지 않는다. none을 제외하고 결함끼리 비교한다.
2. chamber별 평균만 보지 말고 fail rate, abs_error_nm, particle_count를 함께 비교한다.
3. correlation은 원인을 증명하는 값이 아니다. 그래프, 위치 패턴, 회귀분석 결과를 함께 보고 원인 후보라고 표현한다.
4. OLS에서 범주형 변수는 `C(chamber)`, `C(zone)`처럼 처리한다.
5. p-value가 작아도 계수 방향과 공정 의미가 맞는지 확인해야 한다.
""",
        "advanced": """# 고급 힌트

1. Antigravity IDE 터미널에서 `quarto --version`이 안 되면 Quarto CLI 설치 후 PATH를 다시 열어야 한다.
2. Quarto Python chunk가 실패하면 `pip install jupyter pandas seaborn matplotlib statsmodels`를 같은 Python 환경에 설치한다.
3. `.qmd`의 YAML은 들여쓰기가 민감하다. `format: html:` 아래 들여쓰기를 확인한다.
4. `quarto render oled_deposition_report.qmd --to html`은 `.qmd`가 있는 폴더에서 실행하는 것이 가장 안전하다.
5. statsmodels 설치가 실패하면 먼저 Python 버전과 pip 경로를 확인한다. `python -m pip --version`으로 Antigravity가 쓰는 Python을 확인한다.
6. x/y map은 전체 평균만 보면 hotspot이 흐려질 수 있다. worst panel이나 fail panel을 골라서 별도로 그린다.
""",
    }
    for level, content in hints.items():
        (LEVEL_DIRS[level] / f"hints_{level}.md").write_text(content, encoding="utf-8")


def write_reports(df: pd.DataFrame, ols_table: pd.DataFrame, ols_r2: float) -> None:
    pass_count = df["pass_fail"].value_counts()
    defect_counts = df["defect_type"].value_counts()
    chamber_stats = (
        df.groupby("chamber")
        .agg(
            yield_mean=("yield_score", "mean"),
            thickness_error_mean=("thickness_error_nm", "mean"),
            abs_error_mean=("abs_error_nm", "mean"),
            fail_rate=("pass_fail", lambda s: (s == "fail").mean()),
            particles=("particle_count", "sum"),
            darkspots=("dark_spot_count", "sum"),
        )
        .round(4)
    )
    zone_stats = (
        df.groupby("zone")
        .agg(
            yield_mean=("yield_score", "mean"),
            abs_error_mean=("abs_error_nm", "mean"),
            fail_rate=("pass_fail", lambda s: (s == "fail").mean()),
        )
        .round(4)
    )
    panel_stats = df.groupby("panel_id")["yield_score"].agg(["mean", "std", "min", "max"]).round(3)
    corr_yield = df[
        [
            "source_temp_c",
            "substrate_temp_c",
            "pressure_mTorr",
            "oxygen_flow_sccm",
            "nitrogen_flow_sccm",
            "deposition_rate_a_s",
            "thickness_error_nm",
            "abs_error_nm",
            "particle_count",
            "dark_spot_count",
            "luminance_cd_m2",
            "voltage_v",
            "yield_score",
        ]
    ].corr()["yield_score"].sort_values().to_frame("corr_with_yield")
    top_bad = df.nsmallest(10, "yield_score")[
        ["panel_id", "chamber", "x_index", "y_index", "zone", "thickness_error_nm", "particle_count", "dark_spot_count", "defect_type", "yield_score"]
    ]

    beginner_body = f"""
<section class="grid">
  <div class="metric"><span>행/열</span><strong>{df.shape[0]:,} x {df.shape[1]}</strong></div>
  <div class="metric"><span>fail rate</span><strong>{(df['pass_fail'].eq('fail').mean()*100):.2f}%</strong></div>
  <div class="metric"><span>주요 결함 1순위</span><strong>particle</strong></div>
</section>
<h2>1. 원본 CSV 확인</h2>
<p>원본 CSV를 읽은 뒤 컬럼명을 먼저 확인했다. 이 데이터는 panel x/y 위치, chamber, zone, 공정 조건, 두께 오차, particle, dark spot, pass/fail, yield_score를 함께 담고 있다.</p>
<div class="note">초급 답안의 핵심은 그래프를 예쁘게 만드는 것보다, 어떤 컬럼이 어떤 측정값인지 확인한 뒤 적절한 그래프를 선택하는 것이다.</div>
{df_to_html_table(pd.DataFrame({'column': df.columns, 'dtype': [str(df[c].dtype) for c in df.columns]}), index=False)}
<h2>2. Boxplot</h2>
<img class="figure" src="../assets/beginner_boxplot_chamber.png" alt="chamber별 thickness_error_nm boxplot">
<p>C2와 C4의 두께 오차가 양의 방향으로 치우쳐 있다. 즉 두 chamber는 목표보다 두껍게 증착되는 경향이 있고, 수율 저하 후보로 볼 수 있다.</p>
<h2>3. Scatter Plot</h2>
<img class="figure" src="../assets/beginner_scatter_pressure_yield.png" alt="pressure와 yield scatter">
<p>압력과 yield_score 사이에는 약한 음의 경향이 보인다. 압력만으로 원인을 단정할 수는 없지만, C2와 C4의 조건 점검이 필요하다는 힌트를 준다.</p>
<h2>4. Heatmap</h2>
<img class="figure" src="../assets/beginner_heatmap_pnl_a02_error.png" alt="PNL_A02 x/y heatmap">
<p>PNL_A02의 edge 영역에 두께 오차 hotspot이 확인된다. x/y 좌표가 있는 데이터는 평균 표뿐 아니라 map으로 봐야 위치성 결함을 발견할 수 있다.</p>
<h2>초급 결론</h2>
<p>기본 시각화만으로도 C2/C4 chamber와 PNL_A02 edge 위치가 원인 후보로 좁혀진다. 다음 단계에서는 defect Pareto와 통계분석으로 이 후보가 수율에 실제로 연결되는지 확인한다.</p>
"""
    (LEVEL_DIRS["beginner"] / "report_beginner.html").write_text(
        html_page("초급 모범답안: OLED Deposition 기본 시각화", "CSV를 읽고 boxplot, scatter, heatmap으로 1차 인사이트를 얻는 보고서", beginner_body),
        encoding="utf-8",
    )

    defect_focus = defect_counts.to_frame("count")
    defect_focus["pct"] = defect_focus["count"] / len(df) * 100
    intermediate_body = f"""
<section class="grid">
  <div class="metric"><span>pass</span><strong>{int(pass_count.get('pass', 0)):,}</strong></div>
  <div class="metric"><span>fail</span><strong>{int(pass_count.get('fail', 0)):,}</strong></div>
  <div class="metric"><span>OLS R-squared</span><strong>{ols_r2:.4f}</strong></div>
</section>
<h2>1. 데이터와 컬럼 이해</h2>
<p>분석 전 원본 CSV의 29개 컬럼을 확인했다. 핵심 목표 변수는 <code>yield_score</code>와 <code>pass_fail</code>이고, 원인 후보는 <code>thickness_error_nm</code>, <code>particle_count</code>, <code>dark_spot_count</code>, chamber/zone, 공정 조건 컬럼이다.</p>
<h3>Chamber 요약</h3>
{df_to_html_table(chamber_stats)}
<h3>Zone 요약</h3>
{df_to_html_table(zone_stats)}
<h2>2. 그래프 기반 인사이트</h2>
<img class="figure" src="../assets/beginner_boxplot_chamber.png" alt="boxplot">
<p>C2와 C4는 평균 수율이 낮고 fail rate가 높다. 두께 오차 평균도 양의 방향으로 커서 over-deposition 가능성을 의심할 수 있다.</p>
<img class="figure" src="../assets/intermediate_chamber_yield_fail.png" alt="chamber yield fail">
<p>평균 yield_score와 fail_rate를 함께 보면 C4가 가장 위험하고 C2가 다음 위험군이다.</p>
<img class="figure" src="../assets/intermediate_pareto_defects.png" alt="defect pareto">
<p>none을 제외한 결함 중 particle이 가장 많다. 결함 개선 우선순위는 particle, thick_spot, map_hotspot/dark_spot 순서가 적절하다.</p>
<img class="figure" src="../assets/intermediate_correlation_heatmap.png" alt="correlation heatmap">
<p>yield_score와 음의 상관이 큰 변수는 particle_count, abs_error_nm, voltage_v, dark_spot_count다. 반대로 luminance_cd_m2는 yield_score와 양의 상관이 강하다.</p>
<h2>3. 결함 유형 빈도</h2>
{df_to_html_table(defect_focus.round(3))}
<h2>4. 통계 분석</h2>
<p>표준화한 수치 변수로 OLS를 수행했다. p-value는 표본 수가 충분히 큰 조건에서 정규근사로 계산했다.</p>
{df_to_html_table(ols_table.assign(coef=ols_table['coef'].round(4), t_approx=ols_table['t_approx'].round(2), p_norm_approx=ols_table['p_norm_approx'].map(lambda x: '<0.001' if x < 0.001 else f'{x:.3f}')), index=False)}
<h2>중급 결론</h2>
<p>수율 저하의 1차 원인 후보는 particle, dark spot, 두께 절대오차다. 공정 조건 중 pressure 자체는 다른 변수를 같이 넣으면 유의하지 않았고, oxygen flow는 약하지만 유의한 신호를 보였다. 따라서 chamber C2/C4의 particle 관리, 두께 보정, edge 균일도를 우선 점검하는 결론이 타당하다.</p>
"""
    (LEVEL_DIRS["intermediate"] / "report_intermediate.html").write_text(
        html_page("중급 모범답안: 시각화와 통계분석", "그래프 5종 이상과 통계분석으로 OLED deposition 수율 저하 원인 후보를 좁히는 보고서", intermediate_body),
        encoding="utf-8",
    )

    advanced_body = f"""
<section class="grid">
  <div class="metric"><span>분석 대상</span><strong>{df.shape[0]:,} points</strong></div>
  <div class="metric"><span>Worst panel</span><strong>{panel_stats['mean'].idxmin()}</strong></div>
  <div class="metric"><span>모델 설명력</span><strong>R2 {ols_r2:.4f}</strong></div>
</section>
<h2>1. 분석 목적</h2>
<p>고급 모범답안은 Antigravity IDE에서 raw CSV를 직접 읽고, 그래프를 확인하면서 원인 후보를 점차 좁히는 흐름을 문서화한다. Quarto 제출의 기준 파일은 <code>oled_deposition_report.qmd</code>이다.</p>
<h2>2. 데이터 구조 확인</h2>
<p>좌표형 데이터이므로 panel, x/y 위치, chamber, zone을 먼저 확인해야 한다. 수율 저하를 설명할 수 있는 측정 컬럼은 두께 오차, particle, dark spot, 전기/광학 특성, 공정 조건이다.</p>
{df_to_html_table(panel_stats)}
<h2>3. 위치 패턴 분석</h2>
<img class="figure" src="../assets/advanced_hotspot_pnl_a02_yield.png" alt="PNL_A02 yield heatmap">
<p>PNL_A02는 평균 수율이 낮고 edge 영역에 저수율 hotspot이 관찰된다. 이 패턴은 단순 랜덤 결함보다 위치 의존 원인, 예를 들어 edge gas flow, shadow mask 정렬, edge 온도 균일도 문제와 더 잘 맞는다.</p>
<img class="figure" src="../assets/beginner_heatmap_pnl_a02_error.png" alt="PNL_A02 thickness error">
<p>같은 panel에서 두께 오차도 hotspot과 맞물린다. 저수율 영역이 두께 오차와 결함 count 모두에 반응하는지 추가 확인해야 한다.</p>
<h2>4. Pareto와 회귀분석</h2>
<img class="figure" src="../assets/intermediate_pareto_defects.png" alt="pareto">
<p>결함 개선은 particle부터 시작하는 것이 합리적이다. 단, thick_spot과 map_hotspot은 두께 오차와 위치 패턴에 연결될 수 있어 chamber 보정과 함께 본다.</p>
<img class="figure" src="../assets/advanced_regression_coefficients.png" alt="regression coefficients">
<p>표준화 회귀계수 기준으로 yield_score를 가장 크게 낮추는 변수는 abs_error_nm, particle_count, dark_spot_count다. pressure와 substrate 온도는 이 모델에서 유의하지 않아 직접 원인이라기보다 chamber/두께/결함과 동반되는 조건일 가능성이 높다.</p>
<h3>OLS 결과</h3>
{df_to_html_table(ols_table.assign(coef=ols_table['coef'].round(4), t_approx=ols_table['t_approx'].round(2), p_norm_approx=ols_table['p_norm_approx'].map(lambda x: '<0.001' if x < 0.001 else f'{x:.3f}')), index=False)}
<h2>5. 저수율 좌표 Top 10</h2>
{df_to_html_table(top_bad.round(3), index=False)}
<h2>6. 최종 원인 후보</h2>
<ol>
  <li>C2/C4 chamber의 over-deposition 경향과 edge 영역 두께 균일도 저하</li>
  <li>particle 결함의 우선순위가 높고 수율과 강한 음의 관계를 보임</li>
  <li>PNL_A02 edge hotspot은 위치 의존성이 있으므로 mask 정렬, edge flow, substrate support 상태 점검 필요</li>
</ol>
<div class="note warning">보고서 작성 시 p-value가 작다는 사실만 쓰지 말고, 그래프에서 보이는 위치 패턴과 공정 의미를 함께 연결해야 좋은 고급 답안이 된다.</div>
"""
    (LEVEL_DIRS["advanced"] / "report_advanced.html").write_text(
        html_page("고급 모범답안: Quarto 기반 원인 분석", "x/y map, Pareto, 회귀분석, p-value 해석을 결합한 재현 가능한 HTML 보고서", advanced_body),
        encoding="utf-8",
    )


def main() -> None:
    prepare_dirs()
    df = pd.read_csv(DATA_PATH)
    ols_table, ols_r2 = compute_ols(df)

    save_boxplot(df, ASSET_DIR / "beginner_boxplot_chamber.png")
    save_scatter(df, ASSET_DIR / "beginner_scatter_pressure_yield.png")
    save_xy_heatmap(df, ASSET_DIR / "beginner_heatmap_pnl_a02_error.png", "PNL_A02", "thickness_error_nm", "PNL_A02 두께 오차 x/y map", limit=6.0)
    save_pareto(df, ASSET_DIR / "intermediate_pareto_defects.png")
    save_corr_heatmap(df, ASSET_DIR / "intermediate_correlation_heatmap.png")
    chamber_stats = (
        df.groupby("chamber")
        .agg(
            yield_mean=("yield_score", "mean"),
            fail_rate=("pass_fail", lambda s: (s == "fail").mean()),
        )
        .round(4)
    )
    save_bar_summary(chamber_stats, ASSET_DIR / "intermediate_chamber_yield_fail.png")
    df_for_maps = df.assign(yield_score_delta=df["yield_score"] - df["yield_score"].mean())
    save_xy_heatmap(
        df_for_maps,
        ASSET_DIR / "advanced_hotspot_pnl_a02_yield.png",
        "PNL_A02",
        "yield_score_delta",
        "PNL_A02 yield_score 평균 대비 편차 x/y map",
        limit=16.0,
    )
    save_regression_coefficients(ols_table, ASSET_DIR / "advanced_regression_coefficients.png")

    make_column_dictionary(df)
    make_readme(df, chamber_stats, ols_r2)
    write_answer_scripts()
    write_hints()
    write_reports(df, ols_table, ols_r2)
    print(f"Generated model answers in {BASE_DIR}")
    print(f"Read original CSV: {DATA_PATH}")
    print(f"Rows: {df.shape[0]:,}, columns: {df.shape[1]}")


if __name__ == "__main__":
    main()
