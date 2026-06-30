import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { releasesTable, releaseTracksTable } from "@/lib/schema";
import { s3Client } from "@/lib/s3-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { eq, and } from "drizzle-orm";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { generateOfficialUPC } from "@/lib/utils";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await verifySession();
    const formData = await req.formData();
    const { id: releaseId } = await params;

    const metadata = JSON.parse(formData.get("metadata") as string);

    if (!releaseId) {
      return Response.json(
        { success: false, message: "Release ID is required for update" },
        { status: 400 },
      );
    }

    const artwork = formData.get("artwork") as File | null;
    const trackFiles = formData.getAll("tracks") as File[];

    let artworkKey = metadata.artwork;

    if (artwork && artwork instanceof File) {
      artworkKey = `artwork/${crypto.randomUUID()}-${artwork.name}`;
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: artworkKey,
          Body: Buffer.from(await artwork.arrayBuffer()),
          ContentType: artwork.type,
        }),
      );
    }

    function convertTimeToSeconds(timeStr: string | undefined): number {
      if (!timeStr || !timeStr.includes(":")) return 0;
      const parts = timeStr.split(":").map(Number);
      if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
      }
      return 0;
    }

    let fileIndex = 0;

    const uploadedTracks = await Promise.all(
      metadata.tracks.map(async (trackData: any, index: number) => {
        let trackKey = trackData.audioFile;

        if (trackData.isNewFile || !trackData.audioFile) {
          const file = trackFiles[fileIndex];
          fileIndex++;

          if (file) {
            trackKey = `tracks/${crypto.randomUUID()}-${file.name}`;
            await s3Client.send(
              new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME!,
                Key: trackKey,
                Body: Buffer.from(await file.arrayBuffer()),
                ContentType: file.type,
              }),
            );
          }
        }

        return {
          trackNumber: index + 1,
          title: trackData.title,
          version: trackData.trackVersion || null,
          audioFile: trackKey,
          audioHash: trackData.hash || null,
          duration: trackData.duration || null,
          isrc: trackData.isrc,
          artists: trackData.artists,
          primaryGenre: trackData.primaryGenre,
          secondaryGenre: trackData.secondaryGenre || null,
          trackOrigin: trackData.trackOrigin,
          explicitContent: trackData.explicitContent,
          trackLanguage: trackData.trackLanguage,
          isInstrumental: trackData.isInstrumental ?? false,
          previewStart: convertTimeToSeconds(trackData.previewStart),
          writers: trackData.writers,
        };
      }),
    );

    await db.transaction(async (tx) => {
      await tx
        .update(releasesTable)
        .set({
          title: metadata.releaseTitle,
          releaseType: metadata.releaseType,
          version: metadata.titleVersion || null,
          upc: metadata.upc || generateOfficialUPC(Number(releaseId)),
          artwork: artworkKey,
          artists: metadata.artists,
          labelId: parseInt(metadata.labelData.id),
          primaryGenre: metadata.primaryGenre,
          secondaryGenre: metadata.secondaryGenre || null,
          releaseDate: new Date(metadata.releaseDate),
          originalReleaseDate: new Date(metadata.originalReleaseDate),
          language: metadata.metadataLanguage,
          stores: metadata.stores || [],
          // status: "draft",
        })
        .where(
          and(
            eq(releasesTable.id, releaseId),
            eq(
              releasesTable.organizationId,
              session.session.activeOrganizationId,
            ),
          ),
        );

      await tx
        .delete(releaseTracksTable)
        .where(eq(releaseTracksTable.releaseId, releaseId));

      const finalTracks = uploadedTracks.map((track) => ({
        ...track,
        releaseId: releaseId,
      }));

      if (finalTracks.length > 0) {
        await tx.insert(releaseTracksTable).values(finalTracks);
      }
    });

    return Response.json({
      success: true,
      message: "Release and tracks updated successfully",
      releaseId: releaseId,
    });
  } catch (error) {
    console.error("Error updating release:", error);
    return Response.json(
      { success: false, message: "Failed to update release" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await verifySession();
    const { id: releaseId } = await params;

    if (!releaseId) {
      return Response.json(
        { success: false, message: "Release ID is required" },
        { status: 400 },
      );
    }

    const existingRelease = await db
      .select({
        id: releasesTable.id,
        artwork: releasesTable.artwork,
      })
      .from(releasesTable)
      .where(
        and(
          eq(releasesTable.id, releaseId),
          eq(
            releasesTable.organizationId,
            session.session.activeOrganizationId,
          ),
        ),
      )
      .then((res) => res[0]);

    if (!existingRelease) {
      return Response.json(
        { success: false, message: "Release not found or unauthorized" },
        { status: 444 },
      );
    }

    const existingTracks = await db
      .select({ audioFile: releaseTracksTable.audioFile })
      .from(releaseTracksTable)
      .where(eq(releaseTracksTable.releaseId, releaseId));

    const objectsToDelete: { Key: string }[] = [];

    if (existingRelease.artwork) {
      objectsToDelete.push({ Key: existingRelease.artwork });
    }

    existingTracks.forEach((track) => {
      if (track.audioFile) {
        objectsToDelete.push({ Key: track.audioFile });
      }
    });

    await db.transaction(async (tx) => {
      await tx
        .delete(releaseTracksTable)
        .where(eq(releaseTracksTable.releaseId, releaseId));

      await tx
        .delete(releasesTable)
        .where(
          and(
            eq(releasesTable.id, releaseId),
            eq(
              releasesTable.organizationId,
              session.session.activeOrganizationId,
            ),
          ),
        );
    });

    if (objectsToDelete.length > 0) {
      try {
        await s3Client.send(
          new DeleteObjectsCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Delete: { Objects: objectsToDelete },
          }),
        );
        console.log(`S3 assets successfully deleted for release: ${releaseId}`);
      } catch (s3Error) {
        console.error(
          "Warning: Failed to delete S3 assets during release deletion:",
          s3Error,
        );
      }
    }

    return Response.json({
      success: true,
      message: "Release and all associated tracks/assets deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting release:", error);
    return Response.json(
      { success: false, message: "Failed to delete release" },
      { status: 500 },
    );
  }
}
