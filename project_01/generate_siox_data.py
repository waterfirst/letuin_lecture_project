import os
import math
import random
import pandas as pd
from datetime import datetime, timedelta

def generate_data():
    # Set random seed for reproducibility
    random.seed(42)
    
    # 1. wafer points grid generation (ellipsometer 49-point grid)
    # R=150mm wafer (standard 300mm wafer)
    grid_points = []
    
    # Center (0, 0)
    grid_points.append((0, 0, 0)) # x, y, radius
    
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
    for angle in range(0, 360, 225): # step 22.5
        # 360 / 16 = 22.5
        pass
    
    # Let's do step 22.5 exactly:
    for i in range(16):
        angle = i * 22.5
        rad = math.radians(angle)
        grid_points.append((120 * math.cos(rad), 120 * math.sin(rad), 120))
        
    # Ring 5: R=145mm (wafer edge), 8 points
    for angle in [0, 45, 90, 135, 180, 225, 270, 315]:
        rad = math.radians(angle)
        grid_points.append((145 * math.cos(rad), 145 * math.sin(rad), 145))
        
    # Let's count total points:
    # Center: 1
    # R30: 4
    # R60: 8
    # R90: 12
    # R120: 16
    # R145: 8
    # Total = 1 + 4 + 8 + 12 + 16 + 8 = 49 points. Perfect!
    
    # 2. Generate Lots and Timestamps
    # 40 lots, processed on 3 CVD machines: CVD_M01, CVD_M02, CVD_M03
    lots = []
    num_lots = 40
    start_time = datetime(2026, 5, 20, 0, 0, 0)
    
    machines = ["CVD_M01", "CVD_M02", "CVD_M03"]
    
    for i in range(num_lots):
        lot_id = f"LOT-{i+1:03d}"
        meas_time = start_time + timedelta(hours=i * 2) # process 1 lot every 2 hours
        
        # systematic assignment of machine
        # Lot 1 (index 0) on M01, Lot 2 (index 1) on M02, Lot 3 (index 2) on M03, etc.
        cvd_machine = machines[i % 3]
        lots.append((lot_id, cvd_machine, meas_time))
        
    # 3. Thickness Generation Logic
    # Nominal thickness: 100.0 nm (SiOx film)
    # Normal profile: very slight bowl shape (center: 100.5nm, edge: 99.3nm)
    # Anomaly window: 2026-05-21 12:00:00 to 2026-05-21 23:59:59 (Lots 18 to 24 approximately)
    # Anomaly affects ONLY CVD_M02 in this window!
    
    anomaly_start = datetime(2026, 5, 21, 12, 0, 0)
    anomaly_end = datetime(2026, 5, 21, 23, 59, 59)
    
    data_rows = []
    
    for lot_id, machine, t_meas in lots:
        # Determine if this lot has anomalous behavior
        is_anomalous = False
        if machine == "CVD_M02" and anomaly_start <= t_meas <= anomaly_end:
            is_anomalous = True
            
        t_str = t_meas.strftime("%Y-%m-%d %H:%M:%S")
        
        for x, y, r in grid_points:
            # Generate nominal base thickness
            if is_anomalous:
                # Anomaly: severe center-edge delta (edge-high)
                # Center: ~92nm, Edge: ~116nm
                # Center-to-Edge delta ~ 24nm
                if r == 0:
                    base = 91.2
                elif r == 30:
                    base = 92.8
                elif r == 60:
                    base = 96.5
                elif r == 90:
                    base = 102.2
                elif r == 120:
                    base = 110.8
                else: # r == 145 (Wafer Edge)
                    base = 116.5
                
                # Add noise
                thickness = base + random.normalvariate(0, 0.6)
            else:
                # Normal wafer thickness profile: slight bowl/dome shape
                # Nominal is 100.0, center is slightly thicker (100.4), edge is slightly thinner (99.2)
                base = 100.5 - (r / 145.0) * 1.2
                thickness = base + random.normalvariate(0, 0.35)
                
            data_rows.append({
                "lot_id": lot_id,
                "cvd_machine": machine,
                "meas_time": t_str,
                "position_x": round(x, 2),
                "position_y": round(y, 2),
                "thickness_value": round(thickness, 2),
                "radius": r # we will drop this or keep it? We keep it temporarily for mapping, but let's drop it to match requirements.
            })
            
    df = pd.DataFrame(data_rows)
    
    # 4. Introduce Missing Values (NaN)
    # Roughly 4% missing values on thickness_value
    num_missing = int(len(df) * 0.04)
    missing_indices = random.sample(range(len(df)), num_missing)
    for idx in missing_indices:
        df.loc[idx, "thickness_value"] = None
        
    # 5. Introduce Outliers (Extreme values / errors)
    # Roughly 2% outliers
    # We choose specific types of errors:
    # Type A: -999.0 (Ellipsometer calibration / optical sensor fail)
    # Type B: 999.9 (Saturation / light overflow error)
    # Type C: 0.0 (Laser reflection focus failure)
    # Type D: 250.3 (Massive thickness spike / double film layer glitch)
    outlier_types = [-999.0, 999.9, 0.0, 250.3]
    
    num_outliers = int(len(df) * 0.02)
    # Make sure we don't pick already missing indices
    available_indices = [i for i in range(len(df)) if i not in missing_indices]
    outlier_indices = random.sample(available_indices, num_outliers)
    
    for idx in outlier_indices:
        outlier_val = random.choice(outlier_types)
        df.loc[idx, "thickness_value"] = outlier_val
        
    # Drop radius before saving to match exact columns requested:
    # lot_id, cvd_machine, meas_time, position_x, position_y, thickness_value
    df = df.drop(columns=["radius"])
    
    # Create directory if it doesn't exist
    os.makedirs("d:/python/2026_letuin/Letuin_AI_Lecture/project_01/public/data", exist_ok=True)
    
    output_path = "d:/python/2026_letuin/Letuin_AI_Lecture/project_01/public/data/siox_thickness_data.csv"
    df.to_csv(output_path, index=False, na_rep="")
    print(f"Dataset generated successfully at {output_path}!")
    print(f"Total Rows: {len(df)}")
    print(f"Missing Values added: {num_missing}")
    print(f"Outliers added: {num_outliers}")
    
    # Let's count how many anomalous lots we generated
    anom_df = df[df['cvd_machine'] == 'CVD_M02']
    print(f"CVD_M02 Total Rows: {len(anom_df)}")

if __name__ == "__main__":
    generate_data()
