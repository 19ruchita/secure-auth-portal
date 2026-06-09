"use client"

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Initialize Request",
      description: "The user kicks off the authentication flow by entering their email address or clicking \"Continue with Passkey\" on the Next.js presentation interface. The application securely requests a unique, single-use cryptographic challenge from the Auth.js middleware server."
    },
    {
      number: "02",
      title: "Biometric Verification",
      description: "The client browser interfaces with the local operating system's native WebAuthn API. This securely prompts the user's hardware device for immediate biometric consent—utilizing built-in Face ID, Touch ID, or a secure hardware security key."
    },
    {
      number: "03",
      title: "Cryptographic Signature",
      description: "Once biometric consent is verified locally on the hardware chip, the device generates a unique digital signature using its isolated private key. This signed cryptographic payload is returned safely to the SecureAuth application layer, ensuring the private key never leaves the user's physical device."
    },
    {
      number: "04",
      title: "Secure Assertion & Entry",
      description: "The server validates the incoming signature against the public key securely stored in your cloud Neon PostgreSQL database instance. Upon a successful zero-knowledge verification match, a secure session token is generated, granting instant dashboard access while logging a permanent, audited entry in your system logs."
    }
  ]

  return (
    <section id="how-it-works" className="w-full max-w-7xl mx-auto px-6 py-20 border-t border-neutral-100 scroll-mt-20">
      {/* Section Header */}
      <div className="text-left max-w-3xl">
        <span className="text-indigo-600 uppercase tracking-widest text-xs font-semibold">
          How it works
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-950 mt-2">
          Cryptographic security, activated in seconds.
        </h2>
        <p className="text-neutral-500 text-base mt-4 leading-relaxed font-normal">
          SecureAuth bypasses vulnerable legacy passwords entirely, leveraging public-key cryptography built directly into your user's device hardware. Here is the seamless sequence:
        </p>
      </div>

      {/* 4-Step Process Flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
        {steps.map((step, index) => (
          <div 
            key={index}
            className="flex flex-col text-left p-6 rounded-2xl bg-neutral-50/50 border border-neutral-100/70 hover:border-neutral-200 hover:bg-neutral-50 transition-all duration-300"
          >
            {/* Gradient Number */}
            <span className="text-5xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4 block select-none">
              {step.number}
            </span>
            {/* Step Title */}
            <h3 className="text-lg font-bold text-neutral-900 mb-3">
              {step.title}
            </h3>
            {/* Step Description */}
            <p className="text-sm text-neutral-500 leading-relaxed font-normal">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
