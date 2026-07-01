import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()
await fetch('http://localhost:3000/api/login/otp-init', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username:'demo', password:'demo1234'}) })
await new Promise(r => setTimeout(r, 500))
const otp = await p.otp.findFirst({ where:{email:'demo@palmfrontbank.com', purpose:'LOGIN', used:false}, orderBy:{createdAt:'desc'} })
console.log('DEMO OTP:', otp.code)
await p.$disconnect()
