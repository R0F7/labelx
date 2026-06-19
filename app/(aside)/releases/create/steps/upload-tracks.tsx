// "use client";

// import * as React from "react";
// import { useFieldArray, UseFormReturn } from "react-hook-form";
// import {
//   Upload,
//   Pencil,
//   Trash2,
//   Loader2,
//   CheckCircle2,
//   AlertCircle,
//   X,
//   Plus,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { Input } from "@/components/ui/input";
// import { MasterReleaseFormValues } from "../schemas/masterReleaseSchema";
// import { parseBlob } from "music-metadata-browser";
// import SparkMD5 from "spark-md5";
// import { Field, FieldError, FieldLabel } from "@/components/ui/field";
// import Cmdbox from "../../_components/cmdbox";
// import {
//   artistTypeOptions,
//   explicitContentOptions,
//   genres,
//   languages,
//   secondaryGenres,
//   trackOriginOptions,
// } from "../../data/data";
// import FormSelect from "../../_components/form-select";
// import AsyncCmdbox from "../../_components/async-cmdbox";

// interface UploadTracksProps {
//   formMethods: UseFormReturn<MasterReleaseFormValues>;
// }

// export default function UploadTracks({ formMethods }: UploadTracksProps) {
//   const {
//     control,
//     formState: { errors },
//     register,
//     setValue,
//     trigger,
//     watch,
//   } = formMethods;
//   const [isProcessing, setIsProcessing] = React.useState(false);
//   const [openSheetIndex, setOpenSheetIndex] = React.useState<number | null>(
//     null,
//   );
//   const [artists, setArtists] = React.useState<{ id: number; name: string }[]>(
//     [],
//   );

//   const { fields, append, remove } = useFieldArray({ control, name: "tracks" });
//   const watchedTracks = watch("tracks") || [];

//   const processAndValidateAudio = async (file: File) => {
//     if (!file.name.toLowerCase().endsWith(".wav"))
//       throw new Error("Format: WAV only");
//     const buffer = await file.arrayBuffer();
//     const view = new DataView(buffer);
//     if (view.byteLength < 44) throw new Error("Invalid WAV file (Too small)");

//     const riff = String.fromCharCode(
//       view.getUint8(0),
//       view.getUint8(1),
//       view.getUint8(2),
//       view.getUint8(3),
//     );
//     const wave = String.fromCharCode(
//       view.getUint8(8),
//       view.getUint8(9),
//       view.getUint8(10),
//       view.getUint8(11),
//     );
//     if (riff !== "RIFF" || wave !== "WAVE")
//       throw new Error("Invalid WAV file structure");

//     const metadata = await parseBlob(file);
//     const sampleRate = metadata.format.sampleRate;
//     const bitDepth = metadata.format.bitsPerSample;
//     const duration = metadata.format.duration;

//     if (!sampleRate || sampleRate < 44100)
//       throw new Error(
//         `Sample rate ${sampleRate || 0}Hz detected. Min 44.1kHz required.`,
//       );
//     if (sampleRate > 192000)
//       throw new Error(`Sample rate ${sampleRate}Hz exceeds 192kHz limit.`);
//     if (![16, 24].includes(bitDepth ?? 0))
//       throw new Error(
//         `${bitDepth}-bit audio detected. Only 16/24-bit WAV accepted.`,
//       );

//     const audioContext = new (
//       window.AudioContext || (window as any).webkitAudioContext
//     )();
//     try {
//       await audioContext.decodeAudioData(buffer.slice(0));
//     } catch {
//       throw new Error("Corrupted audio file");
//     } finally {
//       audioContext.close();
//     }

//     const hash = SparkMD5.ArrayBuffer.hash(buffer);
//     return { hash, duration };
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;
//     setIsProcessing(true);
//     const currentLength = fields.length;

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const targetIndex = currentLength + i;
//       try {
//         const { hash, duration } = await processAndValidateAudio(file);
//         append({
//           file,
//           title: file.name.replace(".wav", ""),
//           hash,
//           duration,
//           artists: [{ artistType: "", artistData: { id: "", name: "" } }],
//           primaryGenre: "",
//           isrc: "",
//           previewStart: "",
//           trackOrigin: "",
//           explicitContent: "",
//           trackLanguage: "",
//           isInstrumental: false,
//         });
//       } catch (err: any) {
//         append({
//           file,
//           title: file.name,
//           customError: err.message || "Invalid Audio",
//         });
//         setTimeout(
//           () =>
//             setValue(`tracks.${targetIndex}.customError`, err.message, {
//               shouldValidate: true,
//             }),
//           50,
//         );
//       }
//     }
//     setTimeout(() => trigger("tracks"), 100);
//     setIsProcessing(false);
//     e.target.value = "";
//   };

//   const isMetadataComplete = (track: any) => {
//     return (
//       track &&
//       track.title &&
//       track?.artists?.every((a: any) => a.artistType && a.artistData?.id) &&
//       track.primaryGenre &&
//       track.previewStart &&
//       track.trackOrigin &&
//       track.explicitContent &&
//       track.trackLanguage
//     );
//   };

//   const appendTrackArtist = (trackIndex: number, value: any) => {
//     const current = formMethods.getValues(`tracks.${trackIndex}.artists`) || [];
//     formMethods.setValue(`tracks.${trackIndex}.artists`, [...current, value]);
//   };

//   const searchArtists = async (search: string) => {
//     const res = await fetch(`/api/artists/search?query=${search}`);
//     const data = await res.json();
//     setArtists(data.data);
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-medium text-foreground">Upload Tracks</h3>
//         <p className="text-xs text-muted-foreground mt-1">
//           Fill up track metadata after uploading by clicking the edit icon.
//         </p>
//       </div>

//       <label
//         className={cn(
//           "border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors space-y-2",
//           isProcessing && "opacity-60 pointer-events-none",
//         )}
//       >
//         {isProcessing ? (
//           <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
//         ) : (
//           <Upload className="h-6 w-6 text-muted-foreground" />
//         )}
//         <span className="text-sm font-medium text-muted-foreground">
//           {isProcessing
//             ? "Verifying WAV Architecture..."
//             : "Upload WAV (16/24-bit)"}
//         </span>
//         <input
//           type="file"
//           accept=".wav"
//           multiple
//           className="hidden"
//           disabled={isProcessing}
//           onChange={handleFileChange}
//         />
//       </label>

//       {errors.tracks?.root?.message && (
//         <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg flex items-center gap-2">
//           <AlertCircle className="h-4 w-4" /> {errors.tracks.root.message}
//         </p>
//       )}

//       {fields.length > 0 && (
//         <div className="space-y-3">
//           {fields.map((field, index) => {
//             const fileError =
//               errors.tracks?.[index]?.customError?.message ||
//               (field as any).customError;
//             const currentTrackData = watchedTracks[index];
//             const isDone = isMetadataComplete(currentTrackData) && !fileError;
//             const trackErrors = errors.tracks?.[index];

//             return (
//               <div key={field.id} className="flex flex-col space-y-1">
//                 <div
//                   className={cn(
//                     "flex items-center justify-between p-4 bg-background border border-border rounded-xl transition-all",
//                     fileError && "border-destructive/60 bg-destructive/5",
//                     isDone && "border-emerald-500/50 bg-emerald-500/5",
//                   )}
//                 >
//                   <div className="flex flex-col truncate max-w-[70%]">
//                     <span className="text-sm font-medium text-foreground truncate flex items-center gap-2">
//                       {currentTrackData?.title || field.title}
//                       {isDone && (
//                         <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" />
//                       )}
//                     </span>
//                     <span className="text-[10px] text-muted-foreground font-mono">
//                       {isDone
//                         ? "Metadata Filled"
//                         : "⚠️ Metadata Pending / Incomplete"}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <Sheet
//                       open={openSheetIndex === index}
//                       onOpenChange={(open) =>
//                         setOpenSheetIndex(open ? index : null)
//                       }
//                     >
//                       <SheetTrigger asChild>
//                         <Button
//                           type="button"
//                           variant={isDone ? "secondary" : "outline"}
//                           size="icon"
//                           className="h-8 w-8 text-muted-foreground"
//                         >
//                           <Pencil className="h-3.5 w-3.5" />
//                         </Button>
//                       </SheetTrigger>

//                       <SheetContent
//                         side="right"
//                         className="!w-full md:!w-[80vw] lg:!w-[45vw] xl:!w-[40vw] !max-w-none h-screen flex flex-col justify-between p-6 overflow-y-auto bg-background border-l border-border shadow-2xl"
//                       >
//                         <div>
//                           <SheetHeader className="pb-4 border-b border-border">
//                             <SheetTitle className="text-lg font-bold">
//                               Track Details
//                             </SheetTitle>
//                             <p className="text-xs text-muted-foreground">
//                               Fill track meta-data according to Screenshot
//                               2026-06-19 214956.png
//                             </p>
//                           </SheetHeader>

//                           <div className="space-y-4 pt-4 text-left">
//                             <Field>
//                               <FieldLabel>Track Title*</FieldLabel>
//                               <Input
//                                 placeholder="e.g. Pure Tone"
//                                 {...register(`tracks.${index}.title`)}
//                               />
//                               <FieldError>
//                                 {trackErrors?.title?.message}
//                               </FieldError>
//                             </Field>

//                             <Field>
//                               <FieldLabel>Track Version (Optional)</FieldLabel>
//                               <Input
//                                 placeholder="e.g. Live, Remix"
//                                 {...register(`tracks.${index}.trackVersion`)}
//                               />
//                             </Field>

//                             {/* artist */}
//                             <div className="border rounded-lg p-4 bg-muted/30 space-y-4">
//                               <div className="flex justify-between items-center">
//                                 <h3 className="text-sm font-medium">
//                                   Artists Management *
//                                 </h3>

//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() =>
//                                     appendTrackArtist(index, {
//                                       artistType: "",
//                                       artistData: { id: "", name: "" },
//                                     })
//                                   }
//                                   className="h-8 gap-1"
//                                 >
//                                   <Plus className="h-3.5 w-3.5" /> Add Artist
//                                 </Button>
//                               </div>

//                               {watchedTracks?.[index]?.artists?.map(
//                                 (artist: any, artistIndex: number) => (
//                                   <div
//                                     key={artistIndex}
//                                     className="grid grid-cols-6 md:grid-cols-12 gap-4 items-start border-b md:border-b-0 pb-4 md:pb-0"
//                                   >
//                                     <FormSelect
//                                       label="Artist Type *"
//                                       name={`tracks.${index}.artists.${artistIndex}.artistType`}
//                                       control={control}
//                                       options={artistTypeOptions}
//                                       placeholder="Select type"
//                                       className="col-span-5"
//                                     />
//                                     <div className="col-span-1 pt-6 flex justify-end md:justify-center md:hidden">
//                                       <Button
//                                         type="button"
//                                         variant="ghost"
//                                         size="icon"
//                                         // disabled={fields.length === 1}
//                                         onClick={() => {
//                                           const current = formMethods.getValues(
//                                             `tracks.${index}.artists`,
//                                           );

//                                           formMethods.setValue(
//                                             `tracks.${index}.artists`,
//                                             current.filter(
//                                               (_, i) => i !== artistIndex,
//                                             ),
//                                           );
//                                         }}
//                                       >
//                                         <Trash2 className="h-4 w-4" />
//                                       </Button>
//                                     </div>

//                                     <div className="col-span-6">
//                                       <AsyncCmdbox
//                                         label="Artist Name *"
//                                         name={`tracks.${index}.artists.${artistIndex}.artistData`}
//                                         control={control}
//                                         data={artists}
//                                         placeholder="Search & select artist"
//                                         searchPlaceholder="Type artist name..."
//                                         emptyPlaceholder="No artist found."
//                                         onSearchChange={searchArtists}
//                                       />
//                                     </div>

//                                     <div className="md:col-span-1 pt-6 md:flex justify-end md:justify-center hidden">
//                                       <Button
//                                         type="button"
//                                         variant="ghost"
//                                         size="icon"
//                                         // disabled={fields.length === 1}
//                                         onClick={() => {
//                                           const current = formMethods.getValues(
//                                             `tracks.${index}.artists`,
//                                           );

//                                           formMethods.setValue(
//                                             `tracks.${index}.artists`,
//                                             current.filter(
//                                               (_, i) => i !== artistIndex,
//                                             ),
//                                           );
//                                         }}
//                                       >
//                                         <Trash2 className="h-4 w-4" />
//                                       </Button>
//                                     </div>
//                                   </div>
//                                 ),
//                               )}
//                             </div>

//                             <div className="grid grid-cols-2 gap-3">
//                               {/* Primary Genre */}
//                               <Cmdbox
//                                 label="Primary Genre *"
//                                 name={`tracks.${index}.primaryGenre`}
//                                 control={control}
//                                 data={genres}
//                                 placeholder="Select primary genre"
//                                 searchPlaceholder="Search genre..."
//                                 emptyPlaceholder="No genre found."
//                               />

//                               {/* Secondary Genre */}
//                               <Cmdbox
//                                 label="Secondary Genre (Optional)"
//                                 name={`tracks.${index}.secondaryGenre`}
//                                 control={control}
//                                 data={secondaryGenres}
//                                 placeholder="Select secondary genre"
//                                 searchPlaceholder="Search genre..."
//                                 emptyPlaceholder="No genre found."
//                               />
//                             </div>

//                             <div className="grid grid-cols-2 gap-3">
//                               {/* Track ISRC */}
//                               <Field>
//                                 <FieldLabel>Track ISRC *</FieldLabel>
//                                 <Input
//                                   placeholder="e.g. 444444444"
//                                   {...register(`tracks.${index}.isrc`)}
//                                 />
//                                 <FieldError>
//                                   {trackErrors?.isrc?.message}
//                                 </FieldError>
//                               </Field>

//                               {/* Preview Clip Start Time */}
//                               <Field>
//                                 <FieldLabel>Preview Clip Start Time</FieldLabel>
//                                 <Input
//                                   placeholder="e.g. 00:00"
//                                   {...register(`tracks.${index}.previewStart`)}
//                                 />
//                                 <FieldError>
//                                   {trackErrors?.previewStart?.message}
//                                 </FieldError>
//                               </Field>
//                             </div>

//                             <div className="grid grid-cols-2 gap-3">
//                               {/* Track Origin */}
//                               <FormSelect
//                                 label="Track Origin *"
//                                 name={`tracks.${index}.trackOrigin`}
//                                 control={control}
//                                 options={trackOriginOptions}
//                                 placeholder="Select track origin type"
//                               />

//                               {/* Explicit Content */}
//                               <FormSelect
//                                 label="Explicit Content *"
//                                 name={`tracks.${index}.explicitContent`}
//                                 control={control}
//                                 options={explicitContentOptions}
//                                 placeholder="Select explicit content type"
//                               />
//                             </div>

//                             {/* Track Language */}
//                             <Cmdbox
//                               label="Track Language *"
//                               name={`tracks.${index}.trackLanguage`}
//                               control={control}
//                               data={languages}
//                               placeholder="Select a language"
//                               searchPlaceholder="Search language..."
//                               emptyPlaceholder="No language found."
//                             />

//                             <div className="flex items-center justify-between border border-border rounded-xl p-4 bg-accent/10 mt-2">
//                               <div>
//                                 <p className="text-xs font-semibold text-foreground">
//                                   Instrumental Track
//                                 </p>
//                                 <p className="text-[10px] text-muted-foreground">
//                                   Is this track without any vocals?
//                                 </p>
//                               </div>
//                               <input
//                                 type="checkbox"
//                                 {...register(`tracks.${index}.isInstrumental`)}
//                                 className="h-4 w-4 accent-emerald-500 rounded"
//                               />
//                             </div>
//                           </div>
//                         </div>

//                         <div className="flex justify-end gap-2 pt-4 border-t border-border mt-6">
//                           <Button
//                             type="button"
//                             variant="outline"
//                             className="w-full sm:w-auto"
//                             onClick={() => setOpenSheetIndex(null)}
//                           >
//                             Cancel
//                           </Button>
//                           <Button
//                             type="button"
//                             className="bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto"
//                             onClick={async () => {
//                               const isSingleTrackValid = await trigger(
//                                 `tracks.${index}`,
//                               );
//                               if (isSingleTrackValid) setOpenSheetIndex(null);
//                             }}
//                           >
//                             Save Track
//                           </Button>
//                         </div>
//                       </SheetContent>
//                     </Sheet>

//                     <Button
//                       type="button"
//                       variant="destructive"
//                       size="icon"
//                       className="h-8 w-8"
//                       onClick={() => remove(index)}
//                     >
//                       <Trash2 className="h-3.5 w-3.5" />
//                     </Button>
//                   </div>
//                 </div>

//                 {fileError && (
//                   <p className="text-xs text-destructive font-medium pl-1 mt-0.5">
//                     {fileError}
//                   </p>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import * as React from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MasterReleaseFormValues } from "../schemas/masterReleaseSchema";
import { parseBlob } from "music-metadata-browser";
import SparkMD5 from "spark-md5";
import TrackRow from "../../_components/track-row";

const isMetadataComplete = (track: any) => {
  return (
    track &&
    track.title &&
    track?.artists?.every((a: any) => a.artistType && a.artistData?.id) &&
    track.primaryGenre &&
    track.previewStart &&
    track.trackOrigin &&
    track.explicitContent &&
    track.trackLanguage
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
          isInstrumental: false,
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
         <strong> Audio specs:</strong> 16-bit or 24-bit WAV only (32-bit not accepted), sample rate 44.1kHz–192kHz.
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
