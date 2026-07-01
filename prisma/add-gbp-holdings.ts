import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({ select: { id: true } })
  for (const u of users) {
    const existing = await prisma.holding.findUnique({
      where: { userId_assetType: { userId: u.id, assetType: "GBP" } },
    })
    if (!existing) {
      await prisma.holding.create({ data: { userId: u.id, assetType: "GBP", amount: 0 } })
      console.log("Added GBP for", u.id)
    }
  }
  console.log("Done")
}

main().finally(() => prisma.$disconnect())
