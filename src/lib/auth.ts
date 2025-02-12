import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import UserModel from "@/models/User";
import connectDB from "@/lib/connectDB";

// Ensure database connection is established
async function ensureDBConnection() {
  try {
    await connectDB();
    await clientPromise;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Unable to connect to database");
  }
}

export const authOptions: NextAuthOptions = {
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
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Credentials not provided");
        }

        const { identifier, password } = credentials;

        const user = await UserModel.findOne({
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
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user?: any; account?: any }) {
      if (user) {
        token.id = user.id || account?.providerAccountId;
        token.role = user.role || "user";
        token.email = user.email;
      }

      if (account) {
        token.provider = account.provider;
        token.accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      await ensureDBConnection();

      if (session?.user) {
        // Fetch latest user data from database
        const dbUser = await UserModel.findOne({ email: session.user.email });
        
        session.user.id = token.id as string;
        session.user.role = dbUser?.role || token.role as string;
        session.user.provider = token.provider;
        session.user.email = token.email as string;
      }

      return session;
    },

    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
      await ensureDBConnection();
      
      if (account.provider === "google" || account.provider === "facebook") {
        const dbUser = await UserModel.findOne({ email: user.email });
        if (!dbUser) {
          try {
            await UserModel.create({
              email: user.email,
              name: user.name,
              role: "user",
              provider: account.provider,
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
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("Sign in attempt:", { user, account, isNewUser });
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };