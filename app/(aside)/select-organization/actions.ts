"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const createOrgSchema = z.object({
  name: z.string().nonempty(),
  slug: z.string().regex(/^[a-zA-Z0-9-]+$/),
});

export const createOrganization = async (prev: any, formData: FormData) => {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const result = createOrgSchema.safeParse({
      name,
      slug,
    });
    if (!result.success) {
      return {
        error: result.error.flatten().fieldErrors,
        input: {
          name,
          slug,
        },
      };
    }
    const existingOrg = await auth.api.checkOrganizationSlug({
      body: {
        slug: result.data.slug,
      },
      headers: await headers(),
    });
    if (!existingOrg.status) {
      return {
        error: { slug: ["Organization slug already exists"] },
        input: {
          name,
          slug,
        },
      };
    }
    const organization = await auth.api.createOrganization({
      body: {
        name: result.data.name,
        slug: result.data.slug,
      },
      headers: await headers(),
    });
    console.log(organization);
    revalidatePath("/organization");
  } catch (error) {
    console.log(error);
    const errMsg =
      error instanceof Error ? error.message : "Something went wrong";
    return { error: { name: [errMsg], slug: [errMsg] } };
  }
};

export const switchOrganization = async (prev: any, formData: FormData) => {
  try {
    const organizationId = formData.get("organizationId") as string;
    console.log( "organizationId", organizationId);
    const organization = await auth.api.setActiveOrganization({
      body: {
        organizationId,
      },
      headers: await headers(),
    });
    console.log(organization);
  } catch (error) {
    console.log(error);
    const errMsg =
      error instanceof Error ? error.message : "Something went wrong";
    return { error: { organizationId: [errMsg] } };
  }
  redirect("/");
};
