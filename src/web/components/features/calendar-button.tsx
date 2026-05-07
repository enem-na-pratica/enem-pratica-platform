'use client';
import { env } from '@/src/core/main/config/env';

const CALENDAR_URL = env.NEXT_PUBLIC_CALENDAR_URL;

export function CalendarButton() {
  const handleClick = () => {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = CALENDAR_URL;
    } else {
      const width = 1280;
      const height = 720;
      const left = Math.round(window.screenX + (window.outerWidth - width) / 2);
      const top = Math.round(
        window.screenY + (window.outerHeight - height) / 2,
      );

      window.open(
        CALENDAR_URL,
        'google-calendar',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
      );
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      aria-label="Agendar um compromisso"
      className="flex cursor-pointer items-center justify-center rounded-lg p-2 transition-all duration-300 hover:bg-(--foreground)/10"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          x="2"
          y="4"
          width="16"
          height="14"
          rx="2"
          stroke="var(--accent)"
          strokeWidth="1.5"
          fill="none"
        />
        <line
          x1="2"
          y1="8"
          x2="18"
          y2="8"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />
        <line
          x1="6.5"
          y1="2"
          x2="6.5"
          y2="6"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="13.5"
          y1="2"
          x2="13.5"
          y2="6"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="10"
          y1="11"
          x2="10"
          y2="15"
          stroke="var(--foreground)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="13"
          x2="12"
          y2="13"
          stroke="var(--foreground)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
