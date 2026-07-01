import React from "react";
import ReleaseCard from "./release-card";
import { verifySession } from "@/lib/auth";
import { releasesTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import CursorPagination from "@/components/pagination-controls";
import { paginateWithCursor } from "@/lib/pagination";
import ReleaseTable from "./release-table";
import { user } from "@/auth-schema";

interface PaginatedRelease {
  id: number;
  title: string;
  artwork: string | null;
  status: string;
  upc: string | null;
  artists: any;
  creatorName: string | null;
  createdAt: string | Date;
}

export default async function Releases({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    cursor?: string;
    direction?: "next" | "prev";
    view?: "table" | "grid";
  }>;
}) {
  const params = await searchParams;
  const session = await verifySession();
  const orgId = session.session.activeOrganizationId;

  const searchQuery = params?.query?.toLowerCase() || "";
  const cursor = params?.cursor ? Number(params.cursor) : null;
  const direction = params?.direction || "next";
  const view = params?.view || "table";

  const { data, nextCursor, prevCursor, hasNextPage, hasPrevPage } =
    await paginateWithCursor({
      table: releasesTable,
      cursorColumn: releasesTable.id,
      searchQueryColumn: releasesTable.title,
      searchQuery,
      cursor,
      direction,
      limit: 12,
      baseConditions: [eq(releasesTable.organizationId, orgId)],
      joins: [
        {
          targetTable: user,
          on: eq(releasesTable.createdBy, user.id),
          type: "left",
        },
      ],
      columns: {
        id: releasesTable.id,
        title: releasesTable.title,
        artwork: releasesTable.artwork,
        status: releasesTable.status,
        upc: releasesTable.upc,
        artists: releasesTable.artists,
        creatorName: user.name,
        createdAt: releasesTable.createdAt,
      },
    })as {
      data: PaginatedRelease[];
      nextCursor: string | null;
      prevCursor: string | null;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };;

  return (
    <div className="space-y-6">
      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.map((release) => (
            <ReleaseCard
              key={release.id}
              release={{
                title: release.title,
                id: release.id,
                artwork: release.artwork!,
                status: release.status,
                artists: release.artists?.map(
                  (artist: any) => artist.artistData.name,
                ),
              }}
            />
          ))}
        </div>
      ) : (
        <ReleaseTable releases={data} />
      )}

      <CursorPagination
        nextCursor={nextCursor}
        prevCursor={prevCursor}
        hasNext={hasNextPage}
        hasPrev={hasPrevPage}
      />
    </div>
  );
}
