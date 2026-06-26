"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReleaseMetadata from "./steps/release-metadata";
import ReleaseArtwork from "./steps/release-artwork";
import UploadTracks from "./steps/upload-tracks";
import SelectStores from "./steps/select-stores";
import ReviewRelease from "./steps/review-release";
import { Button } from "@/components/ui/button";
import {
  MasterReleaseFormValues,
  masterReleaseSchema,
} from "./schema/masterReleaseSchema";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "Release Metadata" },
  { id: 2, title: "Release Artwork" },
  { id: 3, title: "Upload Tracks" },
  { id: 4, title: "Select Stores" },
  { id: 5, title: "Review" },
];

export default function ReleaseForm() {
  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm<MasterReleaseFormValues>({
    resolver: zodResolver(masterReleaseSchema),
    defaultValues: {
      metadataLanguage: "",
      releaseType: "",
      releaseTitle: "",
      titleVersion: "",
      artists: [{ artistType: "", artistData: { id: "", name: "" } }],
      primaryGenre: "",
      secondaryGenre: "",
      labelData: { id: "", name: "" },
      upc: "",
      originalReleaseDate: "",
      releaseDate: "",
      artwork: null,
      tracks: [],
      stores: [],
    },
    mode: "onChange",
  });

  const {
    trigger,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const nextStep = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    if (currentStep === 1) {
      const isValid = await trigger([
        "metadataLanguage",
        "releaseType",
        "releaseTitle",
        "artists",
        "primaryGenre",
        "labelData",
        "originalReleaseDate",
        "releaseDate",
      ]);
      if (!isValid) return;
    }

    if (currentStep === 2) {
      const isValid = await trigger(["artwork"]);
      if (!isValid) return;
    }

    if (currentStep === 3) {
      const isValid = await trigger(["tracks"]);
      const currentTracks = methods.getValues("tracks") || [];

      if (currentTracks.length === 0) {
        methods.setError("tracks.root", {
          type: "manual",
          message: "At least one audio track is required.",
        });
        return;
      }

      const hasAudioError = currentTracks.some((t) => !!t.customError);
      const hasMissingMetadata = currentTracks.some((t) => {
        const hasComposer = t.writers?.some((w) => w.role === "Composer");
        const hasLyricist = t.writers?.some((w) => w.role === "Lyricist");

        return (
          !t.title ||
          t.artists.some((a) => !a.artistType || !a.artistData?.id) ||
          !t.primaryGenre ||
          !t.isrc ||
          !t.trackOrigin ||
          !t.explicitContent ||
          !t.trackLanguage ||
          !hasComposer ||
          !hasLyricist ||
          t.writers.some((a) => !a.role || !a.name)
        );
      });

      if (!isValid || hasAudioError || hasMissingMetadata) {
        methods.setError("tracks.root", {
          type: "manual",
          message:
            "Please fill up track details/metadata for all tracks before continuing.",
        });
        return;
      }
    }

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: MasterReleaseFormValues) => {
    try {
      const formData = new FormData();

      formData.append("metadata", JSON.stringify(data));

      if (data.artwork) {
        formData.append("artwork", data.artwork);
      }

      data.tracks.forEach((track) => {
        if (track.file) {
          formData.append("tracks", track.file);
        }
      });
      console.log(data);

      const res = await fetch("/api/releases", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!json?.success) {
        toast.error(json?.message || `Failed to add release`);
      } else {
        toast.success(json?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const onSubmit = async (data: MasterReleaseFormValues) => {
  //   try {
  //     const urlResponse = await fetch("/api/releases/upload-url", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         artwork: data.artwork
  //           ? { name: data.artwork.name, type: data.artwork.type }
  //           : null,
  //         tracks: data.tracks.map((t) => ({
  //           name: t.file.name,
  //           type: t.file.type,
  //         })),
  //       }),
  //     });

  //     const urlData = await urlResponse.json();
  //     if (!urlData.success)
  //       throw new Error(urlData.message || "Failed to get upload links");

  //     // S3 আপলোডের জন্য res.ok চেক করার হেল্পার ফাংশন
  //     const uploadToS3 = async (url: string, file: File) => {
  //       const res = await fetch(url, {
  //         method: "PUT",
  //         body: file,
  //         headers: { "Content-Type": file.type },
  //       });
  //       if (!res.ok) {
  //         throw new Error(`Failed to upload file: ${file.name}`);
  //       }
  //       return res;
  //     };

  //     const uploadPromises = [];
  //     let artworkKey = urlData.artwork?.key || null;

  //     if (data.artwork && urlData.artwork?.url) {
  //       uploadPromises.push(uploadToS3(urlData.artwork.url, data.artwork));
  //     }

  //     data.tracks.forEach((track, index) => {
  //       if (track.file && urlData.tracks[index]?.url) {
  //         uploadPromises.push(
  //           uploadToS3(urlData.tracks[index].url, track.file),
  //         );
  //       }
  //     });

  //     toast.info("Uploading assets directly to secure storage...");
  //     // এবার কোনো একটি ফাইলও যদি S3 তে ফেইল করে, Promise.all সাথে সাথে ক্র্যাশ করবে ও ক্যাচ ব্লকে চলে যাবে
  //     await Promise.all(uploadPromises);

  //     toast.info("Saving metadata to database...");

  //     const res = await fetch("/api/releases", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         metadata: data,
  //         artworkKey: artworkKey,
  //         tracksWithKeys: urlData.tracks.map((t: any) => ({ key: t.key })),
  //       }),
  //     });

  //     const json = await res.json();
  //     if (!json?.success) {
  //       toast.error(json?.message || `Failed to add release`);
  //     } else {
  //       toast.success(json?.message);
  //     }
  //   } catch (error: any) {
  //     console.error(error);
  //     toast.error(
  //       error.message || "An error occurred during upload. Please try again.",
  //     );
  //   }
  // };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ReleaseMetadata formMethods={methods} />;
      case 2:
        return <ReleaseArtwork formMethods={methods} />;
      case 3:
        return <UploadTracks formMethods={methods} />;
      case 4:
        return <SelectStores formMethods={methods} />;
      case 5:
        return <ReviewRelease formMethods={methods} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative w-full pt-4">
        <div className="absolute top-9 inset-x-10 md:inset-x-16 lg:inset-x-28 h-px bg-border" />
        <div className="relative z-10 flex justify-center gap-6 md:gap-12">
          {steps.map((step) => {
            const active = currentStep >= step.id;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium border transition-all ${active ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border"}`}
                >
                  {step.id}
                </div>
                <p className="hidden md:block mt-2 text-xs text-center">
                  {step.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="border p-6 bg-card">{renderStep()}</div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep === steps.length ? (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Release"}
            </Button>
          ) : (
            <Button type="button" onClick={(e) => nextStep(e)}>
              Continue
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
