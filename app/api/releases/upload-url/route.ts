import { verifySession } from "@/lib/auth";
import { s3Client } from "@/lib/s3-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ALLOWED_AUDIO_TYPES = ["audio/wav", "audio/x-wav"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const MAX_TRACKS_LIMIT = 50;

export async function POST(req: Request) {
  try {
    await verifySession(); 
    const { artwork, tracks } = await req.json();

    if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
      return Response.json({ success: false, message: "At least one track is required" }, { status: 400 });
    }

    if (tracks.length > MAX_TRACKS_LIMIT) {
      return Response.json({ success: false, message: `Maximum ${MAX_TRACKS_LIMIT} tracks allowed per release` }, { status: 400 });
    }

    for (const track of tracks) {
      if (!ALLOWED_AUDIO_TYPES.includes(track.type)) {
        return Response.json({ success: false, message: "Invalid audio format. Only WAV files are allowed." }, { status: 400 });
      }
    }

    if (artwork && !ALLOWED_IMAGE_TYPES.includes(artwork.type)) {
      return Response.json({ success: false, message: "Invalid artwork format. Only JPG, PNG, or WEBP allowed." }, { status: 400 });
    }

    let artworkData = null;
    if (artwork) {
      const key = `artwork/${crypto.randomUUID()}-${artwork.name.replace(/\s+/g, "_")}`;
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        ContentType: artwork.type,
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 900 });
      artworkData = { url, key };
    }

    const tracksData = await Promise.all(
      tracks.map(async (track: { name: string; type: string }) => {
        const key = `tracks/${crypto.randomUUID()}-${track.name.replace(/\s+/g, "_")}`;
        const command = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: key,
          ContentType: track.type,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 1800 });
        return { url, key };
      })
    );

    return Response.json({ success: true, artwork: artworkData, tracks: tracksData });
  } catch (error) {
    console.error("Presigned URL error:", error);
    return Response.json({ success: false, message: "Failed to generate upload URLs" }, { status: 500 });
  }
}