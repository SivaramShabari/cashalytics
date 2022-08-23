import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../prisma";
export default NextAuth({
	// Configure one or more authentication providers
	adapter: PrismaAdapter(prisma),
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_OAUTH_CLIENT_ID || "",
			clientSecret: process.env.GITHUB_OAUTH_SECRET || "",
		}),
	],
});
