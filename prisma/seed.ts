import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { createUniqueAccountNumber, createUniqueSwiftCode, createUniqueRoutingNumber } from "@/lib/account"
import { brand } from "@/lib/brand"

const prisma = new PrismaClient()

async function main() {
  const DEMO_EMAIL = "demo@palmfrontbank.com"
  const DEMO_PASSWORD = "demo1234"

  const password = await bcrypt.hash(DEMO_PASSWORD, 12)

  // Demo user
  const demoAccountNumber = await createUniqueAccountNumber()
  const demoRoutingNumber = await createUniqueRoutingNumber()
  const demoSwiftCode = await createUniqueSwiftCode()
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      username: "demo",
      name: "Demo User",
      email: DEMO_EMAIL,
      password,
      role: "USER",
      isVerified: true,
      accountNumber: demoAccountNumber,
      routingNumber: demoRoutingNumber,
      swiftCode: demoSwiftCode,
      holdings: {
        createMany: {
          data: [
            { assetType: "USD", amount: 45230.50 },
            { assetType: "EUR", amount: 12200.00 },
            { assetType: "GBP", amount: 8000.00 },
            { assetType: "BTC", amount: 0.42 },
            { assetType: "ETH", amount: 3.75 },
            { assetType: "SOL", amount: 15.20 },
          ],
        },
      },
    },
  })

  // Admin user
  const adminPassword = await bcrypt.hash("admin1234", 12)
  const adminAccountNumber = await createUniqueAccountNumber()
  const adminRoutingNumber = await createUniqueRoutingNumber()
  const adminSwiftCode = await createUniqueSwiftCode()
  const admin = await prisma.user.upsert({
    where: { email: "admin@palmfrontbank.com" },
    update: {},
    create: {
      username: "admin",
      name: "Admin User",
      email: "admin@palmfrontbank.com",
      password: adminPassword,
      role: "ADMIN",
      isVerified: true,
      accountNumber: adminAccountNumber,
      routingNumber: adminRoutingNumber,
      swiftCode: adminSwiftCode,
      holdings: {
        createMany: {
          data: [
            { assetType: "USD", amount: 100000 },
            { assetType: "EUR", amount: 50000 },
            { assetType: "GBP", amount: 25000 },
            { assetType: "BTC", amount: 1.5 },
            { assetType: "ETH", amount: 10 },
            { assetType: "SOL", amount: 50 },
          ],
        },
      },
    },
  })

  // Deposit methods
  const methods = [
    { name: "Wire Transfer (USD)", type: "fiat", fee: 0, processingTime: "1-3 business days", minAmount: 100, maxAmount: 20000000 },
    { name: "SEPA Transfer (EUR)", type: "fiat", fee: 0, processingTime: "1-2 business days", minAmount: 50, maxAmount: 20000000 },
    { name: "ACH Transfer (USD)", type: "fiat", fee: 0.5, processingTime: "3-5 business days", minAmount: 10, maxAmount: 20000000 },
    { name: "Credit/Debit Card", type: "fiat", fee: 2.9, processingTime: "Instant", minAmount: 10, maxAmount: 20000000 },
    { name: "Coinbase Pay", type: "crypto", fee: 1.5, processingTime: "Instant", minAmount: 10, maxAmount: 20000000 },
    { name: "MetaMask Wallet", type: "crypto", fee: 0.3, processingTime: "1-5 min", minAmount: 5, maxAmount: 20000000 },
    { name: "Phantom Wallet (SOL)", type: "crypto", fee: 0.1, processingTime: "1-5 min", minAmount: 5, maxAmount: 20000000 },
  ]

  for (const method of methods) {
    await prisma.depositMethod.create({ data: method })
  }

  const allMethods = await prisma.depositMethod.findMany()

  // Demo user transactions
  const demoTransactions = [
    { type: "deposit", assetType: "USD", amount: 10000, fee: 0, status: "completed", methodId: allMethods[0].id },
    { type: "deposit", assetType: "EUR", amount: 5000, fee: 0, status: "completed", methodId: allMethods[1].id },
    { type: "deposit", assetType: "BTC", amount: 0.5, fee: 0.0015, status: "completed", methodId: allMethods[3].id },
    { type: "deposit", assetType: "ETH", amount: 5, fee: 0.015, status: "completed", methodId: allMethods[4].id },
    { type: "deposit", assetType: "SOL", amount: 20, fee: 0.02, status: "completed", methodId: allMethods[5].id },
    { type: "deposit", assetType: "USD", amount: 2500, fee: 0, status: "pending", methodId: allMethods[2].id },
  ]

  for (const tx of demoTransactions) {
    await prisma.transaction.create({
      data: { userId: user.id, ...tx },
    })
  }

  // Admin user transactions
  const adminTransactions = [
    { type: "deposit", assetType: "USD", amount: 50000, fee: 0, status: "completed", methodId: allMethods[0].id },
    { type: "deposit", assetType: "BTC", amount: 1, fee: 0.003, status: "completed", methodId: allMethods[3].id },
    { type: "deposit", assetType: "ETH", amount: 5, fee: 0.015, status: "pending", methodId: allMethods[4].id },
  ]

  for (const tx of adminTransactions) {
    await prisma.transaction.create({
      data: { userId: admin.id, ...tx },
    })
  }

  // Brand config
  await prisma.brandConfig.upsert({
    where: { id: "singleton" },
    update: { data: JSON.stringify(brand) },
    create: { id: "singleton", data: JSON.stringify(brand) },
  })

  console.log("Seed data created successfully")
  console.log("Demo user: demo / demo1234")
  console.log("Admin user: admin / admin1234")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
