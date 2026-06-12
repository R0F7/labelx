"use client";

import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import Image from "next/image";
import { User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  onChange: (file: File | null) => void;
  defaultValue?: string;
  className?: string;
}

export default function AvatarUpload({
  onChange,
  defaultValue,
  className,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultValue) {
      setPreview(defaultValue);
    }
  }, [defaultValue]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange(file);

      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative h-24 w-24 rounded-full hover:border-muted-foreground/50 transition-colors">
        <div
          className="group h-full w-full cursor-pointer overflow-hidden rounded-full border border-dashed border-muted-foreground/25 "
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {preview ? (
            <Image
              src={preview}
              alt="Label Logo"
              fill
              className="object-cover rounded-full"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted/30">
              <User className="size-6 text-muted-foreground" />
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-[10px] text-white font-medium">Change</p>
          </div>
        </div>

        {preview && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="absolute -right-1 top-1 h-6 w-6 rounded-full bg-red-400 text-white hover:bg-red-500 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
