type IconProps = {
  className?: string;
};

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export function IconSearch({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function IconCart({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" />
      <circle cx="9.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconUser({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
    </svg>
  );
}

export function IconMenu({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

export function IconChevronDown({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function IconChevronRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconMinus({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconTruck({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2 7h11v9H2z" />
      <path d="M13 10h4l4 3.5V16h-8z" />
      <circle cx="6.5" cy="18" r="1.7" />
      <circle cx="17" cy="18" r="1.7" />
    </svg>
  );
}

export function IconStorefront({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 9.5 4.5 4h15L21 9.5" />
      <path d="M4 9.5v10h16v-10" />
      <path d="M9 19.5v-6h6v6" />
      <path d="M3 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
    </svg>
  );
}

export function IconPin({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}

export function IconGrain({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 2c2 3 2 5 0 7-2-2-2-4 0-7Z" />
      <path d="M12 9v13" />
      <path d="M12 12c-3-1-5-3-5-6 3 0 5 2 6 5" />
      <path d="M12 12c3-1 5-3 5-6-3 0-5 2-6 5" />
      <path d="M12 17c-3-1-5-3-5-6 3 0 5 2 6 5" />
      <path d="M12 17c3-1 5-3 5-6-3 0-5 2-6 5" />
    </svg>
  );
}

export function IconBeverage({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 3h12l-1.5 15.5a2 2 0 0 1-2 1.5h-5a2 2 0 0 1-2-1.5L6 3Z" />
      <path d="M5 8h14" />
    </svg>
  );
}

export function IconDroplet({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3c3.5 4.2 6 7.6 6 10.5A6 6 0 0 1 6 13.5C6 10.6 8.5 7.2 12 3Z" />
    </svg>
  );
}

export function IconPersonalCare({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 3h6v4l2 2v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9l2-2Z" />
      <path d="M7 13h10" />
    </svg>
  );
}

export function IconBox({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 8.5 12 4l9 4.5L12 13 3 8.5Z" />
      <path d="M3 8.5V16l9 4.5 9-4.5V8.5" />
      <path d="M12 13v7.5" />
    </svg>
  );
}

export function IconPaw({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <ellipse cx="12" cy="16" rx="4.5" ry="3.5" />
      <ellipse cx="6" cy="10" rx="1.7" ry="2.2" />
      <ellipse cx="10" cy="7.5" rx="1.7" ry="2.2" />
      <ellipse cx="14" cy="7.5" rx="1.7" ry="2.2" />
      <ellipse cx="18" cy="10" rx="1.7" ry="2.2" />
    </svg>
  );
}

export function IconEye({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconBuilding({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="4" y="3" width="11" height="18" rx="1" />
      <path d="M8 7h3M8 11h3M8 15h3" />
      <path d="M15 9h5v12h-5" />
    </svg>
  );
}

export function IconClock({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function IconTag({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12.5 3H5a2 2 0 0 0-2 2v7.5a1 1 0 0 0 .3.7l9 9a1 1 0 0 0 1.4 0l7.5-7.5a1 1 0 0 0 0-1.4l-9-9a1 1 0 0 0-.7-.3Z" />
      <circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconPharmacy({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

export function IconImageOff({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 4h13a2 2 0 0 1 2 2v13" />
      <path d="M20 20H6a2 2 0 0 1-2-2V6" />
      <path d="m4 20 6.5-7 3 3L20 9" />
      <path d="M3 3l18 18" />
    </svg>
  );
}
