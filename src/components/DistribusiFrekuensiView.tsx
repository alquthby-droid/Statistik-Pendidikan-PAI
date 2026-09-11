import React, { useState } from "react";
import {
  Table,
  Calculator,
  Layers,
  Copy,
  Check,
  Info,
  TrendingUp,
  Sliders,
} from "lucide-react";
import { DescriptiveStats, FrequencyClass, SturgesCalc } from "../types";
import { generateFrequencyDistribution } from "../utils/statistics";

interface DistribusiFrekuensiViewProps {
  stats: DescriptiveStats | null;
  sturges: SturgesCalc | null;
  frequencyClasses: FrequencyClass[];
  scores: number[];
  variableName: string;
  dataTitle: string;
  onUpdateSturgesParams?: (customK: number, customC: number) => void;
}

export const DistribusiFrekuensiView: React.FC<DistribusiFrekuensiViewProps> = ({
  stats,
  sturges,
  frequencyClasses,
  scores,
  variableName,
  dataTitle,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [customK, setCustomK] = useState<number>(sturges?.k || 6);
  const [customC, setCustomC] = useState<number>(sturges?.c || 5);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  if (!stats || !sturges || scores.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <p className="text-slate-500">Belum ada data untuk menyusun tabel distribusi frekuensi.</p>
      </div>
    );
  }

  // Current active classes (default Sturges or custom adjusted)
  const activeClasses = isCustomMode
    ? generateFrequencyDistribution(scores, stats.min, customK, customC, stats.mean)
    : frequencyClasses;

  const totalFreq = activeClasses.reduce((acc, c) => acc + c.frequency, 0);
  const totalRelative = activeClasses.reduce((acc, c) => acc + c.relativeFreq, 0);
  const totalFX = activeClasses.reduce((acc, c) => acc + c.fx, 0);
  const totalFXDiffSquared = activeClasses.reduce((acc, c) => acc + c.fxDiffSquared, 0);

  const meanGrouped = totalFreq > 0 ? totalFX / totalFreq : stats.mean;

  const handleCopyTable = () => {
    let tsv = "No\tInterval Kelas\tTepi Kelas\tTitik Tengah (Xi)\tFrekuensi (fi)\tFrekuensi Relatif (%)\tfk <=\tfk >=\tfi * Xi\n";
    activeClasses.forEach((c) => {
      tsv += `${c.index}\t${c.lowerLimit} - ${c.upperLimit}\t${c.lowerBound.toFixed(1)} - ${c.upperBound.toFixed(1)}\t${c.midpoint.toFixed(1)}\t${c.frequency}\t${c.relativeFreq.toFixed(2)}%\t${c.cumulativeLess}\t${c.cumulativeMore}\t${c.fx.toFixed(1)}\n`;
    });
    tsv += `Total\t-\t-\t-\t${totalFreq}\t${totalRelative.toFixed(1)}%\t-\t-\t${totalFX.toFixed(1)}\n`;

    navigator.clipboard.writeText(tsv);
    setCopiedSection("table");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Interpretation of Skewness
  let skewnessInterpret = "";
  if (stats.skewness > 0.5) {
    skewnessInterpret = "Menceng Positif (Miring ke Kanan): Sebagian besar mahasiswa memperoleh nilai di bawah rata-rata kelas, dengan sedikit mahasiswa berprestasi sangat tinggi.";
  } else if (stats.skewness < -0.5) {
    skewnessInterpret = "Menceng Negatif (Miring ke Kiri): Sebagian besar mahasiswa memperoleh nilai tinggi di atas rata-rata kelas, dengan sedikit mahasiswa yang tertinggal.";
  } else {
    skewnessInterpret = "Simetris (Normal / Bell-Shaped): Nilai mahasiswa tersebar seimbang di sekitar rata-rata.";
  }

  // Interpretation of Kurtosis
  let kurtosisInterpret = "";
  if (stats.kurtosis > 0.5) {
    kurtosisInterpret = "Leptokurtik (Runcing): Data terkonsentrasi sangat rapat pada nilai tengah.";
  } else if (stats.kurtosis < -0.5) {
    kurtosisInterpret = "Platikurtik (Landai/Mendatar): Data memiliki variasi yang cukup merata dan tersebar lebar.";
  } else {
    kurtosisInterpret = "Mesokurtik (Normal): Tingkat keruncingan mendekati kurva normal baku.";
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <Table className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-800">
                Tabel Distribusi Frekuensi Berkelompok & Aturan Sturges
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Penyusunan tabel distribusi frekuensi berdasarkan kaidah statistik pendidikan: Aturan Sturges, Interval Kelas, Tepi Batas, dan Frekuensi Kumulatif.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustomMode(!isCustomMode)}
              className={`text-xs px-3 py-1.5 font-medium rounded-lg flex items-center gap-1.5 transition-colors border ${
                isCustomMode
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              {isCustomMode ? "Mode Manual Aktif" : "Sesuaikan Kelas (K & C)"}
            </button>
          </div>
        </div>

        {/* Sturges Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-400 block">1. Jangkauan / Range (R)</span>
            <div className="text-lg font-bold text-slate-900 font-mono mt-1">
              R = {stats.max} - {stats.min} = <span className="text-emerald-700">{stats.range}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Selisih nilai tertinggi dan terendah</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-400 block">2. Banyak Kelas (k) - Sturges</span>
            <div className="text-lg font-bold text-slate-900 font-mono mt-1">
              k = 1 + 3.322 log({sturges.n}) = <span className="text-emerald-700">{sturges.k}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Hasil hitung: {sturges.rawK.toFixed(3)} (dibulatkan)</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-400 block">3. Panjang Interval Kelas (c / i)</span>
            <div className="text-lg font-bold text-slate-900 font-mono mt-1">
              c = R / k = {sturges.range} / {sturges.k} = <span className="text-emerald-700">{sturges.c}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Hasil hitung: {sturges.rawC.toFixed(3)} (dibulatkan)</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-400 block">4. Estimasi Mean Kelompok</span>
            <div className="text-lg font-bold text-slate-900 font-mono mt-1">
              X̄ = Σ(fi·Xi) / Σfi = <span className="text-emerald-700">{meanGrouped.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Mean asli data tunggal: {stats.mean.toFixed(2)}</p>
          </div>
        </div>

        {/* Custom Sturges adjustment controls if opened */}
        {isCustomMode && (
          <div className="mt-4 p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-wrap items-center gap-4 text-xs">
            <span className="font-bold text-amber-900 flex items-center gap-1">
              <Sliders className="w-4 h-4" /> Pengaturan K & C Manual:
            </span>
            <div className="flex items-center gap-2">
              <label className="text-slate-600">Banyak Kelas (k):</label>
              <input
                type="number"
                min={3}
                max={15}
                value={customK}
                onChange={(e) => setCustomK(Math.max(3, Number(e.target.value) || 3))}
                className="w-16 px-2 py-1 bg-white border border-amber-300 rounded font-mono font-bold"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-slate-600">Panjang Interval (c):</label>
              <input
                type="number"
                min={1}
                max={50}
                value={customC}
                onChange={(e) => setCustomC(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 px-2 py-1 bg-white border border-amber-300 rounded font-mono font-bold"
              />
            </div>
            <button
              onClick={() => {
                setCustomK(sturges.k);
                setCustomC(sturges.c);
              }}
              className="text-amber-800 underline hover:text-amber-950 font-medium"
            >
              Kembalikan ke Nilai Sturges Otomatis
            </button>
          </div>
        )}

        {/* Comprehensive Frequency Distribution Table */}
        <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Tabel Distribusi Frekuensi Berkelompok ({variableName})
              </h4>
              <p className="text-[11px] text-slate-500">
                Lengkap dengan Tepi Kelas, Titik Tengah (Xi), Frekuensi Kumulatif, dan Bobot fi·Xi
              </p>
            </div>

            <button
              onClick={handleCopyTable}
              className="text-xs px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-300 flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
            >
              {copiedSection === "table" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === "table" ? "Tersalin ke Clipboard" : "Salin Tabel untuk Excel/Word"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5 text-center">Kelas</th>
                  <th className="px-3 py-2.5">Interval Kelas</th>
                  <th className="px-3 py-2.5">Batas Nyata (Tepi Kelas)</th>
                  <th className="px-3 py-2.5 text-center">Titik Tengah (Xi)</th>
                  <th className="px-3 py-2.5 text-center font-bold text-emerald-900">Frekuensi (fi)</th>
                  <th className="px-3 py-2.5 text-center">Frekuensi Relatif (%)</th>
                  <th className="px-3 py-2.5 text-center bg-blue-50/50">fk ≤ (Kurang Dari)</th>
                  <th className="px-3 py-2.5 text-center bg-blue-50/50">fk ≥ (Lebih Dari)</th>
                  <th className="px-3 py-2.5 text-right">fi · Xi</th>
                  <th className="px-3 py-2.5 text-right text-slate-500">fi · (Xi - X̄)²</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {activeClasses.map((cls) => (
                  <tr key={cls.index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2 text-center font-mono font-medium text-slate-500">
                      {cls.index}
                    </td>
                    <td className="px-3 py-2 font-mono font-bold text-slate-900">
                      {cls.lowerLimit} – {cls.upperLimit}
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-600">
                      {cls.lowerBound.toFixed(1)} – {cls.upperBound.toFixed(1)}
                    </td>
                    <td className="px-3 py-2 text-center font-mono text-slate-800">
                      {cls.midpoint.toFixed(1)}
                    </td>
                    <td className="px-3 py-2 text-center font-mono font-black text-emerald-800 bg-emerald-50/40">
                      {cls.frequency}
                    </td>
                    <td className="px-3 py-2 text-center font-mono text-slate-700">
                      {cls.relativeFreq.toFixed(2)}%
                    </td>
                    <td className="px-3 py-2 text-center font-mono text-blue-900 bg-blue-50/30 font-semibold">
                      {cls.cumulativeLess}
                    </td>
                    <td className="px-3 py-2 text-center font-mono text-blue-900 bg-blue-50/30 font-semibold">
                      {cls.cumulativeMore}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-slate-800">
                      {cls.fx.toFixed(1)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-slate-500">
                      {cls.fxDiffSquared.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 text-slate-900 font-bold border-t border-slate-200">
                <tr>
                  <td colSpan={4} className="px-3 py-2 text-right font-bold">
                    Jumlah / Total (Σ):
                  </td>
                  <td className="px-3 py-2 text-center font-mono font-black text-emerald-900">
                    {totalFreq}
                  </td>
                  <td className="px-3 py-2 text-center font-mono">
                    {totalRelative.toFixed(1)}%
                  </td>
                  <td colSpan={2} className="px-3 py-2 text-center text-slate-500">
                    -
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-emerald-900">
                    {totalFX.toFixed(1)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-slate-600">
                    {totalFXDiffSquared.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Characteristics of Distribution (Skewness & Kurtosis) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Skewness Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Kemiringan Distribusi (Skewness)
              </h4>
              <span className="font-mono font-bold text-slate-900 text-sm">
                Sk = {stats.skewness.toFixed(3)}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {skewnessInterpret}
            </p>
            <div className="text-[11px] text-slate-400 border-t border-slate-200 pt-1.5">
              Acuan: Jika -0.5 ≤ Sk ≤ +0.5 maka data terdistribusi simetris normal.
            </div>
          </div>

          {/* Kurtosis Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Keruncingan Distribusi (Kurtosis)
              </h4>
              <span className="font-mono font-bold text-slate-900 text-sm">
                Ku = {stats.kurtosis.toFixed(3)}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {kurtosisInterpret}
            </p>
            <div className="text-[11px] text-slate-400 border-t border-slate-200 pt-1.5">
              Acuan: Nilai kurtosis mesokurtik mendekati 0. Runcing jika &gt; 0, landai jika &lt; 0.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
