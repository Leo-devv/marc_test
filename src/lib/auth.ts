import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./mongodb";
import User from "@/models/User";

function generateAlias(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 3; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `Client_${code}`;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        await connectDB();

        let user = await User.findOne({ email: credentials.email });
        if (!user) {
          // Auto-create user on first sign-in (demo behavior)
          user = await User.create({
            email: credentials.email,
            alias: generateAlias(),
            preferences: {},
            savedProviders: [],
          });
        }

        return {
          id: user._id!.toString(),
          email: user.email,
          name: user.alias,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.alias = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.userId;
        (session.user as Record<string, unknown>).alias = token.alias;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
