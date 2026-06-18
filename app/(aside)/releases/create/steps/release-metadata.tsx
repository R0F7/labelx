"use client";

import { useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import {
  CalendarIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MetadataFormValues } from "../schemas/metadata";
import { genres, languages, secondaryGenres } from "../../data/data";
import Cmdbox from "../../_components/cmdbox";
import AsyncCmdbox from "../../_components/async-cmdbox";

interface ReleaseMetadataProps {
  formMethods: UseFormReturn<MetadataFormValues>;
}

export default function ReleaseMetadata({ formMethods }: ReleaseMetadataProps) {
  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "artists",
  });

  const [openLang, setOpenLang] = useState(false);
  const [openPrimaryGenre, setOpenPrimaryGenre] = useState(false);
  const [openSecondaryGenre, setOpenSecondaryGenre] = useState(false);
  const [openArtistCombobox, setOpenArtistCombobox] = useState<{
    [key: number]: boolean;
  }>({});
  const [openLabel, setOpenLabel] = useState(false);
  const [artists, setArtists] = useState<{ id: number; name: string }[]>([]);
  const [labels, setLabel] = useState<{ id: number; name: string }[]>([]);

  const metadataLanguage = watch("metadataLanguage");
  const releaseType = watch("releaseType");
  const primaryGenre = watch("primaryGenre");
  const secondaryGenre = watch("secondaryGenre");
  const originalReleaseDate = watch("originalReleaseDate");
  const releaseDate = watch("releaseDate");
  const watchedArtists = watch("artists");
  const labelId = watch("labelId");

  const searchArtists = async (search: string) => {
    const res = await fetch(`/api/artists/search?query=${search}`);
    const data = await res.json();
    setArtists(data.data);
  };

  const searchLabels = async (search: string) => {
    const res = await fetch(`/api/labels/search?query=${search}`);
    const data = await res.json();
    setLabel(data.data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Release Metadata
        </h2>
        <p className="text-sm text-muted-foreground">
          Provide the essential metadata for your music release.
        </p>
      </div>

      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0">
        {/* Release Title */}
        <Field>
          <FieldLabel>Release Title *</FieldLabel>
          <Input
            placeholder="e.g. Moonlight Memories"
            {...register("releaseTitle")}
          />
          <FieldError>{errors.releaseTitle?.message}</FieldError>
        </Field>

        {/* Title Version */}
        <Field>
          <FieldLabel>Title Version (Optional)</FieldLabel>
          <Input
            placeholder="e.g. Remix, Acoustic, Live"
            {...register("titleVersion")}
          />
          <FieldError>{errors.titleVersion?.message}</FieldError>
        </Field>

        {/* Metadata Language */}
        <Cmdbox
          name={"Metadata Language *"}
          open={openLang}
          setOpen={setOpenLang}
          watcher={metadataLanguage}
          data={languages}
          placeholder={"Select a language"}
          searchPlaceholder={"Search language..."}
          emptyPlaceholder={"No language found."}
          setValue={setValue}
          setValueName={"metadataLanguage"}
          errors={errors}
        />

        {/* Release Type */}
        <Field>
          <FieldLabel>Release Type *</FieldLabel>
          <Select
            value={releaseType}
            onValueChange={(value) =>
              setValue("releaseType", value, { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select release type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="ep">EP</SelectItem>
              <SelectItem value="album">Album</SelectItem>
            </SelectContent>
          </Select>
          <FieldError>{errors.releaseType?.message}</FieldError>
        </Field>
      </FieldGroup>

      {/* artist */}
      <div className="border rounded-lg p-4 bg-muted/30 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Artists Management *</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ artistType: "", artistId: "" })}
            className="h-8 gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> Add Artist
          </Button>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start border-b md:border-b-0 pb-4 md:pb-0"
          >
            <Field className="md:col-span-5">
              <FieldLabel className="text-xs">Artist Type *</FieldLabel>
              <Select
                value={watchedArtists?.[index]?.artistType || ""}
                onValueChange={(value) =>
                  setValue(`artists.${index}.artistType`, value, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary Artist</SelectItem>
                  <SelectItem value="secondary">Secondary Artist</SelectItem>
                  <SelectItem value="producer">Producer</SelectItem>
                  <SelectItem value="remixer">Remixer</SelectItem>
                </SelectContent>
              </Select>
              <FieldError>
                {errors.artists?.[index]?.artistType?.message}
              </FieldError>
            </Field>

            <div className="col-span-6">
              <AsyncCmdbox
                label="Artist Name *"
                open={openArtistCombobox[index] || false}
                setOpen={(isOpen) =>
                  setOpenArtistCombobox((prev) => ({
                    ...prev,
                    [index]: isOpen,
                  }))
                }
                watcher={watchedArtists?.[index]?.artistId}
                data={artists}
                placeholder="Search & select artist"
                searchPlaceholder="Type artist name..."
                emptyPlaceholder="No artist found."
                onSearchChange={searchArtists}
                setValue={setValue}
                setValueName={`artists.${index}.artistId`}
                errors={errors}
              />
            </div>

            <div className="md:col-span-1 pt-6 flex justify-end md:justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={fields.length === 1}
                onClick={() => remove(index)}
                className="text-destructive hover:bg-destructive/10 h-9 w-9"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {errors.artists?.root && (
          <p className="text-xs text-destructive">
            {errors.artists.root.message}
          </p>
        )}
      </div>

      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0">
        {/* Primary Genre */}
        <Cmdbox
          name="Primary Genre *"
          open={openPrimaryGenre}
          setOpen={setOpenPrimaryGenre}
          watcher={primaryGenre}
          data={genres}
          placeholder={"Select primary genre"}
          searchPlaceholder="Search genre..."
          emptyPlaceholder="No genre found."
          setValue={setValue}
          setValueName="primaryGenre"
          errors={errors}
        />

        {/* Secondary Genre */}
        <Cmdbox
          name="Secondary Genre (Optional)"
          open={openSecondaryGenre}
          setOpen={setOpenSecondaryGenre}
          watcher={secondaryGenre}
          data={secondaryGenres}
          placeholder="Select secondary genre"
          searchPlaceholder="Search genre..."
          emptyPlaceholder="No genre found."
          setValue={setValue}
          setValueName="secondaryGenre"
          errors={errors}
        />

        {/* Label ID */}
        <AsyncCmdbox
          label="Label *"
          open={openLabel}
          setOpen={setOpenLabel}
          watcher={labelId}
          data={labels}
          placeholder="Select a label"
          searchPlaceholder="Search label..."
          emptyPlaceholder="No label found."
          onSearchChange={searchLabels}
          setValue={setValue}
          setValueName="labelId"
          errors={errors}
        />

        {/* UPC */}
        <Field>
          <FieldLabel>UPC / EAN (Optional)</FieldLabel>
          <Input
            placeholder="Leave blank to auto-generate"
            {...register("upc")}
          />
          <FieldError>{errors.upc?.message}</FieldError>
        </Field>

        {/* Original Release Date */}
        <Field className="flex flex-col justify-end">
          <FieldLabel>Original Release Date *</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !originalReleaseDate && "text-muted-foreground",
                )}
              >
                {originalReleaseDate ? (
                  format(new Date(originalReleaseDate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  originalReleaseDate
                    ? new Date(originalReleaseDate)
                    : undefined
                }
                onSelect={(date) =>
                  setValue(
                    "originalReleaseDate",
                    date ? date.toISOString() : "",
                    { shouldValidate: true },
                  )
                }
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FieldError>{errors.originalReleaseDate?.message}</FieldError>
        </Field>

        {/* Digital Release Date */}
        <Field className="flex flex-col justify-end">
          <FieldLabel>Digital Release Date *</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !releaseDate && "text-muted-foreground",
                )}
              >
                {releaseDate ? (
                  format(new Date(releaseDate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={releaseDate ? new Date(releaseDate) : undefined}
                onSelect={(date) =>
                  setValue("releaseDate", date ? date.toISOString() : "", {
                    shouldValidate: true,
                  })
                }
                disabled={(date) => date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FieldError>{errors.releaseDate?.message}</FieldError>
        </Field>
      </FieldGroup>
    </div>
  );
}
