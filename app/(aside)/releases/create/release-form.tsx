// "use client";

// import { useState } from "react";
// import ReleaseMetadata from "./steps/release-metadata";
// import ReleaseArtwork from "./steps/release-artwork";
// import UploadTracks from "./steps/upload-tracks";
// import ReleaseStepper from "./release-stepper";
// import SelectStores from "./steps/select-stores";
// import { Button } from "@/components/ui/button";

// export default function ReleaseForm() {
//   const [step, setStep] = useState(1);

//   const next = () => {
//     setStep((prev) => Math.min(prev + 1, 4));
//   };

//   const prev = () => {
//     setStep((prev) => Math.max(prev - 1, 1));
//   };

//   return (
//     <div className="space-y-8">
//       <ReleaseStepper step={step} />

//       {step === 1 && <ReleaseMetadata />}
//       {step === 2 && <ReleaseArtwork />}
//       {step === 3 && <UploadTracks />}
//       {step === 4 && <SelectStores />}

//       <div className="flex justify-between">
//         <Button
//           disabled={step === 1}
//           onClick={prev}
//           variant="outline"
//         >
//           Previous
//         </Button>

//         <Button onClick={next}>
//           {step === 4 ? "Submit Release" : "Next"}
//         </Button>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";

// import ReleaseMetadata from "./steps/release-metadata";
// import ReleaseArtwork from "./steps/release-artwork";
// import UploadTracks from "./steps/upload-tracks";
// import SelectStores from "./steps/select-stores";
// import ReviewRelease from "./steps/review-release";

// import { Button } from "@/components/ui/button";

// const steps = [
//   {
//     id: 1,
//     title: "Release Metadata",
//   },
//   {
//     id: 2,
//     title: "Release Artwork",
//   },
//   {
//     id: 3,
//     title: "Upload Tracks",
//   },
//   {
//     id: 4,
//     title: "Select Stores",
//   },
//   {
//     id: 5,
//     title: "Review",
//   },
// ];

// export default function ReleaseForm() {
//   const [currentStep, setCurrentStep] = useState(1);

//   const nextStep = () => {
//     if (currentStep < steps.length) {
//       setCurrentStep((prev) => prev + 1);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep((prev) => prev - 1);
//     }
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 1:
//         return <ReleaseMetadata />;

//       case 2:
//         return <ReleaseArtwork />;

//       case 3:
//         return <UploadTracks />;

//       case 4:
//         return <SelectStores />;

//       case 5:
//         return <ReviewRelease />;

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="space-y-8">
//       {/* Stepper */}
//       <div className="relative w-full pt-4">
//         <div className="absolute top-9 inset-x-10 md:inset-x-16 lg:inset-x-28 h-px bg-border" />

//         <div className="relative z-10 flex justify-center gap-6 md:gap-12">
//           {steps.map((step) => {
//             const active = currentStep >= step.id;

//             return (
//               <div
//                 key={step.id}
//                 className="flex flex-col items-center"
//               >
//                 <div
//                   className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium border transition-all
//                   ${
//                     active
//                       ? "bg-primary text-primary-foreground border-primary"
//                       : "bg-background text-muted-foreground border-border"
//                   }`}
//                 >
//                   {step.id}
//                 </div>

//                 <p className="hidden md:block mt-2 text-xs text-center">
//                   {step.title}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Current Step */}
//       <div className="border rounded-lg p-6 bg-card">
//         {renderStep()}
//       </div>

//       {/* Footer */}
//       <div className="flex justify-between">
//         <Button
//           variant="outline"
//           onClick={prevStep}
//           disabled={currentStep === 1}
//         >
//           Previous
//         </Button>

//         {currentStep === steps.length ? (
//           <Button>
//             Create Release
//           </Button>
//         ) : (
//           <Button onClick={nextStep}>
//             Continue
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MetadataFormValues } from "./schemas/metadata";

import ReleaseMetadata from "./steps/release-metadata";
import ReleaseArtwork from "./steps/release-artwork";
import UploadTracks from "./steps/upload-tracks";
import SelectStores from "./steps/select-stores";
import ReviewRelease from "./steps/review-release";
import { Button } from "@/components/ui/button";
import {
  MasterReleaseFormValues,
  masterReleaseSchema,
} from "./schemas/masterReleaseSchema";

const steps = [
  { id: 1, title: "Release Metadata" },
  { id: 2, title: "Release Artwork" },
  { id: 3, title: "Upload Tracks" },
  { id: 4, title: "Select Stores" },
  { id: 5, title: "Review" },
];

export default function ReleaseForm() {
  const [currentStep, setCurrentStep] = useState(3);

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
      // tracks: [{artistType: "", selectArtist: "", primaryGenre: "", previewStart: "00:00", trackOrigin: "", explicitContent: "", trackLanguage: "", isInstrumental: false}],
    },
    mode: "onChange",
  });

  const { trigger, handleSubmit } = methods;

  const nextStep = async () => {
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

      const hasAudioError = currentTracks.some((t: any) => !!t.customError);
      const hasMissingMetadata = currentTracks.some((t: any) => {
        return (
          !t.title ||
          t.artists.some((a: any) => !a.artistType || !a.artistData?.id) ||
          !t.primaryGenre ||
          !t.previewStart ||
          !t.trackOrigin ||
          !t.explicitContent ||
          !t.trackLanguage
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

  const onSubmit = (data: MetadataFormValues) => {
    console.log("Final Submitted Data:", data);
    // API Call hobe ekhane
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ReleaseMetadata formMethods={methods} />;
      case 2:
        return <ReleaseArtwork formMethods={methods} />;
      case 3:
        return <UploadTracks formMethods={methods} />;
      case 4:
        return <SelectStores />;
      case 5:
        return <ReviewRelease />;
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
        <div className="border rounded-lg p-6 bg-card">{renderStep()}</div>

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
            <Button type="submit">Create Release</Button>
          ) : (
            <Button type="button" onClick={nextStep}>
              Continue
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
