const withPWA = require('next-pwa')({
  dest: 'public'
})
const nextConfig = {
  ...withPWA({
    output: "export",
    distDir: "dist",
    images: {
      unoptimized: true
    }
  })
}

module.exports = nextConfig;
