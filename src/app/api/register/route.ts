import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { createUniqueAccountNumber, createUniqueSwiftCode } from "@/lib/account"

export async function POST(req: Request) {
  try {
    const { username, name, email, password } = await req.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email, and password required" }, { status: 400 })
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } })
    if (existingUsername) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 })
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const accountNumber = await createUniqueAccountNumber()
    const swiftCode = await createUniqueSwiftCode()

    const user = await prisma.user.create({
      data: {
        username,
        name: name || null,
        email,
        password: hashedPassword,
        isVerified: true,
        accountNumber,
        swiftCode,
        holdings: {
          createMany: {
            data: [
              { assetType: "USD", amount: 0 },
              { assetType: "EUR", amount: 0 },
              { assetType: "GBP", amount: 0 },
              { assetType: "BTC", amount: 0 },
              { assetType: "ETH", amount: 0 },
              { assetType: "SOL", amount: 0 },
            ],
          },
        },
      },
    })

    return NextResponse.json({ id: user.id, username: user.username, email: user.email })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
