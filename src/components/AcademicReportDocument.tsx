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
import {
  IAI_ASA_SEVEN_GROUPS_DEFINITIONS,
  DAFTAR_KELOMPOK_MAKALAH_DOCUMENT_DATA_URI,
  getSevenGroupByNumber,
  getSevenGroupByStudentName,
  SevenGroupMakalahDefinition,
} from "../data/makalahSevenGroups";

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
  const totalPages = 8;

  // Dynamically resolve active 7-Group definition & scholarly paper narratives
  const activeSevenGroup = React.useMemo<SevenGroupMakalahDefinition>(() => {
    // 1. Try matching group number from groupInfo.groupName (e.g., "Kelompok 1", "Kelompok I", "Kelompok 7")
    const matchNumber = groupInfo?.groupName?.match(/(?:Kelompok\s+|Kel\.\s*)([1-7]|I|II|III|IV|V|VI|VII)\b/i);
    if (matchNumber) {
      const raw = matchNumber[1].toUpperCase();
      const romanMap: Record<string, number> = {
        "1": 1, "I": 1,
        "2": 2, "II": 2,
        "3": 3, "III": 3,
        "4": 4, "IV": 4,
        "5": 5, "V": 5,
        "6": 6, "VI": 6,
        "7": 7, "VII": 7,
      };
      const num = romanMap[raw];
      if (num && num >= 1 && num <= 7) {
        const found = getSevenGroupByNumber(num);
        if (found) return found;
      }
    }

    // 2. Try matching by student name in active members
    if (groupInfo?.members && groupInfo.members.length > 0) {
      for (const m of groupInfo.members) {
        const found = getSevenGroupByStudentName(m.name);
        if (found) return found;
      }
    }

    // Default to Kelompok 1
    return IAI_ASA_SEVEN_GROUPS_DEFINITIONS[0];
  }, [groupInfo]);

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
                    const matched7 = getSevenGroupByStudentName(std.name);
                    const groupRoman = matched7 ? matched7.roman : (std.no <= 4 ? "I" : std.no <= 8 ? "II" : std.no <= 12 ? "III" : std.no <= 16 ? "IV" : std.no <= 20 ? "V" : std.no <= 24 ? "VI" : "VII");
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
                    const matched7 = getSevenGroupByStudentName(std.name);
                    const groupRoman = matched7 ? matched7.roman : (std.no <= 4 ? "I" : std.no <= 8 ? "II" : std.no <= 12 ? "III" : std.no <= 16 ? "IV" : std.no <= 20 ? "V" : std.no <= 24 ? "VI" : "VII");
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
                      Rekapitulasi: N = 29 Mahasiswa (7 Kelompok Silabus)
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
                <strong className="text-slate-900 text-[10px]">29 Mahasiswa (7 Kelompok)</strong>
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
            {/* 7 Groups Distribution Summary Bar */}
            <div className="mt-1 pt-1 border-t border-slate-200 flex flex-wrap items-center justify-between gap-1 text-[7.5px] text-slate-700">
              <span>
                <strong>Distribusi 7 Kelompok Silabus:</strong> Kel. I (4 Mhs) • Kel. II (4 Mhs) • Kel. III (4 Mhs) • Kel. IV (4 Mhs) • Kel. V (4 Mhs) • Kel. VI (4 Mhs) • Kel. VII (5 Mhs)
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
          PAGE 7: LAMPIRAN II: JADWAL & PEMBAGIAN 7 KELOMPOK MAKALAH IAI ASA 2026
      ========================================================= */}
      <div id="pdf-page-7" className="pdf-page shadow-md border border-slate-300 print:shadow-none print:border-none" style={pageStyle}>
        <div>
          {renderRunningHeader(7)}

          {/* Section Header */}
          <div className="flex items-center justify-between border-b-2 border-emerald-900 pb-1.5 mb-2">
            <div>
              <span className="text-[9px] font-bold text-emerald-800 tracking-wider uppercase font-sans">
                LAMPIRAN II: DOKUMEN SILABUS & JADWAL MAKALAH STATISTIKA PENDIDIKAN
              </span>
              <h3 className="text-xs font-black text-slate-900 font-sans tracking-wide">
                JADWAL & PEMBAGIAN 7 KELOMPOK MAKALAH PASCASARJANA IAI ASA TAHUN 2026
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 font-sans border border-emerald-300">
                Dosen: Dr. Isti Nurhayati, M.Pd (KD-07)
              </span>
            </div>
          </div>

          {/* Authentic Syllabus & Schedule Table (Exact Replica of Uploaded Image) */}
          <div className="border border-slate-800 rounded bg-white overflow-hidden mb-2 shadow-2xs font-sans">
            <div className="bg-emerald-950 text-white px-2 py-1 flex items-center justify-between text-[8px] font-bold">
              <span>MATRIKS JADWAL PRESENTASI PERKULIAHAN KE-2 S/D KE-15 & 7 KELOMPOK</span>
              <span className="text-amber-300">Kelompok Aktif: {activeSevenGroup.groupName}</span>
            </div>
            <table className="w-full text-left border-collapse text-[7.5px]">
              <thead>
                <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-400">
                  <th className="py-0.5 px-1.5 border-r border-slate-300 text-center w-20">Perkuliahan Ke</th>
                  <th className="py-0.5 px-1.5 border-r border-slate-300 text-center w-28">Waktu / Batas Waktu</th>
                  <th className="py-0.5 px-1.5 border-r border-slate-300 text-center w-20">Kelompok</th>
                  <th className="py-0.5 px-2">Judul Makalah / Agenda Perkuliahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  { ke: "Ke-2", time: "08-04-2026 s/d 14-04-2026", group: 1, title: "Ukuran Pemusatan (Mean, Median, Modus)" },
                  { ke: "Ke-3", time: "15-04-2026 s/d 21-04-2026", group: 2, title: "Ukuran Penyebaran (Rentang, Deviasi, Varians)" },
                  { ke: "Ke-4", time: "22-04-2026 s/d 28-04-2026", group: 3, title: "Distribusi Normal dan Z-Score" },
                  { ke: "Ke-5", time: "29-04-2026 s/d 05-05-2026", group: 4, title: "Uji Normalitas Data" },
                  { ke: "Ke-6", time: "06-05-2026 s/d 12-05-2026", group: 5, title: "Uji Homogenitas Varians" },
                  { ke: "Ke-7", time: "13-05-2026 s/d 19-05-2026", group: 6, title: "Uji t Satu Sampel (One Sample t-test)" },
                  { ke: "Ke-8", time: "20-05-2026 s/d 26-05-2026", group: 7, title: "Uji t Dua Sampel Independen" },
                ].map((row) => {
                  const isCurrent = row.group === activeSevenGroup.groupNumber;
                  return (
                    <tr key={row.ke} className={isCurrent ? "bg-emerald-100/80 font-semibold text-emerald-950" : "hover:bg-slate-50"}>
                      <td className="py-0.5 px-1.5 border-r border-slate-300 text-center font-bold">{row.ke}</td>
                      <td className="py-0.5 px-1.5 border-r border-slate-300 text-center font-mono text-[7px]">{row.time}</td>
                      <td className="py-0.5 px-1.5 border-r border-slate-300 text-center">
                        <span className={`px-1 py-0.2 rounded text-[7px] ${isCurrent ? "bg-emerald-800 text-white font-bold" : "bg-slate-100 text-slate-700"}`}>
                          Kelompok {row.group}
                        </span>
                      </td>
                      <td className="py-0.5 px-2">
                        {row.title} {isCurrent && <span className="text-[7px] text-emerald-800 font-bold ml-1">★ [KELOMPOK AKTIF LAPORAN]</span>}
                      </td>
                    </tr>
                  );
                })}

                {/* UTS Banner Row */}
                <tr className="bg-amber-300 font-black text-amber-950 text-center border-y border-amber-400">
                  <td colSpan={4} className="py-0.5 px-2 tracking-widest text-[8px]">
                    UJIAN TENGAH SEMESTER (UTS) — EVALUASI KOMPETENSI DASAR STATISTIK PAI
                  </td>
                </tr>

                {[
                  { ke: "Ke-9", time: "03-06-2026 s/d 09-06-2026", group: 1, title: "Uji t Dua Sampel Berpasangan (Paired t-test)" },
                  { ke: "Ke-10", time: "10-06-2026 s/d 16-06-2026", group: 2, title: "Analisis Varians (ANOVA Satu Jalur)" },
                  { ke: "Ke-11", time: "17-06-2026 s/d 23-06-2026", group: 3, title: "Uji Korelasi Pearson Product Moment" },
                  { ke: "Ke-12", time: "24-06-2026 s/d 30-06-2026", group: 4, title: "Uji Korelasi Rank Spearman" },
                  { ke: "Ke-13", time: "01-07-2026 s/d 07-07-2026", group: 5, title: "Regresi Linier Sederhana" },
                  { ke: "Ke-14", time: "08-07-2026 s/d 14-07-2026", group: 6, title: "Uji Chi-Square (Kaidah Independensi & Kecocokan)" },
                  { ke: "Ke-15", time: "15-07-2026 s/d 21-07-2026", group: 7, title: "Uji Validitas dan Reliabilitas Instrumen PAI" },
                ].map((row) => {
                  const isCurrent = row.group === activeSevenGroup.groupNumber;
                  return (
                    <tr key={row.ke} className={isCurrent ? "bg-emerald-100/80 font-semibold text-emerald-950" : "hover:bg-slate-50"}>
                      <td className="py-0.5 px-1.5 border-r border-slate-300 text-center font-bold">{row.ke}</td>
                      <td className="py-0.5 px-1.5 border-r border-slate-300 text-center font-mono text-[7px]">{row.time}</td>
                      <td className="py-0.5 px-1.5 border-r border-slate-300 text-center">
                        <span className={`px-1 py-0.2 rounded text-[7px] ${isCurrent ? "bg-emerald-800 text-white font-bold" : "bg-slate-100 text-slate-700"}`}>
                          Kelompok {row.group}
                        </span>
                      </td>
                      <td className="py-0.5 px-2">
                        {row.title} {isCurrent && <span className="text-[7px] text-emerald-800 font-bold ml-1">★ [KELOMPOK AKTIF LAPORAN]</span>}
                      </td>
                    </tr>
                  );
                })}

                {/* UAS Banner Row */}
                <tr className="bg-amber-300 font-black text-amber-950 text-center border-t border-amber-400">
                  <td colSpan={4} className="py-0.5 px-2 tracking-widest text-[8px]">
                    UJIAN AKHIR SEMESTER (UAS) — PENGESAHAN DOKUMEN RISET PASCASARJANA
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Visual Attachments Showcase (2 Grid Cards) */}
          <div className="grid grid-cols-2 gap-2 my-1.5 font-sans">
            {/* Card 1: Official Vector Syllabus Document */}
            <div className="border border-slate-300 rounded p-1.5 bg-slate-50/90 flex flex-col justify-between">
              <div className="w-full h-28 bg-white border border-slate-200 rounded flex items-center justify-center p-1 mb-1 overflow-hidden">
                <img
                  src={DAFTAR_KELOMPOK_MAKALAH_DOCUMENT_DATA_URI}
                  alt="Dokumen Otentik Jadwal 7 Kelompok IAI ASA 2026"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="font-bold text-[8.5px] text-slate-900 truncate">
                    Dokumen 1: Jadwal & Matriks 7 Kelompok IAI ASA
                  </span>
                  <span className="text-[7px] font-semibold bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded shrink-0">
                    Silabus Resmi
                  </span>
                </div>
                <p className="text-[7.5px] text-slate-600 italic line-clamp-2 leading-tight">
                  Tabel otentik pembagian jadwal presentasi mata kuliah Statistika Pendidikan Semester 2 Pasca Sarjana IAI ASA Tahun 2026.
                </p>
              </div>
            </div>

            {/* Card 2: User Photo / Emblem Attachment */}
            <div className="border border-slate-300 rounded p-1.5 bg-slate-50/90 flex flex-col justify-between">
              <div className="w-full h-28 bg-white border border-slate-200 rounded flex items-center justify-center p-1 mb-1 overflow-hidden">
                <img
                  src={displayAttachments[0]?.url || activeLogo}
                  alt={displayAttachments[0]?.title || "Dokumentasi"}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="font-bold text-[8.5px] text-slate-900 truncate">
                    Dokumen 2: {displayAttachments[0]?.title || "Emblem Lembaga & Dokumentasi"}
                  </span>
                  <span className="text-[7px] font-semibold bg-amber-100 text-amber-800 px-1 py-0.2 rounded shrink-0">
                    {displayAttachments[0]?.category || "Identitas Riset"}
                  </span>
                </div>
                <p className="text-[7.5px] text-slate-600 italic line-clamp-2 leading-tight">
                  {displayAttachments[0]?.notes || `Identitas resmi institusi ${instName} dan kelengkapan berkas akademik penelitian PAI.`}
                </p>
              </div>
            </div>
          </div>

          {/* Authentic Verification Box */}
          <div className="border border-emerald-300 bg-emerald-50/60 rounded p-1.5 font-sans mt-1 text-[8px]">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-0.5 mb-0.5">
              <span className="font-bold text-emerald-950 uppercase">VERIFIKASI JADWAL SILABUS & DOKUMENTASI RESMI:</span>
              <span className="text-emerald-800 font-semibold">{academicYear}</span>
            </div>
            <p className="text-slate-700 leading-tight mb-1 text-[7.5px]">
              Tabel pembagian kelompok dan dokumen lampiran di atas telah diverifikasi sesuai silabus resmi perkuliahan Statistika Pendidikan Program Pascasarjana Magister PAI.
            </p>

            <div className="grid grid-cols-2 gap-3 text-center pt-0.5 border-t border-emerald-200">
              <div>
                <span className="text-slate-500 block text-[7px]">Dosen Pengampu Mata Kuliah:</span>
                <div className="h-5 border-b border-slate-400 mx-8 my-0.5" />
                <span className="font-bold text-slate-900 block text-[7.5px]">Dr. Isti Nurhayati, M.Pd</span>
                <span className="text-[6.5px] text-slate-500 block font-mono">Kode Dosen: KD-07</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[7px]">Ketua {activeSevenGroup.groupName}:</span>
                <div className="h-5 border-b border-slate-400 mx-8 my-0.5" />
                <span className="font-bold text-slate-900 block text-[7.5px]">
                  {activeSevenGroup.leader}
                </span>
                <span className="text-[6.5px] text-slate-500 block font-mono">
                  {activeSevenGroup.members.length} Anggota Terdaftar
                </span>
              </div>
            </div>
          </div>
        </div>

        {renderRunningFooter(7, totalPages)}
      </div>

      {/* =========================================================
          PAGE 8: LAMPIRAN III: NARASI AKADEMIK SESUAI JUDUL MAKALAH KELOMPOK
      ========================================================= */}
      <div id="pdf-page-8" className="pdf-page shadow-md border border-slate-300 print:shadow-none print:border-none" style={pageStyle}>
        <div>
          {renderRunningHeader(8)}

          {/* Section Header */}
          <div className="flex items-center justify-between border-b-2 border-emerald-900 pb-1.5 mb-2">
            <div>
              <span className="text-[9px] font-bold text-emerald-800 tracking-wider uppercase font-sans">
                LAMPIRAN III: NARASI ILMIAH & METODOLOGI RISET PAI
              </span>
              <h3 className="text-xs font-black text-slate-900 font-sans tracking-wide">
                NARASI MAKALAH KHUSUS {activeSevenGroup.groupName.toUpperCase()} ({activeSevenGroup.roman})
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 font-sans border border-emerald-300">
                Silabus IAI ASA Tahun 2026
              </span>
            </div>
          </div>

          {/* Active Group Identity Banner */}
          <div className="border border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-slate-50 rounded p-2 mb-2 font-sans text-[8px] shadow-2xs">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-1 mb-1">
              <div>
                <span className="font-bold text-emerald-950 text-[9px] mr-1">
                  {activeSevenGroup.groupName} ({activeSevenGroup.roman})
                </span>
                <span className="text-slate-600 font-semibold">• Ketua Tim: {activeSevenGroup.leader}</span>
              </div>
              <span className="text-emerald-800 font-bold">
                Dosen: Dr. Isti Nurhayati, M.Pd (KD-07)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1 text-[7.5px] text-slate-700">
              <span className="font-bold text-slate-600">Anggota Peneliti:</span>
              {activeSevenGroup.members.map((m) => (
                <span key={m.id} className="bg-white border border-slate-300 px-1.5 py-0.2 rounded text-[7px]">
                  <strong>{m.name}</strong> <span className="text-slate-400 font-mono">({m.nim})</span>
                </span>
              ))}
            </div>
          </div>

          {/* DUAL PAPER NARRATIVE PANELS */}
          <div className="space-y-2 font-sans">
            {/* PANEL 1: Makalah Sesi 1 (Sebelum UTS) */}
            <div className="border border-slate-300 rounded p-2 bg-white shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-1">
                <span className="text-[8.5px] font-black text-emerald-950 uppercase flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[7px]">1</span>
                  MAKALAH SESI 1 ({activeSevenGroup.paper1.schedule}):
                </span>
                <span className="text-[7px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">
                  Sebelum UTS
                </span>
              </div>
              <h4 className="text-[9px] font-bold text-slate-900 leading-tight mb-1">
                &ldquo;{activeSevenGroup.paper1.title}&rdquo;
              </h4>
              <p className="text-[7.5px] text-slate-700 leading-relaxed text-justify mb-1 italic">
                <strong>Abstrak & Landasan Teori:</strong> {activeSevenGroup.paper1.abstract}
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-[7px] bg-slate-50 p-1.5 rounded border border-slate-200">
                <div>
                  <strong className="text-slate-900 block mb-0.5">Fokus Metodologi & Formula:</strong>
                  <span className="text-slate-600 leading-tight block">
                    {activeSevenGroup.paper1.statisticalMetrics.join(" • ")}
                  </span>
                </div>
                <div>
                  <strong className="text-emerald-900 block mb-0.5">Implikasi Riset Pembelajaran PAI:</strong>
                  <span className="text-slate-600 leading-tight block line-clamp-3">
                    {activeSevenGroup.paper1.paiImplications}
                  </span>
                </div>
              </div>
            </div>

            {/* PANEL 2: Makalah Sesi 2 (Setelah UTS) */}
            <div className="border border-slate-300 rounded p-2 bg-white shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-1">
                <span className="text-[8.5px] font-black text-emerald-950 uppercase flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[7px]">2</span>
                  MAKALAH SESI 2 ({activeSevenGroup.paper2.schedule}):
                </span>
                <span className="text-[7px] font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded">
                  Setelah UTS
                </span>
              </div>
              <h4 className="text-[9px] font-bold text-slate-900 leading-tight mb-1">
                &ldquo;{activeSevenGroup.paper2.title}&rdquo;
              </h4>
              <p className="text-[7.5px] text-slate-700 leading-relaxed text-justify mb-1 italic">
                <strong>Abstrak & Landasan Teori:</strong> {activeSevenGroup.paper2.abstract}
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-[7px] bg-slate-50 p-1.5 rounded border border-slate-200">
                <div>
                  <strong className="text-slate-900 block mb-0.5">Fokus Metodologi & Uji Hipotesis:</strong>
                  <span className="text-slate-600 leading-tight block">
                    {activeSevenGroup.paper2.statisticalMetrics.join(" • ")}
                  </span>
                </div>
                <div>
                  <strong className="text-emerald-900 block mb-0.5">Implikasi Riset Pembelajaran PAI:</strong>
                  <span className="text-slate-600 leading-tight block line-clamp-3">
                    {activeSevenGroup.paper2.paiImplications}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Synthesis & Recommendations */}
          <div className="border border-slate-300 bg-slate-50 rounded p-1.5 font-sans mt-2 text-[7.5px]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-0.5 mb-1">
              <strong className="text-slate-900 uppercase">REKOMENDASI METODOLOGIS TESIS MAGISTER PENDIDIKAN AGAMA ISLAM:</strong>
              <span className="text-emerald-800 font-semibold">{academicYear}</span>
            </div>
            <ul className="space-y-0.5 text-slate-700">
              <li className="flex items-start gap-1">
                <span className="text-emerald-700 font-bold">•</span>
                <span>
                  Hasil analisis statistik deskriptif dan inferensial di atas berfungsi sebagai pijakan kuantitatif dalam penyusunan proposal tesis Magister PAI.
                </span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-emerald-700 font-bold">•</span>
                <span>
                  Seluruh prosedur uji statistik mengacu pada kriteria signifikansi baku (&alpha; = 0,05) dan standar pelaporan ilmiah APA 7th Edition.
                </span>
              </li>
            </ul>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-3 text-center pt-1 mt-1 border-t border-slate-200">
              <div>
                <span className="text-slate-500 block text-[7px]">Dosen Pengampu / Penilai Makalah:</span>
                <div className="h-5 border-b border-slate-400 mx-8 my-0.5" />
                <span className="font-bold text-slate-900 block text-[7.5px]">Dr. Isti Nurhayati, M.Pd</span>
                <span className="text-[6.5px] text-slate-500 block font-mono">Kode Dosen: KD-07</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[7px]">Penyusun / Penulis Utama Makalah:</span>
                <div className="h-5 border-b border-slate-400 mx-8 my-0.5" />
                <span className="font-bold text-slate-900 block text-[7.5px]">
                  {activeSevenGroup.leader}
                </span>
                <span className="text-[6.5px] text-slate-500 block font-mono">
                  {activeSevenGroup.groupName} Pascasarjana IAI ASA
                </span>
              </div>
            </div>
          </div>
        </div>

        {renderRunningFooter(8, totalPages)}
      </div>
    </div>
  );
};
