import os
import math
import random
import pandas as pd
from datetime import datetime, timedelta

def generate_grid_points():
    grid_points = []
    # Center (0, 0)
    grid_points.append((0, 0, 0))
    # Ring 1: R=30mm, 4 points
    for angle in [0, 90, 180, 270]:
        rad = math.radians(angle)
        grid_points.append((30 * math.cos(rad), 30 * math.sin(rad), 30))
    # Ring 2: R=60mm, 8 points
    for angle in [0, 45, 90, 135, 180, 225, 270, 315]:
        rad = math.radians(angle)
        grid_points.append((60 * math.cos(rad), 60 * math.sin(rad), 60))
    # Ring 3: R=90mm, 12 points
    for angle in range(0, 360, 30):
        rad = math.radians(angle)
        grid_points.append((90 * math.cos(rad), 90 * math.sin(rad), 90))
    # Ring 4: R=120mm, 16 points
    for i in range(16):
        angle = i * 22.5
        rad = math.radians(angle)
        grid_points.append((120 * math.cos(rad), 120 * math.sin(rad), 120))
    # Ring 5: R=145mm, 8 points
    for angle in [0, 45, 90, 135, 180, 225, 270, 315]:
        rad = math.radians(angle)
        grid_points.append((145 * math.cos(rad), 145 * math.sin(rad), 145))
    return grid_points

def add_noise_and_dirty_data(df, seed):
    random.seed(seed)
    
    # 4% Missing Values (NaN)
    num_missing = int(len(df) * 0.04)
    missing_indices = random.sample(range(len(df)), num_missing)
    for idx in missing_indices:
        df.loc[idx, "thickness_value"] = None
        
    # 2% Extreme Outliers
    outlier_types = [-999.0, 999.9, 0.0, 250.3]
    num_outliers = int(len(df) * 0.02)
    available_indices = [i for i in range(len(df)) if i not in missing_indices]
    outlier_indices = random.sample(available_indices, num_outliers)
    for idx in outlier_indices:
        df.loc[idx, "thickness_value"] = random.choice(outlier_types)
        
    return df

def generate_dataset_1():
    # Dataset 1: CVD_M02 Anomaly, May 21st 12:00:00 to 23:59:59
    # Profile: Edge-High (Center: ~91nm, Edge: ~116nm)
    grid_points = generate_grid_points()
    random.seed(42)
    
    lots = []
    start_time = datetime(2026, 5, 20, 0, 0, 0)
    machines = ["CVD_M01", "CVD_M02", "CVD_M03"]
    
    for i in range(40):
        lot_id = f"LOT-{i+1:03d}"
        meas_time = start_time + timedelta(hours=i * 2)
        cvd_machine = machines[i % 3]
        lots.append((lot_id, cvd_machine, meas_time))
        
    anomaly_start = datetime(2026, 5, 21, 12, 0, 0)
    anomaly_end = datetime(2026, 5, 21, 23, 59, 59)
    
    data_rows = []
    for lot_id, machine, t_meas in lots:
        is_anomalous = (machine == "CVD_M02" and anomaly_start <= t_meas <= anomaly_end)
        t_str = t_meas.strftime("%Y-%m-%d %H:%M:%S")
        
        for x, y, r in grid_points:
            if is_anomalous:
                # Edge-High / Center-Thin
                if r == 0: base = 91.2
                elif r == 30: base = 92.8
                elif r == 60: base = 96.5
                elif r == 90: base = 102.2
                elif r == 120: base = 110.8
                else: base = 116.5
                thickness = base + random.normalvariate(0, 0.6)
            else:
                # Normal: slight bowl shape (~100nm)
                base = 100.5 - (r / 145.0) * 1.2
                thickness = base + random.normalvariate(0, 0.35)
                
            data_rows.append({
                "lot_id": lot_id,
                "cvd_machine": machine,
                "meas_time": t_str,
                "position_x": round(x, 2),
                "position_y": round(y, 2),
                "thickness_value": round(thickness, 2)
            })
            
    df = pd.DataFrame(data_rows)
    df = add_noise_and_dirty_data(df, 42)
    
    out_dir = "d:/python/2026_letuin/Letuin_AI_Lecture/project_01/public/data"
    os.makedirs(out_dir, exist_ok=True)
    df.to_csv(os.path.join(out_dir, "siox_thickness_data_1.csv"), index=False, na_rep="")
    # Also overwrite the default file to ensure backward compatibility
    df.to_csv(os.path.join(out_dir, "siox_thickness_data.csv"), index=False, na_rep="")
    print("Dataset 1 generated successfully!")

def generate_dataset_2():
    # Dataset 2: CVD_M03 Anomaly, May 22nd 06:00:00 to 18:00:00
    # Profile: Center-High / Dome (Center: ~118nm, Edge: ~92nm)
    grid_points = generate_grid_points()
    random.seed(100)
    
    lots = []
    start_time = datetime(2026, 5, 20, 0, 0, 0)
    # Different machine mapping order to represent an independent lot schedule
    machines = ["CVD_M01", "CVD_M02", "CVD_M03"]
    
    for i in range(40):
        lot_id = f"LOT-{i+1:03d}"
        meas_time = start_time + timedelta(hours=i * 2.5) # slightly different timing spacing (2.5 hours)
        cvd_machine = machines[(i + 1) % 3] # shifted machine modulo
        lots.append((lot_id, cvd_machine, meas_time))
        
    anomaly_start = datetime(2026, 5, 22, 6, 0, 0)
    anomaly_end = datetime(2026, 5, 22, 18, 0, 0)
    
    data_rows = []
    for lot_id, machine, t_meas in lots:
        is_anomalous = (machine == "CVD_M03" and anomaly_start <= t_meas <= anomaly_end)
        t_str = t_meas.strftime("%Y-%m-%d %H:%M:%S")
        
        for x, y, r in grid_points:
            if is_anomalous:
                # Center-High / Edge-Thin (Dome Shape) due to gas nozzle core hotspot
                if r == 0: base = 118.5
                elif r == 30: base = 116.8
                elif r == 60: base = 112.5
                elif r == 90: base = 105.8
                elif r == 120: base = 98.2
                else: base = 91.5
                thickness = base + random.normalvariate(0, 0.7)
            else:
                # Normal: slight bowl shape (~100nm) but slightly different center baseline
                base = 100.8 - (r / 145.0) * 1.5
                thickness = base + random.normalvariate(0, 0.32)
                
            data_rows.append({
                "lot_id": lot_id,
                "cvd_machine": machine,
                "meas_time": t_str,
                "position_x": round(x, 2),
                "position_y": round(y, 2),
                "thickness_value": round(thickness, 2)
            })
            
    df = pd.DataFrame(data_rows)
    df = add_noise_and_dirty_data(df, 100)
    
    out_dir = "d:/python/2026_letuin/Letuin_AI_Lecture/project_01/public/data"
    df.to_csv(os.path.join(out_dir, "siox_thickness_data_2.csv"), index=False, na_rep="")
    print("Dataset 2 generated successfully!")

if __name__ == "__main__":
    generate_dataset_1()
    generate_dataset_2()
