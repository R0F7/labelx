"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CursorPagination({
  nextCursor,
  prevCursor,
  hasNext,
  hasPrev,
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = (cursor: string | undefined, direction: "next" | "prev") => {
    if (!cursor) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("cursor", cursor);
    params.set("direction", direction);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(prevCursor, "prev")}
        disabled={!hasPrev}
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(nextCursor, "next")}
        disabled={!hasNext}
      >
        Next <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
