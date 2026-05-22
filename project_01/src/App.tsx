import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Code,
  Copy,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Sparkles,
  Terminal,
  Wrench,
  Zap,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Sliders,
  Download,
  Info,
  HelpCircle,
  Trophy,
  BookOpen,
  Award,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const assetUrl = (filename: string) => `${import.meta.env.BASE_URL}${filename}`;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface RawRecord {
  lot_id: string;
  cvd_machine: string;
  meas_time: string;
  position_x: number;
  position_y: number;
  thickness_value: number | null;
  is_outlier: boolean;
  outlier_type?: string;
  original_value?: number;
}

interface CleanedRecord {
  lot_id: string;
  cvd_machine: string;
  meas_time: string;
  position_x: number;
  position_y: number;
  thickness_value: number | null;
  is_outlier: boolean;
  outlier_type?: string;
  original_value?: number;
  status: 'normal' | 'missing' | 'outlier' | 'cleaned';
}

interface WaferStats {
  mean: number;
  min: number;
  max: number;
  stdDev: number;
  uniformity: number;
}

// ============================================================================
// 49-POINT ELLIPSOMETER GRID METADATA
// ============================================================================
const getPointRadius = (x: number, y: number): number => {
  const r = Math.sqrt(x * x + y * y);
  // Match standard concentric rings generated in generate_siox_data.py
  if (r < 5) return 0;
  if (r < 35) return 30;
  if (r < 65) return 60;
  if (r < 95) return 90;
  if (r < 125) return 120;
  return 145;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
function App() {
  // Tab states: 'dashboard' | 'guidelines' | 'hints'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'guidelines' | 'hints'>('dashboard');

  // Data Loading & State Management
  const [rawData, setRawData] = useState<RawRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Cleaning Configuration
  const [outlierStrategy, setOutlierStrategy] = useState<'keep' | 'filter' | 'impute'>('impute');
  const [nanStrategy, setNanStrategy] = useState<'keep' | 'interpolate'>('interpolate');
  const [activeLotId, setActiveLotId] = useState<string>('LOT-001');
  const [activeMachineFilter, setActiveMachineFilter] = useState<string>('ALL');

  // Copy states for prompts
  const [copiedTextIdx, setCopiedTextIdx] = useState<number | null>(null);

  // Interactive Quiz States
  const [quizAnswers, setQuizAnswers] = useState({ q1: '', q2: '', q3: '', q4: '' });
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<string>('');

  // Tooltip State for Wafer Map Hover
  const [hoveredPoint, setHoveredPoint] = useState<CleanedRecord | null>(null);

  // ============================================================================
  // LOAD & PARSE DATASET
  // ============================================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const csvPath = assetUrl('data/siox_thickness_data.csv');
        const response = await fetch(csvPath);
        if (!response.ok) {
          throw new Error(`CSV 파일을 찾을 수 없습니다. (HTTP ${response.status})`);
        }
        const text = await response.text();
        
        // Parse CSV text
        const lines = text.split('\n');
        if (lines.length < 2) {
          throw new Error('CSV 파일에 데이터가 비어 있습니다.');
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const parsedRecords: RawRecord[] = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Simple CSV splitter
          const cols = line.split(',').map(c => c.trim().replace(/"/g, ''));
          if (cols.length < headers.length) continue;

          const rowObj: any = {};
          headers.forEach((header, idx) => {
            rowObj[header] = cols[idx];
          });

          const x = parseFloat(rowObj.position_x);
          const y = parseFloat(rowObj.position_y);
          const valStr = rowObj.thickness_value;

          let originalValue: number | null = null;
          let isMissing = false;
          let isOutlier = false;
          let outlierType = '';

          if (valStr === '' || valStr === undefined || valStr === null) {
            isMissing = true;
          } else {
            const val = parseFloat(valStr);
            if (isNaN(val)) {
              isMissing = true;
            } else {
              originalValue = val;
              // Outlier criteria aligned with siox_thickness_data.csv:
              // Types: -999.0, 999.9, 0.0, 250.3
              if (val === -999.0) {
                isOutlier = true;
                outlierType = 'Sensor Calibration Failure (-999.0 nm)';
              } else if (val === 999.9) {
                isOutlier = true;
                outlierType = 'Light Intensity Saturation (999.9 nm)';
              } else if (val === 0.0) {
                isOutlier = true;
                outlierType = 'Laser Focus Failure (0.0 nm)';
              } else if (val === 250.3) {
                isOutlier = true;
                outlierType = 'Double Layer Thickness Glitch (250.3 nm)';
              }
            }
          }

          parsedRecords.push({
            lot_id: rowObj.lot_id,
            cvd_machine: rowObj.cvd_machine,
            meas_time: rowObj.meas_time,
            position_x: x,
            position_y: y,
            thickness_value: originalValue,
            is_outlier: isOutlier,
            outlier_type: outlierType,
            original_value: originalValue !== null ? originalValue : undefined
          });
        }

        setRawData(parsedRecords);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching CSV:', err);
        setError(err.message || '데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ============================================================================
  // GET LOT METADATA & CLEANED RECORD ARRAYS
  // ============================================================================
  const lotsMetadata = Array.from(
    new Set(rawData.map(r => JSON.stringify({ lot_id: r.lot_id, cvd_machine: r.cvd_machine, meas_time: r.meas_time })))
  ).map(str => JSON.parse(str)) as { lot_id: string; cvd_machine: string; meas_time: string }[];

  const activeLotMeta = lotsMetadata.find(m => m.lot_id === activeLotId) || {
    lot_id: '',
    cvd_machine: '',
    meas_time: ''
  };

  // Filter lots based on CVD machine selector
  const filteredLotsMetadata = lotsMetadata.filter(
    m => activeMachineFilter === 'ALL' || m.cvd_machine === activeMachineFilter
  );

  // Compute cleaned records for all points on the active wafer
  const getCleanedWaferRecords = (lotId: string): CleanedRecord[] => {
    const lotRecords = rawData.filter(r => r.lot_id === lotId);
    
    // Step 1: Outlier treatment
    let processed: CleanedRecord[] = lotRecords.map(r => {
      let val = r.thickness_value;
      let status: 'normal' | 'missing' | 'outlier' | 'cleaned' = 'normal';

      if (r.thickness_value === null) {
        status = 'missing';
      } else if (r.is_outlier) {
        status = 'outlier';
        if (outlierStrategy === 'filter') {
          val = null;
        } else if (outlierStrategy === 'impute') {
          // Impute using machine-specific nominal median (~100.0 nm)
          val = 100.0;
          status = 'cleaned';
        }
      }

      return {
        ...r,
        thickness_value: val,
        status
      };
    });

    // Step 2: Missing value (NaN) interpolation
    // Calculate mean of clean/normal points on this specific wafer to serve as the interpolator baseline
    const cleanVals = processed
      .filter(r => r.thickness_value !== null && !r.is_outlier)
      .map(r => r.thickness_value as number);

    const waferMean = cleanVals.length > 0 
      ? cleanVals.reduce((sum, v) => sum + v, 0) / cleanVals.length 
      : 100.0;

    if (nanStrategy === 'interpolate') {
      processed = processed.map(r => {
        if (r.thickness_value === null) {
          return {
            ...r,
            thickness_value: parseFloat(waferMean.toFixed(2)),
            status: 'cleaned'
          };
        }
        return r;
      });
    }

    return processed;
  };

  const activeWaferRecords = getCleanedWaferRecords(activeLotId);

  // ============================================================================
  // STATISTICAL FORMULAS
  // ============================================================================
  const calculateWaferStats = (records: CleanedRecord[]): WaferStats => {
    const vals = records
      .map(r => r.thickness_value)
      .filter((v): v is number => v !== null);

    if (vals.length === 0) {
      return { mean: 0, min: 0, max: 0, stdDev: 0, uniformity: 0 };
    }

    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const sum = vals.reduce((s, v) => s + v, 0);
    const mean = sum / vals.length;

    // Standard Deviation
    const sqDiffs = vals.map(v => Math.pow(v - mean, 2));
    const avgSqDiff = sqDiffs.reduce((s, v) => s + v, 0) / vals.length;
    const stdDev = Math.sqrt(avgSqDiff);

    // Uniformity = (Max - Min) / (2 * Mean) * 100
    const uniformity = mean > 0 ? ((max - min) / (2 * mean)) * 100 : 0;

    return {
      mean: parseFloat(mean.toFixed(2)),
      min: parseFloat(min.toFixed(2)),
      max: parseFloat(max.toFixed(2)),
      stdDev: parseFloat(stdDev.toFixed(2)),
      uniformity: parseFloat(uniformity.toFixed(2))
    };
  };

  const activeWaferStats = calculateWaferStats(activeWaferRecords);

  // Calculate stats for all lots (to plot timeline)
  const allWaferTimelineStats = lotsMetadata.map(m => {
    const waferRecs = getCleanedWaferRecords(m.lot_id);
    const stats = calculateWaferStats(waferRecs);
    return {
      lot_id: m.lot_id,
      cvd_machine: m.cvd_machine,
      meas_time: m.meas_time,
      mean: stats.mean,
      uniformity: stats.uniformity
    };
  });

  // ============================================================================
  // DYNAMIC HSL COLOR INTERPOLATOR
  // ============================================================================
  const getThicknessColor = (val: number | null, isOutlier: boolean, status: string) => {
    if (val === null) return '#4b5563'; // gray for missing
    if (isOutlier && status === 'outlier') {
      return '#ec4899'; // bright magenta for raw outliers
    }

    // Color ramp capped between 90.0nm and 116.0nm
    const minT = 90.0;
    const maxT = 116.0;

    if (val <= 100.0) {
      // Blue (too thin) to Green (nominal)
      // 90nm -> Blue: hsl(220, 85%, 45%)
      // 100nm -> Green: hsl(140, 75%, 45%)
      const pct = Math.max(0, (val - minT) / (100.0 - minT));
      const hue = 225 - pct * 85; 
      const sat = 85 - pct * 10;  
      return `hsl(${hue}, ${sat}%, 45%)`;
    } else {
      // Green (nominal) to Red/Coral (too thick)
      // 100nm -> Green: hsl(140, 75%, 45%)
      // 116nm -> Red: hsl(0, 90%, 50%)
      const pct = Math.min(1, (val - 100.0) / (maxT - 100.0));
      const hue = 140 - pct * 140; 
      const sat = 75 + pct * 15;  
      const light = 45 + pct * 5;  
      return `hsl(${hue}, ${sat}%, ${light}%)`;
    }
  };

  // ============================================================================
  // QUIZ ENGINE VALIDATION
  // ============================================================================
  const checkQuizAnswers = () => {
    let score = 0;
    let feedback = '';

    if (quizAnswers.q1 === 'CVD_M02') score += 25;
    if (quizAnswers.q2 === 'may21_pm') score += 25;
    if (quizAnswers.q3 === 'edge_high') score += 25;
    if (quizAnswers.q4 && quizAnswers.q4.trim().length >= 10) score += 25;

    if (score === 100) {
      feedback = '🎉 완벽합니다! CVD_M02 공정의 이상 거동 시간대(5월 21일 오후~밤) 및 Wafer Edge-High 물리적 특징을 정확히 진단하였으며, 데이터 정제(Cleaning)의 필요성을 완벽히 서술하였습니다. 최고의 반도체 공정 엔지니어 자격을 부여합니다!';
    } else if (score >= 75) {
      feedback = '👍 아주 훌륭한 분석입니다! 대부분의 물리적 징후와 원인 설비를 짚어냈습니다. 주관식 답변에서 정제 전후의 통계 왜곡(Outlier 제거 효과)을 조금 더 구체적으로 서술해보세요.';
    } else {
      feedback = '🧐 분석 결과에 오류가 있습니다. 대시보드의 CVD 설비 매칭 트렌드 차트에서 비정상적으로 Uniformity가 치솟은 설비와 시간대를 관찰하고, Wafer Map의 Radius별 두께 구배를 다시 점검해 보세요.';
    }

    setQuizScore(score);
    setQuizFeedback(feedback);
    setQuizSubmitted(true);
  };

  const handleCopyPrompt = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTextIdx(idx);
    setTimeout(() => setCopiedTextIdx(null), 2000);
  };

  // Anomaly Window definition
  const isWithinAnomalyWindow = (timeStr: string): boolean => {
    const t = new Date(timeStr);
    const start = new Date('2026-05-21T12:00:00');
    const end = new Date('2026-05-21T23:59:59');
    return t >= start && t <= end;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 0%, #1e1b4b, #09090b 70%)',
      color: '#ffffff',
      padding: '2.5rem 1.5rem',
      fontFamily: '"Outfit", "Inter", -apple-system, sans-serif',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* ============================================================================
            HEADER & HUB PROFILE
           ============================================================================ */}
        <header style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '3.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '2.5rem'
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
            padding: '0.4rem 1.2rem',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            boxShadow: '0 4px 20px rgba(6, 182, 212, 0.25)'
          }}>
            Semiconductor Manufacturing R&D
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(to right, #ffffff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            CVD SiOx Thin-Film Thickness Analysis & Project 1 Lab
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#94a3b8', maxWidth: '780px', lineHeight: 1.6 }}>
            Lot별 박막 두께 엘립소메터 데이터를 활용한 Wafer Map 시각화, 결측치/이상치 정제 및
            이상 공정 설비 역추적 진단 실습.
          </p>

          {/* Tab Selection Navigation */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.4rem',
            borderRadius: '16px',
            marginTop: '2.5rem',
            gap: '0.25rem',
            backdropFilter: 'blur(10px)'
          }}>
            {[
              { id: 'dashboard', label: '📊 실시간 Wafer Map 실습실', icon: TrendingUp },
              { id: 'guidelines', label: '📝 프로젝트 1 과제 가이드', icon: FileText },
              { id: 'hints', label: '💡 난이도별 에러 해결 힌트', icon: Sparkles }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: isActive ? 'linear-gradient(135deg, #0ea5e9, #8b5cf6)' : 'transparent',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.75rem 1.4rem',
                    fontWeight: 700,
                    fontSize: '0.98rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isActive ? '0 4px 15px rgba(14, 165, 233, 0.3)' : 'none'
                  }}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* ERROR / LOADING NOTIFICATION */}
        {loading && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5rem 0'
          }}>
            <RefreshCw className="animate-spin" size={48} color="#06b6d4" style={{ marginBottom: '1rem' }} />
            <p style={{ color: '#94a3b8', fontWeight: 600 }}>CVD SiOx 박막 두께 데이터셋 로딩 중...</p>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '20px',
            padding: '2rem',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>데이터 로드 실패</h3>
            <p style={{ color: '#f87171' }}>{error}</p>
          </div>
        )}

        {/* ============================================================================
            TAB 1: DYNAMIC REF DASHBOARD (실시간 반도체 Wafer Map 실습 대시보드)
           ============================================================================ */}
        {!loading && !error && activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gap: '2.5rem' }}>
            
            {/* Top Stat Overview Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'rgba(6, 182, 212, 0.1)',
                  borderRadius: '12px',
                  padding: '0.8rem',
                  color: '#06b6d4'
                }}>
                  <Globe size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>총 측정 레코드 개수</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>1,960 <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Points</span></div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '12px',
                  padding: '0.8rem',
                  color: '#8b5cf6'
                }}>
                  <Wrench size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>총 적재 설비 수</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>3 CVD <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Units</span></div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '12px',
                  padding: '0.8rem',
                  color: '#f87171'
                }}>
                  <AlertCircle size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>결측치 (NaN) 비율</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ef4444' }}>4.0% <span style={{ fontSize: '0.9rem', color: '#64748b' }}>(78개)</span></div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'rgba(234, 179, 8, 0.1)',
                  borderRadius: '12px',
                  padding: '0.8rem',
                  color: '#eab308'
                }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>이상치 (Outliers) 비율</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#eab308' }}>2.0% <span style={{ fontSize: '0.9rem', color: '#64748b' }}>(39개)</span></div>
                </div>
              </div>
            </div>

            {/* Interactive Timeline matching chart */}
            <div style={{
              background: 'rgba(23, 23, 33, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '2rem',
              backdropFilter: 'blur(16px)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={22} color="#06b6d4" />
                    CVD 설비 트렌드 매칭 & Uniformity (%) 추이
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    40개 LOT의 Uniformity 트렌드입니다. <strong>May 21st 오후 (LOT-019 ~ LOT-024)</strong> 시간대를 관찰해 보세요. 
                    설비를 클릭하거나 타임라인 포인트를 클릭하여 Wafer Map을 로드할 수 있습니다.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['ALL', 'CVD_M01', 'CVD_M02', 'CVD_M03'].map(m => (
                    <button
                      key={m}
                      onClick={() => setActiveMachineFilter(m)}
                      style={{
                        background: activeMachineFilter === m ? '#3b82f6' : 'rgba(255,255,255,0.06)',
                        border: activeMachineFilter === m ? '1px solid #60a5fa' : '1px solid rgba(255,255,255,0.08)',
                        color: activeMachineFilter === m ? '#ffffff' : '#94a3b8',
                        padding: '0.45rem 0.9rem',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline custom SVG chart */}
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <svg viewBox="0 0 1000 200" style={{ width: '100%', height: 'auto', background: '#111216', borderRadius: '16px', padding: '1rem' }}>
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="980" y2="20" stroke="#27272a" strokeDasharray="3" />
                  <line x1="50" y1="80" x2="980" y2="80" stroke="#27272a" strokeDasharray="3" />
                  <line x1="50" y1="140" x2="980" y2="140" stroke="#27272a" strokeDasharray="3" />
                  <line x1="50" y1="170" x2="980" y2="170" stroke="#4b5563" />

                  {/* Labels */}
                  <text x="15" y="25" fill="#64748b" fontSize="10" fontWeight="bold">15%</text>
                  <text x="15" y="85" fill="#64748b" fontSize="10" fontWeight="bold">10%</text>
                  <text x="15" y="145" fill="#64748b" fontSize="10" fontWeight="bold">5%</text>
                  <text x="15" y="175" fill="#64748b" fontSize="10" fontWeight="bold">0%</text>

                  {/* Anomaly Window Shading */}
                  {/* May 21st 12:00 to 23:59 corresponds roughly to indices 18 to 24 */}
                  {/* X coordinates range: index 0 -> 70, index 39 -> 960 (step: (960-70)/39 = 22.8) */}
                  <rect x={70 + 17 * 22.8} y="10" width={7 * 22.8} height="160" fill="rgba(239, 68, 68, 0.08)" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1" strokeDasharray="4 2" />
                  <text x={70 + 18.5 * 22.8} y="15" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">이상 징후 공정 윈도우 (5/21 12:00~)</text>

                  {/* Draw Trend Lines */}
                  {allWaferTimelineStats.map((item, idx) => {
                    if (idx === 0) return null;
                    const prev = allWaferTimelineStats[idx - 1];

                    // X coords
                    const x1 = 70 + (idx - 1) * 22.8;
                    const x2 = 70 + idx * 22.8;

                    // Y coords (Map uniformity 0-15% to 170-20)
                    // If outlier strategy is 'keep', uniformity spikes up to 500%.
                    // To prevent scaling explosion on chart, cap rendered Y value at 18%.
                    const capValue = (val: number) => Math.min(18, val);
                    const y1 = 170 - (capValue(prev.uniformity) / 15) * 150;
                    const y2 = 170 - (capValue(item.uniformity) / 15) * 150;

                    const isHighlighted = activeMachineFilter === 'ALL' || item.cvd_machine === activeMachineFilter;
                    const color = item.cvd_machine === 'CVD_M01' ? '#a855f7' : item.cvd_machine === 'CVD_M02' ? '#f97316' : '#3b82f6';

                    return (
                      <line
                        key={`line-${idx}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isHighlighted ? color : '#334155'}
                        strokeWidth={activeLotId === item.lot_id || activeLotId === prev.lot_id ? 3 : 1.5}
                        opacity={isHighlighted ? 0.8 : 0.15}
                      />
                    );
                  })}

                  {/* Draw Nodes */}
                  {allWaferTimelineStats.map((item, idx) => {
                    const x = 70 + idx * 22.8;
                    const stats = allWaferTimelineStats[idx];
                    const capValue = (val: number) => Math.min(18, val);
                    const y = 170 - (capValue(stats.uniformity) / 15) * 150;

                    const isSelected = activeLotId === item.lot_id;
                    const isHighlighted = activeMachineFilter === 'ALL' || item.cvd_machine === activeMachineFilter;
                    
                    let strokeColor = '#ffffff';
                    let fillColor = item.cvd_machine === 'CVD_M01' ? '#a855f7' : item.cvd_machine === 'CVD_M02' ? '#f97316' : '#3b82f6';
                    if (isWithinAnomalyWindow(item.meas_time) && item.cvd_machine === 'CVD_M02') {
                      // Mark the actual failure nodes explicitly in red core
                      strokeColor = '#ef4444';
                    }

                    return (
                      <g key={`node-${idx}`} cursor="pointer" onClick={() => setActiveLotId(item.lot_id)}>
                        {isSelected && (
                          <circle cx={x} cy={y} r="10" fill="transparent" stroke="#38bdf8" strokeWidth="2" className="animate-ping" style={{ transformOrigin: `${x}px ${y}px` }} />
                        )}
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? 6 : 4}
                          fill={isHighlighted ? fillColor : '#475569'}
                          stroke={isSelected ? '#ffffff' : strokeColor}
                          strokeWidth={isSelected ? 2 : 1}
                          opacity={isHighlighted ? 1 : 0.2}
                        />
                        {/* Lot ID index indicators every 5 lots */}
                        {idx % 5 === 0 && (
                          <text x={x} y="190" fill="#64748b" fontSize="8" textAnchor="middle" fontWeight="bold">
                            {item.lot_id.replace('LOT-', 'L')}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Timeline Legend */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                marginTop: '1rem',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a855f7' }}></span>
                  <span style={{ color: '#94a3b8' }}>CVD_M01 (Normal)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f97316' }}></span>
                  <span style={{ color: '#94a3b8' }}>CVD_M02 (Anomalous May 21st)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }}></span>
                  <span style={{ color: '#94a3b8' }}>CVD_M03 (Normal)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <span style={{ width: '12px', height: '12px', border: '1px dashed #ef4444', background: 'rgba(239, 68, 68, 0.1)', display: 'inline-block' }}></span>
                  <span style={{ color: '#f87171', fontWeight: 600 }}>이상 발생 기간 윈도우</span>
                </div>
              </div>
            </div>

            {/* 2-Column Wafer map & configuration layout */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
              gap: '2.5rem'
            }}>
              
              {/* LEFT COLUMN: 2D SVG Wafer map & Hover details */}
              <div style={{
                background: 'rgba(23, 23, 33, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                backdropFilter: 'blur(16px)'
              }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{
                      color: activeMachineFilter === 'CVD_M02' && isWithinAnomalyWindow(activeLotMeta.meas_time) ? '#ef4444' : '#10b981',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      background: activeMachineFilter === 'CVD_M02' && isWithinAnomalyWindow(activeLotMeta.meas_time) ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      textTransform: 'uppercase'
                    }}>
                      {activeLotMeta.cvd_machine}
                    </span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', marginTop: '0.4rem' }}>
                      {activeLotId} Wafer Map
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      onClick={() => {
                        const idx = lotsMetadata.findIndex(m => m.lot_id === activeLotId);
                        if (idx > 0) setActiveLotId(lotsMetadata[idx - 1].lot_id);
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: 'none',
                        color: '#ffffff',
                        padding: '0.4rem',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => {
                        const idx = lotsMetadata.findIndex(m => m.lot_id === activeLotId);
                        if (idx < lotsMetadata.length - 1) setActiveLotId(lotsMetadata[idx + 1].lot_id);
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: 'none',
                        color: '#ffffff',
                        padding: '0.4rem',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* 2D SVG Wafer map visualizer */}
                <div style={{ position: 'relative', width: '310px', height: '310px', margin: '1rem 0' }}>
                  <svg viewBox="-160 -160 320 320" style={{ width: '100%', height: '100%' }}>
                    {/* Main Wafer Circle (300mm wafer scale) */}
                    <circle cx="0" cy="0" r="150" fill="#1b1c22" stroke="#3f3f46" strokeWidth="2.5" />
                    
                    {/* Wafer Notch at the bottom (0, 150) */}
                    <polygon points="-6,150 6,150 0,143" fill="#121318" stroke="#3f3f46" strokeWidth="1.5" />

                    {/* Concentric Circle Guides */}
                    <circle cx="0" cy="0" r="30" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" strokeDasharray="2 4" />
                    <circle cx="0" cy="0" r="60" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" strokeDasharray="2 4" />
                    <circle cx="0" cy="0" r="90" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" strokeDasharray="2 4" />
                    <circle cx="0" cy="0" r="120" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" strokeDasharray="2 4" />

                    {/* Draw Grid Points */}
                    {activeWaferRecords.map((point, idx) => {
                      const x = point.position_x;
                      // Invert Y coordinate so standard cartesian Y matches screen rendering
                      const y = -point.position_y;
                      
                      const isHovered = hoveredPoint && hoveredPoint.position_x === point.position_x && hoveredPoint.position_y === point.position_y;
                      const fillColor = getThicknessColor(point.thickness_value, point.is_outlier, point.status);
                      
                      let strokeColor = 'rgba(255, 255, 255, 0.15)';
                      let strokeWidth = 1;
                      if (point.status === 'outlier') {
                        strokeColor = '#ec4899';
                        strokeWidth = 1.5;
                      } else if (point.status === 'missing') {
                        strokeColor = '#4b5563';
                        strokeWidth = 1;
                      } else if (point.status === 'cleaned') {
                        strokeColor = '#38bdf8'; // Blue border for cleaned/interpolated points
                        strokeWidth = 1.5;
                      }

                      if (isHovered) {
                        strokeColor = '#ffffff';
                        strokeWidth = 2.5;
                      }

                      return (
                        <circle
                          key={`point-${idx}`}
                          cx={x}
                          cy={y}
                          r={isHovered ? 9 : 6.5}
                          fill={fillColor}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          cursor="pointer"
                          onMouseEnter={() => setHoveredPoint(point)}
                          onMouseLeave={() => setHoveredPoint(null)}
                          style={{ transition: 'all 0.15s ease' }}
                        />
                      );
                    })}
                  </svg>
                </div>

                {/* Legend gradient bar */}
                <div style={{ width: '100%', marginTop: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                    <span>얇음 (&lt; 92nm)</span>
                    <span style={{ fontWeight: 800, color: '#10b981' }}>Nominal (100nm)</span>
                    <span>두꺼움 (&gt; 116nm)</span>
                  </div>
                  <div style={{
                    height: '10px',
                    borderRadius: '5px',
                    background: 'linear-gradient(to right, hsl(225, 85%, 45%), hsl(140, 75%, 45%) 40%, hsl(140, 75%, 45%) 60%, hsl(0, 90%, 50%))'
                  }} />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    marginTop: '0.8rem',
                    flexWrap: 'wrap',
                    fontSize: '0.78rem'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ec4899', fontWeight: 600 }}>
                      <span style={{ width: '8px', height: '8px', background: '#ec4899', borderRadius: '50%', display: 'inline-block' }} />
                      이상치 (Outlier)
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#4b5563' }}>
                      <span style={{ width: '8px', height: '8px', background: '#4b5563', borderRadius: '50%', display: 'inline-block' }} />
                      결측치 (Missing)
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#38bdf8', fontWeight: 600 }}>
                      <span style={{ width: '8px', height: '8px', border: '1px solid #38bdf8', background: 'transparent', borderRadius: '50%', display: 'inline-block' }} />
                      정제됨 (Cleaned/Interpolated)
                    </span>
                  </div>
                </div>

                {/* Floating interactive tooltip */}
                <div style={{
                  width: '100%',
                  marginTop: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '16px',
                  padding: '1rem',
                  minHeight: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  {hoveredPoint ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>측정 좌표 (X, Y)</span>
                        <span style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 700 }}>
                          ({hoveredPoint.position_x}, {hoveredPoint.position_y}) mm
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>웨이퍼 반경구역 (Radius)</span>
                        <span style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 700 }}>
                          R = {getPointRadius(hoveredPoint.position_x, hoveredPoint.position_y)} mm
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>두께 측정값</span>
                        <span style={{
                          fontSize: '0.98rem',
                          fontWeight: 900,
                          color: hoveredPoint.status === 'outlier' ? '#ec4899' : hoveredPoint.status === 'missing' ? '#94a3b8' : '#10b981'
                        }}>
                          {hoveredPoint.thickness_value !== null ? `${hoveredPoint.thickness_value} nm` : '결측치 (NaN)'}
                          {hoveredPoint.is_outlier && (
                            <span style={{ fontSize: '0.72rem', color: '#ec4899', display: 'block', fontWeight: 600, textAlign: 'right' }}>
                              [{hoveredPoint.outlier_type}]
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <Info size={16} />
                      웨이퍼 맵 위의 원형 포인트를 호버하면 상세 좌표 및 두께 정보가 표시됩니다.
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Cleaning panel & Uniformity status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                
                {/* 1. Wafer uniformity analysis card */}
                <div style={{
                  background: 'rgba(23, 23, 33, 0.55)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: '2rem',
                  backdropFilter: 'blur(16px)'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={22} color="#8b5cf6" />
                    Wafer Uniformity 분석 보고서
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>웨이퍼 평균 두께</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8', marginTop: '0.2rem' }}>
                        {activeWaferStats.mean} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>nm</span>
                      </div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>두께 산포 표준편차 (1σ)</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#8b5cf6', marginTop: '0.2rem' }}>
                        {activeWaferStats.stdDev} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>nm</span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>박막 두께 균일도 (Thin-Film Uniformity)</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.1rem' }}>Semiconductor Standard: (Max - Min) / (2 * Mean) * 100</div>
                      </div>
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: 900,
                        color: activeWaferStats.uniformity > 8 ? '#ef4444' : activeWaferStats.uniformity > 3 ? '#f97316' : '#10b981'
                      }}>
                        {activeWaferStats.uniformity} %
                      </div>
                    </div>

                    {/* Threshold visual gauge */}
                    <div style={{ width: '100%', height: '6px', background: '#374151', borderRadius: '3px', marginTop: '0.8rem', position: 'relative', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(100, (activeWaferStats.uniformity / 15) * 100)}%`,
                        background: activeWaferStats.uniformity > 8 ? '#ef4444' : activeWaferStats.uniformity > 3 ? '#f97316' : '#10b981',
                        borderRadius: '3px',
                        transition: 'width 0.4s ease'
                      }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '0.35rem' }}>
                      <span>Good (&lt; 3.0%)</span>
                      <span>Warning (3.0% ~ 8.0%)</span>
                      <span>Critical (&gt; 8.0%)</span>
                    </div>
                  </div>

                  {/* Diagnostic status block */}
                  <div style={{
                    padding: '1rem 1.15rem',
                    borderRadius: '14px',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    background: activeWaferStats.uniformity > 8 ? 'rgba(239, 68, 68, 0.08)' : activeWaferStats.uniformity > 3 ? 'rgba(249, 115, 22, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                    border: activeWaferStats.uniformity > 8 ? '1px solid rgba(239, 68, 68, 0.2)' : activeWaferStats.uniformity > 3 ? '1px solid rgba(249, 115, 22, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)',
                    color: activeWaferStats.uniformity > 8 ? '#f87171' : activeWaferStats.uniformity > 3 ? '#fb923c' : '#a7f3d0'
                  }}>
                    {activeWaferStats.uniformity > 8 ? (
                      <>
                        <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                        <div>
                          <strong>공정 이상 알람 (Critical Deviation):</strong> 현재 LOT의 박막 두께 균일도가 매우 나쁩니다.
                          {activeLotMeta.cvd_machine === 'CVD_M02' && isWithinAnomalyWindow(activeLotMeta.meas_time) ? (
                            <span> 특히 <strong>Center (얇음)와 Edge (두꺼움)</strong>의 급격한 구배가 관찰되며, 이는 <strong>CVD_M02 가스 분배판(Showerhead) 오염 또는 열 불균형</strong>으로 강력히 추정됩니다.</span>
                          ) : (
                            <span> 이상 데이터가 제거되지 않았거나, Outlier 영향으로 인해 통계가 심하게 왜곡되었습니다. 아래 정제 필터를 활성화해 보세요.</span>
                          )}
                        </div>
                      </>
                    ) : activeWaferStats.uniformity > 3 ? (
                      <>
                        <Info size={18} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                        <div>
                          <strong>경고 상태 (Process Drift):</strong> 균일도가 다소 불안정합니다. 가스 유량 분배나 가열 장치의 미세 보정이 필요할 수 있습니다.
                        </div>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                        <div>
                          <strong>정상 운영 중 (Nominal Uniformity):</strong> 두께 균일도가 매우 양호합니다. 박막 특성이 매우 우수하며, 소자의 정상 수율을 충족합니다.
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 2. Interactive Data Cleaning controls */}
                <div style={{
                  background: 'rgba(23, 23, 33, 0.55)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: '2rem',
                  backdropFilter: 'blur(16px)'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sliders size={22} color="#06b6d4" />
                    실시간 데이터 정제 필터 (Cleaning Controls)
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    강의 4에서 학습한 데이터 정제 파이프라인의 실습 버전입니다. 아래 필터를 변경하여 이상치와 결측치 정제 효과가 Uniformity (%) 계산에 어떠한 엄청난 차이를 가져오는지 직접 검증하세요!
                  </p>

                  <div style={{ display: 'grid', gap: '1.25rem' }}>
                    {/* Outlier strategy option */}
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '0.6rem' }}>
                        이상치 (Outliers) 처리 필터
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                        {[
                          { id: 'keep', label: '정제 안 함 (Keep)', desc: '이상치 그대로 계산' },
                          { id: 'filter', label: '제거 (Filter)', desc: '이상치 강제 배제' },
                          { id: 'impute', label: '대체 (Impute)', desc: '100.0 nm 대체' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setOutlierStrategy(opt.id as any)}
                            style={{
                              background: outlierStrategy === opt.id ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255,255,255,0.03)',
                              border: outlierStrategy === opt.id ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.06)',
                              color: outlierStrategy === opt.id ? '#06b6d4' : '#cbd5e1',
                              padding: '0.6rem 0.5rem',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              textAlign: 'center'
                            }}
                          >
                            <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>{opt.label}</span>
                            <span style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.2rem' }}>{opt.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* NaN strategy option */}
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '0.6rem' }}>
                        결측치 (NaN / Missing) 처리 필터
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                        {[
                          { id: 'keep', label: '정제 안 함 (Keep)', desc: '결측 점 공란 렌더링' },
                          { id: 'interpolate', label: '평균값 삽입 (Interpolate)', desc: 'Wafer 평균값 보간' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setNanStrategy(opt.id as any)}
                            style={{
                              background: nanStrategy === opt.id ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255,255,255,0.03)',
                              border: nanStrategy === opt.id ? '1px solid #8b5cf6' : '1px solid rgba(255,255,255,0.06)',
                              color: nanStrategy === opt.id ? '#8b5cf6' : '#cbd5e1',
                              padding: '0.6rem 0.5rem',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              textAlign: 'center'
                            }}
                          >
                            <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>{opt.label}</span>
                            <span style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.2rem' }}>{opt.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* CVD Process Anomaly Diagnosis Quiz */}
            <div style={{
              background: 'rgba(23, 23, 33, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '2.5rem',
              backdropFilter: 'blur(16px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <Trophy size={28} color="#eab308" />
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>
                    CVD 이상 공정 엔지니어 자가 진단 평가 (Quiz Lab)
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    실시간 트렌드 그래프와 정제 필터를 토대로 이상 상태를 진단하여 종합 보고서를 제출해 보세요.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
                
                {/* Q1 */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800 }}>Question 01</span>
                  <p style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0.4rem 0 0.8rem 0' }}>
                    두께 균일도(Uniformity) 분석 결과, 공정 이상(Drift/Deviation)이 확인된 CVD 설비는 무엇입니까?
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {['CVD_M01', 'CVD_M02', 'CVD_M03'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                        <input
                          type="radio"
                          name="q1"
                          value={opt}
                          checked={quizAnswers.q1 === opt}
                          onChange={(e) => setQuizAnswers(prev => ({ ...prev, q1: e.target.value }))}
                          disabled={quizSubmitted}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q2 */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800 }}>Question 02</span>
                  <p style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0.4rem 0 0.8rem 0' }}>
                    CVD 이상 거동이 발생한 정확한 시간대 구간은 언제입니까?
                  </p>
                  <div style={{ display: 'grid', gap: '0.6rem' }}>
                    {[
                      { id: 'may20_am', label: '5월 20일 오전 (LOT-001 ~ LOT-005)' },
                      { id: 'may21_pm', label: '5월 21일 오후~밤 (LOT-019 ~ LOT-024)' },
                      { id: 'may22_am', label: '5월 22일 새벽 (LOT-035 ~ LOT-040)' }
                    ].map(opt => (
                      <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                        <input
                          type="radio"
                          name="q2"
                          value={opt.id}
                          checked={quizAnswers.q2 === opt.id}
                          onChange={(e) => setQuizAnswers(prev => ({ ...prev, q2: e.target.value }))}
                          disabled={quizSubmitted}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q3 */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800 }}>Question 03</span>
                  <p style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0.4rem 0 0.8rem 0' }}>
                    해당 이상 공정에서 증착된 박막의 Wafer상 물리적 두께 구배 특징은 무엇입니까?
                  </p>
                  <div style={{ display: 'grid', gap: '0.6rem' }}>
                    {[
                      { id: 'dome', label: 'Wafer Center가 현저히 두껍고 Edge가 아주 얇음 (Center-High/Dome형)' },
                      { id: 'edge_high', label: 'Wafer Edge는 비정상적으로 두껍고 Center가 과하게 얇음 (Edge-High/Center-Thin형)' },
                      { id: 'flat_thin', label: 'Wafer 전 영역의 두께가 고르게 얇아짐 (Flat-Thin형)' }
                    ].map(opt => (
                      <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                        <input
                          type="radio"
                          name="q3"
                          value={opt.id}
                          checked={quizAnswers.q3 === opt.id}
                          onChange={(e) => setQuizAnswers(prev => ({ ...prev, q3: e.target.value }))}
                          disabled={quizSubmitted}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q4 */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800 }}>Question 04 (주관식 엔지니어 의견)</span>
                  <p style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0.4rem 0 0.8rem 0' }}>
                    데이터 정제 필터(Outliers)를 해제(Keep)했을 때와 적용(Filter/Impute)했을 때, CVD 설비의 공정 정상 여부를 판정하고 두께 산포 Uniformity 경향을 올바르게 분석하는 데 어떠한 차이가 있었습니까? (10자 이상 서술)
                  </p>
                  <textarea
                    rows={3}
                    placeholder="여기에 엔지니어 분석 소견을 적으세요..."
                    value={quizAnswers.q4}
                    onChange={(e) => setQuizAnswers(prev => ({ ...prev, q4: e.target.value }))}
                    disabled={quizSubmitted}
                    style={{
                      width: '100%',
                      background: '#18181b',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Submit button & Reset */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  {!quizSubmitted ? (
                    <button
                      onClick={checkQuizAnswers}
                      disabled={!quizAnswers.q1 || !quizAnswers.q2 || !quizAnswers.q3}
                      style={{
                        background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.8rem 2rem',
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: (!quizAnswers.q1 || !quizAnswers.q2 || !quizAnswers.q3) ? 0.5 : 1
                      }}
                    >
                      <Check size={18} />
                      분석 보고서 제출 (Submit Diagnosis)
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setQuizAnswers({ q1: '', q2: '', q3: '', q4: '' });
                        setQuizSubmitted(false);
                        setQuizScore(0);
                        setQuizFeedback('');
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '0.8rem 2rem',
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        borderRadius: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      다시 진단하기 (Reset Quiz)
                    </button>
                  )}
                </div>

                {/* Quiz Result Feedback Animation */}
                <AnimatePresence>
                  {quizSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        background: quizScore === 100 ? 'rgba(16, 185, 129, 0.08)' : quizScore >= 75 ? 'rgba(59, 130, 246, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                        border: quizScore === 100 ? '1px solid rgba(16, 185, 129, 0.25)' : quizScore >= 75 ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        marginTop: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{
                          fontWeight: 900,
                          fontSize: '1.25rem',
                          color: quizScore === 100 ? '#34d399' : quizScore >= 75 ? '#60a5fa' : '#f87171'
                        }}>
                          진단 평가 결과: {quizScore} / 100점
                        </span>
                        {quizScore === 100 && (
                          <span style={{
                            background: 'rgba(234, 179, 8, 0.15)',
                            color: '#fbbf24',
                            border: '1px solid #fbbf24',
                            padding: '0.2rem 0.65rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}>
                            <Award size={12} />
                            Diagnostics Specialist
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.6 }}>{quizFeedback}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

          </div>
        )}

        {/* ============================================================================
            TAB 2: ASSIGNMENT GUIDELINES (📝 프로젝트 1 과제 가이드)
           ============================================================================ */}
        {activeTab === 'guidelines' && (
          <div style={{ display: 'grid', gap: '2.5rem' }}>
            
            {/* Project Overview Card */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '30px',
              padding: '3rem',
              color: '#ffffff',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <Globe size={44} color="#06b6d4" />
                <div>
                  <h2 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 900 }}>프로젝트 1 과제 안내</h2>
                  <p style={{ fontSize: '1.2rem', margin: '0.3rem 0 0 0', color: '#94a3b8' }}>
                    반도체 CVD SiOx 박막 두께 데이터 정제 및 이상 원인 분석 보고서 완성
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1.5rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: 700 }}>제출 대상 강의</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>1강 ~ 4강 이수 후</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1.5rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: 700 }}>목표 데이터셋</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>siox_thickness_data.csv</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1.5rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: 700 }}>권장 학습 기간</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#8b5cf6' }}>1주일 이내 제출</div>
                </div>
              </div>
            </div>

            {/* LEVEL BEGINNER CARD */}
            <div style={{
              background: 'rgba(23, 23, 33, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '2.5rem',
              backdropFilter: 'blur(16px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '0.35rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 800
                }}>
                  [초급] 입문 난이도
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Gemini Web Chat 기반 박막 두께 데이터 정제 및 HTML 보고서 생성
                </h3>
              </div>

              <div style={{ display: 'grid', gap: '1.25rem', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.7 }}>
                <p>
                  <strong>수행 목적:</strong> 코딩 지식이 부족한 상태에서 웹 브라우저의 <strong>Gemini Chat(웹 클라이언트)</strong>에 직접 데이터셋을 입력 및 업로드하고, 프롬프트 엔지니어링을 사용하여 데이터 시각화 및 이상 원인 판정 결과를 도출합니다.
                </p>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.5rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <h4 style={{ color: '#ffffff', fontWeight: 800, marginBottom: '0.75rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Terminal size={18} color="#06b6d4" />
                    수행 과제 (Step-by-Step)
                  </h4>
                  <ol style={{ paddingLeft: '1.2rem', display: 'grid', gap: '0.5rem' }}>
                    <li>`siox_thickness_data.csv` 파일을 다운로드하거나 복사합니다.</li>
                    <li>웹 브라우저에서 Gemini Chat을 실행하고, 다운로드한 CSV 파일을 업로드하거나 복사 붙여넣기합니다.</li>
                    <li>
                      아래 <strong>[제공 프롬프트]</strong>를 활용하여 Gemini에게 데이터의 컬럼 파악, 결측치 감지, 
                      Calibration/Reflection 이상치(-999.0, 999.9, 0.0, 250.3)를 식별하도록 지시합니다.
                    </li>
                    <li>Gemini에게 Uniformity (%) 값을 정제 전후로 계산하여 비교 표를 만들도록 요청합니다.</li>
                    <li>CVD 설비별 매칭을 지시하여, May 21st 오후 시간대에 CVD_M02에서 발생한 비정상 균일도 원인을 역추적 분석시킵니다.</li>
                    <li>
                      최종적으로 Gemini에게 이 모든 분석 내용(Outlier 검출, Uniformity 통계 표, CVD_M02 원인 추정 및 조치 방안)을 
                      가장 멋지게 레이아웃한 <strong>단일 파일 형태의 `report_beginner.html`</strong>로 생성해 달라고 유도합니다.
                    </li>
                  </ol>
                </div>

                {/* Beginner template prompt copy box */}
                <div style={{ position: 'relative', background: '#111216', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem 1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    초급 권장 프롬프트 예시
                  </span>
                  <pre style={{
                    color: '#34d399',
                    fontFamily: '"Fira Code", monospace',
                    fontSize: '0.85rem',
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                    paddingRight: '3rem',
                    lineHeight: 1.5
                  }}>
{`나는 반도체 R&D 공정 엔지니어 취업준비생이야. 첨부된 'siox_thickness_data.csv' 데이터를 정밀 분석하고 싶어.
1. 이 데이터셋의 각 컬럼 형태와 데이터 개수를 파악해줘.
2. 데이터 중 엘립소메터 장비 에러로 추정되는 극단적 이상치(-999, 999.9, 0, 250.3 등)와 비어 있는 결측치(NaN)를 식별해줘.
3. 이상치와 결측치를 필터링하거나 중앙값(nominal 100nm)으로 대체했을 때와 적용하지 않았을 때의 Wafer Uniformity (%) 차이를 계산식과 표로 나타내줘.
4. 각 LOT별로 어떤 CVD 설비에서 문제가 터졌는지, 이상이 발생한 특정 시간대와 설비 번호를 판정해줘.
5. 분석 결과(Wafer Map, 설비 매칭 트렌드, 이상 원인, 엔지니어 개선안)가 모두 포함된 모던하고 아름다운 다크모드 단일 HTML 보고서 파일 (CSS 스타일 포함)을 완성해서 소스코드로 출력해줘.`}
                  </pre>
                  <button
                    onClick={() => handleCopyPrompt(`나는 반도체 R&D 공정 엔지니어 취업준비생이야. 첨부된 'siox_thickness_data.csv' 데이터를 정밀 분석하고 싶어.
1. 이 데이터셋의 각 컬럼 형태와 데이터 개수를 파악해줘.
2. 데이터 중 엘립소메터 장비 에러로 추정되는 극단적 이상치(-999, 999.9, 0, 250.3 등)와 비어 있는 결측치(NaN)를 식별해줘.
3. 이상치와 결측치를 필터링하거나 중앙값(nominal 100nm)으로 대체했을 때와 적용하지 않았을 때의 Wafer Uniformity (%) 차이를 계산식과 표로 나타내줘.
4. 각 LOT별로 어떤 CVD 설비에서 문제가 터졌는지, 이상이 발생한 특정 시간대와 설비 번호를 판정해줘.
5. 분석 결과(Wafer Map, 설비 매칭 트렌드, 이상 원인, 엔지니어 개선안)가 모두 포함된 모던하고 아름다운 다크모드 단일 HTML 보고서 파일 (CSS 스타일 포함)을 완성해서 소스코드로 출력해줘.`, 1)}
                    style={{
                      position: 'absolute',
                      top: '1.25rem',
                      right: '1.25rem',
                      background: copiedTextIdx === 1 ? '#10b981' : '#3b82f6',
                      border: 'none',
                      color: '#ffffff',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.3s'
                    }}
                  >
                    {copiedTextIdx === 1 ? <Check size={14} /> : <Copy size={14} />}
                    {copiedTextIdx === 1 ? '복사됨' : '프롬프트 복사'}
                  </button>
                </div>
              </div>
            </div>

            {/* LEVEL INTERMEDIATE CARD */}
            <div style={{
              background: 'rgba(23, 23, 33, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '2.5rem',
              backdropFilter: 'blur(16px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  background: 'rgba(139, 92, 246, 0.12)',
                  color: '#c084fc',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  padding: '0.35rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 800
                }}>
                  [중급] 전공자 난이도
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Antigravity IDE Agent 연동 데이터 로드 및 반응형 대시보드 HTML 파일 생성
                </h3>
              </div>

              <div style={{ display: 'grid', gap: '1.25rem', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.7 }}>
                <p>
                  <strong>수행 목적:</strong> 로컬 작업 공간에서 AI 코딩 어시스턴트인 <strong>Antigravity 에이전트</strong>와 페어 프로그래밍을 하여, 작업 영역에 배치된 로컬 CSV 데이터를 프로그램적으로 파싱 및 가공하고, 동적으로 차트 제어가 가능한 반응형 HTML 대시보드를 생성합니다.
                </p>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.5rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <h4 style={{ color: '#ffffff', fontWeight: 800, marginBottom: '0.75rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Code size={18} color="#8b5cf6" />
                    수행 과제 (Step-by-Step)
                  </h4>
                  <ol style={{ paddingLeft: '1.2rem', display: 'grid', gap: '0.5rem' }}>
                    <li>로컬 작업 폴더 내에 `siox_thickness_data.csv`가 정상적으로 놓여 있는지 확인합니다.</li>
                    <li>Antigravity 에이전트 창을 켜서 데이터 정제 및 동적 웹 앱 생성을 위한 페어 코딩을 시작합니다.</li>
                    <li>
                      Antigravity에게 파이썬 Pandas 스크립트나 자바스크립트 CSV 파서를 작성해 결측치 보간(Wafer별 잔여지 평균보간), 
                      이상치 마스크 처리를 자동 수행하도록 대화형 프롬프트를 작성합니다.
                    </li>
                    <li>
                      정제된 데이터를 불러와 사용자가 직접 LOT ID를 변경하면 2D Wafer Map(D3.js 또는 Chart.js)에 HSL 그라데이션 색상이 
                      동적으로 변화하는 <strong>인터랙티브 대시보드 `report_intermediate.html`</strong>을 코딩 없이 에이전트와 함께 작성합니다.
                    </li>
                    <li>완성된 HTML 파일을 로컬 서버나 브라우저 더블클릭으로 띄워 정상 제어 및 이상치가 말끔히 정제되는지 직접 확인합니다.</li>
                  </ol>
                </div>

                {/* Intermediate template prompt copy box */}
                <div style={{ position: 'relative', background: '#111216', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem 1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    중급 권장 프롬프트 예시
                  </span>
                  <pre style={{
                    color: '#c084fc',
                    fontFamily: '"Fira Code", monospace',
                    fontSize: '0.85rem',
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                    paddingRight: '3rem',
                    lineHeight: 1.5
                  }}>
{`Antigravity, 내 작업공간에 있는 'project_01/public/data/siox_thickness_data.csv' 반도체 두께 데이터를 사용하여 로컬 브라우저에서 실행 가능한 완성도 높은 반응형 웹 대시보드 'report_intermediate.html'를 하나 만들어줘.
요구 조건:
1. 내장 JS 파서로 CSV를 읽고 결측치(NaN)는 같은 wafer의 평균 두께로 자동 보간해줘.
2. 장비 측정 이상치(-999, 999.9 등)는 체크박스를 통해 필터링하거나(Filter) nominal 100nm로 즉각 대체(Impute)할 수 있도록 필터 패널을 장착해줘.
3. 드롭다운으로 LOT ID를 바꿀 때마다 49개 ellipsometer 포인트가 동적인 HSL 열화상(Heatmap) Wafer Map으로 뿌려져야 해. SVG나 CDN 기반 Chart.js/D3.js를 써도 좋아.
4. CVD_M02 설비가 May 21st 오후부터 폭주한 불균일 증착 트렌드가 꺾은선형 설비 매칭 차트로 구현되어 클릭하면 해당 wafer로 맵이 연동되게 만들어줘.`}
                  </pre>
                  <button
                    onClick={() => handleCopyPrompt(`Antigravity, 내 작업공간에 있는 'project_01/public/data/siox_thickness_data.csv' 반도체 두께 데이터를 사용하여 로컬 브라우저에서 실행 가능한 완성도 높은 반응형 웹 대시보드 'report_intermediate.html'를 하나 만들어줘.
요구 조건:
1. 내장 JS 파서로 CSV를 읽고 결측치(NaN)는 같은 wafer의 평균 두께로 자동 보간해줘.
2. 장비 측정 이상치(-999, 999.9 등)는 체크박스를 통해 필터링하거나(Filter) nominal 100nm로 즉각 대체(Impute)할 수 있도록 필터 패널을 장착해줘.
3. 드롭다운으로 LOT ID를 바꿀 때마다 49개 ellipsometer 포인트가 동적인 HSL 열화상(Heatmap) Wafer Map으로 뿌려져야 해. SVG나 CDN 기반 Chart.js/D3.js를 써도 좋아.
4. CVD_M02 설비가 May 21st 오후부터 폭주한 불균일 증착 트렌드가 꺾은선형 설비 매칭 차트로 구현되어 클릭하면 해당 wafer로 맵이 연동되게 만들어줘.`, 2)}
                    style={{
                      position: 'absolute',
                      top: '1.25rem',
                      right: '1.25rem',
                      background: copiedTextIdx === 2 ? '#10b981' : '#3b82f6',
                      border: 'none',
                      color: '#ffffff',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.3s'
                    }}
                  >
                    {copiedTextIdx === 2 ? <Check size={14} /> : <Copy size={14} />}
                    {copiedTextIdx === 2 ? '복사됨' : '프롬프트 복사'}
                  </button>
                </div>
              </div>
            </div>

            {/* LEVEL ADVANCED CARD */}
            <div style={{
              background: 'rgba(23, 23, 33, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '2.5rem',
              backdropFilter: 'blur(16px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  padding: '0.35rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 800
                }}>
                  [고급] 마스터 난이도
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Antigravity + Streamlit 연동 고도화 분석 및 다른 CSV 파일 재현 테스트 환경 구축
                </h3>
              </div>

              <div style={{ display: 'grid', gap: '1.25rem', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.7 }}>
                <p>
                  <strong>수행 목적:</strong> Antigravity 에이전트를 통해 순수 파이썬 데이터 프로토타이핑 프레임워크인 <strong>Streamlit</strong> 어플리케이션을 완성도 높게 제작합니다. 더불어, 설계된 대시보드가 단일 CSV 분석에 머무르지 않고, <strong>다른 종류의 박막 두께 CSV 데이터를 즉석 업로드해도 완전히 동일한 시각화 및 Uniformity 분석이 즉각 복사/수행되는 '재현 가능한(Reproducible)' R&D 분석 플랫폼</strong>을 빌드합니다.
                </p>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.5rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <h4 style={{ color: '#ffffff', fontWeight: 800, marginBottom: '0.75rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Zap size={18} color="#ef4444" />
                    수행 과제 (Step-by-Step)
                  </h4>
                  <ol style={{ paddingLeft: '1.2rem', display: 'grid', gap: '0.5rem' }}>
                    <li>로컬 개발 환경에 Python 3.10+ 및 streamlit 설치 상태를 점검합니다.</li>
                    <li>Antigravity에게 Streamlit 파일 `app.py`를 설계하여 `siox_thickness_data.csv` 분석 기능을 구현해 달라고 프롬프트합니다.</li>
                    <li>
                      <strong>재현성(Reproducibility) 장착:</strong> `st.file_uploader` 또는 로컬 파일 패스 셀렉터를 구성하여, 
                      포맷(lot_id, cvd_machine, meas_time, position_x, position_y, thickness_value)이 일치하는 <strong>또 다른 임의의 
                      실험 데이터 CSV를 드롭해도 에러 없이 완전한 2D Wafer Map 및 설비 이상 통계가 재생성</strong>되도록 파이프라인을 견고하게 짜야 합니다.
                    </li>
                    <li>Pandas와 Plotly/Seaborn 등을 연동하여 인터랙티브한 산점도 및 분포도 시각화를 입힙니다.</li>
                    <li>로컬 터미널에서 `streamlit run app.py`를 구동하고, 다른 예시 파일을 로드하여 정상 작동(재현 가능 분석)을 완벽히 증명합니다.</li>
                  </ol>
                </div>

                {/* Advanced template prompt copy box */}
                <div style={{ position: 'relative', background: '#111216', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem 1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    고급 권장 프롬프트 예시
                  </span>
                  <pre style={{
                    color: '#f87171',
                    fontFamily: '"Fira Code", monospace',
                    fontSize: '0.85rem',
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                    paddingRight: '3rem',
                    lineHeight: 1.5
                  }}>
{`Antigravity, 내 로컬 워크스페이스에 Streamlit 애플리케이션 파일 'app.py'를 빌드해서 반도체 박막 데이터 가공 대시보드를 만들어줘.
이 대시보드는 완전히 '재현성(Reproducible)'을 충족하도록 제작되어야 해:
1. 사용자가 화면의 파일 업로더(st.file_uploader)를 통해 어떤 wafer thickness CSV 데이터를 업로드해도 즉시 lot_id, cvd_machine을 식별해서 UI 필터 셀렉터들이 리프레시되어야 해.
2. Pandas로 결측값은 해당 Lot의 non-outlier 평균치로 보간하고, 이상값(-999, 999.9, 0)은 dynamic 체크박스로 제거 유무를 결정하게 한 다음, 즉석에서 Uniformity = (Max-Min)/(2*Mean)*100을 계산해 실시간 스펙 통계표를 띄워줘.
3. Plotly Express를 활용해 300mm 원형 웨이퍼 형상의 2D Wafer Scatter Map을 렌더링하고, 색상 맵은 HSL 형태의 cyan-to-red로 이쁘게 처리해줘.
4. 설비 매칭용 Trend Line Chart 및 이상치 통계도 같이 표현되어야 해. 에러가 나면 즉각 디버깅해 줘.`}
                  </pre>
                  <button
                    onClick={() => handleCopyPrompt(`Antigravity, 내 로컬 워크스페이스에 Streamlit 애플리케이션 파일 'app.py'를 빌드해서 반도체 박막 데이터 가공 대시보드를 만들어줘.
이 대시보드는 완전히 '재현성(Reproducible)'을 충족하도록 제작되어야 해:
1. 사용자가 화면의 파일 업로더(st.file_uploader)를 통해 어떤 wafer thickness CSV 데이터를 업로드해도 즉시 lot_id, cvd_machine을 식별해서 UI 필터 셀렉터들이 리프레시되어야 해.
2. Pandas로 결측값은 해당 Lot의 non-outlier 평균치로 보간하고, 이상값(-999, 999.9, 0)은 dynamic 체크박스로 제거 유무를 결정하게 한 다음, 즉석에서 Uniformity = (Max-Min)/(2*Mean)*100을 계산해 실시간 스펙 통계표를 띄워줘.
3. Plotly Express를 활용해 300mm 원형 웨이퍼 형상의 2D Wafer Scatter Map을 렌더링하고, 색상 맵은 HSL 형태의 cyan-to-red로 이쁘게 처리해줘.
4. 설비 매칭용 Trend Line Chart 및 이상치 통계도 같이 표현되어야 해. 에러가 나면 즉각 디버깅해 줘.`, 3)}
                    style={{
                      position: 'absolute',
                      top: '1.25rem',
                      right: '1.25rem',
                      background: copiedTextIdx === 3 ? '#10b981' : '#3b82f6',
                      border: 'none',
                      color: '#ffffff',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.3s'
                    }}
                  >
                    {copiedTextIdx === 3 ? <Check size={14} /> : <Copy size={14} />}
                    {copiedTextIdx === 3 ? '복사됨' : '프롬프트 복사'}
                  </button>
                </div>
              </div>
            </div>

            {/* Evaluation Criteria Table */}
            <div style={{
              background: 'rgba(23, 23, 33, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '2rem',
              backdropFilter: 'blur(16px)'
            }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={24} color="#06b6d4" />
                프로젝트 1 평가 루브릭 (Grading Rubric)
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem', color: '#cbd5e1' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1.5px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 800, color: '#ffffff' }}>구분</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 800, color: '#10b981' }}>초급 (Beginner)</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 800, color: '#c084fc' }}>중급 (Intermediate)</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 800, color: '#f87171' }}>고급 (Advanced)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '1.1rem 1rem', fontWeight: 800, color: '#ffffff' }}>핵심 활용 도구</td>
                      <td style={{ padding: '1.1rem 1rem', textAlign: 'center' }}>Gemini Web Chat 클라이언트</td>
                      <td style={{ padding: '1.1rem 1rem', textAlign: 'center' }}>Antigravity AI Agent + 로컬 에디터</td>
                      <td style={{ padding: '1.1rem 1rem', textAlign: 'center' }}>Antigravity + Streamlit + Venv</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '1.1rem 1rem', fontWeight: 800, color: '#ffffff' }}>이상치 정제 방식</td>
                      <td style={{ padding: '1.1rem 1rem', textAlign: 'center' }}>프롬프트에 의한 AI 분석 필터링</td>
                      <td style={{ padding: '1.1rem 1rem', textAlign: 'center' }}>자바스크립트/파이썬 코드 정밀 마스킹</td>
                      <td style={{ padding: '1.1rem 1rem', textAlign: 'center' }}>Pandas numeric cast 및 Dynamic 체크 패널</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '1.1rem 1rem', fontWeight: 800, color: '#ffffff' }}>시각화 산출물</td>
                      <td style={{ padding: '1.1rem 1rem', textAlign: 'center' }}>정적 HTML/CSS 및 인라인 마크다운 표</td>
                      <td style={{ padding: '1.1rem 1rem', textAlign: 'center' }}>반응형 HTML/JS & SVG 동적 웨이퍼 맵</td>
                      <td style={{ padding: '1.1rem 1rem', textAlign: 'center' }}>Plotly 3D/2D 원형 산점도 웹 대시보드</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '1.1rem 1rem', fontWeight: 800, color: '#ffffff' }}>재현성 평가</td>
                      <td style={{ padding: '1.1rem 1rem', textAlign: 'center' }}>단일 CSV 분석 중심</td>
                      <td style={{ padding: '1.1rem 1rem', textAlign: 'center' }}>단일 CSV 대화형 뷰어</td>
                      <td style={{ padding: '1.1rem 1rem', textAlign: 'center', fontWeight: 800, color: '#f87171' }}>타 CSV 데이터 업로드 시 자동 재현</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================================
            TAB 3: TROUBLESHOOTING & HINTS (💡 난이도별 에러 해결 힌트)
           ============================================================================ */}
        {activeTab === 'hints' && (
          <div style={{ display: 'grid', gap: '2.5rem' }}>
            
            <div style={{
              background: 'rgba(23, 23, 33, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '2.5rem',
              backdropFilter: 'blur(16px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <HelpCircle size={28} color="#06b6d4" />
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>
                    실습 트러블슈팅 & 에러 자가 치유 가이드 (Troubleshooting Hub)
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    초급/중급/고급 과정 도중 빈번히 접하는 오류 코드와, 이를 <strong>Gemini/Antigravity에 물어 자가 해결하는 명쾌한 가이드라인</strong>을 제공합니다.
                  </p>
                </div>
              </div>

              {/* Grid block of errors */}
              <div style={{ display: 'grid', gap: '2rem', marginTop: '2.5rem' }}>
                
                {/* 1. BEGINNER BUG HINTS */}
                <div style={{
                  borderLeft: '4px solid #10b981',
                  background: 'rgba(16, 185, 129, 0.03)',
                  padding: '1.5rem',
                  borderRadius: '0 16px 16px 0',
                  border: '1px solid rgba(16, 185, 129, 0.1)',
                  borderLeftWidth: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ background: '#10b981', color: '#09090b', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 900 }}>초급 공통</span>
                    <h4 style={{ fontSize: '1.12rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>Gemini 웹 챗 코드 생략/끊김 및 분석 실패 오류</h4>
                  </div>
                  <div style={{ display: 'grid', gap: '1rem', fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                    <div>
                      <strong style={{ color: '#f87171' }}>🚨 현상:</strong> Gemini가 HTML 코드를 짜 주다가 중간에 `// ... [이전 코드 동일] ...` 과 같이 코드를 누락시키거나 출력이 도중에 뚝 끊깁니다. 혹은 1900여 행의 CSV 텍스트 전체를 읽지 못하고 오류를 뿜습니다.
                      <p style={{ marginTop: '0.3rem' }}><strong style={{ color: '#34d399' }}>💡 해결 힌트:</strong> 파일 업로드 버튼을 적극 활용하거나, Gemini가 긴 코드를 끝까지 끊김 없이 작성할 수 있게 유도형 지침을 보강해야 합니다.</p>
                    </div>
                    
                    {/* Bug prompt copy block */}
                    <div style={{ position: 'relative', background: '#111216', padding: '1rem', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800, display: 'block', marginBottom: '0.35rem' }}>자가 해결을 위한 Gemini 추천 프롬프트 복사</span>
                      <p style={{ color: '#a7f3d0', fontFamily: 'monospace', fontSize: '0.8rem', margin: 0, paddingRight: '3rem' }}>
                        "너가 방금 작성해 준 HTML 코드가 중간에 생략 마크 `...` 로 인해 깨져 있어. 이 생략 표시는 브라우저 실행 시 에러를 유발해. 그러니 처음부터 끝까지 생략 없이 온전한 HTML/CSS 단일 소스코드를 끝까지 풀(full) 코드로 다시 출력해줘."
                      </p>
                      <button
                        onClick={() => handleCopyPrompt(`너가 방금 작성해 준 HTML 코드가 중간에 생략 마크 ... 로 인해 깨져 있어. 이 생략 표시는 브라우저 실행 시 에러를 유발해. 그러니 처음부터 끝까지 생략 없이 온전한 HTML/CSS 단일 소스코드를 끝까지 풀(full) 코드로 다시 출력해줘.`, 11)}
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: copiedTextIdx === 11 ? '#10b981' : '#4b5563',
                          border: 'none',
                          color: '#ffffff',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          cursor: 'pointer'
                        }}
                      >
                        {copiedTextIdx === 11 ? '복사됨' : '복사'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. INTERMEDIATE BUG HINTS */}
                <div style={{
                  borderLeft: '4px solid #c084fc',
                  background: 'rgba(139, 92, 246, 0.03)',
                  padding: '1.5rem',
                  borderRadius: '0 16px 16px 0',
                  border: '1px solid rgba(139, 92, 246, 0.1)',
                  borderLeftWidth: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ background: '#c084fc', color: '#09090b', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 900 }}>중급 공통</span>
                    <h4 style={{ fontSize: '1.12rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>Antigravity 로컬 경로 미인식 & JS NaN 계산 버그</h4>
                  </div>
                  <div style={{ display: 'grid', gap: '1rem', fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                    <div>
                      <strong style={{ color: '#f87171' }}>🚨 현상:</strong> Antigravity가 작성한 로컬 코드가 CSV 파일의 저장 주소(`FileNotFoundError`)를 찾지 못하거나, 자바스크립트에서 빈 칸인 결측값을 처리하다 통계 수치들이 `NaN` 혹은 `undefined`로 터져 그래프가 아예 날아가 버립니다.
                      <p style={{ marginTop: '0.3rem' }}><strong style={{ color: '#34d399' }}>💡 해결 힌트:</strong> 파일 읽기 시 실행 환경 절대 경로 조합을 유도하고, JS 파싱 중에 자료형 검사 단계를 명문화하여 에이전트가 예외 처리를 넣도록 지시합니다.</p>
                    </div>

                    {/* Bug prompt copy block */}
                    <div style={{ position: 'relative', background: '#111216', padding: '1rem', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 800, display: 'block', marginBottom: '0.35rem' }}>자가 해결을 위한 Antigravity 추천 프롬프트 복사</span>
                      <p style={{ color: '#c084fc', fontFamily: 'monospace', fontSize: '0.8rem', margin: 0, paddingRight: '3rem' }}>
                        "로컬 CSV 파일을 불러와 자바스크립트로 평균이나 산포를 계산할 때, 결측값(공백 문자열)이나 데이터가 비어 있는 경우를 사전에 걸러내지 않아 자꾸 결과가 NaN으로 표시되고 있어. `parseFloat` 호출 시 값이 빈 문자열이거나 유효하지 않으면 NaN을 뱉는데, 이 경우를 대비해 `!isNaN(val)` 검사를 수행해서 예외 처리가 들어간 견고한 파싱 코드로 다시 빌드해줘."
                      </p>
                      <button
                        onClick={() => handleCopyPrompt(`로컬 CSV 파일을 불러와 자바스크립트로 평균이나 산포를 계산할 때, 결측값(공백 문자열)이나 데이터가 비어 있는 경우를 사전에 걸러내지 않아 자꾸 결과가 NaN으로 표시되고 있어. parseFloat 호출 시 값이 빈 문자열이거나 유효하지 않으면 NaN을 뱉는데, 이 경우를 대비해 !isNaN(val) 검사를 수행해서 예외 처리가 들어간 견고한 파싱 코드로 다시 빌드해줘.`, 12)}
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: copiedTextIdx === 12 ? '#10b981' : '#4b5563',
                          border: 'none',
                          color: '#ffffff',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          cursor: 'pointer'
                        }}
                      >
                        {copiedTextIdx === 12 ? '복사됨' : '복사'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. ADVANCED BUG HINTS */}
                <div style={{
                  borderLeft: '4px solid #ef4444',
                  background: 'rgba(239, 68, 68, 0.03)',
                  padding: '1.5rem',
                  borderRadius: '0 16px 16px 0',
                  border: '1px solid rgba(239, 68, 68, 0.1)',
                  borderLeftWidth: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ background: '#ef4444', color: '#09090b', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 900 }}>고급 공통</span>
                    <h4 style={{ fontSize: '1.12rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>Streamlit 가상환경 누락 & 타 CSV 업로드 캐시 충돌</h4>
                  </div>
                  <div style={{ display: 'grid', gap: '1rem', fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                    <div>
                      <strong style={{ color: '#f87171' }}>🚨 현상:</strong> `streamlit` 명령어 실행 시 `ModuleNotFoundError` 라이브러리 누락 에러가 나거나, st.file_uploader로 구조가 같은 다른 실험 데이터를 드롭했을 때, 스트림릿 내부에 지정해 놓은 `@st.cache_data` 캐시 데코레이터 때문에 이전 데이터가 화면에 고착되어 바뀌지 않는 런타임 오류가 발생합니다.
                      <p style={{ marginTop: '0.3rem' }}><strong style={{ color: '#34d399' }}>💡 해결 힌트:</strong> venv 가상환경 구성 명령어를 점검하고, 데이터 캐싱 적용 방식을 업로드된 파일 바이트에 맞춰 유동적으로 리프레시하도록 코드를 개조합니다.</p>
                    </div>

                    {/* Bug prompt copy block */}
                    <div style={{ position: 'relative', background: '#111216', padding: '1rem', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 800, display: 'block', marginBottom: '0.35rem' }}>자가 해결을 위한 Antigravity 추천 프롬프트 복사</span>
                      <p style={{ color: '#f87171', fontFamily: 'monospace', fontSize: '0.8rem', margin: 0, paddingRight: '3rem' }}>
                        "파이썬 streamlit 개발 중이야. `@st.cache_data` 데코레이터를 데이터 로드 함수 위에 올렸는데, 다른 CSV 파일을 업로드하면 캐시 키 값이 고정되어 이전 캐시 결과만 재출력되는 상태 고착 에러가 발생해. 업로드된 파일 고유 해시값(예: bytes 또는 hash)을 streamlit 캐시 함수의 매개변수로 함께 넘기거나, 다른 파일이 감지될 때 캐시가 갱신(invalidation)되도록 `st.file_uploader` 연동 캐싱 로직을 방어적으로 수정해줘."
                      </p>
                      <button
                        onClick={() => handleCopyPrompt(`파이썬 streamlit 개발 중이야. @st.cache_data 데코레이터를 데이터 로드 함수 위에 올렸는데, 다른 CSV 파일을 업로드하면 캐시 키 값이 고정되어 이전 캐시 결과만 재출력되는 상태 고착 에러가 발생해. 업로드된 파일 고유 해시값(예: bytes 또는 hash)을 streamlit 캐시 함수의 매개변수로 함께 넘기거나, 다른 파일이 감지될 때 캐시가 갱신(invalidation)되도록 st.file_uploader 연동 캐싱 로직을 방어적으로 수정해줘.`, 13)}
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: copiedTextIdx === 13 ? '#10b981' : '#4b5563',
                          border: 'none',
                          color: '#ffffff',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          cursor: 'pointer'
                        }}
                      >
                        {copiedTextIdx === 13 ? '복사됨' : '복사'}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;
