import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import useAuthStore from "./zustand/authStore";






// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // const { isAuthenticated } = useAuthStore.getState();
 

  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/signin" || path === "/";
//  console.log(isAuthenticated)
//   if (isPublicPath && isAuthenticated) {
//     return NextResponse.redirect(new URL("/upload", request.url));
//   }
//   if (!isPublicPath && isAuthenticated) {
//     return NextResponse.redirect(new URL("/signin", request.url));
//   }
//   // If the conditions are not met, continue with the request
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/upload", "/assets", "/signin", "/user", "/settings"],
};
