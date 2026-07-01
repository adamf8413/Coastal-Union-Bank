import { NextResponse } from "next/server"
import { getBrandConfig } from "@/lib/brand-db"

export async function GET() {
  const config = await getBrandConfig()
  return NextResponse.json(config)
}
