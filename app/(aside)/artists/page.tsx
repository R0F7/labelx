import React, { Suspense } from "react";
import AddArtist from "./add-artist";
import ArtistsList from "./artists-list";
import { artists } from "@/lib/data/artists";
import Search from "@/components/search";

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
  const artistData = artists.find((artist) => artist.id === editId);
  return <AddArtist artistData={artistData} />;
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

      <Suspense fallback={<div>Loading Artists...</div>}>
        <ArtistsList searchParams={searchParams} />
      </Suspense>

      <Suspense fallback={<div>Loading Artist...</div>}>
        <EditArtistLoader searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
