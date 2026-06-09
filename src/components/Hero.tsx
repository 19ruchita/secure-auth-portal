"use client"

import { motion } from "framer-motion"

interface HeroProps {
  onAuthClick: () => void
}

export default function Hero({ onAuthClick }: HeroProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-6">
      <div className="bg-[#09090b] rounded-[32px] border border-neutral-800 relative overflow-hidden p-8 md:p-16 min-h-[640px] flex flex-col justify-between">
        
        {/* Ambient Grid/Radial Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 my-auto">
          {/* Left Column: Copy & Primary Actions */}
          <div className="lg:col-span-6 space-y-8 text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300">
              <svg className="w-3.5 h-3.5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Security that works for you</span>
            </div>

            {/* Main Headings */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                Secure access.<br />
                Built for the future.
              </h1>
              <p className="text-neutral-400 text-base md:text-lg max-w-lg leading-relaxed">
                SecureAuth is a complete authentication and authorization platform to protect your users, applications, and data with modern security standards.
              </p>
            </div>

            {/* CTA Button */}
            <div>
              <button 
                onClick={onAuthClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black hover:bg-neutral-200 font-medium rounded-full shadow-lg transition-all"
              >
                <span>Get started</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Graphics & Frosted Glass Panel */}
          <div className="lg:col-span-6 flex flex-col md:flex-row items-center justify-end gap-6 relative">
            
            {/* 3D Shield Vector graphic */}
            <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center pointer-events-none opacity-90">
              <svg className="w-full h-full text-neutral-800 drop-shadow-[0_0_50px_rgba(255,255,255,0.05)]" viewBox="0 0 100 100" fill="none">
                {/* Shield Path */}
                <path d="M50 10 L85 22 V50 C85 70 70 85 50 90 C30 85 15 70 15 50 V22 L50 10 Z" fill="#0f0f11" stroke="#333" strokeWidth="1.5" />
                {/* Inner Shield Shadow Line */}
                <path d="M50 15 L80 25 V50 C80 67 67 80 50 85 C33 80 20 67 20 50 V25 L50 15 Z" fill="#18181b" stroke="#444" strokeWidth="1" />
                {/* Center Keyhole */}
                <circle cx="50" cy="45" r="7" fill="#000" stroke="#333" strokeWidth="1" />
                <path d="M46 49 L54 49 L56 65 L44 65 Z" fill="#000" stroke="#333" strokeWidth="1" />
                <circle cx="50" cy="45" r="3" fill="#09090b" />
              </svg>
            </div>

            {/* Overlapping Frosted Glass Panel */}
            <div className="w-full md:w-[320px] bg-neutral-950/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 shadow-2xl">
              
              {/* Feature Item 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11a13.917 13.917 0 00-2.338-7.757m0 0A13.942 13.942 0 0112 3c1.74 0 3.391.317 4.914.896m-4.914 7.104c0 3.517 1.009 6.799 2.753 9.571m-3.44-2.04L13.8 17.9a13.916 13.916 0 002.338-7.757M18 10a8 8 0 01-16 0V7a5 5 0 0110 0v3z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-white">Passwordless Authentication</h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-normal">Login easily and securely without passwords using magic links.</p>
                </div>
              </div>

              {/* Feature Item 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-white">Role-Based Access Control</h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-normal">Granular permissions to ensure users access only what they need.</p>
                </div>
              </div>

              {/* Feature Item 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-white">Secure Sessions</h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-normal">Enforce session management and multi-layered protection.</p>
                </div>
              </div>

              {/* Feature Item 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-white">Smart Audit Logs</h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-normal">Track user activity with detailed logs and insights.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Badges */}
        <div className="border-t border-white/5 pt-8 mt-12 flex flex-wrap gap-8 items-center text-xs font-medium text-neutral-400">
          
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Enterprise-grade security</span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>24/7 protection</span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V10a2 2 0 012-2h3.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Global-ready</span>
          </div>

        </div>

      </div>
    </section>
  )
}
