import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { UpdateChecker } from '@/components/desktop/update-checker';
const inter = Inter({ subsets: ['latin', 'vietnamese'] });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://giapha.online';
const APP_NAME = 'Gia Phả 365';
const APP_DESCRIPTION =
  'Ứng dụng xây dựng gia phả trực tuyến cho gia đình Việt Nam. Quản lý dòng họ, cây gia phả, sự kiện, lịch âm dương tự động chuyển đổi.';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};
export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} - Xây dựng và quản lý gia phả trực tuyến`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'gia phả', 'gia phả online', 'cây gia phả', 'gia phả trực tuyến', 'gia phả 365',
    'quản lý dòng họ', 'phả hệ', 'family tree', 'lịch âm',
    'xưng hô Việt Nam', 'gia đình Việt Nam', 'dòng họ Việt Nam',
  ],
  authors: [{ name: APP_NAME, url: APP_URL }],
  creator: APP_NAME,
  publisher: APP_NAME,
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} - Xây dựng và quản lý gia phả trực tuyến`,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} - Xây dựng và quản lý gia phả trực tuyến`,
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
          <Toaster />
          <UpdateChecker />
        </QueryProvider>
      </body>
    </html>
  );
}
