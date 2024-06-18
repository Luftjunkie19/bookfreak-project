
import './globals.css';

import GoogleAdsense from 'adsense/GoogleAdsense';
import AuthContextProvider from 'context/AuthContext';
import ReduxProvider from 'context/ReduxProvider';
import { Providers } from 'lib/NextUiProvider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import Navbar from '../components/Navbar/Navbar';
import Footer from 'components/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookFreak",
  description: "BookFreak",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <link rel="icon" href="/Logo.png" sizes="any" />
        <AuthContextProvider>
          <ReduxProvider>
            <Providers>
              <Toaster />
              <Navbar />
              {children}
        <Footer />
            </Providers>
          </ReduxProvider>
        </AuthContextProvider>
      </body>
      <GoogleAdsense pId={process.env.NEXT_PUBLIC_ADSENSE_ID as string} />
    </html>
  );
}
