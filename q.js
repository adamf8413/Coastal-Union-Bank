const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()
p.user.findMany().then(u => { u.forEach(x => console.log(x.username, x.email)); p.$disconnect() })
