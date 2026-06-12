"use client";

import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

function Search({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const initialQuery = searchParams.get("query")?.toString() || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const currentQuery = searchParams.get("query") || "";

    if (debouncedSearchTerm !== currentQuery) {
      const params = new URLSearchParams(searchParams.toString());

      if (debouncedSearchTerm) {
        params.set("query", debouncedSearchTerm);
      } else {
        params.delete("query");
      }

      params.delete("cursor");
      params.delete("direction");

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [debouncedSearchTerm, pathname, router, searchParams]);

  return (
    <div className={cn("relative w-xs", className)}>
      <MagnifyingGlass className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
      <Input
        className="bg-background pl-9"
        id="search-input"
        placeholder="Search..."
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}

export default Search;