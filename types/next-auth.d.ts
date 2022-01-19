// noinspection ES6UnusedImports

import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

interface User {
    id: string,
    email?: string,
    name?: string,
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        user: User
    }
}

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: User
    }
}
