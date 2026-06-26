// import React from "react";
// import ReleaseCard from "./release-card";
// import { verifySession } from "@/lib/auth";
// import { db } from "@/lib/db";
// import { releasesTable } from "@/lib/schema";
// import { eq } from "drizzle-orm";

// async function ReleaseGrid() {
//   const session = await verifySession();
//   const orgId = session.session.activeOrganizationId;
  
//   // const releases = await db.select().from(releasesTable);
//   const releases = await db.query.releasesTable.findMany({
//     where: eq(releasesTable.organizationId, orgId),
//     columns: {
//       id: true,
//       title: true,
//       artwork: true,
//       status: true,
//       artists: true,
//     },
//   });

//   return (
//     <>
//       <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
//         {releases.map((release, i) => (
//           <ReleaseCard
//             release={{
//               title: release.title,
//               id: release.id,
//               artwork: release.artwork!,
//               status: release.status,
//               artists: release.artists?.map((artist) => artist.artistData.name),
//             }}
//             key={i}
//           />
//         ))}
//       </div>
//     </>
//   );
// }

// export default ReleaseGrid;

import React from "react";
import ReleaseCard from "./release-card";
import { verifySession } from "@/lib/auth";
import { releasesTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import CursorPagination from "@/components/pagination-controls";
import { paginateWithCursor } from "@/lib/pagination"; // ফাংশনটি ইমপোর্ট করুন

async function ReleaseGrid({
  searchParams,
}: {
  searchParams?: Promise<{
    cursor?: string;
    direction?: "next" | "prev";
  }>;
}) {
  const params = await searchParams;
  const session = await verifySession();
  const orgId = session.session.activeOrganizationId;

  const cursor = params?.cursor ? Number(params.cursor) : null;
  const direction = params?.direction || "next";

  const { data, nextCursor, prevCursor, hasNextPage, hasPrevPage } =
    await paginateWithCursor({
      table: releasesTable,
      cursorColumn: releasesTable.id,
      cursor,
      direction,
      limit: 2,
      baseConditions: [eq(releasesTable.organizationId, orgId)],
      columns: {
        id: releasesTable.id,
        title: releasesTable.title,
        artwork: releasesTable.artwork,
        status: releasesTable.status,
        artists: releasesTable.artists,
      },
    });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.map((release) => (
          <ReleaseCard
            key={release.id}
            release={{
              title: release.title,
              id: release.id,
              artwork: release.artwork!,
              status: release.status,
              artists: release.artists?.map((artist: any) => artist.artistData.name),
            }}
          />
        ))}
      </div>

      <CursorPagination
        nextCursor={nextCursor}
        prevCursor={prevCursor}
        hasNext={hasNextPage}
        hasPrev={hasPrevPage}
      />
    </div>
  );
}

export default ReleaseGrid;