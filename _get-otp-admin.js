import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()
await fetch('/api/login/otp-init', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username:'admin', password:'admin1234'}) })
await new Promise(r => setTimeout(r, 500))
const otp2 = await p.otp.findFirst({ where:{email:'admin@palmfrontbank.com', purpose:'LOGIN', used:false}, orderBy:{createdAt:'desc'} })
console.log('ADMIN OTP:', otp2.code)
await p.$disconnect()
