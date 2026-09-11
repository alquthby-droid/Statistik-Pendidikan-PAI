import React, { useState, useRef } from "react";
import {
  FileText,
  Sparkles,
  Printer,
  Copy,
  Check,
  Download,
  BookOpen,
  RefreshCw,
  Eye,
  Settings,
  AlertCircle,
  FileCheck,
  Presentation,
  Users,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { DescriptiveStats, FrequencyClass, ZScoreItem, SturgesCalc, GroupAssignmentInfo, ResearchAttachment } from "../types";
import { AcademicReportDocument } from "./AcademicReportDocument";
import { exportPagesToPdf, PdfExportProgress } from "../utils/pdfExport";
import { exportToPptx } from "../utils/pptxExport";
import { LampiranGambarModal } from "./LampiranGambarModal";
import { IAI_ALJIHAD_SIX_GROUPS_DEFINITIONS, SixGroupDefinition } from "../data/institutions";
import { ChevronDown, ChevronUp, FileSpreadsheet, X, CheckCircle2 } from "lucide-react";

interface LaporanAkademikViewProps {
  stats: DescriptiveStats | null;
  sturges: SturgesCalc | null;
  frequencyClasses: FrequencyClass[];
  zScores: ZScoreItem[];
  dataTitle: string;
  variableName: string;
  groupInfo?: GroupAssignmentInfo;
  onOpenGroupConfig?: () => void;
  onUpdateGroupInfo?: (updated: GroupAssignmentInfo) => void;
}

export const LaporanAkademikView: React.FC<LaporanAkademikViewProps> = ({
  stats,
  sturges,
  frequencyClasses,
  zScores,
  dataTitle,
  variableName,
  groupInfo,
  onOpenGroupConfig,
  onUpdateGroupInfo,
}) => {
  const [activeTab, setActiveTab] = useState<"pdfPreview" | "manuscriptText">("pdfPreview");
  const [copied, setCopied] = useState<boolean>(false);
  const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isLampiranModalOpen, setIsLampiranModalOpen] = useState<boolean>(false);

  // PDF Export states
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [pdfProgress, setPdfProgress] = useState<PdfExportProgress | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfSuccess, setPdfSuccess] = useState<boolean>(false);
  const [includeAiInPdf, setIncludeAiInPdf] = useState<boolean>(true);
  const [isExportingPptx, setIsExportingPptx] = useState<boolean>(false);
  const [showRekapModal, setShowRekapModal] = useState<boolean>(false);

  const documentContainerRef = useRef<HTMLDivElement>(null);

  if (!stats || !sturges) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <p className="text-slate-500">Belum ada data untuk menghasilkan laporan akademik.</p>
      </div>
    );
  }

  // Count categories
  const catMumtaz = zScores.filter((z) => z.category === "Sangat Tinggi").length;
  const catTinggi = zScores.filter((z) => z.category === "Tinggi").length;
  const catSedang = zScores.filter((z) => z.category === "Sedang").length;
  const catRendah = zScores.filter((z) => z.category === "Rendah").length;
  const catSangatRendah = zScores.filter((z) => z.category === "Sangat Rendah").length;

  // Request AI academic analysis
  const handleGenerateAiAnalysis = async () => {
    setIsLoadingAi(true);
    setAiError(null);

    try {
      const response = await fetch("/api/generate-academic-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${variableName} (${dataTitle})`,
          sampleSize: stats.count,
          stats: {
            mean: stats.mean,
            median: stats.median,
            mode: stats.mode,
            stdDev: stats.stdDevSample,
            variance: stats.varianceSample,
            range: stats.range,
            min: stats.min,
            max: stats.max,
            q1: stats.q1,
            q2: stats.q2,
            q3: stats.q3,
            iqr: stats.iqr,
            skewness: stats.skewness,
            kurtosis: stats.kurtosis,
          },
          distributionInfo: {
            classCount: sturges.k,
            classInterval: sturges.c,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.interpretation) {
        setAiInterpretation(data.interpretation);
        setIncludeAiInPdf(true);
      }
    } catch (err: any) {
      console.error(err);
      setAiError("Gagal menyusun narasi AI: " + (err.message || "Pastikan koneksi lancar."));
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Export to PDF function
  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    setPdfError(null);
    setPdfSuccess(false);

    try {
      // Ensure the PDF document DOM is visible for html2canvas
      await new Promise((resolve) => setTimeout(resolve, 150));

      const pageElements = Array.from(document.querySelectorAll<HTMLElement>(".pdf-page"));

      if (pageElements.length === 0) {
        throw new Error("Halaman laporan PDF tidak ditemukan di layar.");
      }

      const sanitizedName = variableName
        .replace(/[^a-zA-Z0-9\s_-]/g, "")
        .trim()
        .replace(/\s+/g, "_");
      const sanitizedInst = (groupInfo?.institutionName || "UIN")
        .replace(/[^a-zA-Z0-9\s_-]/g, "")
        .trim()
        .replace(/\s+/g, "_")
        .slice(0, 20);
      const sanitizedGroup = (groupInfo?.groupName || "Kelompok")
        .replace(/[^a-zA-Z0-9\s_-]/g, "")
        .trim()
        .replace(/\s+/g, "_");
      const filename = groupInfo?.isGroupAssignment
        ? `Tugas_${sanitizedGroup}_${sanitizedInst}_Statistik_PAI_${sanitizedName || "Data"}.pdf`
        : `Laporan_Statistik_S2_PAI_${sanitizedName || "Dokumen"}.pdf`;

      await exportPagesToPdf(pageElements, filename, (progress) => {
        setPdfProgress(progress);
      });

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      setPdfError("Gagal mengunduh file PDF: " + (err.message || "Silakan coba lagi."));
    } finally {
      setIsExportingPdf(false);
      setTimeout(() => setPdfProgress(null), 1000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPptx = async () => {
    if (!stats || !sturges) return;
    try {
      setIsExportingPptx(true);
      await exportToPptx({
        stats,
        sturges,
        frequencyClasses,
        zScores,
        variableName,
        dataTitle,
        groupInfo,
      });
    } catch (err: any) {
      console.error("Gagal mengekspor PPTX:", err);
      alert("Gagal menyusun slide PowerPoint: " + (err.message || "Silakan coba lagi."));
    } finally {
      setIsExportingPptx(false);
    }
  };

  const fullReportText = `LAPORAN HASIL ANALISIS STATISTIK PENDIDIKAN (S2 PAI)
Mata Kuliah: Statistik Pendidikan / Evaluasi Pembelajaran PAI
Judul Variabel: ${variableName} (${dataTitle})
Jumlah Sampel (N): ${stats.count} Mahasiswa/Responden

==================================================
BAB IV: HASIL PENELITIAN DAN PEMBAHASAN
==================================================

A. DESKRIPSI DATA STATISTIK PEMUSATAN & SEBARAN (DISPERSI)
Berdasarkan hasil pengolahan data terhadap ${stats.count} responden pada variabel "${variableName}", diperoleh ringkasan statistik deskriptif sebagai berikut:
1. Rata-Rata Hitung (Mean, X̄): ${stats.mean.toFixed(2)}
2. Nilai Tengah (Median, Me): ${stats.median.toFixed(2)}
3. Nilai Modus (Mo): ${stats.mode.length > 0 ? stats.mode.join(", ") : "Tidak ada nilai berulang"}
4. Nilai Minimum (Xmin): ${stats.min}
5. Nilai Maksimum (Xmax): ${stats.max}
6. Rentang / Jangkauan (Range, R): ${stats.range}
7. Standar Deviasi Sampel (s): ${stats.stdDevSample.toFixed(2)}
8. Varians Sampel (s²): ${stats.varianceSample.toFixed(2)}
9. Standar Error of Mean: ${stats.stdErrorMean.toFixed(2)}
10. Kuartil Bawah (Q1): ${stats.q1.toFixed(2)}
11. Kuartil Tengah (Q2): ${stats.q2.toFixed(2)}
12. Kuartil Atas (Q3): ${stats.q3.toFixed(2)}
13. Jangkauan Antarkuartil (IQR): ${stats.iqr.toFixed(2)}
14. Koefisien Variasi (CV): ${stats.coefVariation.toFixed(2)}%

B. DISTRIBUSI FREKUENSI BERKELOMPOK (ATURAN STURGES)
Penyusunan tabel distribusi frekuensi menggunakan rumus Sturges k = 1 + 3.322 log(N):
- Banyak Kelas (k): ${sturges.k} kelas
- Panjang Interval Kelas (c): ${sturges.c}
- Kemiringan Kurva (Skewness): ${stats.skewness.toFixed(3)} (${
    stats.skewness > 0.5 ? "Menceng Kanan" : stats.skewness < -0.5 ? "Menceng Kiri" : "Simetris Normal"
  })
- Keruncingan Kurva (Kurtosis): ${stats.kurtosis.toFixed(3)}

Tabel Frekuensi:
${frequencyClasses
  .map(
    (c) =>
      `Kelas ${c.index} [${c.lowerLimit}-${c.upperLimit}]: f = ${c.frequency} (${c.relativeFreq.toFixed(
        1
      )}%) | fk<= ${c.cumulativeLess}`
  )
  .join("\n")}

C. ANALISIS SKOR STANDAR Z-SCORE & T-SCORE EVALUASI PAI
Untuk menghindari distorsi skala mentah, dilakukan standarisasi nilai peserta didik ke dalam Z-Score [Z = (X - X̄) / s] dan T-Score [T = 50 + 10(Z)]:
- Sangat Tinggi / Mumtaz (Z >= +2.0): ${catMumtaz} mahasiswa (${((catMumtaz / stats.count) * 100).toFixed(1)}%)
- Tinggi / Jayyid Jiddan (+1.0 <= Z < +2.0): ${catTinggi} mahasiswa (${((catTinggi / stats.count) * 100).toFixed(1)}%)
- Sedang / Jayyid-Maqbul (-1.0 <= Z < +1.0): ${catSedang} mahasiswa (${((catSedang / stats.count) * 100).toFixed(1)}%)
- Rendah / Dha'if (-2.0 <= Z < -1.0): ${catRendah} mahasiswa (${((catRendah / stats.count) * 100).toFixed(1)}%)
- Sangat Rendah / Dha'if Jiddan (Z < -2.0): ${catSangatRendah} mahasiswa (${((catSangatRendah / stats.count) * 100).toFixed(1)}%)

D. IMPLIKASI DAN REKOMENDASI PEDAGOGIS PAI
Sebaran nilai peserta didik menunjukkan karakteristik pencapaian kompetensi pada mata kuliah PAI yang memerlukan tindak lanjut: pengayaan materi studi analitis untuk kelompok Mumtaz/Jayyid Jiddan, serta bimbingan remedial terbimbing bagi peserta didik pada kategori Dha'if.`;

  const handleCopyReport = () => {
    navigator.clipboard.writeText(fullReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Academic Report Banner & Actions */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl shadow-2xs">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Laporan Akademik & Ekspor PDF Lengkap (S2 PAI)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mencakup seluruh hasil statistik, tabel Sturges, 4 grafik visual resolusi tinggi, dan lembar pengesahan.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Primary: Download PDF */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-60 cursor-pointer active:scale-98"
            >
              {isExportingPdf ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-200" />
                  <span>Mengekspor PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-200" />
                  <span>Unduh Laporan PDF Lengkap</span>
                </>
              )}
            </button>

            {/* PPT Export Button */}
            <button
              onClick={handleDownloadPptx}
              disabled={isExportingPptx}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-60 cursor-pointer active:scale-98"
              title="Unduh slide presentasi modul (.pptx) lengkap"
            >
              {isExportingPptx ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Menyusun PPT...</span>
                </>
              ) : (
                <>
                  <Presentation className="w-4 h-4 text-slate-950" />
                  <span>Unduh Slide PPT (.pptx)</span>
                </>
              )}
            </button>

            {/* Print or Browser PDF */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Cetak Dokumen</span>
            </button>

            {/* AI Academic Analysis */}
            <button
              onClick={handleGenerateAiAnalysis}
              disabled={isLoadingAi}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-xl border border-emerald-200/80 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoadingAi ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>Menyusun AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Susun Narasi Ilmiah AI</span>
                </>
              )}
            </button>

            {/* Group Assignment & Institution Config Button */}
            {onOpenGroupConfig && (
              <button
                onClick={onOpenGroupConfig}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-950 text-xs font-semibold rounded-xl border border-emerald-300 shadow-2xs transition-all cursor-pointer"
                title="Sesuaikan Nama Perguruan Tinggi, Kelompok, dan Anggota Mahasiswa"
              >
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Pengaturan Kelompok & Kampus</span>
              </button>
            )}

            {/* Lampiran Gambar & Foto Riset */}
            <button
              onClick={() => setIsLampiranModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-semibold rounded-xl border border-amber-300 shadow-2xs transition-all cursor-pointer"
              title="Kelola Lampiran Foto & Bukti Riset untuk Laporan PDF Halaman 7"
            >
              <Camera className="w-4 h-4 text-amber-700" />
              <span>Lampiran Gambar ({groupInfo?.attachments?.length || 1})</span>
            </button>

            {/* Copy Text */}
            <button
              onClick={handleCopyReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Tersalin!" : "Salin ke Word"}</span>
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {pdfProgress && (
          <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-900 animate-fadeIn">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
              <span className="font-semibold">{pdfProgress.status}</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Halaman {pdfProgress.currentPage} dari {pdfProgress.totalPages}
            </div>
          </div>
        )}

        {pdfSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2 text-xs text-emerald-900 animate-fadeIn">
            <FileCheck className="w-4 h-4 text-emerald-700" />
            <span className="font-semibold">
              Dokumen PDF resmi berhasil diunduh dan disimpan ke perangkat Anda!
            </span>
          </div>
        )}

        {pdfError && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{pdfError}</span>
          </div>
        )}

        {/* Tab Switcher: PDF Document Layout vs Manuscript Text */}
        <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab("pdfPreview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "pdfPreview"
                  ? "bg-white text-emerald-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-700" />
              Pratinjau Dokumen PDF Resmi (7 Halaman Lengkap)
            </button>
            <button
              onClick={() => setActiveTab("manuscriptText")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "manuscriptText"
                  ? "bg-white text-emerald-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              Format Naskah Bab IV (Teks Word)
            </button>
          </div>

          {/* AI Narrative Toggle */}
          {aiInterpretation && (
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeAiInPdf}
                onChange={(e) => setIncludeAiInPdf(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4"
              />
              <span>Sertakan Ulasan AI dalam Laporan PDF</span>
            </label>
          )}
        </div>
      </div>

      {/* AI Academic Analysis Box if Generated */}
      {aiInterpretation && (
        <div className="p-5 bg-gradient-to-r from-emerald-50/90 to-teal-50/70 border border-emerald-200 rounded-2xl space-y-3 no-print">
          <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Ulasan Ilmiah Mendalam (AI Guru Besar Statistik PAI)
            </h3>
            <span className="text-[11px] font-semibold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
              Standar Tesis S2 PAI
            </span>
          </div>
          <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
            {aiInterpretation}
          </div>
        </div>
      )}

      {aiError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 no-print">
          {aiError}
        </div>
      )}

      {/* View 1: Authentic PDF Document Layout (Always in DOM so html2canvas can capture it) */}
      <div
        ref={documentContainerRef}
        className={activeTab === "pdfPreview" ? "block" : "hidden print:block"}
      >
        {/* Quick Group Selector Bar (Kelompok I s/d Kelompok VI) */}
        <div className="mb-4 bg-white border border-emerald-300/90 rounded-2xl p-3 sm:p-4 shadow-xs no-print space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                6
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span>Pilih Kelompok Laporan Akademik:</span>
                  <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {groupInfo?.groupName || "Kelompok I"}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tersedia 6 kelompok resmi (29 mahasiswa). Klik kelompok untuk memperbarui Cover, Pengesahan, dan Lampiran PDF seketika.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowRekapModal(true)}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold rounded-lg cursor-pointer transition-colors shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Rekap 6 Kelompok (29 Mhs)</span>
              </button>
              {onOpenGroupConfig && (
                <button
                  type="button"
                  onClick={onOpenGroupConfig}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer transition-colors"
                  title="Buka Pengaturan Kelompok & Kampus Lengkap"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Kustomisasi</span>
                </button>
              )}
            </div>
          </div>

          {/* 6 Group Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {IAI_ALJIHAD_SIX_GROUPS_DEFINITIONS.map((grp) => {
              const isCurrentActive =
                groupInfo?.groupName?.includes(grp.roman) ||
                groupInfo?.groupName?.toLowerCase() === grp.groupName.toLowerCase();

              return (
                <button
                  key={grp.groupNumber}
                  type="button"
                  onClick={() => {
                    if (onUpdateGroupInfo) {
                      onUpdateGroupInfo({
                        ...grp.groupInfo,
                        institutionName: groupInfo?.institutionName || grp.groupInfo.institutionName,
                        faculty: groupInfo?.faculty || grp.groupInfo.faculty,
                        studyProgram: groupInfo?.studyProgram || grp.groupInfo.studyProgram,
                        courseName: groupInfo?.courseName || grp.groupInfo.courseName,
                        logoUrl: groupInfo?.logoUrl || grp.groupInfo.logoUrl,
                        lecturer: groupInfo?.lecturer || grp.groupInfo.lecturer,
                        lecturerNip: groupInfo?.lecturerNip || grp.groupInfo.lecturerNip,
                        attachments: groupInfo?.attachments || grp.groupInfo.attachments,
                      });
                    }
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isCurrentActive
                      ? "bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-500 ring-offset-1"
                      : "bg-slate-50 hover:bg-emerald-50/80 border-slate-200 text-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-black text-[11px] px-1.5 py-0.5 rounded ${
                          isCurrentActive ? "bg-emerald-900 text-emerald-100" : "bg-emerald-100 text-emerald-900"
                        }`}
                      >
                        Kel. {grp.roman}
                      </span>
                      <span className={`text-[10px] font-bold ${isCurrentActive ? "text-emerald-200" : "text-emerald-800"}`}>
                        {grp.members.length} Mhs
                      </span>
                    </div>
                    <div className="font-bold text-xs truncate leading-tight">
                      {grp.groupName}
                    </div>
                    <div className={`text-[10px] truncate mt-0.5 ${isCurrentActive ? "text-emerald-100" : "text-slate-600"}`}>
                      Ketua: <strong>{grp.leader.split(" ")[0]}</strong>
                    </div>
                  </div>
                  <div className="mt-2 pt-1 border-t border-emerald-700/40 flex items-center justify-between text-[9.5px]">
                    <span className={isCurrentActive ? "text-emerald-200 font-semibold" : "text-slate-500"}>
                      {isCurrentActive ? "Sedang Aktif" : "Klik untuk Pilih"}
                    </span>
                    {isCurrentActive && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-2 text-center text-xs text-slate-500 no-print">
          Menampilkan tata letak A4 presisi cetak (Kop surat resmi, ringkasan pemusatan & dispersi, tabel Sturges, 4 grafik statistik, dan lembar pengesahan).
        </div>
        <AcademicReportDocument
          stats={stats}
          sturges={sturges}
          frequencyClasses={frequencyClasses}
          zScores={zScores}
          dataTitle={dataTitle}
          variableName={variableName}
          aiInterpretation={aiInterpretation}
          includeAiAnalysis={includeAiInPdf}
          groupInfo={groupInfo}
        />
      </div>

      {/* View 2: Manuscript Text (Bab IV Skripsi / Tesis) */}
      {activeTab === "manuscriptText" && (
        <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/90 font-serif text-slate-900 space-y-6 shadow-inner no-print">
          <div className="text-center border-b border-slate-300 pb-4">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-900">
              FORMAT NASKAH BAB IV TESIS / SKRIPSI MAGISTER PAI
            </h3>
            <p className="text-xs text-slate-600 mt-1 font-sans">
              Program Studi Magister (S2) Pendidikan Agama Islam
            </p>
            <p className="text-xs font-semibold text-emerald-800 font-sans mt-0.5">
              Variabel: {variableName} ({dataTitle})
            </p>
          </div>

          {/* Bagian 1: Deskripsi Data */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900 font-sans">
              A. Deskripsi Data & Ukuran Pemusatan (Central Tendency)
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-justify">
              Berdasarkan pengumpulan data yang diperoleh dari {stats.count} responden mengenai{" "}
              <strong>{variableName}</strong>, nilai rata-rata (Mean, X̄) tercatat sebesar{" "}
              <strong>{stats.mean.toFixed(2)}</strong>. Nilai tengah (Median) sebesar{" "}
              <strong>{stats.median.toFixed(2)}</strong>, dan nilai modus sebesar{" "}
              <strong>
                {stats.mode.length > 0 ? stats.mode.join(", ") : "tidak memiliki modus dominan"}
              </strong>
              . Rentang nilai peserta didik berada dari nilai minimum <strong>{stats.min}</strong> hingga
              nilai maksimum <strong>{stats.max}</strong> dengan jangkauan (Range) sebesar{" "}
              <strong>{stats.range}</strong>.
            </p>
          </div>

          {/* Bagian 2: Ukuran Dispersi */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900 font-sans">
              B. Ukuran Sebaran dan Variabilitas (Dispersi)
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-justify">
              Tingkat keragaman kemampuan mahasiswa ditunjukkan oleh nilai standar deviasi sampel (s)
              sebesar <strong>{stats.stdDevSample.toFixed(2)}</strong> dengan varians sampel (s²) sebesar{" "}
              <strong>{stats.varianceSample.toFixed(2)}</strong>. Koefisien variasi sebesar{" "}
              <strong>{stats.coefVariation.toFixed(2)}%</strong> menunjukkan tingkat homogenitas nilai dalam
              kelompok. Kuartil bawah (Q1) tercatat <strong>{stats.q1.toFixed(2)}</strong> dan kuartil atas
              (Q3) tercatat <strong>{stats.q3.toFixed(2)}</strong>, menghasilkan jangkauan antarkuartil (IQR)
              sebesar <strong>{stats.iqr.toFixed(2)}</strong> dengan simpangan kuartil (Qd) sebesar{" "}
              <strong>{stats.quartileDeviation.toFixed(2)}</strong>.
            </p>
          </div>

          {/* Bagian 3: Distribusi Frekuensi */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900 font-sans">
              C. Distribusi Frekuensi Berkelompok & Bentuk Kurva (Aturan Sturges)
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-justify">
              Berdasarkan Aturan Sturges [k = 1 + 3.322 log({stats.count})], diperoleh banyak kelas interval
              sebanyak <strong>{sturges.k} kelas</strong> dengan panjang interval{" "}
              <strong>c = {sturges.c}</strong>. Tingkat kemiringan kurva (Skewness) berada pada angka{" "}
              <strong>{stats.skewness.toFixed(3)}</strong> dan keruncingan (Kurtosis) sebesar{" "}
              <strong>{stats.kurtosis.toFixed(3)}</strong>, yang mengindikasikan pola persebaran data hasil
              belajar terhadap kurva normal standar.
            </p>
          </div>

          {/* Bagian 4: Z-Score & T-Score */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900 font-sans">
              D. Standarisasi Evaluasi Pembelajaran PAI (Z-Score & T-Score)
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-justify">
              Dalam konteks evaluasi hasil belajar Pendidikan Agama Islam, nilai mentah dikonversikan ke dalam
              skor baku Z-Score dan T-Score guna menentukan posisi relatif pencapaian mahasiswa secara
              objektif. Klasifikasi mutu akademik terbagi sebagai berikut:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm space-y-1 font-sans text-slate-700 pl-2">
              <li>
                <strong>Kategori Mumtaz / Sangat Tinggi (Z ≥ +2.0)</strong>: {catMumtaz} mahasiswa (
                {((catMumtaz / stats.count) * 100).toFixed(1)}%)
              </li>
              <li>
                <strong>Kategori Jayyid Jiddan / Tinggi (+1.0 ≤ Z &lt; +2.0)</strong>: {catTinggi} mahasiswa (
                {((catTinggi / stats.count) * 100).toFixed(1)}%)
              </li>
              <li>
                <strong>Kategori Jayyid / Maqbul / Sedang (-1.0 ≤ Z &lt; +1.0)</strong>: {catSedang} mahasiswa (
                {((catSedang / stats.count) * 100).toFixed(1)}%)
              </li>
              <li>
                <strong>Kategori Dha'if / Rendah (-2.0 ≤ Z &lt; -1.0)</strong>: {catRendah} mahasiswa (
                {((catRendah / stats.count) * 100).toFixed(1)}%)
              </li>
              <li>
                <strong>Kategori Dha'if Jiddan / Sangat Rendah (Z &lt; -2.0)</strong>: {catSangatRendah}{" "}
                mahasiswa ({((catSangatRendah / stats.count) * 100).toFixed(1)}%)
              </li>
            </ul>
          </div>

          {/* Bagian 5: Implikasi Pedagogis */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900 font-sans">
              E. Implikasi Pedagogis bagi Pendidikan Agama Islam
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-justify">
              Hasil analisis statistik menunjukkan bahwa proses evaluasi PAI tidak hanya bertumpu pada angka
              mutlak, melainkan memerlukan interpretasi sebaran dan standardisasi skor baku. Pendidik
              disarankan memberikan pengayaan berbasis riset bagi kelompok berprestasi tinggi, serta menyusun
              program remedial diferensiatif bagi mahasiswa yang memerlukan penguatan konsep dasar PAI.
            </p>
          </div>
        </div>
      )}

      {/* Lampiran Gambar Modal */}
      {isLampiranModalOpen && groupInfo && (
        <LampiranGambarModal
          isOpen={isLampiranModalOpen}
          onClose={() => setIsLampiranModalOpen(false)}
          attachments={groupInfo.attachments || []}
          logoUrl={groupInfo.logoUrl}
          institutionName={groupInfo.institutionName}
          onSave={(newAttachments, newLogoUrl) => {
            if (onUpdateGroupInfo) {
              onUpdateGroupInfo({
                ...groupInfo,
                attachments: newAttachments,
                logoUrl: newLogoUrl,
              });
            }
          }}
        />
      )}

      {/* Rekap 6 Kelompok Modal Dialog */}
      {showRekapModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
                <div>
                  <h3 className="font-bold text-sm">
                    Rekap Pembagian 6 Kelompok (Kelompok I s/d Kelompok VI)
                  </h3>
                  <p className="text-[11px] text-emerald-200">
                    Rombel Semester 1 — Total 29 Mahasiswa Pascasarjana Magister PAI IAI Al-Jihad
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRekapModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold">Distribusi Jumlah Anggota:</span> Kelompok I (5), Kelompok II (5), Kelompok III (5), Kelompok IV (5), Kelompok V (5), Kelompok VI (4) = <strong>29 Mahasiswa</strong>.
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold shrink-0">
                  Dosen Pengampu: Dr. Aang Darsono, M.Pd.I (KD-04)
                </div>
              </div>

              {/* 6 Groups Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {IAI_ALJIHAD_SIX_GROUPS_DEFINITIONS.map((grp) => {
                  const isCurrentActive =
                    groupInfo?.groupName?.includes(grp.roman) ||
                    groupInfo?.groupName?.toLowerCase() === grp.groupName.toLowerCase();

                  return (
                    <div
                      key={grp.groupNumber}
                      className={`border rounded-xl p-3.5 flex flex-col justify-between transition-all ${
                        isCurrentActive
                          ? "bg-emerald-50/70 border-emerald-500 shadow-sm ring-1 ring-emerald-500"
                          : "bg-white border-slate-200 hover:border-emerald-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-800 text-white font-black text-xs">
                              {grp.roman}
                            </span>
                            <span className="font-bold text-slate-900 text-xs">{grp.groupName}</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                            {grp.members.length} Mhs
                          </span>
                        </div>

                        <div className="text-[10.5px] text-emerald-900 font-semibold mb-2 line-clamp-2">
                          📌 {grp.topic}
                        </div>

                        <div className="space-y-1.5 text-[11px]">
                          {grp.members.map((m, idx) => (
                            <div
                              key={m.id}
                              className="flex items-start justify-between gap-1 py-1 border-b border-slate-100 last:border-b-0"
                            >
                              <div className="flex items-start gap-1">
                                <span className="font-mono text-[10px] text-slate-400 w-3.5">
                                  {idx + 1}.
                                </span>
                                <div>
                                  <div className={`font-semibold ${idx === 0 ? "text-emerald-950 font-bold" : "text-slate-800"}`}>
                                    {m.name} {idx === 0 && <span className="text-[9.5px] text-emerald-700">(Ketua)</span>}
                                  </div>
                                  <div className="text-[9.5px] text-slate-500 font-mono">
                                    NIM: {m.nim}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                        {isCurrentActive ? (
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Kelompok Aktif Saat Ini
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (onUpdateGroupInfo) {
                                onUpdateGroupInfo({
                                  ...grp.groupInfo,
                                  institutionName: groupInfo?.institutionName || grp.groupInfo.institutionName,
                                  faculty: groupInfo?.faculty || grp.groupInfo.faculty,
                                  studyProgram: groupInfo?.studyProgram || grp.groupInfo.studyProgram,
                                  courseName: groupInfo?.courseName || grp.groupInfo.courseName,
                                  logoUrl: groupInfo?.logoUrl || grp.groupInfo.logoUrl,
                                  lecturer: groupInfo?.lecturer || grp.groupInfo.lecturer,
                                  lecturerNip: groupInfo?.lecturerNip || grp.groupInfo.lecturerNip,
                                  attachments: groupInfo?.attachments || grp.groupInfo.attachments,
                                });
                              }
                              setShowRekapModal(false);
                            }}
                            className="w-full py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold text-center cursor-pointer transition-colors"
                          >
                            Pilih Kelompok Ini untuk Laporan
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Data resmi Semester 1 Magister PAI Tahun Akademik 2025 Genap
              </span>
              <button
                type="button"
                onClick={() => setShowRekapModal(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
