import React, { useState } from "react";
import {
  BarChart2,
  Sigma,
  Activity,
  Maximize2,
  Copy,
  Check,
  HelpCircle,
  TrendingUp,
  Award,
} from "lucide-react";
import { DescriptiveStats, DataRow } from "../types";

interface DispersiSebaranViewProps {
  stats: DescriptiveStats | null;
  dataTitle: string;
  variableName: string;
  dataRows: DataRow[];
}

export const DispersiSebaranView: React.FC<DispersiSebaranViewProps> = ({
  stats,
  dataTitle,
  variableName,
  dataRows,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [showFormulas, setShowFormulas] = useState<boolean>(true);

  if (!stats || dataRows.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <p className="text-slate-500">Belum ada data untuk dianalisis sebarannya. Silakan unggah foto atau masukkan data terlebih dahulu.</p>
      </div>
    );
  }

  const handleCopyText = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sortedScores = [...dataRows.map((r) => r.score)].sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <BarChart2 className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-800">
                Analisis Sebaran & Ukuran Pemusatan Data
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Variabel: <span className="font-semibold text-emerald-800">{variableName}</span> ({dataTitle}) • N = {stats.count}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFormulas(!showFormulas)}
              className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              {showFormulas ? "Sembunyikan Rumus" : "Tampilkan Rumus & Cara Kerja"}
            </button>
          </div>
        </div>

        {/* 3 Main Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          {/* Card 1: Ukuran Pemusatan (Central Tendency) */}
          <div className="bg-gradient-to-br from-emerald-50/70 to-emerald-100/30 rounded-xl p-5 border border-emerald-200/80">
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3 mb-3">
              <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                <Sigma className="w-4 h-4 text-emerald-700" />
                1. Ukuran Pemusatan
              </h3>
              <span className="text-[11px] font-semibold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded">
                Central Tendency
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                <div>
                  <span className="text-xs text-slate-500 block">Mean (Rata-rata Hitung / X̄):</span>
                  <span className="text-xs text-emerald-700 font-mono">ΣX / N</span>
                </div>
                <span className="text-xl font-black text-slate-900 font-mono">
                  {stats.mean.toFixed(2)}
                </span>
              </div>

              <div className="flex items-baseline justify-between bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                <div>
                  <span className="text-xs text-slate-500 block">Median (Nilai Tengah / Me):</span>
                  <span className="text-xs text-emerald-700 font-mono">Data ke-(N+1)/2</span>
                </div>
                <span className="text-xl font-black text-slate-900 font-mono">
                  {stats.median.toFixed(2)}
                </span>
              </div>

              <div className="flex items-baseline justify-between bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                <div>
                  <span className="text-xs text-slate-500 block">Modus (Nilai Terbanyak / Mo):</span>
                  <span className="text-xs text-emerald-700 font-mono">
                    {stats.modeFrequency > 1 ? `Frekuensi = ${stats.modeFrequency}` : "Unik"}
                  </span>
                </div>
                <span className="text-lg font-bold text-slate-900 font-mono">
                  {stats.mode.length > 0 ? stats.mode.join(", ") : "Tidak Ada"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Ukuran Dispersi & Variabilitas (Sebaran) */}
          <div className="bg-gradient-to-br from-blue-50/70 to-blue-100/30 rounded-xl p-5 border border-blue-200/80">
            <div className="flex items-center justify-between border-b border-blue-200/60 pb-3 mb-3">
              <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-700" />
                2. Ukuran Sebaran & Dispersi
              </h3>
              <span className="text-[11px] font-semibold bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded">
                Variability
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between bg-white/80 p-2.5 rounded-lg border border-blue-100">
                <div>
                  <span className="text-xs text-slate-500 block">Standar Deviasi Sampel (s):</span>
                  <span className="text-xs text-blue-700 font-mono">√[Σ(X - X̄)² / (n - 1)]</span>
                </div>
                <span className="text-xl font-black text-slate-900 font-mono">
                  {stats.stdDevSample.toFixed(2)}
                </span>
              </div>

              <div className="flex items-baseline justify-between bg-white/80 p-2.5 rounded-lg border border-blue-100">
                <div>
                  <span className="text-xs text-slate-500 block">Varians Sampel (s²):</span>
                  <span className="text-xs text-blue-700 font-mono">s²</span>
                </div>
                <span className="text-xl font-black text-slate-900 font-mono">
                  {stats.varianceSample.toFixed(2)}
                </span>
              </div>

              <div className="flex items-baseline justify-between bg-white/80 p-2.5 rounded-lg border border-blue-100">
                <div>
                  <span className="text-xs text-slate-500 block">Jangkauan / Range (R):</span>
                  <span className="text-xs text-blue-700 font-mono">Xmax - Xmin ({stats.max} - {stats.min})</span>
                </div>
                <span className="text-xl font-black text-slate-900 font-mono">
                  {stats.range.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Ukuran Letak & Fraktil (Quartiles & Error) */}
          <div className="bg-gradient-to-br from-amber-50/70 to-amber-100/30 rounded-xl p-5 border border-amber-200/80">
            <div className="flex items-center justify-between border-b border-amber-200/60 pb-3 mb-3">
              <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-700" />
                3. Ukuran Letak & Kuartil
              </h3>
              <span className="text-[11px] font-semibold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
                Fractiles & Error
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between bg-white/80 p-2.5 rounded-lg border border-amber-100">
                <div>
                  <span className="text-xs text-slate-500 block">Kuartil 1 (Q1) & Kuartil 3 (Q3):</span>
                  <span className="text-xs text-amber-800 font-mono">25% & 75% Data</span>
                </div>
                <span className="text-sm font-bold text-slate-900 font-mono">
                  Q1: {stats.q1.toFixed(1)} | Q3: {stats.q3.toFixed(1)}
                </span>
              </div>

              <div className="flex items-baseline justify-between bg-white/80 p-2.5 rounded-lg border border-amber-100">
                <div>
                  <span className="text-xs text-slate-500 block">Jangkauan Antarkuartil (IQR):</span>
                  <span className="text-xs text-amber-800 font-mono">Q3 - Q1</span>
                </div>
                <span className="text-xl font-black text-slate-900 font-mono">
                  {stats.iqr.toFixed(2)}
                </span>
              </div>

              <div className="flex items-baseline justify-between bg-white/80 p-2.5 rounded-lg border border-amber-100">
                <div>
                  <span className="text-xs text-slate-500 block">Koefisien Variasi (CV):</span>
                  <span className="text-xs text-amber-800 font-mono">(s / X̄) × 100%</span>
                </div>
                <span className="text-lg font-bold text-slate-900 font-mono">
                  {stats.coefVariation.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Extended Stats Summary Table */}
        <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Ringkasan Tabel Statistik Deskriptif (Format SPSS & Skripsi/Tesis)
            </h4>
            <button
              onClick={() => {
                const text = `Tabel Statistik Deskriptif (${variableName})\n` +
                  `Jumlah Data (N): ${stats.count}\n` +
                  `Nilai Minimum: ${stats.min}\n` +
                  `Nilai Maksimum: ${stats.max}\n` +
                  `Range (Rentang): ${stats.range}\n` +
                  `Mean: ${stats.mean.toFixed(2)}\n` +
                  `Median: ${stats.median.toFixed(2)}\n` +
                  `Modus: ${stats.mode.join(", ") || "-"}\n` +
                  `Standar Deviasi (s): ${stats.stdDevSample.toFixed(2)}\n` +
                  `Varians (s²): ${stats.varianceSample.toFixed(2)}\n` +
                  `Standard Error of Mean: ${stats.stdErrorMean.toFixed(2)}\n` +
                  `Kuartil 1 (Q1): ${stats.q1.toFixed(2)}\n` +
                  `Kuartil 2 (Q2): ${stats.q2.toFixed(2)}\n` +
                  `Kuartil 3 (Q3): ${stats.q3.toFixed(2)}\n` +
                  `IQR: ${stats.iqr.toFixed(2)}\n` +
                  `Simpangan Kuartil (Qd): ${stats.quartileDeviation.toFixed(2)}\n` +
                  `Skewness: ${stats.skewness.toFixed(2)}\n` +
                  `Kurtosis: ${stats.kurtosis.toFixed(2)}`;
                handleCopyText(text, "table-summary");
              }}
              className="text-xs px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-600 font-medium rounded border border-slate-300 flex items-center gap-1"
            >
              {copiedSection === "table-summary" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === "table-summary" ? "Tersalin" : "Salin Format Teks"}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 divide-x divide-y divide-slate-200 text-xs">
            <div className="p-3">
              <span className="text-slate-400 block">Jumlah Data (N)</span>
              <span className="font-bold text-slate-800 text-sm font-mono">{stats.count}</span>
            </div>
            <div className="p-3">
              <span className="text-slate-400 block">Nilai Minimum</span>
              <span className="font-bold text-slate-800 text-sm font-mono">{stats.min}</span>
            </div>
            <div className="p-3">
              <span className="text-slate-400 block">Nilai Maksimum</span>
              <span className="font-bold text-slate-800 text-sm font-mono">{stats.max}</span>
            </div>
            <div className="p-3">
              <span className="text-slate-400 block">Std. Error Mean</span>
              <span className="font-bold text-slate-800 text-sm font-mono">{stats.stdErrorMean.toFixed(2)}</span>
            </div>
            <div className="p-3">
              <span className="text-slate-400 block">Simpangan Kuartil (Qd)</span>
              <span className="font-bold text-slate-800 text-sm font-mono">{stats.quartileDeviation.toFixed(2)}</span>
            </div>
            <div className="p-3">
              <span className="text-slate-400 block">Standar Deviasi Pop (σ)</span>
              <span className="font-bold text-slate-800 text-sm font-mono">{stats.stdDevPop.toFixed(2)}</span>
            </div>
            <div className="p-3">
              <span className="text-slate-400 block">Kemiringan (Skewness)</span>
              <span className="font-bold text-slate-800 text-sm font-mono">{stats.skewness.toFixed(3)}</span>
            </div>
            <div className="p-3">
              <span className="text-slate-400 block">Keruncingan (Kurtosis)</span>
              <span className="font-bold text-slate-800 text-sm font-mono">{stats.kurtosis.toFixed(3)}</span>
            </div>
            <div className="p-3">
              <span className="text-slate-400 block">Varians Pop (σ²)</span>
              <span className="font-bold text-slate-800 text-sm font-mono">{stats.variancePop.toFixed(2)}</span>
            </div>
            <div className="p-3">
              <span className="text-slate-400 block">Jumlah Skor (ΣX)</span>
              <span className="font-bold text-slate-800 text-sm font-mono">{stats.sum.toFixed(1)}</span>
            </div>
            <div className="p-3">
              <span className="text-slate-400 block">Kuartil 1 (Q1)</span>
              <span className="font-bold text-slate-800 text-sm font-mono">{stats.q1.toFixed(2)}</span>
            </div>
            <div className="p-3">
              <span className="text-slate-400 block">Kuartil 3 (Q3)</span>
              <span className="font-bold text-slate-800 text-sm font-mono">{stats.q3.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Manual Calculation Section (For S2 PAI Assignment Sheet) */}
      {showFormulas && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              Langkah-Langkah Perhitungan Manual (Pedoman Tugas S2 PAI)
            </h3>
            <p className="text-xs text-slate-500">
              Uraian sistematis langkah kerja perhitungan statistik sebaran sesuai standar tugas mata kuliah Statistik Pendidikan S2 PAI.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            {/* Step 1 */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1 text-emerald-900">
                Langkah 1: Mengurutkan Data dari Terkecil ke Terbesar (Array Data)
              </h4>
              <p className="text-xs text-slate-500 mb-2">
                Data terurut mempermudah penentuan nilai minimum, maksimum, median, dan kuartil.
              </p>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-xs overflow-x-auto text-slate-800">
                {sortedScores.join(", ")}
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1 text-emerald-900">
                Langkah 2: Menghitung Rata-Rata Hitung (Mean / X̄)
              </h4>
              <p className="text-xs text-slate-600 mb-2">
                Rumus: <span className="font-mono font-bold">X̄ = (ΣX) / N</span>
              </p>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                X̄ = {stats.sum.toFixed(1)} / {stats.count} = <strong className="text-emerald-800">{stats.mean.toFixed(4)}</strong> (dibulatkan menjadi <strong>{stats.mean.toFixed(2)}</strong>)
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1 text-emerald-900">
                Langkah 3: Menghitung Median (Me) & Modus (Mo)
              </h4>
              <p className="text-xs text-slate-600 mb-2">
                Karena N = {stats.count} ({stats.count % 2 === 0 ? "genap" : "ganjil"}), posisi median adalah di tengah data:
              </p>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
                <p>Median (Me) = <strong>{stats.median.toFixed(2)}</strong></p>
                <p>Modus (Mo) = <strong>{stats.mode.length > 0 ? stats.mode.join(", ") : "Tidak ada nilai berulang"}</strong> (muncul sebanyak {stats.modeFrequency} kali)</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1 text-emerald-900">
                Langkah 4: Menghitung Varians (s²) dan Standar Deviasi (s)
              </h4>
              <p className="text-xs text-slate-600 mb-2">
                Rumus Varians Sampel: <span className="font-mono font-bold">s² = Σ(X - X̄)² / (n - 1)</span>
              </p>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
                <p>Jumlah Kuadrat Selisih Σ(X - X̄)² = {(stats.varianceSample * (stats.count - 1)).toFixed(2)}</p>
                <p>s² = {(stats.varianceSample * (stats.count - 1)).toFixed(2)} / ({stats.count} - 1) = <strong>{stats.varianceSample.toFixed(4)}</strong> (≈ {stats.varianceSample.toFixed(2)})</p>
                <p>s = √({stats.varianceSample.toFixed(4)}) = <strong className="text-emerald-800">{stats.stdDevSample.toFixed(4)}</strong> (≈ {stats.stdDevSample.toFixed(2)})</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1 text-emerald-900">
                Langkah 5: Menghitung Kuartil & Simpangan Kuartil (Qd)
              </h4>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
                <p>Kuartil Bawah (Q1) = <strong>{stats.q1.toFixed(2)}</strong></p>
                <p>Kuartil Tengah / Median (Q2) = <strong>{stats.q2.toFixed(2)}</strong></p>
                <p>Kuartil Atas (Q3) = <strong>{stats.q3.toFixed(2)}</strong></p>
                <p>Jangkauan Antarkuartil (IQR) = Q3 - Q1 = {stats.q3.toFixed(2)} - {stats.q1.toFixed(2)} = <strong>{stats.iqr.toFixed(2)}</strong></p>
                <p>Simpangan Kuartil (Qd) = 1/2 × IQR = <strong>{stats.quartileDeviation.toFixed(2)}</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
