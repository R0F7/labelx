import Search from "@/components/search";
import { Suspense } from "react";
import Releases from "./_components/releases";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ViewToggleBtn from "./_components/view-toggle-btn";
import ReleasesSkeleton from "./_components/releases-skeleton";

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

          <div className="flex items-center gap-2">
            <ViewToggleBtn />
            <Link href="/releases/create">
              <Button>
                <Plus />
                Add Release
              </Button>
            </Link>
          </div>
        </div>

        <Suspense fallback={<ReleasesSkeleton searchParams={searchParams} />}>
          <Releases searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

export default Page;
