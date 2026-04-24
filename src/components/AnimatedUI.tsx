"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

export function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedButton({ 
  children, 
  onClick, 
  type = "button", 
  disabled = false, 
  className = "" 
}: { 
  children: ReactNode; 
  onClick?: () => void; 
  type?: "button" | "submit"; 
  disabled?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-6 py-3 bg-white text-black font-medium border border-transparent rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </motion.button>
  )
}

export function AnimatedInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <motion.input
      whileFocus={{ scale: 1.01, borderColor: "#ffffff" }}
      className="w-full px-4 py-3 bg-black text-white border border-border rounded focus:outline-none focus:ring-1 focus:ring-white transition-all placeholder:text-muted-foreground"
      {...(props as any)}
    />
  )
}
