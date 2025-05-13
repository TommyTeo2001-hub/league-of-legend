/** @type {import('next').NextConfig} */
const nextConfig = {
  // Comment out or remove the output: 'export' line to enable server-side rendering
  // output: 'export', 
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: [
      'images.pexels.com', 
      'ddragon.leagueoflegends.com' // Add Data Dragon domain for champion images
    ]
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.cache = false;
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_BE_LOL_API_URL: 'http://localhost:8000',
  },
};

module.exports = nextConfig;