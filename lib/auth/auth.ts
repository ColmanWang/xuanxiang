import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { prisma } from "@/lib/prisma";
import { getStudioOAuthConfig } from "./config";

const oauth = getStudioOAuthConfig();
const socialProviders = oauth?.provider === "github"
  ? { github: { clientId: oauth.clientId, clientSecret: oauth.clientSecret } }
  : oauth?.provider === "google"
    ? { google: { clientId: oauth.clientId, clientSecret: oauth.clientSecret } }
    : {};

export const auth = betterAuth({
  appName: "玄象 Studio",
  basePath: "/api/auth",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: false },
  socialProviders,
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});
