import { AuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import User from "@/models/User";
import connectDB from "@/lib/connectDB";


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
      async authorize(credentials: Record<"password" | "identifier", string> | undefined) {
        if (!credentials?.identifier || !credentials.password) {
          throw new Error("Credentials not provided");
        }

        await connectDB();
        const { identifier, password } = credentials;

        const user = await User.findOne({
          $or: [{ email: identifier }, { phone: identifier }],
        }).select("+password");

        if (!user) throw new Error("User not found");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
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
    async session({ session }: { session: any }) {
      if (session?.user) {
        await connectDB();
        const dbUser = await User.findOne({ email: session.user.email });

        if (dbUser) {
          session.user.id = dbUser._id.toString();
          session.user.role = dbUser.role;
          session.user.provider = dbUser.provider;
        } else {
          session.user.role = "user";
        }
      }
      return session;
    },
    async signIn({ user, account }: { user: any; account: any }) {
      if (account.provider === "google") {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          try {
            await User.create({
              email: user.email,
              name: user.name,
              role: "user",
              emailVerified: user.emailVerified || new Date(),
            });
          } catch (error) {
            console.error("Error creating user:", error);
            return false;
          }
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return url.startsWith("/") ? `${baseUrl}${url}` : new URL(url).origin === baseUrl ? url : baseUrl;
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 1 month session
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

// Export NextAuth handler function
export const authHandler = NextAuth(authOptions);
