module.exports = {
  reactStrictMode: false,
  images: {
    domains: ['static-cdn.jtvnw.net'],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
