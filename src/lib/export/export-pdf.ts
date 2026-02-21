// Paper sizes in mm [width, height] portrait orientation
export const PAPER_SIZES = {
  A4: [210, 297],
  A3: [297, 420],
  A2: [420, 594],
  A1: [594, 841],
  A0: [841, 1189],
} as const;

export type PaperSize = keyof typeof PAPER_SIZES;
export type Orientation = 'portrait' | 'landscape';

export interface PdfExportOptions {
  paperSize?: PaperSize;
  orientation?: Orientation;
  title?: string;
  filename?: string;
  margin?: number;
}

export async function exportPdf(
  svgElement: SVGElement,
  options: PdfExportOptions = {}
): Promise<void> {
  const {
    paperSize = 'A4',
    orientation = 'landscape',
    title = 'Gia Phả',
    filename = 'gia-pha',
    margin = 10,
  } = options;

  const [{ default: jsPDF }, _svg2pdf] = await Promise.all([
    import('jspdf'),
    import('svg2pdf.js'),
  ]);

  const [pw, ph] = PAPER_SIZES[paperSize];
  const pageWidth = orientation === 'landscape' ? ph : pw;
  const pageHeight = orientation === 'landscape' ? pw : ph;

  const pdf = new jsPDF({
    orientation: orientation === 'landscape' ? 'l' : 'p',
    unit: 'mm',
    format: [pageWidth, pageHeight],
  });

  const headerHeight = title ? 12 : 0;
  if (title) {
    pdf.setFontSize(14);
    pdf.setTextColor(33, 33, 33);
    pdf.text(title, margin, margin + 6);

    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, margin + headerHeight - 2, pageWidth - margin, margin + headerHeight - 2);
  }

  const contentX = margin;
  const contentY = margin + headerHeight;
  const contentWidth = pageWidth - margin * 2;
  const footerSpace = 8;
  const contentHeight = pageHeight - margin * 2 - headerHeight - footerSpace;

  const clone = svgElement.cloneNode(true) as SVGElement;

  await pdf.svg(clone, {
    x: contentX,
    y: contentY,
    width: contentWidth,
    height: contentHeight,
  });

  const footerY = pageHeight - margin;
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`Xuất từ Gia Phả Online • ${new Date().toLocaleDateString('vi-VN')}`, margin, footerY);
  pdf.text(`${paperSize} ${orientation}`, pageWidth - margin, footerY, { align: 'right' });

  pdf.save(`${filename}.pdf`);
}
