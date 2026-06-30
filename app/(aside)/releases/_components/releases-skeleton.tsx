import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ReleasesSkeleton({
  searchParams,
}: {
  searchParams?: Promise<{
    view?: "table" | "grid";
  }>;
}) {
  const params = await searchParams;
  const view = params?.view || "table";

  if (view === "grid") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-full space-y-3 bg-card p-3 border border-border rounded-lg"
          >
            <Skeleton className="aspect-square w-full rounded-md" />
            <div className="space-y-2 px-1">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>UPC</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 6 }).map((_, index) => (
            <TableRow key={index}>
              {/* Name & Avatar Column */}
              <TableCell className="py-3">
                <div className="flex gap-3 items-center">
                  <Skeleton className="w-10 h-10 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-32" />
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-20" />
                </div>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}