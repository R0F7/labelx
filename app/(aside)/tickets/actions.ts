"use server";

import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ticketsTable } from "@/lib/schema";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ticketSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
});

const ticketUpdateSchema = z.object({
  status: z.string().min(1, "Status is required"),
  message: z.string().optional().or(z.literal("")),
});

export const createNewTicket = async (data: z.infer<typeof ticketSchema>) => {
  try {
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
    const errMsg =
      error instanceof Error ? error.message : "Something went wrong";

    return {
      success: false,
      message: errMsg,
    };
  }
};

export const updateTicketAction = async (
  ticketId: number,
  data: z.infer<typeof ticketUpdateSchema>,
) => {
  try {
    const session = await verifySession();

    if (!session?.session) {
      return { success: false, message: "Unauthorized" };
    }

    const orgId = session.session.activeOrganizationId;
    if (!orgId) {
      return { success: false, message: "Active organization not found" };
    }

    const result = ticketUpdateSchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        message: "Invalid Data",
        error: result.error.flatten().fieldErrors,
      };
    }

    const updateData: any = {
      status: result.data.status,
      updatedAt: new Date(),
    };

    if (result.data.message && result.data.message.trim() !== "") {
      const newChatReply = {
        userId: session.user.id,
        message: result.data.message,
        timestamp: new Date().toISOString(),
      };

      updateData.chats = sql`${ticketsTable.chats} || ${JSON.stringify(newChatReply)}::jsonb`;
    }

    await db
      .update(ticketsTable)
      .set(updateData)
      .where(
        and(
          eq(ticketsTable.id, ticketId),
          eq(ticketsTable.organizationId, orgId),
        ),
      );

    revalidatePath("/tickets");
    revalidatePath(`/tickets/${ticketId}`);

    return {
      success: true,
      message: "Ticket updated successfully",
    };
  } catch (error) {
    console.error("Update Ticket Action Error:", error);
    const errMsg =
      error instanceof Error ? error.message : "Something went wrong";
    return { success: false, message: errMsg };
  }
};
