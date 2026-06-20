"use client";

import { useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  artistTypeOptions,
  genres,
  languages,
  releaseTypeOptions,
  secondaryGenres,
} from "../../data/data";
import Cmdbox from "../../_components/cmdbox";
import AsyncCmdbox from "../../_components/async-cmdbox";
import FormDatePicker from "../../_components/form-date-picker";
import { Plus, Trash2 } from "lucide-react";
import FormSelect from "../../_components/form-select";
import { MasterReleaseFormValues } from "../schemas/masterReleaseSchema";

interface ReleaseMetadataProps {
  formMethods: UseFormReturn<MasterReleaseFormValues>;
}

export default function ReleaseMetadata({ formMethods }: ReleaseMetadataProps) {
  const {
    register,
    control,
    formState: { errors },
  } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "artists",
  });
  const [artists, setArtists] = useState<{ id: number; name: string }[]>([]);
  const [labels, setLabel] = useState<{ id: number; name: string }[]>([]);

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
        <p className="text-xs text-muted-foreground">
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
            className={errors.releaseTitle ? "border-destructive focus-visible:ring-destructive" : ""}
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
          label="Metadata Language *"
          name="metadataLanguage"
          control={control}
          data={languages}
          placeholder="Select a language"
          searchPlaceholder="Search language..."
          emptyPlaceholder="No language found."
        />

        {/* Release Type */}
        <FormSelect
          label="Release Type *"
          name="releaseType"
          control={control}
          options={releaseTypeOptions}
          placeholder="Select release type"
        />
      </FieldGroup>

      {/* artist */}
      <div className="border rounded-lg p-4 bg-muted/30 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Artists Management *</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ artistType: "", artistData: { id: "", name: "" } })
            }
            className="h-8 gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> Add Artist
          </Button>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-6 md:grid-cols-12 gap-4 items-start border-b md:border-b-0 pb-4 md:pb-0"
          >
            <FormSelect
              label="Artist Type *"
              name={`artists.${index}.artistType`}
              control={control}
              options={artistTypeOptions}
              placeholder="Select type"
              className="col-span-5"
            />

            <div className="col-span-1 pt-6 flex justify-end md:justify-center md:hidden">
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

            <div className="col-span-6">
              <AsyncCmdbox
                label="Artist Name *"
                name={`artists.${index}.artistData`}
                control={control}
                data={artists}
                placeholder="Search & select artist"
                searchPlaceholder="Type artist name..."
                emptyPlaceholder="No artist found."
                onSearchChange={searchArtists}
              />
            </div>

            <div className="md:col-span-1 pt-6 md:flex justify-end md:justify-center hidden">
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
          label="Primary Genre *"
          name="primaryGenre"
          control={control}
          data={genres}
          placeholder="Select primary genre"
          searchPlaceholder="Search genre..."
          emptyPlaceholder="No genre found."
        />

        {/* Secondary Genre */}
        <Cmdbox
          label="Secondary Genre (Optional)"
          name="secondaryGenre"
          control={control}
          data={secondaryGenres}
          placeholder="Select secondary genre"
          searchPlaceholder="Search genre..."
          emptyPlaceholder="No genre found."
        />

        {/* Label ID */}
        <AsyncCmdbox
          label="Label *"
          name="labelData"
          control={control}
          data={labels}
          placeholder="Select a label"
          searchPlaceholder="Search label..."
          emptyPlaceholder="No label found."
          onSearchChange={searchLabels}
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
        <FormDatePicker
          label="Original Release Date *"
          name="originalReleaseDate"
          control={control}
          // disabledDays={(date) => date > new Date()}
        />

        {/* Digital Release Date */}
        <FormDatePicker
          label="Digital Release Date *"
          name="releaseDate"
          control={control}
          // disabledDays={(date) => date > new Date()}
        />
      </FieldGroup>
    </div>
  );
}
