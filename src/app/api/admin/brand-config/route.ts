import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-guard"
import { updateBrandConfig } from "@/lib/brand-db"
import type { Brand } from "@/lib/brand"

export async function PUT(req: Request) {
  try {
    await requireAdmin()
    const body: Partial<Brand> = await req.json()
    const config = await updateBrandConfig(body)
    return NextResponse.json(config)
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
