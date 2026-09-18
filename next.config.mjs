/** @type {import('next').NextConfig} */
const nextConfig = {
  // react-leaflet manages an imperative DOM container and is not compatible with React 19's dev-only StrictMode effect replay.
  reactStrictMode: false,
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }]
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
