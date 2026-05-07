/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-CN', 'ja-JP'],
  },
  // 避免在 Edge 环境下因为找不到路径报错
  localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
};
