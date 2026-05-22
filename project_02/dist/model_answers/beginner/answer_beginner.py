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
