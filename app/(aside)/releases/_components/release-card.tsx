import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import React from "react";
import { Play } from "lucide-react"; // Assuming you use lucide-react (standard with shadcn)
import Link from "next/link";
import { resolveS3Url } from "@/lib/s3-client";

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
      <div className="relative w-full space-y-3 bg-card p-3 transition-all hover:shadow-lg">
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
            <h3 className="truncate text-sm font-semibold leading-none tracking-tight">
              {release.title}
            </h3>
            <Badge
              variant="secondary"
              className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
            >
              {release.status}
            </Badge>
          </div>

          <p className="truncate text-xs text-muted-foreground">
            {release?.artists?.map((r) => r).join(", ") || "No Artists Found"}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ReleaseCard;
