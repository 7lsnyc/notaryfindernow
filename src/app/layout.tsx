import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | NotaryFinderNow',
    default: 'NotaryFinderNow - Find Trusted Notaries Near You',
  },
  description: 'Find mobile notaries, 24-hour notaries, and remote online notaries near you. Book trusted notary services for loan signings, document authentication, and more.',
  keywords: "notary, mobile notary, 24-hour notary, free notary services, notary public",
  openGraph: {
    title: "Find Mobile & 24-Hour Notaries Near You | NotaryFinderNow",
    description: "Discover trusted notaries offering mobile, 24-hour, and free services in your area.",
    type: "website",
    locale: "en_US",
    siteName: "NotaryFinderNow",
  },
  metadataBase: new URL('https://notaryfindernow.com'),
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        
        {/* Google Analytics Script */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `,
          }}
        />
        
        {/* Google AdSense Script */}
        <Script
          strategy="lazyOnload"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2858704759926400"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
