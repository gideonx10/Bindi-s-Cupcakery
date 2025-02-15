import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string | null;
      provider?: string | null;
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role?: string | null;
    provider?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string | null;
    provider?: string | null;
  }
}