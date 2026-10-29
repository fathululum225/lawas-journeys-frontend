import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/playfair-display/index.css';
import '@fontsource-variable/playfair-display/wght-italic.css';
import '@fontsource-variable/plus-jakarta-sans/index.css';
import './globals.css';
import { getLanguage } from '@/i18n/server';
import { SITE } from '@/lib/config';
import { AuthProvider } from '@/providers/AuthProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { ToastProvider } from '@/providers/ToastProvider';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Archaeologist-Led Heritage Tours in Indonesia`,
    template: `%s | ${SITE.name}`,
  },
  description: 'Archaeologist-led heritage journeys across Indonesia: Yogyakarta, Central Java, East Java and Eastern Indonesia.',
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#e4572e',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const language = await getLanguage();

  return (
    <html lang={language} data-scroll-behavior="smooth">
      <body>
        <LanguageProvider language={language}>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
