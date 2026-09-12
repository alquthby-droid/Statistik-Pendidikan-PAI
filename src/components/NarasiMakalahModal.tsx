import React, { useState } from "react";
import {
  SevenGroupMakalahDefinition,
  IAI_ASA_SEVEN_GROUPS_DEFINITIONS,
  DAFTAR_KELOMPOK_MAKALAH_DOCUMENT_DATA_URI,
} from "../data/makalahSevenGroups";
import { GroupAssignmentInfo } from "../types";
import { LOGO_IAI_ASA_DATA_URI } from "../assets/logoIaiAsa";
import {
  BookOpen,
  Calendar,
  Users,
  Check,
  Copy,
  FileText,
  Sparkles,
  Award,
  ChevronRight,
  GraduationCap,
  X,
  ExternalLink,
  Table as TableIcon,
  HelpCircle,
  FileCheck,
} from "lucide-react";

interface NarasiMakalahModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeGroupNumber?: number; // 1 to 7
  onApplyGroup?: (info: GroupAssignmentInfo) => void;
}

export const NarasiMakalahModal: React.FC<NarasiMakalahModalProps> = ({
  isOpen,
  onClose,
  activeGroupNumber = 1,
  onApplyGroup,
}) => {
  const [selectedGroupNum, setSelectedGroupNum] = useState<number>(activeGroupNumber || 1);
  const [activePaperTab, setActivePaperTab] = useState<1 | 2>(1);
  const [activeMainView, setActiveMainView] = useState<"narrative" | "schedule">("narrative");
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Sync if activeGroupNumber changes
  React.useEffect(() => {
    if (activeGroupNumber >= 1 && activeGroupNumber <= 7) {
      setSelectedGroupNum(activeGroupNumber);
    }
  }, [activeGroupNumber, isOpen]);

  if (!isOpen) return null;

  const currentGroup =
    IAI_ASA_SEVEN_GROUPS_DEFINITIONS.find((g) => g.groupNumber === selectedGroupNum) ||
    IAI_ASA_SEVEN_GROUPS_DEFINITIONS[0];

  const currentPaper = activePaperTab === 1 ? currentGroup.paper1 : currentGroup.paper2;

  const showCopyToast = (msg: string) => {
    setCopiedNotification(msg);
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showCopyToast(`Narasi ${label} berhasil disalin ke clipboard!`);
  };

  const handleCopyFullPaper = () => {
    const fullText = `
===================================================================
NASKAH MAKALAH STATISTIKA PENDIDIKAN
SEMESTER 2 PASCA SARJANA IAI ASA TAHUN 2026
Dosen Pengampu: ${currentGroup.lecturer} (${currentGroup.lecturerNip})
Kelompok: ${currentGroup.groupName} (Ketua: ${currentGroup.leader})
Anggota: ${currentGroup.members.map((m) => `${m.name} (NIM: ${m.nim})`).join(", ")}
===================================================================

JUDUL MAKALAH (${currentPaper.schedule}):
"${currentPaper.title}"
Sub-Topik: ${currentPaper.shortTopic}

I. ABSTRAK
${currentPaper.abstract}

II. LATAR BELAKANG & LANDASAN TEORETIS
${currentPaper.background}

III. FOKUS METODOLOGIS & PENGUJIAN HIPOTESIS
${currentPaper.methodologyFocus}

IV. PARAMETER & FORMULA STATISTIK UTAMA
${currentPaper.statisticalMetrics.map((m, idx) => `  ${idx + 1}. ${m}`).join("\n")}

V. RELEVANSI & IMPLIKASI PEDAGOGIS DALAM PENELITIAN PAI
${currentPaper.paiImplications}

VI. KESIMPULAN & REKOMENDASI AKADEMIK
${currentPaper.keyConclusions.map((c, idx) => `  ${idx + 1}. ${c}`).join("\n")}
===================================================================
`;
    navigator.clipboard.writeText(fullText.trim());
    showCopyToast(`Seluruh naskah makalah ${currentGroup.groupName} (${currentPaper.schedule}) berhasil disalin!`);
  };

  const handleApplyToReport = () => {
    if (onApplyGroup) {
      const updatedInfo: GroupAssignmentInfo = {
        isGroupAssignment: true,
        institutionName: "Institut Agama Islam As'adiyah (IAI ASA) Sengkang",
        faculty: "Program Pascasarjana",
        studyProgram: "Magister (S2) Pendidikan Agama Islam",
        courseName: "Statistika Pendidikan",
        groupName: `${currentGroup.groupName} (${currentGroup.roman})`,
        lecturer: currentGroup.lecturer,
        lecturerNip: currentGroup.lecturerNip,
        academicYear: "Tahun Akademik 2026",
        logoUrl: LOGO_IAI_ASA_DATA_URI,
        members: currentGroup.members,
        paperTitle1: currentGroup.paper1.title,
        paperSchedule1: currentGroup.paper1.schedule,
        paperNarrative1: currentGroup.paper1.abstract,
        paperTitle2: currentGroup.paper2.title,
        paperSchedule2: currentGroup.paper2.schedule,
        paperNarrative2: currentGroup.paper2.abstract,
        activePaperIndex: activePaperTab,
      };
      onApplyGroup(updatedInfo);
      showCopyToast(`${currentGroup.groupName} berhasil diterapkan ke Laporan & Dokumen Cetak A4!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Daftar Kelompok, Jadwal & Narasi Makalah Statistika Pendidikan
                </h2>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 border border-amber-400/30">
                  Semester 2 Pasca Sarjana IAI ASA 2026
                </span>
              </div>
              <p className="text-xs text-emerald-300">
                Dosen Pengampu: <strong>Dr. Isti Nurhayati, M.Pd (KD-07)</strong> • 7 Kelompok (29 Mahasiswa)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg bg-emerald-950/60 p-0.5 border border-emerald-800">
              <button
                type="button"
                onClick={() => setActiveMainView("narrative")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeMainView === "narrative"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-emerald-300 hover:text-white"
                }`}
              >
                Narasi Makalah
              </button>
              <button
                type="button"
                onClick={() => setActiveMainView("schedule")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                  activeMainView === "schedule"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-emerald-300 hover:text-white"
                }`}
              >
                <TableIcon className="w-3 h-3" />
                <span>Jadwal Lengkap</span>
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/80 transition-colors cursor-pointer"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Group Tab Bar (Kelompok 1 - 7) */}
        <div className="bg-slate-100 px-4 sm:px-6 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto shrink-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">
            Pilih Kelompok:
          </span>
          {IAI_ASA_SEVEN_GROUPS_DEFINITIONS.map((grp) => {
            const isSelected = grp.groupNumber === selectedGroupNum;
            return (
              <button
                key={grp.groupNumber}
                type="button"
                onClick={() => {
                  setSelectedGroupNum(grp.groupNumber);
                  setActiveMainView("narrative");
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600 ring-offset-1"
                    : "bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200"
                }`}
              >
                <span>{grp.groupName}</span>
                <span
                  className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                    isSelected ? "bg-emerald-950 text-emerald-200" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {grp.members.length} Mhs
                </span>
              </button>
            );
          })}
        </div>

        {/* Toast Notification */}
        {copiedNotification && (
          <div className="mx-6 mt-2 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-2 animate-in fade-in shrink-0">
            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{copiedNotification}</span>
          </div>
        )}

        {/* Modal Main Body */}
        {activeMainView === "schedule" ? (
          /* ================= FULL SCHEDULE DOCUMENT VIEW ================= */
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Dokumen Otentik: Jadwal & Pembagian 7 Kelompok Pascasarjana IAI ASA Tahun 2026
                </h3>
                <p className="text-xs text-slate-500">
                  Dosen Pengampu: <strong>Dr. Isti Nurhayati, M.Pd</strong> • Format Matriks Perkuliahan Ke-2 s/d Ke-10
                </p>
              </div>
              <a
                href={DAFTAR_KELOMPOK_MAKALAH_DOCUMENT_DATA_URI}
                download="Jadwal_Kelompok_Statistika_IAI_ASA_2026.svg"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Unduh Gambar Vektor (SVG)</span>
              </a>
            </div>

            {/* Document Render Box */}
            <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center p-2">
              <img
                src={DAFTAR_KELOMPOK_MAKALAH_DOCUMENT_DATA_URI}
                alt="Daftar Kelompok & Jadwal Statistika Pendidikan Pascasarjana IAI ASA Tahun 2026"
                className="w-full h-auto max-h-[650px] object-contain"
              />
            </div>
          </div>
        ) : (
          /* ================= DETAILED ACADEMIC NARRATIVE VIEW ================= */
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
            {/* Group Banner Info Card */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-slate-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-xs px-2 py-0.5 rounded bg-emerald-800 text-white font-sans">
                    {currentGroup.groupName} ({currentGroup.roman})
                  </span>
                  <span className="text-xs text-slate-600 font-semibold">
                    Ketua Tim: <strong>{currentGroup.leader}</strong>
                  </span>
                  <span className="text-xs text-emerald-800 font-medium">
                    • Dosen: <strong>{currentGroup.lecturer}</strong>
                  </span>
                </div>
                {/* Team Members List */}
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className="text-[11px] font-bold text-slate-500 mr-1">Anggota:</span>
                  {currentGroup.members.map((m) => (
                    <span
                      key={m.id}
                      className="inline-flex items-center gap-1 text-[11px] bg-white border border-slate-300 text-slate-800 px-2 py-0.5 rounded-md font-sans"
                    >
                      <strong className="text-emerald-950">{m.name}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">({m.nim})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={handleCopyFullPaper}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                  title="Salin seluruh isi makalah beserta narasi ke clipboard"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Naskah</span>
                </button>
                {onApplyGroup && (
                  <button
                    type="button"
                    onClick={handleApplyToReport}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
                    title="Terapkan kelompok dan narasi ini ke Laporan & PDF (A4)"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Terapkan ke Laporan PDF</span>
                  </button>
                )}
              </div>
            </div>

            {/* Paper Tabs (Makalah 1 vs Makalah 2) */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivePaperTab(1)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activePaperTab === 1
                      ? "bg-emerald-800 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Makalah Sesi 1 ({currentGroup.paper1.schedule})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePaperTab(2)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activePaperTab === 2
                      ? "bg-emerald-800 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Makalah Sesi 2 ({currentGroup.paper2.schedule})</span>
                </button>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Jadwal: {currentPaper.schedule}
                </span>
              </div>
            </div>

            {/* Paper Title & Sub-Topic Header */}
            <div className="border-l-4 border-emerald-700 pl-4 py-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                Judul Resmi di Silabus Pascasarjana:
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                &ldquo;{currentPaper.title}&rdquo;
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Topik Kajian: <strong>{currentPaper.shortTopic}</strong>
              </p>
            </div>

            {/* SECTION 1: Abstrak Makalah */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>I. Abstrak & Ringkasan Eksekutif</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(currentPaper.abstract, "Abstrak")}
                  className="text-[10px] font-semibold text-slate-500 hover:text-emerald-700 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Salin</span>
                </button>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                &ldquo;{currentPaper.abstract}&rdquo;
              </p>
            </div>

            {/* SECTION 2 & 3: Latar Belakang & Metodologi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Latar Belakang */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-100">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                      <span>II. Latar Belakang & Teori</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(currentPaper.background, "Latar Belakang")}
                      className="text-[10px] text-slate-400 hover:text-emerald-700"
                    >
                      Salin
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify">
                    {currentPaper.background}
                  </p>
                </div>
              </div>

              {/* Fokus Metodologi */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-100">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                      <span>III. Fokus Metodologis</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(currentPaper.methodologyFocus, "Fokus Metodologis")}
                      className="text-[10px] text-slate-400 hover:text-emerald-700"
                    >
                      Salin
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify">
                    {currentPaper.methodologyFocus}
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 4: Parameter & Rumus Statistik Utama */}
            <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-4">
              <span className="text-xs font-black text-emerald-950 uppercase tracking-wider block mb-2">
                IV. Parameter & Formula Statistik Kunci:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentPaper.statisticalMetrics.map((met, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 bg-white p-2 rounded-lg border border-emerald-100 text-xs text-slate-800"
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-700 text-white font-mono text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="font-semibold">{met}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: Relevansi & Implikasi Pedagogis Riset PAI */}
            <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-800" />
                  <span>V. Relevansi & Implikasi Pedagogis bagi Riset PAI:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(currentPaper.paiImplications, "Implikasi PAI")}
                  className="text-[10px] text-amber-800 hover:text-amber-950 font-semibold"
                >
                  Salin
                </button>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed text-justify">
                {currentPaper.paiImplications}
              </p>
            </div>

            {/* SECTION 6: Kesimpulan & Rekomendasi Tesis */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block mb-2">
                VI. Kesimpulan & Rekomendasi Tesis Magister PAI:
              </span>
              <ul className="space-y-1.5">
                {currentPaper.keyConclusions.map((conc, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{conc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="text-[11px] text-slate-500">
            Dosen Pengampu: <strong>Dr. Isti Nurhayati, M.Pd</strong> • Pascasarjana IAI ASA 2026
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyFullPaper}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Naskah Lengkap</span>
            </button>
            {onApplyGroup && (
              <button
                type="button"
                onClick={handleApplyToReport}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Terapkan ke Laporan & PDF</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
