import React from 'react';

interface HeroIllustrationProps {
  className?: string;
}

const TreeNode = ({
  x,
  y,
  r,
  variant,
  label,
  highlight = false,
  delay = 0,
}: {
  x: number;
  y: number;
  r: number;
  variant: 'gold' | 'red';
  label?: string;
  highlight?: boolean;
  delay?: number;
}) => {
  const isRed = variant === 'red';
  const mainColor = isRed ? 'url(#redGrad)' : 'url(#goldGrad)';
  const bgColor = isRed ? '#FFF5F5' : '#FFFBF0';
  const shadowUrl = isRed ? 'url(#shadowRed)' : 'url(#shadowGold)';
  const solidColor = isRed ? '#C8102E' : '#B8860B';

  return (
    <g transform={`translate(${x}, ${y})`}>
      <g style={{ animation: `float 6s ease-in-out infinite`, animationDelay: `${delay}s` }}>
        {/* Outer Highlight Ring */}
        {highlight && (
          <g>
            <circle cx="0" cy="0" r={r + 14} fill="none" stroke={mainColor} strokeWidth="1.5" strokeDasharray="4 6" opacity="0.8">
              <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="20s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r={r + 22} fill="none" stroke={mainColor} strokeWidth="1" strokeDasharray="2 8" opacity="0.4">
              <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="30s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* Main Circle */}
        <circle cx="0" cy="0" r={r} fill={bgColor} stroke={mainColor} strokeWidth={highlight ? 4 : 2} filter={shadowUrl} />

        {/* Inner Decorative Elements */}
        <circle cx="0" cy="0" r={r * 0.75} fill="none" stroke={solidColor} strokeWidth="1" opacity="0.15" />
        <circle cx="0" cy={-r * 0.15} r={r * 0.25} fill={mainColor} opacity="0.5" />
        <path
          d={`M ${-r * 0.45} ${r * 0.55} C ${-r * 0.45} ${r * 0.15} ${r * 0.45} ${r * 0.15} ${r * 0.45} ${r * 0.55} Z`}
          fill={mainColor}
          opacity="0.4"
        />

        {/* Label */}
        {label && (
          <g transform={`translate(0, ${r + 28})`}>
            {/* Outline for maximum readability over any background */}
            <text x="0" y="0" textAnchor="middle" fontSize={highlight ? 18 : 15} fontWeight={highlight ? "700" : "600"} fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round" fontFamily="system-ui, sans-serif">
              {label}
            </text>
            <text x="0" y="0" textAnchor="middle" fontSize={highlight ? 18 : 15} fontWeight={highlight ? "700" : "600"} fill={solidColor} fontFamily="system-ui, sans-serif">
              {label}
            </text>
          </g>
        )}
      </g>
    </g>
  );
};

const Connection = ({ d, variant, dashed = false }: { d: string; variant: 'gold' | 'red'; dashed?: boolean }) => {
  const color = variant === 'red' ? 'url(#redGrad)' : 'url(#goldGrad)';
  if (dashed) {
    return (
      <path d={d} fill="none" stroke={color} strokeWidth="3" opacity="0.8" strokeLinecap="round" strokeDasharray="8 8" />
    );
  }
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth="10" opacity="0.08" strokeLinecap="round" />
      <path d={d} fill="none" stroke={color} strokeWidth="3" opacity="0.5" strokeLinecap="round" />
    </g>
  );
};

export function HeroIllustration({ className }: HeroIllustrationProps) {
  return (
    <svg
      viewBox="0 0 800 750"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>

      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#DFB15B" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E53935" />
          <stop offset="100%" stopColor="#C8102E" />
        </linearGradient>
        <linearGradient id="glowRed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C8102E" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#C8102E" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="glowGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B8860B" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#B8860B" stopOpacity="0.05" />
        </linearGradient>
        <filter id="shadowRed" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#C8102E" floodOpacity="0.2" />
        </filter>
        <filter id="shadowGold" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#B8860B" floodOpacity="0.2" />
        </filter>
        <filter id="blurLg" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>

      {/* Decorative Background Elements */}
      <g opacity="0.6" transform="translate(400, 360)">
        {/* Soft background glow */}
        <circle cx="0" cy="0" r="280" fill="url(#glowRed)" filter="url(#blurLg)" opacity="0.5" />

        {/* Concentric subtle rings */}
        <circle r="340" fill="none" stroke="url(#redGrad)" strokeWidth="1" strokeDasharray="4 16" opacity="0.3" />
        <circle r="260" fill="none" stroke="url(#goldGrad)" strokeWidth="1" strokeDasharray="2 10" opacity="0.4" />
        <circle r="180" fill="none" stroke="url(#redGrad)" strokeWidth="1" opacity="0.15" />

        {/* Abstract lotus / starburst in center */}
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={`petal-${i}`}
            d="M 0 -30 Q 25 -140 0 -260 Q -25 -140 0 -30 Z"
            fill="url(#glowRed)"
            opacity="0.2"
            transform={`rotate(${i * 30})`}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={`leaf-${i}`}
            d="M 0 -20 Q 15 -100 0 -180 Q -15 -100 0 -20 Z"
            fill="url(#glowGold)"
            opacity="0.3"
            transform={`rotate(${i * 45 + 22.5})`}
          />
        ))}
      </g>

      {/* Connections (Rendered back-to-front so nodes sit on top) */}

      {/* G1 Marriages */}
      <Connection d="M 180 120 L 320 120" variant="gold" dashed />
      <Connection d="M 480 120 L 620 120" variant="red" dashed />

      {/* G1 to G2 Descent */}
      <Connection d="M 250 120 L 250 280" variant="gold" />
      <Connection d="M 550 120 L 550 280" variant="red" />

      {/* G2 Marriage */}
      <Connection d="M 250 280 L 550 280" variant="gold" dashed />

      {/* G2 to G3 Descent */}
      {/* To Sibling 1 */}
      <Connection d="M 400 280 C 400 360, 200 360, 200 460" variant="gold" />
      {/* To Sibling 2 */}
      <Connection d="M 400 280 C 400 360, 600 360, 600 460" variant="gold" />
      {/* To User */}
      <Connection d="M 400 280 L 400 460" variant="red" />

      {/* G3 to G4 Descent */}
      <Connection d="M 400 460 C 400 550, 280 540, 280 640" variant="gold" />
      <Connection d="M 400 460 C 400 550, 520 540, 520 640" variant="gold" />

      {/* Center dot on G2 Marriage line */}
      <circle cx="400" cy="280" r="6" fill="#FFF" stroke="url(#redGrad)" strokeWidth="3" />

      {/* Nodes */}

      {/* Generation 1: Grandparents */}
      <TreeNode x={180} y={120} r={28} variant="gold" delay={0.2} label="Ông nội" />
      <TreeNode x={320} y={120} r={28} variant="red" delay={0.5} label="Bà nội" />

      <TreeNode x={480} y={120} r={28} variant="gold" delay={0.8} label="Ông ngoại" />
      <TreeNode x={620} y={120} r={28} variant="red" delay={1.1} label="Bà ngoại" />

      {/* Generation 2: Parents */}
      <TreeNode x={250} y={280} r={36} variant="gold" delay={0.1} label="Cha" />
      <TreeNode x={550} y={280} r={36} variant="red" delay={0.4} label="Mẹ" />

      {/* Generation 3: Siblings & User */}
      <TreeNode x={200} y={460} r={32} variant="gold" delay={0.7} label="Anh trai" />
      <TreeNode x={400} y={460} r={46} variant="red" delay={0.0} label="Tôi" highlight />
      <TreeNode x={600} y={460} r={32} variant="gold" delay={0.9} label="Em gái" />

      {/* Generation 4: Children */}
      <TreeNode x={280} y={640} r={28} variant="gold" delay={0.3} label="Con trai" />
      <TreeNode x={520} y={640} r={28} variant="red" delay={0.6} label="Con gái" />

    </svg>
  );
}
