import { prisma } from "@/lib/prisma"

function randomDigits(n: number): string {
  let s = ""
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10).toString()
  return s
}

function randomAlphanumeric(n: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let s = ""
  for (let i = 0; i < n; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

export function generateAccountNumber(): string {
  return `PBF-${randomDigits(8)}`
}

export function generateSwiftCode(): string {
  return `PBFKUSXX${randomAlphanumeric(3)}`
}

export async function createUniqueAccountNumber(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const num = generateAccountNumber()
    const existing = await prisma.user.findFirst({ where: { accountNumber: num } })
    if (!existing) return num
  }
  throw new Error("Could not generate unique account number")
}

export async function createUniqueSwiftCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = generateSwiftCode()
    const existing = await prisma.user.findFirst({ where: { swiftCode: code } })
    if (!existing) return code
  }
  throw new Error("Could not generate unique swift code")
}

export function generateRoutingNumber(): string {
  return randomDigits(9)
}

export async function createUniqueRoutingNumber(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const num = generateRoutingNumber()
    const existing = await prisma.user.findFirst({ where: { routingNumber: num } })
    if (!existing) return num
  }
  throw new Error("Could not generate unique routing number")
}
