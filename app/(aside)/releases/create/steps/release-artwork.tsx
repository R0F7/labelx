"use client";

import * as React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { MasterReleaseFormValues } from "../schemas/masterReleaseSchema";
import Image from "next/image";

interface ReleaseArtworkProps {
  formMethods: UseFormReturn<MasterReleaseFormValues>;
}

export default function ReleaseArtwork({ formMethods }: ReleaseArtworkProps) {
  const { control } = formMethods;
  const [preview, setPreview] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold tracking-tight">Select Artwork</h3>
        <p className="text-xs text-muted-foreground">
          Pick a valid release artwork
        </p>
      </div>

      <Controller
        name="artwork"
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          if (value && value instanceof File && !preview) {
            setPreview(URL.createObjectURL(value));
          }

          const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
              onChange(file);
              setPreview(URL.createObjectURL(file));
            }
          };

          const removeImage = () => {
            onChange(null);
            setPreview(null);
          };

          return (
            <Field className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="w-full max-w-[320px] aspect-square mx-auto bg-muted rounded-xl overflow-hidden border-2 border-dashed border-border flex flex-col items-center justify-center relative group">
                {preview ? (
                  <>
                    <Image
                      src={preview}
                      alt="Artwork Preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                      className="object-cover"
                      priority
                      unoptimized
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6 text-center space-y-2 hover:bg-accent/50 transition-colors">
                    <UploadCloud className="h-10 w-10 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      Click or Drag to Upload
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Square Image Only
                    </span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-4">
                <ul className="text-xs space-y-2 text-muted-foreground list-disc pl-4">
                  <li>
                    It must be a perfectly square image{" "}
                    <span className="text-foreground font-medium">
                      (1:1 ratio)
                    </span>
                  </li>
                  <li>
                    Exact dimensions:{" "}
                    <span className="text-foreground font-medium">
                      3000 x 3000 px
                    </span>
                  </li>
                  <li>
                    Format:{" "}
                    <span className="text-foreground font-medium">
                      JPG only
                    </span>
                  </li>
                  <li>
                    Color mode:{" "}
                    <span className="text-foreground font-medium">
                      RGB. Avoid CMYK.
                    </span>
                  </li>
                  <li>
                    Maximum file size:{" "}
                    <span className="text-foreground font-medium">10MB</span>
                  </li>
                </ul>

                {error && (
                  <FieldError className="text-sm mt-2">
                    {error.message}
                  </FieldError>
                )}
              </div>
            </Field>
          );
        }}
      />
    </div>
  );
}
