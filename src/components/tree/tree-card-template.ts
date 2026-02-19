import type { FamilyChartPersonData } from '@/lib/transforms/family-chart-transform';

let _starredIds: Set<string> = new Set();

export function setStarredIds(ids: Set<string>): void {
  _starredIds = ids;
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

  const genderClass = isFemale ? 'f3-card-female' : 'f3-card-male';
  const mainClass = isMain ? 'f3-card-main' : '';
  const deceasedClass = isDeceased ? 'f3-card-deceased' : '';
  const starredClass = isStarred ? 'f3-card-starred' : '';

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

  return `
<div class="f3-vn-card ${genderClass} ${mainClass} ${deceasedClass} ${starredClass}" data-person-id="${d.data.id}">
  ${starIcon}
  <div class="f3-vn-avatar" style="background:${avatarBg};color:${avatarColor};border-color:${avatarBorder}">
    ${initials}
  </div>
  <div class="f3-vn-info">
    <div class="f3-vn-name">${fullName || '(Không rõ)'}</div>
    <div class="f3-vn-lifespan">${lifespan}</div>
  </div>
  <div class="f3-vn-badges">
    ${genBadge}
    ${bioIndicator}
  </div>
</div>
  `.trim();
}
