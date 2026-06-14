import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ArtistsListSkeleton() {
  // Create an array of 5 items to simulate a loading list
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="rounded-md border">
      <Table>
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
          {skeletonRows.map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-7 w-7" />
              </TableCell>

              <TableCell className="py-2">
                <div className="flex gap-4 items-center">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </TableCell>

              <TableCell className="text-right">
                <Skeleton className="h-4 w-4 text-right" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
