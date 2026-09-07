import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ExperienceProvider } from '@/components/experience-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mattdomingo.com'),
  title: { default: 'Matt Domingo — Software Engineer & Co-founder', template: '%s — Matt Domingo' },
  description: 'Software engineer at Visa and co-founder of Openfloor. Building reliable systems, collaborative AI tools, and physical AI experiences. Based in Denver.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('portfolio-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark';document.documentElement.dataset.motion=localStorage.getItem('portfolio-motion')==='paused'||matchMedia('(prefers-reduced-motion: reduce)').matches?'reduced':'full'}catch(e){}})()` }} /></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ExperienceProvider>
          <a className="skip-link" href="#main-content">Skip to content</a>
          <SiteHeader />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <SiteFooter />
        </ExperienceProvider>
        <Analytics />
      </body>
    </html>
  );
}
