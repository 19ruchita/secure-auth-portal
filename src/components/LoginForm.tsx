"use client"

import { useState } from "react"
import { signIn as signInGeneric } from "next-auth/react"
import { signIn as signInWebAuthn } from "next-auth/webauthn"
import { FadeIn, AnimatedButton, AnimatedInput } from "./AnimatedUI"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setLoading(true)
    setMessage("")
    try {
      await signInGeneric("nodemailer", { email, redirect: false })
      setMessage("Check your email for the magic link.")
    } catch (error) {
      setMessage("Failed to send magic link.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasskey = async () => {
    setLoading(true)
    setMessage("")
    try {
      // With Auth.js v5 beta, webauthn signIn handles both registration and authentication
      // Requires the user to have been setup with a passkey, or if providing options, can register.
      // Usually you pass action: "authenticate" | "register" but omitting it triggers auto.
      await signInWebAuthn("webauthn", { redirect: true, callbackUrl: "/dashboard" })
    } catch (error) {
      setMessage("Passkey authentication failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-8">
      <FadeIn delay={0.2}>
        <div className="space-y-4">
          <AnimatedButton 
            onClick={handlePasskey} 
            disabled={loading} 
            className="w-full bg-white text-black hover:bg-neutral-200"
          >
            {loading ? "Waiting..." : "Continue with Passkey"}
          </AnimatedButton>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-muted-foreground">Or</span>
            </div>
          </div>
        </div>
      </FadeIn>
      
      <FadeIn delay={0.3}>
        <form onSubmit={handleMagicLink} className="space-y-4">
          <AnimatedInput 
            type="email" 
            placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <AnimatedButton 
            type="submit" 
            disabled={loading || !email} 
            className="w-full bg-transparent text-white border-border hover:bg-muted"
          >
            Send Magic Link
          </AnimatedButton>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-neutral-400">{message}</p>
        )}
      </FadeIn>
    </div>
  )
}
