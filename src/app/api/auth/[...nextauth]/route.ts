import NextAuth from "next-auth";
import bcryptjs from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) {
          throw new Error("Invalid credentials");
        }
        const { username, password } = credentials;

        const user = await prisma.user.findUnique({
          where: {
            username,
          },
        });
        if (!user) {
          throw new Error("User not found");
        }

        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
          throw new Error("Invalid password");
        }

        return user;
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
    signOut: "/",
  },
  //debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
