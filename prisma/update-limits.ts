import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.depositMethod.updateMany({
    where: { isActive: true },
    data: { maxAmount: 20000000 },
  })
  console.log(`Updated ${result.count} deposit methods to maxAmount = 20,000,000`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
