import { auth, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { FadeIn } from "@/components/AnimatedUI"
import VaultClient from "@/components/VaultClient"

export default async function VaultPage() {
  const session = await auth()
  if (!session?.user?.id) return redirect("/")

  const authenticatorsCount = await prisma.authenticator.count({
    where: { userId: session.user.id }
  })

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30 selection:text-white pb-20">
      <nav className="border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <FadeIn>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-black"></div>
                </div>
                <span className="font-bold tracking-tight text-sm">SECURITY COMMAND CENTER</span>
              </div>
              <div className="hidden sm:flex items-center gap-4 border-l border-white/10 pl-4">
                <a href="/dashboard" className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-white transition-colors">Dashboard</a>
                <a href="/dashboard/vault" className="text-xs font-mono uppercase tracking-wider text-white">Private Vault</a>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <form action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}>
              <button type="submit" className="text-sm text-muted-foreground hover:text-white transition-colors">
                Sign out
              </button>
            </form>
          </FadeIn>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 mt-12 space-y-12">
        <header className="space-y-4">
          <FadeIn delay={0.15}>
            <h1 className="text-4xl font-semibold tracking-tight flex items-center gap-3">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Private Master Vault
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-muted-foreground max-w-xl text-lg">
              Securely archive personal records and documents. Every view request demands a biometric step-up cryptographic handshake.
            </p>
          </FadeIn>
        </header>

        <VaultClient hasPasskey={authenticatorsCount > 0} />
      </div>
    </main>
  )
}
