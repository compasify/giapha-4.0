import { encode } from 'uqr';

export interface QrCodeOptions {
  ecc?: 'L' | 'M' | 'Q' | 'H';
}

export function generateQrSvg(url: string, options: QrCodeOptions = {}): string {
  const { ecc = 'M' } = options;
  const result = encode(url, { ecc });

  const modules = result.data;
  const size = modules.length;
  const cellSize = 4;
  const svgSize = size * cellSize;

  let paths = '';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (modules[y][x]) {
        paths += `M${x * cellSize},${y * cellSize}h${cellSize}v${cellSize}h-${cellSize}z`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="200" height="200"><rect width="${svgSize}" height="${svgSize}" fill="white"/><path d="${paths}" fill="black"/></svg>`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  }
}
