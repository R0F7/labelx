import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { releasesTable, releaseTracksTable } from "@/lib/schema";
import { s3Client } from "@/lib/s3-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { generateOfficialUPC } from "@/lib/utils";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await verifySession();
    const formData = await req.formData();

    const metadata = JSON.parse(formData.get("metadata") as string);
    const artwork = formData.get("artwork") as File | null;
    const trackFiles = formData.getAll("tracks") as File[];

    let artworkKey: string | null = null;

    if (artwork) {
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

    // const trackInsertsPayload = [] as any;

    // for (let i = 0; i < trackFiles.length; i++) {
    //   const file = trackFiles[i];
    //   const trackData = metadata.tracks[i];
    //   const trackKey = `tracks/${crypto.randomUUID()}-${file.name}`;

    //   await s3Client.send(
    //     new PutObjectCommand({
    //       Bucket: process.env.S3_BUCKET_NAME!,
    //       Key: trackKey,
    //       Body: Buffer.from(await file.arrayBuffer()),
    //       ContentType: file.type,
    //     }),
    //   );

    //   trackInsertsPayload.push({
    //     trackNumber: i + 1,
    //     title: trackData.title,
    //     version: trackData.trackVersion || null,
    //     audioFile: trackKey,
    //     audioHash: trackData.hash || null,
    //     duration: trackData.duration || null,
    //     isrc: trackData.isrc,
    //     artists: trackData.artists,
    //     primaryGenre: trackData.primaryGenre,
    //     secondaryGenre: trackData.secondaryGenre || null,
    //     trackOrigin: trackData.trackOrigin,
    //     explicitContent: trackData.explicitContent,
    //     trackLanguage: trackData.trackLanguage,
    //     isInstrumental: trackData.isInstrumental ?? false,
    //     previewStart: convertTimeToSeconds(trackData.previewStart),
    //     writers: trackData.writers,
    //   });
    // }

    const uploadedTracks = await Promise.all(
      trackFiles.map(async (file, index) => {
        const trackData = metadata.tracks[index];

        const trackKey = `tracks/${crypto.randomUUID()}-${file.name}`;

        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: trackKey,
            Body: Buffer.from(await file.arrayBuffer()),
            ContentType: file.type,
          }),
        );

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

    const result = await db.transaction(async (tx) => {
      const [newRelease] = await tx
        .insert(releasesTable)
        .values({
          title: metadata.releaseTitle,
          releaseType: metadata.releaseType,
          version: metadata.titleVersion || null,
          upc: metadata.upc || null,
          artwork: artworkKey,
          artists: metadata.artists,
          labelId: parseInt(metadata.labelData.id),
          primaryGenre: metadata.primaryGenre,
          secondaryGenre: metadata.secondaryGenre || null,
          releaseDate: new Date(metadata.releaseDate),
          originalReleaseDate: new Date(metadata.originalReleaseDate),
          language: metadata.metadataLanguage,
          stores: metadata.stores || [],
          status: "draft",
          createdBy: session.user.id,
          organizationId: session.session.activeOrganizationId,
        })
        .returning();

      let finalUpc = newRelease.upc;

      if (!finalUpc) {
        finalUpc = generateOfficialUPC(newRelease.id);

        await tx
          .update(releasesTable)
          .set({ upc: finalUpc })
          .where(eq(releasesTable.id, newRelease.id));
      }

      const finalTracks = uploadedTracks.map((track) => ({
        ...track,
        releaseId: newRelease.id,
      }));

      await tx.insert(releaseTracksTable).values(finalTracks);

      return newRelease;
    });

    return Response.json({
      success: true,
      message: "Release and tracks created successfully",
      releaseId: result.id,
    });
  } catch (error) {
    console.error("Error creating release:", error);
    return Response.json(
      { success: false, message: "Failed to create release" },
      { status: 500 },
    );
  }
}

// import { verifySession } from "@/lib/auth";
// import { db } from "@/lib/db";
// import { releasesTable, releaseTracksTable } from "@/lib/schema";
// import { s3Client } from "@/lib/s3-client";
// import { DeleteObjectsCommand } from "@aws-sdk/client-s3";

// function convertTimeToSeconds(timeStr: string | undefined): number {
//   if (!timeStr || !timeStr.includes(":")) return 0;
//   const parts = timeStr.split(":").map(Number);
//   if (parts.length === 2) return parts[0] * 60 + parts[1];
//   return 0;
// }

// export async function POST(req: Request) {
//   let artworkKey: string | null = null;
//   let tracksWithKeys: any[] = [];

//   try {
//     const session = await verifySession();
//     const body = await req.json();

//     const metadata = body.metadata;
//     artworkKey = body.artworkKey;
//     tracksWithKeys = body.tracksWithKeys || [];

//     const result = await db.transaction(async (tx) => {
//       const [newRelease] = await tx.insert(releasesTable).values({
//         title: metadata.releaseTitle,
//         releaseType: metadata.releaseType,
//         version: metadata.titleVersion || null,
//         upc: metadata.upc || null,
//         artwork: artworkKey,
//         artists: metadata.artists,
//         labelId: parseInt(metadata.labelData.id),
//         primaryGenre: metadata.primaryGenre,
//         secondaryGenre: metadata.secondaryGenre || null,
//         releaseDate: new Date(metadata.releaseDate),
//         originalReleaseDate: new Date(metadata.originalReleaseDate),
//         language: metadata.metadataLanguage,
//         stores: metadata.stores || [],
//         status: "draft",
//         createdBy: session.user.id,
//         organizationId: session.session.activeOrganizationId,
//       }).returning();

//       const finalTracks = tracksWithKeys.map((track: any, index: number) => {
//         const trackData = metadata.tracks[index];
//         return {
//           releaseId: newRelease.id,
//           trackNumber: index + 1,
//           title: trackData.title,
//           version: trackData.trackVersion || null,
//           audioFile: track.key,
//           audioHash: trackData.hash || null,
//           duration: trackData.duration || null,
//           isrc: trackData.isrc,
//           artists: trackData.artists,
//           primaryGenre: trackData.primaryGenre,
//           secondaryGenre: trackData.secondaryGenre || null,
//           trackOrigin: trackData.trackOrigin,
//           explicitContent: trackData.explicitContent,
//           trackLanguage: trackData.trackLanguage,
//           isInstrumental: trackData.isInstrumental ?? false,
//           previewStart: convertTimeToSeconds(trackData.previewStart),
//           writers: trackData.writers,
//         };
//       });

//       await tx.insert(releaseTracksTable).values(finalTracks);
//       return newRelease;
//     });

//     return Response.json({ success: true, message: "Release created successfully", releaseId: result.id });

//   } catch (error) {
//     console.error("DB Transaction failed, triggering S3 cleanup:", error);

//     // S3 Orphan Cleanup Logic
//     const objectsToDelete = [];
//     if (artworkKey) objectsToDelete.push({ Key: artworkKey });
//     if (tracksWithKeys.length > 0) {
//       tracksWithKeys.forEach((t: any) => {
//         if (t.key) objectsToDelete.push({ Key: t.key });
//       });
//     }

//     if (objectsToDelete.length > 0) {
//       try {
//         await s3Client.send(
//           new DeleteObjectsCommand({
//             Bucket: process.env.S3_BUCKET_NAME!,
//             Delete: { Objects: objectsToDelete },
//           })
//         );
//         console.log("Orphan S3 assets successfully rolled back.");
//       } catch (s3Err) {
//         console.error("Critical: Failed to delete orphan S3 assets during rollback:", s3Err);
//       }
//     }

//     return Response.json({ success: false, message: "Failed to create release. Assets cleared." }, { status: 500 });
//   }
// }
