import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Disc, Globe, Hash, PlayCircle, Clock3 } from "lucide-react";
import { db } from "@/lib/db";
import { releasesTable, releaseTracksTable } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { verifySession } from "@/lib/auth";
import { resolveS3Url } from "@/lib/s3-client";

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await verifySession();
  const orgId = session.session.activeOrganizationId;
  
  const conditions = [
    eq(releasesTable.id, Number(slug)),
    eq(releasesTable.organizationId, orgId),
  ];

  // const releaseData = await db.query.releasesTable.findFirst({
  //   where: and(...conditions),
  //   with: {
  //     tracks: true,
  //     label: true,
  //   },
  // });

  const releaseData = await db.query.releasesTable.findFirst({
    where: and(...conditions),
    columns: {
      id: true,
      artwork: true,
      status: true,
      title: true,
      upc: true,
      releaseDate: true,
      primaryGenre: true,
      artists: true,
    },
    with: {
      label: {
        columns: {
          name: true,
        },
      },
      tracks: {
        columns: {
          id: true,
          title: true,
          isrc: true,
          duration: true,
        },
      },
    },
  });

  if (!releaseData) {
    return <div className="p-6 text-muted-foreground">Release not found</div>;
  }

  return (
    <div className="container mx-auto max-w-8xl p-6 space-y-8">
      {/* --- HERO SECTION --- */}
      <section className="flex flex-col md:flex-row gap-8 md:items-end border-b pb-8">
        <div className="relative aspect-square w-64 overflow-hidden shadow-2xl bg-muted">
          <Image
            src={resolveS3Url(releaseData.artwork) || "/next.svg"}
            alt="Cover Art"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <Badge
              variant="outline"
              className="mb-2 text-emerald-500 border-emerald-500/30 bg-emerald-500/5"
            >
              {releaseData.status}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight">
              {releaseData.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {releaseData.artists?.map((artist, idx) => (
                <span key={idx}>{artist.artistData.name + " "}</span>
              ))}
            </p>
          </div>

          <div className="flex gap-3">
            <Button className="gap-2">
              <PlayCircle size={18} /> Play Preview
            </Button>
            <Button variant="outline">Edit Metadata</Button>
          </div>
        </div>
      </section>

      {/* --- METADATA GRID --- */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "UPC", value: releaseData.upc, icon: Hash },
          {
            label: "Release Date",
            value: new Date(releaseData.releaseDate).toLocaleDateString(),
            icon: Calendar,
          },
          { label: "Label", value: releaseData.label.name, icon: Disc },
          { label: "Genre", value: releaseData.primaryGenre, icon: Globe },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-4 rounded-lg border bg-card/50"
          >
            <item.icon className="text-muted-foreground" size={20} />
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                {item.label}
              </p>
              <p className="text-sm font-medium">{item.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* --- TRACKLIST --- */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold px-1">Tracklist</h2>
        <div className="border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>ISRC</TableHead>
                <TableHead className="text-right">
                  <Clock3 size={16} className="inline mr-2" />
                  Duration
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {releaseData.tracks.map((track) => (
                <TableRow
                  key={track.id}
                  className="group cursor-pointer hover:bg-muted/30"
                >
                  <TableCell className="font-medium text-muted-foreground py-4">
                    {track.id}
                  </TableCell>
                  <TableCell className="font-semibold">{track.title}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground uppercase tracking-tighter">
                    {track.isrc}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {track.duration}s
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
