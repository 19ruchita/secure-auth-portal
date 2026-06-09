import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const assets = await prisma.vaultAsset.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        title: true,
        assetType: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(assets)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
