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
import { RowActions } from "@/components/row-actions";
import { labels } from "@/lib/data/labels";
import CursorPagination from "@/components/pagination-controls";
import { verifySession } from "@/lib/auth";
import { labelsTable } from "@/lib/schema";
import { and, eq, like, gt, lt, desc, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { organization, user } from "@/auth-schema";

const LIMIT = 5;

export default async function LabelsList({
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

  let conditions: any[] = [eq(labelsTable.organizationId, orgId)];

  if (query) {
    conditions.push(like(labelsTable.name, `%${query}%`));
  }

  if (cursor) {
    if (direction === "next") {
      conditions.push(gt(labelsTable.id, cursor));
    } else {
      conditions.push(lt(labelsTable.id, cursor));
    }
  }

  const data = await db
    .select({
      id: labelsTable.id,
      name: labelsTable.name,
      logo: labelsTable.logo,
      createdAt: labelsTable.createdAt,
      createdBy: labelsTable.createdBy,
      createdByName: user.name,
      organizationName: organization.name,
    })
    .from(labelsTable)
    .leftJoin(user, eq(labelsTable.createdBy, user.id))
    .leftJoin(organization, eq(labelsTable.organizationId, organization.id))
    .where(and(...conditions))
    .orderBy(direction === "prev" ? desc(labelsTable.id) : asc(labelsTable.id))
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

  // const query = params?.query?.toLowerCase() || "";
  // const cursor = params?.cursor || null;
  // const direction = params?.direction || "next";

  // const filtered = labels.filter((l) => l.name.toLowerCase().includes(query));

  // let paginatedLabels = [];

  // if (!cursor) {
  //   paginatedLabels = filtered.slice(0, LIMIT);
  // } else {
  //   const currentIndex = filtered.findIndex((a) => a.id === cursor);
  //   console.log(currentIndex);
  //   if (direction === "next") {
  //     paginatedLabels = filtered.slice(
  //       currentIndex + 1,
  //       currentIndex + 1 + LIMIT,
  //     );
  //   } else {
  //     paginatedLabels = filtered.slice(
  //       Math.max(0, currentIndex - LIMIT),
  //       currentIndex,
  //     );
  //   }
  // }

  // const firstItem = paginatedLabels[0];
  // const lastItem = paginatedLabels[paginatedLabels.length - 1];

  // const hasNext =
  //   filtered.findIndex((a) => a.id === lastItem?.id) < filtered.length - 1;
  // const hasPrev = filtered.findIndex((a) => a.id === firstItem?.id) > 0;

  return (
    <>
      <div className="overflow-hidden">
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>Label ID</TableHead>
              <TableHead>Label Name</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((label, index) => (
              <TableRow key={index}>
                <TableCell>{label.id}</TableCell>
                <TableCell className="py-2">
                  <div className="flex gap-4 items-center">
                    <Avatar size="lg" className="w-12 h-12 rounded">
                      <AvatarImage
                        className="rounded border-0"
                        src={label.logo ? resolveS3Url(label.logo) : undefined}
                      />
                      <AvatarFallback className="rounded border-0">
                        {label.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h1>{label.name}</h1>
                  </div>
                </TableCell>
                <TableCell>{label.createdByName}</TableCell>
                <TableCell>{label.organizationName}</TableCell>
                <TableCell className="text-right">
                  <RowActions
                    id={label.id}
                    displayTitle={label.name}
                    resourceName="labels"
                    viewUrl={`/labels/${label.id}`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <CursorPagination
          nextCursor={lastItem?.id}
          prevCursor={firstItem?.id}
          hasNext={hasNextPage}
          hasPrev={hasPrevPage}
        />
      </div>
    </>
  );
}
