import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import User from "@/models/User";
import connectDB from "@/lib/connectDB";

async function ensureDBConnection() {
  try {
    await clientPromise;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Unable to connect to database");
  }
}

export const authOptions = {
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
        await ensureDBConnection();
        if (!credentials || !credentials.identifier || !credentials.password) {
          throw new Error("Credentials not provided");
        }
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
      await ensureDBConnection();

      if (session?.user) {
        const dbUser = await User.findOne({ email: session.user.email });

        if (dbUser) {
          session.user.id = dbUser._id.toString(); // ✅ Convert ObjectId to string
          session.user.role = dbUser.role;
          session.user.provider = dbUser.provider;
        } else {
          session.user.role = "user"; // Default role
        }
      }

      return session;
    },

    async signIn({
      user,
      account,
      profile,
    }: {
      user: any;
      account: any;
      profile?: any;
    }) {
      await ensureDBConnection();
      if (account.provider === "google") {
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
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signIn({
      user,
      account,
      profile,
      isNewUser,
    }: {
      user: any;
      account: any;
      profile?: any;
      isNewUser?: boolean;
    }) {
      console.log("Sign in attempt:", { user, account, isNewUser });
    },
    async signInError(error: Error) {
      console.error("Sign in error:", error);
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/signin",
  },
  session: {
    strategy: "jwt" as "jwt", // explicitly cast to 'jwt' type
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
