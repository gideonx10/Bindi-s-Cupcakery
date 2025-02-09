import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from 'bcryptjs';
import User from "@/models/User";
import connectDB from "@/lib/connectDB";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        emailOrPhone: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.emailOrPhone || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        await connectDB();
        
        // Check if login is with email or phone
        const isEmail = credentials.emailOrPhone.includes('@');
        const query = isEmail 
          ? { email: credentials.emailOrPhone }
          : { phone: credentials.emailOrPhone };

        const user = await User.findOne(query);

        if (!user || !user.password) {
          throw new Error('User not found');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    //to make sure the user get's his role
    async signIn({ user, account, profile }) {
        if (account?.provider === "google" || account?.provider === "facebook") {
          try {
            await connectDB();
            
            // Check if user already exists
            const existingUser = await User.findOne({ email: user.email });
            
            if (existingUser) {
              // Return true only if it's the same provider or if the user has a password set
              return existingUser.provider === account.provider || !!existingUser.password;
            }
  
            // Create new user with social login
            await User.create({
              name: user.name,
              email: user.email,
              role: "user",
              provider: account.provider,
              profileComplete: false,
            });
          } catch (error) {
            console.error("Error in signIn callback:", error);
            return false;
          }
        }
        return true;
      },
      async jwt({ token, user, account }) {
        if (user) {
          // Fetch latest user data to check profile completion
          const dbUser = await User.findOne({ email: user.email });
          token.role = dbUser?.role || "user";
          token.profileComplete = dbUser?.profileComplete || false;
          token.userId = dbUser?._id;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          (session.user as any).role = token.role;
          (session.user as any).profileComplete = token.profileComplete;
          (session.user as any).id = token.userId;
        }
        return session;
      }
  },
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: "jwt",
  },
};