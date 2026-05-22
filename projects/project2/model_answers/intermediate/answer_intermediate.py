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
