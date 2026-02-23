import { toPng } from 'html-to-image';

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
  legendItems?: Array<{ name: string; color: string }>;
}

const FOREIGN_OBJECT_FILTER = (node: HTMLElement) => node.tagName !== 'foreignObject';

const SVG_STROKE_PROPS = ['stroke', 'stroke-width', 'stroke-dasharray', 'stroke-opacity'] as const;

/**
 * Inline computed stroke styles on SVG path.link elements so html-to-image
 * captures them correctly. The family-chart library hardcodes stroke="#fff"
 * as a presentation attribute; CSS overrides via !important work in browser
 * but html-to-image does not reliably transfer those overrides to the clone.
 */
function inlineLinkStyles(container: HTMLElement): () => void {
  const paths = container.querySelectorAll<SVGPathElement>('path.link');
  const originals: { el: SVGPathElement; prev: Map<string, string> }[] = [];

  paths.forEach((path) => {
    const computed = getComputedStyle(path);
    const prev = new Map<string, string>();

    for (const prop of SVG_STROKE_PROPS) {
      prev.set(prop, path.style.getPropertyValue(prop));
      const value = computed.getPropertyValue(prop);
      if (value) {
        path.style.setProperty(prop, value);
      }
    }

    originals.push({ el: path, prev });
  });

  return () => {
    for (const { el, prev } of originals) {
      for (const prop of SVG_STROKE_PROPS) {
        const old = prev.get(prop) ?? '';
        if (old) {
          el.style.setProperty(prop, old);
        } else {
          el.style.removeProperty(prop);
        }
      }
    }
  };
}

async function renderTreeToPngDataUrl(element: HTMLElement, pixelRatio = 2): Promise<string> {
  const restoreStyles = inlineLinkStyles(element);
  try {
    return await toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio,
      cacheBust: true,
      filter: FOREIGN_OBJECT_FILTER,
    });
  } finally {
    restoreStyles();
  }
}

async function loadImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Strip Vietnamese diacritics to ASCII-safe text for jsPDF's default Helvetica font.
 * The tree content is rendered as a PNG image so only title/footer text needs this.
 */
function stripDiacritics(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u0111/g, 'd')
    .replace(/\u0110/g, 'D');
}

export async function exportPdf(
  element: HTMLElement,
  options: PdfExportOptions = {}
): Promise<void> {
  const {
    paperSize = 'A4',
    orientation = 'landscape',
    title = 'Gia Phả',
    filename = 'gia-pha',
    margin = 10,
  } = options;

  const [{ default: jsPDF }, pngDataUrl] = await Promise.all([
    import('jspdf'),
    renderTreeToPngDataUrl(element, 2),
  ]);

  const [pw, ph] = PAPER_SIZES[paperSize];
  const pageWidth = orientation === 'landscape' ? ph : pw;
  const pageHeight = orientation === 'landscape' ? pw : ph;

  const pdf = new jsPDF({
    orientation: orientation === 'landscape' ? 'l' : 'p',
    unit: 'mm',
    format: [pageWidth, pageHeight],
  });


  let headerHeight = title ? 12 : 0;
  const legendHeight = options.legendItems && options.legendItems.length > 0 ? 8 : 0;
  headerHeight += legendHeight;

  if (title) {
    pdf.setFontSize(14);
    pdf.setTextColor(33, 33, 33);
    pdf.text(stripDiacritics(title), margin, margin + 6);

    if (options.legendItems && options.legendItems.length > 0) {
      const legendStartY = margin + 10;
      let legendX = margin;
      const legendItemSpacing = 3;
      const colorBoxSize = 5;
      const textOffsetX = 2;

      pdf.setFontSize(9);
      pdf.setTextColor(66, 66, 66);

      for (const item of options.legendItems) {
        const rgb = hexToRgb(item.color);
        if (rgb) {
          pdf.setFillColor(rgb[0], rgb[1], rgb[2]);
          pdf.rect(legendX, legendStartY - colorBoxSize + 1, colorBoxSize, colorBoxSize, 'F');
        }

        const labelX = legendX + colorBoxSize + textOffsetX;
        pdf.text(stripDiacritics(item.name), labelX, legendStartY);

        const textWidth = pdf.getTextWidth(stripDiacritics(item.name));
        legendX = labelX + textWidth + legendItemSpacing + 3;

        if (legendX > pageWidth - margin - 20) {
          legendX = margin;
        }
      }
    }

    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, margin + headerHeight - 2, pageWidth - margin, margin + headerHeight - 2);
  }

  const contentX = margin;
  const contentY = margin + headerHeight;
  const contentWidth = pageWidth - margin * 2;
  const footerSpace = 8;
  const contentHeight = pageHeight - margin * 2 - headerHeight - footerSpace;

  const imgDims = await loadImageDimensions(pngDataUrl);
  const imgAspect = imgDims.width / imgDims.height;
  const boxAspect = contentWidth / contentHeight;

  let drawWidth: number;
  let drawHeight: number;
  if (imgAspect > boxAspect) {
    drawWidth = contentWidth;
    drawHeight = contentWidth / imgAspect;
  } else {
    drawHeight = contentHeight;
    drawWidth = contentHeight * imgAspect;
  }

  const drawX = contentX + (contentWidth - drawWidth) / 2;
  const drawY = contentY + (contentHeight - drawHeight) / 2;

  pdf.addImage(pngDataUrl, 'PNG', drawX, drawY, drawWidth, drawHeight);

  const footerY = pageHeight - margin;
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(stripDiacritics(`Xuat tu Gia Pha Online • ${new Date().toLocaleDateString('vi-VN')}`), margin, footerY);
  pdf.text(`${paperSize} ${orientation}`, pageWidth - margin, footerY, { align: 'right' });

  pdf.save(`${filename}.pdf`);
}

function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

export async function exportSubtreePdf(
  element: HTMLElement,
  options: PdfExportOptions = {}
): Promise<void> {
  await exportPdf(element, options);
}
