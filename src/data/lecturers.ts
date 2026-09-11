export interface LecturerItem {
  kd: number;
  code: string; // e.g. "KD-01"
  name: string;
  titles: string;
  specialization: string;
  institution: string;
}

export const IAI_ALJIHAD_LECTURERS: LecturerItem[] = [
  {
    kd: 1,
    code: "KD-01",
    name: "Dr. H. Eno Syafrudien, M.Si",
    titles: "Doktor, Magister Sains",
    specialization: "Metodologi Penelitian Pendidikan & Kebijakan Islam",
    institution: "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
  },
  {
    kd: 2,
    code: "KD-02",
    name: "Dr. Hj. Siti Ma'rifah, MM., MH",
    titles: "Doktor, Magister Manajemen, Magister Hukum",
    specialization: "Manajemen Pendidikan Islam & Regulasi Pendidikan",
    institution: "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
  },
  {
    kd: 3,
    code: "KD-03",
    name: "Dr. H. Asep Habib Idrus Alawi, MA, M.Si, MM",
    titles: "Doktor, Master of Arts, Magister Sains, Magister Manajemen",
    specialization: "Studi Islam Komprehensif & Pengembangan Kurikulum PAI",
    institution: "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
  },
  {
    kd: 4,
    code: "KD-04",
    name: "Dr. Aang Darsono, S.Ag., M.Pd.I",
    titles: "Doktor, Sarjana Agama, Magister Pendidikan Islam",
    specialization: "Statistik Pendidikan & Evaluasi Pembelajaran PAI",
    institution: "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
  },
  {
    kd: 5,
    code: "KD-05",
    name: "Dr. Muhammadiah, MA",
    titles: "Doktor, Master of Arts",
    specialization: "Filsafat Pendidikan Islam & Pemikiran Tokoh Pendidikan",
    institution: "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
  },
  {
    kd: 6,
    code: "KD-06",
    name: "Dr. Saripudin Hamzah, M.Pd",
    titles: "Doktor, Magister Pendidikan",
    specialization: "Desain Instruksional PAI & Asesmen Pembelajaran Modern",
    institution: "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
  },
  {
    kd: 7,
    code: "KD-07",
    name: "Dr. Isti Nurhayati, M.Pd",
    titles: "Doktor, Magister Pendidikan",
    specialization: "Psikologi Belajar PAI & Pengembangan Karakter Peserta Didik",
    institution: "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
  },
];

/**
 * Generate SVG facsimile of official "DAFTAR NAMA DOSEN/KODE DOSEN (KD)" document
 * matching the user's uploaded official screenshot.
 */
export const DAFTAR_DOSEN_DOCUMENT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 320" width="100%" height="100%">
  <defs>
    <linearGradient id="paperBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f8fafc" />
    </linearGradient>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Card Background -->
  <rect x="4" y="4" width="992" height="312" rx="10" fill="url(#paperBg)" stroke="#cbd5e1" stroke-width="1.5" filter="url(#cardShadow)" />

  <!-- Top Decorative Header Bar -->
  <rect x="4" y="4" width="992" height="6" rx="3" fill="#065f46" />

  <!-- Document Header -->
  <g transform="translate(24, 34)">
    <text font-family="Arial, 'Liberation Sans', sans-serif" font-size="11" font-weight="700" fill="#065f46" letter-spacing="1">
      INSTITUT AGAMA ISLAM AL-JIHAD SHALAHUDDIN AL-AYYUBI JAKARTA
    </text>
    <text y="16" font-family="Arial, 'Liberation Sans', sans-serif" font-size="9" fill="#64748b">
      PROGRAM STUDI MAGISTER (S2) PENDIDIKAN AGAMA ISLAM - TAHUN AKADEMIK 2025 GENAP
    </text>
  </g>

  <!-- Main Section Title matching screenshot exactly -->
  <g transform="translate(24, 88)">
    <text font-family="'Times New Roman', Times, serif" font-size="17" font-weight="bold" fill="#0f172a" letter-spacing="0.5">
      DAFTAR NAMA DOSEN/KODE DOSEN (KD):
    </text>
    <line x1="0" y1="12" x2="952" y2="12" stroke="#0f172a" stroke-width="1.2" />
  </g>

  <!-- 3 Columns of Lecturers -->
  <!-- Column 1 (Left): 1, 2, 3 -->
  <g transform="translate(24, 134)" font-family="'Times New Roman', Times, serif" font-size="15" fill="#0f172a">
    <!-- 1 -->
    <text x="0" y="0" font-weight="bold">1.</text>
    <text x="24" y="0" font-weight="bold">Dr. H. Eno Syafrudien, M.Si</text>
    <text x="24" y="16" font-family="Arial, sans-serif" font-size="10" fill="#059669" font-weight="600">Kode Dosen: KD-01</text>

    <!-- 2 -->
    <text x="0" y="52" font-weight="bold">2.</text>
    <text x="24" y="52" font-weight="bold">Dr. Hj. Siti Ma'rifah, MM., MH</text>
    <text x="24" y="68" font-family="Arial, sans-serif" font-size="10" fill="#059669" font-weight="600">Kode Dosen: KD-02</text>

    <!-- 3 -->
    <text x="0" y="104" font-weight="bold">3.</text>
    <text x="24" y="104" font-weight="bold">Dr. H. Asep Habib Idrus Alawi, MA,M.Si,MM</text>
    <text x="24" y="120" font-family="Arial, sans-serif" font-size="10" fill="#059669" font-weight="600">Kode Dosen: KD-03</text>
  </g>

  <!-- Column 2 (Middle): 4, 5, 6 -->
  <g transform="translate(370, 134)" font-family="'Times New Roman', Times, serif" font-size="15" fill="#0f172a">
    <!-- 4 -->
    <text x="0" y="0" font-weight="bold">4 .</text>
    <text x="28" y="0" font-weight="bold">Dr. Aang Darsono, S.Ag., M.Pd.I</text>
    <text x="28" y="16" font-family="Arial, sans-serif" font-size="10" fill="#059669" font-weight="600">Kode Dosen: KD-04</text>

    <!-- 5 -->
    <text x="0" y="52" font-weight="bold">5 .</text>
    <text x="28" y="52" font-weight="bold">Dr. Muhammadiah, MA</text>
    <text x="28" y="68" font-family="Arial, sans-serif" font-size="10" fill="#059669" font-weight="600">Kode Dosen: KD-05</text>

    <!-- 6 -->
    <text x="0" y="104" font-weight="bold">6 .</text>
    <text x="28" y="104" font-weight="bold">Dr. Saripudin Hamzah, M.Pd</text>
    <text x="28" y="120" font-family="Arial, sans-serif" font-size="10" fill="#059669" font-weight="600">Kode Dosen: KD-06</text>
  </g>

  <!-- Column 3 (Right): 7, 8, 9 -->
  <g transform="translate(730, 134)" font-family="'Times New Roman', Times, serif" font-size="15" fill="#0f172a">
    <!-- 7 -->
    <text x="0" y="0" font-weight="bold">7 .</text>
    <text x="28" y="0" font-weight="bold">Dr. Isti Nurhayati, M.Pd</text>
    <text x="28" y="16" font-family="Arial, sans-serif" font-size="10" fill="#059669" font-weight="600">Kode Dosen: KD-07</text>

    <!-- 8 -->
    <text x="0" y="52" font-weight="bold" fill="#94a3b8">8 .</text>
    <text x="28" y="52" font-family="Arial, sans-serif" font-size="12" fill="#94a3b8">-</text>

    <!-- 9 -->
    <text x="0" y="104" font-weight="bold" fill="#94a3b8">9 .</text>
    <text x="28" y="104" font-family="Arial, sans-serif" font-size="12" fill="#94a3b8">-</text>
  </g>

  <!-- Verified Stamp Badge -->
  <g transform="translate(850, 240)">
    <rect x="0" y="0" width="120" height="48" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1.2" stroke-dasharray="3,2" />
    <text x="60" y="18" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold" fill="#065f46" text-anchor="middle">
      TERVERIFIKASI
    </text>
    <text x="60" y="32" font-family="Arial, sans-serif" font-size="7.5" fill="#047857" text-anchor="middle">
      DOKUMEN RESMI IAI
    </text>
    <text x="60" y="42" font-family="Arial, sans-serif" font-size="6.5" fill="#64748b" text-anchor="middle">
      TA 2025 GENAP
    </text>
  </g>
</svg>`;

export const DAFTAR_DOSEN_DOCUMENT_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(
  DAFTAR_DOSEN_DOCUMENT_SVG
)}`;
