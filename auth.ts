import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        const user = await prisma.account.findUnique({
          where: { username },
        });

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          return {
            id: user.id,
            name: user.username,
            email: user.username,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
});
