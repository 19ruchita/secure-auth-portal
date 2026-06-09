"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import LoginForm from "./LoginForm"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-black border border-white/10 rounded-2xl p-8 md:p-10 relative shadow-[0_25px_60px_rgba(0,0,0,0.8)] cursor-default overflow-hidden"
          >
            {/* Background Light Spill */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Logo in Modal */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">Access Portal</h2>
              <p className="text-sm text-neutral-400 mt-1">Authenticate securely to access your dashboard</p>
            </div>

            {/* Login Form */}
            <LoginForm />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
