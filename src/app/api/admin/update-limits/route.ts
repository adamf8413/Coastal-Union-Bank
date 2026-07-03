import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await prisma.depositMethod.updateMany({
    where: { isActive: true },
    data: { maxAmount: 20000000 },
  })

  return NextResponse.json({ message: `Updated ${result.count} deposit methods to maxAmount = 20,000,000` })
}
