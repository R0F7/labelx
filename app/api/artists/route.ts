import { resolveS3Url, s3Client } from "@/lib/s3-client";
import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { artistsTable } from "@/lib/schema";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

export const POST = async (req: Request) => {
  try {
    // const session = await verifySession();
    // if (!session) {
    //   return Response.json(
    //     { success: false, message: "Unauthorized" },
    //     { status: 401 },
    //   );
    // }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const logo = formData.get("logo") as File | null;

    // Get stringified JSON arrays from formData
    const dspConnectionsRaw = formData.get("dsp_connections") as string | null;
    const socialConnectionsRaw = formData.get("social_connections") as
      | string
      | null;

    if (!name) {
      return Response.json({
        success: false,
        message: "Artist Name is required",
      });
    }

    // Parse the JSON strings back into arrays safely
    let dsp_connections = [];
    let social_connections = [];

    try {
      if (dspConnectionsRaw) dsp_connections = JSON.parse(dspConnectionsRaw);
      if (socialConnectionsRaw)
        social_connections = JSON.parse(socialConnectionsRaw);
    } catch (parseError) {
      return Response.json({
        success: false,
        message: "Invalid format for connections data",
      });
    }

    let logoKey: string | undefined = undefined;

    if (logo) {
      logoKey = crypto.randomUUID();
      const arrayBuffer = await logo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: logoKey,
        Body: buffer,
        ContentType: logo.type,
      });

      await s3Client.send(command);
    }

    const data = {
      name,
      dsp_connections,
      social_connections,
      createdBy: "session.user.id",
      organizationId: "session?.session?.activeOrganizationId!",
      ...(logoKey && { logo: logoKey }),
    };
    console.log(data, resolveS3Url(logoKey!));

    // Insert into database
    // await db.insert(artistsTable).values({
    //   name,
    //   // Assuming your schema uses camelCase for these fields.
    //   // If your schema uses snake_case, change them to dsp_connections and social_connections
    //   dspConnections,
    //   socialConnections,
    //   createdBy: session.user.id,
    //   organizationId: session?.session?.activeOrganizationId!,
    //   ...(logoKey && { logo: logoKey }), // Only save the key if logo was actually uploaded
    // });

    return Response.json({
      success: true,
      message: "Artist created successfully",
    });
  } catch (error) {
    console.log(error);
    const errMsg =
      error instanceof Error ? error.message : "Something went wrong";

    return Response.json({
      success: false,
      message: errMsg,
    });
  }
};
