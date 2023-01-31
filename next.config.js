/** @type {import('next').NextConfig} */

const nextTranslate = require('next-translate')


const nextConfig = {
  ...nextTranslate(),
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'https://i.picsum.photos', 'https://picsum.photos', 'https://picsum.photos/200/300'],
  },
  devIndicators: {
        buildActivity: false
    },
}

module.exports = nextConfig
