import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isSecure = req.url.startsWith("https")
  const cookiePrefix = isSecure ? "__Secure-" : ""
  const sessionCookie = req.cookies.get(`${cookiePrefix}authjs.session-token`)

  if (sessionCookie && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/"],
}
