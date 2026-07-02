"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

export default function StatusFilter({ currentStatus }: { currentStatus: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    
    params.delete("cursor");
    params.delete("direction");

    router.push(`/tickets?${params.toString()}`);
  };

  return (
    <Select defaultValue={currentStatus} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[160px] bg-white">
        <SlidersHorizontal className="mr-2 h-4 w-4 opacity-50" />
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="open">Open</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="closed">Closed</SelectItem>
      </SelectContent>
    </Select>
  );
}