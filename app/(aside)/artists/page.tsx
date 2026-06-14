import React, { Suspense } from "react";
import AddArtist from "./add-artist";
import ArtistsList from "./artists-list";
import Search from "@/components/search";
import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { artistsTable } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import ArtistsListSkeleton from "./artists-list-skeleton";

interface PageProps {
  searchParams: Promise<{
    edit?: string;
    query?: string;
    cursor?: string;
    direction?: "next" | "prev";
  }>;
}

async function EditArtistLoader({ searchParams }: PageProps) {
  const { edit: editId } = await searchParams;
  if (!editId) return null;

  try {
    const session = await verifySession();
    const activeOrgId = session.session.activeOrganizationId;

    const [artistData] = await db
      .select()
      .from(artistsTable)
      .where(
        and(
          eq(artistsTable.id, Number(editId)),
          eq(artistsTable.organizationId, activeOrgId),
        ),
      )
      .limit(1);

    if (!artistData) return null;

    return <AddArtist artistData={artistData} />;
  } catch (error) {
    console.error("Failed to fetch artist for editing:", error);
    return null;
  }
}

export default function Page({ searchParams }: PageProps) {
  return (
    <section className="p-4 space-y-4">
      <div className="w-full flex items-center justify-between gap-4">
        <Suspense fallback={<div>Loading Search...</div>}>
          <Search />
        </Suspense>

        <AddArtist />
      </div>

      <Suspense fallback={<ArtistsListSkeleton />}>
        <ArtistsList searchParams={searchParams} />
      </Suspense>

      <Suspense fallback={<div>Loading Artist...</div>}>
        <EditArtistLoader searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
