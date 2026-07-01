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
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, title: "Release Metadata" },
  { id: 2, title: "Release Artwork" },
  { id: 3, title: "Upload Tracks" },
  { id: 4, title: "Select Stores" },
  { id: 5, title: "Review" },
];

export default function ReleaseForm({ initialData }) {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const isEditMode = !!initialData;

  const formatInputDate = (dateString: string | Date | undefined | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString().split("T")[0];
  };

  const formatDuration = (totalSeconds: number | string): string => {
    const secondsNum = Number(totalSeconds);

    if (isNaN(secondsNum) || secondsNum <= 0) return "00:00";

    const minutes = Math.floor(secondsNum / 60);
    const remainingSeconds = Math.floor(secondsNum % 60);

    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${paddedMinutes}:${paddedSeconds}`;
  };

  const methods = useForm<MasterReleaseFormValues>({
    resolver: zodResolver(masterReleaseSchema),
    defaultValues: {
      metadataLanguage: initialData?.language || "",
      releaseType: initialData?.releaseType || "",
      releaseTitle: initialData?.title || "",
      titleVersion: initialData?.version || "",
      artists: initialData?.artists || [
        { artistType: "", artistData: { id: "", name: "" } },
      ],
      primaryGenre: initialData?.primaryGenre || "",
      secondaryGenre: initialData?.secondaryGenre || "",
      labelData: initialData?.label
        ? {
            id: String(initialData.label.id),
            name: initialData.label.name,
          }
        : { id: "", name: "" },
      upc: initialData?.upc || "",
      originalReleaseDate:
        formatInputDate(initialData?.originalReleaseDate) || "",
      releaseDate: formatInputDate(initialData?.releaseDate) || "",
      artwork: initialData?.artwork || null,
      tracks:
        initialData?.tracks?.map((track: any) => ({
          ...track,
          file: track.file || track.audioFile || null,
          previewStart: formatDuration(track.previewStart),
        })) || [],
      stores: initialData?.stores || [],
    },
    mode: "onChange",
  });

  const {
    trigger,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const validateStep = async (stepToValidate: number): Promise<boolean> => {
    if (stepToValidate === 1) {
      return await trigger([
        "metadataLanguage",
        "releaseType",
        "releaseTitle",
        "artists",
        "primaryGenre",
        "labelData",
        "originalReleaseDate",
        "releaseDate",
      ]);
    }

    if (stepToValidate === 2) {
      return await trigger(["artwork"]);
    }

    if (stepToValidate === 3) {
      const isValid = await trigger(["tracks"]);
      const currentTracks = methods.getValues("tracks") || [];

      if (currentTracks.length === 0) {
        methods.setError("tracks.root", {
          type: "manual",
          message: "At least one audio track is required.",
        });
        return false;
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
        return false;
      }
      return true;
    }

    // Step 4 (Stores) & Step 5 (Review)
    return true;
  };

  const nextStep = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleStepClick = async (targetStep: number) => {
    if (targetStep === currentStep) return;

    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      return;
    }

    let canProceed = true;
    let stepToCheck = currentStep;

    while (stepToCheck < targetStep) {
      const isValid = await validateStep(stepToCheck);
      if (!isValid) {
        canProceed = false;
        if (currentStep !== stepToCheck) {
          setCurrentStep(stepToCheck);
        }
        break;
      }
      stepToCheck++;
    }

    if (canProceed) {
      setCurrentStep(targetStep);
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

      const cleanedTracks = data.tracks.map((track) => {
        const { file, ...rest } = track;
        return {
          ...rest,
          audioFile: file instanceof File ? track.audioFile : file,
        };
      });

      const cleanedMetadata = {
        ...data,
        artwork:
          data.artwork instanceof File ? initialData?.artwork : data.artwork,
        tracks: cleanedTracks,
      };

      formData.append("metadata", JSON.stringify(cleanedMetadata));

      if (data.artwork instanceof File) {
        formData.append("artwork", data.artwork);
      }

      data.tracks.forEach((track) => {
        if (track.file instanceof File) {
          formData.append("tracks", track.file);
        }
      });
      // console.log(formData);

      const url = isEditMode
        ? `/api/releases/${initialData.id}`
        : "/api/releases";
      const method = isEditMode ? "PATCH" : "POST";

      const res = await fetch(url, { method: method, body: formData });
      const json = await res.json();

      if (!json?.success) {
        toast.error(
          json?.message ||
            `Failed to ${isEditMode ? "update" : "save"} release`,
        );
      } else {
        toast.success(json?.message);
        router.push("/releases");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // upload track & artwork upload assets directly
  // const onSubmit = async (data: MasterReleaseFormValues) => {
  //   try {
  //     const urlResponse = await fetch("/api/releases/upload-url", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         artwork: data.artwork instanceof File
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
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepClick(step.id)}
                className="flex flex-col items-center focus:outline-none group cursor-pointer"
              >
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium border transition-all ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border group-hover:border-primary/50"
                  }`}
                >
                  {step.id}
                </div>
                <p className="hidden md:block mt-2 text-xs text-center transition-colors group-hover:text-primary">
                  {step.title}
                </p>
              </button>
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
              {isSubmitting
                ? "Processing..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Release"}
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
