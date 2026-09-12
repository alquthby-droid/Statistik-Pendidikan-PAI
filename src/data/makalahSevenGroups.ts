import { GroupMember, ResearchAttachment } from "../types";
import { LOGO_IAI_ASA_DATA_URI } from "../assets/logoIaiAsa";

export interface PaperNarrativeDetail {
  title: string;
  schedule: string; // e.g. "PERKULIAHAN KE 2"
  shortTopic: string;
  abstract: string;
  background: string;
  methodologyFocus: string;
  statisticalMetrics: string[];
  paiImplications: string;
  keyConclusions: string[];
}

export interface SevenGroupMakalahDefinition {
  groupNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  roman: "I" | "II" | "III" | "IV" | "V" | "VI" | "VII";
  groupName: string;
  leader: string;
  rawMembers: string[];
  members: GroupMember[];
  lecturer: string;
  lecturerNip: string;
  paper1: PaperNarrativeDetail;
  paper2: PaperNarrativeDetail;
}

export const IAI_ASA_SEVEN_GROUPS_DEFINITIONS: SevenGroupMakalahDefinition[] = [
  // ====================================================================
  // KELOMPOK 1
  // ====================================================================
  {
    groupNumber: 1,
    roman: "I",
    groupName: "Kelompok 1",
    leader: "Andriani",
    rawMembers: ["Andriani", "Imam Kafali", "Alya Mawardah", "Amin"],
    lecturer: "Dr. Isti Nurhayati, M.Pd",
    lecturerNip: "KD-07",
    members: [
      { id: "1-1", name: "Andriani", nim: "25286130009", role: "Ketua Kelompok & Analis Variabel PAI" },
      { id: "1-2", name: "Imam Kafali", nim: "25286130013", role: "Analis Populasi & Teknik Sampling" },
      { id: "1-3", name: "Alya Mawardah", nim: "25286130019", role: "Analis Uji Komparatif Parametrik & Non-Parametrik" },
      { id: "1-4", name: "Amin", nim: "25286130021", role: "Penyusun Naskah Makalah & Verifikator Output" },
    ],
    paper1: {
      title: "Peran statistik; populasi/sampel; variabel",
      schedule: "PERKULIAHAN KE 2",
      shortTopic: "Peran Statistik, Penentuan Populasi-Sampel, dan Operasionalisasi Variabel PAI",
      abstract:
        "Makalah ini menelaah posisi epistemologis statistika dalam metodologi penelitian Pendidikan Agama Islam (PAI). Fokus kajian mencakup demarkasi populasi target vs terjangkau, formula penentuan ukuran sampel representatif, serta taksonomi variabel penelitian (independen, dependen, moderator, intervening) guna membangun desain investigasi empiris yang valid.",
      background:
        "Penelitian di bidang Pendidikan Agama Islam sering kali dihadapkan pada tantangan obyektivitas pengukuran fenomena keagamaan. Statistika berperan bukan sekadar alat hitung aritmetika, melainkan instrumen kuantifikasi empiris yang mentransformasikan konstruk abstrak—seperti religiusitas, akhlak karimah, dan motivasi beribadah—menjadi data terukur yang dapat diuji secara ilmiah.",
      methodologyFocus:
        "Menetapkan kriteria inklusi dan eksklusi populasi satuan pendidikan Islam, menerapkan teknik probability sampling (Stratified Random Sampling) untuk menjamin keterwakilan gender dan kelas, serta menyusun definisi operasional variabel berbasis indikator perilaku yang terkalibrasi.",
      statisticalMetrics: [
        "Ukuran Populasi (N) vs Sampel (n) via Formula Slovin / Isaac & Michael",
        "Tingkat Presisi (Margin of Error: e = 0.05)",
        "Demarkasi Skala Variabel (Nominal, Ordinal, Interval)",
        "Koefisien Representativitas Sampel",
      ],
      paiImplications:
        "Memberikan kerangka metodologis yang kokoh bagi mahasiswa S2 PAI dalam mendesain tesis kuantitatif di madrasah atau pesantren tanpa terjebak dalam bias generalisasi sampel yang terlalu sempit.",
      keyConclusions: [
        "Statistika merupakan jembatan obyektif antara teori pedagogik Islam dengan realitas empiris di kelas.",
        "Ketepatan sampling berbanding lurus dengan validitas eksternal generalisasi temuan penelitian.",
        "Variabel penelitian PAI menuntut definisi operasional yang ketat agar tidak terjadi tumpang tindih indikator.",
      ],
    },
    paper2: {
      title: "Paired/independent; Wilcoxon/MW",
      schedule: "PERKULIAHAN KE 7",
      shortTopic: "Komparasi Dua Sampel Berpasangan & Independen (Uji Parametrik t-Test vs Non-Parametrik Wilcoxon & Mann-Whitney)",
      abstract:
        "Makalah ini mengkaji prosedur pengujian komparatif dua sampel dalam konteks evaluasi efektivitas model pembelajaran PAI. Pembahasan mencakup uji Paired Sample t-Test dan Independent Sample t-Test pada data berdistribusi normal, serta alternatif non-parametrik uji Wilcoxon Signed-Rank dan Mann-Whitney U Test saat asumsi parametrik terlanggar.",
      background:
        "Eksperimentasi pembelajaran PAI (misal perbandingan metode Ta'lim berbasis digital vs konvensional) memerlukan verifikasi inferensial yang tepat guna memastikan apakah perbedaan hasil belajar pre-test dan post-test atau perbedaan antarkelas eksperimen-kontrol terjadi secara signifikan secara statistik atau semata karena kebetulan acak.",
      methodologyFocus:
        "Pemeriksaan asumsi normalitas (Shapiro-Wilk) dan homogenitas varians (Levene's Test). Apabila data memenuhi asumsi parametrik, dilakukan Paired t-test atau Independent t-test. Apabila data miring (skewed) atau berupa skala ordinal, analisis dialihkan ke Wilcoxon Signed-Rank Test untuk data berpasangan dan Mann-Whitney U Test untuk dua kelompok independen.",
      statisticalMetrics: [
        "Derajat Kebebasan (df) dan Nilai Statistik t-hitung vs t-tabel",
        "Statistik U Mann-Whitney & Statistik W Wilcoxon",
        "Signifikansi Asimtotik (p-value, α = 0.05)",
        "Ukuran Efek Komparasi (Cohen's d dan r rank-biserial)",
      ],
      paiImplications:
        "Memampukan peneliti mengevaluasi intervensi pedagogik keagamaan (seperti pembiasaan shalat dhuha atau metode sorogan modern) secara adil dan terbukti secara empiris memberikan dampak positif signifikan terhadap prestasi belajar peserta didik.",
      keyConclusions: [
        "Uji t-test berpasangan ideal untuk desain quasi-eksperimen one-group pretest-posttest pembelajaran PAI.",
        "Uji Mann-Whitney dan Wilcoxon menjamin integritas analisis saat ukuran sampel kecil (N < 30) atau data afektif berskala ordinal.",
        "Pelaporan p-value wajib disertai ukuran efek (effect size) untuk membuktikan signifikansi praktis di madrasah.",
      ],
    },
  },

  // ====================================================================
  // KELOMPOK 2
  // ====================================================================
  {
    groupNumber: 2,
    roman: "II",
    groupName: "Kelompok 2",
    leader: "Sugiarto",
    rawMembers: ["Sugiarto", "Dewi", "Nurul Aulia", "Taufik Hidayat"],
    lecturer: "Dr. Isti Nurhayati, M.Pd",
    lecturerNip: "KD-07",
    members: [
      { id: "2-1", name: "Sugiarto", nim: "25286130005", role: "Ketua Kelompok & Penelaah Skala Pengukuran" },
      { id: "2-2", name: "Dewi Purnamasari", nim: "25286130017", role: "Analis Konstruksi Pertanyaan & Kuesioner" },
      { id: "2-3", name: "Nurul Aulia", nim: "25286130001", role: "Analis Varians ANOVA & Estimasi Ukuran Efek" },
      { id: "2-4", name: "Taupik Hidayat", nim: "25286130006", role: "Penelaah Etika Akademis & Uji Kruskal-Wallis" },
    ],
    paper1: {
      title: "Skala; pertanyaan; etika dan integrasi",
      schedule: "PERKULIAHAN KE 2",
      shortTopic: "Skala Pengukuran Psikometri, Konstruksi Instrumen, Etika Penelitian, dan Integrasi Nilai Islam",
      abstract:
        "Kajian komprehensif mengenai perancangan instrumen pengukuran sikap dan pengetahuan keagamaan. Membedah skala Likert, Guttman, Thurstone, dan Semantic Differential, kaidah penulisan butir instrumen bebas bias konfirmasi, standar etika penelitian (informed consent, kerahasiaan), serta integrasi nilai-nilai amanah dan shiddiq dalam pengumpulan data kuantitatif.",
      background:
        "Kualitas kesimpulan statistika ditentukan oleh validitas instrumen pengukuran awal. Dalam ranah afektif PAI (seperti sikap toleransi beragama dan internalisasi adab), penyusunan skala butir yang ambigu atau mengarahkan jawaban (leading questions) akan mendistorsi data dan merusak integritas riset pascasarjana.",
      methodologyFocus:
        "Mendesain angket berskala Likert 5 poin dengan butir positif (favorable) dan negatif (unfavorable) seimbang, menguji validitas isi (Aiken's V) melalui expert judgment dosen PAI, serta menegakkan protokol etika penelitian berbasis perlindungan data responden madrasah.",
      statisticalMetrics: [
        "Koefisien Validitas Isi Aiken's V (ambang V ≥ 0.78)",
        "Uji Validitas Butir Korelasi Product Moment Pearson (r-hitung > r-tabel)",
        "Koefisien Reliabilitas Cronbach's Alpha (α ≥ 0.70)",
        "Distribusi Respon dan Tingkat Skewness Butir",
      ],
      paiImplications:
        "Mencegah terjadinya 'social desirability bias' di mana santri atau siswa cenderung memberikan jawaban normatif yang diidealkan daripada kondisi pengamalan keagamaan riil mereka.",
      keyConclusions: [
        "Skala pengukuran harus dipilih sesuai dengan sifat konstruk psikologis yang hendak dievaluasi.",
        "Etika penelitian dalam Islam bersandar pada asas kejujuran (shiddiq) dan objektivitas verifikasi data (tabayyun).",
        "Pengujian validitas dan reliabilitas instrumen adalah prasyarat mutlak sebelum data lapangan dianalisis secara statistik.",
      ],
    },
    paper2: {
      title: "ANOVA; KW/Friedman; efek",
      schedule: "PERKULIAHAN KE 7",
      shortTopic: "Analisis Varians Multi-Kelompok (One-Way & Two-Way ANOVA, Kruskal-Wallis, Friedman, dan Ukuran Efek Eta Squared)",
      abstract:
        "Makalah ini menelaah komparasi rata-rata lebih dari dua kelompok perlakuan dalam evaluasi kurikulum PAI. Menjelaskan logika F-ratio pada One-Way ANOVA, uji homogenitas varians Levene, analisis lanjutan Post-Hoc (Tukey HSD / Scheffe), alternatif non-parametrik Kruskal-Wallis (antar kelompok) dan Friedman Test (pengukuran berulang), serta kalkulasi Effect Size Eta Squared (η²).",
      background:
        "Ketika peneliti PAI ingin membandingkan efektivitas tiga metode pembelajaran sekaligus (misalnya: Metode Diskusi Reflektif, Problem-Based Learning, dan Ceramah Interaktif), penerapan uji t berulang kali akan melipatgandakan kesalahan Tipe I (family-wise error rate). ANOVA hadir sebagai solusi simultan yang kokoh.",
      methodologyFocus:
        "Menghitung Sum of Squares Between (SSB) dan Within (SSW), menentukan Mean Square, dan menguji F-hitung terhadap F-tabel. Apabila asumsi homogenitas varians dilanggar, digunakan uji Welch ANOVA atau beralih ke Kruskal-Wallis H-Test. Efek praktis dihitung menggunakan Eta Squared (η²).",
      statisticalMetrics: [
        "Derajat Kebebasan Antar Kelompok (df1 = k - 1) & Dalam Kelompok (df2 = N - k)",
        "F-hitung dan Signifikansi p-value (α = 0.05)",
        "Post-Hoc Pairwise Comparisons (Tukey HSD / Dunnett)",
        "Eta Squared (η² = SSB / SSTotal) dan Partial Eta Squared (ηp²)",
      ],
      paiImplications:
        "Memberikan rekomendasi manajerial berbasis bukti empiris kepada kepala madrasah mengenai metode pembelajaran mana yang secara signifikan paling unggul dalam meningkatkan capaian kognitif dan afektif siswa.",
      keyConclusions: [
        "ANOVA mencegah inflasi alpha saat membandingkan lebih dari dua model pembelajaran PAI.",
        "Uji Post-Hoc krusial untuk melokalisasi pasangan kelompok mana yang berbeda secara signifikan.",
        "Ukuran efek (effect size) membuktikan seberapa besar persentase variasi hasil belajar yang dipengaruhi oleh metode pembelajaran.",
      ],
    },
  },

  // ====================================================================
  // KELOMPOK 3
  // ====================================================================
  {
    groupNumber: 3,
    roman: "III",
    groupName: "Kelompok 3",
    leader: "Sulistiaji",
    rawMembers: ["Sulistiaji", "Wiwin", "Siti Nazmiatun", "Misraji"],
    lecturer: "Dr. Isti Nurhayati, M.Pd",
    lecturerNip: "KD-07",
    members: [
      { id: "3-1", name: "Muhammad Sulistiaji", nim: "25286130002", role: "Ketua Kelompok & Analis Data Screening & Outlier" },
      { id: "3-2", name: "Wiwin winangsih", nim: "25286130023", role: "Penyusun Buku Kode (Codebook) & Missing Value" },
      { id: "3-3", name: "Siti Nazmiatul Muslimah", nim: "25286130018", role: "Analis Korelasi Pearson & Spearman" },
      { id: "3-4", name: "Misraji", nim: "25286130025", role: "Visualisasi Diagram Pencar (Scatterplot) & Coding" },
    ],
    paper1: {
      title: "Coding; missing; outlier; codebook",
      schedule: "PERKULIAHAN KE 3",
      shortTopic: "Manajemen Data Mentah: Sistem Pengkodean, Penanganan Missing Values, Deteksi Pencilan (Outliers), dan Codebook",
      abstract:
        "Makalah ini membahas manajemen data pra-analisis (data hygiene) dalam penelitian pendidikan Islam. Mencakup pembentukan skema koding variabel numerik dan kategorikal, teknik imputasi data hilang (Missing Completely at Random vs Missing at Random), identifikasi data pencilan (univariate & multivariate outliers) menggunakan batas pagar Tukey dan Z-score, serta dokumentasi komprehensif dalam Codebook penelitian.",
      background:
        "Data mentah lapangan hasil kuesioner atau ujian PAI di sekolah sering kali mengandung kekosongan respon, salah entri, atau nilai ekstrim yang tidak masuk akal. Tanpa proses screening yang cermat, analisis lanjutan akan menghasilkan kesimpulan yang bias dan menyesatkan ('garbage in, garbage out').",
      methodologyFocus:
        "Membangun Codebook standar yang memuat nama variabel, label, format tipe data, aturan missing values, dan skala penilaian. Menentukan pencilan ekstrem melalui kriteria Z-score (|Z| > 3.0) dan Rentang Interkuartil (Q1 - 1.5*IQR atau Q3 + 1.5*IQR). Menerapkan metode imputasi data hilang yang proporsional.",
      statisticalMetrics: [
        "Persentase Missing Values per Butir (< 5% vs > 10%)",
        "Ambang Batas Pencilan Z-Score (|Z| ≥ 2.5 atau |Z| ≥ 3.0)",
        "Batas Pagar Tukey: Lower Fence & Upper Fence",
        "Jarak Mahalanobis (D²) untuk deteksi multivariate outlier",
      ],
      paiImplications:
        "Menjamin data asesmen peserta didik madrasah bersih dan andal sehingga setiap evaluasi kelulusan atau akreditasi didasarkan pada basis data yang terverifikasi.",
      keyConclusions: [
        "Penyusunan Codebook merupakan dokumen primer yang menjamin replikasi dan transparansi riset kuantitatif.",
        "Pencilan tidak boleh serta-merta dihapus melainkan harus ditelusuri apakah akibat kesalahan entri atau variasi nyata.",
        "Strategi penanganan data hilang harus didasarkan pada pola mekanismenya agar tidak merusak estimasi parameter.",
      ],
    },
    paper2: {
      title: "Pearson; Spearman; scatterplot",
      schedule: "PERKULIAHAN KE 8",
      shortTopic: "Analisis Asosiasi Bivariat: Korelasi Pearson Product Moment, Spearman Rank, dan Visualisasi Diagram Pencar",
      abstract:
        "Makalah ini mengeksplorasi hubungan linier dan monotonik antar dua variabel kuantitatif dalam riset PAI. Membandingkan koefisien korelasi parametrik Pearson (r) pada data interval berdistribusi normal dengan koefisien non-parametrik Spearman (ρ / rs) pada data ordinal, dilengkapi interpretasi koefisien determinasi (r²) dan visualisasi scatterplot untuk mendeteksi arah serta kekuatan hubungan.",
      background:
        "Dalam kajian pendidikan Islam, banyak hipotesis dirumuskan dalam bentuk hubungan, seperti korelasi antara kecerdasan emosional spiritual (ESQ) dengan kedisiplinan beribadah santri. Analisis korelasi menyediakan dasar matematis untuk mengukur keeratan dan arah hubungan tersebut secara kuantitatif.",
      methodologyFocus:
        "Menguji asumsi linearitas melalui inspeksi grafik scatterplot dan uji Linieritas ANOVA. Menghitung koefisien korelasi r Pearson menggunakan rumus kovarians terstandarisasi atau Spearman rho berdasarkan pemeringkatan rank. Menetapkan signifikansi uji dua sisi (two-tailed test) pada tingkat keyakinan 95%.",
      statisticalMetrics: [
        "Koefisien Korelasi r (-1.00 s/d +1.00)",
        "Koefisien Determinasi (r² × 100%)",
        "Nilai t-hitung korelasi vs t-tabel",
        "Kemiringan Garis Tren (Trendline Slope) pada Scatterplot",
      ],
      paiImplications:
        "Menjelaskan seberapa kuat faktor kultural religiusitas di rumah berkolaborasi dengan efektivitas pengajaran guru PAI di sekolah terhadap pembentukan karakter anak.",
      keyConclusions: [
        "Korelasi membuktikan derajat hubungan, namun tidak serta merta membuktikan hubungan sebab-akibat (kausalitas).",
        "Visualisasi scatterplot wajib ditampilkan sebelum melaporkan angka r guna menghindari jebakan pencilan yang memalsukan korelasi.",
        "Korelasi Spearman merupakan alternatif yang sangat tepat untuk data hasil angket persepsi keagamaan berskala ordinal.",
      ],
    },
  },

  // ====================================================================
  // KELOMPOK 4
  // ====================================================================
  {
    groupNumber: 4,
    roman: "IV",
    groupName: "Kelompok 4",
    leader: "Moh Hudri",
    rawMembers: ["Moh Hudri", "Lalu Johan Fawwaz", "Muliadi", "Chaerun Nazirin"],
    lecturer: "Dr. Isti Nurhayati, M.Pd",
    lecturerNip: "KD-07",
    members: [
      { id: "4-1", name: "MOH HUDRI", nim: "25286130003", role: "Ketua Kelompok & Analis Tendensi Sentral & Frekuensi" },
      { id: "4-2", name: "L. Johan Fawaz", nim: "25286130024", role: "Analis Ukuran Posisi (Kuartil, Desil, Persentil)" },
      { id: "4-3", name: "MULIADI", nim: "25286130015", role: "Analis Regresi Linier Sederhana & Residual" },
      { id: "4-4", name: "CHAERUN NAZIRIN", nim: "25286130029", role: "Analis Koefisien Determinasi R² & Pengaruh Kausalitas" },
    ],
    paper1: {
      title: "Frekuensi; pusat; posisi",
      schedule: "PERKULIAHAN KE 3",
      shortTopic: "Distribusi Frekuensi, Ukuran Pemusatan Data (Mean, Median, Modus), dan Ukuran Letak Posisi (Kuartil, Desil, Persentil)",
      abstract:
        "Makalah ini mengupas struktur deskriptif data evaluasi hasil belajar PAI. Mengulas pembentukan tabel distribusi frekuensi tunggal dan bergolong, komparasi karakteristik matematis ukuran pemusatan (Mean aritmetika, Median bebas outlier, Modus titik modus), serta ukuran posisi (Kuartil Q1-Q3, Desil D1-D9, Persentil P1-P99) sebagai dasar penentuan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP).",
      background:
        "Nilai ujian siswa PAI tidak dapat diinterpretasikan secara bermakna jika hanya dilihat sebagai angka-angka tunggal yang terisolasi. Peneliti dan pendidik memerlukan ukuran ringkasan pemusatan dan letak posisi untuk mengetahui di mana letak kemampuan mayoritas peserta didik dan bagaimana posisi relatif masing-masing individu.",
      methodologyFocus:
        "Menghitung rata-rata hitung data tunggal dan berkelompok via titik tengah (Xi), menentukan letak median dan modus kelas frekuensi tertinggi, serta menghitung kuartil bawah (Q1) dan kuartil atas (Q3) untuk memetakan kelompok berprestasi tinggi, sedang, dan perlu bimbingan khusus.",
      statisticalMetrics: [
        "Mean (Rata-rata Hitung: x̄ = ΣfiXi / Σfi)",
        "Median (Nilai Tengah: Me = Tb + [½n - Fk] / f * c)",
        "Modus (Skor Terbanyak: Mo = Tb + [d1 / (d1+d2)] * c)",
        "Kuartil 1 (25%), Median/Q2 (50%), Kuartil 3 (75%)",
      ],
      paiImplications:
        "Menjadi instrumen penting bagi guru PAI dalam mendiferensiasi materi ajar: siswa di bawah kuartil pertama diberikan program pengayaan remedial, sedangkan siswa di atas kuartil ketiga diberikan materi pengayaan.",
      keyConclusions: [
        "Mean sangat sensitif terhadap nilai ekstrem, sehingga pada data berdistribusi miring Median adalah ukuran pusat yang lebih representatif.",
        "Modus merefleksikan nilai capaian yang paling umum diraih oleh peserta didik dalam suatu kompetensi dasar PAI.",
        "Ukuran posisi memungkinkan standardisasi pelaporan prestasi santri yang adil tanpa terpengaruh perbedaan tingkat kesulitan soal antarkelas.",
      ],
    },
    paper2: {
      title: "Regresi; residual; R²; pengaruh",
      schedule: "PERKULIAHAN KE 8",
      shortTopic: "Analisis Regresi Linier, Uji Asumsi Residual, Koefisien Determinasi R², dan Estimasi Pengaruh Kausalitas PAI",
      abstract:
        "Makalah ini membedah pemodelan regresi linier sederhana dan berganda dalam mengestimasi pengaruh variabel prediktor terhadap variabel kriteria dalam pendidikan Islam. Mengulas formulasi garis regresi kuadrat terkecil (OLS: Ŷ = a + bX), pemeriksaan asumsi klasik pada residual (normalitas, homoskedastisitas, non-autokorelasi), koefisien determinasi R² dan adjusted R², serta uji signifikansi F-simultan dan t-parsial.",
      background:
        "Banyak penelitian tesis magister PAI bermaksud menguji apakah terdapat pengaruh positif dan signifikan dari kepemimpinan transformasional kepala madrasah atau kompetensi pedagogik guru terhadap mutu pembelajaran PAI. Analisis regresi menyediakan persamaan matematis untuk memprediksi dan mengukur besar pengaruh tersebut.",
      methodologyFocus:
        "Mencari estimator parameter regresi (konstanta a dan koefisien arah regresi b) dengan metode Ordinary Least Squares. Melakukan uji normalitas residual dengan Kolmogorov-Smirnov atau P-P Plot. Menghitung nilai R² untuk mengetahui proporsi varians variabel dependen yang mampu dijelaskan oleh model prediktor.",
      statisticalMetrics: [
        "Persamaan Regresi: Ŷ = a + b₁X₁ + b₂X₂",
        "Koefisien Determinasi R² (0 s/d 1.00) & Adjusted R²",
        "Uji F Simultan (Goodness of Fit Model)",
        "Uji t Parsial Koefisien Regresi (p < 0.05)",
        "Standar Error Estimasi Residual (SEe)",
      ],
      paiImplications:
        "Memberikan bukti matematis yang valid untuk merumuskan kebijakan manajerial di sekolah Islam: mengetahui variabel mana yang memberikan kontribusi sumbangan efektif tertinggi terhadap pembentukan karakter islami siswa.",
      keyConclusions: [
        "Regresi memungkinkan fungsi prediksi terhadap nilai capaian pembelajaran PAI di masa depan berdasarkan tren saat ini.",
        "Pelanggaran asumsi residual (seperti heteroskedastisitas) menyebabkan penduga parameter menjadi tidak efisien (tidak BLUE).",
        "Nilai R² yang tinggi harus diinterpretasikan secara kritis bersamaan dengan substansi teoretis pedagogik Islam.",
      ],
    },
  },

  // ====================================================================
  // KELOMPOK 5 (Husni dkk. - Pengembang Sistem Utama)
  // ====================================================================
  {
    groupNumber: 5,
    roman: "V",
    groupName: "Kelompok 5",
    leader: "Miftahudin",
    rawMembers: ["Miftahudin", "Rizki Wan Hadi", "R Bambang", "Husni"],
    lecturer: "Dr. Isti Nurhayati, M.Pd",
    lecturerNip: "KD-07",
    members: [
      { id: "5-1", name: "MIFTAHUDIN", nim: "25286130010", role: "Ketua Kelompok & Analis Dispersi & Varians" },
      { id: "5-2", name: "Rizky wan Hadi", nim: "25286130012", role: "Analis Distribusi Frekuensi Aturan Sturges" },
      { id: "5-3", name: "R Bambang Dwi Minardi", nim: "25286130008", role: "Visualisasi Grafik Histogram, Poligon & Ogive" },
      { id: "5-4", name: "HUSNI", nim: "25286130028", role: "Pengembang Komputasi Z-Score, Boxplot & Audit Metodologis (p, CI, Bias)" },
    ],
    paper1: {
      title: "Sebaran; distribusi; z-score; grafik",
      schedule: "PERKULIAHAN KE 4",
      shortTopic: "Ukuran Sebaran/Dispersi, Distribusi Frekuensi Aturan Sturges, Standarisasi Z-Score/T-Score, dan Visualisasi Grafik Lanjut",
      abstract:
        "Makalah ini mengulas kerangka analisis deskriptif inferensial yang menjadi tulang punggung komputasi aplikasi statistik pendidikan ini. Membahas ukuran sebaran data (Range, Simpangan Baku, Varians, Koefisien Variasi), perumusan kelas interval optimal aturan empiris Sturges (k = 1 + 3.322 log N), standarisasi skor z-score dan t-score untuk komparasi prestasi antarkelas, serta visualisasi multi-grafik (Histogram, Poligon Frekuensi, Ogive Kumulatif, dan Box-and-Whisker Plot).",
      background:
        "Dalam pengolahan hasil evaluasi pembelajaran PAI di tingkat pascasarjana, pemahaman nilai rata-rata saja tidak mencukupi untuk menggambarkan keheterogenan kelas. Dua rombongan belajar bisa memiliki nilai rata-rata yang sama (misal 80), namun kelas pertama memiliki sebaran seragam sementara kelas kedua memiliki disparitas nilai yang sangat tajam.",
      methodologyFocus:
        "Menghitung varians dan standar deviasi sampel (s) menggunakan penyebut N-1 (koreksi Bessel). Mengonversi skor mentah ke dalam nilai Z-Score [Z = (X - μ) / σ] dan T-Score [T = 50 + 10Z] guna mengeliminasi bias perbedaan instrumen ujian. Merepresentasikan data secara simultan ke dalam 4 format grafik visual baku.",
      statisticalMetrics: [
        "Rentang / Range (R = Nilai Maksimum - Nilai Minimum)",
        "Aturan Sturges: Jumlah Kelas k = 1 + 3.322 log(N) & Panjang Interval c = R / k",
        "Standar Deviasi Sampel (s) dan Koefisien Variasi (CV %)",
        "Standarisasi Z-Score [-3.00 s/d +3.00] & Nilai T-Score [20 s/d 80]",
        "Kuartil Bawah (Q1), Kuartil Tengah (Q2), Kuartil Atas (Q3), dan Rentang Interkuartil (IQR)",
      ],
      paiImplications:
        "Menyediakan sistem asesmen berbasis standar deviasi yang adil bagi siswa madrasah: guru dapat mengidentifikasi siswa yang berprestasi istimewa (Mumtaz: Z ≥ +1.5) maupun yang memerlukan pendampingan intensif (Dha'if: Z < -1.5) secara objektif.",
      keyConclusions: [
        "Standar deviasi merupakan ukuran variabilitas yang paling stabil dan informatif dalam mengukur keragaman kemampuan santri.",
        "Standarisasi Z-Score meniadakan kelemahan nilai mentah sehingga skor ujian Fiqih, Akidah Akhlak, dan Al-Qur'an Hadis dapat diperbandingkan pada skala standar yang sama.",
        "Kombinasi grafik Histogram, Poligon, Ogive, dan Boxplot memberikan potret sebaran data yang utuh, visual, dan komprehensif.",
      ],
    },
    paper2: {
      title: "Audit p, CI, efek, bias",
      schedule: "PERKULIAHAN KE 9",
      shortTopic: "Audit Metodologis: Reduksionisme p-Value, Interval Kepercayaan (CI 95%), Estimasi Ukuran Efek Praktis, dan Mitigasi Bias Penelitian",
      abstract:
        "Makalah ini melakukan audit kritis terhadap praktik analisis kuantitatif pada riset pendidikan Islam. Menelaah krisis replikasi akibat penyalahgunaan nilai p (p-hacking), mempromosikan pendekatan estimasi berbasis Interval Kepercayaan (Confidence Interval 95%), mengintegrasikan kalkulasi ukuran efek (Effect Size: Cohen's d, Hedges' g, Pearson r), serta mengidentifikasi potensi bias metodologis (attrition bias, confirmation bias, publication bias).",
      background:
        "Kecenderungan peneliti pemula yang hanya memburu label 'signifikan' (p < 0.05) sering mengaburkan pertanyaan terpenting dalam pendidikan Islam: 'Apakah intervensi yang dilakukan memiliki dampak bermakna secara praktis di dunia nyata?'. Pengujian signifikansi nol (NHST) semata tidak cukup tanpa audit interval estimasi dan ukuran efek.",
      methodologyFocus:
        "Mengaudit hasil uji hipotesis dengan menghitung batas bawah dan batas atas CI 95% untuk selisih rata-rata. Menghitung ukuran efek Cohen's d [d = (x̄1 - x̄2) / s_pooled]. Menelaah sensitivitas hasil terhadap kemungkinan bias seleksi responden atau instrumen angket yang bermasalah.",
      statisticalMetrics: [
        "Nilai Exact p-Value vs Ambang Batas Alpha (α = 0.05 / 0.01)",
        "Interval Kepercayaan 95% [x̄ ± 1.96 * SE]",
        "Ukuran Efek Cohen's d: Efek Kecil (0.2), Sedang (0.5), Besar (0.8)",
        "Tingkat Presisi Estimasi (Margin of Error)",
      ],
      paiImplications:
        "Menjamin mutu karya ilmiah tesis magister PAI bebas dari manipulasi data statistik dan memiliki daya terap aplikatif yang nyata bagi transformasi madrasah dan lembaga pendidikan Islam.",
      keyConclusions: [
        "Nilai p hanya menguji keacakan data terhadap hipotesis nol, bukan mengukur besar atau pentingnya dampak intervensi.",
        "Interval kepercayaan 95% memberikan informasi presisi parameter populasi yang jauh lebih kaya daripada sekadar angka biner ya/tidak.",
        "Pelaporan Effect Size adalah standar wajib modern untuk membuktikan kebermaknaan pedagogis riset PAI.",
      ],
    },
  },

  // ====================================================================
  // KELOMPOK 6
  // ====================================================================
  {
    groupNumber: 6,
    roman: "VI",
    groupName: "Kelompok 6",
    leader: "Winda",
    rawMembers: ["Winda", "Mahbub Hasbi", "Muliyono", "Ahmad Sambudi"],
    lecturer: "Dr. Isti Nurhayati, M.Pd",
    lecturerNip: "KD-07",
    members: [
      { id: "6-1", name: "Winda Astariyah Fatimah", nim: "25286130016", role: "Ketua Kelompok & Analis Sampling & Kesalahan Baku" },
      { id: "6-2", name: "Mahbub Hasby", nim: "25286130004", role: "Analis Interval Kepercayaan (CI) & Ukuran Efek" },
      { id: "6-3", name: "MULIYONO", nim: "25286130020", role: "Analis Format Tabel Baku Standar APA Edisi 7" },
      { id: "6-4", name: "Ahmad Sambudi", nim: "25286130011", role: "Penyusun Tata Grafis & Format Pelaporan Bab IV Tesis" },
    ],
    paper1: {
      title: "Sampling; SE; CI; ukuran efek",
      schedule: "PERKULIAHAN KE 4",
      shortTopic: "Teori Inferensi Statistik: Desain Penarikan Sampel, Standard Error (SE), Interval Kepercayaan (CI), dan Kalkulasi Ukuran Efek",
      abstract:
        "Kajian mendalam mengenai fondasi inferensi probabilistik dalam penelitian PAI berdasarkan Teorema Limit Pusat (Central Limit Theorem). Membedah teknik sampling acak vs purposif, kalkulasi Standard Error of the Mean (SE) sebagai ukuran fluktuasi sampling, formulasi selang kepercayaan rata-rata populasi (CI 95% dan 99%), serta estimasi ukuran efek perlakuan pembelajaran.",
      background:
        "Peneliti pendidikan Islam sering kali tidak memiliki sumber daya untuk menguji seluruh guru PAI atau seluruh siswa di suatu wilayah kota/kabupaten. Penarikan sampel yang saintifik disertai kalkulasi kesalahan baku (Standard Error) menjamin estimasi statistik dari sampel dapat digeneralisasi ke populasi secara akurat.",
      methodologyFocus:
        "Membandingkan efisiensi Simple Random Sampling vs Cluster Sampling di madrasah. Menghitung Standard Error rata-rata (SE = s / √N) dan Standard Error proporsi. Mengonstruksi rentang Confidence Interval pada distribusi t-Student (untuk N < 30) dan distribusi Z-Normal (untuk N ≥ 30).",
      statisticalMetrics: [
        "Kesalahan Baku Rata-rata (Standard Error: SE = s / √n)",
        "Confidence Interval 95%: CI = x̄ ± (t_crit * SE)",
        "Faktor Koreksi Populasi Terhingga (Finite Population Correction)",
        "Indeks Ukuran Efek (Hedges' g untuk sampel kecil)",
      ],
      paiImplications:
        "Membantu pengambil kebijakan di Kementerian Agama wilayah dalam melakukan studi akreditasi atau survei karakter siswa dengan biaya efisien namun tingkat akurasi statistik yang terjamin.",
      keyConclusions: [
        "Semakin besar ukuran sampel (n), semakin kecil kesalahan baku (SE), dan semakin sempit rentang interval kepercayaan.",
        "Confidence Interval merefleksikan estimasi parameter populasi riil dengan derajat kepastian ilmiah tertentu.",
        "Ukuran efek menstandarisasi capaian antarstudi riset evaluasi PAI yang berbeda instrumen.",
      ],
    },
    paper2: {
      title: "Tabel; grafik; pelaporan",
      schedule: "PERKULIAHAN KE 9",
      shortTopic: "Standardisasi Diseminasi Hasil Riset: Pembuatan Tabel Standar APA 7, Seleksi Grafik Informatif, dan Pelaporan Bab IV Tesis PAI",
      abstract:
        "Makalah ini mengupas pedoman penyajian data dan tata cara penulisan laporan penelitian kuantitatif pada Bab IV Hasil dan Pembahasan Tesis Magister PAI. Menelaah kaidah tabel standar American Psychological Association (APA) Edisi ke-7 (tanpa garis vertikal), prinsip integritas grafis untuk mencegah distorsi persepsi, serta artikulasi narasi deskriptif yang mengintegrasikan temuan empiris dengan kajian teoretis Islam.",
      background:
        "Sering kali data penelitian yang berharga gagal memberikan kontribusi optimal karena disajikan dalam format tabel yang membingungkan atau visualisasi grafik yang misleading. Penulisan Bab IV tesis pascasarjana menuntut kejelasan visual dan keteraturan naratif yang komunikatif bagi pembaca akademis.",
      methodologyFocus:
        "Mengonstruksi tabel ringkasan statistik deskriptif dan inferensial sesuai format APA 7th Edition (tiga garis horizontal utama). Memilih jenis grafik yang tepat: Histogram/Boxplot untuk data kontinu, Diagram Batang untuk komparasi kategori, dan Garis Tren untuk data longitudinal. Menyusun narasi sintesis temuan kuantitatif dengan landasan dalil naqli.",
      statisticalMetrics: [
        "Kaidah Penomoran & Judul Miring Tabel APA 7",
        "Penyajian Derajat Kebebasan, Nilai Uji, dan Nilai p Eksak (p = .021)",
        "Rasio Tinta-Data (Data-Ink Ratio Tufte) pada Grafik",
        "Penulisan Catatan Kaki Tabel (General, Specific, Probability Notes)",
      ],
      paiImplications:
        "Meningkatkan daya saing dan keterbacaan artikel ilmiah mahasiswa magister PAI untuk tembus pada jurnal nasional terakreditasi SINTA maupun jurnal internasional bereputasi.",
      keyConclusions: [
        "Tabel yang baik adalah tabel yang dapat dipahami sendiri (self-contained) tanpa pembaca harus membaca keseluruhan teks tubuh laporan.",
        "Grafik harus jujur secara visual dengan sumbu vertikal yang proporsional guna menghindari ilusi peningkatan performa semu.",
        "Pembahasan Bab IV bukan sekadar membaca ulang angka-angka tabel, melainkan menjelaskan makna di balik angka dalam kerangka pendidikan Islam.",
      ],
    },
  },

  // ====================================================================
  // KELOMPOK 7
  // ====================================================================
  {
    groupNumber: 7,
    roman: "VII",
    groupName: "Kelompok 7",
    leader: "Siti Humairoh",
    rawMembers: ["Siti Humairoh", "L M Suprial Wahid", "Intan", "Mukhsin", "Agus Mulyadi"],
    lecturer: "Dr. Isti Nurhayati, M.Pd",
    lecturerNip: "KD-07",
    members: [
      { id: "7-1", name: "Siti Khumairoh", nim: "25286130007", role: "Ketua Kelompok & Analis Formulasi Hipotesis & Alpha" },
      { id: "7-2", name: "L.M.SUPRIAL WAHID", nim: "25286130014", role: "Analis Kesalahan Tipe I, Tipe II & Statistical Power" },
      { id: "7-3", name: "Intan Fajri Nurul Ilmi", nim: "25286130026", role: "Analis Alur Kerja Integrasi Data & Kode Komputasi" },
      { id: "7-4", name: "Mukhsin", nim: "25286130022", role: "Verifikator Validitas Output Sintaksis & Tabel" },
      { id: "7-5", name: "AGUS MULIADI", nim: "25286130027", role: "Penyusun Sintesis Luaran & Dokumentasi Ilmiah" },
    ],
    paper1: {
      title: "Hipotesis; p; tipe I/II; power",
      schedule: "PERKULIAHAN KE 5",
      shortTopic: "Epistemologi Uji Hipotesis: Formulasi H0 vs H1, Makna Probabilitas p-Value, Kesalahan Tipe I & II, dan Kekuatan Uji (Statistical Power)",
      abstract:
        "Makalah ini membahas kerangka konseptual pengujian signifikansi hipotesis nol (NHST) dalam riset pendidikan Islam. Menelaah formulasi hipotesis terarah (direksional) dan tidak terarah (non-direksional), makna tingkat signifikansi alpha (α), risiko kesalahan Tipe I (False Positive) dan kesalahan Tipe II (False Negative: β), serta analisis kekuatan uji statistik (Statistical Power = 1 - β) untuk menjamin sensitivitas uji.",
      background:
        "Dalam penelitian evaluasi PAI, peneliti dihadapkan pada ketidakpastian pengambilan keputusan berbasis sampel. Keputusan menolak atau menerima hipotesis efektivitas suatu metode pembelajaran baru di madrasah membawa konsekuensi etis dan pedagogis apabila terjadi kesalahan penarikan kesimpulan.",
      methodologyFocus:
        "Menentukan tingkat signifikansi nominal (biasanya α = 0.05). Mengestimasi nilai power statistik menggunakan parameter ukuran sampel, ukuran efek yang diharapkan, dan alpha melalui kalkulasi power a-priori (G*Power framework). Membandingkan trade-off antara meminimalkan risiko Tipe I dan Tipe II.",
      statisticalMetrics: [
        "Tingkat Signifikansi Alpha (α = 0.05 atau α = 0.01)",
        "Probabilitas Kesalahan Tipe II (Beta: β)",
        "Kekuatan Uji Statistik (Statistical Power: 1 - β ≥ 0.80)",
        "Nilai Kritis Uji Satu Sisi (One-Tailed) vs Dua Sisi (Two-Tailed)",
      ],
      paiImplications:
        "Mencegah klaim berlebihan atas efektivitas suatu modul PAI yang sebenarnya tidak efektif (Tipe I), atau sebaliknya membuang metode yang potensial hanya karena ukuran sampel penelitian terlalu kecil untuk mendeteksi perbedaannya (Tipe II).",
      keyConclusions: [
        "Hipotesis nol (H0) adalah dalil skeptisisme ilmiah yang harus diuji secara empiris sebelum menerima hipotesis kerja (H1).",
        "Kekuatan uji statistik (power) minimal 80% menjamin penelitian memiliki sensitivitas yang memadai untuk mendeteksi efek riil di lapangan.",
        "Pengujian hipotesis harus dilakukan secara jujur dan transparan tanpa melakukan modifikasi data pasca-analisis.",
      ],
    },
    paper2: {
      title: "Integrasi data, kode, output",
      schedule: "PERKULIAHAN KE 10",
      shortTopic: "Manajemen Alur Analisis Terpadu: Integrasi Data Mentah, Kode Komputasi Reusable, Triangulasi Output, dan Rekomendasi Tesis",
      abstract:
        "Makalah ini menguraikan paradigma riset reproducible dalam sains data pendidikan Islam modern. Membahas arsitektur alur kerja mulai dari impor data mentah dari spreadsheet/Google Forms, otomatisasi kalkulasi dengan skrip/kode komputasi (TypeScript/R/Python/SPSS Syntax), validasi konsistensi output statistik terhadap asumsi matematis, hingga sintesis akhir pembahasan tesis yang integratif.",
      background:
        "Pengolahan data manual berbasis copy-paste di lembar kerja spreadsheet sangat rentan terhadap human error, sulit diaudit, dan tidak dapat diulang kembali secara otomatis ketika terjadi pembaruan data sampel responden. Era riset modern menuntut integrasi data dan kode komputasi yang transparan dan dapat diverifikasi secara publik.",
      methodologyFocus:
        "Membangun alur analisis terstruktur: Data Ingestion -> Data Validation -> Statistical Transformation -> Statistical Modeling -> Visualization -> Automated Report Generation. Menerapkan kontrol versi terhadap data dan sintaksis komputasi. Melakukan triangulasi output kuantitatif dengan data kualitatif observasi kelas PAI.",
      statisticalMetrics: [
        "Tingkat Presisi Komputasi Numerik (Floating Point Precision)",
        "Reproducibility Index Skrip Analisis Data",
        "Validasi Silang Output (Cross-Validation Score)",
        "Koherensi Matriks Tabel Data Mentah vs Output Inferensial",
      ],
      paiImplications:
        "Memberdayakan sivitas akademika pascasarjana IAI ASA untuk menghasilkan luaran tesis bereputasi tinggi yang dilengkapi lampiran basis data dan sintaksis analisis yang transparan, profesional, dan dapat dipertanggungjawabkan.",
      keyConclusions: [
        "Integrasi kode komputasi menjamin replikasi penuh terhadap seluruh tabel dan grafik yang ditampilkan dalam tesis.",
        "Otomatisasi alur analisis mempercepat proses audit data oleh dosen pembimbing dan penguji ujian tesis.",
        "Sintesis output statistik yang berpadu dengan pemahaman mendalam tentang falsafah pendidikan Islam menghasilkan rekomendasi pedagogik yang berdampak luas.",
      ],
    },
  },
];

// Helper functions
export const getSevenGroupByNumber = (num: number): SevenGroupMakalahDefinition | undefined => {
  return IAI_ASA_SEVEN_GROUPS_DEFINITIONS.find((g) => g.groupNumber === num);
};

export const getSevenGroupByStudentName = (name: string): SevenGroupMakalahDefinition | undefined => {
  const cleanName = name.toLowerCase();
  return IAI_ASA_SEVEN_GROUPS_DEFINITIONS.find((g) =>
    g.rawMembers.some((m) => cleanName.includes(m.toLowerCase()) || m.toLowerCase().includes(cleanName))
  );
};

// ====================================================================
// VECTOR SVG REPLICA OF THE UPLOADED SCHEDULE TABLE
// "DAFTAR KELOMPOK & MATA KULIAH STATISTIKA PENDIDIKAN
// SEMESTER 2 PASCA SARJANA IAI ASA TAHUN 2026
// Dosen Pengampu : Dr. Isti Nurhayati, M.Pd"
// ====================================================================
export const DAFTAR_KELOMPOK_MAKALAH_DOCUMENT_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 680" width="1000" height="680">
  <defs>
    <style>
      .hdr-main { font-family: 'Times New Roman', serif; font-size: 14px; font-weight: bold; fill: #000; text-anchor: middle; }
      .hdr-sub { font-family: 'Times New Roman', serif; font-size: 13px; font-weight: bold; fill: #000; text-anchor: middle; }
      .lbl-dosen { font-family: 'Times New Roman', serif; font-size: 12px; font-weight: bold; fill: #000; }
      .tbl-hdr { font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #000; text-anchor: middle; }
      .cell-text { font-family: Arial, sans-serif; font-size: 10.5px; fill: #000; }
      .cell-text-bold { font-family: Arial, sans-serif; font-size: 10.5px; font-weight: bold; fill: #000; }
      .cell-center { text-anchor: middle; }
      .exam-banner { font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; fill: #000; text-anchor: middle; letter-spacing: 2px; }
      .table-line { stroke: #000; stroke-width: 1.2; }
      .table-line-thin { stroke: #000; stroke-width: 0.9; }
    </style>
  </defs>

  <!-- Document Canvas Background -->
  <rect x="0" y="0" width="1000" height="680" fill="#ffffff" />

  <!-- Outer Document Border -->
  <rect x="15" y="15" width="970" height="650" fill="none" stroke="#333333" stroke-width="2" />

  <!-- Header Text -->
  <text x="500" y="42" class="hdr-main">DAFTAR KELOMPOK &amp; MATA KULIAH STATISTIKA PENDIDIKAN</text>
  <text x="500" y="60" class="hdr-sub">SEMESTER 2 PASCA SARJANA IAI ASA TAHUN 2026</text>

  <text x="35" y="90" class="lbl-dosen">Dosen Pengampu : Dr. Isti Nurhayati, M.Pd</text>

  <!-- TABLE COORDINATES -->
  <!-- Columns:
       No: x=35, w=35 (35-70)
       Judul Makalah: x=70, w=380 (70-450)
       Kelompok: x=450, w=100 (450-550)
       Anggota Kelompok: x=550, w=235 (550-785)
       JADWAL PRESENTASI: x=785, w=180 (785-965)
       Total Table Width = 930
  -->

  <!-- Table Outer Box -->
  <rect x="35" y="98" width="930" height="545" fill="none" stroke="#000" stroke-width="1.8" />

  <!-- Table Header Row (y=98 to 123, h=25) -->
  <rect x="35" y="98" width="930" height="25" fill="#f8fafc" />
  <line x1="35" y1="123" x2="965" y2="123" class="table-line" />

  <!-- Table Vertical Dividers -->
  <line x1="70" y1="98" x2="70" y2="643" class="table-line" />
  <line x1="450" y1="98" x2="450" y2="643" class="table-line" />
  <line x1="550" y1="98" x2="550" y2="643" class="table-line" />
  <line x1="785" y1="98" x2="785" y2="643" class="table-line" />

  <!-- Table Header Labels -->
  <text x="52.5" y="115" class="tbl-hdr">No</text>
  <text x="260" y="115" class="tbl-hdr">Judul Makalah</text>
  <text x="500" y="115" class="tbl-hdr">Kelompok</text>
  <text x="667.5" y="115" class="tbl-hdr">Anggota Kelompok</text>
  <text x="875" y="115" class="tbl-hdr">JADWAL PRESENTASI</text>

  <!-- Row 1: y=123 to 153 (h=30) -->
  <line x1="35" y1="153" x2="965" y2="153" class="table-line-thin" />
  <text x="52.5" y="142" class="cell-text cell-center">1</text>
  <text x="76" y="142" class="cell-text">Peran statistik; populasi/sampel; variabel</text>
  <text x="500" y="142" class="cell-text-bold cell-center">Kelompok 1</text>
  <text x="556" y="137" class="cell-text">Andriani, Imam Kafali, Alya</text>
  <text x="556" y="149" class="cell-text">Mawardah, Amin</text>

  <!-- Row 2: y=153 to 183 (h=30) -->
  <line x1="35" y1="183" x2="965" y2="183" class="table-line" />
  <text x="52.5" y="172" class="cell-text cell-center">2</text>
  <text x="76" y="172" class="cell-text">Skala; pertanyaan; etika dan integrasi</text>
  <text x="500" y="172" class="cell-text-bold cell-center">Kelompok 2</text>
  <text x="556" y="167" class="cell-text">Sugiarto, Dewi, Nurul Aulia,</text>
  <text x="556" y="179" class="cell-text">Taufik Hidayat</text>
  <!-- Perkuliahan ke 2 Span (Row 1-2) -->
  <text x="875" y="157" class="cell-text-bold cell-center">PERKULIAHAN KE 2</text>

  <!-- Row 3: y=183 to 213 (h=30) -->
  <line x1="35" y1="213" x2="965" y2="213" class="table-line-thin" />
  <text x="52.5" y="202" class="cell-text cell-center">3</text>
  <text x="76" y="197" class="cell-text">Coding; missing;</text>
  <text x="76" y="209" class="cell-text">outlier; codebook</text>
  <text x="500" y="202" class="cell-text-bold cell-center">Kelompok 3</text>
  <text x="556" y="197" class="cell-text">Sulistiaji, Wiwin, Siti</text>
  <text x="556" y="209" class="cell-text">Nazmiatun, Misraji</text>

  <!-- Row 4: y=213 to 243 (h=30) -->
  <line x1="35" y1="243" x2="965" y2="243" class="table-line" />
  <text x="52.5" y="232" class="cell-text cell-center">4</text>
  <text x="76" y="232" class="cell-text">Frekuensi; pusat; posisi</text>
  <text x="500" y="232" class="cell-text-bold cell-center">Kelompok 4</text>
  <text x="556" y="227" class="cell-text">Moh Hudri, Lalu Johan Fawwaz,</text>
  <text x="556" y="239" class="cell-text">Muliadi, Chaerun Nazirin</text>
  <!-- Perkuliahan ke 3 Span (Row 3-4) -->
  <text x="875" y="217" class="cell-text-bold cell-center">PERKULIAHAN KE 3</text>

  <!-- Row 5: y=243 to 273 (h=30) -->
  <line x1="35" y1="273" x2="965" y2="273" class="table-line-thin" />
  <text x="52.5" y="262" class="cell-text cell-center">5</text>
  <text x="76" y="262" class="cell-text">Sebaran; distribusi; z-score; grafik</text>
  <text x="500" y="262" class="cell-text-bold cell-center">Kelompok 5</text>
  <text x="556" y="257" class="cell-text">Miftahudin, Rizki Wan Hadi, R</text>
  <text x="556" y="269" class="cell-text">Bambang, Husni</text>

  <!-- Row 6: y=273 to 303 (h=30) -->
  <line x1="35" y1="303" x2="965" y2="303" class="table-line" />
  <text x="52.5" y="292" class="cell-text cell-center">6</text>
  <text x="76" y="292" class="cell-text">Sampling; SE; CI; ukuran efek</text>
  <text x="500" y="292" class="cell-text-bold cell-center">Kelompok 6</text>
  <text x="556" y="287" class="cell-text">Winda, Mahbub Hasbi,</text>
  <text x="556" y="299" class="cell-text">Muliyono, Ahmad Sambudi</text>
  <!-- Perkuliahan ke 4 Span (Row 5-6) -->
  <text x="875" y="277" class="cell-text-bold cell-center">PERKULIAHAN KE 4</text>

  <!-- Row 7: y=303 to 337 (h=34) -->
  <line x1="35" y1="337" x2="965" y2="337" class="table-line" />
  <text x="52.5" y="324" class="cell-text cell-center">7</text>
  <text x="76" y="324" class="cell-text">Hipotesis; p; tipe I/II; power</text>
  <text x="500" y="324" class="cell-text-bold cell-center">Kelompok 7</text>
  <text x="556" y="318" class="cell-text">Siti Humairoh, L M Suprial</text>
  <text x="556" y="330" class="cell-text">Wahid, Intan, Mukhsin, Agus Mulyadi</text>
  <text x="875" y="324" class="cell-text-bold cell-center">PERKULIAHAN KE 5</text>

  <!-- ROW 8: UTS BANNER (y=337 to 360, h=23) -->
  <rect x="35" y="337" width="930" height="23" fill="#facc15" stroke="#000" stroke-width="1.2" />
  <text x="52.5" y="353" class="cell-text-bold cell-center">8</text>
  <text x="500" y="353" class="exam-banner">UTS</text>

  <!-- Row 9: y=360 to 390 (h=30) -->
  <line x1="35" y1="390" x2="965" y2="390" class="table-line-thin" />
  <text x="52.5" y="379" class="cell-text cell-center">9</text>
  <text x="76" y="379" class="cell-text">Paired/independent; Wilcoxon/MW</text>
  <text x="500" y="379" class="cell-text-bold cell-center">Kelompok 1</text>
  <text x="556" y="374" class="cell-text">Andriani, Imam Kafali, Alya</text>
  <text x="556" y="386" class="cell-text">Mawardah, Amin</text>

  <!-- Row 10: y=390 to 420 (h=30) -->
  <line x1="35" y1="420" x2="965" y2="420" class="table-line" />
  <text x="52.5" y="409" class="cell-text cell-center">10</text>
  <text x="76" y="409" class="cell-text">ANOVA; KW/Friedman; efek</text>
  <text x="500" y="409" class="cell-text-bold cell-center">Kelompok 2</text>
  <text x="556" y="404" class="cell-text">Sugiarto, Dewi, Nurul Aulia,</text>
  <text x="556" y="416" class="cell-text">Taufik Hidayat</text>
  <!-- Perkuliahan ke 7 Span (Row 9-10) -->
  <text x="875" y="394" class="cell-text-bold cell-center">PERKULIAHAN KE 7</text>

  <!-- Row 11: y=420 to 450 (h=30) -->
  <line x1="35" y1="450" x2="965" y2="450" class="table-line-thin" />
  <text x="52.5" y="439" class="cell-text cell-center">11</text>
  <text x="76" y="439" class="cell-text">Pearson; Spearman; scatterplot</text>
  <text x="500" y="439" class="cell-text-bold cell-center">Kelompok 3</text>
  <text x="556" y="434" class="cell-text">Sulistiaji, Wiwin, Siti</text>
  <text x="556" y="446" class="cell-text">Nazmiatun, Misraji</text>

  <!-- Row 12: y=450 to 480 (h=30) -->
  <line x1="35" y1="480" x2="965" y2="480" class="table-line" />
  <text x="52.5" y="469" class="cell-text cell-center">12</text>
  <text x="76" y="469" class="cell-text">Regresi; residual; R²; pengaruh</text>
  <text x="500" y="469" class="cell-text-bold cell-center">Kelompok 4</text>
  <text x="556" y="464" class="cell-text">Moh Hudri, Lalu Johan Fawwaz,</text>
  <text x="556" y="476" class="cell-text">Muliadi, Chaerun Nazirin</text>
  <!-- Perkuliahan ke 8 Span (Row 11-12) -->
  <text x="875" y="454" class="cell-text-bold cell-center">PERKULIAHAN KE 8</text>

  <!-- Row 13: y=480 to 510 (h=30) -->
  <line x1="35" y1="510" x2="965" y2="510" class="table-line-thin" />
  <text x="52.5" y="499" class="cell-text cell-center">13</text>
  <text x="76" y="499" class="cell-text">Audit p, CI, efek, bias</text>
  <text x="500" y="499" class="cell-text-bold cell-center">Kelompok 5</text>
  <text x="556" y="494" class="cell-text">Miftahudin, Rizki Wan Hadi, R</text>
  <text x="556" y="506" class="cell-text">Bambang, Husni</text>

  <!-- Row 14: y=510 to 540 (h=30) -->
  <line x1="35" y1="540" x2="965" y2="540" class="table-line" />
  <text x="52.5" y="529" class="cell-text cell-center">14</text>
  <text x="76" y="529" class="cell-text">Tabel; grafik; pelaporan</text>
  <text x="500" y="529" class="cell-text-bold cell-center">Kelompok 6</text>
  <text x="556" y="524" class="cell-text">Winda, Mahbub Hasbi,</text>
  <text x="556" y="536" class="cell-text">Muliyono, Ahmad Sambudi</text>
  <!-- Perkuliahan ke 9 Span (Row 13-14) -->
  <text x="875" y="514" class="cell-text-bold cell-center">PERKULIAHAN KE 9</text>

  <!-- Row 15: y=540 to 574 (h=34) -->
  <line x1="35" y1="574" x2="965" y2="574" class="table-line" />
  <text x="52.5" y="561" class="cell-text cell-center">15</text>
  <text x="76" y="561" class="cell-text">Integrasi data, kode, output</text>
  <text x="500" y="561" class="cell-text-bold cell-center">Kelompok 7</text>
  <text x="556" y="555" class="cell-text">Siti Humairoh, L M Suprial</text>
  <text x="556" y="567" class="cell-text">Wahid, Intan, Mukhsin, Agus Mulyadi</text>
  <text x="875" y="561" class="cell-text-bold cell-center">PERKULIAHAN KE 10</text>

  <!-- ROW 16: UAS BANNER (y=574 to 598, h=24) -->
  <rect x="35" y="574" width="930" height="24" fill="#facc15" stroke="#000" stroke-width="1.2" />
  <text x="52.5" y="591" class="cell-text-bold cell-center">16</text>
  <text x="500" y="591" class="exam-banner">UAS</text>

  <!-- Document Footnote & Verification Stamp -->
  <text x="35" y="618" font-family="Arial, sans-serif" font-size="9.5" fill="#475569" font-style="italic">
    * Catatan: Seluruh naskah makalah wajib memuat landasan epistemologi metodologis, contoh perhitungan statistik, dan implikasi riset PAI.
  </text>
  <text x="35" y="632" font-family="Arial, sans-serif" font-size="9" fill="#64748b">
    Dokumen Resmi Terverifikasi: Program Pascasarjana IAI ASA Tahun Akademik 2026 • 29 Mahasiswa (Kelompok 1 s/d 7)
  </text>
</svg>
`;

export const DAFTAR_KELOMPOK_MAKALAH_DOCUMENT_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(
  DAFTAR_KELOMPOK_MAKALAH_DOCUMENT_SVG.trim()
)}`;
