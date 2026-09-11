import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Download,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  MonitorPlay,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Volume2,
  Users,
} from "lucide-react";
import {
  DescriptiveStats,
  FrequencyClass,
  ZScoreItem,
  SturgesCalc,
  GroupAssignmentInfo,
} from "../types";
import { exportToPptx } from "../utils/pptxExport";

interface PresentationViewProps {
  stats: DescriptiveStats;
  sturges: SturgesCalc;
  frequencyClasses: FrequencyClass[];
  zScores: ZScoreItem[];
  variableName: string;
  dataTitle: string;
  groupInfo?: GroupAssignmentInfo;
  onOpenGroupConfig?: () => void;
}

export const PresentationView: React.FC<PresentationViewProps> = ({
  stats,
  sturges,
  frequencyClasses,
  zScores,
  variableName,
  dataTitle,
  groupInfo,
  onOpenGroupConfig,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const presentationContainerRef = useRef<HTMLDivElement>(null);

  const totalSlides = 10;

  // Category counts
  const catMumtaz = zScores.filter((z) => z.category === "Sangat Tinggi").length;
  const catTinggi = zScores.filter((z) => z.category === "Tinggi").length;
  const catSedang = zScores.filter((z) => z.category === "Sedang").length;
  const catRendah = zScores.filter((z) => z.category === "Rendah").length;
  const catSangatRendah = zScores.filter((z) => z.category === "Sangat Rendah").length;

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 1));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      presentationContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 1));
      } else if (e.key === "Home") {
        e.preventDefault();
        setCurrentSlide(1);
      } else if (e.key === "End") {
        e.preventDefault();
        setCurrentSlide(totalSlides);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSlides]);

  const handleDownloadPptx = async () => {
    try {
      setIsExporting(true);
      setExportSuccess(false);
      await exportToPptx({
        stats,
        sturges,
        frequencyClasses,
        zScores,
        variableName,
        dataTitle,
        groupInfo,
      });
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err) {
      console.error("Gagal mengunduh file PPTX:", err);
      alert("Terjadi kendala saat menyusun file PowerPoint. Silakan coba lagi.");
    } finally {
      setIsExporting(false);
    }
  };

  // Lecture notes dictionary for slides
  const slideNotes: Record<number, { title: string; points: string[] }> = {
    1: {
      title: "Catatan Dosen: Slide 1 (Pengantar & Identitas Data)",
      points: [
        "Jelaskan latar belakang instrumen penelitian dan urgensi variabel PAI yang diteliti.",
        `Sebutkan jumlah sampel N = ${stats.count} responden dan karakteristik instrumen (${dataTitle}).`,
        "Tekankan bahwa modul ini mengintegrasikan teori statistik klasik dengan konteks evaluasi PAI modern.",
      ],
    },
    2: {
      title: "Catatan Dosen: Slide 2 (Roadmap 4 Pilar Statistik)",
      points: [
        "Garis bawahi bahwa analisis kuantitatif harus berurutan: Sebaran → Distribusi Frekuensi → Standarisasi Skor (Z & T) → Visualisasi Grafik.",
        "Kaitkan alur ini dengan sistematika penulisan Bab IV Tesis Magister PAI.",
      ],
    },
    3: {
      title: "Catatan Dosen: Slide 3 (Ukuran Pemusatan Data)",
      points: [
        `Mean (${stats.mean.toFixed(2)}) adalah titik tumpu pusat gravitasi seluruh skor data.`,
        `Median (${stats.median.toFixed(2)}) membagi 50% data di bawah dan 50% di atas, kebal terhadap skor ekstrem.`,
        `Modus (${stats.mode.join(", ")}) memperlihatkan nilai dengan frekuensi pengulangan terbanyak (${stats.modeFrequency} kali).`,
      ],
    },
    4: {
      title: "Catatan Dosen: Slide 4 (Ukuran Sebaran & Dispersi)",
      points: [
        `Standar deviasi sampel s = ${stats.stdDevSample.toFixed(2)} mencerminkan tingkat heterogenitas kemampuan mahasiswa.`,
        `Koefisien variasi CV = ${stats.coefVariation.toFixed(2)}% menunjukkan data ${stats.coefVariation < 20 ? "relatif homogen" : "cukup bervariasi"}.`,
        `Kuartil (Q1=${stats.q1.toFixed(1)}, Q3=${stats.q3.toFixed(1)}) mendefinisikan lebar bentangan IQR = ${stats.iqr.toFixed(1)}.`,
      ],
    },
    5: {
      title: "Catatan Dosen: Slide 5 (Aturan Sturges)",
      points: [
        "Kaidah Sturges mencegah pembentukan kelas interval secara subjektif.",
        `Rumus k = 1 + 3.322 * log10(${sturges.n}) menghasilkan ${sturges.k} kelas interval.`,
        `Panjang kelas c = Range / k menghasilkan lebar interval ${sturges.c}.`,
        `Nilai Skewness (${stats.skewness.toFixed(3)}) dan Kurtosis (${stats.kurtosis.toFixed(3)}) menjelaskan profil kurva empiris.`,
      ],
    },
    6: {
      title: "Catatan Dosen: Slide 6 (Tabel Distribusi Berkelompok)",
      points: [
        "Jelaskan arti penting batas nyata (tepi bawah dan tepi atas) untuk mencegah celah kosong antarkelas pada grafik histogram.",
        "Paparkan perbedaan frekuensi kumulatif kurang dari (fk <=) dan lebih dari (fk >=) yang menjadi basis kurva Ogive.",
      ],
    },
    7: {
      title: "Catatan Dosen: Slide 7 (Standarisasi Z-Score & T-Score)",
      points: [
        "Skor mentah sering kali bias dan tidak dapat dibandingkan antarmata pelajaran PAI (misal: Fiqih vs SKI).",
        "Z-score menstandardisasi mean = 0 dan SD = 1.0, namun memiliki kelemahan angka negatif dan pecahan.",
        "Transformasi T-score McCall [T = 50 + 10(Z)] mengubah seluruh skor menjadi positif rentang 20-80 yang ramah raport.",
      ],
    },
    8: {
      title: "Catatan Dosen: Slide 8 (Matriks Mutu Akademik PAI)",
      points: [
        `Sebaran mutu: Mumtaz (${catMumtaz} mhs), Jayyid Jiddan (${catTinggi} mhs), Jayyid/Maqbul (${catSedang} mhs), Dha'if (${catRendah} mhs), Dha'if Jiddan (${catSangatRendah} mhs).`,
        "Gunakan matriks ini sebagai dasar rekomendasi pembelajaran berdiferensiasi: pengayaan vs bimbingan remedial.",
      ],
    },
    9: {
      title: "Catatan Dosen: Slide 9 (Grafik Statistik Pendidikan)",
      points: [
        "Histogram dan Poligon menampilkan profil frekuensi aktual.",
        "Kurva Normal Gauss menguji asumsi parametrik dan simpangan baku ±1σ dan ±2σ.",
        `Titik temu kedua kurva Ogive tepat mengindikasikan letak Median data (${stats.median.toFixed(1)}).`,
        "Boxplot menyajikan ringkasan 5-angka dan mendeteksi potensi pencilan (outlier).",
      ],
    },
    10: {
      title: "Catatan Dosen: Slide 10 (Sintesis & Implikasi Pedagogis PAI)",
      points: [
        "Statistik bukan sekadar rumus matematis, melainkan instrumen penjaminan keadilan (adl) dalam evaluasi pembelajaran Islam.",
        "Gunakan seluruh temuan ini untuk memperkuat Subbab Pembahasan Hasil Penelitian Bab IV Tesis Magister PAI.",
      ],
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-800/60">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-xs font-semibold text-emerald-200">
              <MonitorPlay className="w-3.5 h-3.5" />
              <span>Modul Slide Kuliah & Seminar S2 PAI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
              Slide Presentasi (PPT) 4 Pilar Statistik
            </h2>
            <p className="text-sm text-emerald-200/90 max-w-2xl leading-relaxed">
              Slide kuliah interaktif dan file PowerPoint (<span className="font-semibold text-white">.pptx</span>) resmi untuk mata kuliah Statistik Pendidikan S2 PAI, mencakup materi: <span className="font-semibold text-white">Sebaran, Distribusi Frekuensi, Z-Score, dan Grafik Statistik</span>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadPptx}
              disabled={isExporting}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-lg shadow-amber-900/30 transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Unduh file Microsoft PowerPoint (.pptx) asli"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Menyusun File PPTX...</span>
                </>
              ) : exportSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>PPTX Berhasil Diunduh!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Unduh File PPT (.pptx)</span>
                </>
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-800/70 hover:bg-emerald-700/80 text-emerald-100 font-medium text-sm border border-emerald-600/50 transition-colors cursor-pointer"
              title="Tampilkan layar penuh untuk presentasi kelas"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>Keluar Layar Penuh</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>Layar Penuh (F11)</span>
                </>
              )}
            </button>

            {onOpenGroupConfig && (
              <button
                onClick={onOpenGroupConfig}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-emerald-200 font-medium text-sm border border-emerald-500/40 transition-colors cursor-pointer"
                title="Sesuaikan Nama Perguruan Tinggi, Kelompok, dan Anggota Mahasiswa"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Pengaturan Kelompok & Kampus</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <div
        ref={presentationContainerRef}
        className={`bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col ${
          isFullscreen ? "h-screen w-screen rounded-none border-0" : ""
        }`}
      >
        {/* Slide Stage Header Bar */}
        <div className="bg-slate-900/95 border-b border-slate-800 px-5 py-3 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Magister PAI • Statistik Pendidikan</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 truncate max-w-xs sm:max-w-md">
              {variableName} ({stats.count} Mahasiswa)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                showNotes
                  ? "bg-emerald-900/80 text-emerald-200 border border-emerald-700/60"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{showNotes ? "Sembunyikan Catatan" : "Catatan Dosen"}</span>
            </button>

            <span className="font-mono font-bold bg-slate-800 px-2.5 py-1 rounded text-slate-200">
              {currentSlide} / {totalSlides}
            </span>
          </div>
        </div>

        {/* 16:9 Aspect Ratio Presentation Screen */}
        <div className="relative w-full aspect-[16/9] min-h-[460px] max-h-[75vh] bg-slate-900 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
          {/* =========================================
              SLIDE 1: COVER
              ========================================= */}
          {currentSlide === 1 && (
            <div className="w-full h-full bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 rounded-xl p-6 sm:p-8 border border-emerald-700/60 shadow-2xl flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-2.5 z-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 font-semibold text-xs tracking-wide uppercase">
                    {groupInfo?.institutionName || "Universitas Islam Negeri (UIN)"}
                  </span>
                  {groupInfo?.isGroupAssignment && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-800/80 border border-emerald-500/50 text-emerald-200 font-bold text-xs">
                      <Users className="w-3.5 h-3.5 text-emerald-300" />
                      {groupInfo.groupName}
                    </span>
                  )}
                  <span className="text-[11px] text-emerald-300/80 font-sans hidden sm:inline">
                    {groupInfo?.studyProgram || "Magister (S2) PAI"}
                  </span>
                </div>

                <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold font-serif tracking-tight text-white leading-tight">
                  {groupInfo?.isGroupAssignment
                    ? `Tugas ${groupInfo.groupName}: Modul Analisis Statistik Pendidikan`
                    : "Modul Praktikum & Analisis Statistik Pendidikan"}
                </h1>
                <p className="text-sm sm:text-base font-medium text-emerald-300 font-sans">
                  Sebaran & Dispersi • Distribusi Frekuensi Sturges • Z-Score & T-Score • Visualisasi Grafik
                </p>

                {/* Group Members List on Slide Cover if configured */}
                {groupInfo?.isGroupAssignment && groupInfo.members.length > 0 && (
                  <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-amber-300 font-semibold">Tim Mahasiswa:</span>
                    {groupInfo.members.map((m, idx) => (
                      <span
                        key={m.id || idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-[11px] text-emerald-100"
                      >
                        <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[9px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-white">{m.name}</span>
                        <span className="text-emerald-300 font-mono text-[10px]">({m.nim})</span>
                        {m.role && <span className="text-amber-300 text-[9.5px]">[{m.role}]</span>}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Data Context Card */}
              <div className="bg-emerald-900/60 backdrop-blur-md rounded-xl p-4 border border-emerald-700/50 space-y-2.5 z-10 my-2">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    Konteks Data Instrumen Penelitian PAI
                  </span>
                  {groupInfo?.lecturer && (
                    <span className="text-emerald-200 text-[11px] font-normal normal-case">
                      Dosen: <strong className="text-white font-semibold">{groupInfo.lecturer}</strong>
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <div className="text-emerald-300/80">Variabel Penelitian</div>
                    <div className="font-bold text-white text-sm truncate">{variableName}</div>
                  </div>
                  <div>
                    <div className="text-emerald-300/80">Ukuran Sampel (N)</div>
                    <div className="font-bold text-white text-sm">{stats.count} Responden</div>
                  </div>
                  <div>
                    <div className="text-emerald-300/80">Mean & Standar Deviasi</div>
                    <div className="font-bold text-white text-sm">
                      X̄ = {stats.mean.toFixed(2)} | s = {stats.stdDevSample.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-emerald-300/80">Rentang Skor (R)</div>
                    <div className="font-bold text-white text-sm">
                      {stats.min} s.d. {stats.max} (R = {stats.range})
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-300/80 border-t border-emerald-800/60 pt-2.5 z-10">
                <span>{groupInfo?.institutionName || "Kementerian Agama Republik Indonesia"}</span>
                <div className="flex items-center gap-2">
                  <span>Mata Kuliah: {groupInfo?.courseName || "Statistik Pendidikan PAI"} ({groupInfo?.academicYear || "Gasal 2025/2026"})</span>
                  <span>•</span>
                  <span className="text-amber-300 font-semibold">Pengembang: Husni, S.Kom.I</span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              SLIDE 2: ROADMAP 4 PILAR
              ========================================= */}
          {currentSlide === 2 && (
            <div className="w-full h-full bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between text-white">
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Roadmap Konseptual
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
                  4 Pilar Utama Analisis Statistik Pendidikan S2 PAI
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-auto">
                <div className="bg-slate-800/90 rounded-xl p-4 border border-emerald-600/50 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-2">
                      01
                    </div>
                    <h3 className="font-bold text-emerald-300 text-base">Ukuran Sebaran & Dispersi</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Pemusatan data (Mean, Median, Modus) dan variabilitas (Standar Deviasi, Varians, Kuartil, IQR, CV%).
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 p-2 rounded border border-emerald-800/60">
                    X̄ = ΣX/N | s = √[Σ(X-X̄)²/(N-1)]
                  </div>
                </div>

                <div className="bg-slate-800/90 rounded-xl p-4 border border-teal-600/50 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-sm mb-2">
                      02
                    </div>
                    <h3 className="font-bold text-teal-300 text-base">Distribusi Frekuensi</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Aturan Sturges (k = 1 + 3.322 log N), panjang interval (c), batas nyata, fk ≤, fk ≥, Skewness & Kurtosis.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-teal-400 bg-teal-950/60 p-2 rounded border border-teal-800/60">
                    k = 1 + 3.322 log10(N) | c = R/k
                  </div>
                </div>

                <div className="bg-slate-800/90 rounded-xl p-4 border border-blue-600/50 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-2">
                      03
                    </div>
                    <h3 className="font-bold text-blue-300 text-base">Z-Score & T-Score</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Standarisasi skor mentah menjadi skor baku [Z = (X - X̄)/s] dan skor McCall [T = 50 + 10Z] untuk mutu PAI.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-blue-400 bg-blue-950/60 p-2 rounded border border-blue-800/60">
                    Z = (X - X̄)/s | T = 50 + 10(Z)
                  </div>
                </div>

                <div className="bg-slate-800/90 rounded-xl p-4 border border-purple-600/50 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center text-sm mb-2">
                      04
                    </div>
                    <h3 className="font-bold text-purple-300 text-base">Grafik Statistik</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Visualisasi komprehensif: Histogram, Poligon Frekuensi, Kurva Normal Gauss (±1σ, ±2σ), Ogive, dan Boxplot.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-purple-400 bg-purple-950/60 p-2 rounded border border-purple-800/60">
                    Histogram • Gauss • Ogive • Boxplot
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 border-t border-slate-800 pt-2 flex justify-between">
                <span>Alur Analisis Kuantitatif Komprehensif</span>
                <span>Program Magister S2 PAI</span>
              </div>
            </div>
          )}

          {/* =========================================
              SLIDE 3: MODUL 1 - PEMUSATAN
              ========================================= */}
          {currentSlide === 3 && (
            <div className="w-full h-full bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between text-white">
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Modul 1 • Ukuran Sebaran (Bagian 1)
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
                  Ukuran Pemusatan Data (Central Tendency)
                </h2>
              </div>

              <div className="overflow-x-auto my-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-emerald-950/80 border-b border-emerald-800 text-emerald-200">
                      <th className="p-3">Parameter Statistik</th>
                      <th className="p-3 text-center">Simbol</th>
                      <th className="p-3 text-center font-bold">Nilai Empiris</th>
                      <th className="p-3">Rumus & Makna Pedagogis PAI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-semibold text-white">Mean (Rata-rata Hitung)</td>
                      <td className="p-3 text-center font-mono text-emerald-400 font-bold">X̄</td>
                      <td className="p-3 text-center font-bold text-emerald-300 text-sm">{stats.mean.toFixed(2)}</td>
                      <td className="p-3 text-slate-300">X̄ = (ΣX) / N. Titik pusat gravitasi nilai capaian belajar seluruh mahasiswa.</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-semibold text-white">Median (Nilai Tengah)</td>
                      <td className="p-3 text-center font-mono text-white font-bold">Me</td>
                      <td className="p-3 text-center font-bold text-white text-sm">{stats.median.toFixed(2)}</td>
                      <td className="p-3 text-slate-300">Membagi 50% data di bawah dan 50% di atas. Kebal terhadap outlier ekstrem.</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-semibold text-white">Modus (Nilai Terbanyak)</td>
                      <td className="p-3 text-center font-mono text-white font-bold">Mo</td>
                      <td className="p-3 text-center font-bold text-white text-sm">{stats.mode.join(", ") || "-"}</td>
                      <td className="p-3 text-slate-300">Skor dengan frekuensi kemunculan tertinggi ({stats.modeFrequency || 1} kali pengulangan).</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-semibold text-white">Nilai Minimum & Maksimum</td>
                      <td className="p-3 text-center font-mono text-slate-400">Min / Max</td>
                      <td className="p-3 text-center font-bold text-amber-300 text-sm">{stats.min} s.d. {stats.max}</td>
                      <td className="p-3 text-slate-300">Batas bawah dan batas atas skor hasil pengukuran instrumen.</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-semibold text-white">Rentang / Jangkauan</td>
                      <td className="p-3 text-center font-mono text-slate-400">R</td>
                      <td className="p-3 text-center font-bold text-amber-300 text-sm">{stats.range}</td>
                      <td className="p-3 text-slate-300">R = Xmax - Xmin. Lebar sebaran bentangan data mentah responden.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-emerald-950/60 rounded-lg border border-emerald-800/60 text-xs text-emerald-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  <strong>Indikasi Simetri:</strong> Mean ({stats.mean.toFixed(2)}) dan Median ({stats.median.toFixed(2)}) memiliki selisih {Math.abs(stats.mean - stats.median).toFixed(2)}, mengindikasikan distribusi skor {Math.abs(stats.mean - stats.median) < 2 ? "sangat mendekati simetris seimbang" : "memiliki kemiringan moderat"}.
                </span>
              </div>
            </div>
          )}

          {/* =========================================
              SLIDE 4: MODUL 1 - DISPERSI
              ========================================= */}
          {currentSlide === 4 && (
            <div className="w-full h-full bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between text-white">
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Modul 1 • Ukuran Sebaran (Bagian 2)
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
                  Ukuran Sebaran, Keragaman & Variabilitas (Dispersi)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-auto">
                {/* Column 1: SD & Varians */}
                <div className="bg-slate-800/90 rounded-xl p-5 border border-emerald-700/50 space-y-3">
                  <h3 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Standar Deviasi, Varians & Homogenitas
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-700">
                      <span className="text-slate-300">Standar Deviasi Sampel (s)</span>
                      <span className="font-bold font-mono text-emerald-300 text-sm">{stats.stdDevSample.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-700">
                      <span className="text-slate-300">Varians Sampel (s²)</span>
                      <span className="font-bold font-mono text-slate-200">{stats.varianceSample.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-700">
                      <span className="text-slate-300">Standar Error Mean (SEM)</span>
                      <span className="font-bold font-mono text-slate-200">{stats.stdErrorMean.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-300">Koefisien Variasi (CV)</span>
                      <span className="font-bold font-mono text-amber-300">{stats.coefVariation.toFixed(2)}%</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    Koefisien variasi sebesar {stats.coefVariation.toFixed(2)}% menunjukkan bahwa kemampuan responden tergolong{" "}
                    <strong className="text-emerald-300">{stats.coefVariation < 20 ? "Homogen (<20%)" : "Cukup Heterogen (≥20%)"}</strong>.
                  </p>
                </div>

                {/* Column 2: Kuartil & IQR */}
                <div className="bg-slate-800/90 rounded-xl p-5 border border-blue-700/50 space-y-3">
                  <h3 className="font-bold text-blue-300 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    Ukuran Letak: Kuartil & Simpangan Kuartil
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-700">
                      <span className="text-slate-300">Kuartil Bawah (Q1 / P25)</span>
                      <span className="font-bold font-mono text-blue-300 text-sm">{stats.q1.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-700">
                      <span className="text-slate-300">Kuartil Tengah (Q2 / Median)</span>
                      <span className="font-bold font-mono text-rose-300 text-sm">{stats.median.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-700">
                      <span className="text-slate-300">Kuartil Atas (Q3 / P75)</span>
                      <span className="font-bold font-mono text-blue-300 text-sm">{stats.q3.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-300">Jangkauan Antarkuartil (IQR = Q3 - Q1)</span>
                      <span className="font-bold font-mono text-purple-300">{stats.iqr.toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    Simpangan Kuartil (Qd = 0.5 × IQR) adalah <strong className="text-white">{stats.quartileDeviation.toFixed(2)}</strong>, mencakup bentang 50% data inti di sekitar nilai median.
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-400 border-t border-slate-800 pt-2 flex justify-between">
                <span>Dispersi Mengukur Variabilitas Kemampuan Mahasiswa</span>
                <span>Dasar Pembelajaran Berdiferensiasi</span>
              </div>
            </div>
          )}

          {/* =========================================
              SLIDE 5: MODUL 2 - STURGES
              ========================================= */}
          {currentSlide === 5 && (
            <div className="w-full h-full bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between text-white">
              <div>
                <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Modul 2 • Distribusi Frekuensi Berkelompok
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
                  Kaidah Empiris Aturan Sturges (Herbert Sturges, 1926)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-auto">
                <div className="bg-slate-800/90 rounded-xl p-4 border border-teal-600/50 space-y-2">
                  <div className="text-xs font-bold text-teal-300">Langkah 1: Rentang (Range)</div>
                  <div className="text-base font-bold font-mono text-white">R = Xmax - Xmin</div>
                  <div className="p-2.5 rounded bg-teal-950/60 border border-teal-800 text-xs font-mono text-teal-200">
                    R = {stats.max} - {stats.min} = <strong>{stats.range}</strong>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Menghitung bentang jarak absolut antara skor tertinggi dan terendah.
                  </p>
                </div>

                <div className="bg-slate-800/90 rounded-xl p-4 border border-teal-600/50 space-y-2">
                  <div className="text-xs font-bold text-teal-300">Langkah 2: Banyak Kelas (k)</div>
                  <div className="text-base font-bold font-mono text-white">k = 1 + 3.322 log10(N)</div>
                  <div className="p-2.5 rounded bg-teal-950/60 border border-teal-800 text-xs font-mono text-teal-200">
                    k = 1 + 3.322({sturges.log10N.toFixed(3)}) = {sturges.rawK.toFixed(3)} ≈ <strong>{sturges.k} Kelas</strong>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Menentukan jumlah kelompok secara objektif agar seimbang.
                  </p>
                </div>

                <div className="bg-slate-800/90 rounded-xl p-4 border border-teal-600/50 space-y-2">
                  <div className="text-xs font-bold text-teal-300">Langkah 3: Panjang Kelas (c)</div>
                  <div className="text-base font-bold font-mono text-white">c = Range / k</div>
                  <div className="p-2.5 rounded bg-teal-950/60 border border-teal-800 text-xs font-mono text-teal-200">
                    c = {stats.range} / {sturges.k} = {sturges.rawC.toFixed(3)} ≈ <strong>{sturges.c}</strong>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Lebar interval tiap kelas (dibulatkan untuk kepraktisan pengukuran).
                  </p>
                </div>
              </div>

              {/* Skewness & Kurtosis */}
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Koefisien Kemiringan (Skewness): </span>
                  <strong className="text-teal-300 font-mono">{stats.skewness.toFixed(3)}</strong>
                  <span className="text-slate-300 block text-[11px] mt-0.5">
                    {stats.skewness > 0.5
                      ? "Menceng Kanan (Positif) — sebagian besar mahasiswa berdaya serap di bawah rata-rata."
                      : stats.skewness < -0.5
                      ? "Menceng Kiri (Negatif) — sebagian besar mahasiswa berdaya serap tinggi di atas rata-rata."
                      : "Simetris Seimbang (Mendekati kurva normal lonceng baku)."}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Koefisien Keruncingan (Kurtosis): </span>
                  <strong className="text-teal-300 font-mono">{stats.kurtosis.toFixed(3)}</strong>
                  <span className="text-slate-300 block text-[11px] mt-0.5">
                    {stats.kurtosis > 0.5
                      ? "Leptokurtik — distribusi data sangat runcing dan memusat tajam pada nilai tengah."
                      : stats.kurtosis < -0.5
                      ? "Platikurtik — kurva mendatar landai, sebaran relatif bervariasi luas."
                      : "Mesokurtik — keruncingan kurva berderajat normal standar."}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              SLIDE 6: MODUL 2 - TABEL BERKELOMPOK
              ========================================= */}
          {currentSlide === 6 && (
            <div className="w-full h-full bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between text-white">
              <div>
                <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Modul 2 • Distribusi Frekuensi Berkelompok
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
                  Tabel Distribusi Empiris: {variableName}
                </h2>
              </div>

              <div className="overflow-x-auto my-auto max-h-[290px]">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="sticky top-0 bg-teal-950 text-teal-200 border-b border-teal-800">
                    <tr>
                      <th className="p-2 text-center">Kelas</th>
                      <th className="p-2 text-center">Interval Skor</th>
                      <th className="p-2 text-center">Batas Nyata</th>
                      <th className="p-2 text-center">Titik Tengah (Xi)</th>
                      <th className="p-2 text-center font-bold">Frekuensi (fi)</th>
                      <th className="p-2 text-center">Relatif (%)</th>
                      <th className="p-2 text-center">fk ≤</th>
                      <th className="p-2 text-center">fk ≥</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {frequencyClasses.map((cls) => (
                      <tr key={cls.index} className="hover:bg-slate-800/50">
                        <td className="p-2 text-center font-mono text-slate-400">{cls.index}</td>
                        <td className="p-2 text-center font-bold text-white">
                          {cls.lowerLimit} - {cls.upperLimit}
                        </td>
                        <td className="p-2 text-center font-mono text-slate-300">
                          {cls.lowerBound.toFixed(1)} - {cls.upperBound.toFixed(1)}
                        </td>
                        <td className="p-2 text-center font-mono text-slate-300">{cls.midpoint.toFixed(1)}</td>
                        <td className="p-2 text-center font-bold text-emerald-300">{cls.frequency}</td>
                        <td className="p-2 text-center text-slate-300">{cls.relativeFreq.toFixed(1)}%</td>
                        <td className="p-2 text-center text-blue-400">{cls.cumulativeLess}</td>
                        <td className="p-2 text-center text-blue-400">{cls.cumulativeMore}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-800 font-bold text-white border-t border-slate-700">
                      <td className="p-2 text-center" colSpan={4}>Total Sampel (Σ)</td>
                      <td className="p-2 text-center text-emerald-400 text-sm">
                        {frequencyClasses.reduce((a, b) => a + b.frequency, 0)}
                      </td>
                      <td className="p-2 text-center">100%</td>
                      <td className="p-2 text-center" colSpan={2}>-</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="text-xs text-slate-400 border-t border-slate-800 pt-2 flex justify-between">
                <span>Batas Nyata Menjamin Kontinuitas Visual Histogram</span>
                <span>Frekuensi Kumulatif Dasar Kurva Ogive</span>
              </div>
            </div>
          )}

          {/* =========================================
              SLIDE 7: MODUL 3 - Z-SCORE & T-SCORE
              ========================================= */}
          {currentSlide === 7 && (
            <div className="w-full h-full bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between text-white">
              <div>
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Modul 3 • Standarisasi Skor Baku Evaluasi PAI
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
                  Transformasi Nilai Mentah ke Z-Score & T-Score
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-auto">
                <div className="bg-slate-800/90 rounded-xl p-5 border border-blue-600/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-blue-300 text-base">1. Skor Baku Z (Standard Score)</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      μ = 0, σ = 1.0
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-950/70 border border-blue-800/80 font-mono text-center text-blue-200 text-lg font-bold">
                    Z = (X - X̄) / s
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>Mengukur jarak deviasi skor siswa dari rata-rata (X̄) dalam satuan standar deviasi (s).</li>
                    <li>Skor di atas rata-rata bernilai positif (+Z), di bawah rata-rata bernilai negatif (-Z).</li>
                    <li className="text-amber-300/90">
                      <strong>Kelemahan Evaluasi:</strong> Memuat angka minus dan desimal yang kurang nyaman dicantumkan di buku laporan siswa.
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-800/90 rounded-xl p-5 border border-emerald-600/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-emerald-300 text-base">2. Skor Baku T (McCall T-Score)</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Mean = 50, SD = 10
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-800/80 font-mono text-center text-emerald-200 text-lg font-bold">
                    T = 50 + 10(Z)
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>Mengeliminasi angka negatif dan pecahan (seluruh skor berada di kisaran 20 s.d. 80).</li>
                    <li>Sangat ideal untuk pemeringkatan dan pelaporan evaluasi capaian PAI secara adil.</li>
                    <li className="text-emerald-300">
                      <strong>Keunggulan:</strong> Memungkinkan komparasi langsung antarmata pelajaran PAI (Akidah, Fiqih, SKI).
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-xs text-slate-400 border-t border-slate-800 pt-2 flex justify-between">
                <span>Standarisasi Menjamin Keadilan Penilaian (Fair Assessment)</span>
                <span>Bebas dari Bias Tingkat Kesukaran Soal</span>
              </div>
            </div>
          )}

          {/* =========================================
              SLIDE 8: MODUL 3 - MATRIKS MUTU PAI
              ========================================= */}
          {currentSlide === 8 && (
            <div className="w-full h-full bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between text-white">
              <div>
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Modul 3 • Matriks Mutu Capaian Pembelajaran PAI
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
                  Distribusi Mutu Berdasarkan Skor Baku (Z & T)
                </h2>
              </div>

              <div className="overflow-x-auto my-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-blue-950/80 border-b border-blue-800 text-blue-200">
                      <th className="p-2.5">Predikat / Mutu PAI</th>
                      <th className="p-2.5 text-center">Batas Z-Score</th>
                      <th className="p-2.5 text-center">Batas T-Score</th>
                      <th className="p-2.5 text-center font-bold">Jumlah Mhs</th>
                      <th className="p-2.5 text-center">Persentase</th>
                      <th className="p-2.5">Tindak Lanjut Pedagogis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-2.5 font-bold text-emerald-400">Mumtaz (Sangat Tinggi)</td>
                      <td className="p-2.5 text-center font-mono">Z ≥ +2.0</td>
                      <td className="p-2.5 text-center font-mono font-bold">T ≥ 70</td>
                      <td className="p-2.5 text-center font-bold text-emerald-300 text-sm">{catMumtaz}</td>
                      <td className="p-2.5 text-center text-slate-300">{((catMumtaz / stats.count) * 100).toFixed(1)}%</td>
                      <td className="p-2.5 text-slate-300">Pengayaan studi mandiri dan penulisan artikel ilmiah PAI.</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-2.5 font-bold text-blue-400">Jayyid Jiddan (Tinggi)</td>
                      <td className="p-2.5 text-center font-mono">+1.0 ≤ Z &lt; +2.0</td>
                      <td className="p-2.5 text-center font-mono font-bold">60 ≤ T &lt; 70</td>
                      <td className="p-2.5 text-center font-bold text-blue-300 text-sm">{catTinggi}</td>
                      <td className="p-2.5 text-center text-slate-300">{((catTinggi / stats.count) * 100).toFixed(1)}%</td>
                      <td className="p-2.5 text-slate-300">Penugasan studi kasus kontekstual dan analisis tematik PAI.</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-2.5 font-bold text-slate-200">Jayyid / Maqbul (Sedang)</td>
                      <td className="p-2.5 text-center font-mono">-1.0 ≤ Z &lt; +1.0</td>
                      <td className="p-2.5 text-center font-mono font-bold">40 ≤ T &lt; 60</td>
                      <td className="p-2.5 text-center font-bold text-white text-sm">{catSedang}</td>
                      <td className="p-2.5 text-center text-slate-300">{((catSedang / stats.count) * 100).toFixed(1)}%</td>
                      <td className="p-2.5 text-slate-300">Pemantapan konsep inti materi pembelajaran reguler.</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-2.5 font-bold text-amber-400">Dha&apos;if (Rendah)</td>
                      <td className="p-2.5 text-center font-mono">-2.0 ≤ Z &lt; -1.0</td>
                      <td className="p-2.5 text-center font-mono font-bold">30 ≤ T &lt; 40</td>
                      <td className="p-2.5 text-center font-bold text-amber-300 text-sm">{catRendah}</td>
                      <td className="p-2.5 text-center text-slate-300">{((catRendah / stats.count) * 100).toFixed(1)}%</td>
                      <td className="p-2.5 text-slate-300">Bimbingan remedial terstruktur dan pendampingan tutor sebaya.</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-2.5 font-bold text-rose-400">Dha&apos;if Jiddan (Sangat Rendah)</td>
                      <td className="p-2.5 text-center font-mono">Z &lt; -2.0</td>
                      <td className="p-2.5 text-center font-mono font-bold">T &lt; 30</td>
                      <td className="p-2.5 text-center font-bold text-rose-300 text-sm">{catSangatRendah}</td>
                      <td className="p-2.5 text-center text-slate-300">{((catSangatRendah / stats.count) * 100).toFixed(1)}%</td>
                      <td className="p-2.5 text-slate-300">Diagnosis kesulitan belajar, konseling akademik, dan remedial intensif.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="text-xs text-slate-400 border-t border-slate-800 pt-2 flex justify-between">
                <span>Penerapan Pembelajaran Berdiferensiasi Berbasis Bukti Data</span>
                <span>Standar Penilaian Pendidikan Magister S2 PAI</span>
              </div>
            </div>
          )}

          {/* =========================================
              SLIDE 9: MODUL 4 - GRAFIK STATISTIK
              ========================================= */}
          {currentSlide === 9 && (
            <div className="w-full h-full bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between text-white">
              <div>
                <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Modul 4 • Grafik Statistik Pendidikan
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
                  4 Model Visualisasi Data Hasil Belajar Mahasiswa
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
                <div className="bg-slate-800/90 rounded-xl p-4 border border-emerald-600/50 space-y-2">
                  <h3 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    1. Histogram & Poligon Frekuensi
                  </h3>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    <li>Histogram: Batang vertikal merepresentasikan frekuensi (fi) pada batas nyata interval kelas.</li>
                    <li>Poligon: Garis yang menghubungkan titik tengah (Xi) setiap interval kelas.</li>
                    <li>Memberikan gambaran visual langsung mengenai konsentrasi dan kerapatan skor.</li>
                  </ul>
                </div>

                <div className="bg-slate-800/90 rounded-xl p-4 border border-teal-600/50 space-y-2">
                  <h3 className="font-bold text-teal-300 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    2. Kurva Normal Baku (Gauss / Bell Curve)
                  </h3>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    <li>Kurva lonceng simetris teoritis berpusat pada Mean (Z = 0).</li>
                    <li>Rentang ±1σ memuat 68.26% populasi responden.</li>
                    <li>Rentang ±2σ memuat 95.44% responden (wilayah toleransi normal).</li>
                  </ul>
                </div>

                <div className="bg-slate-800/90 rounded-xl p-4 border border-blue-600/50 space-y-2">
                  <h3 className="font-bold text-blue-300 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    3. Kurva Ogive Dual (Kumulatif Positif & Negatif)
                  </h3>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    <li>Ogive Positif (menaik) berdasar frekuensi kumulatif kurang dari (fk ≤).</li>
                    <li>Ogive Negatif (menurun) berdasar frekuensi kumulatif lebih dari (fk ≥).</li>
                    <li>Titik perpotongan kedua ogive tepat menunjukkan estimasi nilai Median ({stats.median.toFixed(1)}).</li>
                  </ul>
                </div>

                <div className="bg-slate-800/90 rounded-xl p-4 border border-purple-600/50 space-y-2">
                  <h3 className="font-bold text-purple-300 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    4. Diagram Kotak Garis (Boxplot)
                  </h3>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    <li>Memvisualisasikan ringkasan 5-angka: Min ({stats.min}), Q1 ({stats.q1.toFixed(1)}), Median ({stats.median.toFixed(1)}), Q3 ({stats.q3.toFixed(1)}), Max ({stats.max}).</li>
                    <li>Panjang kotak mewakili bentangan IQR (50% nilai tengah responden).</li>
                    <li>Efisien untuk mendeteksi pencilan (outlier) dan asimetri data.</li>
                  </ul>
                </div>
              </div>

              <div className="text-xs text-slate-400 border-t border-slate-800 pt-2 flex justify-between">
                <span>Grafik Memudahkan Komunikasi Visual Hasil Penelitian Tesis</span>
                <span>Tab &quot;4. Grafik Statistik&quot; untuk Tampilan Interaktif</span>
              </div>
            </div>
          )}

          {/* =========================================
              SLIDE 10: SINTESIS & KESIMPULAN
              ========================================= */}
          {currentSlide === 10 && (
            <div className="w-full h-full bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 rounded-xl p-6 sm:p-10 border border-emerald-700/60 shadow-2xl flex flex-col justify-between text-white relative overflow-hidden">
              <div className="space-y-2 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 font-semibold text-xs tracking-wide uppercase">
                  Sintesis Akhir Modul
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                  Implikasi Pedagogis bagi Pembelajaran & Evaluasi PAI
                </h2>
              </div>

              <div className="bg-emerald-900/60 backdrop-blur-md rounded-xl p-5 border border-emerald-700/50 space-y-3 z-10 my-auto text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </span>
                  <div>
                    <h4 className="font-bold text-amber-300">Prinsip Keadilan Penilaian (Fair Assessment)</h4>
                    <p className="text-emerald-100/90 mt-0.5 leading-relaxed">
                      Evaluasi PAI tidak boleh semata-mata mengandalkan skor mentah. Transformasi Z-Score dan T-Score menjamin keadilan penilaian di lintas kelas dan lintas pengampu.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </span>
                  <div>
                    <h4 className="font-bold text-amber-300">Implementasi Pembelajaran Berdiferensiasi</h4>
                    <p className="text-emerald-100/90 mt-0.5 leading-relaxed">
                      Ditemukannya {catMumtaz + catTinggi} mahasiswa kategori tinggi dan {catRendah + catSangatRendah} mahasiswa kategori rendah menjadi dasar objektif perancangan modul pengayaan dan remedial.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </span>
                  <div>
                    <h4 className="font-bold text-amber-300">Penyusunan Bab IV Tesis Magister PAI</h4>
                    <p className="text-emerald-100/90 mt-0.5 leading-relaxed">
                      Kombinasi ukuran pemusatan, dispersi, distribusi frekuensi berkelompok, dan grafik statistik menyajikan argumentasi empiris yang kokoh dan dapat dipertanggungjawabkan secara metodologis.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-300/80 border-t border-emerald-800/60 pt-3 z-10">
                <span>Program Pascasarjana Magister (S2) PAI • Pengembang: <strong className="text-amber-300 font-semibold">Husni, S.Kom.I</strong></span>
                <span>Terima Kasih • Al-Hamdulillahi Rabbil &apos;Alamin</span>
              </div>
            </div>
          )}
        </div>

        {/* Slide Stage Footer Controls */}
        <div className="bg-slate-900 border-t border-slate-800 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide(1)}
              disabled={currentSlide === 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Ke slide pertama (Home)"
            >
              <span className="text-xs font-mono font-bold px-1">&laquo; Awal</span>
            </button>
            <button
              onClick={handlePrev}
              disabled={currentSlide === 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-xs"
              title="Slide sebelumnya (Panah Kiri)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>
          </div>

          {/* Quick Slider Indicator */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs sm:max-w-md px-2 py-1">
            {Array.from({ length: totalSlides }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentSlide(num)}
                className={`w-7 h-7 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                  currentSlide === num
                    ? "bg-emerald-500 text-slate-950 shadow-md scale-105"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
                title={`Lompat ke Slide ${num}`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNext}
              disabled={currentSlide === totalSlides}
              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
              title="Slide berikutnya (Panah Kanan / Spasi)"
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide(totalSlides)}
              disabled={currentSlide === totalSlides}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Ke slide terakhir (End)"
            >
              <span className="text-xs font-mono font-bold px-1">Akhir &raquo;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Speaker Notes / Catatan Dosen & Pemateri */}
      {showNotes && (
        <div className="bg-amber-50 dark:bg-slate-800/80 rounded-xl p-5 border border-amber-200 dark:border-amber-900/40 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{slideNotes[currentSlide]?.title || "Catatan Pembicara"}</span>
                  <span className="text-[11px] font-semibold bg-amber-200/60 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                    Slide {currentSlide}
                  </span>
                </h3>
              </div>
              <ul className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                {slideNotes[currentSlide]?.points.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Slide Thumbnails & Module Breakdown Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Daftar Slide & Peta Materi Modul PPT
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Total {totalSlides} Slide Lengkap
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { num: 1, title: "Cover & Identitas", mod: "Pengantar", color: "border-emerald-500" },
            { num: 2, title: "Peta 4 Pilar Analisis", mod: "Roadmap", color: "border-slate-500" },
            { num: 3, title: "Ukuran Pemusatan", mod: "Modul 1", color: "border-emerald-500" },
            { num: 4, title: "Ukuran Sebaran & Dispersi", mod: "Modul 1", color: "border-emerald-500" },
            { num: 5, title: "Kaidah Sturges", mod: "Modul 2", color: "border-teal-500" },
            { num: 6, title: "Tabel Frekuensi", mod: "Modul 2", color: "border-teal-500" },
            { num: 7, title: "Z-Score & T-Score", mod: "Modul 3", color: "border-blue-500" },
            { num: 8, title: "Matriks Mutu PAI", mod: "Modul 3", color: "border-blue-500" },
            { num: 9, title: "4 Grafik Statistik", mod: "Modul 4", color: "border-purple-500" },
            { num: 10, title: "Sintesis & Implikasi PAI", mod: "Penutup", color: "border-amber-500" },
          ].map((item) => (
            <button
              key={item.num}
              onClick={() => setCurrentSlide(item.num)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                currentSlide === item.num
                  ? `bg-emerald-50 dark:bg-emerald-950/40 ${item.color} shadow-sm ring-2 ring-emerald-500/30`
                  : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-400"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-slate-500 dark:text-slate-400">Slide {item.num}</span>
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {item.mod}
                </span>
              </div>
              <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                {item.title}
              </div>
            </button>
          ))}
        </div>

        {/* Tips for presenting */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Pintasan Navigasi:</strong> Gunakan tombol <strong>Panah Kanan (→)</strong> atau <strong>Spasi</strong> untuk maju, <strong>Panah Kiri (←)</strong> untuk mundur, dan <strong>Home / End</strong> untuk ke awal / akhir.
            </span>
          </div>
          <button
            onClick={handleDownloadPptx}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh .pptx</span>
          </button>
        </div>
      </div>
    </div>
  );
};
