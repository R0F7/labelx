"use client";

import * as React from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MasterReleaseFormValues } from "../schema/masterReleaseSchema";
import { parseBlob } from "music-metadata-browser";
import SparkMD5 from "spark-md5";
import TrackRow from "../../_components/track-row";

const isMetadataComplete = (track: any) => {
  const hasComposer = track?.writers?.some((w: any) => w.role === "Composer");
  const hasLyricist = track?.writers?.some((w: any) => w.role === "Lyricist");

  return (
    track &&
    track.title &&
    track?.artists?.every((a: any) => a.artistType && a.artistData?.id) &&
    track.primaryGenre &&
    track.isrc &&
    track.trackOrigin &&
    track.explicitContent &&
    track.trackLanguage &&
    hasComposer &&
    hasLyricist &&
    track?.writers?.every((a: any) => a.role && a.name)
  );
};

interface UploadTracksProps {
  formMethods: UseFormReturn<MasterReleaseFormValues>;
}

export default function UploadTracks({ formMethods }: UploadTracksProps) {
  const {
    control,
    formState: { errors },
    setValue,
    trigger,
  } = formMethods;

  const [isProcessing, setIsProcessing] = React.useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tracks",
  });

  const processAndValidateAudio = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".wav"))
      throw new Error("Format: WAV only");
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);
    if (view.byteLength < 44) throw new Error("Invalid WAV file (Too small)");

    const riff = String.fromCharCode(
      view.getUint8(0),
      view.getUint8(1),
      view.getUint8(2),
      view.getUint8(3),
    );
    const wave = String.fromCharCode(
      view.getUint8(8),
      view.getUint8(9),
      view.getUint8(10),
      view.getUint8(11),
    );
    if (riff !== "RIFF" || wave !== "WAVE")
      throw new Error("Invalid WAV file structure");

    const metadata = await parseBlob(file);
    const sampleRate = metadata.format.sampleRate;
    const bitDepth = metadata.format.bitsPerSample;
    const duration = metadata.format.duration;

    if (!sampleRate || sampleRate < 44100)
      throw new Error(
        `Sample rate ${sampleRate || 0}Hz detected. Min 44.1kHz required.`,
      );
    if (sampleRate > 192000)
      throw new Error(`Sample rate ${sampleRate}Hz exceeds 192kHz limit.`);
    if (![16, 24].includes(bitDepth ?? 0))
      throw new Error(
        `${bitDepth}-bit audio detected. Only 16/24-bit WAV accepted.`,
      );

    const audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    try {
      await audioContext.decodeAudioData(buffer.slice(0));
    } catch {
      throw new Error("Corrupted audio file");
    } finally {
      audioContext.close();
    }

    const hash = SparkMD5.ArrayBuffer.hash(buffer);
    return { hash, duration };
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    const currentLength = fields.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const targetIndex = currentLength + i;
      try {
        const { hash, duration } = await processAndValidateAudio(file);
        append({
          file,
          title: file.name.replace(".wav", ""),
          hash,
          duration,
          artists: [{ artistType: "", artistData: { id: "", name: "" } }],
          primaryGenre: "",
          isrc: "",
          previewStart: "",
          trackOrigin: "",
          explicitContent: "",
          trackLanguage: "",
          isInstrumental: true,
          writers: [],
        });
      } catch (err: any) {
        append({
          file,
          title: file.name,
          customError: err.message || "Invalid Audio",
        });
        setTimeout(
          () =>
            setValue(`tracks.${targetIndex}.customError`, err.message, {
              shouldValidate: true,
            }),
          50,
        );
      }
    }
    setTimeout(() => trigger("tracks"), 100);
    setIsProcessing(false);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold tracking-tight">Upload Tracks</h3>
        <p className="text-xs text-muted-foreground mt-1">
          <strong> Audio specs:</strong> 16-bit or 24-bit WAV only (32-bit not
          accepted), sample rate 44.1kHz–192kHz.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Fill up track metadata after uploading by clicking the edit icon.
        </p>
      </div>

      <label
        className={cn(
          "border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors space-y-2",
          isProcessing && "opacity-60 pointer-events-none",
        )}
      >
        {isProcessing ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          <Upload className="h-6 w-6 text-muted-foreground" />
        )}
        <span className="text-sm font-medium text-muted-foreground">
          {isProcessing
            ? "Verifying WAV Architecture..."
            : "Upload WAV (16/24-bit)"}
        </span>
        <input
          type="file"
          accept=".wav"
          multiple
          className="hidden"
          disabled={isProcessing}
          onChange={handleFileChange}
        />
      </label>

      {errors.tracks?.root?.message && (
        <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {errors.tracks.root.message}
        </p>
      )}

      {fields.length > 0 && (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <TrackRow
              key={field.id}
              field={field}
              index={index}
              formMethods={formMethods}
              removeTrack={remove}
              isMetadataComplete={isMetadataComplete}
              setValue={setValue}
            />
          ))}
        </div>
      )}
    </div>
  );
}
