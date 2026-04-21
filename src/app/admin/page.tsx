import { auth } from "@/auth"
import { FadeIn } from "@/components/AnimatedUI"

export default async function AdminDashboard() {
  const session = await auth()

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="border-b border-white/10 pb-6">
          <FadeIn>
            <h1 className="text-3xl font-bold tracking-tight text-emerald-400">RESTRICTED ZONE</h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-muted-foreground mt-2">
              Deep Security Metrics. Internal Use Only.
            </p>
          </FadeIn>
        </header>

        <FadeIn delay={0.2} className="p-8 border border-red-500/20 bg-red-500/5 rounded-xl">
           <h2 className="text-lg text-red-400 font-medium tracking-wider mb-4">ADMINISTRATIVE ACCESS GRANTED</h2>
           <p className="text-sm text-red-300">
             Welcome, {session?.user?.email}. Superuser capabilities are engaged. 
             (This page is physically inaccessible to standard users).
           </p>
        </FadeIn>
      </div>
    </main>
  )
}
