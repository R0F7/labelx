import { db } from "@/lib/db";
import { artistsTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import ArtistDetails from "../aritst-details";


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [artist] = await db
    .select()
    .from(artistsTable)
    .where(eq(artistsTable.id, Number(id)))
    .limit(1);

  if (!artist) {
    return (
      <div className="p-6 text-muted-foreground">
        Artist not found
      </div>
    );
  }

  return <ArtistDetails artist={artist} />;
}