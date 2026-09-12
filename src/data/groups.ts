import { GroupAssignmentInfo, GroupMember } from "../types";
import { LOGO_IAI_ALJIHAD_DATA_URI } from "../assets/logoIaiAlJihad";
import { DAFTAR_DOSEN_DOCUMENT_DATA_URI } from "./lecturers";
import { IAI_ALJIHAD_SEMESTER_1_STUDENTS } from "./students";
import { DAFTAR_KELOMPOK_MAKALAH_DOCUMENT_DATA_URI } from "./makalahSevenGroups";

export interface SixGroupDefinition {
  groupNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  roman: "I" | "II" | "III" | "IV" | "V" | "VI" | "VII";
  groupName: string;
  subTitle: string;
  topic: string;
  leader: string;
  members: GroupMember[];
  lecturer: string;
  lecturerNip: string;
  groupInfo: GroupAssignmentInfo;
}

export type SevenGroupDefinition = SixGroupDefinition;

const COMMON_ATTACHMENTS = [
  {
    id: "att-jadwal-makalah",
    url: DAFTAR_KELOMPOK_MAKALAH_DOCUMENT_DATA_URI,
    title: "Dokumen Resmi: Jadwal & Pembagian 7 Kelompok Makalah Pascasarjana IAI ASA 2026",
    category: "Surat Pengantar & SK" as const,
    date: "12 September 2026",
    notes: "Daftar resmi pembagian 7 kelompok makalah dan jadwal presentasi perkuliahan ke-2 s/d ke-10 mata kuliah Statistika Pendidikan Pascasarjana IAI ASA. Dosen Pengampu: Dr. Isti Nurhayati, M.Pd.",
    fileSize: "24.6 KB",
  },
  {
    id: "att-dosen",
    url: DAFTAR_DOSEN_DOCUMENT_DATA_URI,
    title: "Dokumen Resmi: Daftar Nama Dosen / Kode Dosen (KD)",
    category: "Surat Pengantar & SK" as const,
    date: "10 September 2025",
    notes: "Daftar resmi nama dan kode dosen (KD 01 - KD 07) Program Pascasarjana Magister PAI IAI Al-Jihad Shalahuddin Al-Ayyubi Jakarta.",
    fileSize: "18.4 KB",
  },
  {
    id: "att-1",
    url: LOGO_IAI_ALJIHAD_DATA_URI,
    title: "Logo Resmi IAI Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
    category: "Dokumentasi Pembelajaran PAI" as const,
    date: "10 September 2025",
    notes: "Identitas resmi Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta untuk lembar pengesahan, instrumen evaluasi PAI, dan lampiran laporan.",
    fileSize: "14.8 KB",
  },
];

export const IAI_ALJIHAD_SIX_GROUPS_DEFINITIONS: SixGroupDefinition[] = [
  // ==========================================
  // KELOMPOK I: No. 1 - 5 (5 Mahasiswa)
  // ==========================================
  {
    groupNumber: 1,
    roman: "I",
    groupName: "Kelompok I (Satu)",
    subTitle: "Analisis Distribusi Frekuensi Aturan Sturges & Sebaran Nilai PAI",
    topic: "Analisis Pola Sebaran Data & Distribusi Frekuensi Skor Evaluasi Pembelajaran PAI",
    leader: "Nurul Aulia",
    lecturer: "Dr. Aang Darsono, S.Ag., M.Pd.I",
    lecturerNip: "KD-04",
    members: [
      {
        id: "1",
        name: "Nurul Aulia",
        nim: "25286130001",
        role: "Ketua Kelompok & Analis Aturan Sturges",
      },
      {
        id: "2",
        name: "Muhammad Sulistiaji",
        nim: "25286130002",
        role: "Analis Dispersi & Standarisasi Z-Score",
      },
      {
        id: "3",
        name: "MOH HUDRI",
        nim: "25286130003",
        role: "Visualisasi Grafik Histogram & Boxplot",
      },
      {
        id: "4",
        name: "Mahbub Hasby",
        nim: "25286130004",
        role: "Penyusun Naskah Laporan Akademik & Tesis",
      },
      {
        id: "5",
        name: "Sugiarto",
        nim: "25286130005",
        role: "Verifikator Instrumen Evaluasi & Presensi",
      },
    ],
    groupInfo: {
      isGroupAssignment: true,
      institutionName: "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
      faculty: "Fakultas Tarbiyah / Program Pascasarjana",
      studyProgram: "Magister (S2) Pendidikan Agama Islam",
      courseName: "Statistik Pendidikan & Evaluasi Pembelajaran PAI",
      groupName: "Kelompok I (Satu)",
      lecturer: "Dr. Aang Darsono, S.Ag., M.Pd.I",
      lecturerNip: "KD-04",
      academicYear: "Tahun Akademik 2025 Genap",
      logoUrl: LOGO_IAI_ALJIHAD_DATA_URI,
      members: [
        {
          id: "1",
          name: "Nurul Aulia",
          nim: "25286130001",
          role: "Ketua Kelompok & Analis Aturan Sturges",
        },
        {
          id: "2",
          name: "Muhammad Sulistiaji",
          nim: "25286130002",
          role: "Analis Dispersi & Standarisasi Z-Score",
        },
        {
          id: "3",
          name: "MOH HUDRI",
          nim: "25286130003",
          role: "Visualisasi Grafik Histogram & Boxplot",
        },
        {
          id: "4",
          name: "Mahbub Hasby",
          nim: "25286130004",
          role: "Penyusun Naskah Laporan Akademik & Tesis",
        },
        {
          id: "5",
          name: "Sugiarto",
          nim: "25286130005",
          role: "Verifikator Instrumen Evaluasi & Presensi",
        },
      ],
      attachments: COMMON_ATTACHMENTS,
    },
  },

  // ==========================================
  // KELOMPOK II: No. 6 - 10 (5 Mahasiswa)
  // ==========================================
  {
    groupNumber: 2,
    roman: "II",
    groupName: "Kelompok II (Dua)",
    subTitle: "Ukuran Pemusatan (Mean, Median, Modus) & Poligon Frekuensi PAI",
    topic: "Karakteristik Tendensi Sentral & Skewness Data Prestasi Belajar Pendidikan Agama Islam",
    leader: "Taupik Hidayat",
    lecturer: "Dr. Aang Darsono, S.Ag., M.Pd.I",
    lecturerNip: "KD-04",
    members: [
      {
        id: "6",
        name: "Taupik Hidayat",
        nim: "25286130006",
        role: "Ketua Kelompok & Analis Tendensi Sentral",
      },
      {
        id: "7",
        name: "Siti Khumairoh",
        nim: "25286130007",
        role: "Analis Median, Modus & Kemiringan (Skewness)",
      },
      {
        id: "8",
        name: "R Bambang Dwi Minardi",
        nim: "25286130008",
        role: "Visualisasi Poligon Frekuensi & Kurva Mulus",
      },
      {
        id: "9",
        name: "ANDRIANI",
        nim: "25286130009",
        role: "Penyusun Interpretasi Pedagogis & Evaluasi PAI",
      },
      {
        id: "10",
        name: "MIFTAHUDIN",
        nim: "25286130010",
        role: "Verifikator Data Mentah & Presensi Rombel",
      },
    ],
    groupInfo: {
      isGroupAssignment: true,
      institutionName: "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
      faculty: "Fakultas Tarbiyah / Program Pascasarjana",
      studyProgram: "Magister (S2) Pendidikan Agama Islam",
      courseName: "Statistik Pendidikan & Evaluasi Pembelajaran PAI",
      groupName: "Kelompok II (Dua)",
      lecturer: "Dr. Aang Darsono, S.Ag., M.Pd.I",
      lecturerNip: "KD-04",
      academicYear: "Tahun Akademik 2025 Genap",
      logoUrl: LOGO_IAI_ALJIHAD_DATA_URI,
      members: [
        {
          id: "6",
          name: "Taupik Hidayat",
          nim: "25286130006",
          role: "Ketua Kelompok & Analis Tendensi Sentral",
        },
        {
          id: "7",
          name: "Siti Khumairoh",
          nim: "25286130007",
          role: "Analis Median, Modus & Kemiringan (Skewness)",
        },
        {
          id: "8",
          name: "R Bambang Dwi Minardi",
          nim: "25286130008",
          role: "Visualisasi Poligon Frekuensi & Kurva Mulus",
        },
        {
          id: "9",
          name: "ANDRIANI",
          nim: "25286130009",
          role: "Penyusun Interpretasi Pedagogis & Evaluasi PAI",
        },
        {
          id: "10",
          name: "MIFTAHUDIN",
          nim: "25286130010",
          role: "Verifikator Data Mentah & Presensi Rombel",
        },
      ],
      attachments: COMMON_ATTACHMENTS,
    },
  },

  // ==========================================
  // KELOMPOK III: No. 11 - 15 (5 Mahasiswa)
  // ==========================================
  {
    groupNumber: 3,
    roman: "III",
    groupName: "Kelompok III (Tiga)",
    subTitle: "Variabilitas, Standar Deviasi & Varians Skor Hasil Belajar PAI",
    topic: "Tingkat Dispersi dan Homogenitas Skor Evaluasi Pembelajaran Pendidikan Agama Islam",
    leader: "Ahmad Sambudi",
    lecturer: "Dr. Aang Darsono, S.Ag., M.Pd.I",
    lecturerNip: "KD-04",
    members: [
      {
        id: "11",
        name: "Ahmad Sambudi",
        nim: "25286130011",
        role: "Ketua Kelompok & Analis Varians Sampel",
      },
      {
        id: "12",
        name: "Rizky wan Hadi",
        nim: "25286130012",
        role: "Analis Standar Deviasi & Koefisien Variasi (CV)",
      },
      {
        id: "13",
        name: "Imam Kafali",
        nim: "25286130013",
        role: "Visualisasi Kurva Lonjong & Rentang Skor",
      },
      {
        id: "14",
        name: "L.M.SUPRIAL WAHID",
        nim: "25286130014",
        role: "Penyusun Bab Metodologi & Pembahasan Ilmiah",
      },
      {
        id: "15",
        name: "MULIADI",
        nim: "25286130015",
        role: "Verifikator Tabulasi & Standarisasi Nilai PAI",
      },
    ],
    groupInfo: {
      isGroupAssignment: true,
      institutionName: "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
      faculty: "Fakultas Tarbiyah / Program Pascasarjana",
      studyProgram: "Magister (S2) Pendidikan Agama Islam",
      courseName: "Statistik Pendidikan & Evaluasi Pembelajaran PAI",
      groupName: "Kelompok III (Tiga)",
      lecturer: "Dr. Aang Darsono, S.Ag., M.Pd.I",
      lecturerNip: "KD-04",
      academicYear: "Tahun Akademik 2025 Genap",
      logoUrl: LOGO_IAI_ALJIHAD_DATA_URI,
      members: [
        {
          id: "11",
          name: "Ahmad Sambudi",
          nim: "25286130011",
          role: "Ketua Kelompok & Analis Varians Sampel",
        },
        {
          id: "12",
          name: "Rizky wan Hadi",
          nim: "25286130012",
          role: "Analis Standar Deviasi & Koefisien Variasi (CV)",
        },
        {
          id: "13",
          name: "Imam Kafali",
          nim: "25286130013",
          role: "Visualisasi Kurva Lonjong & Rentang Skor",
        },
        {
          id: "14",
          name: "L.M.SUPRIAL WAHID",
          nim: "25286130014",
          role: "Penyusun Bab Metodologi & Pembahasan Ilmiah",
        },
        {
          id: "15",
          name: "MULIADI",
          nim: "25286130015",
          role: "Verifikator Tabulasi & Standarisasi Nilai PAI",
        },
      ],
      attachments: COMMON_ATTACHMENTS,
    },
  },

  // ==========================================
  // KELOMPOK IV: No. 16 - 20 (5 Mahasiswa)
  // ==========================================
  {
    groupNumber: 4,
    roman: "IV",
    groupName: "Kelompok IV (Empat)",
    subTitle: "Kurva Ogive Positif/Negatif & Frekuensi Kumulatif Pembelajaran PAI",
    topic: "Analisis Frekuensi Kumulatif & Ambang Batas Kelulusan Asesmen PAI Berbasis Ogive",
    leader: "Winda Astariyah Fatimah",
    lecturer: "Dr. Aang Darsono, S.Ag., M.Pd.I",
    lecturerNip: "KD-04",
    members: [
      {
        id: "16",
        name: "Winda Astariyah Fatimah",
        nim: "25286130016",
        role: "Ketua Kelompok & Analis Frekuensi Kumulatif",
      },
      {
        id: "17",
        name: "Dewi Purnamasari",
        nim: "25286130017",
        role: "Analis Tepi Kelas & Kumulatif Kurang/Lebih Dari",
      },
      {
        id: "18",
        name: "SITI NAZMIATUL MUSLIMAH",
        nim: "25286130018",
        role: "Visualisasi Kurva Ogive Naik & Ogive Turun",
      },
      {
        id: "19",
        name: "Alya mawardah",
        nim: "25286130019",
        role: "Penyusun Rekomendasi Ketuntasan Klasikal PAI",
      },
      {
        id: "20",
        name: "MULIYONO",
        nim: "25286130020",
        role: "Verifikator Presensi & Validasi Rombel",
      },
    ],
    groupInfo: {
      isGroupAssignment: true,
      institutionName: "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
      faculty: "Fakultas Tarbiyah / Program Pascasarjana",
      studyProgram: "Magister (S2) Pendidikan Agama Islam",
      courseName: "Statistik Pendidikan & Evaluasi Pembelajaran PAI",
      groupName: "Kelompok IV (Empat)",
      lecturer: "Dr. Aang Darsono, S.Ag., M.Pd.I",
      lecturerNip: "KD-04",
      academicYear: "Tahun Akademik 2025 Genap",
      logoUrl: LOGO_IAI_ALJIHAD_DATA_URI,
      members: [
        {
          id: "16",
          name: "Winda Astariyah Fatimah",
          nim: "25286130016",
          role: "Ketua Kelompok & Analis Frekuensi Kumulatif",
        },
        {
          id: "17",
          name: "Dewi Purnamasari",
          nim: "25286130017",
          role: "Analis Tepi Kelas & Kumulatif Kurang/Lebih Dari",
        },
        {
          id: "18",
          name: "SITI NAZMIATUL MUSLIMAH",
          nim: "25286130018",
          role: "Visualisasi Kurva Ogive Naik & Ogive Turun",
        },
        {
          id: "19",
          name: "Alya mawardah",
          nim: "25286130019",
          role: "Penyusun Rekomendasi Ketuntasan Klasikal PAI",
        },
        {
          id: "20",
          name: "MULIYONO",
          nim: "25286130020",
          role: "Verifikator Presensi & Validasi Rombel",
        },
      ],
      attachments: COMMON_ATTACHMENTS,
    },
  },

  // ==========================================
  // KELOMPOK V: No. 21 - 25 (5 Mahasiswa)
  // ==========================================
  {
    groupNumber: 5,
    roman: "V",
    groupName: "Kelompok V (Lima)",
    subTitle: "Standarisasi Skor Baku (Z-Score & T-Score) Evaluasi Tengah Semester PAI",
    topic: "Transformasi Skor Mentah ke Skor Standar (Z & T) untuk Penilaian Berkeadilan PAI",
    leader: "AMIN",
    lecturer: "Dr. Aang Darsono, S.Ag., M.Pd.I",
    lecturerNip: "KD-04",
    members: [
      {
        id: "21",
        name: "AMIN",
        nim: "25286130021",
        role: "Ketua Kelompok & Analis Transformasi Z-Score",
      },
      {
        id: "22",
        name: "Mukhsin",
        nim: "25286130022",
        role: "Analis Konversi T-Score & Skala Standar Nilai",
      },
      {
        id: "23",
        name: "Wiwin winangsih",
        nim: "25286130023",
        role: "Visualisasi Area Kurva Normal Standar (Gauss)",
      },
      {
        id: "24",
        name: "L. Johan Fawaz",
        nim: "25286130024",
        role: "Penyusun Kategori Prestasi (Mumtaz s/d Dha'if)",
      },
      {
        id: "25",
        name: "MISRAJI",
        nim: "25286130025",
        role: "Verifikator Akurasi Formula Deviasi Nilai",
      },
    ],
    groupInfo: {
      isGroupAssignment: true,
      institutionName: "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
      faculty: "Fakultas Tarbiyah / Program Pascasarjana",
      studyProgram: "Magister (S2) Pendidikan Agama Islam",
      courseName: "Statistik Pendidikan & Evaluasi Pembelajaran PAI",
      groupName: "Kelompok V (Lima)",
      lecturer: "Dr. Aang Darsono, S.Ag., M.Pd.I",
      lecturerNip: "KD-04",
      academicYear: "Tahun Akademik 2025 Genap",
      logoUrl: LOGO_IAI_ALJIHAD_DATA_URI,
      members: [
        {
          id: "21",
          name: "AMIN",
          nim: "25286130021",
          role: "Ketua Kelompok & Analis Transformasi Z-Score",
        },
        {
          id: "22",
          name: "Mukhsin",
          nim: "25286130022",
          role: "Analis Konversi T-Score & Skala Standar Nilai",
        },
        {
          id: "23",
          name: "Wiwin winangsih",
          nim: "25286130023",
          role: "Visualisasi Area Kurva Normal Standar (Gauss)",
        },
        {
          id: "24",
          name: "L. Johan Fawaz",
          nim: "25286130024",
          role: "Penyusun Kategori Prestasi (Mumtaz s/d Dha'if)",
        },
        {
          id: "25",
          name: "MISRAJI",
          nim: "25286130025",
          role: "Verifikator Akurasi Formula Deviasi Nilai",
        },
      ],
      attachments: COMMON_ATTACHMENTS,
    },
  },

  // ==========================================
  // KELOMPOK VI: No. 26 - 29 (4 Mahasiswa)
  // ==========================================
  {
    groupNumber: 6,
    roman: "VI",
    groupName: "Kelompok VI (Enam)",
    subTitle: "Kuartil (Q1, Q2, Q3), Interkuartil (IQR) & Deteksi Outlier Boxplot PAI",
    topic: "Analisis Struktur Kuartil, Dispersi Interkuartil & Deteksi Anomali Nilai Evaluasi PAI",
    leader: "Intan Fajri Nurul Ilmi",
    lecturer: "Dr. Aang Darsono, S.Ag., M.Pd.I",
    lecturerNip: "KD-04",
    members: [
      {
        id: "26",
        name: "Intan Fajri Nurul Ilmi",
        nim: "25286130026",
        role: "Ketua Kelompok & Analis Kuartil (Q1, Q2, Q3)",
      },
      {
        id: "27",
        name: "AGUS MULIADI",
        nim: "25286130027",
        role: "Analis Rentang Interkuartil (IQR) & Deviasi Kuartil",
      },
      {
        id: "28",
        name: "HUSNI",
        nim: "25286130028",
        role: "Visualisasi Diagram Kotak-Garis (Boxplot) & Outlier",
      },
      {
        id: "29",
        name: "CHAERUN NAZIRIN",
        nim: "25286130029",
        role: "Penyusun Naskah Sintesis Komparatif & Tesis",
      },
    ],
    groupInfo: {
      isGroupAssignment: true,
      institutionName: "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
      faculty: "Fakultas Tarbiyah / Program Pascasarjana",
      studyProgram: "Magister (S2) Pendidikan Agama Islam",
      courseName: "Statistik Pendidikan & Evaluasi Pembelajaran PAI",
      groupName: "Kelompok VI (Enam)",
      lecturer: "Dr. Aang Darsono, S.Ag., M.Pd.I",
      lecturerNip: "KD-04",
      academicYear: "Tahun Akademik 2025 Genap",
      logoUrl: LOGO_IAI_ALJIHAD_DATA_URI,
      members: [
        {
          id: "26",
          name: "Intan Fajri Nurul Ilmi",
          nim: "25286130026",
          role: "Ketua Kelompok & Analis Kuartil (Q1, Q2, Q3)",
        },
        {
          id: "27",
          name: "AGUS MULIADI",
          nim: "25286130027",
          role: "Analis Rentang Interkuartil (IQR) & Deviasi Kuartil",
        },
        {
          id: "28",
          name: "HUSNI",
          nim: "25286130028",
          role: "Visualisasi Diagram Kotak-Garis (Boxplot) & Outlier",
        },
        {
          id: "29",
          name: "CHAERUN NAZIRIN",
          nim: "25286130029",
          role: "Penyusun Naskah Sintesis Komparatif & Tesis",
        },
      ],
      attachments: COMMON_ATTACHMENTS,
    },
  },

  // ==========================================
  // KELOMPOK VII: (5 Mahasiswa)
  // Sesuai Silabus Jadwal Makalah IAI ASA 2026
  // Dosen Pengampu: Dr. Isti Nurhayati, M.Pd (KD-07)
  // ==========================================
  {
    groupNumber: 7,
    roman: "VII",
    groupName: "Kelompok VII (Tujuh)",
    subTitle: "Uji Hipotesis, Statistical Power & Integrasi Kode Analisis Komputasi PAI",
    topic: "Uji Hipotesis, Nilai p (p-Value), Kesalahan Tipe I & II, Statistical Power dan Integrasi Kode Analisis Komputasi Tesis PAI",
    leader: "Siti Khumairoh",
    lecturer: "Dr. Isti Nurhayati, M.Pd",
    lecturerNip: "KD-07",
    members: [
      {
        id: "7-1",
        name: "Siti Khumairoh",
        nim: "25286130007",
        role: "Ketua Kelompok & Analis Formulasi Hipotesis & Alpha",
      },
      {
        id: "7-2",
        name: "L.M.SUPRIAL WAHID",
        nim: "25286130014",
        role: "Analis Kesalahan Tipe I, Tipe II & Statistical Power",
      },
      {
        id: "7-3",
        name: "Intan Fajri Nurul Ilmi",
        nim: "25286130026",
        role: "Analis Alur Kerja Integrasi Data & Kode Komputasi",
      },
      {
        id: "7-4",
        name: "Mukhsin",
        nim: "25286130022",
        role: "Verifikator Validitas Output Sintaksis & Tabel",
      },
      {
        id: "7-5",
        name: "AGUS MULIADI",
        nim: "25286130027",
        role: "Penyusun Sintesis Luaran & Dokumentasi Ilmiah",
      },
    ],
    groupInfo: {
      isGroupAssignment: true,
      institutionName: "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
      faculty: "Fakultas Tarbiyah / Program Pascasarjana",
      studyProgram: "Magister (S2) Pendidikan Agama Islam",
      courseName: "Statistik Pendidikan & Evaluasi Pembelajaran PAI",
      groupName: "Kelompok VII (Tujuh)",
      lecturer: "Dr. Isti Nurhayati, M.Pd",
      lecturerNip: "KD-07",
      academicYear: "Tahun Akademik 2026 Genap",
      logoUrl: LOGO_IAI_ALJIHAD_DATA_URI,
      members: [
        {
          id: "7-1",
          name: "Siti Khumairoh",
          nim: "25286130007",
          role: "Ketua Kelompok & Analis Formulasi Hipotesis & Alpha",
        },
        {
          id: "7-2",
          name: "L.M.SUPRIAL WAHID",
          nim: "25286130014",
          role: "Analis Kesalahan Tipe I, Tipe II & Statistical Power",
        },
        {
          id: "7-3",
          name: "Intan Fajri Nurul Ilmi",
          nim: "25286130026",
          role: "Analis Alur Kerja Integrasi Data & Kode Komputasi",
        },
        {
          id: "7-4",
          name: "Mukhsin",
          nim: "25286130022",
          role: "Verifikator Validitas Output Sintaksis & Tabel",
        },
        {
          id: "7-5",
          name: "AGUS MULIADI",
          nim: "25286130027",
          role: "Penyusun Sintesis Luaran & Dokumentasi Ilmiah",
        },
      ],
      attachments: COMMON_ATTACHMENTS,
    },
  },
];

export const IAI_ALJIHAD_SEVEN_GROUPS_DEFINITIONS = IAI_ALJIHAD_SIX_GROUPS_DEFINITIONS;

export const IAI_ALJIHAD_SIX_GROUPS: GroupAssignmentInfo[] =
  IAI_ALJIHAD_SIX_GROUPS_DEFINITIONS.map((def) => def.groupInfo);

export const IAI_ALJIHAD_SEVEN_GROUPS: GroupAssignmentInfo[] = IAI_ALJIHAD_SIX_GROUPS;

export function getGroupByNumber(num: number): GroupAssignmentInfo {
  const found = IAI_ALJIHAD_SIX_GROUPS_DEFINITIONS.find((g) => g.groupNumber === num);
  return found ? found.groupInfo : IAI_ALJIHAD_SIX_GROUPS[0];
}

export function getStudentGroupMapping(nimOrNo: string | number): {
  groupNumber: number;
  groupName: string;
  roman: string;
  role: string;
} | null {
  for (const def of IAI_ALJIHAD_SIX_GROUPS_DEFINITIONS) {
    const mem = def.members.find(
      (m) => m.nim === String(nimOrNo) || m.id === String(nimOrNo)
    );
    if (mem) {
      return {
        groupNumber: def.groupNumber,
        groupName: def.groupName,
        roman: def.roman,
        role: mem.role || "Anggota",
      };
    }
  }
  return null;
}
