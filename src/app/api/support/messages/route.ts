import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const messages = await prisma.supportMessage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    take: 100,
  })

  return NextResponse.json({ messages })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { message } = await req.json()
  if (!message || !message.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 })
  }

  const msg = await prisma.supportMessage.create({
    data: {
      userId: session.user.id,
      message: message.trim(),
      role: "user",
    },
  })

  return NextResponse.json({ message: msg })
}
