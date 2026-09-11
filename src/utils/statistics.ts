import { DataRow, DescriptiveStats, FrequencyClass, SturgesCalc, ZScoreItem } from "../types";

/**
 * Standard normal cumulative distribution function approximation
 * Error function approximation using Abramowitz and Stegun formula 7.1.26
 */
export function normalCDF(z: number): number {
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const p = 0.2316419;
  const c = 0.3989422804014327; // 1 / sqrt(2 * PI)

  if (z >= 0.0) {
    const t = 1.0 / (1.0 + p * z);
    return 1.0 - c * Math.exp((-z * z) / 2.0) * t * (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  } else {
    const t = 1.0 / (1.0 - p * z);
    return c * Math.exp((-z * z) / 2.0) * t * (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
  }
}

/**
 * Calculates percentile for sorted numbers array
 */
function getPercentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Calculate all descriptive statistics (Sebaran & Pemusatan)
 */
export function calculateDescriptiveStats(scores: number[]): DescriptiveStats | null {
  const n = scores.length;
  if (n === 0) return null;

  const sorted = [...scores].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;

  // Median
  let median: number;
  if (n % 2 === 1) {
    median = sorted[Math.floor(n / 2)];
  } else {
    const mid = n / 2;
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  }

  // Mode
  const counts: Record<number, number> = {};
  let maxFreq = 0;
  for (const val of sorted) {
    counts[val] = (counts[val] || 0) + 1;
    if (counts[val] > maxFreq) {
      maxFreq = counts[val];
    }
  }

  let mode: number[] = [];
  if (maxFreq > 1) {
    for (const [key, freq] of Object.entries(counts)) {
      if (freq === maxFreq) {
        mode.push(Number(key));
      }
    }
  } else {
    // If all frequencies are 1, mode doesn't exist technically or can be listed as none
    mode = [];
  }

  // Variance & Standard Deviation
  const sumSquaredDiff = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  const varianceSample = n > 1 ? sumSquaredDiff / (n - 1) : 0;
  const variancePop = sumSquaredDiff / n;
  const stdDevSample = Math.sqrt(varianceSample);
  const stdDevPop = Math.sqrt(variancePop);
  const stdErrorMean = stdDevSample / Math.sqrt(n);

  // Quartiles
  const q1 = getPercentile(sorted, 0.25);
  const q2 = median;
  const q3 = getPercentile(sorted, 0.75);
  const iqr = q3 - q1;
  const quartileDeviation = iqr / 2;

  // Coefficient of Variation (%)
  const coefVariation = mean !== 0 ? (stdDevSample / mean) * 100 : 0;

  // Skewness (Pearson's coefficient of skewness: 3 * (Mean - Median) / s or Fisher-Pearson standardized moment)
  let skewness = 0;
  if (stdDevSample > 0 && n > 2) {
    const m3 = sorted.reduce((acc, val) => acc + Math.pow((val - mean) / stdDevSample, 3), 0);
    skewness = (n / ((n - 1) * (n - 2))) * m3;
  }

  // Kurtosis (Excess kurtosis)
  let kurtosis = 0;
  if (stdDevSample > 0 && n > 3) {
    const m4 = sorted.reduce((acc, val) => acc + Math.pow((val - mean) / stdDevSample, 4), 0);
    const term1 = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
    const term2 = (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
    kurtosis = term1 * m4 - term2;
  }

  return {
    count: n,
    sum,
    min,
    max,
    range,
    mean,
    median,
    mode,
    modeFrequency: maxFreq,
    varianceSample,
    variancePop,
    stdDevSample,
    stdDevPop,
    stdErrorMean,
    q1,
    q2,
    q3,
    iqr,
    quartileDeviation,
    coefVariation,
    skewness,
    kurtosis,
  };
}

/**
 * Calculates Sturges Formula details:
 * k = 1 + 3.322 * log10(n)
 * c = R / k
 */
export function calculateSturges(n: number, range: number): SturgesCalc {
  const log10N = Math.log10(n);
  const rawK = 1 + 3.322 * log10N;
  const k = Math.max(3, Math.round(rawK));
  const rawC = range / k;
  // In Indonesian educational statistics, class interval c is usually rounded up or standard round
  const c = Math.max(1, Math.ceil(rawC));

  return {
    n,
    log10N,
    rawK,
    k,
    range,
    rawC,
    c,
  };
}

/**
 * Generate grouped frequency distribution table
 */
export function generateFrequencyDistribution(
  scores: number[],
  minVal: number,
  classCount: number,
  classInterval: number,
  mean: number
): FrequencyClass[] {
  const sorted = [...scores].sort((a, b) => a - b);
  const n = sorted.length;
  const classes: FrequencyClass[] = [];

  let currentLower = minVal;
  let runningCumulativeLess = 0;

  for (let i = 0; i < classCount; i++) {
    const lowerLimit = currentLower;
    const upperLimit = lowerLimit + classInterval - 1;
    const lowerBound = lowerLimit - 0.5;
    const upperBound = upperLimit + 0.5;
    const midpoint = (lowerLimit + upperLimit) / 2;

    // Filter elements in this class
    // For the last class, include upper limit inclusive
    let count = 0;
    for (const val of sorted) {
      if (i === classCount - 1) {
        if (val >= lowerLimit && val <= upperLimit + 0.0001) {
          count++;
        }
      } else {
        if (val >= lowerLimit && val <= upperLimit) {
          count++;
        }
      }
    }

    runningCumulativeLess += count;
    const relativeFreq = n > 0 ? (count / n) * 100 : 0;
    const fx = count * midpoint;
    const xDiff = midpoint - mean;
    const fxDiffSquared = count * Math.pow(xDiff, 2);

    classes.push({
      index: i + 1,
      lowerLimit,
      upperLimit,
      lowerBound,
      upperBound,
      midpoint,
      frequency: count,
      relativeFreq,
      cumulativeLess: runningCumulativeLess,
      cumulativeMore: 0, // will compute in second pass
      fx,
      xDiff,
      fxDiffSquared,
    });

    currentLower = upperLimit + 1;
  }

  // Calculate cumulativeMore (frekuensi kumulatif lebih dari)
  let runningCumulativeMore = n;
  for (let i = 0; i < classes.length; i++) {
    classes[i].cumulativeMore = runningCumulativeMore;
    runningCumulativeMore -= classes[i].frequency;
  }

  return classes;
}

/**
 * Calculate Z-scores, T-scores, and PAI evaluation categories for each student
 */
export function calculateZScores(
  rows: DataRow[],
  mean: number,
  stdDev: number
): ZScoreItem[] {
  return rows.map((row) => {
    const s = stdDev > 0 ? stdDev : 1;
    const deviation = row.score - mean;
    const zScore = deviation / s;
    const tScore = 50 + 10 * zScore;
    const percentile = normalCDF(zScore) * 100;

    let category: ZScoreItem["category"] = "Sedang";
    let categoryArabic = "Jayyid / Maqbul (Cukup)";

    if (zScore >= 2.0) {
      category = "Sangat Tinggi";
      categoryArabic = "Mumtaz (Istimewa / Sangat Tinggi)";
    } else if (zScore >= 1.0) {
      category = "Tinggi";
      categoryArabic = "Jayyid Jiddan (Sangat Baik / Tinggi)";
    } else if (zScore >= -1.0) {
      category = "Sedang";
      categoryArabic = "Jayyid / Maqbul (Cukup / Rata-rata)";
    } else if (zScore >= -2.0) {
      category = "Rendah";
      categoryArabic = "Dha'if (Kurang / Rendah)";
    } else {
      category = "Sangat Rendah";
      categoryArabic = "Dha'if Jiddan (Sangat Kurang / Butuh Remedial)";
    }

    return {
      id: row.id,
      label: row.label,
      score: row.score,
      zScore,
      tScore,
      percentile,
      category,
      categoryArabic,
      deviation,
    };
  });
}
