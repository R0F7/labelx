"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const revokeSession = async (formData: FormData) => {
  const token = formData.get("token") as string;
  await auth.api.revokeSession({
    body: {
      token,
    },
    headers: await headers(),
  });
  revalidatePath("/profile");
};
