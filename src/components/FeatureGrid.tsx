"use client"

import { motion } from "framer-motion"

export default function FeatureGrid() {
  const features = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11a13.917 13.917 0 00-2.338-7.757m0 0A13.942 13.942 0 0112 3c1.74 0 3.391.317 4.914.896m-4.914 7.104c0 3.517 1.009 6.799 2.753 9.571m-3.44-2.04L13.8 17.9a13.916 13.916 0 002.338-7.757M18 10a8 8 0 01-16 0V7a5 5 0 0110 0v3z" />
        </svg>
      ),
      title: "Passwordless Login",
      description: "Enable secure and frictionless access using magic links — no passwords to remember or reset."
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Role-Based Access",
      description: "Define roles and permissions to control access across your application with ease."
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Data Protection",
      description: "Your data is encrypted, protected, and never shared. Built with privacy and security at the core."
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Always Protected",
      description: "24/7 threat monitoring and advanced security practices keep your application and users safe."
    }
  ]

  return (
    <section id="features" className="w-full max-w-7xl mx-auto px-6 py-16 scroll-mt-20">
      
      {/* 4-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="bg-white border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-2xl p-8 flex flex-col justify-between transition-all duration-300"
          >
            <div className="text-left">
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-900 mb-6">
                {feature.icon}
              </div>

              {/* Title & Desc */}
              <h3 className="text-lg font-bold text-neutral-900 mb-2.5">{feature.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-normal">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Centered Headings */}
      <div className="text-center mt-24 mb-10 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-950">
          Security made simple. Access made smart.
        </h2>
        <p className="text-neutral-500 text-base max-w-2xl mx-auto leading-relaxed font-normal">
          SecureAuth helps you build trust with secure authentication, fine-grained authorization, and a seamless login experience for your users.
        </p>
      </div>

    </section>
  )
}
