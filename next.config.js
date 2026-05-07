/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})
const getGitCommitInfo = require('./utils/getGitCommitInfo')

module.exports = async () => {
  const nextConfig = getGitCommitInfo(
    withPWA({
      i18n,
      reactStrictMode: true,
      swcMinify: true,
      output: 'standalone',
      
      // 统一处理首页重定向
      async redirects() {
        return [
          {
            source: '/',
            destination: '/email',
            permanent: false,
          },
        ]
      },

      // Webpack 补丁：在 Edge 环境构建时忽略 Node.js 原生模块
      webpack: (config, { isServer }) => {
        if (isServer) {
          config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
          };
        }
        return config;
      },
    })
  )
  return nextConfig
}