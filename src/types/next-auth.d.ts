import "next-auth"

declare module "next-auth" {
  interface Session {
    user?: {
      id: string
      name?: string | null
      email?: string | null
      username?: string
      role?: string
      accountNumber?: string | null
      routingNumber?: string | null
      swiftCode?: string | null
      profilePicture?: string | null
    }
  }

  interface User {
    id: string
    username?: string
    role?: string
    accountNumber?: string | null
    routingNumber?: string | null
    swiftCode?: string | null
    profilePicture?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: string
    username?: string
    accountNumber?: string | null
    routingNumber?: string | null
    swiftCode?: string | null
    profilePicture?: string | null
  }
}
