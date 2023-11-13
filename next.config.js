const withPWA = require('next-pwa')({
  dest: 'public'
})
const nextConfig = {
  ...withPWA({
    pwa: {
      disable: process.env.NODE_ENV === "development"
    },
    output: "export",
    distDir: "dist",
    images: {
      unoptimized: true
    }
  })
}

module.exports = nextConfig;
