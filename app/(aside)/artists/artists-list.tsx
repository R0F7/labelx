// v-4***
// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { resolveS3Url } from "@/lib/s3-client";
// import { ConnectionIcons, RowActions } from "./artist-interactive-cells";
// import { artists } from "@/lib/data/artists";

// async function ArtistsList() {

//   return (
//     <div className="border roun ded-md bg-card overflow-hidden">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Artist</TableHead>
//             <TableHead>ID</TableHead>
//             <TableHead>DSP Connections</TableHead>
//             <TableHead>Social Connections</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {artists.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
//                 No artists found.
//               </TableCell>
//             </TableRow>
//           ) : (
//             artists.map((artist) => (
//               <TableRow key={artist.id} className="hover:bg-muted/40 transition-colors">
//                 <TableCell className="py-3">
//                   <div className="flex gap-3 items-center">
//                     <Avatar className="w-9 h-9 border">
//                       <AvatarImage src={resolveS3Url(artist.logo || "")} alt={artist.name} />
//                       <AvatarFallback>{artist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
//                     </Avatar>
//                     <span className="font-medium text-sm">{artist.name}</span>
//                   </div>
//                 </TableCell>
//                 <TableCell className="text-muted-foreground text-xs">#{artist.id}</TableCell>
//                 <TableCell>
//                   <ConnectionIcons connections={artist.dsp_connections as any} />
//                 </TableCell>
//                 <TableCell>
//                   <ConnectionIcons connections={artist.social_connections as any} />
//                 </TableCell>
//                 <TableCell className="text-right">
//                     <RowActions artistId={artist.id} artistName={artist.name} />
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

// export default ArtistsList;

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { resolveS3Url } from "@/lib/s3-client";
import { ConnectionIcons } from "./artist-interactive-cells";
// import { artists } from "@/lib/data/artists";
import CursorPagination from "@/components/pagination-controls";
import { RowActions } from "@/components/row-actions";
import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { artistsTable } from "@/lib/schema";
import { and, eq } from "drizzle-orm";

async function ArtistsList({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    cursor?: string;
    direction?: "next" | "prev";
  }>;
}) {
  const params = await searchParams;
  const session = await verifySession();
  const artists = await db
    .select()
    .from(artistsTable)
    .where(
      and(
        eq(artistsTable.createdBy, session.user.id),
        eq(
          artistsTable.organizationId,
          session?.session?.activeOrganizationId!,
        ),
      ),
    );

  const query = params?.query?.toLowerCase() || "";
  const cursor = params?.cursor || null;
  const direction = params?.direction || "next";

  const filtered = artists.filter((a) => a.name.toLowerCase().includes(query));

  const LIMIT = 5;
  let paginatedArtists = [];

  if (!cursor) {
    paginatedArtists = filtered.slice(0, LIMIT);
  } else {
    const currentIndex = filtered.findIndex((a) => a.id === cursor);
    console.log(currentIndex);
    if (direction === "next") {
      paginatedArtists = filtered.slice(
        currentIndex + 1,
        currentIndex + 1 + LIMIT,
      );
    } else {
      paginatedArtists = filtered.slice(
        Math.max(0, currentIndex - LIMIT),
        currentIndex,
      );
    }
  }

  const firstItem = paginatedArtists[0];
  const lastItem = paginatedArtists[paginatedArtists.length - 1];

  const hasNext =
    filtered.findIndex((a) => a.id === lastItem?.id) < filtered.length - 1;
  const hasPrev = filtered.findIndex((a) => a.id === firstItem?.id) > 0;

  return (
    <div className="rounded-md bg-card overflow-hidden">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Artist</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>DSP Connections</TableHead>
            <TableHead>Social Connections</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedArtists.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground py-6"
              >
                No artists found.
              </TableCell>
            </TableRow>
          ) : (
            paginatedArtists.map((artist) => (
              <TableRow
                key={artist.id}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell className="py-3">
                  <div className="flex gap-3 items-center">
                    <Avatar className="w-9 h-9 border">
                      <AvatarImage
                        src={resolveS3Url(artist.logo || "")}
                        alt={artist.name}
                      />
                      <AvatarFallback>
                        {artist.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{artist.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  #{artist.id}
                </TableCell>
                <TableCell>
                  <ConnectionIcons
                    connections={artist.dsp_connections as any}
                  />
                </TableCell>
                <TableCell>
                  <ConnectionIcons
                    connections={artist.social_connections as any}
                  />
                </TableCell>
                <TableCell className="text-right">
                  {/* <RowActions artistId={artist.id} artistName={artist.name} /> */}
                  <RowActions
                    id={artist.id}
                    displayTitle={artist.name}
                    resourceName="artists"
                    viewUrl={`/artists/${artist.id}`}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <CursorPagination
        nextCursor={lastItem?.id}
        prevCursor={firstItem?.id}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />
    </div>
  );
}

export default ArtistsList;
