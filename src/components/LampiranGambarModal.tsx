import React, { useState, useRef } from "react";
import { ResearchAttachment } from "../types";
import { LOGO_IAI_ALJIHAD_DATA_URI } from "../assets/logoIaiAlJihad";
import { LOGO_IAI_ASA_DATA_URI } from "../assets/logoIaiAsa";
import { IAI_ALJIHAD_LECTURERS, DAFTAR_DOSEN_DOCUMENT_DATA_URI } from "../data/institutions";
import {
  Camera,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  X,
  Check,
  Calendar,
  Tag,
  FileText,
  Sparkles,
  Eye,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
} from "lucide-react";

interface LampiranGambarModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachments: ResearchAttachment[];
  onSaveAttachments?: (updated: ResearchAttachment[]) => void;
  onSave?: (updated: ResearchAttachment[], logoUrl?: string) => void;
  onSetAsLogo?: (logoUrl: string) => void;
  institutionName?: string;
  logoUrl?: string;
}

export const LampiranGambarModal: React.FC<LampiranGambarModalProps> = ({
  isOpen,
  onClose,
  attachments,
  onSaveAttachments,
  onSave,
  onSetAsLogo,
  institutionName = "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
  logoUrl,
}) => {
  const [items, setItems] = useState<ResearchAttachment[]>(attachments);
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | undefined>(logoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if modal reopens
  React.useEffect(() => {
    setItems(attachments);
  }, [attachments, isOpen]);

  React.useEffect(() => {
    setCurrentLogoUrl(logoUrl);
  }, [logoUrl]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach((file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Harap pilih berkas foto/gambar (PNG, JPG, JPEG, WEBP).");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const newAtt: ResearchAttachment = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
            url: result,
            title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            category: "Dokumentasi Pembelajaran PAI",
            date: new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            notes: "Dokumentasi autentik pengumpulan data instrumen evaluasi pembelajaran PAI.",
            fileSize: (file.size / 1024).toFixed(1) + " KB",
          };

          setItems((prev) => [newAtt, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    });

    showToast("Foto lampiran berhasil diunggah!");
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleUpdate = (id: string, field: keyof ResearchAttachment, val: any) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: val } : it))
    );
  };

  const handleAddDefaultSample = () => {
    const sample1: ResearchAttachment = {
      id: `samp-${Date.now()}`,
      url: LOGO_IAI_ALJIHAD_DATA_URI,
      title: "Emblem Resmi IAI Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
      category: "Surat Pengantar & SK",
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      notes: `Logo resmi ${institutionName} untuk lembar pengesahan instrumen evaluasi dan tesis Magister PAI.`,
      fileSize: "14.8 KB",
    };

    setItems((prev) => [sample1, ...prev]);
    showToast("Emblem resmi IAI Al-Jihad Shalahuddin Al-Ayyubi berhasil ditambahkan ke lampiran!");
  };

  const handleAddDosenDocument = () => {
    const sampleDosen: ResearchAttachment = {
      id: `att-dosen-${Date.now()}`,
      url: DAFTAR_DOSEN_DOCUMENT_DATA_URI,
      title: "Dokumen Resmi: DAFTAR NAMA DOSEN/KODE DOSEN (KD)",
      category: "Surat Pengantar & SK",
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      notes: "Daftar resmi nama dan kode dosen (KD 01 s/d KD 07) Program Pascasarjana Magister PAI Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta.",
      fileSize: "18.4 KB",
    };

    setItems((prev) => [sampleDosen, ...prev]);
    showToast("Dokumen resmi Daftar Nama Dosen (KD 01 - KD 07) berhasil ditambahkan ke lampiran!");
  };

  const handleSave = () => {
    if (onSave) {
      onSave(items, currentLogoUrl);
    } else if (onSaveAttachments) {
      onSaveAttachments(items);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950 to-emerald-900 text-white flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shadow-inner">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Lampiran Gambar & Foto Dokumentasi Penelitian PAI
              </h2>
              <p className="text-xs text-emerald-300">
                Kelola foto bukti instrumen, observasi kelas, dan logo resmi lembaga untuk laporan PDF
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/80 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar & Notification */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah Foto Baru</span>
            </button>
            <button
              onClick={handleAddDosenDocument}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold text-xs transition-colors cursor-pointer active:scale-95"
              title="Tambahkan dokumen resmi daftar 7 dosen pengampu ke lampiran gambar"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>+ Dokumen Daftar Dosen (KD 01-07)</span>
            </button>
            <button
              onClick={handleAddDefaultSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>+ Logo IAI Al-Jihad</span>
            </button>
          </div>

          <div className="text-xs text-slate-500">
            Total Lampiran: <strong className="text-slate-900">{items.length} Berkas</strong>
          </div>
        </div>

        {/* Toast Notification */}
        {notification && (
          <div className="mx-6 mt-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Modal Body: Attachment Cards List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {items.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 p-6">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 text-sm">Belum Ada Lampiran Foto / Gambar</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Unggah foto dokumentasi observasi kelas, lembar instrumen angket, soal tes PAI, atau surat penelitian untuk dilampirkan pada laporan resmi PDF.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Pilih Foto Sekarang</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div
                      className="w-24 h-24 rounded-lg bg-slate-100 border border-slate-200 shrink-0 overflow-hidden relative group cursor-pointer"
                      onClick={() => setActivePreview(item.url)}
                      title="Klik untuk perbesar foto"
                    >
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-contain p-1"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Metadata Inputs */}
                    <div className="flex-1 space-y-2 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                          Judul / Keterangan Gambar *
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdate(item.id, "title", e.target.value)}
                          placeholder="Judul foto lampiran..."
                          className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                            Kategori
                          </label>
                          <select
                            value={item.category}
                            onChange={(e) => handleUpdate(item.id, "category", e.target.value)}
                            className="w-full text-[11px] px-2 py-1 bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:bg-white focus:outline-hidden"
                          >
                            <option value="Dokumentasi Pembelajaran PAI">Dokumentasi Pembelajaran</option>
                            <option value="Instrumen Tes / Angket">Instrumen Tes / Angket</option>
                            <option value="Observasi Kelas">Observasi Kelas</option>
                            <option value="Rubrik Penilaian">Rubrik Penilaian</option>
                            <option value="Surat Pengantar & SK">Surat / SK Lembaga</option>
                            <option value="Lainnya">Lainnya</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                            Tanggal
                          </label>
                          <input
                            type="text"
                            value={item.date || ""}
                            onChange={(e) => handleUpdate(item.id, "date", e.target.value)}
                            placeholder="Tanggal foto..."
                            className="w-full text-[11px] px-2 py-1 bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:bg-white focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes & Actions */}
                  <div className="space-y-2 border-t border-slate-100 pt-2">
                    <input
                      type="text"
                      value={item.notes || ""}
                      onChange={(e) => handleUpdate(item.id, "notes", e.target.value)}
                      placeholder="Catatan konteks / deskripsi singkat..."
                      className="w-full text-[11px] px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-600 focus:bg-white focus:outline-hidden italic"
                    />

                    <div className="flex items-center justify-between text-xs pt-1">
                      {onSetAsLogo && (
                        <button
                          type="button"
                          onClick={() => {
                            onSetAsLogo(item.url);
                            showToast("Logo kampus berhasil diperbarui dari foto ini!");
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-900 font-medium cursor-pointer"
                          title="Gunakan gambar ini sebagai logo perguruan tinggi di Kop Surat"
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>Jadikan Logo Kampus</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-800 font-medium ml-auto cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500">
            Foto lampiran secara otomatis dicetak pada <strong>Halaman 6 (Lampiran Dokumentasi)</strong> Dokumen Laporan PDF.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-900/20 transition-all cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Lampiran</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Zoom */}
      {activePreview && (
        <div
          className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setActivePreview(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl p-2 shadow-2xl overflow-hidden">
            <button
              onClick={() => setActivePreview(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={activePreview}
              alt="Zoom Preview"
              className="max-h-[85vh] max-w-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
