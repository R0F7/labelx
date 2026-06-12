import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ReleaseTable() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>UPC</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="py-2">
              <div className="flex gap-4 items-center">
                <Avatar size="lg" className="w-12 h-12 rounded">
                  <AvatarImage
                    className="rounded"
                    src="https://github.com/shadcn.png"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h1>Alan Walker</h1>
                  <p className="text-xs text-muted-foreground">#23456789</p>
                </div>
              </div>
            </TableCell>
            <TableCell>John Doe</TableCell>
            <TableCell>
              <Badge>Pending</Badge>
            </TableCell>
            <TableCell>John Doe</TableCell>
            <TableCell>John Doe</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default ReleaseTable;
