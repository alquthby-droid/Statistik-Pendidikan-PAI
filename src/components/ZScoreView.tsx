import React, { useState } from "react";
import {
  Target,
  Search,
  Filter,
  Award,
  ArrowUpDown,
  Calculator,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react";
import { ZScoreItem, DescriptiveStats } from "../types";

interface ZScoreViewProps {
  zScores: ZScoreItem[];
  stats: DescriptiveStats | null;
  variableName: string;
  dataTitle: string;
}

export const ZScoreView: React.FC<ZScoreViewProps> = ({
  zScores,
  stats,
  variableName,
  dataTitle,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortField, setSortField] = useState<"score" | "zScore" | "label">("score");
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [simulatedScore, setSimulatedScore] = useState<number>(stats?.mean ? Math.round(stats.mean) : 80);
  const [copied, setCopied] = useState<boolean>(false);

  if (!stats || zScores.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <p className="text-slate-500">Belum ada data untuk kalkulasi Z-Score.</p>
      </div>
    );
  }

  // Simulated Z and T score calculation
  const simDev = simulatedScore - stats.mean;
  const simZ = stats.stdDevSample > 0 ? simDev / stats.stdDevSample : 0;
  const simT = 50 + 10 * simZ;

  let simCat = "Sedang / Rata-rata";
  let simArabic = "Jayyid / Maqbul";
  if (simZ >= 2.0) {
    simCat = "Sangat Tinggi";
    simArabic = "Mumtaz (Istimewa)";
  } else if (simZ >= 1.0) {
    simCat = "Tinggi";
    simArabic = "Jayyid Jiddan (Sangat Baik)";
  } else if (simZ >= -1.0) {
    simCat = "Sedang / Rata-rata";
    simArabic = "Jayyid / Maqbul (Cukup)";
  } else if (simZ >= -2.0) {
    simCat = "Rendah";
    simArabic = "Dha'if (Kurang)";
  } else {
    simCat = "Sangat Rendah";
    simArabic = "Dha'if Jiddan (Butuh Remedial)";
  }

  // Distribution by Category
  const categoryCounts = {
    "Sangat Tinggi": zScores.filter((z) => z.category === "Sangat Tinggi").length,
    Tinggi: zScores.filter((z) => z.category === "Tinggi").length,
    Sedang: zScores.filter((z) => z.category === "Sedang").length,
    Rendah: zScores.filter((z) => z.category === "Rendah").length,
    "Sangat Rendah": zScores.filter((z) => z.category === "Sangat Rendah").length,
  };

  // Filter & Sort
  const filtered = zScores.filter((item) => {
    const matchSearch = item.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === "all" || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === "score") cmp = a.score - b.score;
    else if (sortField === "zScore") cmp = a.zScore - b.zScore;
    else cmp = a.label.localeCompare(b.label);
    return sortAsc ? cmp : -cmp;
  });

  const handleCopyZTable = () => {
    let tsv = "Rank\tNama / Responden\tNilai Mentah (X)\tDeviasi (X - X̄)\tZ-Score\tT-Score\tPersentil\tKategori Evaluasi PAI\n";
    sorted.forEach((item, idx) => {
      tsv += `${idx + 1}\t${item.label}\t${item.score}\t${item.deviation.toFixed(2)}\t${item.zScore.toFixed(3)}\t${item.tScore.toFixed(1)}\t${item.percentile.toFixed(1)}%\t${item.category} (${item.categoryArabic})\n`;
    });

    navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case "Sangat Tinggi":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "Tinggi":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "Sedang":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "Rendah":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "Sangat Rendah":
        return "bg-rose-100 text-rose-900 border-rose-300";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <Target className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-800">
                Skor Standar: Z-Score & T-Score Evaluasi PAI
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Menstandarkan performa peserta didik dalam satuan deviasi baku (Z) dan skala standar T (Mean=50, SD=10) untuk pemetaan kemampuan akademik yang adil.
            </p>
          </div>

          <div className="bg-emerald-900 text-white px-3.5 py-2 rounded-xl text-xs font-mono">
            <span>Rumus: </span>
            <strong className="text-emerald-300">Z = (X - X̄) / s</strong>
            <span className="mx-2">|</span>
            <strong className="text-emerald-300">T = 50 + 10(Z)</strong>
          </div>
        </div>

        {/* Categories Distribution Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
          <div
            onClick={() => setSelectedCategory(selectedCategory === "Sangat Tinggi" ? "all" : "Sangat Tinggi")}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              selectedCategory === "Sangat Tinggi"
                ? "ring-2 ring-emerald-500 bg-emerald-50 border-emerald-300"
                : "bg-slate-50 hover:bg-emerald-50/40 border-slate-200"
            }`}
          >
            <span className="text-[11px] font-semibold text-emerald-900 block">Mumtaz (Sangat Tinggi)</span>
            <span className="text-xs text-slate-500 block font-mono">Z ≥ +2.0</span>
            <div className="text-xl font-black text-slate-900 font-mono mt-1">
              {categoryCounts["Sangat Tinggi"]}{" "}
              <span className="text-xs text-slate-500 font-normal">
                ({((categoryCounts["Sangat Tinggi"] / zScores.length) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>

          <div
            onClick={() => setSelectedCategory(selectedCategory === "Tinggi" ? "all" : "Tinggi")}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              selectedCategory === "Tinggi"
                ? "ring-2 ring-blue-500 bg-blue-50 border-blue-300"
                : "bg-slate-50 hover:bg-blue-50/40 border-slate-200"
            }`}
          >
            <span className="text-[11px] font-semibold text-blue-900 block">Jayyid Jiddan (Tinggi)</span>
            <span className="text-xs text-slate-500 block font-mono">+1.0 ≤ Z &lt; +2.0</span>
            <div className="text-xl font-black text-slate-900 font-mono mt-1">
              {categoryCounts["Tinggi"]}{" "}
              <span className="text-xs text-slate-500 font-normal">
                ({((categoryCounts["Tinggi"] / zScores.length) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>

          <div
            onClick={() => setSelectedCategory(selectedCategory === "Sedang" ? "all" : "Sedang")}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              selectedCategory === "Sedang"
                ? "ring-2 ring-slate-500 bg-slate-100 border-slate-300"
                : "bg-slate-50 hover:bg-slate-100/70 border-slate-200"
            }`}
          >
            <span className="text-[11px] font-semibold text-slate-800 block">Jayyid / Maqbul (Sedang)</span>
            <span className="text-xs text-slate-500 block font-mono">-1.0 ≤ Z &lt; +1.0</span>
            <div className="text-xl font-black text-slate-900 font-mono mt-1">
              {categoryCounts["Sedang"]}{" "}
              <span className="text-xs text-slate-500 font-normal">
                ({((categoryCounts["Sedang"] / zScores.length) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>

          <div
            onClick={() => setSelectedCategory(selectedCategory === "Rendah" ? "all" : "Rendah")}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              selectedCategory === "Rendah"
                ? "ring-2 ring-amber-500 bg-amber-50 border-amber-300"
                : "bg-slate-50 hover:bg-amber-50/40 border-slate-200"
            }`}
          >
            <span className="text-[11px] font-semibold text-amber-900 block">Dha'if (Rendah)</span>
            <span className="text-xs text-slate-500 block font-mono">-2.0 ≤ Z &lt; -1.0</span>
            <div className="text-xl font-black text-slate-900 font-mono mt-1">
              {categoryCounts["Rendah"]}{" "}
              <span className="text-xs text-slate-500 font-normal">
                ({((categoryCounts["Rendah"] / zScores.length) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>

          <div
            onClick={() => setSelectedCategory(selectedCategory === "Sangat Rendah" ? "all" : "Sangat Rendah")}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              selectedCategory === "Sangat Rendah"
                ? "ring-2 ring-rose-500 bg-rose-50 border-rose-300"
                : "bg-slate-50 hover:bg-rose-50/40 border-slate-200"
            }`}
          >
            <span className="text-[11px] font-semibold text-rose-900 block">Dha'if Jiddan (Sangat Rendah)</span>
            <span className="text-xs text-slate-500 block font-mono">Z &lt; -2.0</span>
            <div className="text-xl font-black text-slate-900 font-mono mt-1">
              {categoryCounts["Sangat Rendah"]}{" "}
              <span className="text-xs text-slate-500 font-normal">
                ({((categoryCounts["Sangat Rendah"] / zScores.length) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Z-Score Simulator */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50/80 to-blue-50/60 border border-emerald-200/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-700" />
                Simulasi Konversi Skor Siswa Baru / Individu
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Masukkan nilai mentah (X) untuk melihat skor baku Z dan T berdasarkan Mean={stats.mean.toFixed(1)} dan SD={stats.stdDevSample.toFixed(2)} kelas ini:
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-700 font-semibold">Nilai Siswa (X):</span>
              <input
                type="number"
                step="any"
                value={simulatedScore}
                onChange={(e) => setSimulatedScore(Number(e.target.value) || 0)}
                className="w-20 px-3 py-1.5 bg-white border border-emerald-300 rounded-lg font-mono font-bold text-center text-sm shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-emerald-200/50">
            <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100">
              <span className="text-[11px] text-slate-500 block">Deviasi (X - X̄):</span>
              <span className="text-sm font-bold font-mono text-slate-800">
                {simDev >= 0 ? `+${simDev.toFixed(2)}` : simDev.toFixed(2)}
              </span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100">
              <span className="text-[11px] text-slate-500 block">Z-Score:</span>
              <span className={`text-sm font-bold font-mono ${simZ >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                {simZ >= 0 ? `+${simZ.toFixed(3)}` : simZ.toFixed(3)}
              </span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100">
              <span className="text-[11px] text-slate-500 block">T-Score:</span>
              <span className="text-sm font-bold font-mono text-slate-900">
                {simT.toFixed(1)}
              </span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100">
              <span className="text-[11px] text-slate-500 block">Predikat Evaluasi PAI:</span>
              <span className="text-xs font-bold text-emerald-900 block truncate">
                {simArabic}
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Table of all students */}
        <div className="mt-8 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama mahasiswa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 w-48"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs px-2 py-1.5 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="all">Semua Kategori ({zScores.length})</option>
                  <option value="Sangat Tinggi">Sangat Tinggi (Mumtaz)</option>
                  <option value="Tinggi">Tinggi (Jayyid Jiddan)</option>
                  <option value="Sedang">Sedang (Jayyid / Maqbul)</option>
                  <option value="Rendah">Rendah (Dha'if)</option>
                  <option value="Sangat Rendah">Sangat Rendah (Dha'if Jiddan)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCopyZTable}
              className="text-xs px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-300 flex items-center gap-1.5 self-start sm:self-auto"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Tersalin" : "Salin Tabel Z-Score"}
            </button>
          </div>

          <div className="overflow-x-auto max-h-[420px]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5 text-center w-12">No</th>
                  <th className="px-3 py-2.5 cursor-pointer" onClick={() => { setSortField("label"); setSortAsc(!sortAsc); }}>
                    <div className="flex items-center gap-1">Nama / Responden <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                  </th>
                  <th className="px-3 py-2.5 text-center cursor-pointer" onClick={() => { setSortField("score"); setSortAsc(!sortAsc); }}>
                    <div className="flex items-center justify-center gap-1">Skor Mentah (X) <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                  </th>
                  <th className="px-3 py-2.5 text-center text-slate-500">Deviasi (X - X̄)</th>
                  <th className="px-3 py-2.5 text-center cursor-pointer" onClick={() => { setSortField("zScore"); setSortAsc(!sortAsc); }}>
                    <div className="flex items-center justify-center gap-1 font-bold text-emerald-950">Z-Score <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                  </th>
                  <th className="px-3 py-2.5 text-center font-bold text-slate-900">T-Score</th>
                  <th className="px-3 py-2.5 text-center text-slate-600">Persentil (%)</th>
                  <th className="px-3 py-2.5 text-center">Kategori Akademik PAI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {sorted.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2 text-center text-slate-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-2 font-medium text-slate-900">
                      {item.label}
                    </td>
                    <td className="px-3 py-2 text-center font-mono font-bold text-slate-800">
                      {item.score}
                    </td>
                    <td className="px-3 py-2 text-center font-mono text-slate-500">
                      {item.deviation >= 0 ? `+${item.deviation.toFixed(2)}` : item.deviation.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-center font-mono font-bold">
                      <span className={item.zScore >= 0 ? "text-emerald-700" : "text-rose-700"}>
                        {item.zScore >= 0 ? `+${item.zScore.toFixed(3)}` : item.zScore.toFixed(3)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center font-mono font-bold text-slate-900">
                      {item.tScore.toFixed(1)}
                    </td>
                    <td className="px-3 py-2 text-center font-mono text-slate-600">
                      {item.percentile.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full border ${getBadgeColor(item.category)}`}>
                        {item.category} • {item.categoryArabic.split(" ")[0]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
