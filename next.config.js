/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this to ensure environment variables are accessible
  env: {
    API_URL: process.env.API_URL,
    // Add other environment variables here
  },
  output: 'standalone', // Creates a standalone build that's easier to deploy
  
  // Ignore ESLint errors during build
  eslint: {
    // Warning: This will completely ignore ESLint errors during production builds
    ignoreDuringBuilds: true,
  },
  
  // Ignore TypeScript errors during build if needed
  typescript: {
    // Warning: This will completely ignore TypeScript errors during production builds
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig 