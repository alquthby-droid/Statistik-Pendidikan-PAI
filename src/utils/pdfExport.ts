import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export interface PdfExportProgress {
  currentPage: number;
  totalPages: number;
  status: string;
}

/**
 * Exports multiple A4 page elements into a clean, professional multi-page PDF document
 */
export async function exportPagesToPdf(
  pageElements: HTMLElement[],
  fileName: string,
  onProgress?: (progress: PdfExportProgress) => void
): Promise<void> {
  if (!pageElements || pageElements.length === 0) {
    throw new Error("Tidak ada halaman yang dapat diekspor.");
  }

  // A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const total = pageElements.length;

  for (let i = 0; i < total; i++) {
    const el = pageElements[i];

    if (onProgress) {
      onProgress({
        currentPage: i + 1,
        totalPages: total,
        status: `Memproses halaman ${i + 1} dari ${total}...`,
      });
    }

    // Capture the element using html2canvas with high DPI (scale: 2)
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 1024,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    if (i > 0) {
      pdf.addPage("a4", "portrait");
    }

    // PDF page size in mm
    const pdfWidth = 210;
    const pdfHeight = 297;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
  }

  if (onProgress) {
    onProgress({
      currentPage: total,
      totalPages: total,
      status: "Menyimpan file PDF...",
    });
  }

  pdf.save(fileName);
}
