import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-guard"

export async function GET() {
  try {
    await requireAdmin()
    const config = await prisma.config.findUnique({ where: { key: "cot_required" } })
    return NextResponse.json({ cotRequired: config?.value !== "false" })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin()
    const { cotRequired } = await req.json()
    await prisma.config.upsert({
      where: { key: "cot_required" },
      update: { value: cotRequired ? "true" : "false" },
      create: { key: "cot_required", value: cotRequired ? "true" : "false" },
    })
    return NextResponse.json({ cotRequired })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
