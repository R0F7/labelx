"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter, useSearchParams } from "next/navigation";

interface RowActionsProps {
  id: number;
  displayTitle: string;
  resourceName: string;
  viewUrl?: string;
  editQueryKey?: string;
  editPath?: string;
}

export function RowActions({
  id,
  displayTitle,
  resourceName,
  viewUrl,
  editQueryKey = "edit",
  editPath,
}: RowActionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const currentParams = new URLSearchParams(searchParams.toString());
  currentParams.set(editQueryKey, id.toString());
  const editUrl = `?${currentParams.toString()}`;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/${resourceName}/${id}`, {
        method: "DELETE",
      });

      if (res.status === 401) {
        toast.error("Session expired or not logged in. Please login.");
        router.push("/login");
        return;
      }

      if (res.status === 403) {
        toast.error("Please select an organization first.");
        router.push("/select-organization");
        return;
      }

      const data = await res.json();

      if (data.success) {
        toast.success(`${displayTitle} deleted successfully!`);
        setShowDeleteAlert(false);
        router.refresh();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error(`Failed to delete ${resourceName}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {viewUrl && (
            <DropdownMenuItem asChild>
              <Link href={viewUrl} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                <span>View more...</span>
              </Link>
            </DropdownMenuItem>
          )}

          {/* Edit Option */}
          <DropdownMenuItem asChild>
            <Link
              href={editPath || editUrl}
              scroll={false}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Delete Option */}
          <DropdownMenuItem
            onClick={() => setShowDeleteAlert(true)}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <strong>{displayTitle}</strong> and all associated {resourceName}{" "}
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
