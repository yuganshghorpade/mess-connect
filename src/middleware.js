import { NextResponse } from 'next/server';
import { getDataFromToken } from './utils/getDataFromToken';
import { CloudCog } from 'lucide-react';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

export async function middleware(request) {
//   const {token,type} = await getDataFromToken({ req: request });

const token = cookies().get("accessToken");
console.log(token)
  const url = request.nextUrl;

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (url.pathname.startsWith('/login') ||
      url.pathname.startsWith('/register') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/register', request.url));
  }

  return NextResponse.next();
}
