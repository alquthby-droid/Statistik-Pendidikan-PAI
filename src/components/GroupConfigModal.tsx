import React, { useState, useRef } from "react";
import { GroupAssignmentInfo, GroupMember } from "../types";
import {
  PRESET_INSTITUTIONS,
  DEFAULT_GROUP_INFO,
  IAI_ALJIHAD_LECTURERS,
  DAFTAR_DOSEN_DOCUMENT_DATA_URI,
  IAI_ALJIHAD_SIX_GROUPS_DEFINITIONS,
  getGroupByNumber,
} from "../data/institutions";
import { LOGO_IAI_ASA_DATA_URI } from "../assets/logoIaiAsa";
import { IAI_ALJIHAD_SEMESTER_1_STUDENTS } from "../data/students";
import {
  Users,
  Building2,
  GraduationCap,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  X,
  BookOpen,
  UserCheck,
  Check,
  Upload,
  Image as ImageIcon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
} from "lucide-react";

interface GroupConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupInfo: GroupAssignmentInfo;
  onSave: (updated: GroupAssignmentInfo) => void;
}

export const GroupConfigModal: React.FC<GroupConfigModalProps> = ({
  isOpen,
  onClose,
  groupInfo,
  onSave,
}) => {
  const [formData, setFormData] = useState<GroupAssignmentInfo>(groupInfo);
  const [showSavedNotification, setShowSavedNotification] = useState<boolean>(false);
  const [showAllGroupsBreakdown, setShowAllGroupsBreakdown] = useState<boolean>(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Sync state if modal reopens with updated props
  React.useEffect(() => {
    setFormData(groupInfo);
  }, [groupInfo, isOpen]);

  if (!isOpen) return null;

  const handlePresetSelect = (index: number) => {
    const selected = PRESET_INSTITUTIONS[index];
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        institutionName: selected.name,
        faculty: selected.faculty,
        studyProgram: selected.studyProgram,
        logoUrl: selected.logoUrl || prev.logoUrl || LOGO_IAI_ASA_DATA_URI,
      }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Harap pilih berkas gambar (PNG, JPG, SVG, atau WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData((prev) => ({
          ...prev,
          logoUrl: result,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddMember = () => {
    const newId = Date.now().toString();
    const newMember: GroupMember = {
      id: newId,
      name: "",
      nim: "",
      role: "Anggota / Analis",
    };
    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }));
  };

  const handleSelectRosterStudent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;
    const std = IAI_ALJIHAD_SEMESTER_1_STUDENTS.find((s) => s.nim === val);
    if (std) {
      setFormData((prev) => ({
        ...prev,
        members: [
          ...prev.members,
          {
            id: String(Date.now()),
            name: std.name,
            nim: std.nim,
            role: prev.members.length === 0 ? "Ketua Kelompok" : "Anggota Analis",
          },
        ],
      }));
    }
    e.target.value = "";
  };

  const handleRemoveMember = (id: string) => {
    if (formData.members.length <= 1) {
      alert("Kelompok harus memiliki minimal 1 anggota mahasiswa.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
    }));
  };

  const handleMemberChange = (id: string, field: keyof GroupMember, value: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    }));
  };

  const handleResetDefault = () => {
    if (confirm("Reset konfigurasi ke contoh baku tugas kelompok S2 PAI?")) {
      setFormData(DEFAULT_GROUP_INFO);
    }
  };

  const handleSave = () => {
    onSave(formData);
    setShowSavedNotification(true);
    setTimeout(() => {
      setShowSavedNotification(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center text-white shadow-inner">
              <Building2 className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Pengaturan Tugas Kelompok & Lembaga Perguruan Tinggi
              </h2>
              <p className="text-xs text-emerald-200/90">
                Data akan otomatis tampil di Kop Laporan, Slide PPT, dan Lembar Pengesahan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-emerald-950/40 hover:bg-emerald-950/70 flex items-center justify-center text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Mode Switcher */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-emerald-700" />
              <div>
                <p className="font-bold text-slate-900">Format Penugasan Perkuliahan</p>
                <p className="text-xs text-slate-600">
                  {formData.isGroupAssignment
                    ? "Aktif: Tugas Kelompok dengan identitas anggota kelompok lengkap"
                    : "Aktif: Tugas Mandiri / Individu"}
                </p>
              </div>
            </div>
            <div className="flex items-center bg-white rounded-lg p-1 border border-emerald-300 shadow-2xs">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isGroupAssignment: true }))}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  formData.isGroupAssignment
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tugas Kelompok
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isGroupAssignment: false }))}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  !formData.isGroupAssignment
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tugas Mandiri
              </button>
            </div>
          </div>

          {/* Quick 6 Groups Selector (Kelompok I s/d Kelompok VI) */}
          <div className="bg-emerald-50/70 border border-emerald-300/80 rounded-xl p-3.5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/80 pb-2">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase block font-sans">
                  Pembagian Resmi 29 Mahasiswa S2 PAI
                </span>
                <h4 className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  Pilih Cepat dari 7 Kelompok Resmi (Kelompok I s/d Kelompok VII)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAllGroupsBreakdown(!showAllGroupsBreakdown)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-900 bg-white hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
              >
                <FileSpreadsheet className="w-3 h-3 text-emerald-700" />
                <span>{showAllGroupsBreakdown ? "Tutup Tabel Rekap" : "Lihat Tabel Rekap 7 Kelompok"}</span>
                {showAllGroupsBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* 7 Group Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {IAI_ALJIHAD_SIX_GROUPS_DEFINITIONS.map((grp) => {
                const isSelected =
                  formData.isGroupAssignment &&
                  (formData.groupName.includes(grp.roman) ||
                    formData.groupName.toLowerCase().includes(grp.groupName.toLowerCase()));

                return (
                  <button
                    key={grp.groupNumber}
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...grp.groupInfo,
                        institutionName: formData.institutionName || grp.groupInfo.institutionName,
                        faculty: formData.faculty || grp.groupInfo.faculty,
                        studyProgram: formData.studyProgram || grp.groupInfo.studyProgram,
                        courseName: formData.courseName || grp.groupInfo.courseName,
                        logoUrl: formData.logoUrl || grp.groupInfo.logoUrl,
                        lecturer: formData.lecturer || grp.groupInfo.lecturer,
                        lecturerNip: formData.lecturerNip || grp.groupInfo.lecturerNip,
                      });
                    }}
                    className={`text-left p-2 rounded-lg border text-xs transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? "bg-emerald-700 text-white border-emerald-800 shadow-xs ring-2 ring-emerald-500 ring-offset-1"
                        : "bg-white hover:bg-emerald-100/60 border-emerald-200 text-slate-800"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`font-black text-[11px] px-1.5 py-0.5 rounded ${
                            isSelected ? "bg-emerald-800 text-emerald-100" : "bg-emerald-100 text-emerald-900"
                          }`}
                        >
                          Kel. {grp.roman}
                        </span>
                        <span className={`text-[9.5px] font-bold ${isSelected ? "text-emerald-200" : "text-emerald-700"}`}>
                          {grp.members.length} Mhs
                        </span>
                      </div>
                      <div className="font-bold text-[11px] truncate leading-tight">
                        {grp.groupName}
                      </div>
                      <div className={`text-[9.5px] truncate mt-0.5 ${isSelected ? "text-emerald-100" : "text-slate-600"}`}>
                        Ketua: <strong>{grp.leader.split(" ")[0]}</strong>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="mt-1 pt-1 border-t border-emerald-600 flex items-center justify-between text-[9px] text-emerald-200 font-semibold">
                        <span>Aktif</span>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Expandable Breakdown of All 7 Groups */}
            {showAllGroupsBreakdown && (
              <div className="bg-white border border-emerald-200 rounded-lg p-3 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-bold text-slate-900 text-xs">
                    Rincian Pembagian 7 Kelompok & Peran Anggota (Silabus & Rombel Semester 1 - N = 29)
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 font-semibold px-2 py-0.5 rounded">
                    Total 29 Mahasiswa
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 text-[10.5px]">
                  {IAI_ALJIHAD_SIX_GROUPS_DEFINITIONS.map((grp) => (
                    <div
                      key={grp.groupNumber}
                      className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/70 hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-1.5">
                        <span className="font-bold text-emerald-900">
                          {grp.groupName} ({grp.members.length} Mahasiswa)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...grp.groupInfo,
                              institutionName: formData.institutionName || grp.groupInfo.institutionName,
                              faculty: formData.faculty || grp.groupInfo.faculty,
                              studyProgram: formData.studyProgram || grp.groupInfo.studyProgram,
                              courseName: formData.courseName || grp.groupInfo.courseName,
                              logoUrl: formData.logoUrl || grp.groupInfo.logoUrl,
                              lecturer: formData.lecturer || grp.groupInfo.lecturer,
                              lecturerNip: formData.lecturerNip || grp.groupInfo.lecturerNip,
                            });
                          }}
                          className="text-[9.5px] px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded cursor-pointer"
                        >
                          Pilih
                        </button>
                      </div>
                      <p className="text-[9px] text-slate-500 italic mb-1.5 leading-tight line-clamp-1">
                        Topik: {grp.topic}
                      </p>
                      <ol className="space-y-1 list-decimal list-inside text-slate-700">
                        {grp.members.map((m, idx) => (
                          <li key={m.id} className="truncate">
                            <strong className={idx === 0 ? "text-emerald-950" : "text-slate-900"}>
                              {m.name}
                            </strong>{" "}
                            <span className="text-[9px] text-slate-500 font-mono">({m.nim})</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 1: Lembaga Perguruan Tinggi */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                1. Identitas Lembaga Perguruan Tinggi
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span>Pilih Cepat PTKIN/PTN:</span>
              </div>
            </div>

            {/* Quick Preset Selector */}
            <div className="flex items-center gap-2">
              <select
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                onChange={(e) => {
                  if (e.target.value !== "") {
                    handlePresetSelect(Number(e.target.value));
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  -- Pilih Template Lembaga Perguruan Tinggi (UIN / IAIN / Kampus Islam) --
                </option>
                {PRESET_INSTITUTIONS.map((inst, idx) => (
                  <option key={idx} value={idx}>
                    {inst.name} ({inst.shortName})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lembaga Perguruan Tinggi (Universitas / Institut / STAI) *
                </label>
                <input
                  type="text"
                  value={formData.institutionName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, institutionName: e.target.value }))
                  }
                  placeholder="Contoh: Universitas Islam Negeri Sunan Kalijaga Yogyakarta"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fakultas / Program Pascasarjana *
                </label>
                <input
                  type="text"
                  value={formData.faculty}
                  onChange={(e) => setFormData((prev) => ({ ...prev, faculty: e.target.value }))}
                  placeholder="Contoh: Fakultas Ilmu Tarbiyah dan Keguruan (FITK)"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Program Studi *
                </label>
                <input
                  type="text"
                  value={formData.studyProgram}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, studyProgram: e.target.value }))
                  }
                  placeholder="Contoh: Magister (S2) Pendidikan Agama Islam"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mata Kuliah / Bidang Kajian
                </label>
                <input
                  type="text"
                  value={formData.courseName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, courseName: e.target.value }))}
                  placeholder="Contoh: Statistik Pendidikan & Evaluasi Pembelajaran PAI"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Logo Perguruan Tinggi Setting */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                  Logo Resmi Perguruan Tinggi (Kop Surat PDF & Slide PPTX)
                </span>
                <span className="text-[11px] text-slate-500 font-sans">Format: PNG, JPG, SVG</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Logo Preview */}
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-2xs shrink-0 overflow-hidden">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Preview Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-[10px] text-slate-400 text-center leading-tight">
                      Tanpa Logo
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow-2xs cursor-pointer active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Unggah Logo Foto / Gambar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          logoUrl: LOGO_IAI_ASA_DATA_URI,
                          institutionName: prev.institutionName || "Institut Agama Islam As'adiyah (IAI ASA) Sengkang",
                        }))
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-medium text-xs cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pakai Logo IAI ASA Pascasarjana</span>
                    </button>
                    {formData.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, logoUrl: "" }))}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3 text-slate-500" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[10.5px] text-slate-500">
                    Logo ini dicetak pada Kop Surat Lembar Pengesahan Laporan PDF, Running Header dokumen, dan Slide Presentasi Tugas Kelompok.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Identitas Tugas & Dosen Pengampu */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-1.5">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                2. Data Penugasan & Dosen Pengampu
              </h3>
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    const kdVal = Number(e.target.value);
                    const selected = IAI_ALJIHAD_LECTURERS.find((l) => l.kd === kdVal);
                    if (selected) {
                      setFormData((prev) => ({
                        ...prev,
                        lecturer: selected.name,
                        lecturerNip: selected.code,
                      }));
                    }
                    e.target.value = "";
                  }}
                  defaultValue=""
                  className="text-xs px-2.5 py-1 bg-white border border-emerald-300 text-emerald-950 font-medium rounded-lg cursor-pointer focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                  title="Pilih Dosen Resmi IAI Al-Jihad Shalahuddin Al-Ayyubi Jakarta"
                >
                  <option value="" disabled>+ Pilih dari Daftar Dosen Resmi (KD 01 - KD 07)...</option>
                  {IAI_ALJIHAD_LECTURERS.map((d) => (
                    <option key={d.kd} value={d.kd}>
                      {d.code}: {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama / Nomor Kelompok
                </label>
                <input
                  type="text"
                  value={formData.groupName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, groupName: e.target.value }))}
                  placeholder="Contoh: Kelompok III (Tiga)"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold text-emerald-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dosen Pengampu / Pembimbing
                </label>
                <input
                  type="text"
                  value={formData.lecturer}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lecturer: e.target.value }))}
                  placeholder="Contoh: Dr. Aang Darsono, S.Ag., M.Pd.I"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kode Dosen / NIP
                </label>
                <input
                  type="text"
                  value={formData.lecturerNip || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, lecturerNip: e.target.value }))
                  }
                  placeholder="Contoh: KD-04 atau 19740512 200003 1 002"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="w-full sm:w-1/2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Semester & Tahun Akademik
                </label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData((prev) => ({ ...prev, academicYear: e.target.value }))}
                  placeholder="Contoh: Tahun Akademik 2025 Genap"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    const alreadyHasDosenDoc = formData.attachments?.some((a) =>
                      a.title.toLowerCase().includes("dosen")
                    );
                    if (alreadyHasDosenDoc) {
                      alert("Dokumen daftar dosen resmi sudah ada dalam lampiran!");
                      return;
                    }
                    setFormData((prev) => ({
                      ...prev,
                      attachments: [
                        {
                          id: `att-dosen-${Date.now()}`,
                          url: DAFTAR_DOSEN_DOCUMENT_DATA_URI,
                          title: "Dokumen Resmi: DAFTAR NAMA DOSEN / KODE DOSEN (KD)",
                          category: "Surat Pengantar & SK" as const,
                          date: "10 September 2025",
                          notes: "Daftar resmi nama dan kode dosen pengampu (KD 01 - KD 07) Program Pascasarjana Magister PAI IAI Al-Jihad Shalahuddin Al-Ayyubi Jakarta.",
                          fileSize: "18.4 KB",
                        },
                        ...(prev.attachments || []),
                      ],
                    }));
                    alert("Dokumen resmi Daftar Nama Dosen (KD 01 - KD 07) berhasil ditambahkan ke lampiran gambar!");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  title="Tambahkan Dokumen Resmi Daftar Dosen (KD 01 - KD 07) ke Lampiran Laporan"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>+ Lampirkan Dokumen Dosen (KD)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Daftar Anggota Kelompok Mahasiswa */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-1.5">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-emerald-700" />
                3. Daftar Anggota Kelompok Mahasiswa ({formData.members.length} Orang)
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  onChange={handleSelectRosterStudent}
                  defaultValue=""
                  className="text-xs px-2.5 py-1 bg-white border border-emerald-300 text-emerald-950 font-medium rounded-lg cursor-pointer focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                  title="Pilih langsung dari daftar 29 mahasiswa resmi semester 1"
                >
                  <option value="" disabled>+ Pilih Mahasiswa dari Rombel...</option>
                  {IAI_ALJIHAD_SEMESTER_1_STUDENTS.map((s) => (
                    <option key={s.nim} value={s.nim}>
                      {s.no}. {s.name} ({s.nim})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Kosong</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {formData.members.map((member, idx) => (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-300 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(member.id, "name", e.target.value)}
                      placeholder="Nama Lengkap & Gelar Mahasiswa"
                      className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />

                    <input
                      type="text"
                      value={member.nim}
                      onChange={(e) => handleMemberChange(member.id, "nim", e.target.value)}
                      placeholder="Nomor Induk Mahasiswa (NIM)"
                      className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />

                    <input
                      type="text"
                      value={member.role || ""}
                      onChange={(e) => handleMemberChange(member.id, "role", e.target.value)}
                      placeholder="Tugas/Peran (misal: Ketua / Analis / Notulen)"
                      className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-center cursor-pointer"
                    title="Hapus anggota ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetDefault}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset ke Contoh Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-sm transition-all cursor-pointer active:scale-98"
            >
              {showSavedNotification ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Terapkan ke Laporan & PPT</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
