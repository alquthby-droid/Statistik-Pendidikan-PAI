export interface StudentRosterItem {
  no: number;
  nim: string;
  name: string;
  groupNumber?: number; // 1 to 6
  groupName?: string;   // Kelompok I to VI
  role?: string;        // Peran tugas kelompok
}

export const IAI_ALJIHAD_SEMESTER_1_STUDENTS: StudentRosterItem[] = [
  // Kelompok I (No. 1 - 5)
  { no: 1, nim: "25286130001", name: "Nurul Aulia", groupNumber: 1, groupName: "Kelompok I", role: "Ketua Kelompok & Analis Sturges" },
  { no: 2, nim: "25286130002", name: "Muhammad Sulistiaji", groupNumber: 1, groupName: "Kelompok I", role: "Analis Dispersi & Z-Score" },
  { no: 3, nim: "25286130003", name: "MOH HUDRI", groupNumber: 1, groupName: "Kelompok I", role: "Visualisasi Grafik & Boxplot" },
  { no: 4, nim: "25286130004", name: "Mahbub Hasby", groupNumber: 1, groupName: "Kelompok I", role: "Penyusun Laporan Akademik" },
  { no: 5, nim: "25286130005", name: "Sugiarto", groupNumber: 1, groupName: "Kelompok I", role: "Verifikator Instrumen & Presensi" },

  // Kelompok II (No. 6 - 10)
  { no: 6, nim: "25286130006", name: "Taupik Hidayat", groupNumber: 2, groupName: "Kelompok II", role: "Ketua Kelompok & Analis Tendensi Sentral" },
  { no: 7, nim: "25286130007", name: "Siti Khumairoh", groupNumber: 2, groupName: "Kelompok II", role: "Analis Median, Modus & Skewness" },
  { no: 8, nim: "25286130008", name: "R Bambang Dwi Minardi", groupNumber: 2, groupName: "Kelompok II", role: "Visualisasi Poligon Frekuensi" },
  { no: 9, nim: "25286130009", name: "ANDRIANI", groupNumber: 2, groupName: "Kelompok II", role: "Penyusun Interpretasi Pedagogis PAI" },
  { no: 10, nim: "25286130010", name: "MIFTAHUDIN", groupNumber: 2, groupName: "Kelompok II", role: "Verifikator Tabulasi Data Mentah" },

  // Kelompok III (No. 11 - 15)
  { no: 11, nim: "25286130011", name: "Ahmad Sambudi", groupNumber: 3, groupName: "Kelompok III", role: "Ketua Kelompok & Analis Varians" },
  { no: 12, nim: "25286130012", name: "Rizky wan Hadi", groupNumber: 3, groupName: "Kelompok III", role: "Analis Standar Deviasi & CV" },
  { no: 13, nim: "25286130013", name: "Imam Kafali", groupNumber: 3, groupName: "Kelompok III", role: "Visualisasi Kurva Lonjong & Rentang" },
  { no: 14, nim: "25286130014", name: "L.M.SUPRIAL WAHID", groupNumber: 3, groupName: "Kelompok III", role: "Penyusun Metodologi & Pembahasan" },
  { no: 15, nim: "25286130015", name: "MULIADI", groupNumber: 3, groupName: "Kelompok III", role: "Verifikator Standarisasi Nilai PAI" },

  // Kelompok IV (No. 16 - 20)
  { no: 16, nim: "25286130016", name: "Winda Astariyah Fatimah", groupNumber: 4, groupName: "Kelompok IV", role: "Ketua Kelompok & Analis Ogive" },
  { no: 17, nim: "25286130017", name: "Dewi Purnamasari", groupNumber: 4, groupName: "Kelompok IV", role: "Analis Kumulatif Kurang/Lebih Dari" },
  { no: 18, nim: "25286130018", name: "SITI NAZMIATUL MUSLIMAH", groupNumber: 4, groupName: "Kelompok IV", role: "Visualisasi Ogive Naik & Ogive Turun" },
  { no: 19, nim: "25286130019", name: "Alya mawardah", groupNumber: 4, groupName: "Kelompok IV", role: "Penyusun Rekomendasi Ketuntasan PAI" },
  { no: 20, nim: "25286130020", name: "MULIYONO", groupNumber: 4, groupName: "Kelompok IV", role: "Verifikator Presensi & Validasi" },

  // Kelompok V (No. 21 - 25)
  { no: 21, nim: "25286130021", name: "AMIN", groupNumber: 5, groupName: "Kelompok V", role: "Ketua Kelompok & Analis Z-Score" },
  { no: 22, nim: "25286130022", name: "Mukhsin", groupNumber: 5, groupName: "Kelompok V", role: "Analis Konversi T-Score & Skala" },
  { no: 23, nim: "25286130023", name: "Wiwin winangsih", groupNumber: 5, groupName: "Kelompok V", role: "Visualisasi Kurva Normal Standar" },
  { no: 24, nim: "25286130024", name: "L. Johan Fawaz", groupNumber: 5, groupName: "Kelompok V", role: "Penyusun Kategori Prestasi PAI" },
  { no: 25, nim: "25286130025", name: "MISRAJI", groupNumber: 5, groupName: "Kelompok V", role: "Verifikator Akurasi Deviasi Nilai" },

  // Kelompok VI (No. 26 - 29)
  { no: 26, nim: "25286130026", name: "Intan Fajri Nurul Ilmi", groupNumber: 6, groupName: "Kelompok VI", role: "Ketua Kelompok & Analis Kuartil" },
  { no: 27, nim: "25286130027", name: "AGUS MULIADI", groupNumber: 6, groupName: "Kelompok VI", role: "Analis Rentang Interkuartil (IQR)" },
  { no: 28, nim: "25286130028", name: "HUSNI", groupNumber: 6, groupName: "Kelompok VI", role: "Visualisasi Boxplot & Deteksi Outlier" },
  { no: 29, nim: "25286130029", name: "CHAERUN NAZIRIN", groupNumber: 6, groupName: "Kelompok VI", role: "Penyusun Sintesis Komparatif & Tesis" },
];

export const OFFICIAL_ROSTER_METADATA = {
  documentTitle: "DATA MAHASISWA SEMESTER 1",
  academicYear: "TAHUN AKADEMIK 2025 GENAP",
  institutionName: "INSTITUT AGAMA ISLAM AL-JIHAD SHALAHUDDIN AL-AYYUBI JAKARTA",
  studyProgram: "PROGRAM STUDI MAGISTER PENDIDIKAN AGAMA ISLAM",
  totalStudents: 29,
};
