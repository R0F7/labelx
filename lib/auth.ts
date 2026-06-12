import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import {
  admin,
  apiKey,
  organization,
  username,
  emailOTP,
  haveIBeenPwned,
  lastLoginMethod,
  multiSession,
} from "better-auth/plugins";
import { headers } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    maxAge: 60 * 60 * 24 * 7,
  },
  plugins: [
    username(),
    admin(),
    apiKey(),
    organization(),
    haveIBeenPwned(),
    lastLoginMethod(),
    multiSession(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          console.log("Send the OTP for sign in");
        } else if (type === "email-verification") {
          console.log("Send the OTP for email verification");
        } else {
          console.log("Send the OTP for password reset");
        }
      },
    }),
    nextCookies(),
  ],
});

export const verifySession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/login");
  }
  if (!session.session.activeOrganizationId) {
    redirect("/select-organization");
  }
  return session;
});
