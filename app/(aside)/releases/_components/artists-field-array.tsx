"use client";

import { useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { MasterReleaseFormValues } from "../create/schema/masterReleaseSchema";
import FormSelect from "./form-select";
import { artistTypeOptions } from "../data/data";
import AsyncCmdbox from "./async-cmdbox";

interface ArtistsFieldArrayProps {
  formMethods: UseFormReturn<MasterReleaseFormValues>;
  name: string;
}

export default function ArtistsFieldArray({
  formMethods,
  name,
}: ArtistsFieldArrayProps) {
  const { control, errors } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "artists",
  });

  const [artists, setArtists] = useState<{ id: number; name: string }[]>([]);

  const searchArtists = async (search: string) => {
    const res = await fetch(`/api/artists/search?query=${search}`);
    const data = await res.json();
    setArtists(data.data);
  };

  return (
    <div className="border rounded-lg p-4 bg-muted/30 space-y-4">
      {/* Header */}
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
          <Plus className="h-3.5 w-3.5" />
          Add Artist
        </Button>
      </div>

      {/* List */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-6 md:grid-cols-12 gap-4 items-start"
        >
          {/* Artist Type */}
          <FormSelect
            label="Artist Type *"
            name={name}
            control={control}
            options={artistTypeOptions}
            placeholder="Select type"
            className="col-span-5"
          />

          {/* Artist Name (Async) */}
          <div className="col-span-6">
            <AsyncCmdbox
              label="Artist Name *"
              name={name}
              control={control}
              data={artists}
              placeholder="Search & select artist"
              searchPlaceholder="Type artist name..."
              emptyPlaceholder="No artist found."
              onSearchChange={searchArtists}
            />
          </div>

          {/* Remove button */}
          <div className="col-span-1 flex justify-end pt-6">
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

      {/* Error */}
      {errors?.artists?.root && (
        <p className="text-xs text-destructive">
          {errors.artists.root.message}
        </p>
      )}
    </div>
  );
}
