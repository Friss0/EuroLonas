/** Cuadrícula clara que ondula permanentemente (distorsión por turbulencia animada). */
export function WaveGrid({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id="wavegrid-distort"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.016"
            numOctaves="2"
            seed="6"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="22s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.5;1"
              keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
              values="0.008 0.016;0.012 0.010;0.008 0.016"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <pattern
          id="wavegrid-pattern"
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M30 0H0V30"
            fill="none"
            stroke="rgba(252,250,244,0.6)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect
        x="-6%"
        y="-12%"
        width="112%"
        height="124%"
        fill="url(#wavegrid-pattern)"
        filter="url(#wavegrid-distort)"
      />
    </svg>
  );
}
