import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { verifyAuthenticationResponse } from "@simplewebauthn/server"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { assetId, credential } = await req.json()
    if (!assetId || !credential) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Read challenge from cookie
    const cookieStore = await cookies()
    const expectedChallenge = cookieStore.get("stepup-challenge")?.value

    if (!expectedChallenge) {
      return NextResponse.json({ error: "Challenge expired or invalid. Please try again." }, { status: 400 })
    }

    // Fetch authenticator from DB matching the credential ID
    const dbAuthenticator = await prisma.authenticator.findUnique({
      where: { credentialID: credential.id }
    })

    if (!dbAuthenticator || dbAuthenticator.userId !== session.user.id) {
      return NextResponse.json({ error: "Authenticator not recognized on this account" }, { status: 400 })
    }

    // Determine rpID and origin dynamically
    const hostHeader = req.headers.get("host") || "localhost"
    const rpID = hostHeader.split(":")[0]
    const expectedOrigin = hostHeader.includes("localhost") 
      ? `http://${hostHeader}` 
      : `https://${hostHeader}`

    // Parse the credential public key from string. NextAuth WebAuthn stores public key
    // as a base64 / PEM / buffer string. We try standard base64 decoding first.
    let publicKeyBuffer: Uint8Array
    try {
      publicKeyBuffer = Buffer.from(dbAuthenticator.credentialPublicKey, "base64")
      if (publicKeyBuffer.length === 0) {
        throw new Error("Empty buffer")
      }
    } catch {
      // Fallback
      publicKeyBuffer = new TextEncoder().encode(dbAuthenticator.credentialPublicKey)
    }

    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: Buffer.from(dbAuthenticator.credentialID, 'base64url'),
        credentialPublicKey: publicKeyBuffer,
        counter: dbAuthenticator.counter,
      },
    })

    if (!verification.verified) {
      return NextResponse.json({ error: "Biometric signature validation failed" }, { status: 400 })
    }

    // Update authenticator counter
    if (verification.authenticationInfo) {
      await prisma.authenticator.update({
        where: { credentialID: credential.id },
        data: { counter: verification.authenticationInfo.newCounter }
      })
    }

    // Fetch the asset
    const asset = await prisma.vaultAsset.findFirst({
      where: { id: assetId, userId: session.user.id }
    })

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }

    // Log success in AuditLog
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: `VAULT_DECRYPT_${asset.assetType}`,
        status: "SUCCESS"
      }
    })

    // Clear the challenge cookie
    cookieStore.delete("stepup-challenge")

    return NextResponse.json({
      verified: true,
      secureUrl: asset.secureUrl
    })
  } catch (error: any) {
    console.error("[VAULT_VERIFY_ERROR]:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
