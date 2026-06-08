import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VaultDrive — Personal Cloud Storage',
  description: 'A premium private cloud storage platform for your files. Upload, preview, and organize files securely.',
  keywords: ['cloud storage', 'file manager', 'personal drive', 'VaultDrive'],
  authors: [{ name: 'VaultDrive' }],
  robots: 'noindex, nofollow', // Private app
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-mesh antialiased">
        {children}
      </body>
    </html>
  );
}
