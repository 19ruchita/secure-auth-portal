"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface HeaderProps {
  onAuthClick: () => void
}

export default function Header({ onAuthClick }: HeaderProps) {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <svg className="w-7 h-7 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="font-bold tracking-tight text-xl text-neutral-900">SecureAuth</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <button 
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="hover:text-black cursor-pointer transition-colors font-medium border-none bg-transparent p-0"
          >
            Features
          </button>
          <button 
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="hover:text-black cursor-pointer transition-colors font-medium border-none bg-transparent p-0"
          >
            How it works
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onAuthClick}
            className="px-5 py-2.5 text-sm font-medium text-neutral-700 hover:text-black rounded-full hover:bg-neutral-50 transition-all"
          >
            Log in
          </button>
          <button 
            onClick={onAuthClick}
            className="px-5 py-2.5 text-sm font-medium bg-neutral-950 text-white hover:bg-neutral-800 rounded-full shadow-sm hover:shadow transition-all"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  )
}
