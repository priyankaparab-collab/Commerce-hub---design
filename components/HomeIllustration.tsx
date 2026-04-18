export function HomeIllustration() {
  return (
    <svg
      width="580"
      height="580"
      viewBox="0 0 420 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer circle */}
      <circle cx="210" cy="210" r="195" stroke="#B8D4E8" strokeWidth="1.5" />

      {/* Desk surface */}
      <rect x="100" y="270" width="220" height="12" rx="6" fill="#D0E8F5" />

      {/* Computer monitor */}
      <rect x="158" y="185" width="104" height="75" rx="6" fill="#1A3A5C" />
      <rect x="163" y="190" width="94" height="62" rx="4" fill="#0F2A44" />
      {/* Bar chart on screen */}
      <rect x="173" y="225" width="10" height="20" rx="2" fill="#4DB6AC" />
      <rect x="188" y="215" width="10" height="30" rx="2" fill="#4DB6AC" />
      <rect x="203" y="220" width="10" height="25" rx="2" fill="#4DB6AC" />
      <rect x="218" y="210" width="10" height="35" rx="2" fill="#26C6DA" />
      <rect x="233" y="218" width="10" height="27" rx="2" fill="#4DB6AC" />
      {/* Monitor smiley */}
      <circle cx="210" cy="205" r="6" fill="#FDD835" />
      <path d="M207 206 Q210 209 213 206" stroke="#333" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Monitor stand */}
      <rect x="202" y="260" width="16" height="10" rx="2" fill="#1A3A5C" />
      <rect x="194" y="268" width="32" height="4" rx="2" fill="#1A3A5C" />

      {/* Person body */}
      {/* Chair back */}
      <rect x="183" y="245" width="54" height="6" rx="3" fill="#E8A020" />
      <rect x="193" y="251" width="6" height="24" rx="3" fill="#E8A020" />
      <rect x="221" y="251" width="6" height="24" rx="3" fill="#E8A020" />

      {/* Torso - person in yellow sweater */}
      <ellipse cx="210" cy="260" rx="22" ry="18" fill="#E8A020" />
      {/* Head */}
      <circle cx="210" cy="238" r="16" fill="#F5CBA7" />
      {/* Hair */}
      <path d="M195 232 Q197 220 210 218 Q223 220 225 232" fill="#3D2B1F" />
      {/* Glasses */}
      <circle cx="204" cy="237" r="4" stroke="#333" strokeWidth="1.5" fill="none" />
      <circle cx="216" cy="237" r="4" stroke="#333" strokeWidth="1.5" fill="none" />
      <line x1="208" y1="237" x2="212" y2="237" stroke="#333" strokeWidth="1.5" />
      <line x1="200" y1="237" x2="197" y2="236" stroke="#333" strokeWidth="1.5" />
      <line x1="220" y1="237" x2="223" y2="236" stroke="#333" strokeWidth="1.5" />
      {/* Arms/hands on desk */}
      <ellipse cx="188" cy="272" rx="10" ry="5" fill="#E8A020" />
      <ellipse cx="232" cy="272" rx="10" ry="5" fill="#E8A020" />
      {/* Hands */}
      <circle cx="180" cy="272" r="5" fill="#F5CBA7" />
      <circle cx="240" cy="272" r="5" fill="#F5CBA7" />

      {/* Plant on desk */}
      <rect x="285" y="255" width="16" height="18" rx="3" fill="#5B8A9F" />
      <ellipse cx="293" cy="253" rx="10" ry="9" fill="#4CAF50" />
      <ellipse cx="287" cy="257" rx="7" ry="7" fill="#388E3C" />
      <ellipse cx="299" cy="257" rx="7" ry="7" fill="#388E3C" />
      <ellipse cx="293" cy="248" rx="5" ry="6" fill="#4CAF50" />

      {/* Keyboard */}
      <rect x="175" y="270" width="70" height="8" rx="3" fill="#B0BEC5" />
      <rect x="178" y="272" width="8" height="4" rx="1" fill="#90A4AE" />
      <rect x="189" y="272" width="8" height="4" rx="1" fill="#90A4AE" />
      <rect x="200" y="272" width="8" height="4" rx="1" fill="#90A4AE" />
      <rect x="211" y="272" width="8" height="4" rx="1" fill="#90A4AE" />
      <rect x="222" y="272" width="8" height="4" rx="1" fill="#90A4AE" />
      <rect x="233" y="272" width="8" height="4" rx="1" fill="#90A4AE" />

      {/* Speech bubble - top left (chat dots) */}
      <rect x="100" y="155" width="52" height="36" rx="10" fill="#4FC3F7" />
      <circle cx="116" cy="173" r="4" fill="white" />
      <circle cx="126" cy="173" r="4" fill="white" />
      <circle cx="136" cy="173" r="4" fill="white" />
      {/* Bubble tail */}
      <path d="M115 191 L108 202 L125 191Z" fill="#4FC3F7" />

      {/* T-shirt + dollar icon - bottom left */}
      <g transform="translate(95, 290)">
        <path d="M8 0 L0 8 L8 14 L8 34 L32 34 L32 14 L40 8 L32 0 L28 6 L12 6 Z" fill="#FF8C00" />
        <circle cx="20" cy="20" r="9" fill="white" />
        <text x="20" y="25" textAnchor="middle" fontSize="12" fill="#FF8C00" fontWeight="bold">$</text>
      </g>

      {/* Speech bubble - top right (VIP/crown) */}
      <rect x="268" y="148" width="52" height="40" rx="10" fill="#4FC3F7" />
      {/* Crown icon in bubble */}
      <path d="M280 174 L280 166 L286 170 L294 163 L302 170 L308 166 L308 174 Z" fill="white" />
      <rect x="280" y="174" width="28" height="4" rx="2" fill="white" />
      {/* Person silhouette in bubble */}
      <circle cx="294" cy="158" r="5" fill="white" />
      <path d="M287 175 Q294 168 301 175" fill="white" />
      {/* Bubble tail */}
      <path d="M305 188 L312 200 L295 188Z" fill="#4FC3F7" />
    </svg>
  );
}
