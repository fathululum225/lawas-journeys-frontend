import { Suspense, type ReactNode } from 'react';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { SkipLink } from './SkipLink';
import { WhatsAppFloat } from './WhatsAppFloat';

/** Header, footer and floating WhatsApp button around every customer page (not the admin panel). */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main className="site-main" id="main">{children}</main>
      <Footer />
      <Suspense fallback={null}>
        <WhatsAppFloat />
      </Suspense>
    </>
  );
}
