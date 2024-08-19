import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXT_AUTH_SECRET;

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request as any });

  console.log("Token From Middleware : ", token);

  if (token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signIn"],
};
