import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const tx = await prisma.transaction.findUnique({
    where: { id },
    include: {
      user: { select: { username: true, name: true } },
      recipient: { select: { username: true, name: true } },
    },
  })

  if (!tx || (tx.userId !== session.user.id && (session.user as any).role !== "ADMIN")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ receipt: tx })
}
