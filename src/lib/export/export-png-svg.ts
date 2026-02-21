import { toPng, toSvg } from 'html-to-image';

export interface ImageExportOptions {
  backgroundColor?: string;
  pixelRatio?: number;
  filename?: string;
}

// foreignObject causes cross-origin failures in export
const FOREIGN_OBJECT_FILTER = (node: HTMLElement) => node.tagName !== 'foreignObject';

function downloadFile(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function exportPng(
  element: HTMLElement,
  options: ImageExportOptions = {}
): Promise<void> {
  const { backgroundColor = '#ffffff', pixelRatio = 2, filename = 'gia-pha' } = options;

  const dataUrl = await toPng(element, {
    backgroundColor,
    pixelRatio,
    cacheBust: true,
    filter: FOREIGN_OBJECT_FILTER,
  });

  downloadFile(dataUrl, `${filename}.png`);
}

export async function exportSvg(
  element: HTMLElement,
  options: ImageExportOptions = {}
): Promise<void> {
  const { backgroundColor = '#ffffff', filename = 'gia-pha' } = options;

  const dataUrl = await toSvg(element, {
    backgroundColor,
    cacheBust: true,
    filter: FOREIGN_OBJECT_FILTER,
  });

  downloadFile(dataUrl, `${filename}.svg`);
}

export async function exportPngDataUrl(
  element: HTMLElement,
  options: ImageExportOptions = {}
): Promise<string> {
  const { backgroundColor = '#ffffff', pixelRatio = 2 } = options;

  return toPng(element, {
    backgroundColor,
    pixelRatio,
    cacheBust: true,
    filter: FOREIGN_OBJECT_FILTER,
  });
}
