import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 处理语言检测与持久化重定向
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 只处理根路径的自动重定向
  if (pathname === '/') {
    // 1. 尝试从 Cookie 获取用户之前选过的语言
    let locale = request.cookies.get('NEXT_LOCALE')?.value

    // 2. 如果没 Cookie，解析 Accept-Language 头部
    if (!locale) {
      const acceptLanguage = request.headers.get('accept-language')
      if (acceptLanguage) {
        if (acceptLanguage.startsWith('zh')) {
          locale = 'zh-CN'
        } else if (acceptLanguage.startsWith('ja')) {
          locale = 'ja-JP'
        }
      }
    }

    // 3. 最终回退到默认语言
    locale = locale || 'en'

    // 执行重定向到 /[locale]/email
    return NextResponse.redirect(new URL(`/${locale}/email`, request.url))
  }

  return NextResponse.next()
}

// 仅在根路径执行此逻辑，避免性能损耗
export const config = {
  matcher: ['/'],
}