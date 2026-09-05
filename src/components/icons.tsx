import type { ReactNode, SVGProps } from "react";

function S({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconBall = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="M4.5 19.5c-1.6-4.6-.6-10.3 2.9-13.1 3-2.4 8.2-2.6 12.1-1.9.7 3.9.5 9.1-1.9 12.1-2.8 3.5-8.5 4.5-13.1 2.9Z" />
    <path d="M8.5 15.5l7-7M10 10.5l1.2 1.2M12 8.5l1.2 1.2M13.8 12.2L15 13.4" />
  </S>
);

export const IconBolt = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />
  </S>
);

export const IconVault = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="M3.5 8.5 12 4l8.5 4.5v9L12 21l-8.5-3.5v-9Z" />
    <path d="M3.5 8.5 12 13l8.5-4.5M12 13v8" />
  </S>
);

export const IconTerminal = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <rect x="3" y="4.5" width="18" height="15" rx="2" />
    <path d="m7 9.5 3 2.7-3 2.7M12.5 15.5H17" />
  </S>
);

export const IconFlask = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="M9.5 3h5M10.5 3v6.2L4.8 18.6A1.8 1.8 0 0 0 6.4 21h11.2a1.8 1.8 0 0 0 1.6-2.4L13.5 9.2V3" />
    <path d="M7.5 15h9" />
  </S>
);

export const IconBox = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="M4 8 12 4l8 4v8l-8 4-8-4V8Z" />
    <path d="M4 8l8 4 8-4M12 12v8" />
  </S>
);

export const IconDownload = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="M12 4v10m0 0 4-4m-4 4-4-4M4.5 17.5V19a1.5 1.5 0 0 0 1.5 1.5h12A1.5 1.5 0 0 0 19.5 19v-1.5" />
  </S>
);

export const IconCopy = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <rect x="9" y="9" width="11" height="11" rx="1.5" />
    <path d="M5.5 14.5H5a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 5 3.5h8A1.5 1.5 0 0 1 14.5 5v.5" />
  </S>
);

export const IconCheck = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="m4.5 12.5 5 5L19.5 7" />
  </S>
);

export const IconSend = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="M20.5 3.5 3.5 10l6.5 2.5L12.5 19l8-15.5Z" />
    <path d="M10 12.5 20.5 3.5" />
  </S>
);

export const IconReset = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="M4 5v5h5" />
    <path d="M4.5 10A8 8 0 1 1 4 13.5" />
  </S>
);

export const IconRadar = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 12 18 6.5" />
    <circle cx="12" cy="12" r="0.5" fill="currentColor" />
  </S>
);

export const IconCode = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4.5l-3 15" />
  </S>
);

export const IconChip = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <rect x="7" y="7" width="10" height="10" rx="1.5" />
    <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" />
  </S>
);

export const IconChevron = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="m8.5 5 7 7-7 7" />
  </S>
);

export const IconFile = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="M6 3.5h8L19 8.5V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20V5A1.5 1.5 0 0 1 6.5 3.5Z" />
    <path d="M13.5 3.5V9H19" />
  </S>
);

export const IconShield = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="M12 3.5 5 6v5.5c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-2.5Z" />
    <path d="m9 11.5 2.2 2.2L15.5 9.5" />
  </S>
);

export const IconTree = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="M6 4v14.5M6 8h6M6 13h9M6 18h4" />
    <circle cx="14.5" cy="8" r="1.6" />
    <circle cx="17.5" cy="13" r="1.6" />
    <circle cx="12.5" cy="18" r="1.6" />
  </S>
);

export const IconX = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </S>
);

export const IconFolder = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="M3.5 6.5A1.5 1.5 0 0 1 5 5h4.5l2 2.5H19A1.5 1.5 0 0 1 20.5 9v9A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18V6.5Z" />
  </S>
);

export const IconBrain = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="M9.5 4.5A2.5 2.5 0 0 0 7 7v.3A3 3 0 0 0 5 10a3 3 0 0 0 .6 5.2A2.8 2.8 0 0 0 8.5 19c.9 0 1.6-.3 2.2-.8V6.6c0-1.2-.5-2.1-1.2-2.1Z" />
    <path d="M14.5 4.5A2.5 2.5 0 0 1 17 7v.3a3 3 0 0 1 2 2.7 3 3 0 0 1-.6 5.2 2.8 2.8 0 0 1-2.9 3.8c-.9 0-1.6-.3-2.2-.8V6.6c0-1.2.5-2.1 1.2-2.1Z" />
  </S>
);

export const IconPlus = (p: SVGProps<SVGSVGElement>) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
);
