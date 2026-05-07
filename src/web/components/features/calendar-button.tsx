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

  return <button onClick={handleClick}>Agendar</button>;
}
