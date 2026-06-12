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
  TableRow 
} from "@/components/ui/table";
import { Calendar, Disc, Globe, Hash, PlayCircle, Clock3 } from "lucide-react";

// Mock Data Structure
const releaseData = {
  title: "Faded",
  artist: "Alan Walker, Iselin Solheim",
  upc: "886445722398",
  releaseDate: "Dec 3, 2015",
  genre: "Electronic / Progressive House",
  label: "MER Musikk",
  status: "Approved",
  tracks: [
    { id: 1, title: "Faded", duration: "3:32", isrc: "NOKTA1501010" },
    { id: 2, title: "Faded (Instrumental)", duration: "3:32", isrc: "NOKTA1501020" },
  ]
};

export default function ReleasePage() {
  return (
    <div className="container mx-auto max-w-8xl p-6 space-y-8">
      {/* --- HERO SECTION --- */}
      <section className="flex flex-col md:flex-row gap-8 md:items-end border-b pb-8">
        <div className="relative aspect-square w-64 overflow-hidden shadow-2xl bg-muted">
          <Image 
            src="/next.svg" 
            alt="Cover Art" 
            fill 
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <Badge variant="outline" className="mb-2 text-emerald-500 border-emerald-500/30 bg-emerald-500/5">
              {releaseData.status}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight">{releaseData.title}</h1>
            <p className="text-xl text-muted-foreground">{releaseData.artist}</p>
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
          { label: "Release Date", value: releaseData.releaseDate, icon: Calendar },
          { label: "Label", value: releaseData.label, icon: Disc },
          { label: "Genre", value: releaseData.genre, icon: Globe },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 p-4 rounded-lg border bg-card/50">
            <item.icon className="text-muted-foreground" size={20} />
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{item.label}</p>
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
                <TableHead className="text-right"><Clock3 size={16} className="inline mr-2" />Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {releaseData.tracks.map((track) => (
                <TableRow key={track.id} className="group cursor-pointer hover:bg-muted/30">
                  <TableCell className="font-medium text-muted-foreground py-4">{track.id}</TableCell>
                  <TableCell className="font-semibold">{track.title}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground uppercase tracking-tighter">
                    {track.isrc}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{track.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}