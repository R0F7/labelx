import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { s3Client } from "@/lib/s3-client";
import { labelsTable } from "@/lib/schema";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { and, eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getSession();
    const formData = await req.formData();
    const labelName = formData.get("name") as string;
    const logoFile = formData.get("logo") as File;

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

    let logoKey: string | undefined = undefined;

    if (logoFile) {
      logoKey = crypto.randomUUID();
      const buffer = Buffer.from(await logoFile.arrayBuffer());

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: logoKey,
        Body: buffer,
        ContentType: logoFile.type,
      });

      await s3Client.send(command);
    }

    const updateData: any = {};
    if (labelName) updateData.name = labelName;
    if (logoKey) updateData.logo = logoKey;

    await db
      .update(labelsTable)
      .set(updateData)
      .where(
        and(
          eq(labelsTable.id, Number(id)),
          eq(labelsTable.organizationId, session.session.activeOrganizationId!),
        ),
      );

    return Response.json({
      success: true,
      message: "Label updated successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to update label",
      },
      { status: 500 },
    );
  }
}

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
      .delete(labelsTable)
      .where(
        and(
          eq(labelsTable.id, Number(id)),
          eq(labelsTable.organizationId, session.session.activeOrganizationId),
        ),
      )
      .returning({ id: labelsTable.id });

    if (!deleted.length) {
      return Response.json(
        { success: false, message: "Label not found or not allowed" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Label deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete Label",
      },
      { status: 500 },
    );
  }
}
