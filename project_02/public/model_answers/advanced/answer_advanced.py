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
