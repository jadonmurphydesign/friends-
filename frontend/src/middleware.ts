// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  console.log('[MW]', req.nextUrl.pathname);
    const { pathname } = req.nextUrl;
    // Protect /dashboard and all subroutes
    if (pathname.startsWith('/dashboard')) {
      const token = req.cookies.get('token');
      if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};