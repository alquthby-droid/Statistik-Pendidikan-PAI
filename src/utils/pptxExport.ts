import pptxgen from "pptxgenjs";
import { DescriptiveStats, FrequencyClass, ZScoreItem, SturgesCalc, GroupAssignmentInfo } from "../types";

export interface PptxExportOptions {
  stats: DescriptiveStats;
  sturges: SturgesCalc;
  frequencyClasses: FrequencyClass[];
  zScores: ZScoreItem[];
  variableName: string;
  dataTitle: string;
  groupInfo?: GroupAssignmentInfo;
}

/**
 * Generates and downloads an authentic Microsoft PowerPoint (.pptx) file
 * covering all 4 core modules: Sebaran, Distribusi, Z-Score, and Grafik Statistik
 * with full support for Group Assignment & Higher Education Institution identity.
 */
export async function exportToPptx({
  stats,
  sturges,
  frequencyClasses,
  zScores,
  variableName,
  dataTitle,
  groupInfo,
}: PptxExportOptions): Promise<void> {
  const pptx = new pptxgen();

  const instName = groupInfo?.institutionName || "Universitas Islam Negeri Sunan Kalijaga Yogyakarta";
  const facultyName = groupInfo?.faculty || "Fakultas Ilmu Tarbiyah dan Keguruan (FITK)";
  const prodiName = groupInfo?.studyProgram || "Magister (S2) Pendidikan Agama Islam";
  const groupName = groupInfo?.groupName || "Kelompok III (Tiga)";
  const courseName = groupInfo?.courseName || "Statistik Pendidikan / Evaluasi Pembelajaran PAI";
  const lecturerName = groupInfo?.lecturer || "Prof. Dr. H. Abdul Munir, M.Ag.";
  const academicYear = groupInfo?.academicYear || "Semester Gasal 2025/2026";
  const members = groupInfo?.members || [];

  pptx.layout = "LAYOUT_16x9";
  pptx.author = groupInfo?.isGroupAssignment
    ? `${groupName} - ${instName} (Pengembang: Husni, S.Kom.I)`
    : `${instName} (Pengembang: Husni, S.Kom.I)`;
  pptx.company = `${instName} | Pengembang: Husni, S.Kom.I`;
  pptx.title = `Tugas Kelompok Statistik Pendidikan - ${variableName}`;
  pptx.subject = "Sebaran, Distribusi Frekuensi, Z-Score, dan Grafik Statistik PAI (Pengembang: Husni, S.Kom.I)";

  const EMERALD_DARK = "064E3B";
  const EMERALD_PRIMARY = "047857";
  const EMERALD_LIGHT = "ECFDF5";
  const WHITE = "FFFFFF";
  const SLATE_DARK = "0F172A";
  const SLATE_MUTED = "475569";
  const SLATE_LIGHT = "F1F5F9";
  const GOLD = "F59E0B";

  // Category counts
  const catMumtaz = zScores.filter((z) => z.category === "Sangat Tinggi").length;
  const catTinggi = zScores.filter((z) => z.category === "Tinggi").length;
  const catSedang = zScores.filter((z) => z.category === "Sedang").length;
  const catRendah = zScores.filter((z) => z.category === "Rendah").length;
  const catSangatRendah = zScores.filter((z) => z.category === "Sangat Rendah").length;

  const footerText = `${instName} • ${groupInfo?.isGroupAssignment ? groupName : "Tugas Mandiri"} • ${prodiName}`;

  // ==========================================
  // SLIDE 1: COVER / TITLE SLIDE
  // ==========================================
  const slide1 = pptx.addSlide();
  slide1.background = { color: EMERALD_DARK };

  slide1.addText(instName.toUpperCase(), {
    x: 0.8,
    y: 0.6,
    w: 11.7,
    h: 0.35,
    fontSize: 13,
    color: GOLD,
    bold: true,
    fontFace: "Calibri",
  });

  slide1.addText(`${facultyName.toUpperCase()} • ${prodiName.toUpperCase()}`, {
    x: 0.8,
    y: 0.95,
    w: 11.7,
    h: 0.3,
    fontSize: 11,
    color: "A7F3D0",
    fontFace: "Calibri",
  });

  slide1.addText(
    groupInfo?.isGroupAssignment
      ? `TUGAS KELOMPOK: ANALISIS STATISTIK PENDIDIKAN`
      : "MODUL STATISTIK PENDIDIKAN",
    {
      x: 0.8,
      y: 1.4,
      w: 11.7,
      h: 0.8,
      fontSize: 30,
      color: WHITE,
      bold: true,
      fontFace: "Georgia",
    }
  );

  slide1.addText("Sebaran & Dispersi • Distribusi Frekuensi • Z-Score & T-Score • Grafik Statistik", {
    x: 0.8,
    y: 2.3,
    w: 11.7,
    h: 0.4,
    fontSize: 14,
    color: "A7F3D0",
    bold: true,
    fontFace: "Calibri",
  });

  // Info Card Left on Cover (Data Empiris)
  slide1.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 2.9,
    w: 5.7,
    h: 3.5,
    fill: { color: "065F46" },
    line: { color: "10B981", width: 1.5 },
  });

  slide1.addText(
    [
      { text: "Konteks Variabel & Instrumen Penelitian:\n", options: { bold: true, fontSize: 12, color: GOLD } },
      { text: `• Variabel    : `, options: { bold: true, color: WHITE } },
      { text: `${variableName}\n`, options: { color: "A7F3D0" } },
      { text: `• Sumber Data : `, options: { bold: true, color: WHITE } },
      { text: `${dataTitle}\n`, options: { color: "E2E8F0" } },
      { text: `• Sampel (N)  : `, options: { bold: true, color: WHITE } },
      { text: `${stats.count} Mahasiswa / Responden\n`, options: { color: "A7F3D0" } },
      { text: `• Mean (X̄)    : `, options: { bold: true, color: WHITE } },
      { text: `${stats.mean.toFixed(2)} (SD = ${stats.stdDevSample.toFixed(2)})\n`, options: { color: WHITE } },
      { text: `• Rentang (R) : `, options: { bold: true, color: WHITE } },
      { text: `${stats.min} s.d. ${stats.max} (R = ${stats.range})`, options: { color: WHITE } },
    ],
    { x: 1.0, y: 3.1, w: 5.3, h: 3.1, fontSize: 11, fontFace: "Calibri" }
  );

  // Info Card Right on Cover (Identitas Kelompok & Lembaga)
  slide1.addShape(pptx.ShapeType.rect, {
    x: 6.8,
    y: 2.9,
    w: 5.7,
    h: 3.5,
    fill: { color: "065F46" },
    line: { color: "10B981", width: 1.5 },
  });

  const memberNamesSnippet =
    members.length > 0
      ? members.map((m, i) => `  ${i + 1}. ${m.name} (${m.nim})`).join("\n")
      : "  -";

  slide1.addText(
    [
      { text: `Identitas Tugas & Tim Penyusun:\n`, options: { bold: true, fontSize: 12, color: GOLD } },
      { text: `• Penugasan     : `, options: { bold: true, color: WHITE } },
      { text: `${groupName}\n`, options: { color: GOLD, bold: true } },
      { text: `• Dosen Pengampu: `, options: { bold: true, color: WHITE } },
      { text: `${lecturerName}\n`, options: { color: "E2E8F0" } },
      { text: `• Semester/Tahun: `, options: { bold: true, color: WHITE } },
      { text: `${academicYear}\n`, options: { color: "E2E8F0" } },
      { text: `• Anggota Kelompok:\n`, options: { bold: true, color: "A7F3D0" } },
      { text: memberNamesSnippet, options: { color: WHITE, fontSize: 9.5 } },
    ],
    { x: 7.0, y: 3.1, w: 5.3, h: 3.1, fontSize: 11, fontFace: "Calibri" }
  );

  slide1.addNotes(
    `Pengantar Tugas Kelompok Statistik Pendidikan S2 PAI: Modul dan slide presentasi disusun oleh ${groupName}, ${instName}. Membedah 4 pilar analisis data: Sebaran/Dispersi, Distribusi Frekuensi Sturges, Z-Score & T-Score, dan Grafik Statistik.`
  );

  // ==========================================
  // SLIDE 2: IDENTITAS KELOMPOK & TIM PENYUSUN
  // ==========================================
  const slideTeam = pptx.addSlide();
  slideTeam.background = { color: SLATE_LIGHT };

  slideTeam.addText("PROFIL TIM PENYUSUN TUGAS KELOMPOK", {
    x: 0.8,
    y: 0.5,
    w: 11.7,
    h: 0.35,
    fontSize: 12,
    color: EMERALD_PRIMARY,
    bold: true,
  });

  slideTeam.addText(`${groupName} — ${instName}`, {
    x: 0.8,
    y: 0.85,
    w: 11.7,
    h: 0.5,
    fontSize: 22,
    color: SLATE_DARK,
    bold: true,
    fontFace: "Georgia",
  });

  slideTeam.addText(
    `${facultyName} • ${prodiName} • Mata Kuliah: ${courseName}`,
    {
      x: 0.8,
      y: 1.4,
      w: 11.7,
      h: 0.3,
      fontSize: 11,
      color: SLATE_MUTED,
      fontFace: "Calibri",
    }
  );

  // Team Cards Grid
  const cardWidth = 5.6;
  const cardHeight = 1.6;
  const startX = 0.8;
  const startY = 1.9;
  const gapX = 0.5;
  const gapY = 0.3;

  members.slice(0, 4).forEach((member, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const posX = startX + col * (cardWidth + gapX);
    const posY = startY + row * (cardHeight + gapY);

    slideTeam.addShape(pptx.ShapeType.roundRect, {
      x: posX,
      y: posY,
      w: cardWidth,
      h: cardHeight,
      fill: { color: WHITE },
      line: { color: "CBD5E1", width: 1 },
      rectRadius: 0.1,
    });

    // Color accent strip on left
    slideTeam.addShape(pptx.ShapeType.rect, {
      x: posX,
      y: posY,
      w: 0.15,
      h: cardHeight,
      fill: { color: EMERALD_PRIMARY },
      line: { color: EMERALD_PRIMARY },
    });

    slideTeam.addText(
      [
        { text: `${idx + 1}. ${member.name}\n`, options: { bold: true, fontSize: 13, color: SLATE_DARK } },
        { text: `NIM: `, options: { bold: true, fontSize: 11, color: SLATE_MUTED } },
        { text: `${member.nim}\n`, options: { fontSize: 11, color: EMERALD_PRIMARY, bold: true } },
        { text: `Tugas & Peran: `, options: { bold: true, fontSize: 10, color: SLATE_MUTED } },
        { text: `${member.role || "Analis Statistik"}`, options: { fontSize: 10, color: "047857" } },
      ],
      { x: posX + 0.3, y: posY + 0.15, w: cardWidth - 0.5, h: cardHeight - 0.3, fontFace: "Calibri" }
    );
  });

  // Footer metadata on Team Slide
  slideTeam.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 5.7,
    w: 11.7,
    h: 1.1,
    fill: { color: EMERALD_LIGHT },
    line: { color: "A7F3D0", width: 1 },
  });

  slideTeam.addText(
    [
      { text: `Dosen Pengampu: `, options: { bold: true, color: SLATE_DARK } },
      { text: `${lecturerName}${groupInfo?.lecturerNip ? ` (NIP: ${groupInfo.lecturerNip})` : ""}   |   `, options: { color: SLATE_DARK } },
      { text: `Semester: `, options: { bold: true, color: SLATE_DARK } },
      { text: `${academicYear}   |   `, options: { color: SLATE_DARK } },
      { text: `Lembaga: `, options: { bold: true, color: SLATE_DARK } },
      { text: `${instName}`, options: { color: EMERALD_PRIMARY, bold: true } },
    ],
    { x: 1.0, y: 5.85, w: 11.3, h: 0.8, fontSize: 11, fontFace: "Calibri" }
  );

  slideTeam.addText(footerText, {
    x: 0.8,
    y: 7.0,
    w: 11.7,
    h: 0.3,
    fontSize: 9,
    color: SLATE_MUTED,
    fontFace: "Calibri",
  });

  slideTeam.addNotes(
    `Slide pengenalan identitas kelompok dan pembagian tugas kerja tim dalam pengolahan serta analisis data statistik pendidikan program pascasarjana S2 PAI.`
  );

  // ==========================================
  // SLIDE 2: ROADMAP 4 PILAR MODUL
  // ==========================================
  const slide2 = pptx.addSlide();
  slide2.background = { color: SLATE_LIGHT };

  slide2.addText("ROADMAP KONSEPTUAL MODUL", {
    x: 0.8,
    y: 0.5,
    w: 11.7,
    h: 0.4,
    fontSize: 12,
    color: EMERALD_PRIMARY,
    bold: true,
  });
  slide2.addText("4 Pilar Utama Analisis Statistik Pendidikan S2 PAI", {
    x: 0.8,
    y: 0.9,
    w: 11.7,
    h: 0.5,
    fontSize: 22,
    color: SLATE_DARK,
    bold: true,
    fontFace: "Georgia",
  });

  const modules = [
    {
      num: "01",
      title: "Ukuran Sebaran & Dispersi",
      sub: "Pemusatan & Variabilitas",
      desc: "Rata-rata (Mean), Median, Modus, Standar Deviasi (s), Varians (s²), Kuartil, IQR, dan Koefisien Variasi (CV%).",
      color: "047857",
    },
    {
      num: "02",
      title: "Distribusi Frekuensi",
      sub: "Aturan Sturges Empiris",
      desc: "Banyak kelas (k = 1 + 3.322 log N), panjang interval (c = R/k), batas nyata, frekuensi relatif & kumulatif, kemencengan (Skewness) & keruncingan (Kurtosis).",
      color: "0D9488",
    },
    {
      num: "03",
      title: "Z-Score & T-Score",
      sub: "Standarisasi Skor Baku",
      desc: "Transformasi nilai mentah menjadi skor baku [Z = (X - X̄) / s] dan skor McCall [T = 50 + 10(Z)] untuk evaluasi mutu akademik PAI (Mumtaz s.d. Dha'if).",
      color: "2563EB",
    },
    {
      num: "04",
      title: "Grafik Statistik",
      sub: "Visualisasi Komprehensif",
      desc: "Histogram frekuensi, poligon frekuensi, kurva distribusi normal baku Gauss (±1σ, ±2σ), kurva ogive dual, dan diagram kotak garis (Boxplot).",
      color: "7C3AED",
    },
  ];

  modules.forEach((mod, idx) => {
    const colX = 0.8 + idx * 2.95;
    slide2.addShape(pptx.ShapeType.roundRect, {
      x: colX,
      y: 1.8,
      w: 2.8,
      h: 4.8,
      fill: { color: WHITE },
      line: { color: mod.color, width: 2 },
    });

    slide2.addShape(pptx.ShapeType.roundRect, {
      x: colX + 0.2,
      y: 2.0,
      w: 0.7,
      h: 0.4,
      fill: { color: mod.color },
      line: { color: mod.color },
    });
    slide2.addText(mod.num, {
      x: colX + 0.2,
      y: 2.0,
      w: 0.7,
      h: 0.4,
      fontSize: 12,
      color: WHITE,
      bold: true,
      align: "center",
      valign: "middle",
    });

    slide2.addText(mod.title, {
      x: colX + 0.2,
      y: 2.5,
      w: 2.4,
      h: 0.6,
      fontSize: 14,
      color: SLATE_DARK,
      bold: true,
      fontFace: "Georgia",
    });

    slide2.addText(mod.sub, {
      x: colX + 0.2,
      y: 3.1,
      w: 2.4,
      h: 0.3,
      fontSize: 10,
      color: mod.color,
      bold: true,
    });

    slide2.addText(mod.desc, {
      x: colX + 0.2,
      y: 3.6,
      w: 2.4,
      h: 2.7,
      fontSize: 10.5,
      color: SLATE_MUTED,
      fontFace: "Calibri",
    });
  });

  slide2.addNotes(
    "Roadmap 4 pilar ini membentuk alur analisis data yang runut dan ilmiah dalam penulisan Bab IV Tesis Magister PAI."
  );

  // ==========================================
  // SLIDE 3: MODUL 1 - UKURAN PEMUSATAN DATA
  // ==========================================
  const slide3 = pptx.addSlide();
  slide3.background = { color: WHITE };

  slide3.addText("MODUL 1 • UKURAN SEBARAN (BAGIAN 1)", {
    x: 0.8,
    y: 0.5,
    w: 11.7,
    h: 0.4,
    fontSize: 11,
    color: EMERALD_PRIMARY,
    bold: true,
  });
  slide3.addText("Ukuran Pemusatan Data (Central Tendency)", {
    x: 0.8,
    y: 0.9,
    w: 11.7,
    h: 0.5,
    fontSize: 22,
    color: SLATE_DARK,
    bold: true,
    fontFace: "Georgia",
  });

  // Table of Central Tendency
  const rowsCentral = [
    [
      { text: "Parameter", options: { bold: true, fill: { color: "065F46" }, color: WHITE } },
      { text: "Simbol", options: { bold: true, fill: { color: "065F46" }, color: WHITE, align: "center" } },
      { text: "Nilai Sampel", options: { bold: true, fill: { color: "065F46" }, color: WHITE, align: "center" } },
      { text: "Rumus & Makna Pedagogis PAI", options: { bold: true, fill: { color: "065F46" }, color: WHITE } },
    ],
    [
      { text: "Mean (Rata-Rata Hitung)", options: { bold: true } },
      { text: "X̄", options: { align: "center", bold: true, color: EMERALD_PRIMARY } },
      { text: stats.mean.toFixed(2), options: { align: "center", bold: true, color: EMERALD_PRIMARY } },
      { text: "X̄ = (ΣX) / N. Titik tumpu pusat massa seluruh nilai mahasiswa." },
    ],
    [
      { text: "Median (Nilai Tengah)", options: { bold: true } },
      { text: "Me", options: { align: "center", bold: true } },
      { text: stats.median.toFixed(2), options: { align: "center", bold: true } },
      { text: "Membagi 50% data di bawah dan 50% di atas. Kebal terhadap outlier ekstrem." },
    ],
    [
      { text: "Modus (Nilai Terbanyak)", options: { bold: true } },
      { text: "Mo", options: { align: "center", bold: true } },
      { text: stats.mode.length > 0 ? stats.mode.join(", ") : "-", options: { align: "center", bold: true } },
      { text: `Skor dengan kemunculan tertinggi (frekuensi = ${stats.modeFrequency || 1} kali).` },
    ],
    [
      { text: "Nilai Minimum", options: { bold: true } },
      { text: "Xmin", options: { align: "center" } },
      { text: String(stats.min), options: { align: "center", bold: true } },
      { text: "Skor paling rendah yang diraih peserta didik dalam instrumen tes/angket." },
    ],
    [
      { text: "Nilai Maksimum", options: { bold: true } },
      { text: "Xmax", options: { align: "center" } },
      { text: String(stats.max), options: { align: "center", bold: true } },
      { text: "Skor puncak yang berhasil dicapai oleh peserta didik." },
    ],
    [
      { text: "Rentang / Jangkauan", options: { bold: true } },
      { text: "R", options: { align: "center" } },
      { text: String(stats.range), options: { align: "center", bold: true } },
      { text: "R = Xmax - Xmin. Lebar total sebaran skor mentah seluruh responden." },
    ],
  ];

  slide3.addTable(rowsCentral as any, {
    x: 0.8,
    y: 1.6,
    w: 11.7,
    h: 4.8,
    colW: [2.6, 1.0, 1.6, 6.5],
    fontSize: 11,
    border: { pt: 0.5, color: "CBD5E1" },
  });

  slide3.addNotes(
    "Pemusatan data menunjukkan kecenderungan skor mahasiswa. Jika Mean ≈ Median ≈ Modus, distribusi mendekati simetris normal."
  );

  // ==========================================
  // SLIDE 4: MODUL 1 - UKURAN DISPERSI & SEBARAN
  // ==========================================
  const slide4 = pptx.addSlide();
  slide4.background = { color: WHITE };

  slide4.addText("MODUL 1 • UKURAN SEBARAN (BAGIAN 2)", {
    x: 0.8,
    y: 0.5,
    w: 11.7,
    h: 0.4,
    fontSize: 11,
    color: EMERALD_PRIMARY,
    bold: true,
  });
  slide4.addText("Ukuran Sebaran, Keragaman & Variabilitas (Dispersi)", {
    x: 0.8,
    y: 0.9,
    w: 11.7,
    h: 0.5,
    fontSize: 22,
    color: SLATE_DARK,
    bold: true,
    fontFace: "Georgia",
  });

  // Card 1: Standar Deviasi & Varians
  slide4.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.6,
    w: 5.7,
    h: 4.8,
    fill: { color: "F8FAFC" },
    line: { color: "CBD5E1", width: 1 },
  });

  slide4.addText("Standar Deviasi, Varians & SE Mean", {
    x: 1.1,
    y: 1.8,
    w: 5.1,
    h: 0.4,
    fontSize: 13,
    color: EMERALD_DARK,
    bold: true,
  });

  slide4.addText(
    [
      { text: "1. Standar Deviasi Sampel (s):\n", options: { bold: true } },
      {
        text: `   s = √[Σ(X - X̄)² / (N - 1)] = ${stats.stdDevSample.toFixed(2)}\n`,
        options: { bold: true, color: EMERALD_PRIMARY },
      },
      { text: "   Rata-rata simpangan setiap skor mahasiswa terhadap Mean.\n\n" },

      { text: "2. Varians Sampel (s²):\n", options: { bold: true } },
      {
        text: `   s² = ${stats.varianceSample.toFixed(2)}\n`,
        options: { bold: true, color: SLATE_DARK },
      },
      { text: "   Kuadrat simpangan rata-rata untuk pengukuran variabilitas kuadratik.\n\n" },

      { text: "3. Standar Error of Mean (SEM):\n", options: { bold: true } },
      {
        text: `   SEM = s / √N = ${stats.stdErrorMean.toFixed(2)}\n`,
        options: { bold: true, color: SLATE_DARK },
      },
      { text: "   Derajat ketelitian estimasi mean sampel terhadap populasi.\n\n" },

      { text: "4. Koefisien Variasi (CV):\n", options: { bold: true } },
      {
        text: `   CV = (s / X̄) × 100% = ${stats.coefVariation.toFixed(2)}%\n`,
        options: { bold: true, color: EMERALD_PRIMARY },
      },
      { text: `   Tingkat homogenitas: ${stats.coefVariation < 20 ? "Sangat Homogen (<20%)" : "Cukup Heterogen (≥20%)"}.` },
    ],
    { x: 1.1, y: 2.3, w: 5.1, h: 3.8, fontSize: 10.5, fontFace: "Calibri" }
  );

  // Card 2: Kuartil & Boxplot Statistics
  slide4.addShape(pptx.ShapeType.roundRect, {
    x: 6.8,
    y: 1.6,
    w: 5.7,
    h: 4.8,
    fill: { color: "F8FAFC" },
    line: { color: "CBD5E1", width: 1 },
  });

  slide4.addText("Ukuran Letak: Kuartil & Simpangan Kuartil", {
    x: 7.1,
    y: 1.8,
    w: 5.1,
    h: 0.4,
    fontSize: 13,
    color: EMERALD_DARK,
    bold: true,
  });

  slide4.addText(
    [
      { text: "1. Kuartil Bawah (Q1 / Persentil ke-25):\n", options: { bold: true } },
      {
        text: `   Q1 = ${stats.q1.toFixed(2)}\n`,
        options: { bold: true, color: "0284C7" },
      },
      { text: "   25% mahasiswa memiliki nilai di bawah batas ini.\n\n" },

      { text: "2. Kuartil Tengah (Q2 / Median / Persentil ke-50):\n", options: { bold: true } },
      {
        text: `   Q2 = ${stats.median.toFixed(2)}\n`,
        options: { bold: true, color: "E11D48" },
      },
      { text: "   Membagi separuh bawah dan separuh atas nilai responden.\n\n" },

      { text: "3. Kuartil Atas (Q3 / Persentil ke-75):\n", options: { bold: true } },
      {
        text: `   Q3 = ${stats.q3.toFixed(2)}\n`,
        options: { bold: true, color: "0284C7" },
      },
      { text: "   75% mahasiswa berada di bawah nilai ini (25% kelompok teratas).\n\n" },

      { text: "4. Jangkauan Antarkuartil (IQR) & Qd:\n", options: { bold: true } },
      {
        text: `   IQR = Q3 - Q1 = ${stats.iqr.toFixed(2)}\n`,
        options: { bold: true, color: SLATE_DARK },
      },
      {
        text: `   Simpangan Kuartil (Qd) = 0.5 × IQR = ${stats.quartileDeviation.toFixed(2)}\n`,
        options: { bold: true, color: EMERALD_PRIMARY },
      },
      { text: "   Lebar bentangan 50% data inti di sekitar nilai median." },
    ],
    { x: 7.1, y: 2.3, w: 5.1, h: 3.8, fontSize: 10.5, fontFace: "Calibri" }
  );

  slide4.addNotes(
    "Ukuran dispersi melengkapi pemusatan: dua kelas dengan rata-rata 75 bisa memiliki standar deviasi berbeda (misal s=3 artinya merata, s=15 artinya timpang)."
  );

  // ==========================================
  // SLIDE 5: MODUL 2 - DISTRIBUSI FREKUENSI & ATURAN STURGES
  // ==========================================
  const slide5 = pptx.addSlide();
  slide5.background = { color: WHITE };

  slide5.addText("MODUL 2 • DISTRIBUSI FREKUENSI BERKELOMPOK", {
    x: 0.8,
    y: 0.5,
    w: 11.7,
    h: 0.4,
    fontSize: 11,
    color: EMERALD_PRIMARY,
    bold: true,
  });
  slide5.addText("Kaidah Empiris Aturan Sturges (Herbert Sturges, 1926)", {
    x: 0.8,
    y: 0.9,
    w: 11.7,
    h: 0.5,
    fontSize: 22,
    color: SLATE_DARK,
    bold: true,
    fontFace: "Georgia",
  });

  // 3 Formula Cards
  const sturgesCards = [
    {
      title: "Langkah 1: Jangkauan / Range (R)",
      formula: "R = Xmax - Xmin",
      calc: `R = ${stats.max} - ${stats.min} = ${stats.range}`,
      desc: "Menghitung selisih antara nilai pengamatan tertinggi dengan nilai terendah.",
      color: "047857",
    },
    {
      title: "Langkah 2: Banyak Kelas (k)",
      formula: "k = 1 + 3.322 log10(N)",
      calc: `k = 1 + 3.322 log10(${sturges.n}) = ${sturges.rawK.toFixed(3)} ≈ ${sturges.k}`,
      desc: "Kaidah logaritmik agar jumlah interval seimbang dan menghindari kekosongan kelas.",
      color: "0D9488",
    },
    {
      title: "Langkah 3: Panjang Interval (c / i)",
      formula: "c = Range / k",
      calc: `c = ${sturges.range} / ${sturges.k} = ${sturges.rawC.toFixed(3)} ≈ ${sturges.c}`,
      desc: "Lebar tiap kelas interval (dibulatkan ke atas/ke bilangan bulat terdekat).",
      color: "2563EB",
    },
  ];

  sturgesCards.forEach((c, i) => {
    const cardX = 0.8 + i * 3.95;
    slide5.addShape(pptx.ShapeType.roundRect, {
      x: cardX,
      y: 1.6,
      w: 3.8,
      h: 2.5,
      fill: { color: "F8FAFC" },
      line: { color: c.color, width: 2 },
    });

    slide5.addText(c.title, {
      x: cardX + 0.2,
      y: 1.8,
      w: 3.4,
      h: 0.3,
      fontSize: 11,
      color: c.color,
      bold: true,
    });

    slide5.addText(c.formula, {
      x: cardX + 0.2,
      y: 2.2,
      w: 3.4,
      h: 0.4,
      fontSize: 14,
      color: SLATE_DARK,
      bold: true,
      fontFace: "Courier New",
    });

    slide5.addText(c.calc, {
      x: cardX + 0.2,
      y: 2.7,
      w: 3.4,
      h: 0.4,
      fontSize: 12,
      color: EMERALD_DARK,
      bold: true,
    });

    slide5.addText(c.desc, {
      x: cardX + 0.2,
      y: 3.2,
      w: 3.4,
      h: 0.7,
      fontSize: 9.5,
      color: SLATE_MUTED,
    });
  });

  // Skewness & Kurtosis Banner
  slide5.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 4.4,
    w: 11.7,
    h: 2.0,
    fill: { color: "ECFDF5" },
    line: { color: "10B981", width: 1.5 },
  });

  slide5.addText("Karakteristik Bentuk Distribusi: Skewness & Kurtosis", {
    x: 1.1,
    y: 4.6,
    w: 11.1,
    h: 0.3,
    fontSize: 12,
    color: "065F46",
    bold: true,
  });

  slide5.addText(
    [
      { text: "• Kemiringan (Skewness): ", options: { bold: true } },
      {
        text: `Sk = ${stats.skewness.toFixed(3)} → ${
          stats.skewness > 0.5
            ? "Menceng Kanan (Positif). Sebagian besar mahasiswa berkemampuan di bawah rata-rata."
            : stats.skewness < -0.5
            ? "Menceng Kiri (Negatif). Sebagian besar mahasiswa berkemampuan di atas rata-rata."
            : "Simetris Normal (Kurva Lonceng seimbang)."
        }\n\n`,
      },
      { text: "• Keruncingan (Kurtosis): ", options: { bold: true } },
      {
        text: `Ku = ${stats.kurtosis.toFixed(3)} → ${
          stats.kurtosis > 0.5
            ? "Leptokurtik (Kurva sangat runcing dan terkonsentrasi padat pada nilai tengah)."
            : stats.kurtosis < -0.5
            ? "Platikurtik (Kurva landai mendatar, sebaran relatif heterogen melebar)."
            : "Mesokurtik (Tingkat keruncingan normal standar Gauss)."
        }`,
      },
    ],
    { x: 1.1, y: 5.0, w: 11.1, h: 1.2, fontSize: 10.5, fontFace: "Calibri" }
  );

  slide5.addNotes(
    "Aturan Sturges menjamin data mentah tersusun secara objektif tanpa manipulasi rentang kelas oleh peneliti."
  );

  // ==========================================
  // SLIDE 6: MODUL 2 - TABEL DISTRIBUSI FREKUENSI
  // ==========================================
  const slide6 = pptx.addSlide();
  slide6.background = { color: WHITE };

  slide6.addText("MODUL 2 • TABEL DISTRIBUSI FREKUENSI BERKELOMPOK", {
    x: 0.8,
    y: 0.5,
    w: 11.7,
    h: 0.4,
    fontSize: 11,
    color: EMERALD_PRIMARY,
    bold: true,
  });
  slide6.addText(`Tabel Distribusi Empiris: ${variableName} (k = ${sturges.k}, c = ${sturges.c})`, {
    x: 0.8,
    y: 0.9,
    w: 11.7,
    h: 0.5,
    fontSize: 20,
    color: SLATE_DARK,
    bold: true,
    fontFace: "Georgia",
  });

  const tableHeaders = [
    { text: "No", options: { bold: true, fill: { color: "065F46" }, color: WHITE, align: "center" } },
    { text: "Interval Kelas", options: { bold: true, fill: { color: "065F46" }, color: WHITE, align: "center" } },
    { text: "Batas Nyata", options: { bold: true, fill: { color: "065F46" }, color: WHITE, align: "center" } },
    { text: "Titik Tengah (Xi)", options: { bold: true, fill: { color: "065F46" }, color: WHITE, align: "center" } },
    { text: "Frekuensi (fi)", options: { bold: true, fill: { color: "065F46" }, color: WHITE, align: "center" } },
    { text: "Relatif (%)", options: { bold: true, fill: { color: "065F46" }, color: WHITE, align: "center" } },
    { text: "fk ≤", options: { bold: true, fill: { color: "065F46" }, color: WHITE, align: "center" } },
    { text: "fk ≥", options: { bold: true, fill: { color: "065F46" }, color: WHITE, align: "center" } },
    { text: "fi · Xi", options: { bold: true, fill: { color: "065F46" }, color: WHITE, align: "right" } },
  ];

  const tableRows: any[] = [tableHeaders];

  frequencyClasses.forEach((cls) => {
    tableRows.push([
      { text: String(cls.index), options: { align: "center" } },
      { text: `${cls.lowerLimit} - ${cls.upperLimit}`, options: { align: "center", bold: true } },
      { text: `${cls.lowerBound.toFixed(1)} - ${cls.upperBound.toFixed(1)}`, options: { align: "center", color: SLATE_MUTED } },
      { text: cls.midpoint.toFixed(1), options: { align: "center" } },
      { text: String(cls.frequency), options: { align: "center", bold: true, color: EMERALD_PRIMARY } },
      { text: `${cls.relativeFreq.toFixed(1)}%`, options: { align: "center" } },
      { text: String(cls.cumulativeLess), options: { align: "center", color: "2563EB" } },
      { text: String(cls.cumulativeMore), options: { align: "center", color: "2563EB" } },
      { text: cls.fx.toFixed(1), options: { align: "right" } },
    ]);
  });

  const totalFreq = frequencyClasses.reduce((acc, c) => acc + c.frequency, 0);
  const totalFX = frequencyClasses.reduce((acc, c) => acc + c.fx, 0);

  tableRows.push([
    { text: "Total (Σ)", options: { bold: true, fill: { color: "E2E8F0" }, align: "center" } },
    { text: `${sturges.k} Kelas`, options: { bold: true, fill: { color: "E2E8F0" }, align: "center" } },
    { text: "-", options: { fill: { color: "E2E8F0" }, align: "center" } },
    { text: "-", options: { fill: { color: "E2E8F0" }, align: "center" } },
    { text: String(totalFreq), options: { bold: true, fill: { color: "D1FAE5" }, color: EMERALD_DARK, align: "center" } },
    { text: "100.0%", options: { bold: true, fill: { color: "E2E8F0" }, align: "center" } },
    { text: "-", options: { fill: { color: "E2E8F0" }, align: "center" } },
    { text: "-", options: { fill: { color: "E2E8F0" }, align: "center" } },
    { text: totalFX.toFixed(1), options: { bold: true, fill: { color: "E2E8F0" }, align: "right" } },
  ]);

  slide6.addTable(tableRows as any, {
    x: 0.8,
    y: 1.6,
    w: 11.7,
    h: 4.8,
    colW: [0.6, 1.8, 1.8, 1.5, 1.3, 1.3, 1.1, 1.1, 1.2],
    fontSize: 9.5,
    border: { pt: 0.5, color: "CBD5E1" },
  });

  slide6.addNotes(
    "Tabel distribusi frekuensi berkelompok ini menjadi dasar pembuatan Histogram, Poligon Frekuensi, dan Kurva Ogive."
  );

  // ==========================================
  // SLIDE 7: MODUL 3 - Z-SCORE & T-SCORE EVALUASI PAI
  // ==========================================
  const slide7 = pptx.addSlide();
  slide7.background = { color: WHITE };

  slide7.addText("MODUL 3 • STANDARISASI EVALUASI PEMBELAJARAN PAI", {
    x: 0.8,
    y: 0.5,
    w: 11.7,
    h: 0.4,
    fontSize: 11,
    color: "2563EB",
    bold: true,
  });
  slide7.addText("Konversi Nilai Mentah ke Skor Baku Z-Score & T-Score", {
    x: 0.8,
    y: 0.9,
    w: 11.7,
    h: 0.5,
    fontSize: 22,
    color: SLATE_DARK,
    bold: true,
    fontFace: "Georgia",
  });

  // Dual Cards: Z vs T
  slide7.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.6,
    w: 5.7,
    h: 4.8,
    fill: { color: "EFF6FF" },
    line: { color: "3B82F6", width: 2 },
  });

  slide7.addText("1. Skor Baku Z (Standard Score)", {
    x: 1.1,
    y: 1.8,
    w: 5.1,
    h: 0.4,
    fontSize: 14,
    color: "1E40AF",
    bold: true,
  });

  slide7.addText("Z = (X - X̄) / s", {
    x: 1.1,
    y: 2.3,
    w: 5.1,
    h: 0.5,
    fontSize: 18,
    color: "1D4ED8",
    bold: true,
    fontFace: "Courier New",
  });

  slide7.addText(
    [
      { text: "Karakteristik Teoretis Z-Score:\n", options: { bold: true } },
      { text: "• Memiliki nilai rata-rata (Mean, μ) = 0\n" },
      { text: "• Memiliki standar deviasi (σ) = 1.0\n" },
      { text: "• Mengukur jarak skor siswa terhadap Mean dalam satuan standar deviasi (SD).\n\n" },
      { text: "Kelemahan Praktis dalam Raport PAI:\n", options: { bold: true } },
      { text: "• Mengandung nilai negatif (misal: Z = -1.5) dan desimal.\n" },
      { text: "• Berpotensi menurunkan motivasi psikologis siswa jika dicantumkan langsung di lembar evaluasi." },
    ],
    { x: 1.1, y: 3.0, w: 5.1, h: 3.1, fontSize: 11, fontFace: "Calibri" }
  );

  slide7.addShape(pptx.ShapeType.roundRect, {
    x: 6.8,
    y: 1.6,
    w: 5.7,
    h: 4.8,
    fill: { color: "ECFDF5" },
    line: { color: "10B981", width: 2 },
  });

  slide7.addText("2. Transformasi T-Score (McCall, 1939)", {
    x: 7.1,
    y: 1.8,
    w: 5.1,
    h: 0.4,
    fontSize: 14,
    color: "065F46",
    bold: true,
  });

  slide7.addText("T = 50 + 10(Z)", {
    x: 7.1,
    y: 2.3,
    w: 5.1,
    h: 0.5,
    fontSize: 18,
    color: "047857",
    bold: true,
    fontFace: "Courier New",
  });

  slide7.addText(
    [
      { text: "Karakteristik Teoretis T-Score:\n", options: { bold: true } },
      { text: "• Memiliki nilai rata-rata patokan (Mean) = 50\n" },
      { text: "• Memiliki standar deviasi (SD) = 10\n" },
      { text: "• Seluruh nilai selalu positif dan umumnya berkisar antara 20 s.d. 80.\n\n" },
      { text: "Keunggulan Pedagogis Evaluasi PAI:\n", options: { bold: true } },
      { text: "• Menghilangkan angka minus dan pecahan desimal.\n" },
      { text: "• Memudahkan perbandingan adil antarkelas atau antarmata pelajaran PAI (misal: Fiqih vs SKI vs Akidah Akhlak)." },
    ],
    { x: 7.1, y: 3.0, w: 5.1, h: 3.1, fontSize: 11, fontFace: "Calibri" }
  );

  slide7.addNotes(
    "Z-score dan T-score menghindarkan pendidik dari bias instrumen (misal instrumen terlalu mudah atau terlalu sulit)."
  );

  // ==========================================
  // SLIDE 8: MODUL 3 - MATRIKS MUTU AKADEMIK PAI
  // ==========================================
  const slide8 = pptx.addSlide();
  slide8.background = { color: WHITE };

  slide8.addText("MODUL 3 • MATRIKS MUTU PEMBELAJARAN PAI", {
    x: 0.8,
    y: 0.5,
    w: 11.7,
    h: 0.4,
    fontSize: 11,
    color: "2563EB",
    bold: true,
  });
  slide8.addText("Distribusi Mutu Capaian Kompetensi Berdasarkan Skor Baku", {
    x: 0.8,
    y: 0.9,
    w: 11.7,
    h: 0.5,
    fontSize: 22,
    color: SLATE_DARK,
    bold: true,
    fontFace: "Georgia",
  });

  const matrixRows = [
    [
      { text: "Predikat / Mutu PAI", options: { bold: true, fill: { color: "1E3A8A" }, color: WHITE } },
      { text: "Kriteria Z-Score", options: { bold: true, fill: { color: "1E3A8A" }, color: WHITE, align: "center" } },
      { text: "Kriteria T-Score", options: { bold: true, fill: { color: "1E3A8A" }, color: WHITE, align: "center" } },
      { text: "Jumlah Siswa", options: { bold: true, fill: { color: "1E3A8A" }, color: WHITE, align: "center" } },
      { text: "Persentase", options: { bold: true, fill: { color: "1E3A8A" }, color: WHITE, align: "center" } },
      { text: "Rekomendasi Tindak Lanjut Pedagogis", options: { bold: true, fill: { color: "1E3A8A" }, color: WHITE } },
    ],
    [
      { text: "Mumtaz (Sangat Tinggi)", options: { bold: true, color: "065F46" } },
      { text: "Z ≥ +2.0", options: { align: "center", bold: true } },
      { text: "T ≥ 70", options: { align: "center", bold: true } },
      { text: String(catMumtaz), options: { align: "center", bold: true, color: "065F46" } },
      { text: `${((catMumtaz / stats.count) * 100).toFixed(1)}%`, options: { align: "center" } },
      { text: "Pengayaan materi studi kritis dan penulisan karya ilmiah PAI." },
    ],
    [
      { text: "Jayyid Jiddan (Tinggi)", options: { bold: true, color: "1D4ED8" } },
      { text: "+1.0 ≤ Z < +2.0", options: { align: "center" } },
      { text: "60 ≤ T < 70", options: { align: "center" } },
      { text: String(catTinggi), options: { align: "center", bold: true, color: "1D4ED8" } },
      { text: `${((catTinggi / stats.count) * 100).toFixed(1)}%`, options: { align: "center" } },
      { text: "Studi kasus analitis dan pendalaman pemecahan masalah PAI." },
    ],
    [
      { text: "Jayyid / Maqbul (Sedang)", options: { bold: true, color: SLATE_DARK } },
      { text: "-1.0 ≤ Z < +1.0", options: { align: "center" } },
      { text: "40 ≤ T < 60", options: { align: "center" } },
      { text: String(catSedang), options: { align: "center", bold: true } },
      { text: `${((catSedang / stats.count) * 100).toFixed(1)}%`, options: { align: "center" } },
      { text: "Pemantapan konsep reguler dan evaluasi berkala." },
    ],
    [
      { text: "Dha'if (Rendah)", options: { bold: true, color: "B45309" } },
      { text: "-2.0 ≤ Z < -1.0", options: { align: "center" } },
      { text: "30 ≤ T < 40", options: { align: "center" } },
      { text: String(catRendah), options: { align: "center", bold: true, color: "B45309" } },
      { text: `${((catRendah / stats.count) * 100).toFixed(1)}%`, options: { align: "center" } },
      { text: "Bimbingan remedial terstruktur dan tutor sebaya." },
    ],
    [
      { text: "Dha'if Jiddan (Sangat Rendah)", options: { bold: true, color: "BE123C" } },
      { text: "Z < -2.0", options: { align: "center" } },
      { text: "T < 30", options: { align: "center" } },
      { text: String(catSangatRendah), options: { align: "center", bold: true, color: "BE123C" } },
      { text: `${((catSangatRendah / stats.count) * 100).toFixed(1)}%`, options: { align: "center" } },
      { text: "Remedial intensif, diagnosis kesulitan belajar dan konseling edukatif." },
    ],
  ];

  slide8.addTable(matrixRows as any, {
    x: 0.8,
    y: 1.6,
    w: 11.7,
    h: 4.8,
    colW: [2.5, 1.4, 1.4, 1.2, 1.2, 4.0],
    fontSize: 10.5,
    border: { pt: 0.5, color: "CBD5E1" },
  });

  slide8.addNotes(
    "Matriks mutu ini memberikan panduan aksi nyata bagi dosen/guru PAI dalam menerapkan pembelajaran berdiferensiasi."
  );

  // ==========================================
  // SLIDE 9: MODUL 4 - GRAFIK STATISTIK PENDIDIKAN
  // ==========================================
  const slide9 = pptx.addSlide();
  slide9.background = { color: WHITE };

  slide9.addText("MODUL 4 • GRAFIK STATISTIK PENDIDIKAN", {
    x: 0.8,
    y: 0.5,
    w: 11.7,
    h: 0.4,
    fontSize: 11,
    color: "7C3AED",
    bold: true,
  });
  slide9.addText("4 Model Visualisasi Data Hasil Belajar Mahasiswa", {
    x: 0.8,
    y: 0.9,
    w: 11.7,
    h: 0.5,
    fontSize: 22,
    color: SLATE_DARK,
    bold: true,
    fontFace: "Georgia",
  });

  const chartCards = [
    {
      name: "1. Histogram & Poligon",
      sub: "Distribusi Frekuensi Aktual",
      points: [
        "Batang histogram mewakili frekuensi kelas (fi) berdasar batas nyata.",
        "Garis poligon menghubungkan titik tengah kelas (Xi).",
        "Menampilkan profil distribusi frekuensi data berkelompok.",
      ],
      color: "047857",
    },
    {
      name: "2. Kurva Normal Baku (Gauss)",
      sub: "Sebaran Probabilitas Simetris",
      points: [
        "Kurva lonceng simetris berpusat pada Mean (Z = 0).",
        "Rentang ±1σ memuat 68.26% populasi responden.",
        "Rentang ±2σ memuat 95.44% responden (wilayah toleransi normal).",
      ],
      color: "0D9488",
    },
    {
      name: "3. Kurva Ogive Dual",
      sub: "Frekuensi Kumulatif (fk)",
      points: [
        "Ogive Positif (menaik) berdasar frekuensi kumulatif kurang dari (fk ≤).",
        "Ogive Negatif (menurun) berdasar frekuensi kumulatif lebih dari (fk ≥).",
        `Titik potong kedua ogive tepat menunjukkan estimasi Median (${stats.median.toFixed(1)}).`,
      ],
      color: "2563EB",
    },
    {
      name: "4. Diagram Kotak Garis (Boxplot)",
      sub: "Ringkasan 5 Angka (5-Number Summary)",
      points: [
        `Min (${stats.min}), Q1 (${stats.q1.toFixed(1)}), Median (${stats.median.toFixed(1)}), Q3 (${stats.q3.toFixed(1)}), Max (${stats.max}).`,
        "Panjang kotak merepresentasikan IQR (50% nilai tengah).",
        "Mendeteksi pencilan (outlier) dan kesimetrisan data.",
      ],
      color: "7C3AED",
    },
  ];

  chartCards.forEach((c, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;
    const xPos = 0.8 + col * 5.95;
    const yPos = 1.6 + row * 2.5;

    slide9.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: yPos,
      w: 5.7,
      h: 2.3,
      fill: { color: "F8FAFC" },
      line: { color: c.color, width: 2 },
    });

    slide9.addText(c.name, {
      x: xPos + 0.2,
      y: yPos + 0.15,
      w: 5.3,
      h: 0.3,
      fontSize: 12.5,
      color: c.color,
      bold: true,
    });

    slide9.addText(c.sub, {
      x: xPos + 0.2,
      y: yPos + 0.45,
      w: 5.3,
      h: 0.25,
      fontSize: 10,
      color: SLATE_MUTED,
      bold: true,
    });

    slide9.addText(
      c.points.map((p) => `• ${p}\n`).join(""),
      {
        x: xPos + 0.2,
        y: yPos + 0.75,
        w: 5.3,
        h: 1.45,
        fontSize: 10,
        color: SLATE_DARK,
        fontFace: "Calibri",
      }
    );
  });

  slide9.addNotes(
    "Visualisasi grafik memberikan pemahaman intuitif bagi penguji tesis dan pembaca laporan tentang sebaran skor mahasiswa."
  );

  // ==========================================
  // SLIDE 10: SINTESIS & IMPLIKASI PEDAGOGIS PAI
  // ==========================================
  const slide10 = pptx.addSlide();
  slide10.background = { color: EMERALD_DARK };

  slide10.addText("SINTESIS AKHIR & REKOMENDASI", {
    x: 0.8,
    y: 0.8,
    w: 11.7,
    h: 0.4,
    fontSize: 13,
    color: GOLD,
    bold: true,
  });

  slide10.addText("Implikasi Pedagogis bagi Pembelajaran & Evaluasi PAI", {
    x: 0.8,
    y: 1.4,
    w: 11.7,
    h: 0.7,
    fontSize: 26,
    color: WHITE,
    bold: true,
    fontFace: "Georgia",
  });

  slide10.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 2.3,
    w: 11.7,
    h: 4.4,
    fill: { color: "065F46" },
    line: { color: "10B981", width: 1.5 },
  });

  slide10.addText(
    [
      { text: "1. Pemaknaan Nilai Berkeadilan (Fair Assessment):\n", options: { bold: true, fontSize: 13, color: GOLD } },
      {
        text: `   Evaluasi PAI tidak boleh semata-mata mengandalkan skor mentah. Transformasi Z-Score dan T-Score menjamin keadilan penilaian di lintas kelas dan lintas pengampu.\n\n`,
        options: { color: WHITE },
      },
      { text: "2. Diferensiasi Pembelajaran PAI:\n", options: { bold: true, fontSize: 13, color: GOLD } },
      {
        text: `   Dengan ditemukannya ${catMumtaz + catTinggi} mahasiswa (${(((catMumtaz + catTinggi) / stats.count) * 100).toFixed(1)}%) pada kategori tinggi dan ${catRendah + catSangatRendah} mahasiswa (${(((catRendah + catSangatRendah) / stats.count) * 100).toFixed(1)}%) pada kategori rendah, pendidik wajib menyusun program pengayaan dan remedial secara terarah.\n\n`,
        options: { color: WHITE },
      },
      { text: "3. Validasi Kurikuler & Konstruk Instrumen:\n", options: { bold: true, fontSize: 13, color: GOLD } },
      {
        text: `   Koefisien variasi ${stats.coefVariation.toFixed(2)}% dan kemiringan ${stats.skewness.toFixed(3)} membuktikan bahwa instrumen tes memiliki daya pembeda yang memadai tanpa polarisasi ekstrem.\n\n`,
        options: { color: WHITE },
      },
      { text: "4. Rekomendasi Penulisan Tesis Magister PAI:\n", options: { bold: true, fontSize: 13, color: GOLD } },
      {
        text: `   Integrasikan 4 pilar ini ke dalam Subbab Deskripsi Data dan Pembahasan Hasil Penelitian pada Bab IV untuk memperkuat argumen metodologis tesis.`,
        options: { color: "A7F3D0" },
      },
    ],
    { x: 1.1, y: 2.5, w: 11.1, h: 4.0, fontSize: 11, fontFace: "Calibri" }
  );

  slide10.addNotes(
    "Slide penutup ini merangkum esensi pedagogis dan metodologis statistik bagi mahasiswa pascasarjana S2 PAI."
  );

  // Save the presentation file
  const sanitizedName = variableName
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  const sanitizedInst = (groupInfo?.institutionName || "UIN")
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .slice(0, 25);
  const sanitizedGroup = (groupInfo?.groupName || "Kelompok")
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  const fileName = groupInfo?.isGroupAssignment
    ? `Tugas_${sanitizedGroup}_${sanitizedInst}_Statistik_PAI_${sanitizedName || "Data"}.pptx`
    : `Modul_PPT_Statistik_S2_PAI_${sanitizedName || "Lengkap"}.pptx`;

  await pptx.writeFile({ fileName });
}
