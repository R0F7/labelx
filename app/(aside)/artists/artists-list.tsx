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
import CursorPagination from "@/components/pagination-controls";
import { RowActions } from "@/components/row-actions";
import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { artistsTable } from "@/lib/schema";
import { and, eq, like, gt, lt, desc, asc } from "drizzle-orm";

const LIMIT = 5;

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
  const orgId = session.session.activeOrganizationId;
  const query = params?.query?.toLowerCase() || "";
  const cursor = params?.cursor ? Number(params.cursor) : null;
  const direction = params?.direction || "next";

  let conditions: any[] = [eq(artistsTable.organizationId, orgId)];

  if (query) {
    conditions.push(like(artistsTable.name, `%${query}%`));
  }

  if (cursor) {
    if (direction === "next") {
      conditions.push(gt(artistsTable.id, cursor));
    } else {
      conditions.push(lt(artistsTable.id, cursor));
    }
  }

  const data = await db
    .select()
    .from(artistsTable)
    .where(and(...conditions))
    .orderBy(
      direction === "prev" ? desc(artistsTable.id) : asc(artistsTable.id),
    )
    .limit(LIMIT + 1);

  const hasMore = data.length > LIMIT;
  const paginated = hasMore ? data.slice(0, LIMIT) : data;

  if (direction === "prev") {
    paginated.reverse();
  }

  const firstItem = paginated[0];
  const lastItem = paginated[paginated.length - 1];

  let hasNextPage = false;
  let hasPrevPage = false;

  if (!cursor) {
    hasNextPage = hasMore;
    hasPrevPage = false;
  } else if (direction === "next") {
    hasNextPage = hasMore;
    hasPrevPage = true;
  } else if (direction === "prev") {
    hasNextPage = true;
    hasPrevPage = hasMore;
  }

  return (
    <div className="rounded-md bg-card overflow-hidden">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>DSP Connections</TableHead>
            <TableHead>Social Connections</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                No artists found
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((artist) => (
              <TableRow key={artist.id}>
                <TableCell>#{artist.id}</TableCell>
                <TableCell className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={resolveS3Url(artist.logo || "")} />
                    <AvatarFallback>
                      {artist.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {artist.name}
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
        nextCursor={lastItem?.id.toString()}
        prevCursor={firstItem?.id.toString()}
        hasNext={hasNextPage}
        hasPrev={hasPrevPage}
        // query={query}
      />
    </div>
  );
}

export default ArtistsList;
