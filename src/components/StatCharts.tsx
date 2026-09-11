import React from "react";
import { DescriptiveStats, FrequencyClass, ZScoreItem } from "../types";

interface ChartProps {
  stats: DescriptiveStats;
  frequencyClasses: FrequencyClass[];
  zScores: ZScoreItem[];
  variableName: string;
  width?: number;
  height?: number;
}

/**
 * 1. Histogram Frekuensi & Poligon Frekuensi
 */
export const HistogramChart: React.FC<ChartProps> = ({
  stats,
  frequencyClasses,
  variableName,
  width = 680,
  height = 320,
}) => {
  const margin = { top: 25, right: 25, bottom: 45, left: 50 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const maxFreq = Math.max(...frequencyClasses.map((c) => c.frequency), 1);
  const barWidth = plotWidth / (frequencyClasses.length || 1);

  const polygonPoints: { x: number; y: number }[] = [];
  polygonPoints.push({ x: margin.left, y: margin.top + plotHeight });

  frequencyClasses.forEach((cls, i) => {
    const cx = margin.left + i * barWidth + barWidth / 2;
    const cy = margin.top + plotHeight - (cls.frequency / maxFreq) * plotHeight;
    polygonPoints.push({ x: cx, y: cy });
  });

  polygonPoints.push({ x: margin.left + plotWidth, y: margin.top + plotHeight });

  const polyPath = polygonPoints.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-white rounded-lg select-none">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = margin.top + plotHeight - ratio * plotHeight;
        const val = Math.round(ratio * maxFreq);
        return (
          <g key={ratio}>
            <line
              x1={margin.left}
              y1={y}
              x2={margin.left + plotWidth}
              y2={y}
              stroke="#e2e8f0"
              strokeDasharray={ratio > 0 ? "3 3" : "none"}
              strokeWidth={ratio === 0 ? 1.5 : 1}
            />
            <text x={margin.left - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
              {val}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {frequencyClasses.map((cls, i) => {
        const x = margin.left + i * barWidth;
        const barH = (cls.frequency / maxFreq) * plotHeight;
        const y = margin.top + plotHeight - barH;

        return (
          <g key={cls.index}>
            <rect
              x={x + 3}
              y={y}
              width={Math.max(barWidth - 6, 2)}
              height={Math.max(barH, 0)}
              fill="#10b981"
              opacity={0.85}
              rx={3}
            />
            {cls.frequency > 0 && (
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                className="text-[10px] font-bold fill-emerald-950 font-mono"
              >
                {cls.frequency}
              </text>
            )}
            <text
              x={x + barWidth / 2}
              y={margin.top + plotHeight + 16}
              textAnchor="middle"
              className="text-[9px] fill-slate-700 font-mono font-medium"
            >
              {cls.lowerLimit}-{cls.upperLimit}
            </text>
          </g>
        );
      })}

      {/* Polygon Line */}
      <path d={polyPath} fill="none" stroke="#065f46" strokeWidth="2.5" strokeLinecap="round" />

      {/* Points */}
      {polygonPoints.slice(1, -1).map((p, idx) => (
        <circle key={idx} cx={p.x} cy={p.y} r="3.5" fill="#ffffff" stroke="#065f46" strokeWidth="2" />
      ))}

      {/* Axis Labels */}
      <text
        x={margin.left + plotWidth / 2}
        y={height - 6}
        textAnchor="middle"
        className="text-[11px] font-semibold fill-slate-600"
      >
        Interval Kelas ({variableName})
      </text>
      <text
        x={-height / 2}
        y={14}
        transform="rotate(-90)"
        textAnchor="middle"
        className="text-[11px] font-semibold fill-slate-600"
      >
        Frekuensi (fi)
      </text>
    </svg>
  );
};

/**
 * 2. Kurva Distribusi Normal Baku (Gauss) & Z-Score Points
 */
export const NormalCurveChart: React.FC<ChartProps> = ({
  stats,
  zScores,
  variableName,
  width = 680,
  height = 320,
}) => {
  const margin = { top: 25, right: 25, bottom: 45, left: 50 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const zMin = -3.5;
  const zMax = 3.5;
  const zRange = zMax - zMin;
  const toX = (z: number) => margin.left + ((z - zMin) / zRange) * plotWidth;

  const maxDensity = 0.39894;
  const toY = (density: number) => margin.top + plotHeight - (density / maxDensity) * (plotHeight * 0.9);

  const steps = 120;
  const pathCoords: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const z = zMin + (i / steps) * zRange;
    const density = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
    pathCoords.push({ x: toX(z), y: toY(density) });
  }

  const bellPath = pathCoords.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const z1Minus = toX(-1);
  const z1Plus = toX(1);
  const z2Minus = toX(-2);
  const z2Plus = toX(2);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-white rounded-lg select-none">
      {/* 2 SD zone */}
      <rect x={z2Minus} y={margin.top} width={z2Plus - z2Minus} height={plotHeight} fill="#e0f2fe" opacity={0.4} />
      {/* 1 SD zone */}
      <rect x={z1Minus} y={margin.top} width={z1Plus - z1Minus} height={plotHeight} fill="#d1fae5" opacity={0.6} />

      {/* Axis markers */}
      {[-3, -2, -1, 0, 1, 2, 3].map((z) => {
        const x = toX(z);
        const rawVal = stats.mean + z * stats.stdDevSample;
        return (
          <g key={z}>
            <line
              x1={x}
              y1={margin.top}
              x2={x}
              y2={margin.top + plotHeight}
              stroke={z === 0 ? "#047857" : "#cbd5e1"}
              strokeWidth={z === 0 ? 1.8 : 1}
              strokeDasharray={z === 0 ? "none" : "3 3"}
            />
            <text
              x={x}
              y={margin.top + plotHeight + 15}
              textAnchor="middle"
              className={`text-[10px] font-mono font-bold ${z === 0 ? "fill-emerald-800" : "fill-slate-600"}`}
            >
              {z > 0 ? `+${z}` : z}
            </text>
            <text x={x} y={margin.top + plotHeight + 28} textAnchor="middle" className="text-[8px] font-mono fill-slate-400">
              X={rawVal.toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* Bell Curve */}
      <path d={bellPath} fill="none" stroke="#065f46" strokeWidth="2.5" strokeLinecap="round" />

      {/* Student data points */}
      {zScores.map((student) => {
        const zClamped = Math.max(zMin, Math.min(zMax, student.zScore));
        const cx = toX(zClamped);
        const density = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * zClamped * zClamped);
        const cy = toY(density);

        return (
          <circle
            key={student.id}
            cx={cx}
            cy={cy}
            r="3.5"
            fill="#059669"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
        );
      })}

      <text x={toX(0)} y={margin.top + 20} textAnchor="middle" className="text-[10px] font-bold fill-emerald-900">
        Kurva Lonceng Normal (Mean = {stats.mean.toFixed(1)}, SD = {stats.stdDevSample.toFixed(2)})
      </text>

      <text
        x={margin.left + plotWidth / 2}
        y={height - 6}
        textAnchor="middle"
        className="text-[11px] font-semibold fill-slate-600"
      >
        Nilai Baku Z (Standar Deviasi dari Rata-Rata)
      </text>
    </svg>
  );
};

/**
 * 3. Kurva Ogive Dual (Kumulatif Kurang Dari & Lebih Dari)
 */
export const OgiveChart: React.FC<ChartProps> = ({
  stats,
  frequencyClasses,
  width = 680,
  height = 320,
}) => {
  const margin = { top: 25, right: 25, bottom: 45, left: 50 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const totalN = stats.count || 1;

  const pointsPositive: { x: number; y: number }[] = [];
  const pointsNegative: { x: number; y: number }[] = [];

  pointsPositive.push({ x: margin.left, y: margin.top + plotHeight });
  pointsNegative.push({ x: margin.left, y: margin.top });

  const stepX = plotWidth / (frequencyClasses.length || 1);

  frequencyClasses.forEach((cls, i) => {
    const cx = margin.left + (i + 1) * stepX;
    const cyPos = margin.top + plotHeight - (cls.cumulativeLess / totalN) * plotHeight;
    const cyNeg = margin.top + plotHeight - (cls.cumulativeMore / totalN) * plotHeight;
    pointsPositive.push({ x: cx, y: cyPos });
    pointsNegative.push({ x: cx, y: cyNeg });
  });

  const pathPos = pointsPositive.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const pathNeg = pointsNegative.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-white rounded-lg select-none">
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = margin.top + plotHeight - ratio * plotHeight;
        const val = Math.round(ratio * totalN);
        return (
          <g key={ratio}>
            <line
              x1={margin.left}
              y1={y}
              x2={margin.left + plotWidth}
              y2={y}
              stroke="#e2e8f0"
              strokeDasharray="3 3"
            />
            <text x={margin.left - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
              {val}
            </text>
          </g>
        );
      })}

      <path d={pathPos} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
      <path d={pathNeg} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />

      {pointsPositive.map((p, idx) => (
        <circle key={`pos-${idx}`} cx={p.x} cy={p.y} r="3" fill="#ffffff" stroke="#059669" strokeWidth="2" />
      ))}
      {pointsNegative.map((p, idx) => (
        <circle key={`neg-${idx}`} cx={p.x} cy={p.y} r="3" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
      ))}

      {frequencyClasses.map((cls, i) => {
        const x = margin.left + (i + 1) * stepX;
        return (
          <text key={cls.index} x={x} y={margin.top + plotHeight + 16} textAnchor="middle" className="text-[9px] fill-slate-600 font-mono">
            {cls.upperBound.toFixed(1)}
          </text>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${width - 210}, ${margin.top + 8})`}>
        <rect width="185" height="42" rx="6" fill="#ffffff" stroke="#cbd5e1" />
        <line x1="10" y1="15" x2="30" y2="15" stroke="#059669" strokeWidth="2" />
        <text x="36" y="19" className="text-[9px] font-bold fill-emerald-800">
          Ogive Positif (fk ≤)
        </text>
        <line x1="10" y1="30" x2="30" y2="30" stroke="#2563eb" strokeWidth="2" />
        <text x="36" y="34" className="text-[9px] font-bold fill-blue-800">
          Ogive Negatif (fk ≥)
        </text>
      </g>

      <text
        x={margin.left + plotWidth / 2}
        y={height - 6}
        textAnchor="middle"
        className="text-[11px] font-semibold fill-slate-600"
      >
        Tepi Atas Kelas (Batas Nyata Atas)
      </text>
    </svg>
  );
};

/**
 * 4. Box and Whisker Plot (Diagram Kotak Garis)
 */
export const BoxPlotChart: React.FC<ChartProps> = ({
  stats,
  width = 680,
  height = 240,
}) => {
  const margin = { top: 25, right: 35, bottom: 45, left: 35 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const minVal = Math.min(stats.min, stats.q1 - 1.5 * stats.iqr);
  const maxVal = Math.max(stats.max, stats.q3 + 1.5 * stats.iqr);
  const valRange = maxVal - minVal || 1;
  const toX = (val: number) => margin.left + ((val - minVal) / valRange) * plotWidth;

  const boxY = margin.top + plotHeight * 0.25;
  const boxHeight = plotHeight * 0.45;

  const xMin = toX(stats.min);
  const xQ1 = toX(stats.q1);
  const xMed = toX(stats.median);
  const xQ3 = toX(stats.q3);
  const xMax = toX(stats.max);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-white rounded-lg select-none">
      {/* Whiskers */}
      <line x1={xMin} y1={boxY + boxHeight / 2} x2={xMax} y2={boxY + boxHeight / 2} stroke="#334155" strokeWidth="2" />
      <line x1={xMin} y1={boxY + boxHeight * 0.2} x2={xMin} y2={boxY + boxHeight * 0.8} stroke="#334155" strokeWidth="2.5" />
      <line x1={xMax} y1={boxY + boxHeight * 0.2} x2={xMax} y2={boxY + boxHeight * 0.8} stroke="#334155" strokeWidth="2.5" />

      {/* Box */}
      <rect
        x={xQ1}
        y={boxY}
        width={Math.max(xQ3 - xQ1, 2)}
        height={boxHeight}
        fill="#d1fae5"
        stroke="#059669"
        strokeWidth="2.5"
        rx={4}
      />

      {/* Median Line */}
      <line x1={xMed} y1={boxY} x2={xMed} y2={boxY + boxHeight} stroke="#dc2626" strokeWidth="3" />

      {/* Mean Marker */}
      <polygon
        points={`
          ${toX(stats.mean)},${boxY + boxHeight / 2 - 7}
          ${toX(stats.mean) + 7},${boxY + boxHeight / 2}
          ${toX(stats.mean)},${boxY + boxHeight / 2 + 7}
          ${toX(stats.mean) - 7},${boxY + boxHeight / 2}
        `}
        fill="#2563eb"
        stroke="#ffffff"
        strokeWidth="1.2"
      />

      {/* Labels */}
      <text x={xMin} y={boxY - 8} textAnchor="middle" className="text-[10px] font-mono font-bold fill-slate-700">
        Min: {stats.min}
      </text>
      <text x={xQ1} y={boxY + boxHeight + 16} textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-800">
        Q1: {stats.q1.toFixed(1)}
      </text>
      <text x={xMed} y={boxY - 8} textAnchor="middle" className="text-[10px] font-mono font-black fill-rose-700">
        Median: {stats.median.toFixed(1)}
      </text>
      <text x={xQ3} y={boxY + boxHeight + 16} textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-800">
        Q3: {stats.q3.toFixed(1)}
      </text>
      <text x={xMax} y={boxY - 8} textAnchor="middle" className="text-[10px] font-mono font-bold fill-slate-700">
        Max: {stats.max}
      </text>

      <text
        x={margin.left + plotWidth / 2}
        y={height - 6}
        textAnchor="middle"
        className="text-[11px] font-semibold fill-slate-600"
      >
        Diagram Kotak Garis (IQR = {stats.iqr.toFixed(2)}, Simpangan Kuartil = {stats.quartileDeviation.toFixed(2)})
      </text>
    </svg>
  );
};
