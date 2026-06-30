"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Play, Pause, Clock3, Music } from "lucide-react";
import { useRef, useState } from "react";
import { resolveS3Url } from "@/lib/s3-client";

export default function TrackList({ releaseData }) {
  const [currentTrack, setCurrentTrack] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);
  const onEnded = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  const handlePlayPause = (track: any) => {
    if (!audioRef.current) return;

    const audioUrl = resolveS3Url(track.audioFile);

    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((err) => console.log("Playback error:", err));
      }
    } else {
      setCurrentTrack(track);
      audioRef.current.src = audioUrl;
      audioRef.current
        .play()
        .catch((err) => console.log("Playback error:", err));
      setIsPlaying(true);
    }
  };

  return (
    <section className="space-y-4 pb-28">
      <h2 className="text-2xl font-semibold px-1">Tracklist</h2>

      <div className="border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[60px] text-center">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>ISRC</TableHead>
              <TableHead className="text-right">
                <Clock3 size={16} className="inline mr-2" />
                Duration
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {releaseData?.tracks?.map((track, idx) => {
              const isThisTrackPlaying =
                currentTrack?.id === track.id && isPlaying;

              return (
                <TableRow key={track.id} className="group hover:bg-muted/30">
                  <TableCell className="font-medium text-muted-foreground py-4 text-center w-[60px]">
                    {isThisTrackPlaying ? (
                      <button
                        onClick={() => handlePlayPause(track)}
                        className="cursor-pointer text-emerald-500 flex justify-center w-full"
                      >
                        <Pause size={16} fill="currentColor" />
                      </button>
                    ) : (
                      <div className="flex justify-center w-full">
                        <span
                          className={`block group-hover:hidden ${currentTrack?.id === track.id ? "text-emerald-500 font-bold" : ""}`}
                        >
                          {idx + 1}
                        </span>
                        <button
                          onClick={() => handlePlayPause(track)}
                          className="hidden group-hover:block cursor-pointer text-foreground hover:text-emerald-500"
                        >
                          <Play size={16} fill="currentColor" />
                        </button>
                      </div>
                    )}
                  </TableCell>

                  <TableCell
                    className={`font-semibold ${currentTrack?.id === track.id ? "text-emerald-500" : ""}`}
                  >
                    {track.title}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground uppercase tracking-tighter">
                    {track.isrc}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {track.duration}s
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-md p-4 shadow-xl z-50 transition-all duration-300 ${
          currentTrack
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-1/4">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-md">
              <Music size={20} className={isPlaying ? "animate-pulse" : ""} />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium truncate text-foreground">
                {currentTrack?.title || "No track selected"}
              </p>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                {currentTrack?.isrc || ""}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex-1 flex justify-end">
            <audio
              ref={audioRef}
              controls
              onPlay={onPlay}
              onPause={onPause}
              onEnded={onEnded}
              className="w-full max-w-2xl h-10 accent-emerald-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
