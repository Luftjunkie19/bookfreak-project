/** @type {import('next').NextConfig} */

// const withTM= require('next-transpile-modules')(['@square/web-sdk', 'react-square-web-payments-sdk']);


const nextConfig = {
  'swcMinify': true,
  productionBrowserSourceMaps: false, // Disable source maps in development
    optimizeFonts: false, // Disable font optimization
  experimental:{
    esmExternal:'loose'
  },
  reactStrictMode: true,
    images: {
      unoptimized: true,
        remotePatterns: [
          {protocol:'https', hostname:'**'}
        ]
      },
};

export default nextConfig;
