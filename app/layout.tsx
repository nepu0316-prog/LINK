import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || '親子小日子'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
const gaId = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | 親子生活 × 團購好物 × 溫暖插畫`,
    template: `%s | ${siteName}`,
  },
  description: '分享親子生活、精選團購商品、溫暖插畫與親子共玩推薦。跟著我一起記錄孩子成長的每一刻 🌿',
  keywords: ['親子生活', '團購', '親子共玩', '插畫', 'Reels', '台灣媽媽部落客'],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: siteUrl,
    siteName,
    title: `${siteName} | 親子生活 × 團購好物`,
    description: '分享親子生活、精選團購商品、溫暖插畫與親子共玩推薦。',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | 親子生活 × 團購好物`,
    description: '分享親子生活、精選團購商品、溫暖插畫與親子共玩推薦。',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#FDF8F5',
              color: '#3D2B1F',
              border: '1px solid #E8D5C9',
              borderRadius: '1rem',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  )
}
