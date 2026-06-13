import { db } from "@/lib/db";
import { artistsTable } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const session = await getSession();

    if (!session?.user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const name = formData.get("name") as string;

    const dspConnectionsRaw =
      formData.get("dsp_connections") as string | null;

    const socialConnectionsRaw =
      formData.get("social_connections") as string | null;

    let dsp_connections = [];
    let social_connections = [];

    if (dspConnectionsRaw) {
      dsp_connections = JSON.parse(dspConnectionsRaw);
    }

    if (socialConnectionsRaw) {
      social_connections = JSON.parse(socialConnectionsRaw);
    }

    await db
      .update(artistsTable)
      .set({
        name,
        dsp_connections,
        social_connections,
      })
      .where(
        and(
          eq(artistsTable.id, Number(id)),
          eq(
            artistsTable.organizationId,
            session.session.activeOrganizationId!
          )
        )
      );

    return Response.json({
      success: true,
      message: "Artist updated successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to update artist",
      },
      { status: 500 }
    );
  }
}