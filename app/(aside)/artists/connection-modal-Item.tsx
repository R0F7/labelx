"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CheckCircle2, LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ConnectionModalItem({
  platformName,
  currentId,
  onSave,
}: {
  platformName: string;
  currentId?: string;
  onSave: (name: string, id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tempId, setTempId] = useState(currentId || "");

  useEffect(() => {
    if (open) {
      setTempId(currentId || "");
    }
  }, [open, currentId]);

  const handleSave = () => {
    onSave(platformName, tempId);
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between p-1.5  border rounded-md bg-secondary/20">
      <div className="flex items-center gap-2">
        {currentId ? (
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        ) : (
          <LinkIcon className="w-4 h-4 text-muted-foreground" />
        )}
        <span className="font-medium">{platformName}</span>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant={currentId ? "outline" : "secondary"}
            size="sm"
          >
            {currentId ? "Edit" : "Connect"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Connect {platformName}</DialogTitle>
            <DialogDescription>
              Enter the profile ID or link for {platformName}. Leave blank to
              remove.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={tempId}
              onChange={(e) => setTempId(e.target.value)}
              placeholder={`e.g. your-${platformName.toLowerCase()}-id`}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save Connection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
