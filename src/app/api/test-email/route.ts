import { NextResponse } from "next/server"

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_SERVER_PASSWORD
  const fromAddress = process.env.EMAIL_FROM || "onboarding@resend.dev"

  // Diagnostic info (mask the API key)
  const diagnostics: Record<string, string | boolean | null> = {
    RESEND_API_KEY_set: !!process.env.RESEND_API_KEY,
    EMAIL_SERVER_PASSWORD_set: !!process.env.EMAIL_SERVER_PASSWORD,
    apiKey_starts_with: apiKey ? apiKey.substring(0, 6) + "..." : "NOT SET",
    EMAIL_FROM: fromAddress,
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST || "not set",
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT || "not set",
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER || "not set",
  }

  if (!apiKey) {
    return NextResponse.json({ 
      error: "No API key found", 
      diagnostics 
    }, { status: 500 })
  }

  // Send a real test email to the Resend account owner
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: ["dr.kirtiraje@gmail.com"],
        subject: "SecureAuth Test - Email Delivery Check",
        html: `<h2>It works!</h2><p>This is a test email from SecureAuth Portal sent at ${new Date().toISOString()}</p>`,
      }),
    })

    const responseBody = await res.text()
    
    return NextResponse.json({
      status: res.status,
      ok: res.ok,
      resend_response: responseBody,
      diagnostics,
    })
  } catch (err: any) {
    return NextResponse.json({
      error: err.message,
      diagnostics,
    }, { status: 500 })
  }
}
