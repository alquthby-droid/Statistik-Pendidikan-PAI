import React, { useState } from "react";
import {
  PieChart,
  BarChart,
  TrendingUp,
  Activity,
  Download,
  Info,
  Layers,
} from "lucide-react";
import { DescriptiveStats, FrequencyClass, ZScoreItem } from "../types";

interface GrafikViewProps {
  stats: DescriptiveStats | null;
  frequencyClasses: FrequencyClass[];
  zScores: ZScoreItem[];
  variableName: string;
}

export const GrafikView: React.FC<GrafikViewProps> = ({
  stats,
  frequencyClasses,
  zScores,
  variableName,
}) => {
  const [activeChart, setActiveChart] = useState<"histogram" | "normal" | "ogive" | "boxplot">("histogram");
  const [hoveredClass, setHoveredClass] = useState<FrequencyClass | null>(null);
  const [hoveredStudent, setHoveredStudent] = useState<ZScoreItem | null>(null);

  if (!stats || frequencyClasses.length === 0 || zScores.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <p className="text-slate-500">Belum ada data untuk menghasilkan grafik statistik.</p>
      </div>
    );
  }

  // Sizing constants for responsive SVG
  const width = 760;
  const height = 360;
  const margin = { top: 30, right: 35, bottom: 50, left: 55 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // Max frequency for histogram
  const maxFreq = Math.max(...frequencyClasses.map((c) => c.frequency), 1);
  const totalN = stats.count;

  // Render Chart 1: Histogram & Frequency Polygon
  const renderHistogram = () => {
    const barWidth = plotWidth / frequencyClasses.length;

    // Build polygon path points
    const polygonPoints: { x: number; y: number }[] = [];

    // Anchor polygon at 0 before first class
    polygonPoints.push({
      x: margin.left,
      y: margin.top + plotHeight,
    });

    frequencyClasses.forEach((cls, i) => {
      const cx = margin.left + i * barWidth + barWidth / 2;
      const cy = margin.top + plotHeight - (cls.frequency / maxFreq) * plotHeight;
      polygonPoints.push({ x: cx, y: cy });
    });

    // Anchor polygon at 0 after last class
    polygonPoints.push({
      x: margin.left + plotWidth,
      y: margin.top + plotHeight,
    });

    const polyPath = polygonPoints.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
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
                strokeDasharray={ratio > 0 ? "4 4" : "none"}
                strokeWidth={ratio === 0 ? 1.5 : 1}
              />
              <text
                x={margin.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Histogram Bars */}
        {frequencyClasses.map((cls, i) => {
          const x = margin.left + i * barWidth;
          const barH = (cls.frequency / maxFreq) * plotHeight;
          const y = margin.top + plotHeight - barH;
          const isHovered = hoveredClass?.index === cls.index;

          return (
            <g
              key={cls.index}
              onMouseEnter={() => setHoveredClass(cls)}
              onMouseLeave={() => setHoveredClass(null)}
              className="cursor-pointer transition-all"
            >
              <rect
                x={x + 3}
                y={y}
                width={barWidth - 6}
                height={Math.max(barH, 0)}
                fill={isHovered ? "#047857" : "#10b981"}
                opacity={isHovered ? 0.95 : 0.8}
                rx={4}
                className="transition-colors duration-150"
              />
              {/* Frequency text above bar */}
              {cls.frequency > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  className="text-[11px] font-bold fill-emerald-950 font-mono"
                >
                  {cls.frequency}
                </text>
              )}

              {/* Class interval label on X axis */}
              <text
                x={x + barWidth / 2}
                y={margin.top + plotHeight + 18}
                textAnchor="middle"
                className="text-[10px] fill-slate-700 font-mono font-medium"
              >
                {cls.lowerLimit} - {cls.upperLimit}
              </text>
              <text
                x={x + barWidth / 2}
                y={margin.top + plotHeight + 32}
                textAnchor="middle"
                className="text-[9px] fill-slate-400 font-mono"
              >
                Xi={cls.midpoint.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Poligon Frekuensi line overlay */}
        <path
          d={polyPath}
          fill="none"
          stroke="#0f766e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Polygon Points */}
        {polygonPoints.slice(1, -1).map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r="4.5"
            fill="#ffffff"
            stroke="#0f766e"
            strokeWidth="2.5"
          />
        ))}

        {/* Axis Labels */}
        <text
          x={margin.left + plotWidth / 2}
          y={height - 6}
          textAnchor="middle"
          className="text-xs font-semibold fill-slate-600"
        >
          Interval Skor ({variableName})
        </text>
        <text
          x={-height / 2}
          y={15}
          transform="rotate(-90)"
          textAnchor="middle"
          className="text-xs font-semibold fill-slate-600"
        >
          Frekuensi Siswa (fi)
        </text>
      </svg>
    );
  };

  // Render Chart 2: Standard Normal Distribution Curve & Z-Score Points
  const renderNormalCurve = () => {
    const zMin = -3.5;
    const zMax = 3.5;
    const zRange = zMax - zMin;

    const toX = (z: number) => margin.left + ((z - zMin) / zRange) * plotWidth;

    // Normal probability density: f(z) = (1 / sqrt(2*PI)) * exp(-0.5 * z^2)
    const maxDensity = 0.39894; // at z = 0
    const toY = (density: number) => margin.top + plotHeight - (density / maxDensity) * (plotHeight * 0.9);

    // Generate path for the bell curve
    const steps = 140;
    const pathCoords: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const z = zMin + (i / steps) * zRange;
      const density = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
      pathCoords.push({ x: toX(z), y: toY(density), z });
    }

    const bellPath = pathCoords.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    // Standard deviation shaded zones
    const z1Minus = toX(-1);
    const z1Plus = toX(1);
    const z2Minus = toX(-2);
    const z2Plus = toX(2);

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
        {/* Shaded bands for 1 sigma and 2 sigma */}
        <rect
          x={z2Minus}
          y={margin.top}
          width={z2Plus - z2Minus}
          height={plotHeight}
          fill="#e0f2fe"
          opacity={0.4}
        />
        <rect
          x={z1Minus}
          y={margin.top}
          width={z1Plus - z1Minus}
          height={plotHeight}
          fill="#d1fae5"
          opacity={0.6}
        />

        {/* Grid and Z tick markers */}
        {[-3, -2, -1, 0, 1, 2, 3].map((z) => {
          const x = toX(z);
          const rawEquiv = stats.mean + z * stats.stdDevSample;
          return (
            <g key={z}>
              <line
                x1={x}
                y1={margin.top}
                x2={x}
                y2={margin.top + plotHeight}
                stroke={z === 0 ? "#047857" : "#cbd5e1"}
                strokeWidth={z === 0 ? 2 : 1}
                strokeDasharray={z === 0 ? "none" : "3 3"}
              />
              <text
                x={x}
                y={margin.top + plotHeight + 16}
                textAnchor="middle"
                className={`text-[11px] font-mono font-bold ${z === 0 ? "fill-emerald-800" : "fill-slate-600"}`}
              >
                {z > 0 ? `+${z}` : z}
              </text>
              <text
                x={x}
                y={margin.top + plotHeight + 30}
                textAnchor="middle"
                className="text-[9px] font-mono fill-slate-400"
              >
                X={rawEquiv.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Bell Curve Line */}
        <path
          d={bellPath}
          fill="none"
          stroke="#065f46"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Individual Student Dots on the curve */}
        {zScores.map((student) => {
          const zClamped = Math.max(zMin, Math.min(zMax, student.zScore));
          const cx = toX(zClamped);
          const density = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * zClamped * zClamped);
          const cy = toY(density);
          const isHovered = hoveredStudent?.id === student.id;

          return (
            <circle
              key={student.id}
              cx={cx}
              cy={cy}
              r={isHovered ? 6.5 : 4}
              fill={isHovered ? "#dc2626" : "#059669"}
              stroke="#ffffff"
              strokeWidth={isHovered ? 2.5 : 1.5}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredStudent(student)}
              onMouseLeave={() => setHoveredStudent(null)}
            />
          );
        })}

        {/* Labels for percentage areas */}
        <text
          x={toX(0)}
          y={margin.top + 35}
          textAnchor="middle"
          className="text-xs font-bold fill-emerald-900"
        >
          68.26% Area (±1 SD)
        </text>
        <text
          x={toX(0)}
          y={margin.top + 50}
          textAnchor="middle"
          className="text-[10px] fill-slate-500"
        >
          95.44% Area (±2 SD)
        </text>

        {/* Bottom Label */}
        <text
          x={margin.left + plotWidth / 2}
          y={height - 6}
          textAnchor="middle"
          className="text-xs font-semibold fill-slate-700"
        >
          Skor Baku Z (Deviasi dari Rata-rata X̄ = {stats.mean.toFixed(1)})
        </text>
      </svg>
    );
  };

  // Render Chart 3: Ogive (Positive & Negative Cumulative Frequency)
  const renderOgive = () => {
    // Points for positive ogive (cumulativeLess, fk <=)
    // Points for negative ogive (cumulativeMore, fk >=)
    const pointsPositive: { x: number; y: number; label: string }[] = [];
    const pointsNegative: { x: number; y: number; label: string }[] = [];

    // Starting edge
    pointsPositive.push({
      x: margin.left,
      y: margin.top + plotHeight,
      label: `${frequencyClasses[0].lowerBound.toFixed(1)} (0)`,
    });
    pointsNegative.push({
      x: margin.left,
      y: margin.top,
      label: `${frequencyClasses[0].lowerBound.toFixed(1)} (${totalN})`,
    });

    const stepX = plotWidth / frequencyClasses.length;

    frequencyClasses.forEach((cls, i) => {
      const cx = margin.left + (i + 1) * stepX;
      const cyPos = margin.top + plotHeight - (cls.cumulativeLess / totalN) * plotHeight;
      const cyNeg = margin.top + plotHeight - (cls.cumulativeMore / totalN) * plotHeight;

      pointsPositive.push({ x: cx, y: cyPos, label: `${cls.upperBound.toFixed(1)} (${cls.cumulativeLess})` });
      pointsNegative.push({ x: cx, y: cyNeg, label: `${cls.upperBound.toFixed(1)} (${cls.cumulativeMore})` });
    });

    const pathPos = pointsPositive.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const pathNeg = pointsNegative.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
        {/* Y Axis grid lines (0 to N) */}
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
              <text
                x={margin.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {val} ({Math.round(ratio * 100)}%)
              </text>
            </g>
          );
        })}

        {/* Positive Ogive Line */}
        <path d={pathPos} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
        {/* Negative Ogive Line */}
        <path d={pathNeg} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />

        {/* Positive Ogive Points */}
        {pointsPositive.map((p, idx) => (
          <circle key={`pos-${idx}`} cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#059669" strokeWidth="2" />
        ))}
        {/* Negative Ogive Points */}
        {pointsNegative.map((p, idx) => (
          <circle key={`neg-${idx}`} cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
        ))}

        {/* X Axis Ticks */}
        {frequencyClasses.map((cls, i) => {
          const x = margin.left + (i + 1) * stepX;
          return (
            <text
              key={cls.index}
              x={x}
              y={margin.top + plotHeight + 18}
              textAnchor="middle"
              className="text-[10px] fill-slate-600 font-mono"
            >
              {cls.upperBound.toFixed(1)}
            </text>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${width - 240}, ${margin.top + 10})`}>
          <rect width="210" height="48" rx="8" fill="#ffffff" stroke="#e2e8f0" opacity="0.95" />
          <line x1="12" y1="18" x2="36" y2="18" stroke="#059669" strokeWidth="2.5" />
          <circle cx="24" cy="18" r="3.5" fill="#ffffff" stroke="#059669" strokeWidth="2" />
          <text x="44" y="22" className="text-[11px] font-semibold fill-emerald-800">
            Ogive Positif (fk ≤ Kurang Dari)
          </text>

          <line x1="12" y1="36" x2="36" y2="36" stroke="#2563eb" strokeWidth="2.5" />
          <circle cx="24" cy="36" r="3.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
          <text x="44" y="40" className="text-[11px] font-semibold fill-blue-800">
            Ogive Negatif (fk ≥ Lebih Dari)
          </text>
        </g>

        {/* Label */}
        <text
          x={margin.left + plotWidth / 2}
          y={height - 6}
          textAnchor="middle"
          className="text-xs font-semibold fill-slate-700"
        >
          Batas Nyata Atas Kelas (Tepi Atas)
        </text>
      </svg>
    );
  };

  // Render Chart 4: Box and Whisker Plot
  const renderBoxPlot = () => {
    const minVal = Math.min(stats.min, stats.q1 - 1.5 * stats.iqr);
    const maxVal = Math.max(stats.max, stats.q3 + 1.5 * stats.iqr);
    const valRange = maxVal - minVal || 1;

    const toX = (val: number) => margin.left + ((val - minVal) / valRange) * plotWidth;

    const boxY = margin.top + plotHeight * 0.35;
    const boxHeight = plotHeight * 0.3;

    const xMin = toX(stats.min);
    const xQ1 = toX(stats.q1);
    const xMed = toX(stats.median);
    const xQ3 = toX(stats.q3);
    const xMax = toX(stats.max);

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
        {/* Horizontal whisker line */}
        <line
          x1={xMin}
          y1={boxY + boxHeight / 2}
          x2={xMax}
          y2={boxY + boxHeight / 2}
          stroke="#475569"
          strokeWidth="2"
        />

        {/* Whiskers caps */}
        <line
          x1={xMin}
          y1={boxY + boxHeight * 0.15}
          x2={xMin}
          y2={boxY + boxHeight * 0.85}
          stroke="#475569"
          strokeWidth="2.5"
        />
        <line
          x1={xMax}
          y1={boxY + boxHeight * 0.15}
          x2={xMax}
          y2={boxY + boxHeight * 0.85}
          stroke="#475569"
          strokeWidth="2.5"
        />

        {/* The Box (Q1 to Q3) */}
        <rect
          x={xQ1}
          y={boxY}
          width={Math.max(xQ3 - xQ1, 2)}
          height={boxHeight}
          fill="#d1fae5"
          stroke="#059669"
          strokeWidth="2.5"
          rx={6}
        />

        {/* Median Line */}
        <line
          x1={xMed}
          y1={boxY}
          x2={xMed}
          y2={boxY + boxHeight}
          stroke="#dc2626"
          strokeWidth="3.5"
        />

        {/* Mean diamond marker */}
        <polygon
          points={`
            ${toX(stats.mean)},${boxY + boxHeight / 2 - 8}
            ${toX(stats.mean) + 8},${boxY + boxHeight / 2}
            ${toX(stats.mean)},${boxY + boxHeight / 2 + 8}
            ${toX(stats.mean) - 8},${boxY + boxHeight / 2}
          `}
          fill="#2563eb"
          stroke="#ffffff"
          strokeWidth="1.5"
        />

        {/* Numeric Labels */}
        <text x={xMin} y={boxY - 12} textAnchor="middle" className="text-[11px] font-mono font-bold fill-slate-700">
          Min: {stats.min}
        </text>
        <text x={xQ1} y={boxY + boxHeight + 20} textAnchor="middle" className="text-[11px] font-mono font-bold fill-emerald-800">
          Q1: {stats.q1.toFixed(1)}
        </text>
        <text x={xMed} y={boxY - 12} textAnchor="middle" className="text-[11px] font-mono font-black fill-rose-700">
          Median: {stats.median.toFixed(1)}
        </text>
        <text x={xQ3} y={boxY + boxHeight + 20} textAnchor="middle" className="text-[11px] font-mono font-bold fill-emerald-800">
          Q3: {stats.q3.toFixed(1)}
        </text>
        <text x={xMax} y={boxY - 12} textAnchor="middle" className="text-[11px] font-mono font-bold fill-slate-700">
          Max: {stats.max}
        </text>

        {/* Bottom scale */}
        <line
          x1={margin.left}
          y1={margin.top + plotHeight}
          x2={margin.left + plotWidth}
          y2={margin.top + plotHeight}
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />

        <text
          x={margin.left + plotWidth / 2}
          y={height - 10}
          textAnchor="middle"
          className="text-xs font-semibold fill-slate-700"
        >
          Distribusi Skor Nilai Siswa (IQR = {stats.iqr.toFixed(2)})
        </text>
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <PieChart className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-800">
                Visualisasi Grafik Statistik Pendidikan S2 PAI
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Visualisasi grafik lengkap: Histogram Frekuensi, Poligon, Kurva Normal Standar Z-Score, Ogive Kumulatif, dan Boxplot.
            </p>
          </div>

          {/* Chart Type Selector Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl gap-1 self-start md:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveChart("histogram")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeChart === "histogram"
                  ? "bg-white text-emerald-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart className="w-3.5 h-3.5" />
              Histogram & Poligon
            </button>
            <button
              onClick={() => setActiveChart("normal")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeChart === "normal"
                  ? "bg-white text-emerald-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Kurva Normal & Z-Score
            </button>
            <button
              onClick={() => setActiveChart("ogive")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeChart === "ogive"
                  ? "bg-white text-emerald-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Kurva Ogive (Dual)
            </button>
            <button
              onClick={() => setActiveChart("boxplot")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeChart === "boxplot"
                  ? "bg-white text-emerald-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Boxplot (Kotak Garis)
            </button>
          </div>
        </div>

        {/* Active Chart Display Container */}
        <div className="mt-6 bg-slate-50/50 rounded-2xl p-4 sm:p-6 border border-slate-200/80">
          <div className="max-w-3xl mx-auto">
            {activeChart === "histogram" && renderHistogram()}
            {activeChart === "normal" && renderNormalCurve()}
            {activeChart === "ogive" && renderOgive()}
            {activeChart === "boxplot" && renderBoxPlot()}
          </div>

          {/* Dynamic Tooltip / Inspect Details */}
          {hoveredClass && activeChart === "histogram" && (
            <div className="mt-4 p-3 bg-white border border-emerald-200 rounded-xl text-xs text-slate-800 flex items-center justify-between shadow-xs">
              <span className="font-semibold text-emerald-900">
                Kelas {hoveredClass.index} (Interval: {hoveredClass.lowerLimit} - {hoveredClass.upperLimit}, Tepi: {hoveredClass.lowerBound.toFixed(1)} - {hoveredClass.upperBound.toFixed(1)})
              </span>
              <span className="font-mono font-bold text-slate-900">
                Frekuensi: {hoveredClass.frequency} siswa ({hoveredClass.relativeFreq.toFixed(1)}%) • fk ≤ {hoveredClass.cumulativeLess}
              </span>
            </div>
          )}

          {hoveredStudent && activeChart === "normal" && (
            <div className="mt-4 p-3 bg-white border border-emerald-200 rounded-xl text-xs text-slate-800 flex items-center justify-between shadow-xs">
              <span className="font-semibold text-emerald-900">
                👤 {hoveredStudent.label} (Nilai Mentah: {hoveredStudent.score})
              </span>
              <span className="font-mono font-bold text-slate-900">
                Z-Score: {hoveredStudent.zScore >= 0 ? `+${hoveredStudent.zScore.toFixed(3)}` : hoveredStudent.zScore.toFixed(3)} • T-Score: {hoveredStudent.tScore.toFixed(1)} • Kategori: {hoveredStudent.category}
              </span>
            </div>
          )}
        </div>

        {/* Explanation Card */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-600">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-700" />
            Panduan Pembacaan Grafik Mata Kuliah S2 PAI:
          </div>
          {activeChart === "histogram" && (
            <p>
              Histogram menampilkan sebaran frekuensi data per interval kelas, sedangkan garis hijau tua (Poligon Frekuensi) menghubungkan titik tengah masing-masing kelas. Puncak poligon menunjukkan interval nilai yang paling banyak diperoleh mahasiswa.
            </p>
          )}
          {activeChart === "normal" && (
            <p>
              Kurva Lonceng Normal Standar (Gauss) menunjukkan posisi Z-Score setiap mahasiswa. Area hijau muda mencakup ±1 standar deviasi (68.26% data populasi normal). Titik-titik hijau mewakili mahasiswa aktual pada variabel "{variableName}".
            </p>
          )}
          {activeChart === "ogive" && (
            <p>
              Kurva Ogive Positif (hijau) menunjukkan frekuensi kumulatif kurang dari, sedangkan Ogive Negatif (biru) menunjukkan frekuensi kumulatif lebih dari. Titik potong kedua kurva menandai perkiraan nilai Median (Me = {stats.median.toFixed(1)}).
            </p>
          )}
          {activeChart === "boxplot" && (
            <p>
              Boxplot (Diagram Kotak Garis) merangkum 5 angka statistik penting: Nilai Minimum ({stats.min}), Kuartil 1 ({stats.q1.toFixed(1)}), Median ({stats.median.toFixed(1)} - garis merah), Kuartil 3 ({stats.q3.toFixed(1)}), dan Nilai Maksimum ({stats.max}).
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
