import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      role: 'admin' | 'customer'
    }
  }

  interface User {
    id: string
    email?: string | null
    name?: string | null
    role?: 'admin' | 'customer'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: 'admin' | 'customer'
    email?: string
    name?: string
  }
}
