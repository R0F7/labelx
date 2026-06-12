import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LabelsListSkeleton() {
  // Create an array of 5 items to simulate a loading list
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Label Name</TableHead>
            <TableHead>Label ID</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonRows.map((_, index) => (
            <TableRow key={index}>
              {/* Label Name & Avatar Column */}
              <TableCell className="py-2">
                <div className="flex gap-4 items-center">
                  <Skeleton className="w-12 h-12 rounded" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </TableCell>

              {/* Label ID Column */}
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>

              {/* Created By Column (Double line) */}
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </TableCell>

              {/* Actions Column */}
              <TableCell>
                <Skeleton className="h-8 w-8 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
