import { auth } from "@/lib/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl

  if (req.auth && pathname === "/") {
    return Response.redirect(new URL("/dashboard", req.nextUrl.origin))
  }

  const isApi = pathname.startsWith("/api/")
  if (isApi) return

  const publicPaths = ["/login", "/register", "/"]
  const isPublic = publicPaths.includes(pathname)

  if (!req.auth && !isPublic) {
    return Response.redirect(new URL("/login", req.nextUrl.origin))
  }
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
