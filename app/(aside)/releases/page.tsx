import Search from "@/components/search";

import React, { Suspense } from "react";
import AddRelease from "./_components/add-release";
import ReleaseTable from "./_components/release-table";
import ReleaseGrid from "./_components/release-grid";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    cursor?: string;
    direction?: "next" | "prev";
  }>;
}

function Page({ searchParams }: PageProps) {
  return (
    <>
      <section className="p-4 space-y-4">
        <div className="w-full flex items-center justify-between gap-4">
          <Search />
          {/* <AddRelease /> */}
          <Link href="/releases/create">
            <Button>
              <Plus />
              Add Release
            </Button>
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((r, i) => (
                <div
                  key={i}
                  className="w-full space-y-3 bg-card p-3 border border-transparent"
                >
                  <Skeleton className="aspect-square w-full rounded-none" />
                  <div className="space-y-2 px-1">
                    <div className="flex items-center justify-between gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <ReleaseGrid searchParams={searchParams}/>
        </Suspense>
      </section>
    </>
  );
}

export default Page;
