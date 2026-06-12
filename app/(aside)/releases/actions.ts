"use server";

import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { releasesTable } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const zodCreateRelease = z.object({
  title: z.string().nonempty("Release title is required"),
  upc: z.coerce.number().optional(),
});

export const createRelease = async (data: z.infer<typeof zodCreateRelease>) => {
  try {
    const session = await verifySession();
    const result = zodCreateRelease.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        errors: result.error.flatten().fieldErrors,
      };
    }
    await db.insert(releasesTable).values({
      title: result.data.title,
      upc: result.data.upc!,
      createdBy: session.user.id,
      organizationId: session.session.activeOrganizationId!,
    });
    revalidatePath("/releases");
    return {
      success: true,
      message: "Release created successfully",
    };
  } catch (error) {
    console.log(error);
    const errMsg =
      error instanceof Error ? error.message : "Something went wrong";
    return {
      success: false,
      message: errMsg,
    };
  }
};
