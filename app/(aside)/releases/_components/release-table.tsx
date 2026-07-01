import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { resolveS3Url } from "@/lib/s3-client";
import { RowActions } from "@/components/row-actions";

interface Release {
  id: number;
  title: string;
  artwork?: string | null;
  upc?: string | null;
  creatorName?: string | null;
  createdAt: string | Date;
  status: string;
}

interface ReleaseTableProps {
  releases: Release[];
}

export default function ReleaseTable({ releases }: ReleaseTableProps) {
  return (
    <div>
      <Table className="border">
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
          {releases.map((release) => (
            <TableRow key={release.id}>
              <TableCell className="py-2">
                <div className="flex gap-4 items-center">
                  <Avatar size="lg" className="w-12 h-12 rounded">
                    <AvatarImage
                      className="rounded"
                      src={
                        release.artwork
                          ? resolveS3Url(release.artwork)
                          : undefined
                      }
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1>{release?.title}</h1>
                    {/* <p className="text-xs text-muted-foreground">#23456789</p> */}
                  </div>
                </div>
              </TableCell>
              <TableCell>{release.upc}</TableCell>
              <TableCell>{release.creatorName}</TableCell>
              <TableCell>
                {new Date(release.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge>{release.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <RowActions
                  id={release.id}
                  displayTitle={release.title}
                  resourceName="releases"
                  viewUrl={`/releases/${release.id}`}
                  editPath={`/releases/create?id=${release.id}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
