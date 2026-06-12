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

  const query = params?.query?.toLowerCase() || "";
  const cursor = params?.cursor || null;
  const direction = params?.direction || "next";

  const filtered = labels.filter((l) => l.name.toLowerCase().includes(query));

  const LIMIT = 5;
  let paginatedLabels = [];

  if (!cursor) {
    paginatedLabels = filtered.slice(0, LIMIT);
  } else {
    const currentIndex = filtered.findIndex((a) => a.id === cursor);
    console.log(currentIndex);
    if (direction === "next") {
      paginatedLabels = filtered.slice(
        currentIndex + 1,
        currentIndex + 1 + LIMIT,
      );
    } else {
      paginatedLabels = filtered.slice(
        Math.max(0, currentIndex - LIMIT),
        currentIndex,
      );
    }
  }

  const firstItem = paginatedLabels[0];
  const lastItem = paginatedLabels[paginatedLabels.length - 1];

  const hasNext =
    filtered.findIndex((a) => a.id === lastItem?.id) < filtered.length - 1;
  const hasPrev = filtered.findIndex((a) => a.id === firstItem?.id) > 0;

  return (
    <>
      <div className="rounded-md bg-card overflow-hidden">
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>Label Name</TableHead>
              <TableHead>Label ID</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLabels.map((label, index) => (
              <TableRow key={index}>
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
                <TableCell>{label.id}</TableCell>
                <TableCell>{label.created_by}</TableCell>
                <TableCell>
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
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      </div>
    </>
  );
}
