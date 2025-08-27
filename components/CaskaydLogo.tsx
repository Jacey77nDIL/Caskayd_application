export default function CaskaydLogo() {
  return (
    <svg
      width="600"
      height="150"
      viewBox="0 0 600 150"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="caskaydGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="50%" stopColor="#FF69B4" />
          <stop offset="100%" stopColor="#800080" />
        </linearGradient>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="4" dy="4" stdDeviation="4" floodColor="#888" />
        </filter>
      </defs>

      <g filter="url(#dropShadow)" fill="url(#caskaydGradient)">
        {/* All your <path> elements */}
        <path d="M50,100 C50,80 70,60 90,60 H110 V80 H90 C80,80 70,90 70,100 C70,110 80,120 90,120 H110 V140 H90 C70,140 50,120 50,100 Z" />
        <path d="M130,60 H150 V140 H130 Z" />
        <path d="M170,60 H190 C210,60 230,80 230,100 C230,120 210,140 190,140 H170 Z M190,80 C200,80 210,90 210,100 C210,110 200,120 190,120 H190 Z" />
        <path d="M250,60 H270 V90 L290,60 H310 L280,100 L310,140 H290 L270,110 V140 H250 Z" />
        <path d="M330,60 H350 V140 H330 Z" />
        <path d="M370,60 H390 C410,60 430,80 430,100 C430,120 410,140 390,140 H370 Z M390,80 C400,80 410,90 410,100 C410,110 400,120 390,120 H390 Z" />
        <path d="M450,60 H470 V90 L490,60 H510 L480,100 L510,140 H490 L470,110 V140 H450 Z" />
      </g>
    </svg>
  );
}
