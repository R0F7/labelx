// v-3
// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Field, FieldError, FieldLabel } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import z from "zod";
// import ConnectionModalItem from "./connection-modal-Item";

// const DSP_PLATFORMS = ["Spotify", "Apple Music", "Tidal", "Gaana"] as const;
// const SOCIAL_PLATFORMS = ["Facebook", "Instagram", "X", "Threads"] as const;

// const ArtistFormSchema = z.object({
//   name: z.string().trim().min(1, "Artist name is required"),
//   logo: z.any().optional(),
//   dsp_connections: z
//     .array(z.object({ name: z.enum(DSP_PLATFORMS), id: z.string() }))
//     .optional(),
//   social_connections: z
//     .array(z.object({ name: z.enum(SOCIAL_PLATFORMS), id: z.string() }))
//     .optional(),
// });

// type ArtistFormType = z.infer<typeof ArtistFormSchema>;

// export default function AddArtist({ artistData }: { artistData?: any | null }) {
//   const router = useRouter();
//   const isEditMode = !!artistData;
//   const [open, setOpen] = useState(isEditMode);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     getValues,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm<ArtistFormType>({
//     resolver: zodResolver(ArtistFormSchema),
//     defaultValues: { name: "", dsp_connections: [], social_connections: [] },
//   });

//   useEffect(() => {
//     if (artistData) {
//       reset({
//         name: artistData.name,
//         dsp_connections: artistData.dsp_connections || [],
//         social_connections: artistData.social_connections || [],
//       });
//       setOpen(true);
//     } else {
//       reset({ name: "", dsp_connections: [], social_connections: [] });
//     }
//   }, [artistData, reset]);

//   const handleOpenChange = (isOpen: boolean) => {
//     setOpen(isOpen);
//     if (!isOpen && isEditMode) {
//       router.push("/artists", { scroll: false });
//     }
//   };

//   const handleSaveDsp = (name: string, id: string) => {
//     const currentList = getValues("dsp_connections") || [];
//     const filtered = currentList.filter((item) => item.name !== name);
//     if (id.trim() !== "")
//       setValue("dsp_connections", [...filtered, { name: name as any, id }], {
//         shouldDirty: true,
//       });
//     else setValue("dsp_connections", filtered, { shouldDirty: true });
//   };

//   const handleSaveSocial = (name: string, id: string) => {
//     const currentList = getValues("social_connections") || [];
//     const filtered = currentList.filter((item) => item.name !== name);
//     if (id.trim() !== "")
//       setValue("social_connections", [...filtered, { name: name as any, id }], {
//         shouldDirty: true,
//       });
//     else setValue("social_connections", filtered, { shouldDirty: true });
//   };

//   const onSubmit = async (data: ArtistFormType) => {
//     try {
//       const formData = new FormData();
//       formData.set("name", data.name);

//       if (data.logo && data.logo.length > 0) {
//         formData.set("logo", data.logo[0]);
//       }

//       if (data.dsp_connections?.length) {
//         formData.set("dsp_connections", JSON.stringify(data.dsp_connections));
//       }
//       if (data.social_connections?.length) {
//         formData.set(
//           "social_connections",
//           JSON.stringify(data.social_connections),
//         );
//       }

//       const url = isEditMode ? `/api/artists/${artistData.id}` : "/api/artists";
//       const method = isEditMode ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method: method,
//         body: formData,
//       });

//       const json = await res.json();
//       if (!json?.success) {
//         toast.error(
//           json?.message || `Failed to ${isEditMode ? "update" : "add"} artist`,
//         );
//       } else {
//         toast.success(
//           `Artist ${isEditMode ? "updated" : "added"} successfully!`,
//         );
//         reset();
//         router.refresh();
//         setOpen(false);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong");
//     }
//   };

//   const dspConnections = watch("dsp_connections") || [];
//   const socialConnections = watch("social_connections") || [];

//   return (
//     <Dialog open={open} onOpenChange={handleOpenChange}>
//       {!isEditMode && (
//         <DialogTrigger asChild>
//           <Button>Add Artist</Button>
//         </DialogTrigger>
//       )}

//       <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <DialogHeader>
//             <DialogTitle>
//               {isEditMode ? "Edit Artist" : "Add Artist"}
//             </DialogTitle>
//           </DialogHeader>

//           <div className="grid gap-6 py-4">
//             <Field>
//               <FieldLabel>Artist Name</FieldLabel>
//               <Input {...register("name")} placeholder="e.g. Radiohead" />
//               <FieldError>{errors.name?.message}</FieldError>
//             </Field>

//             <Field>
//               <FieldLabel>Artist Logo</FieldLabel>
//               <Input
//                 type="file"
//                 accept="image/*"
//                 {...register("logo")}
//                 className="cursor-pointer"
//               />
//               {isEditMode && (
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Leave blank to keep existing logo
//                 </p>
//               )}
//               <FieldError>{errors.logo?.message as string}</FieldError>
//             </Field>

//             <hr />
//             <div className="space-y-3">
//               <FieldLabel>DSP Connections</FieldLabel>
//               <div className="grid grid-cols-2 gap-3">
//                 {DSP_PLATFORMS.map((platform) => (
//                   <ConnectionModalItem
//                     key={platform}
//                     platformName={platform}
//                     currentId={
//                       dspConnections.find((c) => c.name === platform)?.id
//                     }
//                     onSave={handleSaveDsp}
//                   />
//                 ))}
//               </div>
//             </div>

//             <hr />
//             <div className="space-y-3">
//               <FieldLabel>Social Connections</FieldLabel>
//               <div className="grid grid-cols-2 gap-3">
//                 {SOCIAL_PLATFORMS.map((platform) => (
//                   <ConnectionModalItem
//                     key={platform}
//                     platformName={platform}
//                     currentId={
//                       socialConnections.find((c) => c.name === platform)?.id
//                     }
//                     onSave={handleSaveSocial}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>

//           <DialogFooter>
//             <DialogClose asChild>
//               <Button type="button" variant="outline">
//                 Cancel
//               </Button>
//             </DialogClose>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting
//                 ? "Processing..."
//                 : isEditMode
//                   ? "Save Changes"
//                   : "Add Artist"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// v-4
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import ConnectionModalItem from "./connection-modal-Item";
import { resolveS3Url } from "@/lib/s3-client";
import Image from "next/image";

const DSP_PLATFORMS = ["Spotify", "Apple Music", "Tidal", "Gaana"] as const;
const SOCIAL_PLATFORMS = ["Facebook", "Instagram", "X", "Threads"] as const;

const ArtistFormSchema = z.object({
  name: z.string().trim().min(1, "Artist name is required"),
  logo: z.any().optional(),
  dsp_connections: z
    .array(z.object({ name: z.enum(DSP_PLATFORMS), url: z.string() }))
    .optional(),
  social_connections: z
    .array(z.object({ name: z.enum(SOCIAL_PLATFORMS), url: z.string() }))
    .optional(),
});

type ArtistFormType = z.infer<typeof ArtistFormSchema>;

export default function AddArtist({ artistData }: { artistData?: any | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = !!artistData;
  const [open, setOpen] = useState(isEditMode);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    isEditMode ? resolveS3Url(artistData?.logo) : null,
  );
  const currentParams = new URLSearchParams(searchParams.toString());

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ArtistFormType>({
    resolver: zodResolver(ArtistFormSchema),
    defaultValues: { name: "", dsp_connections: [], social_connections: [] },
  });

  const {
    fields: dspFields,
    append: appendDsp,
    update: updateDsp,
    remove: removeDsp,
  } = useFieldArray({
    control,
    name: "dsp_connections",
  });

  const {
    fields: socialFields,
    append: appendSocial,
    update: updateSocial,
    remove: removeSocial,
  } = useFieldArray({
    control,
    name: "social_connections",
  });

  useEffect(() => {
    if (artistData) {
      reset({
        name: artistData.name,
        dsp_connections: artistData.dsp_connections || [],
        social_connections: artistData.social_connections || [],
      });

      setOpen(true);
    } else {
      reset({ name: "", dsp_connections: [], social_connections: [] });
    }
  }, [artistData, reset]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && isEditMode) {
      currentParams.delete("edit");

      router.replace(
        `/artists${currentParams.toString() ? `?${currentParams.toString()}` : ""}`,
        { scroll: false },
      );
    }
  };

  const handleSaveDsp = (name: string, url: string) => {
    const existingIndex = dspFields.findIndex((f) => f.name === name);

    if (url.trim() === "") {
      if (existingIndex > -1) removeDsp(existingIndex);
    } else {
      if (existingIndex > -1) {
        updateDsp(existingIndex, { name: name as any, url });
      } else {
        appendDsp({ name: name as any, url });
      }
    }
  };

  const handleSaveSocial = (name: string, url: string) => {
    const existingIndex = socialFields.findIndex((f) => f.name === name);

    if (url.trim() === "") {
      if (existingIndex > -1) removeSocial(existingIndex);
    } else {
      if (existingIndex > -1) {
        updateSocial(existingIndex, { name: name as any, url });
      } else {
        appendSocial({ name: name as any, url });
      }
    }
  };

  const onSubmit = async (data: ArtistFormType) => {
    try {
      const formData = new FormData();
      formData.set("name", data.name);

      if (data.logo && data.logo.length > 0) {
        formData.set("logo", data.logo[0]);
      }

      if (data.dsp_connections?.length) {
        formData.set("dsp_connections", JSON.stringify(data.dsp_connections));
      }
      if (data.social_connections?.length) {
        formData.set(
          "social_connections",
          JSON.stringify(data.social_connections),
        );
      }

      const url = isEditMode ? `/api/artists/${artistData.id}` : "/api/artists";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });

      if (res.status === 401) {
        toast.error("Session expired or not logged in. Please login.");
        router.push("/login");
        return;
      }

      if (res.status === 403) {
        toast.error("Please select an organization first.");
        router.push("/select-organization");
        return;
      }

      const json = await res.json();

      if (!json?.success) {
        toast.error(
          json?.message || `Failed to ${isEditMode ? "update" : "add"} artist`,
        );
      } else {
        toast.success(
          `Artist ${isEditMode ? "updated" : "added"} successfully!`,
        );

        reset();

        if (isEditMode) {
          currentParams.delete("edit");

          router.replace(
            `/artists${currentParams.toString() ? `?${currentParams.toString()}` : ""}`,
            { scroll: false },
          );
        } else {
          setOpen(false);
        }

        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isEditMode && (
        <DialogTrigger asChild>
          <Button onClick={() => setPreviewUrl("")}>Add Artist</Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Artist" : "Add Artist"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the fields below to modify artist details."
                : "Fill the form below to add a new artist, their logo, and connections."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <Field>
              <FieldLabel>Artist Name</FieldLabel>
              <Input {...register("name")} placeholder="e.g. Radiohead" />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>

            <div className="flex gap-4 items-start">
              <Field className="flex-1">
                <FieldLabel>Artist Logo</FieldLabel>
                <Input
                  type="file"
                  accept="image/*"
                  {...register("logo", {
                    onChange: (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPreviewUrl(URL.createObjectURL(file));
                      } else {
                        setPreviewUrl(isEditMode ? artistData?.logo : null);
                      }
                    },
                  })}
                  className="cursor-pointer"
                />
                {isEditMode && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave blank to keep existing logo
                  </p>
                )}
                <FieldError>{errors.logo?.message as string}</FieldError>
              </Field>

              {/* Image Preview Box */}
              {previewUrl && !previewUrl.endsWith("/null") && (
                <div className="w-16 h-16 shrink-0 mt- rounded-md border border-border overflow-hidden bg-muted flex items-center justify-center">
                  <Image
                    src={
                      // previewUrl.endsWith("/null")
                      //   ? "/banner.jpg"
                      //   :
                      previewUrl
                    }
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                    width={64}
                    height={64}
                  />
                </div>
              )}
            </div>

            <hr />

            <div className="space-y-3">
              <FieldLabel>DSP Connections</FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                {DSP_PLATFORMS.map((platform) => (
                  <ConnectionModalItem
                    key={platform}
                    platformName={platform}
                    currentId={dspFields.find((c) => c.name === platform)?.id}
                    onSave={handleSaveDsp}
                  />
                ))}
              </div>
            </div>

            <hr />
            <div className="space-y-3">
              <FieldLabel>Social Connections</FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                {SOCIAL_PLATFORMS.map((platform) => (
                  <ConnectionModalItem
                    key={platform}
                    platformName={platform}
                    currentId={
                      socialFields.find((c) => c.name === platform)?.id
                    }
                    onSave={handleSaveSocial}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Processing..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Artist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
