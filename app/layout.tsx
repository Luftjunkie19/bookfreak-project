
import './globals.css';

import "primereact/resources/themes/lara-dark-blue/theme.css";

import classes from '../stylings/gradient.module.css'
import GoogleAdsense from 'adsense/GoogleAdsense';
import AuthContextProvider from 'context/AuthContext';
import ReduxProvider from 'context/ReduxProvider';
import { Providers } from 'lib/NextUiProvider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import Navbar from '../components/Navbar/Navbar';
import Footer from 'components/Footer';
import { PrimeReact } from 'lib/PrimeReact';
import LeftBar from '../components/left-bar/LeftBar';

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
      <body className={`bg-secondary-color overflow-y-hidden w-full min-h-screen ${classes['dark-blue-gradiented']}`}>
        <link rel="icon" href="/Logo.png" sizes="any" />
        <AuthContextProvider>
          <ReduxProvider>
            <Providers>
              <PrimeReact>
              <Toaster />
                <Navbar />
                <div className="flex h-full">
                  <LeftBar />
          
                  <div className="w-full overflow-y-auto max-h-screen h-full">
              {children}
                <Footer />
   </div>
        
                </div>
                </PrimeReact>
            </Providers>
          </ReduxProvider>
        </AuthContextProvider>
      </body>
      <GoogleAdsense pId={process.env.NEXT_PUBLIC_ADSENSE_ID as string} />
    </html>
  );
}
