import type { FamilyChartPersonData } from '@/lib/transforms/family-chart-transform';

let _starredIds: Set<string> = new Set();
let _collapsedIds: Set<string> = new Set();
let _hiddenCounts: Map<string, number> = new Map();

export function setStarredIds(ids: Set<string>): void {
  _starredIds = ids;
}

export function setCollapsedState(ids: Set<string>, counts: Map<string, number>): void {
  _collapsedIds = ids;
  _hiddenCounts = counts;
}

interface TreeDatum {
  data: {
    id: string;
    data: FamilyChartPersonData & { main?: boolean };
    rels: { parents: string[]; spouses: string[]; children: string[] };
  };
}

function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildFullName(data: FamilyChartPersonData): string {
  return [data.ho, data.ten_dem, data.ten].filter(Boolean).join(' ');
}

function formatDate(year: number | null, month: number | null, day: number | null): string {
  if (!year) return '?';
  const parts: string[] = [];
  if (day) parts.push(String(day));
  if (month) parts.push(String(month).padStart(2, '0'));
  parts.push(String(year));
  return parts.join('/');
}

function buildLifespan(data: FamilyChartPersonData): string {
  const birth = formatDate(data.birth_year, data.birth_month, data.birth_day);
  const death = data.is_alive ? 'nay' : formatDate(data.death_year, data.death_month, data.death_day);
  return `${birth} – ${death}`;
}

function getInitials(data: FamilyChartPersonData): string {
  const ho = data.ho?.charAt(0) ?? '';
  const ten = data.ten?.charAt(0) ?? '';
  return (ho + ten).toUpperCase() || '?';
}

export function vietnameseCardHtml(d: TreeDatum): string {
  const data = d.data.data;
  const isMain = data.main === true;
  const isFemale = data.gender === 'F';
  const isDeceased = !data.is_alive;

  const fullName = escapeHtml(buildFullName(data));
  const lifespan = escapeHtml(buildLifespan(data));
  const initials = escapeHtml(getInitials(data));
  const gen = data.generation_number;
  const hasBio = !!(data.biography || data.notes);

  const isStarred = _starredIds.has(d.data.id);
  const isCollapsed = _collapsedIds.has(d.data.id);
  const hiddenCount = _hiddenCounts.get(d.data.id) ?? 0;

  const genderClass = isFemale ? 'f3-card-female' : 'f3-card-male';
  const mainClass = isMain ? 'f3-card-main' : '';
  const deceasedClass = isDeceased ? 'f3-card-deceased' : '';
  const starredClass = isStarred ? 'f3-card-starred' : '';
  const collapsedClass = isCollapsed ? 'f3-card-collapsed' : '';

  const avatarBg = isFemale ? '#fce7f3' : '#dbeafe';
  const avatarColor = isFemale ? '#be185d' : '#1d4ed8';
  const avatarBorder = isFemale ? '#f472b6' : '#60a5fa';

  const genBadge = gen != null
    ? `<span class="f3-vn-gen" title="Đời thứ ${gen}">Đ${gen}</span>`
    : '';

  const bioIndicator = hasBio
    ? '<span class="f3-vn-bio-dot" title="Có tiểu sử">&#9679;</span>'
    : '';

  const starIcon = isStarred
    ? '<span class="f3-vn-star" title="Đánh dấu">&#9733;</span>'
    : '';

  const collapsedBadge = isCollapsed && hiddenCount > 0
    ? `<span class="f3-vn-collapsed-badge" title="${hiddenCount} người đang ẩn">+${hiddenCount}</span>`
    : '';

  const SPOUSE_GROUP_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6'];
  const spouseGroupDot = data.spouse_group != null
    ? `<span class="f3-vn-spouse-dot" style="background:${SPOUSE_GROUP_COLORS[data.spouse_group % SPOUSE_GROUP_COLORS.length]}" title="Nhóm hôn phối ${data.spouse_group + 1}"></span>`
    : '';

  const avatarUrl = data.avatar ? escapeHtml(data.avatar) : null;
  const avatarContent = avatarUrl
    ? `<img src="${avatarUrl}" alt="" class="f3-vn-avatar-img" />`
    : initials;

  const genderLabel = isFemale ? 'Nữ' : 'Nam';
  const childCount = d.data.rels.children.length;
  const hasChildren = childCount > 0;
  const ariaLabel = `${fullName || 'Không rõ'}, ${genderLabel}, ${lifespan}${gen != null ? `, đời ${gen}` : ''}${isDeceased ? ', đã mất' : ''}${childCount > 0 ? `, ${childCount} con` : ''}`;

  return `
<div class="f3-vn-card ${genderClass} ${mainClass} ${deceasedClass} ${starredClass} ${collapsedClass}" data-person-id="${d.data.id}" role="treeitem" tabindex="0" aria-label="${escapeHtml(ariaLabel)}" aria-expanded="${hasChildren}">
  ${starIcon}
  <div class="f3-vn-avatar" style="background:${avatarBg};color:${avatarColor};border-color:${avatarBorder}" aria-hidden="true">
    ${avatarContent}
  </div>
  <div class="f3-vn-info">
    <div class="f3-vn-name">${fullName || '(Không rõ)'}</div>
    <div class="f3-vn-lifespan">${lifespan}</div>
  </div>
  <div class="f3-vn-badges" aria-hidden="true">
    ${genBadge}
    ${bioIndicator}
  </div>
  ${collapsedBadge}
  ${spouseGroupDot}
</div>
  `.trim();
}
