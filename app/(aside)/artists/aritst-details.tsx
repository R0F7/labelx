export const revalidate = 300;

import { resolveS3Url } from "@/lib/s3-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ConnectionIcons } from "./artist-interactive-cells";

type Connection = {
  id: string;
  name: string;
};

type Artist = {
  id: number;
  name: string;
  logo?: string;
  dsp_connections?: Connection[];
  social_connections?: Connection[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export default function ArtistDetails({ artist }: { artist: Artist }) {
  return (
    <div className="max-w-lg mx-auto space-y-6 p-4">
      {/* Header */}
      <Card className="p-6 flex items-center gap-4">
        <Avatar className="w-16 h-16 border">
          <AvatarImage
            src={artist.logo ? resolveS3Url(artist.logo) : ""}
            alt={artist.name}
          />
          <AvatarFallback>
            {artist.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="text-center">
          <h1 className="text-xl font-semibold">{artist.name}</h1>
          <p className="text-sm text-muted-foreground">
            Artist ID: #{artist.id}
          </p>
        </div>
      </Card>

      {/* DSP Connections */}
      <Card className="p-6 space-y-3">
        <h2 className="font-medium">DSP Connections</h2>

        <div className="flex flex-wrap gap-2">
          {artist.dsp_connections?.length ? (
            <ConnectionIcons connections={artist.dsp_connections as any} />
          ) : (
            <p className="text-sm text-muted-foreground">
              No DSP connections added
            </p>
          )}
        </div>
      </Card>

      {/* Social Connections */}
      <Card className="p-6 space-y-3">
        <h2 className="font-medium">Social Connections</h2>

        <div className="flex flex-wrap gap-2">
          {artist.social_connections?.length ? (
            <ConnectionIcons connections={artist.social_connections as any} />
          ) : (
            <p className="text-sm text-muted-foreground">
              No social connections added
            </p>
          )}
        </div>
      </Card>

      {/* Meta Info */}
      <Card className="p-6 text-sm text-muted-foreground space-y-1">
        <p>
          Created:{" "}
          {artist.createdAt
            ? new Date(artist.createdAt).toLocaleString()
            : "N/A"}
        </p>
        <p>
          Updated:{" "}
          {artist.updatedAt
            ? new Date(artist.updatedAt).toLocaleString()
            : "N/A"}
        </p>
      </Card>
    </div>
  );
}
