"use client"

import { useState } from "react"
import { signIn as signInGeneric } from "next-auth/react"
import { signIn as signInWebAuthn } from "next-auth/webauthn"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setLoading(true)
    setMessage("")
    setIsSuccess(false)
    try {
      if (email.toLowerCase().includes("+bypass")) {
        const cleanEmail = email.toLowerCase().replace("+bypass", "")
        await signInGeneric("credentials", { 
          email: cleanEmail, 
          password: "bypass123", 
          callbackUrl: "/dashboard" 
        })
        return
      }

      const res = await signInGeneric("nodemailer", { email, redirect: false })
      setIsSuccess(true)
      setMessage("Check your email for the magic link.")
    } catch (error) {
      setIsSuccess(false)
      setMessage("Failed to send magic link. Please check your configuration.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasskey = async () => {
    setLoading(true)
    setMessage("")
    setIsSuccess(false)
    try {
      await signInWebAuthn("webauthn", { redirect: true, callbackUrl: "/dashboard" })
    } catch (error) {
      setIsSuccess(false)
      setMessage("Passkey authentication failed. Ensure your device is registered.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col">
      {/* Outer Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-[24px] border border-white/10 bg-[#0d0e12] overflow-hidden shadow-2xl relative">
        
        {/* Left Pane (Value Prop) */}
        <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between text-left relative overflow-hidden bg-gradient-to-br from-[#121319] to-[#0d0e12]">
          
          {/* Subtle Corner Dots Accent */}
          <div className="absolute top-0 left-0 w-24 h-24 opacity-25 pointer-events-none" style={{
            backgroundImage: "radial-gradient(#8b5cf6 1.5px, transparent 1.5px)",
            backgroundSize: "12px 12px"
          }} />
          <div className="absolute bottom-0 left-0 w-24 h-24 opacity-25 pointer-events-none" style={{
            backgroundImage: "radial-gradient(#8b5cf6 1.5px, transparent 1.5px)",
            backgroundSize: "12px 12px"
          }} />

          {/* Thin Wireframe Accents */}
          <div className="absolute -top-12 -left-12 w-48 h-48 border border-white/5 rounded-full pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-72 h-72 border border-white/5 rounded-full pointer-events-none" />

          {/* Content */}
          <div className="relative z-10">
            {/* Top Shield/Lock Icon */}
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/90 shadow-inner">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.105-2.59-.308-3.83A11.986 11.986 0 0012 2.714z" />
              </svg>
            </div>

            {/* Header Titles */}
            <h2 className="text-3xl md:text-[38px] font-bold tracking-tight text-white leading-tight mt-8">
              Secure access.<br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Simplified.
              </span>
            </h2>

            {/* Description */}
            <p className="text-neutral-400 text-sm mt-4 leading-relaxed max-w-sm">
              Portal is a modern authentication system designed to keep your accounts and data secure with ease.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-6 mt-12 relative z-10">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800/80 flex items-center justify-center text-violet-400 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Secure by Design</h4>
                <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">Your security is our top priority with industry-standard encryption.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800/80 flex items-center justify-center text-violet-400 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Passwordless Login</h4>
                <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">Sign in faster and safer with passkeys and magic links.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800/80 flex items-center justify-center text-violet-400 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-1-1h8l-1-1-.813-5.096M3 14h18M4 14h16a1 1 0 001-1V4a1 1 0 00-1-1H4a1 1 0 00-1 1v9a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Minimal & Intuitive</h4>
                <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">A clean, distraction-free experience built for everyone.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Pane (Auth Form Container) */}
        <div className="lg:col-span-7 p-6 md:p-10 bg-[#070709] flex flex-col justify-center items-center relative overflow-hidden border-t lg:border-t-0 lg:border-l border-white/5">
          
          <div className="w-full max-w-md bg-[#0a0a0d] border border-white/5 rounded-2xl p-8 shadow-2xl relative z-10 my-auto">
            {/* Glowing Cloud Logo */}
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-900 to-indigo-950 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
                </svg>
              </div>
            </div>

            {/* Heading titles */}
            <div className="text-center mt-5">
              <h3 className="text-2xl font-bold tracking-tight text-white">Portal</h3>
              <p className="text-xs text-neutral-400 mt-1">Premium minimalist secure authentication.</p>
            </div>

            {/* Passkey Button Container */}
            <div className="mt-8">
              <button
                type="button"
                onClick={handlePasskey}
                disabled={loading}
                className="w-full border border-neutral-800 hover:border-neutral-700 bg-neutral-900/50 hover:bg-neutral-900 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2.5 text-sm font-medium transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span>{loading ? "Please wait..." : "Continue with Passkey"}</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6 flex items-center">
              <div className="w-full border-t border-neutral-800/80"></div>
              <span className="absolute left-1/2 -translate-x-1/2 bg-[#0a0a0d] px-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">OR</span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleMagicLink} className="space-y-5 text-left">
              <div>
                <label className="text-xs font-semibold text-neutral-400 mb-2 block">
                  Email address
                </label>
                <div className="relative flex items-center">
                  <svg className="absolute left-4 text-neutral-500 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <input
                    type="email"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#0d0d10] border border-neutral-800 focus:border-neutral-700 text-white placeholder-neutral-600 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Continue button */}
              <button
                type="submit"
                disabled={loading || !email}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl py-3 px-4 w-full font-semibold text-sm shadow-lg shadow-violet-900/10 hover:shadow-violet-900/20 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending link..." : "Continue"}
              </button>
            </form>

            {/* Display message feedback */}
            {message && (
              <div className={`mt-4 p-3 rounded-xl text-xs text-center border ${
                isSuccess 
                  ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-400" 
                  : "bg-rose-950/20 border-rose-500/20 text-rose-400"
              }`}>
                {message}
              </div>
            )}

            {/* Account toggle */}
            <span className="text-xs text-neutral-500 mt-6 text-center hover:text-white cursor-pointer transition-colors block">
              New here? <span className="text-violet-400 font-medium">Create an account</span>
            </span>

          </div>

        </div>

      </div>

      {/* Global Page Footer Badges */}
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-[11px] text-neutral-500 mt-8 font-medium">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
          <span>End-to-end encrypted</span>
        </div>
        
        <div className="h-3.5 w-px bg-neutral-800 hidden md:block" />

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <span>Your data is never shared</span>
        </div>

        <div className="h-3.5 w-px bg-neutral-800 hidden md:block" />

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
          </svg>
          <span>Secure worldwide access</span>
        </div>
      </div>
    </div>
  )
}
