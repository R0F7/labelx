"use server";

import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ticketsTable } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ticketSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
});

export const createNewTicket = async (data: z.infer<typeof ticketSchema>) => {
  try {
    console.log(data);
    const session = await verifySession();

    if (!session?.session) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const result = ticketSchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        message: "Invalid Data",
        error: result.error.flatten().fieldErrors,
      };
    }
    await db.insert(ticketsTable).values({
      subject: result.data.subject,
      category: result.data.category,
      chats: [
        {
          userId: session.user.id,
          message: result.data.description,
          timestamp: new Date().toISOString(),
        },
      ],
      createdBy: session.user.id,
      organizationId: session.session?.activeOrganizationId!,
    });
    revalidatePath("/tickets");
    return {
      success: true,
      message: "Ticket created successfully",
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
