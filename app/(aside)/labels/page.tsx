import { Input } from "@/components/ui/input";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import React, { Suspense } from "react";
import AddLabel from "./_components/add-label";
import LabelsList from "./_components/label-list";
import LabelsListSkeleton from "./_components/labels-list-skeleton";
import { labels } from "@/lib/data/labels";
import Search from "@/components/search";

interface PageProps {
  searchParams: Promise<{
    edit?: string;
    query?: string;
    cursor?: string;
    direction?: "next" | "prev";
  }>;
}

async function EditLabelLoader({ searchParams }: PageProps) {
  const { edit: editId } = await searchParams;
  if (!editId) return null;

  const labelData = labels.find((label) => label.id === editId);
  return <AddLabel labelData={labelData} />;
}

function Page({ searchParams }: PageProps) {
  return (
    <>
      <section className="p-4 space-y-4">
        <div className="w-full flex items-center justify-between gap-4">
          <Suspense fallback={<div>Loading Search...</div>}>
            <Search />
          </Suspense>

          <AddLabel />
        </div>
        <Suspense fallback={<LabelsListSkeleton />}>
          <LabelsList searchParams={searchParams} />
        </Suspense>

        <Suspense fallback={<div>Loading Label...</div>}>
          <EditLabelLoader searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

export default Page;
