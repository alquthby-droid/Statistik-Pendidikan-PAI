export interface DataRow {
  id: number;
  label: string;
  score: number;
  note?: string;
}

export interface DescriptiveStats {
  count: number;
  sum: number;
  min: number;
  max: number;
  range: number;
  mean: number;
  median: number;
  mode: number[];
  modeFrequency: number;
  varianceSample: number;
  variancePop: number;
  stdDevSample: number;
  stdDevPop: number;
  stdErrorMean: number;
  q1: number;
  q2: number;
  q3: number;
  iqr: number;
  quartileDeviation: number; // Simpangan Kuartil (Qd = IQR / 2)
  coefVariation: number; // CV = (s / mean) * 100
  skewness: number;
  kurtosis: number;
}

export interface SturgesCalc {
  n: number;
  log10N: number;
  rawK: number;
  k: number;
  range: number;
  rawC: number;
  c: number;
}

export interface FrequencyClass {
  index: number;
  lowerLimit: number;
  upperLimit: number;
  lowerBound: number; // Tepi bawah (Batas bawah - 0.5)
  upperBound: number; // Tepi atas (Batas atas + 0.5)
  midpoint: number;   // Titik tengah Xi = (lowerLimit + upperLimit) / 2
  frequency: number;
  relativeFreq: number; // %
  cumulativeLess: number; // fk <=
  cumulativeMore: number; // fk >=
  fx: number;            // fi * Xi
  xDiff: number;         // Xi - Mean
  fxDiffSquared: number; // fi * (Xi - Mean)^2
}

export interface ZScoreItem {
  id: number;
  label: string;
  score: number;
  zScore: number;
  tScore: number;
  percentile: number; // 0 - 100%
  category: "Sangat Tinggi" | "Tinggi" | "Sedang" | "Rendah" | "Sangat Rendah";
  categoryArabic: string; // Mumtaz, Jayyid Jiddan, Jayyid, Maqbul, Dha'if
  deviation: number; // X - Mean
}

export interface DatasetPreset {
  id: string;
  title: string;
  variableName: string;
  course: string;
  description: string;
  rows: DataRow[];
}

export interface GroupMember {
  id: string;
  name: string;
  nim: string;
  role?: string;
}

export interface ResearchAttachment {
  id: string;
  url: string; // Base64 data URL or image path
  title: string;
  category: "Dokumentasi Pembelajaran PAI" | "Instrumen Tes / Angket" | "Observasi Kelas" | "Rubrik Penilaian" | "Surat Pengantar & SK" | "Lainnya";
  date?: string;
  notes?: string;
  fileSize?: string;
}

export interface GroupAssignmentInfo {
  isGroupAssignment: boolean;
  institutionName: string;
  faculty: string;
  studyProgram: string;
  courseName: string;
  groupName: string;
  lecturer: string;
  lecturerNip?: string;
  academicYear: string;
  members: GroupMember[];
  logoUrl?: string;
  attachments?: ResearchAttachment[];
}
