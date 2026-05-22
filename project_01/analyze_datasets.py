import os
import pandas as pd
import numpy as np

def clean_and_analyze(file_path):
    print("=" * 60)
    print(f"Analyzing File: {os.path.basename(file_path)}")
    print("=" * 60)
    
    # Load dataset
    df = pd.read_csv(file_path)
    print(f"Total Rows: {len(df)}")
    print(f"Unique Lots: {df['lot_id'].nunique()}")
    print(f"Unique Machines: {df['cvd_machine'].unique()}")
    
    # 1. Identify Missing Values (NaN)
    nan_count = df['thickness_value'].isna().sum()
    print(f"\n[Data Cleaning] NaNs found: {nan_count} ({nan_count / len(df) * 100:.2f}%)")
    
    # 2. Identify Outliers
    # Normal thickness should be around 100nm. We know the noise is added, and extreme values are: -999.0, 999.9, 0.0, 250.3
    # Let's count them
    outliers = df[
        (df['thickness_value'] < 50) | 
        (df['thickness_value'] > 180) | 
        (df['thickness_value'].isna())
    ]
    print(f"[Data Cleaning] Outliers or NaNs found: {len(outliers)} ({len(outliers) / len(df) * 100:.2f}%)")
    
    # Clean data (drop NaNs and extreme values to calculate true uniformity)
    clean_df = df[
        (df['thickness_value'] >= 50) & 
        (df['thickness_value'] <= 180) & 
        (df['thickness_value'].notna())
    ].copy()
    print(f"Cleaned Rows: {len(clean_df)}")
    
    # 3. Calculate Lot-level Uniformity
    # Uniformity formula: (Max - Min) / (2 * Mean) * 100
    # Higher uniformity means worse quality (less uniform)
    lot_stats = clean_df.groupby(['lot_id', 'cvd_machine', 'meas_time']).agg(
        min_thick=('thickness_value', 'min'),
        max_thick=('thickness_value', 'max'),
        mean_thick=('thickness_value', 'mean')
    ).reset_index()
    
    lot_stats['uniformity'] = (lot_stats['max_thick'] - lot_stats['min_thick']) / (2 * lot_stats['mean_thick']) * 100
    
    # Sort lots by uniformity to find the worst (most non-uniform) wafers
    worst_lots = lot_stats.sort_values(by='uniformity', ascending=False).head(5)
    print("\n[Worst 5 Lots based on Non-Uniformity (Higher % is worse)]")
    for idx, row in worst_lots.iterrows():
        print(f"Lot: {row['lot_id']} | Machine: {row['cvd_machine']} | Time: {row['meas_time']} | Uniformity: {row['uniformity']:.2f}% | Range: {row['min_thick']:.1f}nm - {row['max_thick']:.1f}nm (Mean: {row['mean_thick']:.1f}nm)")
        
    # 4. Deep-dive into the worst lot's spatial profile
    worst_lot_id = worst_lots.iloc[0]['lot_id']
    worst_machine = worst_lots.iloc[0]['cvd_machine']
    worst_time = worst_lots.iloc[0]['meas_time']
    
    print(f"\n[Spatial Profile Deep-Dive for Worst Lot: {worst_lot_id} ({worst_machine} @ {worst_time})]")
    worst_lot_df = clean_df[clean_df['lot_id'] == worst_lot_id].copy()
    
    # Compute average thickness by radius (R)
    # R is distance from center (0, 0)
    worst_lot_df['radius'] = np.sqrt(worst_lot_df['position_x']**2 + worst_lot_df['position_y']**2)
    # Bin by approximate radius ring
    worst_lot_df['ring'] = worst_lot_df['radius'].round(0)
    ring_profile = worst_lot_df.groupby('ring')['thickness_value'].mean().reset_index()
    print("Radial Profile (Thickness vs Distance from Center):")
    for idx, row in ring_profile.iterrows():
        print(f"  Radius ~{row['ring']:3.0f}mm: {row['thickness_value']:.2f}nm")
        
    # Compare with a normal lot from a normal machine
    normal_lot = lot_stats[lot_stats['uniformity'] < 1.5].iloc[0]
    normal_lot_df = clean_df[clean_df['lot_id'] == normal_lot['lot_id']].copy()
    normal_lot_df['radius'] = np.sqrt(normal_lot_df['position_x']**2 + normal_lot_df['position_y']**2)
    normal_lot_df['ring'] = normal_lot_df['radius'].round(0)
    normal_ring_profile = normal_lot_df.groupby('ring')['thickness_value'].mean().reset_index()
    print(f"\n[Spatial Profile for Normal Lot: {normal_lot['lot_id']} ({normal_lot['cvd_machine']} @ {normal_lot['meas_time']})]")
    for idx, row in normal_ring_profile.iterrows():
        print(f"  Radius ~{row['ring']:3.0f}mm: {row['thickness_value']:.2f}nm")

if __name__ == "__main__":
    clean_and_analyze("d:/python/2026_letuin/Letuin_AI_Lecture/project_01/public/data/siox_thickness_data_1.csv")
    clean_and_analyze("d:/python/2026_letuin/Letuin_AI_Lecture/project_01/public/data/siox_thickness_data_2.csv")
