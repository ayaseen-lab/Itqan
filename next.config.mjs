/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.quran.com" },
      { protocol: "https", hostname: "**.qurancdn.com" },
    ],
  },
};

export default nextConfig;
