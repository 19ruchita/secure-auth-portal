"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import FeatureGrid from "@/components/FeatureGrid"
import AuthModal from "@/components/AuthModal"

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <div className="w-full min-h-screen bg-white text-black font-sans selection:bg-neutral-900 selection:text-white flex flex-col">
      {/* Navigation Header */}
      <Header onAuthClick={() => setIsAuthModalOpen(true)} />

      {/* Main Page Layout */}
      <main className="flex-grow flex flex-col">
        {/* Hero Illustration & Info Panel */}
        <Hero onAuthClick={() => setIsAuthModalOpen(true)} />

        {/* Modular Feature Grid & Footer Info */}
        <FeatureGrid />
      </main>

      {/* Footer copyright */}
      <footer className="w-full py-8 border-t border-neutral-100 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <span>&copy; {new Date().getFullYear()} SecureAuth Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <span className="hover:text-black cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-black cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* Slide-in credentials Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  )
}
