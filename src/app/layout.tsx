import './globals.css';
import type { Metadata } from 'next';
import {
  Inter,
  Oswald,
  JetBrains_Mono,
  Bebas_Neue,
  Source_Sans_3,
  Roboto,
} from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/components/providers/AppProvider';
import { NotificationToast } from '@/components/ui/notifications';

// Industrial Typography Implementation
// Primary body font - clean, readable, professional
const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-industrial-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

// Secondary body font - modern, tech-forward
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-industrial-secondary',
  display: 'swap',
});

const RobotoFont = Roboto({
  subsets: ['latin'],
  variable: '--font-industrial-roboto',
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

// Primary heading font - strong, industrial
const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-industrial-heading',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

// Display font - bold, impactful for hero sections
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-industrial-display',
  weight: ['400'],
  display: 'swap',
});

// Monospace font - technical, code, data
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-industrial-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WorkLink',
  description: 'Connecting Talent with Opportunity',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${sourceSans.variable} ${inter.variable} ${oswald.variable} ${bebasNeue.variable} ${jetbrainsMono.variable} ${RobotoFont.variable} flex flex-col min-h-screen font-industrial-body antialiased`}
      >
        <AppProvider>
          <main>{children}</main>
          <Toaster />
          <NotificationToast />
        </AppProvider>
      </body>
    </html>
  );
}
