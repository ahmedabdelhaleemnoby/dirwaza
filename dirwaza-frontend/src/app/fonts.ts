// app/fonts.ts
import localFont from 'next/font/local';

export const ibmPlexSansArabic = localFont({
  src: [
    {
      path: '../../public/fonts/IBMPlexSansArabic-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/IBMPlexSansArabic-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/IBMPlexSansArabic-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-ibm-plex-sans-arabic',
  display: 'swap',
});
