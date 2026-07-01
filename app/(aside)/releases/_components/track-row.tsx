import React, { useState } from "react";
import { MasterReleaseFormValues } from "../create/schema/masterReleaseSchema";
import {
  Controller,
  useFieldArray,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import FormSelect from "./form-select";
import {
  artistTypeOptions,
  explicitContentOptions,
  genres,
  languages,
  secondaryGenres,
  trackOriginOptions,
} from "../data/data";
import AsyncCmdbox from "./async-cmdbox";
import Cmdbox from "./cmdbox";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { TrackWriters } from "./track-writers";
import { useAsyncSearch } from "@/hooks/use-async-search";

interface SearchItem {
  id: number | string;
  name: string;
}

export default function TrackRow({
  field,
  index,
  formMethods,
  removeTrack,
  isMetadataComplete,
  setValue,
}: {
  field: any;
  index: number;
  formMethods: UseFormReturn<MasterReleaseFormValues>;
  removeTrack: (index: number) => void;
  isMetadataComplete: any;
  setValue: any;
}) {
  const {
    control,
    register,
    trigger,
    formState: { errors },
  } = formMethods;

  const [isOpen, setIsOpen] = useState(false);
  const trackData = useWatch({
    control,
    name: `tracks.${index}`,
  });

  const {
    fields: artistFields,
    append: appendArtist,
    remove: removeArtist,
  } = useFieldArray({
    control,
    name: `tracks.${index}.artists`,
  });

  const fileError =
    (errors.tracks as any)?.[index]?.customError?.message || field.customError;
  const trackErrors = (errors.tracks as any)?.[index];
  const isDone = isMetadataComplete(trackData || field) && !fileError;

  const artistSearch = useAsyncSearch<SearchItem>("/api/artists/search");

  const handleGenerateISRC = () => {
    const country = "QZ";
    const registrant = "LBX";
    const year = new Date().getFullYear().toString().slice(-2);

    const randomTrackId = Math.floor(10000 + Math.random() * 90000).toString();

    const generatedISRC = `${country}${registrant}${year}${randomTrackId}`;

    setValue(`tracks.${index}.isrc`, generatedISRC, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="flex flex-col space-y-1">
      <div
        className={cn(
          "flex items-center justify-between p-4 bg-background border border-border transition-all",
          fileError && "border-destructive/60 bg-destructive/5",
          isDone
            ? "border-emerald-500/50 bg-emerald-500/5"
            : "border-destructive/60 bg-destructive/5",
        )}
      >
        <div className="flex flex-col truncate max-w-[70%]">
          <span className="text-sm font-medium text-foreground truncate flex items-center gap-2">
            {trackData?.title || field.title}
            {isDone && (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" />
            )}
          </span>

          {/* MD5 and Duration */}
          <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
            MD5: {field.hash || "Pending..."} | Duration:{" "}
            {field.duration ? `${Math.round(field.duration)}s` : "Unknown"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant={isDone ? "secondary" : "outline"}
                size="icon"
                disabled={fileError}
                className="h-8 w-8 text-muted-foreground"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="!w-full md:!w-[80vw] lg:!w-[45vw] xl:!w-[40vw] !max-w-none h-screen flex flex-col justify-between p-6 overflow-y-auto bg-background border-l border-border shadow-2xl"
            >
              <div>
                <SheetHeader className="pb-4 border-b border-border">
                  <SheetTitle className="text-lg font-bold">
                    Track Details
                  </SheetTitle>
                  <p className="text-xs text-muted-foreground">
                    Fill track meta-data according to your requirements.
                  </p>
                </SheetHeader>

                <div className="space-y-4 pt-4 text-left">
                  <Field>
                    <FieldLabel>Track Title*</FieldLabel>
                    <Input
                      placeholder="e.g. Pure Tone"
                      {...register(`tracks.${index}.title` as const)}
                      className={
                        trackErrors?.title
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                    />
                    <FieldError>{trackErrors?.title?.message}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel>Track Version (Optional)</FieldLabel>
                    <Input
                      placeholder="e.g. Live, Remix"
                      {...register(`tracks.${index}.trackVersion` as const)}
                    />
                  </Field>

                  {/* Artists Array */}
                  <div className="border p-4 bg-muted/30 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">
                        Artists Management *
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          appendArtist({
                            artistType: "",
                            artistData: { id: "", name: "" },
                          })
                        }
                        className="h-8 gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Artist
                      </Button>
                    </div>

                    {artistFields.map((artistField, artistIndex) => (
                      <div
                        key={artistField.id}
                        className="grid grid-cols-6 md:grid-cols-12 gap-4 items-start border-b md:border-b-0 pb-4 md:pb-0"
                      >
                        <FormSelect
                          label="Artist Type *"
                          name={`tracks.${index}.artists.${artistIndex}.artistType`}
                          control={control}
                          options={artistTypeOptions}
                          placeholder="Select type"
                          className="col-span-5"
                        />

                        {/* Mobile Delete Button */}
                        <div className="col-span-1 pt-6 flex justify-end md:justify-center md:hidden">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={artistFields.length <= 1}
                            onClick={() => removeArtist(artistIndex)}
                            className="text-destructive hover:bg-destructive/10 h-9 w-9"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="col-span-6">
                          <AsyncCmdbox
                            label="Artist Name *"
                            name={`tracks.${index}.artists.${artistIndex}.artistData`}
                            control={control}
                            data={artistSearch.data}
                            placeholder="Search & select artist"
                            searchPlaceholder="Type artist name..."
                            emptyPlaceholder="No artist found."
                            onSearchChange={artistSearch.setSearchQuery}
                          />
                        </div>

                        {/* Desktop Delete Button */}
                        <div className="md:col-span-1 pt-6 md:flex justify-end md:justify-center hidden">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={artistFields.length <= 1}
                            onClick={() => removeArtist(artistIndex)}
                            className="text-destructive hover:bg-destructive/10 h-9 w-9"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Cmdbox
                      label="Primary Genre *"
                      name={`tracks.${index}.primaryGenre`}
                      control={control}
                      data={genres}
                      placeholder="Select primary genre"
                      searchPlaceholder="Search genre..."
                      emptyPlaceholder="No genre found."
                    />
                    <Cmdbox
                      label="Secondary Genre (Optional)"
                      name={`tracks.${index}.secondaryGenre`}
                      control={control}
                      data={secondaryGenres}
                      placeholder="Select secondary genre"
                      searchPlaceholder="Search genre..."
                      emptyPlaceholder="No genre found."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Field>
                      <FieldLabel className="flex items-center gap-2">
                        Track ISRC *
                        <button
                          type="button"
                          onClick={handleGenerateISRC}
                          className="text-xs text-primary font-medium hover:underline focus:outline-none"
                        >
                          ( Generate )
                        </button>
                      </FieldLabel>
                      <Input
                        placeholder="e.g. QZDIM2612345"
                        {...register(`tracks.${index}.isrc` as const)}
                        className={
                          trackErrors?.isrc
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }
                      />
                      <FieldError>{trackErrors?.isrc?.message}</FieldError>
                    </Field>

                    <Field>
                      <FieldLabel>Preview Clip Start Time</FieldLabel>
                      <Input
                        placeholder="e.g. 00:00"
                        {...register(`tracks.${index}.previewStart` as const)}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormSelect
                      label="Track Origin *"
                      name={`tracks.${index}.trackOrigin`}
                      control={control}
                      options={trackOriginOptions}
                      placeholder="Select track origin type"
                    />

                    <FormSelect
                      label="Explicit Content *"
                      name={`tracks.${index}.explicitContent`}
                      control={control}
                      options={explicitContentOptions}
                      placeholder="Select explicit content type"
                    />
                  </div>

                  <Cmdbox
                    label="Track Language *"
                    name={`tracks.${index}.trackLanguage`}
                    control={control}
                    data={languages}
                    placeholder="Select a language"
                    searchPlaceholder="Search language..."
                    emptyPlaceholder="No language found."
                  />

                  <div className="flex items-center justify-between border border-border p-4 bg-accent/10 mt-2">
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        Instrumental Track
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Is this track without any vocals?
                      </p>
                    </div>
                    <Controller
                      control={control}
                      name={`tracks.${index}.isInstrumental`}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-4 w-4 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                      )}
                    />
                  </div>

                  <TrackWriters
                    control={control}
                    trackIndex={index}
                    errors={errors}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto"
                  onClick={async () => {
                    const isSingleTrackValid = await trigger(`tracks.${index}`);
                    if (isSingleTrackValid) setIsOpen(false);
                  }}
                >
                  Save Track
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="h-8 w-8"
            onClick={() => removeTrack(index)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {fileError && (
        <p className="text-xs text-destructive font-medium pl-1 mt-0.5">
          {fileError}
        </p>
      )}
    </div>
  );
}
