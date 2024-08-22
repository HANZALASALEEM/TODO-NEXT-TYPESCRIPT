// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(request: NextRequest) {
//   const token = await getToken({ req: request as any });
//   console.log("token from middleware : ", token);
//   const signInUrl = new URL("/signIn", request.url);
//   const homeUrl = new URL("/home", request.url);

//   const { pathname } = request.nextUrl;

//   if (!token) {
//     if (pathname !== "/signIn" && pathname !== "/") {
//       return NextResponse.redirect(signInUrl);
//     }
//   } else {
//     if (pathname === "/signIn" || pathname === "/") {
//       return NextResponse.redirect(homeUrl);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/home", "/signIn", "/"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Attempt to retrieve the token
  const token = await getToken({ req: request as any });

  // Log token and request URL for debugging
  console.log("Token from middleware:", token);
  console.log("Request URL:", request.url);

  const signInUrl = new URL("/signIn", request.url);
  const homeUrl = new URL("/home", request.url);

  const { pathname } = request.nextUrl;

  // Redirect based on token presence and current pathname
  if (!token) {
    if (pathname !== "/signIn" && pathname !== "/") {
      console.log("No token found, redirecting to signIn.");
      return NextResponse.redirect(signInUrl);
    }
  } else {
    if (pathname === "/signIn" || pathname === "/") {
      console.log("Token found, redirecting to home.");
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/signIn", "/"],
};
