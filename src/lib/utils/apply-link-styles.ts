import type { LinkCategory } from '@/lib/transforms/family-chart-transform';

const LINK_CLASSES = [
  'link-biological',
  'link-adoptive',
  'link-step',
  'link-sworn',
  'link-spouse',
  'link-other',
] as const;

const STRAIGHTENED_ATTR = 'data-straightened';

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

function straightenPath(d: string): string {
  const nums = d.match(/-?[\d.]+/g);
  if (!nums || nums.length < 4) return d;

  const x1 = parseFloat(nums[0]);
  const y1 = parseFloat(nums[1]);
  const x2 = parseFloat(nums[nums.length - 2]);
  const y2 = parseFloat(nums[nums.length - 1]);

  const midY = (y1 + y2) / 2;
  return `M${x1},${y1} L${x1},${midY} L${x2},${midY} L${x2},${y2}`;
}

export function applyLinkStyles(
  svgEl: SVGElement | null | undefined,
  linkMap: Map<string, LinkCategory>
): void {
  if (!svgEl) return;

  const paths = svgEl.querySelectorAll('path.link');
  paths.forEach((path) => {
    if (!path.hasAttribute(STRAIGHTENED_ATTR)) {
      const d = path.getAttribute('d');
      if (d) {
        path.setAttribute('d', straightenPath(d));
        path.setAttribute(STRAIGHTENED_ATTR, '1');
      }
    }

    if (linkMap.size === 0) return;

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
    const hasNewPaths = mutations.some((m) =>
      m.type === 'childList' ||
      (m.type === 'attributes' && !(m.target as Element).hasAttribute(STRAIGHTENED_ATTR))
    );
    if (hasNewPaths) process();
  });

  observer.observe(svgEl, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['d'],
  });

  return () => observer.disconnect();
}
