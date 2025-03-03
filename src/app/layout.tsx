import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Logo from "@/app/components/Logo";
import "./globals.css";
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Find Mobile & 24-Hour Notaries Near You | NotaryFinderNow",
  description: "Discover trusted notaries offering mobile, 24-hour, and free services in your area with NotaryFinderNow.",
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
    icon: [
      { url: '/icon', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} ${poppins.variable}`}>
      <head>
        {/* Google Analytics Script */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
