import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()
const r = await fetch('http://localhost:3000/api/login/otp-init', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'demo', password: 'demo1234' })
})
const d = await r.json()
console.log('DEMO OTP INIT:', r.status, d.ok ? 'OK' : d.error)
if (d.ok) {
  await new Promise(res => setTimeout(res, 500))
  const otp = await p.otp.findFirst({
    where: { email: 'demo@palmfrontbank.com', purpose: 'LOGIN', used: false },
    orderBy: { createdAt: 'desc' }
  })
  console.log('DEMO OTP:', otp.code)
}
await p.$disconnect()
