import { brand } from "@/lib/brand"

export async function sendOtpEmail(email: string, code: string, purpose = "VERIFY_EMAIL") {
  const apiKey = process.env.RESEND_API_KEY || "re_Snr3gvXB_8tKjYmWVBpC6JxGXsSKbP6jK"

  if (!apiKey) {
    console.log(`[DEV MODE] OTP for ${email}: ${code} (purpose: ${purpose})`)
    return true
  }

  try {
    const { Resend } = await import("resend")
    const resend = new Resend(apiKey)

    const isTransfer = purpose === "TRANSFER"
    const subject = isTransfer
      ? `Confirm your ${brand.name} transfer`
      : `Your ${brand.name} verification code`

    const heading = isTransfer
      ? "Confirm your transfer"
      : "Your verification code"

    await resend.emails.send({
      from: `no-reply@${brand.domain}`,
      to: email,
      subject,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <h2 style="color:#6366f1;">${brand.name}</h2>
          <p>${heading}:</p>
          <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;padding:16px;background:#f4f4f5;border-radius:8px;margin:16px 0;">
            ${code}
          </div>
          <p style="color:#64748b;font-size:14px;">This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    })
    return true
  } catch (err) {
    console.error("Resend error:", err)
    console.log(`[FALLBACK] OTP for ${email}: ${code} (purpose: ${purpose})`)
    return true
  }
}
