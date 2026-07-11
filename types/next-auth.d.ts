import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      phone?: string | null
      name?: string | null
      image?: string | null
      role: 'admin' | 'customer' | 'student'
    }
  }

  interface User {
    id: string
    email?: string | null
    phone?: string | null
    name?: string | null
    role?: 'admin' | 'customer' | 'student'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: 'admin' | 'customer' | 'student'
    email?: string
    phone?: string
    name?: string
  }
}
