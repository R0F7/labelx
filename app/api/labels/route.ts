import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { resolveS3Url, s3Client } from "@/lib/s3-client";
import { labelsTable } from "@/lib/schema";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

export const POST = async (req: Request) => {
  try {
    // const session = await verifySession();
    // if(!session){
    //     return Response.json({success:false, message: "Unauthorized"},{status:401})
    // }

    const formData = await req.formData();
    const labelName = formData.get("name") as string;
    const logoFile = formData.get("logo") as File;

    if (!labelName) {
      return Response.json(
        { success: false, message: "Label name is required" },
        { status: 400 },
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

    const data = {
      name: labelName,
      ...(logoKey && { logo: logoKey }),
    };
    console.log(data, resolveS3Url(logoKey!));

    // await db.insert(labelsTable).values({
    //     name: labelName,
    //     ...(logoFile && {logo: key}),
    //     createdBy: session.user.id,
    //     organizationId: session.session?.activeOrganizationId!,
    // })
    return Response.json(
      {
        success: true,
        message: "Label added successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
};
