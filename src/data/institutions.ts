import { GroupAssignmentInfo } from "../types";
import { LOGO_IAI_ALJIHAD_DATA_URI } from "../assets/logoIaiAlJihad";
import { LOGO_IAI_ASA_DATA_URI } from "../assets/logoIaiAsa";
import { IAI_ALJIHAD_SEMESTER_1_STUDENTS, OFFICIAL_ROSTER_METADATA } from "./students";
import {
  IAI_ALJIHAD_LECTURERS,
  DAFTAR_DOSEN_DOCUMENT_DATA_URI,
  DAFTAR_DOSEN_DOCUMENT_SVG,
  LecturerItem,
} from "./lecturers";
import {
  IAI_ALJIHAD_SIX_GROUPS,
  IAI_ALJIHAD_SIX_GROUPS_DEFINITIONS,
  IAI_ALJIHAD_SEVEN_GROUPS,
  IAI_ALJIHAD_SEVEN_GROUPS_DEFINITIONS,
  getGroupByNumber,
  getStudentGroupMapping,
  SixGroupDefinition,
  SevenGroupDefinition,
} from "./groups";
import {
  IAI_ASA_SEVEN_GROUPS_DEFINITIONS,
  DAFTAR_KELOMPOK_MAKALAH_DOCUMENT_DATA_URI,
  DAFTAR_KELOMPOK_MAKALAH_DOCUMENT_SVG,
  getSevenGroupByNumber,
  getSevenGroupByStudentName,
  SevenGroupMakalahDefinition,
} from "./makalahSevenGroups";

export {
  IAI_ALJIHAD_SEMESTER_1_STUDENTS,
  OFFICIAL_ROSTER_METADATA,
  IAI_ALJIHAD_LECTURERS,
  DAFTAR_DOSEN_DOCUMENT_DATA_URI,
  DAFTAR_DOSEN_DOCUMENT_SVG,
  IAI_ALJIHAD_SIX_GROUPS,
  IAI_ALJIHAD_SIX_GROUPS_DEFINITIONS,
  IAI_ALJIHAD_SEVEN_GROUPS,
  IAI_ALJIHAD_SEVEN_GROUPS_DEFINITIONS,
  getGroupByNumber,
  getStudentGroupMapping,
  IAI_ASA_SEVEN_GROUPS_DEFINITIONS,
  DAFTAR_KELOMPOK_MAKALAH_DOCUMENT_DATA_URI,
  DAFTAR_KELOMPOK_MAKALAH_DOCUMENT_SVG,
  getSevenGroupByNumber,
  getSevenGroupByStudentName,
};
export type { LecturerItem, SixGroupDefinition, SevenGroupDefinition, SevenGroupMakalahDefinition };

export interface InstitutionOption {
  name: string;
  shortName: string;
  faculty: string;
  studyProgram: string;
  logoUrl?: string;
}

export const PRESET_INSTITUTIONS: InstitutionOption[] = [
  {
    name: "Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta",
    shortName: "IAI Al-Jihad Shalahuddin Al-Ayyubi",
    faculty: "Fakultas Tarbiyah / Program Pascasarjana",
    studyProgram: "Magister (S2) Pendidikan Agama Islam",
    logoUrl: LOGO_IAI_ALJIHAD_DATA_URI,
  },
  {
    name: "Institut Agama Islam As'adiyah (IAI ASA) Sengkang",
    shortName: "IAI ASA Pascasarjana",
    faculty: "Program Pascasarjana",
    studyProgram: "Magister (S2) Pendidikan Agama Islam",
    logoUrl: LOGO_IAI_ASA_DATA_URI,
  },
  {
    name: "Universitas Islam Negeri Sunan Kalijaga Yogyakarta",
    shortName: "UIN Sunan Kalijaga",
    faculty: "Fakultas Ilmu Tarbiyah dan Keguruan (FITK)",
    studyProgram: "Magister (S2) Pendidikan Agama Islam",
  },
  {
    name: "Universitas Islam Negeri Syarif Hidayatullah Jakarta",
    shortName: "UIN Jakarta",
    faculty: "Fakultas Ilmu Tarbiyah dan Keguruan (FITK)",
    studyProgram: "Magister (S2) Pendidikan Agama Islam",
  },
  {
    name: "Universitas Islam Negeri Maulana Malik Ibrahim Malang",
    shortName: "UIN Malang",
    faculty: "Fakultas Ilmu Tarbiyah dan Keguruan",
    studyProgram: "Magister (S2) Pendidikan Agama Islam",
  },
  {
    name: "Universitas Islam Negeri Sunan Ampel Surabaya",
    shortName: "UIN Sunan Ampel",
    faculty: "Fakultas Tarbiyah dan Keguruan",
    studyProgram: "Magister (S2) Pendidikan Agama Islam",
  },
  {
    name: "Universitas Islam Negeri Alauddin Makassar",
    shortName: "UIN Alauddin",
    faculty: "Pascasarjana / Fakultas Tarbiyah dan Keguruan",
    studyProgram: "Magister (S2) Pendidikan Agama Islam",
  },
  {
    name: "Universitas Islam Negeri Walisongo Semarang",
    shortName: "UIN Walisongo",
    faculty: "Fakultas Ilmu Tarbiyah dan Keguruan",
    studyProgram: "Magister (S2) Pendidikan Agama Islam",
  },
  {
    name: "Universitas Islam Negeri Ar-Raniry Banda Aceh",
    shortName: "UIN Ar-Raniry",
    faculty: "Fakultas Tarbiyah dan Keguruan",
    studyProgram: "Magister (S2) Pendidikan Agama Islam",
  },
  {
    name: "Universitas Islam Negeri Raden Intan Lampung",
    shortName: "UIN Raden Intan",
    faculty: "Fakultas Tarbiyah dan Keguruan",
    studyProgram: "Magister (S2) Pendidikan Agama Islam",
  },
  {
    name: "Universitas Muhammadiyah Surakarta",
    shortName: "UMS Surakarta",
    faculty: "Sekolah Pascasarjana",
    studyProgram: "Magister (S2) Pendidikan Agama Islam",
  },
  {
    name: "Universitas Muhammadiyah Yogyakarta",
    shortName: "UMY Yogyakarta",
    faculty: "Program Pascasarjana",
    studyProgram: "Magister (S2) Pendidikan Agama Islam",
  },
  {
    name: "Universitas Nahdlatul Ulama Indonesia",
    shortName: "UNUSIA Jakarta",
    faculty: "Pascasarjana",
    studyProgram: "Magister (S2) Pendidikan Agama Islam",
  },
  {
    name: "Universitas Pendidikan Indonesia",
    shortName: "UPI Bandung",
    faculty: "Fakultas Pendidikan Ilmu Pengetahuan Sosial",
    studyProgram: "Magister (S2) Pendidikan Agama Islam",
  },
];

export const DEFAULT_GROUP_INFO: GroupAssignmentInfo = {
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
      role: "Ketua Kelompok & Analis Sturges",
    },
    {
      id: "2",
      name: "Muhammad Sulistiaji",
      nim: "25286130002",
      role: "Analis Sebaran & Standarisasi Z-Score",
    },
    {
      id: "3",
      name: "MOH HUDRI",
      nim: "25286130003",
      role: "Visualisasi Grafik & Boxplot",
    },
    {
      id: "4",
      name: "Mahbub Hasby",
      nim: "25286130004",
      role: "Penyusun Laporan Akademik & Tesis",
    },
    {
      id: "5",
      name: "Sugiarto",
      nim: "25286130005",
      role: "Verifikator Data & Presensi",
    },
  ],
  attachments: [
    {
      id: "att-jadwal-makalah",
      url: DAFTAR_KELOMPOK_MAKALAH_DOCUMENT_DATA_URI,
      title: "Dokumen Resmi: Jadwal & Pembagian 7 Kelompok Makalah Pascasarjana IAI ASA 2026",
      category: "Surat Pengantar & SK" as const,
      date: "12 September 2026",
      notes: "Daftar pembagian 7 kelompok makalah & jadwal presentasi perkuliahan ke-2 s/d ke-10 mata kuliah Statistika Pendidikan Semester 2 Pasca Sarjana IAI ASA Tahun 2026. Dosen Pengampu: Dr. Isti Nurhayati, M.Pd.",
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
      category: "Surat Pengantar & SK" as const,
      date: "10 September 2025",
      notes: "Identitas resmi Institut Agama Islam Al-Jihad Shalahuddin Al-Ayyubi Jakarta untuk lembar pengesahan, instrumen evaluasi PAI, dan lampiran laporan.",
      fileSize: "14.8 KB",
    },
  ],
};
