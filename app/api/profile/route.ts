import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/auth-schema";
import { eq } from "drizzle-orm";
import { resolveS3Url, s3Client } from "@/lib/s3-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function PATCH(req: Request) {
  try {
    const session = await verifySession();
    
    const formData = await req.formData();
    const name = formData.get("name")?.toString().trim();
    const username = formData.get("username")?.toString().trim() as string;
    const image = formData.get("image") as File | null;
    let imageKey: string | undefined;

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const reservedUsernames = [
      "admin",
      "root",
      "support",
      "api",
      "login",
      "signup",
      "settings",
    ];

    if (image && image.size > 0) {
      imageKey = crypto.randomUUID();

      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: imageKey,
          Body: buffer,
          ContentType: image.type,
        }),
      );
    }

    if (!usernameRegex.test(username)) {
      return Response.json(
        {
          success: false,
          message: "Username can only contain letters, numbers and underscores",
        },
        { status: 400 },
      );
    }

    if (reservedUsernames.includes(username.toLowerCase())) {
      return Response.json(
        {
          success: false,
          message: "This username is reserved",
        },
        { status: 400 },
      );
    }

    const existingUser = await db.query.user.findFirst({
      where: eq(user.username, username),
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        { status: 409 },
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;
    // if (imageKey) updateData.image = imageKey;
    if (imageKey) updateData.image = resolveS3Url(imageKey);

    await db.update(user).set(updateData).where(eq(user.id, session.user.id));

    return Response.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
