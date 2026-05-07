import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// [ 修复 ] 严格限制中间件逻辑，确保只有访问 "/" 时才会重定向
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 仅处理根路径 "/"
  if (pathname === '/') {
    // 优先从 Cookie 读取，其次从 Header 读取
    let locale = request.cookies.get('NEXT_LOCALE')?.value
    if (!locale) {
      const acceptLanguage = request.headers.get('accept-language')
      if (acceptLanguage?.startsWith('zh')) locale = 'zh-CN'
      else if (acceptLanguage?.startsWith('ja')) locale = 'ja-JP'
    }
    locale = locale || 'en'

    // [ 修复 ] 执行重定向到当前语言的 email 页面
    return NextResponse.redirect(new URL(`/${locale}/email`, request.url))
  }

  // 其他所有路径（如 /account, /email）直接放行，不再干涉
  return NextResponse.next()
}

export const config = {
  // [ 关键 ] matcher 必须精准，防止干扰其他静态资源和页面
  matcher: ['/'],
}