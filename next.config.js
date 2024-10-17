/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  // Disable server-side rendering for now
  ssr: false,
}

module.exports = nextConfig