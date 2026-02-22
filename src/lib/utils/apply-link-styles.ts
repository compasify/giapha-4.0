import type { LinkCategory } from '@/lib/transforms/family-chart-transform';

const LINK_CLASSES = [
  'link-biological',
  'link-adoptive',
  'link-step',
  'link-sworn',
  'link-spouse',
  'link-other',
] as const;

function linkKey(a: string, b: string): string {
  return a < b ? `${a}_${b}` : `${b}_${a}`;
}

interface D3Node {
  data?: { id?: string; data?: { id?: string } };
  id?: string;
}

interface D3LinkDatum {
  source?: D3Node;
  target?: D3Node;
}

function getNodeId(node: D3Node | undefined): string | null {
  if (!node) return null;
  if (node.data?.id) return String(node.data.id);
  if (node.data?.data?.id) return String(node.data.data.id);
  if (node.id) return String(node.id);
  return null;
}

export function applyLinkStyles(
  svgEl: SVGElement | null | undefined,
  linkMap: Map<string, LinkCategory>
): void {
  if (!svgEl || linkMap.size === 0) return;

  const paths = svgEl.querySelectorAll('path.link');
  paths.forEach((path) => {
    for (const cls of LINK_CLASSES) {
      path.classList.remove(cls);
    }

    const d3data = (path as unknown as { __data__?: D3LinkDatum }).__data__;
    if (!d3data) return;

    const sourceId = getNodeId(d3data.source);
    const targetId = getNodeId(d3data.target);
    if (!sourceId || !targetId) return;

    const key = linkKey(sourceId, targetId);
    const category = linkMap.get(key);
    if (category) {
      path.classList.add(`link-${category}`);
    }
  });
}

export function observeLinkStyles(
  svgEl: SVGElement | null | undefined,
  linkMap: Map<string, LinkCategory>
): (() => void) | null {
  if (!svgEl) return null;

  let processing = false;

  function process() {
    if (processing) return;
    processing = true;
    applyLinkStyles(svgEl, linkMap);
    processing = false;
  }

  process();

  const observer = new MutationObserver((mutations) => {
    const hasRelevantChange = mutations.some((m) => m.type === 'childList');
    if (hasRelevantChange) process();
  });

  observer.observe(svgEl, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}
