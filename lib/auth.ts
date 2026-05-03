import CredentialsProvider from 'next-auth/providers/credentials'
import { eq } from 'drizzle-orm'
import { db, adminUser, customerUser } from '@/lib/db'
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
        token.name = user.name ?? undefined
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role as 'admin' | 'customer') ?? 'admin'
        session.user.email = token.email ?? session.user.email
        session.user.name = token.name ?? session.user.name
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
