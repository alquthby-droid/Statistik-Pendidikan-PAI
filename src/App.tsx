import React, { useState, useMemo } from "react";
import { Header } from "./components/Header";
import { PhotoUploadSection } from "./components/PhotoUploadSection";
import { DispersiSebaranView } from "./components/DispersiSebaranView";
import { DistribusiFrekuensiView } from "./components/DistribusiFrekuensiView";
import { ZScoreView } from "./components/ZScoreView";
import { GrafikView } from "./components/GrafikView";
import { LaporanAkademikView } from "./components/LaporanAkademikView";
import { PresentationView } from "./components/PresentationView";
import { GroupConfigModal } from "./components/GroupConfigModal";
import { LampiranGambarModal } from "./components/LampiranGambarModal";
import { PRESET_DATASETS } from "./data/presets";
import { DEFAULT_GROUP_INFO } from "./data/institutions";
import {
  calculateDescriptiveStats,
  calculateSturges,
  generateFrequencyDistribution,
  calculateZScores,
} from "./utils/statistics";
import { DataRow, GroupAssignmentInfo } from "./types";
import { BookOpen, Camera, Presentation, Users, GraduationCap, Image as ImageIcon } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "upload" | "sebaran" | "distribusi" | "zscore" | "grafik" | "laporan" | "ppt"
  >("upload");

  // Group Assignment & Institution state with local persistence
  const [groupInfo, setGroupInfo] = useState<GroupAssignmentInfo>(() => {
    try {
      const saved = localStorage.getItem("s2_pai_group_info");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.institutionName && parsed.institutionName.includes("Al-Jihad")) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load saved group info:", e);
    }
    return DEFAULT_GROUP_INFO;
  });

  const [isGroupModalOpen, setIsGroupModalOpen] = useState<boolean>(false);
  const [isLampiranModalOpen, setIsLampiranModalOpen] = useState<boolean>(false);

  const handleSaveGroupInfo = (newInfo: GroupAssignmentInfo) => {
    setGroupInfo(newInfo);
    try {
      localStorage.setItem("s2_pai_group_info", JSON.stringify(newInfo));
    } catch (e) {
      console.warn("Failed to persist group info:", e);
    }
  };

  // Default to first realistic S2 PAI dataset so the user immediately sees all features working
  const [dataTitle, setDataTitle] = useState<string>(PRESET_DATASETS[0].title);
  const [variableName, setVariableName] = useState<string>(PRESET_DATASETS[0].variableName);
  const [dataRows, setDataRows] = useState<DataRow[]>(PRESET_DATASETS[0].rows);

  // Extract raw numeric scores array
  const scores = useMemo(() => {
    return dataRows.map((r) => r.score).filter((s) => !isNaN(s));
  }, [dataRows]);

  // Compute all descriptive statistics (Sebaran)
  const stats = useMemo(() => {
    return calculateDescriptiveStats(scores);
  }, [scores]);

  // Compute Sturges Formula (Distribusi)
  const sturges = useMemo(() => {
    if (!stats || stats.count === 0) return null;
    return calculateSturges(stats.count, stats.range);
  }, [stats]);

  // Compute Grouped Frequency Distribution Table (Distribusi)
  const frequencyClasses = useMemo(() => {
    if (!stats || !sturges || stats.count === 0) return [];
    return generateFrequencyDistribution(
      scores,
      stats.min,
      sturges.k,
      sturges.c,
      stats.mean
    );
  }, [scores, stats, sturges]);

  // Compute Z-Scores & T-Scores (Z-Score)
  const zScores = useMemo(() => {
    if (!stats || stats.count === 0) return [];
    return calculateZScores(dataRows, stats.mean, stats.stdDevSample);
  }, [dataRows, stats]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950 print:bg-white print:min-h-0 print:p-0">
      {/* Top Academic Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dataCount={dataRows.length}
        mean={stats?.mean || 0}
        stdDev={stats?.stdDevSample || 0}
        groupInfo={groupInfo}
        onOpenGroupConfig={() => setIsGroupModalOpen(true)}
        onOpenLampiran={() => setIsLampiranModalOpen(true)}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 print:p-0 print:max-w-none print:w-full">
        {/* Course Syllabus Context Pill */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:px-4 rounded-xl border border-slate-200 shadow-2xs print:hidden">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500">Mata Kuliah:</span>
            <span className="font-bold text-slate-900">Statistik Pendidikan S2 PAI</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Topik Silabus:</span>
            <div className="flex items-center gap-1.5 font-medium">
              <button
                onClick={() => setActiveTab("sebaran")}
                className="text-emerald-700 hover:underline"
              >
                Sebaran
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab("distribusi")}
                className="text-emerald-700 hover:underline"
              >
                Distribusi
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab("zscore")}
                className="text-emerald-700 hover:underline"
              >
                Z-Score
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab("grafik")}
                className="text-emerald-700 hover:underline"
              >
                Grafik
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab("ppt")}
                className="text-emerald-700 hover:underline font-bold text-amber-800"
              >
                Slide PPT
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGroupModalOpen(true)}
              className="text-xs px-2.5 py-1 bg-emerald-100/80 hover:bg-emerald-200 text-emerald-950 font-semibold rounded-lg border border-emerald-300 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              title="Atur Nama Perguruan Tinggi, Kelompok, dan Anggota Mahasiswa"
            >
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              <span>{groupInfo.isGroupAssignment ? groupInfo.groupName : "Tugas Kelompok / Kampus"}</span>
            </button>
            <button
              onClick={() => setIsLampiranModalOpen(true)}
              className="text-xs px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold rounded-lg border border-amber-300 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Kelola Lampiran Foto Dokumentasi & Logo Kampus"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
              <span>Lampiran Gambar ({groupInfo.attachments?.length || 1})</span>
            </button>
            <button
              onClick={() => setActiveTab("ppt")}
              className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Presentation className="w-3.5 h-3.5 text-slate-700" />
              <span>Buka Slide PPT (.pptx)</span>
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className="text-xs px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg border border-emerald-200 flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-700" />
              <span>Unggah Foto Nilai Baru</span>
            </button>
          </div>
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === "upload" && (
          <PhotoUploadSection
            dataTitle={dataTitle}
            setDataTitle={setDataTitle}
            variableName={variableName}
            setVariableName={setVariableName}
            dataRows={dataRows}
            setDataRows={setDataRows}
            onProceedToAnalysis={() => setActiveTab("sebaran")}
          />
        )}

        {activeTab === "sebaran" && (
          <DispersiSebaranView
            stats={stats}
            dataTitle={dataTitle}
            variableName={variableName}
            dataRows={dataRows}
          />
        )}

        {activeTab === "distribusi" && (
          <DistribusiFrekuensiView
            stats={stats}
            sturges={sturges}
            frequencyClasses={frequencyClasses}
            scores={scores}
            variableName={variableName}
            dataTitle={dataTitle}
          />
        )}

        {activeTab === "zscore" && (
          <ZScoreView
            zScores={zScores}
            stats={stats}
            variableName={variableName}
            dataTitle={dataTitle}
          />
        )}

        {activeTab === "grafik" && (
          <GrafikView
            stats={stats}
            frequencyClasses={frequencyClasses}
            zScores={zScores}
            variableName={variableName}
          />
        )}

        {activeTab === "laporan" && (
          <LaporanAkademikView
            stats={stats}
            sturges={sturges}
            frequencyClasses={frequencyClasses}
            zScores={zScores}
            dataTitle={dataTitle}
            variableName={variableName}
            groupInfo={groupInfo}
            onOpenGroupConfig={() => setIsGroupModalOpen(true)}
            onUpdateGroupInfo={handleSaveGroupInfo}
          />
        )}

        {activeTab === "ppt" && stats && sturges && (
          <PresentationView
            stats={stats}
            sturges={sturges}
            frequencyClasses={frequencyClasses}
            zScores={zScores}
            variableName={variableName}
            dataTitle={dataTitle}
            groupInfo={groupInfo}
            onOpenGroupConfig={() => setIsGroupModalOpen(true)}
          />
        )}
      </main>

      {/* Modal: Identitas Tugas Kelompok & Perguruan Tinggi */}
      <GroupConfigModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        groupInfo={groupInfo}
        onSave={handleSaveGroupInfo}
      />

      {/* Modal: Lampiran Dokumentasi Gambar & Logo */}
      <LampiranGambarModal
        isOpen={isLampiranModalOpen}
        onClose={() => setIsLampiranModalOpen(false)}
        attachments={groupInfo.attachments || []}
        logoUrl={groupInfo.logoUrl}
        institutionName={groupInfo.institutionName}
        onSave={(newAttachments, newLogoUrl) => {
          handleSaveGroupInfo({
            ...groupInfo,
            attachments: newAttachments,
            logoUrl: newLogoUrl,
          });
        }}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-medium text-slate-700">Aplikasi Statistik Pendidikan S2 PAI (Magister Pendidikan Agama Islam)</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-900 shadow-2xs">
              <span className="text-emerald-700 font-medium text-[11px]">Pengembang Aplikasi:</span>
              <strong className="text-emerald-950 font-bold text-xs">Husni, S.Kom.I</strong>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:inline">
              Materi: Sebaran • Distribusi Sturges • Z-Score • Visualisasi Grafik
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
