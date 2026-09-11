import React from "react";
import {
  BookOpen,
  Camera,
  BarChart2,
  Table,
  Target,
  PieChart,
  FileText,
  Presentation,
  GraduationCap,
  Users,
  Image as ImageIcon,
} from "lucide-react";
import { GroupAssignmentInfo } from "../types";

interface HeaderProps {
  activeTab: "upload" | "sebaran" | "distribusi" | "zscore" | "grafik" | "laporan" | "ppt";
  setActiveTab: (tab: "upload" | "sebaran" | "distribusi" | "zscore" | "grafik" | "laporan" | "ppt") => void;
  dataCount: number;
  mean: number;
  stdDev: number;
  groupInfo?: GroupAssignmentInfo;
  onOpenGroupConfig?: () => void;
  onOpenLampiran?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  dataCount,
  mean,
  stdDev,
  groupInfo,
  onOpenGroupConfig,
  onOpenLampiran,
}) => {
  const navItems = [
    { id: "upload", label: "Unggah Foto & Data", icon: Camera },
    { id: "sebaran", label: "1. Sebaran & Dispersi", icon: BarChart2 },
    { id: "distribusi", label: "2. Distribusi Frekuensi", icon: Table },
    { id: "zscore", label: "3. Z-Score & T-Score", icon: Target },
    { id: "grafik", label: "4. Grafik Statistik", icon: PieChart },
    { id: "laporan", label: "5. Laporan S2 PAI", icon: FileText },
    { id: "ppt", label: "6. Modul Slide PPT", icon: Presentation },
  ] as const;

  const attachmentCount = groupInfo?.attachments?.length || 1;

  return (
    <header className="bg-emerald-950 text-emerald-50 border-b border-emerald-800/60 sticky top-0 z-30 shadow-md print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Brand & Course Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/90 text-white flex items-center justify-center shadow-inner ring-1 ring-emerald-400/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Statistik Pendidikan S2 PAI
                </h1>
                <span className="text-[11px] font-semibold bg-emerald-800/90 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-700/50">
                  Magister PAI
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span>Silabus: <span className="text-emerald-100 font-medium">Sebaran • Distribusi • Z-Score • Grafik</span></span>
                <span className="text-emerald-600 hidden sm:inline">•</span>
                <span className="text-emerald-200">Pengembang: <strong className="text-amber-300 font-semibold">Husni, S.Kom.I</strong></span>
              </p>
            </div>
          </div>

          {/* Quick Metrics & Institution/Group Badge */}
          <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
            {/* Institution / Group Badge Button with Logo */}
            {onOpenGroupConfig && (
              <button
                id="btn-open-group-config"
                onClick={onOpenGroupConfig}
                className="flex items-center gap-2 text-xs bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-600/60 text-emerald-100 rounded-xl px-2.5 py-1.5 transition-all shadow-sm cursor-pointer active:scale-95 group"
                title="Klik untuk menyesuaikan nama Perguruan Tinggi, Kelompok, dan Anggota Mahasiswa"
              >
                <div className="w-7 h-7 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                  {groupInfo?.logoUrl ? (
                    <img
                      src={groupInfo.logoUrl}
                      alt="Logo Lembaga"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <GraduationCap className="w-4 h-4 text-emerald-800" />
                  )}
                </div>
                <div className="text-left leading-tight max-w-[170px] sm:max-w-[220px]">
                  <div className="font-bold text-white text-[11px] truncate">
                    {groupInfo?.institutionName || "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta"}
                  </div>
                  <div className="text-[10px] text-amber-300 font-medium flex items-center gap-1 truncate">
                    <Users className="w-2.5 h-2.5 shrink-0" />
                    <span>{groupInfo?.isGroupAssignment ? groupInfo.groupName : "Tugas Individu"}</span>
                    {groupInfo?.isGroupAssignment && (
                      <span className="text-emerald-300 text-[9px]">({groupInfo.members.length} Mhs)</span>
                    )}
                  </div>
                </div>
              </button>
            )}

            {/* Lampiran Gambar Action Button */}
            {onOpenLampiran && (
              <button
                id="btn-open-lampiran"
                onClick={onOpenLampiran}
                className="flex items-center gap-1.5 text-xs bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 rounded-xl px-2.5 py-1.5 transition-all cursor-pointer active:scale-95"
                title="Kelola Lampiran Gambar & Foto Dokumentasi Riset PAI"
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-semibold">Lampiran Gambar</span>
                <span className="bg-amber-400 text-slate-950 font-bold text-[9px] px-1.5 py-0.2 rounded-full">
                  {attachmentCount}
                </span>
              </button>
            )}

            {dataCount > 0 && (
              <div className="flex items-center gap-3 text-xs bg-emerald-900/80 border border-emerald-700/50 rounded-xl px-3 py-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-300">N:</span>
                  <span className="font-bold text-white">{dataCount}</span>
                </div>
                <div className="w-px h-3.5 bg-emerald-700/60" />
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-300">Mean:</span>
                  <span className="font-bold text-white">{mean.toFixed(1)}</span>
                </div>
                <div className="w-px h-3.5 bg-emerald-700/60" />
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-300">SD:</span>
                  <span className="font-bold text-white">{stdDev.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto scrollbar-thin py-1 border-t border-emerald-900/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-btn-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-500/40"
                    : "text-emerald-200/80 hover:text-white hover:bg-emerald-900/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-200" : "text-emerald-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
