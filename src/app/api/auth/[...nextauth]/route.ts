import NextAuth, { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import User from "@/models/User";
import connectDB from "@/lib/connectDB";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // Allow login via email OR phone number
      credentials: {
        identifier: {
          label: "Email or Phone",
          type: "text",
          placeholder: "user@example.com or 1234567890",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Ensure DB connection
        await connectDB();
        if (!credentials || !credentials.identifier || !credentials.password) {
          throw new Error("Credentials not provided");
        }
        const { identifier, password } = credentials;

        // Search for user by email or phone
        const user = await User.findOne({
          $or: [{ email: identifier }, { phone: identifier }],
        }).select("+password");

        if (!user) throw new Error("User not found");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error("Invalid password");

        // Return the basic user object
        return { id: user.id, name: user.name, email: user.email, role: user.role };
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
    async session({ session, user }: { session: any, user: any }) {
      // Enrich session.user with role from database
      if (session?.user) {
        const dbUser = await User.findOne({ email: session.user.email });
        session.user.role = dbUser ? dbUser.role : "user";
      }
      return session;
    },
  },
  pages: {
    // These pages can be customized. For now, we rely on the custom pages we create.
    signIn: "/signin",
    signOut: "/signout",
    error: "/signin",
  },
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
