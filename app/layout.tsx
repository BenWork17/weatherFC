import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'Weather Forecast App - Dự báo thời tiết chính xác',
  description: 'Ứng dụng dự báo thời tiết hiện đại với giao diện đẹp và dữ liệu chính xác',
  keywords: 'weather, forecast, dự báo thời tiết, thời tiết, Vietnam weather',
  authors: [{ name: 'Weather App Team' }],
  creator: 'Weather App',
  publisher: 'Weather App',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#3B82F6',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://weather-app.vercel.app',
    title: 'Weather Forecast App',
    description: 'Ứng dụng dự báo thời tiết hiện đại',
    siteName: 'Weather App',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weather Forecast App',
    description: 'Ứng dụng dự báo thời tiết hiện đại',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#3B82F6" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="font-sans min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}