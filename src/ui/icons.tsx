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
