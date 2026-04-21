"use client"

import { useState } from "react"
import { signIn } from "next-auth/webauthn"
import { AnimatedButton, FadeIn } from "@/components/AnimatedUI"

interface Authenticator {
  credentialID: string
  createdAt?: Date
  credentialDeviceType: string
  transports?: string
}

export default function PasskeyManager({
  authenticators
}: {
  authenticators: Authenticator[]
}) {
  const [isRegistering, setIsRegistering] = useState(false)

  const handleRegister = async () => {
    setIsRegistering(true)
    try {
      await signIn("webauthn", { action: "register" })
    } catch (e) {
      console.error(e)
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Security Keys</h3>
          <p className="text-sm text-muted-foreground">Manage your hardware keys and biometric passkeys.</p>
        </div>
        <AnimatedButton 
          onClick={handleRegister} 
          disabled={isRegistering}
          className="px-4 py-2 bg-white text-black font-semibold rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-all disabled:opacity-50"
        >
          {isRegistering ? "Registering..." : "Add Passkey"}
        </AnimatedButton>
      </div>

      <div className="border border-white/10 rounded-lg max-h-64 overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#111] border-b border-white/10 text-muted-foreground text-xs uppercase">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">Device Type</th>
              <th scope="col" className="px-6 py-3 font-medium">Credential ID</th>
              <th scope="col" className="px-6 py-3 font-medium">Transports</th>
            </tr>
          </thead>
          <tbody>
            {authenticators.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                  No passkeys registered.
                </td>
              </tr>
            ) : (
              authenticators.map((auth, i) => (
                <tr key={auth.credentialID} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-black' : 'bg-[#0a0a0a]'}`}>
                  <td className="px-6 py-4 font-mono text-white/90">
                    {auth.credentialDeviceType}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs truncate max-w-[200px] text-muted-foreground">
                    {auth.credentialID.substring(0, 16)}...
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {auth.transports || "internal"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
