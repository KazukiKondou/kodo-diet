import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Nodemailer from "next-auth/providers/nodemailer"
import { prisma } from "@/lib/prisma"
import { sendMagicLink } from "@/lib/mailer"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  trustHost: true,
  providers: [
    Nodemailer({
      id: "email",
      // 実送信は sendVerificationRequest 側で行うため server はダミーで良い
      server: process.env.EMAIL_SERVER || { jsonTransport: true },
      from: process.env.EMAIL_FROM || "Cocoa <no-reply@localhost>",
      maxAge: 15 * 60,
      async sendVerificationRequest({ identifier, url }) {
        await sendMagicLink(identifier, url)
      },
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) session.user.id = user.id
      return session
    },
  },
})
