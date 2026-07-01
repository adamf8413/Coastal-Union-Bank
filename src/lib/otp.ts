import { prisma } from "@/lib/prisma"
import { sendOtpEmail } from "@/lib/resend"

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function createAndSendOtp(email: string, purpose = "VERIFY_EMAIL"): Promise<boolean> {
  const code = generateCode()

  await prisma.otp.create({
    data: {
      email,
      code,
      purpose,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  })

  return sendOtpEmail(email, code, purpose)
}

export async function verifyOtp(email: string, code: string, purpose = "VERIFY_EMAIL"): Promise<boolean> {
  const otp = await prisma.otp.findFirst({
    where: {
      email,
      code,
      purpose,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  })

  if (!otp) return false

  await prisma.otp.update({
    where: { id: otp.id },
    data: { used: true },
  })

  return true
}
