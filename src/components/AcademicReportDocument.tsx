import React from "react";
import {
  DescriptiveStats,
  FrequencyClass,
  ZScoreItem,
  SturgesCalc,
  GroupAssignmentInfo,
  ResearchAttachment,
} from "../types";
import {
  HistogramChart,
  NormalCurveChart,
  OgiveChart,
  BoxPlotChart,
} from "./StatCharts";
import { LOGO_IAI_ALJIHAD_DATA_URI } from "../assets/logoIaiAlJihad";
import { LOGO_IAI_ASA_DATA_URI } from "../assets/logoIaiAsa";
import { IAI_ALJIHAD_SEMESTER_1_STUDENTS } from "../data/students";
import { IAI_ALJIHAD_LECTURERS, DAFTAR_DOSEN_DOCUMENT_DATA_URI } from "../data/institutions";

interface AcademicReportDocumentProps {
  stats: DescriptiveStats;
  sturges: SturgesCalc;
  frequencyClasses: FrequencyClass[];
  zScores: ZScoreItem[];
  dataTitle: string;
  variableName: string;
  aiInterpretation?: string | null;
  includeAiAnalysis?: boolean;
  groupInfo?: GroupAssignmentInfo;
}

export const AcademicReportDocument: React.FC<AcademicReportDocumentProps> = ({
  stats,
  sturges,
  frequencyClasses,
  zScores,
  dataTitle,
  variableName,
  aiInterpretation,
  includeAiAnalysis = true,
  groupInfo,
}) => {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const instName = groupInfo?.institutionName || "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta";
  const facultyName = groupInfo?.faculty || "Fakultas Tarbiyah / Program Pascasarjana";
  const prodiName = groupInfo?.studyProgram || "Magister (S2) Pendidikan Agama Islam";
  const groupName = groupInfo?.groupName || "Kelompok III (Tiga)";
  const lecturerName = groupInfo?.lecturer || "Dr. H. Shalahuddin Al-Hafidz, M.Pd.I.";
  const lecturerNip = groupInfo?.lecturerNip || "19780512 200501 1 003";
  const academicYear = groupInfo?.academicYear || "Tahun Akademik 2025 Genap";
  const members = groupInfo?.members || [];
  const activeLogo = groupInfo?.logoUrl || LOGO_IAI_ALJIHAD_DATA_URI;
  const totalPages = 7;

  // Map 29 official students with calculation data if available
  const rosterStudents = IAI_ALJIHAD_SEMESTER_1_STUDENTS.map((std, idx) => {
    // Look for a matching label/name or match by sequential index
    const matchedZ = zScores.find((z) =>
      z.label.toLowerCase().includes(std.name.toLowerCase()) ||
      std.name.toLowerCase().includes(z.label.toLowerCase()) ||
      (z.id !== undefined && Number(z.id) === std.no)
    ) || zScores[idx];

    return {
      no: std.no,
      nim: std.nim,
      name: std.name,
      score: matchedZ ? matchedZ.score : undefined,
      zScore: matchedZ ? matchedZ.zScore : undefined,
      tScore: matchedZ ? matchedZ.tScore : undefined,
      category: matchedZ ? matchedZ.category : undefined,
    };
  });

  const defaultAttachments: ResearchAttachment[] = [
    {
      id: "att-logo",
      url: activeLogo,
      title: `Emblem & Logo Resmi ${instName}`,
      category: "Surat Pengantar & SK",
      date: currentDate,
      notes: `Identitas resmi ${instName} (${facultyName} - ${prodiName}) pada pengesahan dokumen riset statistik PAI.`,
    },
  ];

  const displayAttachments: ResearchAttachment[] =
    groupInfo?.attachments && groupInfo.attachments.length > 0
      ? groupInfo.attachments
      : defaultAttachments;

  const catMumtaz = zScores.filter((z) => z.category === "Sangat Tinggi").length;
  const catTinggi = zScores.filter((z) => z.category === "Tinggi").length;
  const catSedang = zScores.filter((z) => z.category === "Sedang").length;
  const catRendah = zScores.filter((z) => z.category === "Rendah").length;
  const catSangatRendah = zScores.filter((z) => z.category === "Sangat Rendah").length;

  const totalFreq = frequencyClasses.reduce((acc, c) => acc + c.frequency, 0);
  const totalRelative = frequencyClasses.reduce((acc, c) => acc + c.relativeFreq, 0);
  const totalFX = frequencyClasses.reduce((acc, c) => acc + c.fx, 0);
  const totalFXDiffSquared = frequencyClasses.reduce((acc, c) => acc + c.fxDiffSquared, 0);
  const meanGrouped = totalFreq > 0 ? totalFX / totalFreq : stats.mean;

  // A4 fixed page styling: 794px width x 1123px height (Standard A4 @ 96 DPI)
  const pageStyle: React.CSSProperties = {
    width: "794px",
    minHeight: "1123px",
    maxHeight: "1123px",
    height: "1123px",
    padding: "36px 44px",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    color: "#0f172a",
    fontFamily: "Georgia, Cambria, 'Times New Roman', Times, serif",
    overflow: "hidden",
  };

  const renderRunningHeader = (pageNum: number) => (
    <div className="flex items-center justify-between border-b border-slate-300 pb-2 mb-3 text-[10px] text-slate-500 font-sans">
      <div className="flex items-center gap-2 truncate max-w-[520px]">
        {activeLogo && (
          <img
            src={activeLogo}
            alt="Logo"
            className="w-4 h-4 object-contain shrink-0"
          />
        )}
        <span className="font-semibold uppercase tracking-wider text-emerald-900 truncate">
          {instName} • {groupInfo?.isGroupAssignment ? groupName : prodiName}
        </span>
      </div>
      <span className="shrink-0 text-slate-400">Statistik Pendidikan S2 PAI • Halaman {pageNum}</span>
    </div>
  );

  const renderRunningFooter = (pageNum: number, totalPagesCount: number = totalPages) => (
    <div className="flex items-center justify-between border-t border-slate-300 pt-2 mt-3 text-[10px] text-slate-400 font-sans">
      <span className="truncate max-w-[500px]">
        Variabel: {variableName} • {instName} ({groupInfo?.isGroupAssignment ? groupName : "Tugas Mandiri"}) • Pengembang: Husni, S.Kom.I
      </span>
      <span className="font-medium text-slate-600">Dokumen Hasil Analisis — Hal {pageNum} dari {totalPagesCount}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6 bg-slate-200/60 p-4 sm:p-6 overflow-x-auto select-none print:p-0 print:bg-white">
      {/* =========================================================
          PAGE 1: KOP SURAT, METADATA, DAN STATISTIK PEMUSATAN & DISPERSI
      ========================================================= */}
      <div id="pdf-page-1" className="pdf-page shadow-md border border-slate-300 print:shadow-none print:border-none" style={pageStyle}>
        <div>
          {/* Official Letterhead (Kop Surat Lembaga Perguruan Tinggi dengan Logo) */}
          <div className="flex items-center justify-between border-b-[3px] border-double border-slate-800 pb-2.5 mb-3">
            <div className="w-18 h-18 shrink-0 flex items-center justify-center">
              {activeLogo && (
                <img
                  src={activeLogo}
                  alt="Logo Lembaga"
                  className="w-18 h-18 object-contain"
                />
              )}
            </div>
            <div className="flex-1 text-center px-2">
              <h1 className="text-[10px] font-bold uppercase tracking-wider text-slate-600 font-sans">
                KEMENTERIAN AGAMA REPUBLIK INDONESIA
              </h1>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wide text-slate-950 font-sans leading-tight mt-0.5">
                {instName}
              </h2>
              <p className="text-[10.5px] font-bold text-slate-800 font-sans mt-0.5">
                {facultyName} • {prodiName}
              </p>
              <p className="text-[9.5px] text-slate-600 font-sans italic mt-0.5">
                Mata Kuliah: {groupInfo?.courseName || "Statistik Pendidikan & Evaluasi Pembelajaran PAI"} | {academicYear}
              </p>
            </div>
            <div className="w-18 h-18 shrink-0 flex items-center justify-center">
              {activeLogo && (
                <img
                  src={activeLogo}
                  alt="Logo Lembaga"
                  className="w-18 h-18 object-contain"
                />
              )}
            </div>
          </div>

          <div className="text-center my-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-950 font-sans bg-emerald-50/80 py-1 border-y border-emerald-200 inline-block px-6 rounded">
              {groupInfo?.isGroupAssignment
                ? `LAPORAN TUGAS KELOMPOK: ANALISIS STATISTIK PENDIDIKAN`
                : "LAPORAN HASIL ANALISIS STATISTIK PENDIDIKAN"}
            </h3>
          </div>

          {/* Research & Group Identity Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[10.5px] font-sans my-2.5">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 pb-2 border-b border-slate-200">
              <div>
                <span className="text-slate-500">Judul / Sumber Data:</span>
                <p className="font-bold text-slate-900 truncate">{dataTitle}</p>
              </div>
              <div>
                <span className="text-slate-500">Variabel Penelitian:</span>
                <p className="font-bold text-emerald-900 truncate">{variableName}</p>
              </div>
              <div>
                <span className="text-slate-500">Penugasan & Kelompok:</span>
                <p className="font-bold text-emerald-900">{groupInfo?.isGroupAssignment ? groupName : "Tugas Individu"}</p>
              </div>
              <div>
                <span className="text-slate-500">Dosen Pengampu:</span>
                <p className="font-medium text-slate-800 truncate">{lecturerName}</p>
              </div>
              <div>
                <span className="text-slate-500">Jumlah Sampel / Responden (N):</span>
                <p className="font-bold text-slate-900 font-mono">{stats.count} Mahasiswa / Siswa</p>
              </div>
              <div>
                <span className="text-slate-500">Waktu Pelaksanaan Analisis:</span>
                <p className="font-medium text-slate-700">{currentDate}</p>
              </div>
              <div className="col-span-2 pt-0.5 flex items-center justify-between text-[9.5px] border-t border-slate-200 mt-0.5">
                <span className="text-slate-500">Pengembang Aplikasi / Sistem Komputasi:</span>
                <span className="font-bold text-emerald-950">Husni, S.Kom.I</span>
              </div>
            </div>

            {/* Tim Kelompok Display on Page 1 if Group Assignment */}
            {groupInfo?.isGroupAssignment && members.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block mb-1">
                  Tim Penyusun Tugas Kelompok ({members.length} Mahasiswa):
                </span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                  {members.map((m, idx) => (
                    <div key={m.id || idx} className="flex items-center gap-1.5 truncate">
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-800 text-white text-[8px] flex items-center justify-center shrink-0 font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-900 truncate">{m.name}</span>
                      <span className="text-slate-500 font-mono text-[9px]">({m.nim})</span>
                      {m.role && <span className="text-emerald-700 text-[8.5px] italic truncate">[{m.role}]</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bagian A: Ukuran Pemusatan */}
          <div className="mt-3">
            <h4 className="text-xs font-bold text-slate-900 font-sans border-b border-slate-300 pb-1 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-emerald-800 text-white inline-flex items-center justify-center text-[10px] font-mono">
                A
              </span>
              Ukuran Pemusatan Data (Central Tendency)
            </h4>
            <table className="w-full text-[10px] mt-1.5 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-sans border-y border-slate-300">
                  <th className="py-1 px-2 text-left">Parameter Statistik</th>
                  <th className="py-1 px-2 text-center">Simbol</th>
                  <th className="py-1 px-2 text-right">Nilai Hasil Analisis</th>
                  <th className="py-1 px-2 text-left">Deskripsi & Makna Statistik</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                <tr>
                  <td className="py-1 px-2 font-medium">Rata-Rata Hitung (Mean)</td>
                  <td className="py-1 px-2 text-center font-mono font-bold text-emerald-900">X̄</td>
                  <td className="py-1 px-2 text-right font-mono font-bold text-emerald-900 text-xs">{stats.mean.toFixed(2)}</td>
                  <td className="py-1 px-2 text-slate-600">Pusat massa bobot seluruh nilai responden</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 font-medium">Nilai Tengah (Median)</td>
                  <td className="py-1 px-2 text-center font-mono font-bold">Me</td>
                  <td className="py-1 px-2 text-right font-mono font-bold text-xs">{stats.median.toFixed(2)}</td>
                  <td className="py-1 px-2 text-slate-600">Nilai yang membagi 50% data di bawah dan 50% di atas</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 font-medium">Nilai Terbanyak (Modus)</td>
                  <td className="py-1 px-2 text-center font-mono font-bold">Mo</td>
                  <td className="py-1 px-2 text-right font-mono font-bold text-xs">
                    {stats.mode.length > 0 ? stats.mode.join(", ") : "-"}
                  </td>
                  <td className="py-1 px-2 text-slate-600">Nilai dengan frekuensi kemunculan tertinggi</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 font-medium">Nilai Terendah (Minimum)</td>
                  <td className="py-1 px-2 text-center font-mono">Xmin</td>
                  <td className="py-1 px-2 text-right font-mono font-bold text-xs">{stats.min}</td>
                  <td className="py-1 px-2 text-slate-600">Skor terendah yang diperoleh responden</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 font-medium">Nilai Tertinggi (Maksimum)</td>
                  <td className="py-1 px-2 text-center font-mono">Xmax</td>
                  <td className="py-1 px-2 text-right font-mono font-bold text-xs">{stats.max}</td>
                  <td className="py-1 px-2 text-slate-600">Skor tertinggi yang dicapai responden</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 font-medium">Jangkauan (Range)</td>
                  <td className="py-1 px-2 text-center font-mono">R</td>
                  <td className="py-1 px-2 text-right font-mono font-bold text-xs">{stats.range}</td>
                  <td className="py-1 px-2 text-slate-600">Selisih nilai maksimal terhadap minimal (Xmax - Xmin)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bagian B: Ukuran Sebaran dan Variabilitas */}
          <div className="mt-3">
            <h4 className="text-xs font-bold text-slate-900 font-sans border-b border-slate-300 pb-1 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-emerald-800 text-white inline-flex items-center justify-center text-[10px] font-mono">
                B
              </span>
              Ukuran Sebaran & Variabilitas (Dispersi)
            </h4>
            <div className="grid grid-cols-2 gap-3 mt-1.5 text-[10px] font-sans">
              <div className="border border-slate-200 rounded p-2 bg-slate-50/70">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600">Standar Deviasi Sampel (s):</span>
                  <span className="font-mono font-bold text-slate-900">{stats.stdDevSample.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 py-1">
                  <span className="text-slate-600">Varians Sampel (s²):</span>
                  <span className="font-mono font-bold text-slate-900">{stats.varianceSample.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-600">Standar Error of Mean (SE_M):</span>
                  <span className="font-mono font-bold text-slate-900">{stats.stdErrorMean.toFixed(2)}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded p-2 bg-slate-50/70">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-600">Kuartil Bawah (Q1):</span>
                  <span className="font-mono font-bold text-slate-900">{stats.q1.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 py-1">
                  <span className="text-slate-600">Kuartil Atas (Q3):</span>
                  <span className="font-mono font-bold text-slate-900">{stats.q3.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-600">Jangkauan Antarkuartil (IQR):</span>
                  <span className="font-mono font-bold text-slate-900">{stats.iqr.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[9px] text-slate-500 font-sans mt-1 px-1">
              <span>Simpangan Kuartil (Qd) = {stats.quartileDeviation.toFixed(2)}</span>
              <span>Koefisien Variasi (CV) = {stats.coefVariation.toFixed(2)}% (Tingkat Homogenitas Nilai)</span>
            </div>
          </div>
        </div>

        {renderRunningFooter(1, totalPages)}
      </div>

      {/* =========================================================
          PAGE 2: DISTRIBUSI FREKUENSI STURGES & TABEL BERKELOMPOK
      ========================================================= */}
      <div id="pdf-page-2" className="pdf-page shadow-md border border-slate-300 print:shadow-none print:border-none" style={pageStyle}>
        <div>
          {renderRunningHeader(2)}

          <div className="mt-1">
            <h4 className="text-xs font-bold text-slate-900 font-sans border-b border-slate-300 pb-1 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-emerald-800 text-white inline-flex items-center justify-center text-[10px] font-mono">
                C
              </span>
              Penyusunan Distribusi Frekuensi Berkelompok (Aturan Sturges)
            </h4>
            <p className="text-[10px] text-slate-600 font-sans mt-1 leading-relaxed">
              Berdasarkan kaidah statistik pendidikan, pengelompokan data mentah dilakukan dengan rumus empiris Sturges
              untuk menentukan jumlah kelas (k) dan panjang interval (c) secara proporsional terhadap ukuran sampel (N).
            </p>

            {/* Sturges Equation Cards */}
            <div className="grid grid-cols-3 gap-2.5 my-2.5 text-[10px] font-sans">
              <div className="bg-slate-50 border border-slate-200 rounded p-2">
                <span className="text-[9px] text-slate-500 block">1. Jangkauan / Range (R)</span>
                <span className="font-mono font-bold text-slate-900">
                  R = {stats.max} - {stats.min} = {stats.range}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-2">
                <span className="text-[9px] text-slate-500 block">2. Banyak Kelas (k) - Sturges</span>
                <span className="font-mono font-bold text-emerald-900">
                  k = 1 + 3.322 log({sturges.n}) = {sturges.k}
                </span>
                <span className="text-[8px] text-slate-400 block">({sturges.rawK.toFixed(3)})</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-2">
                <span className="text-[9px] text-slate-500 block">3. Panjang Interval (c)</span>
                <span className="font-mono font-bold text-emerald-900">
                  c = R / k = {sturges.range}/{sturges.k} = {sturges.c}
                </span>
                <span className="text-[8px] text-slate-400 block">({sturges.rawC.toFixed(3)})</span>
              </div>
            </div>

            {/* Frequency Table */}
            <table className="w-full text-[9px] mt-2 border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-sans border-b border-slate-300">
                  <th className="py-1 px-1.5 text-center border border-slate-300">No</th>
                  <th className="py-1 px-1.5 text-center border border-slate-300 font-bold">Interval Kelas</th>
                  <th className="py-1 px-1.5 text-center border border-slate-300">Tepi Kelas (Batas Nyata)</th>
                  <th className="py-1 px-1.5 text-center border border-slate-300">Titik Tengah (Xi)</th>
                  <th className="py-1 px-1.5 text-center border border-slate-300 font-bold text-emerald-950 bg-emerald-50/60">
                    Frekuensi (fi)
                  </th>
                  <th className="py-1 px-1.5 text-center border border-slate-300">Relatif (%)</th>
                  <th className="py-1 px-1.5 text-center border border-slate-300">fk ≤ (Kurang Dari)</th>
                  <th className="py-1 px-1.5 text-center border border-slate-300">fk ≥ (Lebih Dari)</th>
                  <th className="py-1 px-1.5 text-right border border-slate-300">fi · Xi</th>
                  <th className="py-1 px-1.5 text-right border border-slate-300">fi · (Xi - X̄)²</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {frequencyClasses.map((cls) => (
                  <tr key={cls.index}>
                    <td className="py-1 px-1.5 text-center font-mono border border-slate-300">{cls.index}</td>
                    <td className="py-1 px-1.5 text-center font-mono font-bold border border-slate-300">
                      {cls.lowerLimit} – {cls.upperLimit}
                    </td>
                    <td className="py-1 px-1.5 text-center font-mono text-slate-600 border border-slate-300">
                      {cls.lowerBound.toFixed(1)} – {cls.upperBound.toFixed(1)}
                    </td>
                    <td className="py-1 px-1.5 text-center font-mono border border-slate-300">{cls.midpoint.toFixed(1)}</td>
                    <td className="py-1 px-1.5 text-center font-mono font-bold text-emerald-950 bg-emerald-50/40 border border-slate-300">
                      {cls.frequency}
                    </td>
                    <td className="py-1 px-1.5 text-center font-mono border border-slate-300">{cls.relativeFreq.toFixed(2)}%</td>
                    <td className="py-1 px-1.5 text-center font-mono font-medium text-blue-900 border border-slate-300">
                      {cls.cumulativeLess}
                    </td>
                    <td className="py-1 px-1.5 text-center font-mono font-medium text-blue-900 border border-slate-300">
                      {cls.cumulativeMore}
                    </td>
                    <td className="py-1 px-1.5 text-right font-mono border border-slate-300">{cls.fx.toFixed(1)}</td>
                    <td className="py-1 px-1.5 text-right font-mono text-slate-600 border border-slate-300">
                      {cls.fxDiffSquared.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold font-sans border-t-2 border-slate-400">
                  <td colSpan={4} className="py-1 px-1.5 text-right border border-slate-300">
                    Jumlah / Total (Σ):
                  </td>
                  <td className="py-1 px-1.5 text-center font-mono font-black text-emerald-950 bg-emerald-100 border border-slate-300">
                    {totalFreq}
                  </td>
                  <td className="py-1 px-1.5 text-center font-mono border border-slate-300">{totalRelative.toFixed(1)}%</td>
                  <td colSpan={2} className="py-1 px-1.5 text-center text-slate-400 border border-slate-300">-</td>
                  <td className="py-1 px-1.5 text-right font-mono text-emerald-900 border border-slate-300">{totalFX.toFixed(1)}</td>
                  <td className="py-1 px-1.5 text-right font-mono border border-slate-300">{totalFXDiffSquared.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Bagian D: Karakteristik Kurva (Skewness & Kurtosis) */}
          <div className="mt-4">
            <h4 className="text-xs font-bold text-slate-900 font-sans border-b border-slate-300 pb-1 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-emerald-800 text-white inline-flex items-center justify-center text-[10px] font-mono">
                D
              </span>
              Karakteristik Bentuk Distribusi (Skewness & Kurtosis)
            </h4>
            <div className="grid grid-cols-2 gap-3 mt-2 text-[10px] font-sans">
              <div className="border border-slate-200 rounded p-2.5 bg-slate-50/70">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">Kemiringan Kurva (Skewness):</span>
                  <span className="font-mono font-bold text-emerald-900 text-xs">Sk = {stats.skewness.toFixed(3)}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[9.5px]">
                  {stats.skewness > 0.5
                    ? "Menceng Positif (Miring ke Kanan): Sebagian besar nilai siswa berada di bawah rata-rata kelas, dengan sedikit siswa berprestasi sangat tinggi."
                    : stats.skewness < -0.5
                    ? "Menceng Negatif (Miring ke Kiri): Sebagian besar nilai siswa berada di atas rata-rata kelas, dengan sedikit siswa yang tertinggal."
                    : "Simetris Normal (Bell-shaped): Sebaran nilai siswa seimbang dan berpusat merata di sekitar nilai mean."}
                </p>
              </div>

              <div className="border border-slate-200 rounded p-2.5 bg-slate-50/70">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">Keruncingan Kurva (Kurtosis):</span>
                  <span className="font-mono font-bold text-emerald-900 text-xs">Ku = {stats.kurtosis.toFixed(3)}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[9.5px]">
                  {stats.kurtosis > 0.5
                    ? "Leptokurtik (Runcing): Data memiliki konsentrasi frekuensi yang sangat rapat dan tinggi pada nilai tengah."
                    : stats.kurtosis < -0.5
                    ? "Platikurtik (Landai): Data memiliki keragaman yang relatif merata dan menyebar lebih lebar."
                    : "Mesokurtik (Normal): Tingkat kelancipan kurva mendekati kurva distribusi normal standar Gauss."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {renderRunningFooter(2, totalPages)}
      </div>

      {/* =========================================================
          PAGE 3: GRAFIK HISTOGRAM, POLIGON & KURVA NORMAL Z-SCORE
      ========================================================= */}
      <div id="pdf-page-3" className="pdf-page shadow-md border border-slate-300 print:shadow-none print:border-none" style={pageStyle}>
        <div>
          {renderRunningHeader(3)}

          <div>
            <h4 className="text-xs font-bold text-slate-900 font-sans border-b border-slate-300 pb-1 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-emerald-800 text-white inline-flex items-center justify-center text-[10px] font-mono">
                E
              </span>
              Visualisasi Grafik Statistik Pendidikan (Bagian I)
            </h4>
            <p className="text-[10px] text-slate-600 font-sans mt-1">
              Visualisasi grafis berikut merepresentasikan sebaran frekuensi aktual dan posisi standar deviasi responden pada variabel {variableName}.
            </p>

            {/* Chart 1: Histogram & Poligon */}
            <div className="mt-3 border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1 text-[11px] font-sans">
                <span className="font-bold text-emerald-950">
                  Grafik 1: Histogram Frekuensi dan Poligon Frekuensi Berkelompok
                </span>
                <span className="text-[9px] text-slate-500 font-mono">Aturan Sturges (k = {sturges.k}, c = {sturges.c})</span>
              </div>
              <div className="w-full bg-white rounded border border-slate-200 p-1">
                <HistogramChart
                  stats={stats}
                  frequencyClasses={frequencyClasses}
                  zScores={zScores}
                  variableName={variableName}
                  width={680}
                  height={270}
                />
              </div>
              <p className="text-[9px] text-slate-500 font-sans italic mt-1 text-center">
                Gambar 1. Distribusi frekuensi skor mahasiswa dengan garis poligon menghubungkan nilai titik tengah (Xi) setiap kelas.
              </p>
            </div>

            {/* Chart 2: Kurva Normal Baku & Titik Mahasiswa */}
            <div className="mt-3 border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-1 text-[11px] font-sans">
                <span className="font-bold text-emerald-950">
                  Grafik 2: Kurva Distribusi Normal Baku (Gauss) & Sebaran Nilai Mahasiswa
                </span>
                <span className="text-[9px] text-slate-500 font-mono">Mean = {stats.mean.toFixed(1)}, s = {stats.stdDevSample.toFixed(2)}</span>
              </div>
              <div className="w-full bg-white rounded border border-slate-200 p-1">
                <NormalCurveChart
                  stats={stats}
                  frequencyClasses={frequencyClasses}
                  zScores={zScores}
                  variableName={variableName}
                  width={680}
                  height={270}
                />
              </div>
              <p className="text-[9px] text-slate-500 font-sans italic mt-1 text-center">
                Gambar 2. Posisi skor baku Z setiap mahasiswa pada kurva lonceng normal. Wilayah hijau muda mencakup rentang ±1 SD (68.26%).
              </p>
            </div>
          </div>
        </div>

        {renderRunningFooter(3, totalPages)}
      </div>

      {/* =========================================================
          PAGE 4: GRAFIK OGIVE DUAL & BOXPLOT + ANALISIS Z-SCORE & T-SCORE
      ========================================================= */}
      <div id="pdf-page-4" className="pdf-page shadow-md border border-slate-300 print:shadow-none print:border-none" style={pageStyle}>
        <div>
          {renderRunningHeader(4)}

          <div>
            <h4 className="text-xs font-bold text-slate-900 font-sans border-b border-slate-300 pb-1 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-emerald-800 text-white inline-flex items-center justify-center text-[10px] font-mono">
                F
              </span>
              Visualisasi Grafik Statistik Pendidikan (Bagian II)
            </h4>

            {/* Dual Charts Grid: Ogive & Boxplot */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="border border-slate-200 rounded-lg p-2 bg-slate-50/50">
                <span className="font-bold text-emerald-950 text-[10px] font-sans block mb-1">
                  Grafik 3: Kurva Ogive Dual (Kumulatif)
                </span>
                <div className="w-full bg-white rounded border border-slate-200 p-1">
                  <OgiveChart
                    stats={stats}
                    frequencyClasses={frequencyClasses}
                    zScores={zScores}
                    variableName={variableName}
                    width={320}
                    height={200}
                  />
                </div>
                <p className="text-[8px] text-slate-500 font-sans italic mt-0.5 text-center">
                  Titik potong ogive menandai posisi median (Me = {stats.median.toFixed(1)}).
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-2 bg-slate-50/50">
                <span className="font-bold text-emerald-950 text-[10px] font-sans block mb-1">
                  Grafik 4: Diagram Kotak Garis (Boxplot)
                </span>
                <div className="w-full bg-white rounded border border-slate-200 p-1">
                  <BoxPlotChart
                    stats={stats}
                    frequencyClasses={frequencyClasses}
                    zScores={zScores}
                    variableName={variableName}
                    width={320}
                    height={200}
                  />
                </div>
                <p className="text-[8px] text-slate-500 font-sans italic mt-0.5 text-center">
                  Ringkasan 5 angka: Min={stats.min}, Q1={stats.q1.toFixed(1)}, Med={stats.median.toFixed(1)}, Q3={stats.q3.toFixed(1)}, Max={stats.max}.
                </p>
              </div>
            </div>

            {/* Bagian G: Standarisasi Nilai Z-Score & T-Score Evaluasi PAI */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-900 font-sans border-b border-slate-300 pb-1 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-emerald-800 text-white inline-flex items-center justify-center text-[10px] font-mono">
                  G
                </span>
                Standarisasi Skor Evaluasi Pembelajaran PAI (Z-Score & T-Score)
              </h4>
              <p className="text-[10px] text-slate-600 font-sans mt-1 leading-relaxed">
                Skor mentah (X) dikonversi menjadi Z-Score [Z = (X - X̄) / s] dan T-Score [T = 50 + 10(Z)] guna menghasilkan
                penilaian yang adil, objektif, dan bebas distorsi rentang instrumen.
              </p>

              {/* Category Breakdown Table */}
              <table className="w-full text-[9px] mt-2 border-collapse border border-slate-300 font-sans">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-semibold">
                    <th className="py-1 px-2 text-left border border-slate-300">Klasifikasi Mutu PAI</th>
                    <th className="py-1 px-2 text-center border border-slate-300">Kriteria Skor Baku (Z)</th>
                    <th className="py-1 px-2 text-center border border-slate-300">Rentang T-Score</th>
                    <th className="py-1 px-2 text-center border border-slate-300 font-bold">Jumlah Siswa</th>
                    <th className="py-1 px-2 text-center border border-slate-300">Persentase</th>
                    <th className="py-1 px-2 text-left border border-slate-300">Tindak Lanjut Evaluasi PAI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-emerald-50/40">
                    <td className="py-1 px-2 font-bold text-emerald-900 border border-slate-300">
                      Sangat Tinggi / Mumtaz
                    </td>
                    <td className="py-1 px-2 text-center font-mono border border-slate-300">Z ≥ +2.0</td>
                    <td className="py-1 px-2 text-center font-mono border border-slate-300">T ≥ 70</td>
                    <td className="py-1 px-2 text-center font-mono font-bold border border-slate-300">{catMumtaz}</td>
                    <td className="py-1 px-2 text-center font-mono border border-slate-300">
                      {((catMumtaz / stats.count) * 100).toFixed(1)}%
                    </td>
                    <td className="py-1 px-2 text-slate-700 border border-slate-300">Pengayaan riset & artikel ilmiah PAI</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 font-bold text-blue-900 border border-slate-300">
                      Tinggi / Jayyid Jiddan
                    </td>
                    <td className="py-1 px-2 text-center font-mono border border-slate-300">+1.0 ≤ Z &lt; +2.0</td>
                    <td className="py-1 px-2 text-center font-mono border border-slate-300">60 ≤ T &lt; 70</td>
                    <td className="py-1 px-2 text-center font-mono font-bold border border-slate-300">{catTinggi}</td>
                    <td className="py-1 px-2 text-center font-mono border border-slate-300">
                      {((catTinggi / stats.count) * 100).toFixed(1)}%
                    </td>
                    <td className="py-1 px-2 text-slate-700 border border-slate-300">Studi analitis kasus PAI lanjutan</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 font-bold text-slate-800 border border-slate-300">
                      Sedang / Jayyid - Maqbul
                    </td>
                    <td className="py-1 px-2 text-center font-mono border border-slate-300">-1.0 ≤ Z &lt; +1.0</td>
                    <td className="py-1 px-2 text-center font-mono border border-slate-300">40 ≤ T &lt; 60</td>
                    <td className="py-1 px-2 text-center font-mono font-bold border border-slate-300">{catSedang}</td>
                    <td className="py-1 px-2 text-center font-mono border border-slate-300">
                      {((catSedang / stats.count) * 100).toFixed(1)}%
                    </td>
                    <td className="py-1 px-2 text-slate-700 border border-slate-300">Pemantapan materi reguler PAI</td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="py-1 px-2 font-bold text-amber-900 border border-slate-300">
                      Rendah / Dha'if
                    </td>
                    <td className="py-1 px-2 text-center font-mono border border-slate-300">-2.0 ≤ Z &lt; -1.0</td>
                    <td className="py-1 px-2 text-center font-mono border border-slate-300">30 ≤ T &lt; 40</td>
                    <td className="py-1 px-2 text-center font-mono font-bold border border-slate-300">{catRendah}</td>
                    <td className="py-1 px-2 text-center font-mono border border-slate-300">
                      {((catRendah / stats.count) * 100).toFixed(1)}%
                    </td>
                    <td className="py-1 px-2 text-slate-700 border border-slate-300">Bimbingan remedial terbimbing</td>
                  </tr>
                  <tr className="bg-rose-50/40">
                    <td className="py-1 px-2 font-bold text-rose-900 border border-slate-300">
                      Sangat Rendah / Dha'if Jiddan
                    </td>
                    <td className="py-1 px-2 text-center font-mono border border-slate-300">Z &lt; -2.0</td>
                    <td className="py-1 px-2 text-center font-mono border border-slate-300">T &lt; 30</td>
                    <td className="py-1 px-2 text-center font-mono font-bold border border-slate-300">{catSangatRendah}</td>
                    <td className="py-1 px-2 text-center font-mono border border-slate-300">
                      {((catSangatRendah / stats.count) * 100).toFixed(1)}%
                    </td>
                    <td className="py-1 px-2 text-slate-700 border border-slate-300">Remedial intensif & diagnosa kesulitan</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {renderRunningFooter(4, totalPages)}
      </div>

      {/* =========================================================
          PAGE 5: NARASI ILMIAH PEMBAHASAN BAB IV & LEMBAR PENGESAHAN
      ========================================================= */}
      <div id="pdf-page-5" className="pdf-page shadow-md border border-slate-300 print:shadow-none print:border-none" style={pageStyle}>
        <div>
          {renderRunningHeader(5)}

          <div>
            <h4 className="text-xs font-bold text-slate-900 font-sans border-b border-slate-300 pb-1 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-emerald-800 text-white inline-flex items-center justify-center text-[10px] font-mono">
                H
              </span>
              Pembahasan Hasil Penelitian & Implikasi Pedagogis (Format Bab IV Tesis S2 PAI)
            </h4>

            {/* Academic Narration Text */}
            <div className="mt-2 space-y-2 text-[10px] leading-relaxed text-justify text-slate-800 font-serif">
              <p>
                Berdasarkan hasil pengolahan statistik deskriptif terhadap <strong>{stats.count} responden</strong> mahasiswa
                pada instrumen <strong>{variableName} ({dataTitle})</strong>, diperoleh nilai rata-rata hitung (Mean, X̄) sebesar{" "}
                <strong>{stats.mean.toFixed(2)}</strong> dengan median sebesar <strong>{stats.median.toFixed(2)}</strong> dan
                rentang skor dari <strong>{stats.min}</strong> hingga <strong>{stats.max}</strong>.
              </p>
              <p>
                Tingkat variabilitas data ditunjukkan oleh nilai standar deviasi sampel sebesar <strong>{stats.stdDevSample.toFixed(2)}</strong>{" "}
                dengan koefisien variasi sebesar <strong>{stats.coefVariation.toFixed(2)}%</strong>. Hal ini mengindikasikan bahwa
                sebaran kompetensi mahasiswa berada dalam rentang variasi yang wajar tanpa kecenderungan polarisasi ekstrem.
                Penyusunan tabel distribusi frekuensi berdasarkan Aturan Sturges menghasilkan <strong>{sturges.k} kelas interval</strong>{" "}
                dengan panjang kelas <strong>c = {sturges.c}</strong>.
              </p>
              <p>
                Melalui standarisasi Z-Score dan T-Score, pemetaan kemampuan peserta didik terdistribusi ke dalam kategori Mumtaz (
                {((catMumtaz / stats.count) * 100).toFixed(1)}%), Jayyid Jiddan ({((catTinggi / stats.count) * 100).toFixed(1)}%),
                Jayyid/Maqbul ({((catSedang / stats.count) * 100).toFixed(1)}%), Dha'if ({((catRendah / stats.count) * 100).toFixed(1)}%),
                dan Dha'if Jiddan ({((catSangatRendah / stats.count) * 100).toFixed(1)}%).
              </p>
            </div>

            {/* AI Academic Expert Analysis Note (If generated) */}
            {includeAiAnalysis && aiInterpretation && (
              <div className="mt-3 p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-[9px] font-sans">
                <span className="font-bold text-emerald-950 block mb-0.5">
                  Catatan Analisis Ilmiah Tambahan (AI Guru Besar Statistik PAI):
                </span>
                <p className="text-slate-700 leading-snug line-clamp-4">
                  {aiInterpretation}
                </p>
              </div>
            )}

            {/* Bagian I: Lembar Pengesahan Akademik */}
            <div className="mt-5 pt-2.5 border-t border-slate-300 font-sans">
              <div className="text-right text-[10px] text-slate-600 mb-4">
                <span>Ditetapkan di: {instName.split(" ").pop() || "Kampus"}, {currentDate}</span>
              </div>

              {groupInfo?.isGroupAssignment ? (
                <div className="grid grid-cols-12 gap-4 text-[10px]">
                  {/* Dosen Pengampu Signature (5 cols) */}
                  <div className="col-span-5 text-center flex flex-col justify-between">
                    <div>
                      <span className="text-slate-500 block">Mengesahkan & Menyetujui,</span>
                      <span className="font-bold text-slate-800 block">Dosen Pengampu Mata Kuliah</span>
                      <span className="text-[9px] text-slate-600 italic block">{groupInfo.courseName}</span>
                    </div>
                    <div className="my-2">
                      <div className="h-12 border-b border-slate-400 mx-6 mb-1" />
                      <span className="font-bold text-slate-900 block text-[10px]">{lecturerName}</span>
                      <span className="text-[9px] text-slate-600 block font-mono">
                        NIP. {lecturerNip || "................................................."}
                      </span>
                    </div>
                  </div>

                  {/* Team Members Signature (7 cols) */}
                  <div className="col-span-7 text-center">
                    <div className="mb-1">
                      <span className="text-slate-500 block">Tim Mahasiswa Penyusun Tugas:</span>
                      <span className="font-bold text-emerald-950 block">
                        {groupName} • {prodiName}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-2">
                      {members.map((m, idx) => (
                        <div key={m.id || idx} className="text-center">
                          <div className="h-7 border-b border-slate-400 mx-2 mb-1" />
                          <span className="font-bold text-slate-900 block truncate text-[9.5px]">
                            {m.name}
                          </span>
                          <span className="text-slate-500 block font-mono text-[8.5px]">
                            NIM. {m.nim}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-8 text-[10px] text-center">
                  <div>
                    <span className="text-slate-500 block">Mengetahui,</span>
                    <span className="font-bold text-slate-800 block">Dosen Pengampu / Pembimbing</span>
                    <div className="h-12 border-b border-slate-400 mx-10 mt-2 mb-1" />
                    <span className="font-bold text-slate-900 block">{lecturerName}</span>
                    <span className="text-[9px] text-slate-500 block font-mono">NIP. {lecturerNip}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Mahasiswa Peneliti / Pengolah Data,</span>
                    <span className="font-bold text-slate-800 block">{prodiName}</span>
                    <div className="h-12 border-b border-slate-400 mx-10 mt-2 mb-1" />
                    <span className="font-bold text-slate-900 block">
                      {members[0] ? members[0].name : "(............................................................)"}
                    </span>
                    <span className="text-[9px] text-slate-500 block font-mono">
                      NIM. {members[0] ? members[0].nim : "................................................."}
                    </span>
                  </div>
                </div>
              )}

              <div className="text-center text-[8.5px] text-slate-400 mt-4 pt-1.5 border-t border-slate-200">
                Dokumen resmi hasil analisis komputasi statistik {instName} • {groupName} • Pengembang Aplikasi: Husni, S.Kom.I
              </div>
            </div>
          </div>
        </div>

        {renderRunningFooter(5, totalPages)}
      </div>

      {/* =========================================================
          PAGE 6: LAMPIRAN I: DATA RESMI MAHASISWA SEMESTER 1
          (Tahun Akademik 2025 Genap - Program Studi Magister PAI)
      ========================================================= */}
      <div id="pdf-page-6" className="pdf-page shadow-md border border-slate-300 print:shadow-none print:border-none" style={pageStyle}>
        <div>
          {renderRunningHeader(6)}

          {/* Official Document Kop / Title Header matching user's uploaded PDF */}
          <div className="text-center border-b-2 border-slate-900 pb-2 mb-2.5">
            <h2 className="text-xs font-black text-slate-950 font-sans tracking-wide uppercase leading-tight">
              DATA MAHASISWA SEMESTER 1
            </h2>
            <h3 className="text-[11px] font-bold text-slate-800 font-sans tracking-wide uppercase leading-tight">
              TAHUN AKADEMIK 2025 GENAP
            </h3>
            <h4 className="text-[11px] font-bold text-emerald-950 font-sans tracking-wide uppercase leading-tight">
              INSTITUT AGAMA ISLAM AL-JIHAD SHALAHUDDIN AL-AYYUBI JAKARTA
            </h4>
            <p className="text-[9.5px] font-semibold text-slate-700 font-sans tracking-wide uppercase leading-tight">
              PROGRAM STUDI MAGISTER PENDIDIKAN AGAMA ISLAM
            </p>
          </div>

          <div className="flex items-center justify-between text-[9px] text-slate-600 font-sans mb-2 px-1">
            <span>Mata Kuliah: <strong className="text-slate-900">Statistik Pendidikan & Evaluasi Pembelajaran PAI</strong></span>
            <span>Status: <strong className="text-emerald-900">Daftar Aktif Rombel Pascasarjana (N = 29 Mahasiswa)</strong></span>
          </div>

          {/* 2-Column Balanced Table: 1-15 on Left, 16-29 on Right */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            {/* Left Column Table: No 1 - 15 */}
            <div className="border border-slate-900 rounded overflow-hidden">
              <table className="w-full text-left font-sans border-collapse text-[8px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900 text-center">
                    <th className="py-1 px-1 border-r border-slate-900 w-5">No</th>
                    <th className="py-1 px-1 border-r border-slate-900 w-18">NIM</th>
                    <th className="py-1 px-1.5 border-r border-slate-900 text-left">NAMA MAHASISWA</th>
                    <th className="py-1 px-1 border-r border-slate-900 w-9">Kel.</th>
                    <th className="py-1 px-1 border-r border-slate-900 w-7">Skor</th>
                    <th className="py-1 px-1 w-9">Z-Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {rosterStudents.slice(0, 15).map((std) => {
                    const groupRoman = std.no <= 5 ? "I" : std.no <= 10 ? "II" : std.no <= 15 ? "III" : std.no <= 20 ? "IV" : std.no <= 25 ? "V" : "VI";
                    const isMyGroup = groupInfo?.members?.some((m) => m.nim === std.nim || m.name.toLowerCase().trim() === std.name.toLowerCase().trim());

                    return (
                      <tr key={std.no} className={isMyGroup ? "bg-emerald-100/90 text-emerald-950 font-semibold" : "hover:bg-slate-50"}>
                        <td className="py-0.5 px-1 text-center font-medium border-r border-slate-300">{std.no}</td>
                        <td className="py-0.5 px-1 font-mono text-[7.5px] text-slate-700 border-r border-slate-300 text-center">{std.nim}</td>
                        <td className="py-0.5 px-1.5 font-semibold text-slate-900 border-r border-slate-300 truncate max-w-[115px]">
                          {std.name}
                        </td>
                        <td className="py-0.5 px-1 text-center border-r border-slate-300">
                          {isMyGroup ? (
                            <span className="px-1 py-0.2 bg-emerald-800 text-white rounded font-bold text-[7px]">
                              Kel. {groupRoman}
                            </span>
                          ) : (
                            <span className="text-slate-600 text-[7px] font-medium">
                              Kel. {groupRoman}
                            </span>
                          )}
                        </td>
                        <td className="py-0.5 px-1 text-center font-bold text-emerald-900 border-r border-slate-300">{std.score ?? "-"}</td>
                        <td className="py-0.5 px-1 text-center font-mono text-[7px] text-slate-600">{std.zScore !== undefined ? (std.zScore > 0 ? `+${std.zScore.toFixed(2)}` : std.zScore.toFixed(2)) : "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Right Column Table: No 16 - 29 */}
            <div className="border border-slate-900 rounded overflow-hidden">
              <table className="w-full text-left font-sans border-collapse text-[8px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900 text-center">
                    <th className="py-1 px-1 border-r border-slate-900 w-5">No</th>
                    <th className="py-1 px-1 border-r border-slate-900 w-18">NIM</th>
                    <th className="py-1 px-1.5 border-r border-slate-900 text-left">NAMA MAHASISWA</th>
                    <th className="py-1 px-1 border-r border-slate-900 w-9">Kel.</th>
                    <th className="py-1 px-1 border-r border-slate-900 w-7">Skor</th>
                    <th className="py-1 px-1 w-9">Z-Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {rosterStudents.slice(15, 29).map((std) => {
                    const groupRoman = std.no <= 5 ? "I" : std.no <= 10 ? "II" : std.no <= 15 ? "III" : std.no <= 20 ? "IV" : std.no <= 25 ? "V" : "VI";
                    const isMyGroup = groupInfo?.members?.some((m) => m.nim === std.nim || m.name.toLowerCase().trim() === std.name.toLowerCase().trim());

                    return (
                      <tr key={std.no} className={isMyGroup ? "bg-emerald-100/90 text-emerald-950 font-semibold" : "hover:bg-slate-50"}>
                        <td className="py-0.5 px-1 text-center font-medium border-r border-slate-300">{std.no}</td>
                        <td className="py-0.5 px-1 font-mono text-[7.5px] text-slate-700 border-r border-slate-300 text-center">{std.nim}</td>
                        <td className="py-0.5 px-1.5 font-semibold text-slate-900 border-r border-slate-300 truncate max-w-[115px]">
                          {std.name}
                        </td>
                        <td className="py-0.5 px-1 text-center border-r border-slate-300">
                          {isMyGroup ? (
                            <span className="px-1 py-0.2 bg-emerald-800 text-white rounded font-bold text-[7px]">
                              Kel. {groupRoman}
                            </span>
                          ) : (
                            <span className="text-slate-600 text-[7px] font-medium">
                              Kel. {groupRoman}
                            </span>
                          )}
                        </td>
                        <td className="py-0.5 px-1 text-center font-bold text-emerald-900 border-r border-slate-300">{std.score ?? "-"}</td>
                        <td className="py-0.5 px-1 text-center font-mono text-[7px] text-slate-600">{std.zScore !== undefined ? (std.zScore > 0 ? `+${std.zScore.toFixed(2)}` : std.zScore.toFixed(2)) : "-"}</td>
                      </tr>
                    );
                  })}
                  {/* Summary row on right table to match 15 rows */}
                  <tr className="bg-emerald-50 font-bold text-emerald-950">
                    <td colSpan={4} className="py-0.5 px-2 border-r border-slate-300 text-right text-[7.5px]">
                      Rekapitulasi: N = 29 Mahasiswa (6 Kelompok)
                    </td>
                    <td className="py-0.5 px-1 text-center border-r border-slate-300 text-[7.5px] text-emerald-900">
                      {stats.mean.toFixed(1)}
                    </td>
                    <td className="py-0.5 px-1 text-center text-[7px] text-emerald-800">
                      {stats.stdDevSample.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Statistical Distribution & Summary Box */}
          <div className="border border-slate-300 bg-slate-50 rounded-lg p-2 font-sans mb-2 text-[8.5px]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-1">
              <span className="font-bold text-slate-900">REKAPITULASI SEBARAN AKADEMIK MAHASISWA S2 PAI:</span>
              <span className="text-emerald-800 font-semibold">{academicYear}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center text-[8px]">
              <div className="bg-white p-1 rounded border border-slate-200">
                <span className="text-slate-500 block">Total Peserta:</span>
                <strong className="text-slate-900 text-[10px]">29 Mahasiswa (6 Kelompok)</strong>
              </div>
              <div className="bg-white p-1 rounded border border-slate-200">
                <span className="text-slate-500 block">Rentang Nilai:</span>
                <strong className="text-slate-900 text-[10px]">{stats.min} s/d {stats.max}</strong>
              </div>
              <div className="bg-white p-1 rounded border border-slate-200">
                <span className="text-slate-500 block">Kategori Sangat Tinggi:</span>
                <strong className="text-emerald-800 text-[10px]">{catMumtaz + catTinggi} Mahasiswa</strong>
              </div>
              <div className="bg-white p-1 rounded border border-slate-200">
                <span className="text-slate-500 block">Kategori Sedang / Cukup:</span>
                <strong className="text-amber-800 text-[10px]">{catSedang} Mahasiswa</strong>
              </div>
            </div>
            {/* 6 Groups Distribution Summary Bar */}
            <div className="mt-1 pt-1 border-t border-slate-200 flex flex-wrap items-center justify-between gap-1 text-[7.5px] text-slate-700">
              <span>
                <strong>Distribusi 6 Kelompok:</strong> Kel. I (5 Mhs) • Kel. II (5 Mhs) • Kel. III (5 Mhs) • Kel. IV (5 Mhs) • Kel. V (5 Mhs) • Kel. VI (4 Mhs)
              </span>
              <span className="text-emerald-900 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                Aktif di Laporan: {groupInfo?.groupName || "Kelompok I"}
              </span>
            </div>
          </div>

          {/* Verification / Signature Section */}
          <div className="border border-emerald-300 bg-emerald-50/50 rounded-lg p-2 font-sans text-[8.5px]">
            <p className="text-slate-600 text-center italic text-[8px] mb-1.5">
              Daftar mahasiswa di atas merupakan data resmi mahasiswa aktif Program Studi Magister Pendidikan Agama Islam Semester 1 Tahun Akademik 2025 Genap Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta.
            </p>
            <div className="grid grid-cols-2 gap-4 text-center pt-1 border-t border-emerald-200">
              <div>
                <span className="text-slate-500 block text-[8px]">Mengetahui / Memvalidasi,<br />Dosen Pengampu Mata Kuliah:</span>
                <div className="h-6 border-b border-slate-400 mx-10 my-1" />
                <span className="font-bold text-slate-900 block text-[8.5px]">{lecturerName}</span>
                <span className="text-[7.5px] text-slate-500 block font-mono">NIP. {lecturerNip}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[8px]">Jakarta, {currentDate}<br />Koordinator Mahasiswa / Ketua Kelas:</span>
                <div className="h-6 border-b border-slate-400 mx-10 my-1" />
                <span className="font-bold text-slate-900 block text-[8.5px]">
                  {rosterStudents[0]?.name || "Nurul Aulia"}
                </span>
                <span className="text-[7.5px] text-slate-500 block font-mono">
                  NIM. {rosterStudents[0]?.nim || "25286130001"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {renderRunningFooter(6, totalPages)}
      </div>

      {/* =========================================================
          PAGE 7: LAMPIRAN II: DOKUMENTASI GAMBAR & INSTRUMEN PENELITIAN PAI
      ========================================================= */}
      <div id="pdf-page-7" className="pdf-page shadow-md border border-slate-300 print:shadow-none print:border-none" style={pageStyle}>
        <div>
          {renderRunningHeader(7)}

          {/* Section Header */}
          <div className="flex items-center justify-between border-b-2 border-emerald-900 pb-1.5 mb-2">
            <div>
              <span className="text-[9px] font-bold text-emerald-800 tracking-wider uppercase font-sans">
                LAMPIRAN II LAPORAN PENELITIAN STATISTIK PENDIDIKAN S2 PAI
              </span>
              <h3 className="text-xs font-black text-slate-900 font-sans tracking-wide">
                DOKUMENTASI GAMBAR, DAFTAR DOSEN PENGAMPU & EMBLEM LEMBAGA
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[8.5px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-sans border border-emerald-200">
                Dokumen & Bukti Fisik Otentik
              </span>
            </div>
          </div>

          {/* Authentic Document Box: DAFTAR NAMA DOSEN/KODE DOSEN (KD) */}
          <div className="border border-slate-900 bg-white rounded p-2 mb-2 shadow-2xs font-serif">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5">
              <span className="font-bold text-[10px] text-slate-950 uppercase tracking-wide">
                DAFTAR NAMA DOSEN/KODE DOSEN (KD):
              </span>
              <span className="text-[7.5px] font-sans font-semibold text-emerald-900 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                IAI Al-Jihad Shalahuddin Al-Ayyubi Jakarta
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[8.5px] text-slate-900 leading-tight">
              {/* Column 1: Left */}
              <div className="space-y-1.5 border-r border-slate-200 pr-1.5">
                <div>
                  <span className="font-bold">1. </span>
                  <span className="font-bold">Dr. H. Eno Syafrudien, M.Si</span>
                  <span className="block text-[7px] font-sans text-emerald-700 font-semibold">Kode Dosen: KD-01</span>
                </div>
                <div>
                  <span className="font-bold">2. </span>
                  <span className="font-bold">Dr. Hj. Siti Ma&apos;rifah, MM., MH</span>
                  <span className="block text-[7px] font-sans text-emerald-700 font-semibold">Kode Dosen: KD-02</span>
                </div>
                <div>
                  <span className="font-bold">3. </span>
                  <span className="font-bold">Dr. H. Asep Habib Idrus Alawi, MA,M.Si,MM</span>
                  <span className="block text-[7px] font-sans text-emerald-700 font-semibold">Kode Dosen: KD-03</span>
                </div>
              </div>

              {/* Column 2: Middle */}
              <div className="space-y-1.5 border-r border-slate-200 pr-1.5">
                <div>
                  <span className="font-bold">4 . </span>
                  <span className="font-bold">Dr. Aang Darsono, S.Ag., M.Pd.I</span>
                  <span className="block text-[7px] font-sans text-emerald-700 font-semibold">Kode Dosen: KD-04</span>
                </div>
                <div>
                  <span className="font-bold">5 . </span>
                  <span className="font-bold">Dr. Muhammadiah, MA</span>
                  <span className="block text-[7px] font-sans text-emerald-700 font-semibold">Kode Dosen: KD-05</span>
                </div>
                <div>
                  <span className="font-bold">6 . </span>
                  <span className="font-bold">Dr. Saripudin Hamzah, M.Pd</span>
                  <span className="block text-[7px] font-sans text-emerald-700 font-semibold">Kode Dosen: KD-06</span>
                </div>
              </div>

              {/* Column 3: Right */}
              <div className="space-y-1.5">
                <div>
                  <span className="font-bold">7 . </span>
                  <span className="font-bold">Dr. Isti Nurhayati, M.Pd</span>
                  <span className="block text-[7px] font-sans text-emerald-700 font-semibold">Kode Dosen: KD-07</span>
                </div>
                <div className="text-slate-400">
                  <span className="font-bold">8 . </span>
                  <span className="italic font-sans text-[7.5px]">-</span>
                </div>
                <div className="text-slate-400">
                  <span className="font-bold">9 . </span>
                  <span className="italic font-sans text-[7.5px]">-</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[8.5px] text-slate-600 font-sans leading-relaxed mb-1.5">
            Dokumentasi visual autentik berikut memuat logo resmi institusi {instName} dan instrumen evaluasi pembelajaran Pendidikan Agama Islam (PAI) sebagai lampiran keabsahan tugas pascasarjana:
          </p>

          {/* Grid of Attachment Photos */}
          <div className="grid grid-cols-2 gap-2.5 my-1.5">
            {displayAttachments.slice(0, 2).map((att, idx) => (
              <div
                key={att.id || idx}
                className="border border-slate-300 rounded p-2 bg-slate-50/80 flex flex-col justify-between"
              >
                <div className="w-full h-36 bg-white border border-slate-200 rounded flex items-center justify-center p-1.5 mb-1.5 overflow-hidden">
                  <img
                    src={att.url}
                    alt={att.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="font-sans">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-bold text-[9px] text-slate-900 truncate">
                      Gambar {idx + 1}: {att.title}
                    </span>
                    <span className="text-[7.5px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded shrink-0">
                      {att.category}
                    </span>
                  </div>
                  {att.notes && (
                    <p className="text-[8px] text-slate-600 italic line-clamp-2 leading-tight mb-0.5">
                      {att.notes}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-[7.5px] text-slate-400 border-t border-slate-200 pt-0.5">
                    <span>{att.date || currentDate}</span>
                    <span>{instName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Verification Box */}
          <div className="border border-emerald-300 bg-emerald-50/60 rounded p-2 font-sans mt-1.5 text-[8.5px]">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-0.5 mb-1">
              <span className="font-bold text-emerald-950">PERNYATAAN KEOTENTIKAN DOKUMENTASI LAMPIRAN:</span>
              <span className="text-emerald-800 font-semibold">{academicYear}</span>
            </div>
            <p className="text-slate-700 leading-tight mb-1.5 text-[8px]">
              Seluruh lampiran daftar dosen pengampu, emblem resmi lembaga, dan dokumentasi instrumen di atas telah diverifikasi keabsahannya sebagai bagian integral dari laporan penelitian statistik pendidikan PAI pada Program Pascasarjana {instName}.
            </p>

            <div className="grid grid-cols-2 gap-3 text-[8.5px] text-center pt-1 border-t border-emerald-200">
              <div>
                <span className="text-slate-500 block text-[7.5px]">Dosen Pengampu / Pembimbing:</span>
                <div className="h-6 border-b border-slate-400 mx-8 my-0.5" />
                <span className="font-bold text-slate-900 block text-[8px]">{lecturerName}</span>
                <span className="text-[7px] text-slate-500 block font-mono">NIP / KD. {lecturerNip}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[7.5px]">Koordinator Tim Mahasiswa:</span>
                <div className="h-6 border-b border-slate-400 mx-8 my-0.5" />
                <span className="font-bold text-slate-900 block text-[8px]">
                  {members[0] ? members[0].name : "Nurul Aulia"}
                </span>
                <span className="text-[7px] text-slate-500 block font-mono">
                  NIM. {members[0] ? members[0].nim : "25286130001"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {renderRunningFooter(7, totalPages)}
      </div>
    </div>
  );
};
