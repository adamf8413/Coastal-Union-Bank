import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const messages = await prisma.supportMessage.findMany({
    orderBy: { createdAt: "asc" },
    take: 200,
    include: { user: { select: { username: true, name: true } } },
  })

  return NextResponse.json({ messages })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { userId, message } = await req.json()
  if (!userId || !message || !message.trim()) {
    return NextResponse.json({ error: "User ID and message required" }, { status: 400 })
  }

  const msg = await prisma.supportMessage.create({
    data: {
      userId,
      message: message.trim(),
      role: "admin",
    },
  })

  return NextResponse.json({ message: msg })
}
