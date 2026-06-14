import { db } from "@/lib/db";
import { artistsTable } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { getSession, requireAuth } from "@/lib/auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3-client";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // const {session,orgId} = await requireAuth();
    const session = await getSession();

    if (!session?.user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!session.session.activeOrganizationId) {
      return Response.json(
        { success: false, message: "No organization selected" },
        { status: 403 },
      );
    }

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const logo = formData.get("logo") as File | null;

    const dspConnectionsRaw = formData.get("dsp_connections") as string | null;

    const socialConnectionsRaw = formData.get("social_connections") as
      | string
      | null;

    let dsp_connections = [];
    let social_connections = [];

    if (dspConnectionsRaw) {
      dsp_connections = JSON.parse(dspConnectionsRaw);
    }

    if (socialConnectionsRaw) {
      social_connections = JSON.parse(socialConnectionsRaw);
    }

    let logoKey: string | undefined;

    if (logo && logo.size > 0) {
      logoKey = crypto.randomUUID();

      const arrayBuffer = await logo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: logoKey,
          Body: buffer,
          ContentType: logo.type,
        }),
      );
    }

    const updateData: any = {
      name,
      dsp_connections,
      social_connections,
    };

    if (logoKey) {
      updateData.logo = logoKey;
    }

    await db
      .update(artistsTable)
      .set(updateData)
      .where(
        and(
          eq(artistsTable.id, Number(id)),
          eq(
            artistsTable.organizationId,
            session.session.activeOrganizationId!,
          ),
        ),
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
      { status: 500 },
    );
  }
}

// TODO: jodi artist er under a releases thake taile age releases delete korte hobe tar por artist delete korte hobe
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const session = await getSession();

    if (!session?.user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!session.session.activeOrganizationId) {
      return Response.json(
        { success: false, message: "No organization selected" },
        { status: 403 },
      );
    }

    const deleted = await db
      .delete(artistsTable)
      .where(
        and(
          eq(artistsTable.id, Number(id)),
          eq(artistsTable.organizationId, session.session.activeOrganizationId),
        ),
      )
      .returning({ id: artistsTable.id });

    if (!deleted.length) {
      return Response.json(
        { success: false, message: "Artist not found or not allowed" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Artist deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete artist",
      },
      { status: 500 },
    );
  }
}
