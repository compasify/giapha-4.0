// Vietnamese-themed SVG icon components for the landing page
// Each icon is a clean, geometric inline SVG (~24x24 viewBox)

interface IconProps {
  className?: string;
}

// 1. TreeIcon — family tree / genealogy (branching tree motif)
export function TreeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* trunk */}
      <line x1="12" y1="22" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* root branches */}
      <line x1="8" y1="22" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="22" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* mid branch left */}
      <line x1="12" y1="15" x2="7" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* mid branch right */}
      <line x1="12" y1="15" x2="17" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* top left branch */}
      <line x1="7" y1="11" x2="4" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="11" x2="9" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* top right branch */}
      <line x1="17" y1="11" x2="15" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="17" y1="11" x2="20" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* nodes */}
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="7" cy="11" r="1.5" fill="currentColor" />
      <circle cx="17" cy="11" r="1.5" fill="currentColor" />
      <circle cx="4" cy="8" r="1.5" fill="currentColor" />
      <circle cx="9" cy="7" r="1.5" fill="currentColor" />
      <circle cx="15" cy="7" r="1.5" fill="currentColor" />
      <circle cx="20" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

// 2. CalendarMoonIcon — lunar/solar calendar (moon + calendar)
export function CalendarMoonIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* calendar body */}
      <rect x="2" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
      {/* calendar header top pins */}
      <line x1="6" y1="3" x2="6" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="3" x2="14" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* calendar row line */}
      <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" />
      {/* date dots */}
      <circle cx="6" cy="14" r="1" fill="currentColor" />
      <circle cx="10" cy="14" r="1" fill="currentColor" />
      <circle cx="14" cy="14" r="1" fill="currentColor" />
      <circle cx="6" cy="18" r="1" fill="currentColor" />
      <circle cx="10" cy="18" r="1" fill="currentColor" />
      {/* crescent moon top-right */}
      <path
        d="M19 4 A4 4 0 1 1 22 8 A2.5 2.5 0 1 0 19 4Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

// 3. CeremonyIcon — family events / ceremonies (lantern with tassel)
export function CeremonyIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* lantern body */}
      <path d="M8 7 C8 5 16 5 16 7 L17 14 C17 16 7 16 7 14 Z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      {/* lantern top cap */}
      <rect x="9" y="4" width="6" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* lantern bottom cap */}
      <rect x="9" y="16" width="6" height="2" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* hanging string */}
      <line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* lantern horizontal ribs */}
      <line x1="7.5" y1="10.5" x2="16.5" y2="10.5" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      {/* tassel */}
      <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="20" x2="11" y2="22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="13" y1="20" x2="13" y2="22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// 4. ExportIcon — PDF/PNG export (document with download arrow)
export function ExportIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* document body */}
      <path d="M5 3 H14 L19 8 V20 A1 1 0 0 1 18 21 H6 A1 1 0 0 1 5 20 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
      {/* fold corner */}
      <path d="M14 3 V8 H19" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      {/* download arrow */}
      <line x1="12" y1="11" x2="12" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <polyline points="9,15 12,18 15,15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 5. QrShareIcon — QR code sharing
export function QrShareIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* top-left QR block */}
      <rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <rect x="4.5" y="4.5" width="3" height="3" fill="currentColor" />
      {/* top-right QR block */}
      <rect x="14" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <rect x="16.5" y="4.5" width="3" height="3" fill="currentColor" />
      {/* bottom-left QR block */}
      <rect x="2" y="14" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <rect x="4.5" y="16.5" width="3" height="3" fill="currentColor" />
      {/* bottom-right data pattern */}
      <rect x="14" y="14" width="3" height="3" fill="currentColor" />
      <rect x="19" y="14" width="3" height="3" fill="currentColor" />
      <rect x="14" y="19" width="3" height="3" fill="currentColor" />
      <rect x="19" y="19" width="3" height="3" fill="currentColor" />
    </svg>
  );
}

// 6. AddressBookIcon — Vietnamese honorifics/xưng hô (speech bubble with people silhouettes)
export function AddressBookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* speech bubble */}
      <path d="M2 4 A2 2 0 0 1 4 2 H20 A2 2 0 0 1 22 4 V14 A2 2 0 0 1 20 16 H8 L4 20 V16 H4 A2 2 0 0 1 2 14 Z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      {/* person 1 - left */}
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M5 14 A3 3 0 0 1 11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* person 2 - right */}
      <circle cx="16" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M13 14 A3 3 0 0 1 19 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// 7. ShieldLockIcon — security / password protection
export function ShieldLockIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* shield */}
      <path d="M12 2 L20 5.5 V11 C20 15.5 16.5 19.5 12 21 C7.5 19.5 4 15.5 4 11 V5.5 Z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      {/* lock body */}
      <rect x="9" y="11" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* lock shackle */}
      <path d="M10 11 V9 A2 2 0 0 1 14 9 V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* keyhole */}
      <circle cx="12" cy="13.5" r="1" fill="currentColor" />
    </svg>
  );
}

// 8. MergeIcon — merge family trees (two trees becoming one)
export function MergeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* left tree top node */}
      <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* right tree top node */}
      <circle cx="20" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* left tree branches converging */}
      <line x1="4" y1="6" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      {/* right tree branches converging */}
      <line x1="20" y1="6" x2="15" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      {/* left sub-node */}
      <circle cx="5" cy="10" r="1.5" fill="currentColor" />
      {/* right sub-node */}
      <circle cx="19" cy="10" r="1.5" fill="currentColor" />
      {/* merged center node */}
      <circle cx="12" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
      {/* trunk down */}
      <line x1="12" y1="15.5" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* bottom node */}
      <circle cx="12" cy="21" r="1.5" fill="currentColor" />
    </svg>
  );
}

// 9. DragDropIcon — drag and drop interaction
export function DragDropIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* card being dragged */}
      <rect x="2" y="6" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none" />
      {/* drag dots on card */}
      <circle cx="5.5" cy="9" r="0.8" fill="currentColor" />
      <circle cx="5.5" cy="11" r="0.8" fill="currentColor" />
      <circle cx="8.5" cy="9" r="0.8" fill="currentColor" />
      <circle cx="8.5" cy="11" r="0.8" fill="currentColor" />
      {/* target drop zone (dashed) */}
      <rect x="13" y="9" width="9" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
      {/* arrow indicating drag direction */}
      <path d="M12.5 7 L16 4 L19.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="16" y1="4" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 10. SearchPersonIcon — find ancestor / common ancestor
export function SearchPersonIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* search circle */}
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.8" fill="none" />
      {/* magnifier handle */}
      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* person inside magnifier */}
      <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M6.5 14.5 A3.5 3.5 0 0 1 13.5 14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// 11. KeyboardIcon — keyboard shortcuts
export function KeyboardIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* keyboard body */}
      <rect x="1" y="6" width="22" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none" />
      {/* top row keys */}
      <rect x="3.5" y="9" width="3" height="2.5" rx="0.5" fill="currentColor" opacity="0.7" />
      <rect x="7.5" y="9" width="3" height="2.5" rx="0.5" fill="currentColor" opacity="0.7" />
      <rect x="11.5" y="9" width="3" height="2.5" rx="0.5" fill="currentColor" opacity="0.7" />
      <rect x="15.5" y="9" width="3" height="2.5" rx="0.5" fill="currentColor" opacity="0.7" />
      <rect x="19" y="9" width="2" height="2.5" rx="0.5" fill="currentColor" opacity="0.7" />
      {/* middle row keys */}
      <rect x="3.5" y="12.5" width="3" height="2.5" rx="0.5" fill="currentColor" opacity="0.7" />
      <rect x="7.5" y="12.5" width="3" height="2.5" rx="0.5" fill="currentColor" opacity="0.7" />
      <rect x="11.5" y="12.5" width="3" height="2.5" rx="0.5" fill="currentColor" opacity="0.7" />
      <rect x="15.5" y="12.5" width="5.5" height="2.5" rx="0.5" fill="currentColor" opacity="0.7" />
      {/* spacebar */}
      <rect x="6" y="16" width="12" height="2" rx="0.5" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

// 12. MultiFamilyIcon — multiple family trees
export function MultiFamilyIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* left tree */}
      <circle cx="5" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="5" y1="6" x2="5" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="8" x2="2.5" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="8" x2="7.5" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="2.5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="7.5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="5" cy="11" r="1.5" fill="currentColor" />
      {/* middle tree */}
      <circle cx="12" cy="3" r="2" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <line x1="12" y1="5" x2="12" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="8" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="8" x2="15" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="13" r="1.8" fill="currentColor" />
      <circle cx="15" cy="13" r="1.8" fill="currentColor" />
      <circle cx="12" cy="11" r="1.8" fill="currentColor" />
      {/* right tree */}
      <circle cx="19" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="19" y1="6" x2="19" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="8" x2="16.5" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="8" x2="21.5" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16.5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="21.5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="11" r="1.5" fill="currentColor" />
      {/* connecting ground line */}
      <line x1="2" y1="18" x2="22" y2="18" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      {/* individual trunks to ground */}
      <line x1="5" y1="13" x2="5" y2="18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <line x1="12" y1="14.5" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="19" y1="13" x2="19" y2="18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
