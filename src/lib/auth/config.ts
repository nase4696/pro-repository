import Google from "next-auth/providers/google";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { NextAuthConfig, User } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          !(
            typeof credentials?.email === "string" &&
            typeof credentials?.password === "string"
          )
        ) {
          throw new Error("正しいメールアドレスとパスワードを入力してください");
        }

        if (!credentials) return null;

        const { email, password } = credentials;
        const user = await prisma.user.findUnique({
          omit: { password: false },
          where: { email },
        });

        if (!user || !user.password) return null;

        console.log("入力したパスワード:", credentials.password);
        console.log("DBパスワード:", user.password);

        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log("比較結果:", isPasswordValid);

        return isPasswordValid ? user : null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        return true;
      }

      if (!user.id) {
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        omit: { password: false },
        where: { id: user.id },
      });

      if (!existingUser) {
        return false;
      }

      return true;
    },
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        token.backendToken = user.backendToken;
        token.user = user;
      }

      return token;
    },
    async session({ token, session }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      session.backendToken = token.backendToken;
      session.user = token.user;

      return session;
    },
  },
} as const satisfies NextAuthConfig;
