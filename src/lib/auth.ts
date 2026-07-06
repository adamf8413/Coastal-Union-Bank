import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || "coastal-union-bank-fallback-secret-do-not-use-in-production",
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        const username = credentials.username as string
        const password = credentials.password as string

        const user = await prisma.user.findUnique({
          where: { username },
          include: { holdings: true },
        })
        if (!user) return null

        const bcrypt = require("bcryptjs") as typeof import("bcryptjs")
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) return null

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          accountNumber: user.accountNumber,
          routingNumber: user.routingNumber,
          swiftCode: user.swiftCode,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.username = (user as any).username
        token.accountNumber = (user as any).accountNumber
        token.routingNumber = (user as any).routingNumber
        token.swiftCode = (user as any).swiftCode
      }
      return token
    },
    async session({ session, token }) {
      const u = session.user || {} as any
      u.id = token.id as string
      u.role = token.role
      u.username = token.username
      u.accountNumber = token.accountNumber
      u.routingNumber = token.routingNumber
      u.swiftCode = token.swiftCode
      session.user = u
      return session
    },
  },
})
