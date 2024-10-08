import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request as any });

  const signInUrl = new URL("/signIn", request.url);
  const homeUrl = new URL("/home", request.url);

  const { pathname } = request.nextUrl;

  if (!token) {
    if (pathname !== "/signIn" && pathname !== "/") {
      return NextResponse.redirect(signInUrl);
    }
  } else {
    if (pathname === "/signIn" || pathname === "/") {
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/signIn", "/"],
};
