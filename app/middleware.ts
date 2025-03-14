// middleware.ts
import { NextResponse, NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets).*)"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/es")) return NextResponse.next();

  const newUrl = new URL(request.url);
  newUrl.pathname = `/es${pathname}`;

  const response = NextResponse.redirect(newUrl);
  response.cookies.set("NEXT_LOCALE", "es", { path: "/" });
  return response;
}
