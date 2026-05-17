# Smart Manufacturing Process Data Analyzer

A professional-grade Streamlit application for advanced manufacturing process data analysis with statistical process control (SPC) features.

## Features

### Tab 1: Overview (📊 개요)
- **Basic Statistics**: Min, max, mean, median, quartiles, standard deviation, variance
- **Histogram**: Distribution visualization with 30 bins
- **Box Plot**: Distribution with outlier markers and statistical indicators
- **Correlation Heatmap**: Multi-column correlation matrix visualization

### Tab 2: Anomaly Detection (🔍 이상 감지)
- **IQR-based Outlier Detection**: Uses Interquartile Range (1.5 × IQR rule)
- **Z-Score-based Outlier Detection**: Identifies points beyond 3σ threshold
- **Comparative Scatter Plots**: Side-by-side visualization of both methods
- **Outlier Summary Table**: Comparison of detection methods with counts and value ranges
- **Expandable Details**: View full outlier data for each method

### Tab 3: SPC Control Charts (📈 SPC 관리도)
- **X-bar Control Chart**: 
  - Configurable subgroup size (2-n)
  - UCL/CL/LCL calculation using standard A2 constants
  - Out-of-control point highlighting
- **R (Range) Control Chart**:
  - D3/D4 constant-based limits
  - Range variation monitoring
- **Control Limit Analysis**: Detailed summary of process control status

### Tab 4: Report Generation (📋 리포트)
- **Auto-generated Markdown Report** with:
  - Analysis overview and metadata
  - Complete statistical summary table
  - Outlier analysis results
  - SPC control chart interpretation
  - Key findings and recommendations
- **Download Options**:
  - Markdown format (.md)
  - Text format (.txt)
  - Timestamped filenames

### Sidebar Configuration
- **CSV File Upload**: Load manufacturing process data
- **Column Selector**: Choose numerical column to analyze
- **Value Range Filter**: Interactive slider for data range filtering
- **Date Range Filter**: Optional date-based filtering

## Chart Types (5+ Plotly visualizations)

1. **Histogram** - Distribution analysis
2. **Box Plot** - Outlier visualization with mean/std
3. **Correlation Heatmap** - Multi-variable relationships
4. **Scatter Plot (IQR)** - Outlier detection with bounds
5. **Scatter Plot (Z-Score)** - Alternative outlier method
6. **X-bar Control Chart** - Subgroup means with control limits
7. **R Control Chart** - Range control monitoring

## Installation

```bash
pip install -r requirements.txt
```

## Usage

```bash
streamlit run app.py
```

Then:
1. Upload a CSV file with numerical process data
2. Select a column to analyze
3. Apply optional filters (value range, date range)
4. Explore insights across the four tabs
5. Download the auto-generated report

## CSV Format

Expected format:
- Comma-separated values
- First row contains column headers
- Numerical columns for analysis
- Optional datetime column for date filtering

Example:
```
timestamp,temperature,pressure,vibration,quality_score
2026-01-01 08:00:00,73.2,101.5,0.45,98.5
2026-01-01 08:15:00,73.5,101.6,0.42,98.7
```

## Configuration

- **Page Layout**: Wide layout for better chart visibility
- **Color Scheme**: Professional color palette with primary, secondary, success, danger, warning, info colors
- **UI Language**: All interface text in Korean (한국어)
- **Theme**: Light background with professional styling

## Statistical Methods

### Outlier Detection
- **IQR Method**: Lower bound = Q1 - 1.5×IQR, Upper bound = Q3 + 1.5×IQR
- **Z-Score Method**: Points with |z| > 3 are considered outliers

### Control Charts
- **X-bar Chart**: Monitors process mean with A2 constants (subgroup size 2-6)
- **R Chart**: Monitors process variation with D3/D4 constants
- **Control Limits**: Based on subgroup statistics and standard SPC constants

## Dependencies

- streamlit: Web application framework
- pandas: Data manipulation and analysis
- plotly: Interactive visualization
- numpy: Numerical computing
- scipy: Statistical functions

## License

Educational use for Letuin KDC AI Lecture Project 1

## Author

Created for advanced manufacturing data analysis training
