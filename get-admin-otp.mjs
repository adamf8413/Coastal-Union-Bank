import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()
const r = await fetch('/api/login/otp-init', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin1234' })
})
const d = await r.json()
console.log('ADMIN OTP INIT:', r.status, d.ok ? 'OK' : d.error)
if (d.ok) {
  await new Promise(res => setTimeout(res, 500))
  const otp = await p.otp.findFirst({
    where: { email: 'admin@palmfrontbank.com', purpose: 'LOGIN', used: false },
    orderBy: { createdAt: 'desc' }
  })
  console.log('ADMIN OTP:', otp.code)
}
await p.$disconnect()
