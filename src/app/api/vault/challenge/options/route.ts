import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateAuthenticationOptions } from "@simplewebauthn/server"
import { cookies } from "next/headers"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Fetch user authenticators
    const authenticators = await prisma.authenticator.findMany({
      where: { userId: session.user.id }
    })

    if (authenticators.length === 0) {
      return NextResponse.json({ error: "No registered passkeys found. Please add a passkey on your profile before accessing the vault." }, { status: 400 })
    }

    const hostHeader = req.headers.get("host") || "localhost"
    const rpID = hostHeader.split(":")[0]

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: authenticators.map(auth => ({
        id: Buffer.from(auth.credentialID, 'base64url'),
        type: "public-key" as const,
        transports: auth.transports ? JSON.parse(auth.transports) : undefined,
      })),
      userVerification: "required",
    })

    // Save challenge in secure cookie
    const cookieStore = await cookies()
    cookieStore.set("stepup-challenge", options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 300 // 5 minutes
    })

    return NextResponse.json(options)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
