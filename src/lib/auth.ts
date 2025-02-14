import { AuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import User from "@/models/User";
import connectDB from "@/lib/connectDB";

// Define database user type
interface DatabaseUser {
  _id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  password?: string;
  provider?: string | null;
  emailVerified?: Date | null;
}

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email or Phone",
          type: "text",
          placeholder: "user@example.com or 1234567890",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials.password) {
          throw new Error("Credentials not provided");
        }

        await connectDB();
        const { identifier, password } = credentials;

        const user = await User.findOne({
          $or: [{ email: identifier }, { phone: identifier }],
        }).select("+password") as DatabaseUser | null;

        if (!user) throw new Error("User not found");
        if (!user.password) throw new Error("Invalid login method");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          provider: "credentials"
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.provider = account?.provider || user.provider;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id!;
        session.user.role = token.role;
        session.user.provider = token.provider;

        // Fetch latest user data
        await connectDB();
        const dbUser = await User.findById(token.id) as DatabaseUser | null;
        if (dbUser) {
          session.user.role = dbUser.role;
        }
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          try {
            await User.create({
              email: user.email,
              name: user.name,
              role: "user",
              provider: account.provider,
              emailVerified: new Date(),
            });
          } catch (error) {
            console.error("Error creating user:", error);
            return false;
          }
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith("/") 
        ? `${baseUrl}${url}` 
        : new URL(url).origin === baseUrl 
          ? url 
          : baseUrl;
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

export const authHandler = NextAuth(authOptions);