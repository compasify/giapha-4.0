import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'Gia Phả Online - Xây dựng và quản lý gia phả trực tuyến',
  description: 'Ứng dụng xây dựng gia phả trực tuyến cho gia đình Việt Nam. Quản lý dòng họ, cây gia phả, sự kiện, lịch âm dương tự động chuyển đổi.',
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
        </QueryProvider>
      </body>
    </html>
  );
}
