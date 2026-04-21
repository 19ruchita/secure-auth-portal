import { auth, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"
import { FadeIn } from "@/components/AnimatedUI"
import PasskeyManager from "@/components/PasskeyManager"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const session = await auth()
  if (!session?.user?.id) return redirect("/")

  const authenticators = await prisma.authenticator.findMany({
    where: { userId: session.user.id }
  })

  const auditLogs = await prisma.auditLog.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30 selection:text-white pb-20">
      <nav className="border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <FadeIn>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-black"></div>
              </div>
              <span className="font-bold tracking-tight text-sm">SECURITY COMMAND CENTER</span>
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
            <h1 className="text-4xl font-semibold tracking-tight">
              Welcome back{session.user.name ? `, ${session.user.name}` : ''}.
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-muted-foreground max-w-xl text-lg">
              Manage your passwordless infrastructure, inspect active devices, and monitor access events in real-time.
            </p>
          </FadeIn>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FadeIn delay={0.3} className="md:col-span-2">
            <div className="p-8 rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl h-full space-y-8">
               <PasskeyManager authenticators={authenticators} />
            </div>
          </FadeIn>

          <FadeIn delay={0.4} className="md:col-span-1 space-y-6">
            <div className="p-8 rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl space-y-6">
              <div>
                 <h3 className="text-lg font-medium">Session Details</h3>
                 <p className="text-sm text-muted-foreground mb-4">Active cryptographic tokens.</p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Email</span>
                  <span className="font-mono bg-black p-2 rounded border border-white/10">{session.user.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Assigned Role</span>
                  <div className="flex items-center">
                    <span className="font-mono bg-black p-2 rounded border border-white/10 text-emerald-400">
                      {session.user.role || "USER"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Session Expiry</span>
                  <span className="font-mono bg-black p-2 rounded border border-white/10">{new Date(session.expires).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {session.user.role === 'ADMIN' && (
              <div className="p-8 rounded-xl border border-red-500/20 bg-red-500/5 shadow-2xl space-y-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-red-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative">
                  <h3 className="text-lg font-medium text-red-400 font-mono tracking-wider">RESTRICTED ZONE</h3>
                  <p className="text-sm text-red-300 mb-6">Enter the administrative metrics firewall.</p>
                  <a href="/admin" className="inline-block w-full text-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-md transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                    Engage Admin Portal
                  </a>
                </div>
              </div>
            )}
          </FadeIn>

          <FadeIn delay={0.5} className="md:col-span-3">
             <div className="p-8 rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl space-y-6">
               <div>
                  <h3 className="text-lg font-medium">Security Audit Log</h3>
                  <p className="text-sm text-muted-foreground">Recent authentication requests and access events.</p>
               </div>

               <div className="overflow-hidden border border-white/10 rounded-lg">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#111] border-b border-white/10 text-muted-foreground text-xs uppercase">
                      <tr>
                        <th scope="col" className="px-6 py-4 font-medium">Event Time</th>
                        <th scope="col" className="px-6 py-4 font-medium">Action</th>
                        <th scope="col" className="px-6 py-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                            No security events recorded.
                          </td>
                        </tr>
                      ) : (
                        auditLogs.map((log, i) => (
                          <tr key={log.id} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-black' : 'bg-[#0a0a0a]'} hover:bg-[#111] transition-colors`}>
                            <td className="px-6 py-4 font-mono text-muted-foreground">
                              {log.createdAt.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                {log.action}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                              }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${log.status === 'SUCCESS' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
               </div>
             </div>
          </FadeIn>
        </div>
      </div>
    </main>
  )
}
