import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const authOption: NextAuthOptions = {
  pages: {
    signIn: "/signIn",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      async profile(profile) {
        if (!profile?.email) {
          throw new Error("No Profile");
        }

        try {
          const user = await prisma.user.upsert({
            where: { email: profile.email },
            create: {
              email: profile.email,
              name: profile.name,
            },
            update: {
              name: profile.name,
            },
          });

          const findUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (findUser) {
            profile.sub = findUser.id;
          } else {
            throw new Error("User not found after upsert");
          }
        } catch (error) {
          console.error("Error upserting user:", error.message);
          console.error("Stack trace:", error.stack);
          throw new Error("Database operation failed");
        }

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        if (!profile?.email) {
          throw new Error("No Profile");
        }

        try {
          const user = await prisma.user.upsert({
            where: { email: profile.email },
            create: {
              email: profile.email,
              name: profile.name,
            },
            update: {
              name: profile.name,
            },
          });

          const findUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (findUser) {
            profile.sub = findUser.id;
          } else {
            throw new Error("User not found after upsert");
          }
        } catch (error) {
          console.error("Error upserting user:", error.message);
          console.error("Stack trace:", error.stack);
          throw new Error("Database operation failed");
        }

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const validUser = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (
          validUser &&
          (await bcrypt.compare(credentials.password, validUser.password))
        ) {
          return {
            id: `${validUser.id}`,
            email: validUser.email,
            name: validUser.name,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      session.user.id = token.sub;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token = {
          sub: user.id,
        };
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
