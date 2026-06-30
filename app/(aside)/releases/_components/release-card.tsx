import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { resolveS3Url } from "@/lib/s3-client";
import { RowActions } from "@/components/row-actions";

interface ReleaseType {
  id: number;
  artwork?: string;
  title: string;
  status: string;
  artists?: string[];
}

function ReleaseCard({ release }: { release: ReleaseType }) {
  return (
    <Link href={`/releases/${release.id}`}>
      <div className="relative w-full space-y-3 bg-card p-3 transition-all hover:shadow-lg group">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {release.artwork && (
            <Image
              src={resolveS3Url(release.artwork)}
              alt="Release artwork"
              fill
              className="object-cover transition-transform duration-300"
            />
          )}
        </div>

        {/* Content */}
        <div className="space-y-1 px-1">
          <div className="flex items-center justify-between gap-2">
            <div className="">
              <h3 className="truncate text-sm font-semibold leading-none tracking-tight">
                {release.title}
              </h3>

              <p className="truncate text-xs text-muted-foreground mt-1">
                {release?.artists?.map((r) => r).join(", ") ||
                  "No Artists Found"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Badge
                variant="secondary"
                className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
              >
                {release.status}
              </Badge>
              <div className="rotate-90">
                <RowActions
                  id={release.id}
                  displayTitle={release.title}
                  resourceName="releases"
                  viewUrl={`/releases/${release.id}`}
                  editPath={`/releases/create?id=${release.id}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ReleaseCard;
