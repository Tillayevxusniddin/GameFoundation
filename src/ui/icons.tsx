// docs/11_ACCESSIBILITY_AND_LOCALIZATION.md — interfeys belgilari inline SVG.
// Belgi matn bilan takrorlanadi, shuning uchun SVG aria-hidden bo'ladi.

interface IconProps {
  className?: string;
}

function svgProps(className?: string): {
  className: string | undefined;
  width: number;
  height: number;
  viewBox: string;
  "aria-hidden": true;
  focusable: "false";
} {
  return {
    className,
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    focusable: "false",
  };
}

export function IconMap({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}

export function IconSettings({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  );
}

export function IconDownload({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}

export function IconUpload({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21V9M7 14l5-5 5 5M5 3h14" />
    </svg>
  );
}

export function IconStar({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="currentColor">
      <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />
    </svg>
  );
}

export function IconBadge({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="9" r="5" />
      <path d="M8 13.5 7 22l5-3 5 3-1-8.5" />
    </svg>
  );
}

export function IconLock({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function IconClose({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconArrowUp({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

export function IconArrowDown({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  );
}

export function IconArrowLeft({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function IconArrowRight({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconUser({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function IconVolume({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12" />
    </svg>
  );
}

export function IconVolumeOff({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="m16 9 5 6M21 9l-5 6" />
    </svg>
  );
}

export function IconMotion({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 16h4l3-8 4 12 3-8h4" />
    </svg>
  );
}

export function IconTrash({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
    </svg>
  );
}

export function IconInfo({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7h.01" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m5 13 4 4 10-10" />
    </svg>
  );
}

export function IconWarning({ className }: IconProps): JSX.Element {
  return (
    <svg {...svgProps(className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v5M12 18h.01" />
    </svg>
  );
}

