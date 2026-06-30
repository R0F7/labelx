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
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="border">
      <Table>
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
          {skeletonRows.map((_, index) => (
            <TableRow key={index}>
              {/* Label ID Column */}
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>

              {/* Label Name & Avatar Column */}
              <TableCell className="py-2">
                <div className="flex gap-4 items-center">
                  <Skeleton className="w-12 h-12 rounded" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </TableCell>

              {/* Created By Column (Double line) */}
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </TableCell>
              
              {/* Created By Column (Double line) */}
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </TableCell>

              {/* Actions Column */}
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Skeleton className="h-4 w-4" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
