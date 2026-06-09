import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { title, assetType, secureUrl } = await req.json()
    if (!title || !assetType || !secureUrl) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const asset = await prisma.vaultAsset.create({
      data: {
        userId: session.user.id,
        title,
        assetType,
        secureUrl,
      }
    })

    // Log the upload in AuditLog
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: `VAULT_UPLOAD_${assetType}`,
        status: "SUCCESS"
      }
    })

    return NextResponse.json({ success: true, id: asset.id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
