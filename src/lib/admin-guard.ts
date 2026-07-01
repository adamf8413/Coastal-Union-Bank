import { auth } from "@/lib/auth"

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized")
  }
  return session.user
}
