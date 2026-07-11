import CredentialsProvider from 'next-auth/providers/credentials'
import { eq } from 'drizzle-orm'
import { db, adminUser, customerUser, studentUser } from '@/lib/db'
import { normalizeStudentPhone } from '@/lib/student-phone'
import bcrypt from 'bcryptjs'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'admin-credentials',
      name: 'Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const [user] = await db
          .select()
          .from(adminUser)
          .where(eq(adminUser.email, credentials.email))
          .limit(1)
        if (!user) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        return { id: user.id, email: user.email, role: 'admin' as const }
      },
    }),
    CredentialsProvider({
      id: 'customer-credentials',
      name: 'Customer',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const [row] = await db
          .select()
          .from(customerUser)
          .where(eq(customerUser.email, credentials.email))
          .limit(1)
        if (!row || !row.active) return null

        const valid = await bcrypt.compare(credentials.password, row.password)
        if (!valid) return null

        return {
          id: row.id,
          email: row.email,
          name: row.name,
          role: 'customer' as const,
        }
      },
    }),
    CredentialsProvider({
      id: 'student-credentials',
      name: 'Student',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null

        const phone = normalizeStudentPhone(credentials.phone)
        if (!phone) return null

        const [row] = await db
          .select()
          .from(studentUser)
          .where(eq(studentUser.phone, phone))
          .limit(1)
        if (!row || !row.active) return null

        const valid = await bcrypt.compare(credentials.password, row.password)
        if (!valid) return null

        return {
          id: row.id,
          phone: row.phone,
          name: row.name,
          role: 'student' as const,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role ?? 'admin'
        token.email = user.email ?? undefined
        token.phone = user.phone ?? undefined
        token.name = user.name ?? undefined
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role as 'admin' | 'customer' | 'student') ?? 'admin'
        session.user.email = token.email ?? session.user.email
        session.user.phone = token.phone ?? undefined
        session.user.name = token.name ?? session.user.name
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
