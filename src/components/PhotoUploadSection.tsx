import React, { useState, useRef } from "react";
import {
  Upload,
  Camera,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  FileText,
  HelpCircle,
  Sliders,
} from "lucide-react";
import { DataRow } from "../types";
import { PRESET_DATASETS } from "../data/presets";

interface PhotoUploadSectionProps {
  dataTitle: string;
  setDataTitle: (val: string) => void;
  variableName: string;
  setVariableName: (val: string) => void;
  dataRows: DataRow[];
  setDataRows: (rows: DataRow[]) => void;
  onProceedToAnalysis: () => void;
}

export const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  dataTitle,
  setDataTitle,
  variableName,
  setVariableName,
  dataRows,
  setDataRows,
  onProceedToAnalysis,
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>("");
  const [photoMimeType, setPhotoMimeType] = useState<string>("image/jpeg");
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractSuccess, setExtractSuccess] = useState<string | null>(null);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  const [pasteModalOpen, setPasteModalOpen] = useState<boolean>(false);
  const [rawPasteText, setRawPasteText] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Handle Photo Selection
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setExtractError("Harap pilih file gambar (JPG, PNG, atau WEBP).");
      return;
    }

    setPhotoFileName(file.name);
    setPhotoMimeType(file.type);
    setExtractError(null);
    setExtractSuccess(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPhotoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Trigger AI OCR extraction via Express Gemini API
  const handleExtractWithAI = async () => {
    if (!photoPreview) {
      setExtractError("Silakan pilih atau unggah foto lembar data/nilai terlebih dahulu.");
      return;
    }

    setIsExtracting(true);
    setExtractError(null);
    setExtractSuccess(null);

    try {
      const response = await fetch("/api/extract-photo-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: photoPreview,
          mimeType: photoMimeType,
          fileName: photoFileName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const resData = await response.json();

      if (resData.items && Array.isArray(resData.items) && resData.items.length > 0) {
        const mappedRows: DataRow[] = resData.items.map((it: any, idx: number) => ({
          id: it.id || idx + 1,
          label: it.label || `Responden ${idx + 1}`,
          score: Number(it.score) || 0,
          note: it.note || "",
        }));

        setDataRows(mappedRows);
        if (resData.title) setDataTitle(resData.title);
        if (resData.variableName) setVariableName(resData.variableName);

        setExtractSuccess(
          `Berhasil mengekstrak ${mappedRows.length} data angka dari foto dengan AI! Silakan tinjau tabel di bawah.`
        );
      } else {
        throw new Error("AI tidak mendeteksi tabel atau angka pada foto ini.");
      }
    } catch (err: any) {
      console.error(err);
      setExtractError(
        "Terjadi kendala saat membaca foto: " +
          (err?.message || "Format foto belum jelas. Anda tetap bisa memasukkan angka secara manual atau muat contoh data.")
      );
    } finally {
      setIsExtracting(false);
    }
  };

  // Quick Preset Loader
  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_DATASETS.find((p) => p.id === presetId);
    if (preset) {
      setDataTitle(preset.title);
      setVariableName(preset.variableName);
      setDataRows([...preset.rows]);
      setExtractSuccess(`Contoh data "${preset.title}" berhasil dimuat (${preset.rows.length} data).`);
      setExtractError(null);
    }
  };

  // Add Single Row
  const handleAddRow = () => {
    const nextId = dataRows.length > 0 ? Math.max(...dataRows.map((r) => r.id)) + 1 : 1;
    setDataRows([
      ...dataRows,
      {
        id: nextId,
        label: `Responden ${nextId}`,
        score: 80,
      },
    ]);
  };

  // Delete Row
  const handleDeleteRow = (id: number) => {
    setDataRows(dataRows.filter((r) => r.id !== id));
  };

  // Update Row
  const handleUpdateRow = (id: number, field: "label" | "score", value: any) => {
    setDataRows(
      dataRows.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            [field]: field === "score" ? Number(value) || 0 : value,
          };
        }
        return r;
      })
    );
  };

  // Parse Raw Paste Text
  const handleParsePasteText = () => {
    if (!rawPasteText.trim()) return;

    const tokens = rawPasteText
      .split(/[\n,;\t ]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const numericScores: number[] = [];
    tokens.forEach((token) => {
      const num = Number(token.replace(",", "."));
      if (!isNaN(num)) {
        numericScores.push(num);
      }
    });

    if (numericScores.length === 0) {
      setExtractError("Tidak ditemukan angka valid pada teks yang ditempel.");
      return;
    }

    const newRows: DataRow[] = numericScores.map((score, idx) => ({
      id: idx + 1,
      label: `Siswa ${idx + 1 < 10 ? "0" + (idx + 1) : idx + 1}`,
      score,
    }));

    setDataRows(newRows);
    setPasteModalOpen(false);
    setRawPasteText("");
    setExtractSuccess(`Berhasil mengimpor ${newRows.length} data angka.`);
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <Camera className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-800">
                Fitur Unggah File Foto & Input Data Statistik PAI
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Foto lembar daftar nilai ujian, angket skala Likert, atau rekapitulasi data penelitian mahasiswa S2 PAI.
              Sistem akan membaca angka secara otomatis dengan AI Gemini Vision untuk dianalisis pada modul:{" "}
              <strong className="text-emerald-700">Sebaran, Distribusi Frekuensi, Z-Score, dan Grafik</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500">Muat Contoh Data S2 PAI:</span>
            {PRESET_DATASETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset.id)}
                className="text-xs px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium rounded-lg border border-emerald-200 transition-colors"
              >
                {preset.title.split("(")[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Zone & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Upload Dropzone */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center min-h-[260px] transition-all ${
                photoPreview
                  ? "border-emerald-400 bg-emerald-50/20"
                  : "border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/10"
              }`}
            >
              {photoPreview ? (
                <div className="w-full flex flex-col items-center">
                  <div className="relative group max-w-[280px] max-h-[180px] rounded-xl overflow-hidden shadow-md border border-emerald-200 bg-black">
                    <img
                      src={photoPreview}
                      alt="Unggahan Foto Data"
                      className="w-full h-full object-contain max-h-[170px]"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setIsZoomOpen(true)}
                        className="p-1.5 bg-white text-slate-800 rounded-lg shadow hover:bg-slate-100 text-xs font-medium flex items-center gap-1"
                        title="Lihat Penuh"
                      >
                        <Eye className="w-4 h-4" /> Perbesar
                      </button>
                      <button
                        onClick={() => {
                          setPhotoPreview(null);
                          setPhotoFileName("");
                        }}
                        className="p-1.5 bg-rose-600 text-white rounded-lg shadow hover:bg-rose-700 text-xs font-medium"
                        title="Hapus Foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-slate-700 mt-2 truncate max-w-[240px]">
                    📄 {photoFileName || "Foto Terpilih"}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleExtractWithAI}
                      disabled={isExtracting}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
                    >
                      {isExtracting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Mengekstrak Data AI...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-emerald-200" />
                          <span>Ekstrak Data Nilai dengan AI</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl"
                    >
                      Ganti Foto
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-3 shadow-inner">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-800">
                    Tarik & Letakkan Foto Data di Sini
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Mendukung format JPG, PNG, atau WEBP. Cocok untuk foto lembar jawaban ujian PAI, tabel nilai siswa, atau kuisioner angket.
                  </p>

                  <div className="flex items-center gap-2 mt-4">
                    <button
                      id="upload-photo-btn"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Pilih dari Galeri/File
                    </button>

                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-xl transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      Ambil Foto Kamera
                    </button>
                  </div>
                </>
              )}

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
            </div>

            {/* Notification Messages */}
            {extractSuccess && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>{extractSuccess}</div>
              </div>
            )}
            {extractError && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>{extractError}</div>
              </div>
            )}
          </div>

          {/* Dataset Meta & Quick Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Informasi Mata Kuliah & Variabel Penelitian
              </h4>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Judul Data / Mata Kuliah:
                </label>
                <input
                  type="text"
                  value={dataTitle}
                  onChange={(e) => setDataTitle(e.target.value)}
                  placeholder="Contoh: Nilai Ujian Semester Fiqih Muamalah S2 PAI"
                  className="w-full text-sm px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Variabel Statistik:
                </label>
                <input
                  type="text"
                  value={variableName}
                  onChange={(e) => setVariableName(e.target.value)}
                  placeholder="Contoh: Hasil Belajar Fiqih Muamalah"
                  className="w-full text-sm px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => setPasteModalOpen(true)}
                  className="text-xs px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-200 flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Tempel Angka (Paste Raw Scores)
                </button>
                <button
                  onClick={() => {
                    if (confirm("Kosongkan semua data angka dalam tabel?")) {
                      setDataRows([]);
                    }
                  }}
                  className="text-xs px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 font-medium rounded-lg border border-slate-200 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  Kosongkan Tabel
                </button>
              </div>
            </div>

            {/* Quick summary & Proceed button */}
            <div className="bg-emerald-900 text-white p-4 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-200">Jumlah Data Aktif:</p>
                <p className="text-2xl font-black text-white">{dataRows.length} <span className="text-xs font-normal text-emerald-300">responden</span></p>
              </div>

              <button
                id="proceed-to-analysis-btn"
                onClick={onProceedToAnalysis}
                disabled={dataRows.length === 0}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm rounded-xl shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Mulai Analisis Statistik &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Data Table Preview & Editor */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                Tabel Data Skor Responden ({dataRows.length} Data)
              </h3>
              <p className="text-xs text-slate-500">
                Data di bawah siap diproses untuk Sebaran, Distribusi Frekuensi, Z-Score, dan Grafik. Anda dapat mengubah nilai secara langsung.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddRow}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Baris
              </button>
            </div>
          </div>

          {dataRows.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">Belum ada data nilai</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Unggah foto tabel nilai, tempel angka, atau klik tombol "Muat Contoh Data" di atas.
              </p>
            </div>
          ) : (
            <div className="max-h-[360px] overflow-y-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2.5 w-16 text-center">No</th>
                    <th className="px-3 py-2.5">Nama / Identitas Responden</th>
                    <th className="px-3 py-2.5 w-32">Skor / Nilai (X)</th>
                    <th className="px-3 py-2.5 w-40">Catatan</th>
                    <th className="px-3 py-2.5 w-16 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {dataRows.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-3 py-2 text-center text-slate-400 font-mono text-xs">
                        {idx + 1}
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="text"
                          value={row.label}
                          onChange={(e) => handleUpdateRow(row.id, "label", e.target.value)}
                          className="w-full text-xs sm:text-sm px-2 py-1 border border-transparent hover:border-slate-200 focus:border-emerald-500 rounded bg-transparent focus:bg-white"
                        />
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="number"
                          step="any"
                          value={row.score}
                          onChange={(e) => handleUpdateRow(row.id, "score", e.target.value)}
                          className="w-full font-mono font-bold text-emerald-800 text-xs sm:text-sm px-2 py-1 border border-transparent hover:border-slate-200 focus:border-emerald-500 rounded bg-transparent focus:bg-white"
                        />
                      </td>
                      <td className="px-3 py-1.5 text-xs text-slate-500">
                        {row.note || "-"}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => handleDeleteRow(row.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                          title="Hapus baris"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Zoom Photo */}
      {isZoomOpen && photoPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-sm font-semibold">{photoFileName || "Pratinjau Foto Data"}</span>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="p-1 text-slate-300 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 overflow-auto max-h-[80vh] flex items-center justify-center bg-slate-950">
              <img src={photoPreview} alt="Zoom" className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Modal Paste Raw Scores */}
      {pasteModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">
                Tempel Angka / Raw Scores
              </h3>
              <button
                onClick={() => setPasteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Tempel deretan angka dipisahkan dengan koma, spasi, atau baris baru (contoh dari Excel atau catatan):
            </p>

            <textarea
              rows={6}
              value={rawPasteText}
              onChange={(e) => setRawPasteText(e.target.value)}
              placeholder="Contoh: 78, 85, 92, 64, 70, 88, 75, 82, 95, 68..."
              className="w-full text-xs font-mono p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPasteModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleParsePasteText}
                className="px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm"
              >
                Impor Data Angka
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
