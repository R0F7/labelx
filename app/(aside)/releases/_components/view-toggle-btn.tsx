"use client";

import { Grid2x2, Table } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function ViewToggleBtn() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentView = searchParams.get("view") || "table";

  const handleViewChange = (viewType: "table" | "grid") => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("view", viewType);
    
    router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/40 w-fit">
      {/* Table View Button */}
      <button
        onClick={() => handleViewChange("table")}
        className={`p-1.5 rounded-md transition-all cursor-pointer ${
          currentView === "table"
            ? "bg-background text-foreground shadow-sm border border-border/20"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
        }`}
        title="Table View"
      >
        <Table size={18} />
      </button>

      {/* Grid View Button */}
      <button
        onClick={() => handleViewChange("grid")}
        className={`p-1.5 rounded-md transition-all cursor-pointer ${
          currentView === "grid"
            ? "bg-background text-foreground shadow-sm border border-border/20"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
        }`}
        title="Grid View"
      >
        <Grid2x2 size={18} />
      </button>
    </div>
  );
}