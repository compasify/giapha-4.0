import { toPng, toSvg } from 'html-to-image';

export interface ImageExportOptions {
  backgroundColor?: string;
  pixelRatio?: number;
  filename?: string;
}

// foreignObject causes cross-origin failures in export
const FOREIGN_OBJECT_FILTER = (node: HTMLElement) => node.tagName !== 'foreignObject';
const SVG_STROKE_PROPS = ['stroke', 'stroke-width', 'stroke-dasharray', 'stroke-opacity'] as const;

/**
 * Inline computed stroke styles on SVG path.link elements so html-to-image
 * captures them correctly. The family-chart library hardcodes stroke="#fff"
 * as a presentation attribute; our CSS overrides it via !important, but
 * html-to-image does not reliably transfer those overrides to the clone.
 * Returns a cleanup function that restores original inline styles.
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

  const restoreStyles = inlineLinkStyles(element);
  try {
    const dataUrl = await toPng(element, {
      backgroundColor,
      pixelRatio,
      cacheBust: true,
      filter: FOREIGN_OBJECT_FILTER,
    });

    downloadFile(dataUrl, `${filename}.png`);
  } finally {
    restoreStyles();
  }
}

export async function exportSvg(
  element: HTMLElement,
  options: ImageExportOptions = {}
): Promise<void> {
  const { backgroundColor = '#ffffff', filename = 'gia-pha' } = options;

  const restoreStyles = inlineLinkStyles(element);
  try {
    const dataUrl = await toSvg(element, {
      backgroundColor,
      cacheBust: true,
      filter: FOREIGN_OBJECT_FILTER,
    });

    downloadFile(dataUrl, `${filename}.svg`);
  } finally {
    restoreStyles();
  }
}

export async function exportPngDataUrl(
  element: HTMLElement,
  options: ImageExportOptions = {}
): Promise<string> {
  const { backgroundColor = '#ffffff', pixelRatio = 2 } = options;

  const restoreStyles = inlineLinkStyles(element);
  try {
    return await toPng(element, {
      backgroundColor,
      pixelRatio,
      cacheBust: true,
      filter: FOREIGN_OBJECT_FILTER,
    });
  } finally {
    restoreStyles();
  }
}
