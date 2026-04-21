import NextAuth from "next-auth"
import Nodemailer from "next-auth/providers/nodemailer"
import WebAuthn from "next-auth/providers/webauthn"
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
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM
    }),
    WebAuthn,
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
