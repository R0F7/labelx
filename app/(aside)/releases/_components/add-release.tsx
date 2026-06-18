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
// import {
//   Field,
//   FieldError,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Loader2 } from "lucide-react";
// import { useForm } from "react-hook-form";
// import z from "zod";
// import { createRelease } from "../actions";
// import { toast } from "sonner";
// import { useState } from "react";

// const zodAddRelease = z.object({
//   title: z.string().trim().min(1),
//   version: z.string().trim().min(1),
//   type: z.enum(["Single", "EP", "Album"]),
//   artists: z.array(
//     z.object({
//       name: z.string().trim().min(1),
//       role: z.enum(["MainArtist", "Featured Artist"]),
//       id: z.string().trim().min(1),
//     }),
//   ),
//   metadataLanguage: z.string(),
//   upc: z.string(),
//   catalogNumber: z.string(),
//   primaryGenre: z.string().trim().min(1),
//   secondaryGenre: z.string().trim().min(1),
//   releaseDate: z.coerce.date().nonoptional(),
//   originalReleaseDate: z.coerce.date().nonoptional(),
//   parentalWarning: z.string().min(1),
//   recordLabel: z.string().trim().min(1),
//   pLine: z.string().trim().min(1),
//   cLine: z.string().trim().min(1),
//   contributors: z
//     .array(
//       z.object({
//         name: z.string().min(1),
//         role: z.enum([]),
//       }),
//     )
//     .optional()
//     .default([]),
// });

// type zodAddReleaseType = z.infer<typeof zodAddRelease>;

// export default function AddRelease() {
//   const [open, setOpen] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(zodAddRelease),
//   });

//   const onSubmit = async (data: zodAddReleaseType) => {
//     const res = await createRelease(data);
//     if (!res.success) {
//       toast.error(res?.message || "Failed to create release");
//       return;
//     } else {
//       toast.success(res?.message || "Release created successfully");
//       setOpen(false);
//     }
//   };
//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <form>
//         <DialogTrigger asChild>
//           <Button>Add Release</Button>
//         </DialogTrigger>

//         <DialogContent className="sm:max-w-sm">
//           <DialogHeader>
//             <DialogTitle>Add New Release</DialogTitle>
//             <DialogDescription>
//               Fill the form below to create a new release
//             </DialogDescription>
//           </DialogHeader>
//           <FieldGroup>
//             <Field>
//               <FieldLabel htmlFor="name-1">
//                 Release Title<span className="text-destructive">*</span>
//               </FieldLabel>
//               <Input placeholder="eg. Starboy" {...register("title")} />
//               <FieldError>{errors.title?.message}</FieldError>
//             </Field>
//             <Field>
//               <Label htmlFor="username-1">UPC</Label>
//               <Input {...register("upc")} />
//               <FieldError>{errors.upc?.message}</FieldError>
//             </Field>
//           </FieldGroup>
//           <DialogFooter>
//             <DialogClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DialogClose>
//             <Button
//               type="submit"
//               onClick={handleSubmit(onSubmit)}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <Loader2 size={20} className="animate-spin" />
//               ) : (
//                 "Add Release"
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </form>
//     </Dialog>
//   );
// }

"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRelease } from "../actions";

// --- 1. Zod Schema Fixes ---
const zodAddRelease = z.object({
  title: z.string().trim().min(1, "Release title is required"),
  version: z.string().trim().min(1, "Version is required"),
  type: z.enum(["Single", "EP", "Album"]),
  artists: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Artist name is required"),
        role: z.enum(["MainArtist", "Featured Artist"]),
        id: z.string().trim().min(1, "Artist ID is required"),
      })
    )
    .min(1, "At least one artist is required"),
  metadataLanguage: z.string().min(1, "Language is required"),
  upc: z.string().optional().or(z.literal("")),
  catalogNumber: z.string().optional().or(z.literal("")),
  primaryGenre: z.string().trim().min(1, "Primary genre is required"),
  secondaryGenre: z.string().trim().min(1, "Secondary genre is required"),
releaseDate: z.string().min(1, "Release date is required"),
  originalReleaseDate: z.string().min(1, "Original date is required"),
  parentalWarning: z.string().min(1, "Parental warning is required"),
  recordLabel: z.string().trim().min(1, "Record label is required"),
  pLine: z.string().trim().min(1, "P Line is required"),
  cLine: z.string().trim().min(1, "C Line is required"),
  contributors: z
    .array(
      z.object({
        name: z.string().min(1, "Contributor name is required"),
        role: z.string().min(1, "Role is required"),
      })
    )
    .optional()
    .default([]),
});

type zodAddReleaseType = z.infer<typeof zodAddRelease>;

export default function AddRelease() {
  const [open, setOpen] = useState(false);

  // --- 2. React Hook Form Initialization ---
  const form = useForm<zodAddReleaseType>({
    resolver: zodResolver(zodAddRelease),
    defaultValues: {
      title: "",
      version: "",
      type: "Single",
      artists: [{ name: "", role: "MainArtist", id: "" }],
      metadataLanguage: "English",
      upc: "",
      catalogNumber: "",
      primaryGenre: "",
      secondaryGenre: "",
      parentalWarning: "No",
      recordLabel: "",
      pLine: "",
      cLine: "",
      contributors: [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  // --- 3. Dynamic Field Arrays ---
  const { fields: artistFields, append: appendArtist, remove: removeArtist } = useFieldArray({
    control,
    name: "artists",
  });

  const { fields: contributorFields, append: appendContributor, remove: removeContributor } = useFieldArray({
    control,
    name: "contributors",
  });

  // const onSubmit = async (data: zodAddReleaseType) => {
  //   const res = await createRelease(data);
  //   if (!res.success) {
  //     toast.error(res?.message || "Failed to create release");
  //     return;
  //   }
  //   toast.success(res?.message || "Release created successfully");
  //   reset();
  //   setOpen(false);
  // };

  const onSubmit = async (data: zodAddReleaseType) => {
  const payload = {
    ...data,
    releaseDate: new Date(data.releaseDate),
    originalReleaseDate: new Date(data.originalReleaseDate),
  };

  console.log(payload);

  // const res = await createRelease(payload);
  
  // if (!res.success) {
  //   toast.error(res?.message || "Failed to create release");
  //   return;
  // }
  
  toast.success(res?.message || "Release created successfully");
  reset();
  setOpen(false);
};

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button>Add Release</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pr-2">
          <DialogHeader>
            <DialogTitle>Add New Release</DialogTitle>
            <DialogDescription>
              Fill the comprehensive form below to distribute a new album, EP, or single.
            </DialogDescription>
          </DialogHeader>

          {/* --- Section 1: Basic Metadata --- */}
          <div className="border-b pb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Basic Information</h3>
            <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Release Title <span className="text-destructive">*</span></FieldLabel>
                <Input placeholder="eg. Starboy" {...register("title")} />
                <FieldError>{errors.title?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Version / Subtitle <span className="text-destructive">*</span></FieldLabel>
                <Input placeholder="eg. Radio Edit / Remix" {...register("version")} />
                <FieldError>{errors.version?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Release Type</FieldLabel>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="EP">EP</SelectItem>
                        <SelectItem value="Album">Album</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.type?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Metadata Language</FieldLabel>
                <Input {...register("metadataLanguage")} />
                <FieldError>{errors.metadataLanguage?.message}</FieldError>
              </Field>
            </FieldGroup>
          </div>

          {/* --- Section 2: Dynamic Artists (Array) --- */}
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Artists <span className="text-destructive">*</span></h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendArtist({ name: "", role: "MainArtist", id: "" })}>
                <Plus className="h-4 w-4 mr-1" /> Add Artist
              </Button>
            </div>
            <div className="space-y-3">
              {artistFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end border p-3 rounded-md bg-muted/30 relative">
                  <Field>
                    <FieldLabel className="text-xs">Artist Name</FieldLabel>
                    <Input placeholder="Name" {...register(`artists.${index}.name`)} />
                    <FieldError>{errors.artists?.[index]?.name?.message}</FieldError>
                  </Field>
                  <Field>
                    <FieldLabel className="text-xs">Role</FieldLabel>
                    <Controller
                      control={control}
                      name={`artists.${index}.role`}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MainArtist">Main Artist</SelectItem>
                            <SelectItem value="Featured Artist">Featured Artist</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <div className="flex gap-2 items-center">
                    <Field className="flex-1">
                      <FieldLabel className="text-xs">Spotify/Apple ID</FieldLabel>
                      <Input placeholder="ID" {...register(`artists.${index}.id`)} />
                      <FieldError>{errors.artists?.[index]?.id?.message}</FieldError>
                    </Field>
                    {artistFields.length > 1 && (
                      <Button type="button" variant="destructive" size="icon" className="shrink-0 mb-0.5" onClick={() => removeArtist(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Section 3: Genres & Identifiers --- */}
          <div className="border-b pb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Genres & Identifiers</h3>
            <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>UPC</FieldLabel>
                <Input placeholder="Leave blank to auto-generate" {...register("upc")} />
                <FieldError>{errors.upc?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Catalog Number</FieldLabel>
                <Input placeholder="eg. LX-001" {...register("catalogNumber")} />
                <FieldError>{errors.catalogNumber?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Primary Genre <span className="text-destructive">*</span></FieldLabel>
                <Input placeholder="eg. Pop" {...register("primaryGenre")} />
                <FieldError>{errors.primaryGenre?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Secondary Genre <span className="text-destructive">*</span></FieldLabel>
                <Input placeholder="eg. R&B" {...register("secondaryGenre")} />
                <FieldError>{errors.secondaryGenre?.message}</FieldError>
              </Field>
            </FieldGroup>
          </div>

          {/* --- Section 4: Dates & Copyrights --- */}
          <div className="border-b pb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Publishing & Rights</h3>
            <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Digital Release Date <span className="text-destructive">*</span></FieldLabel>
                <Input type="date" {...register("releaseDate")} />
                <FieldError>{errors.releaseDate?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Original Release Date <span className="text-destructive">*</span></FieldLabel>
                <Input type="date" {...register("originalReleaseDate")} />
                <FieldError>{errors.originalReleaseDate?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Record Label <span className="text-destructive">*</span></FieldLabel>
                <Input placeholder="eg. LabelX Records" {...register("recordLabel")} />
                <FieldError>{errors.recordLabel?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Parental Advisory</FieldLabel>
                <Controller
                  control={control}
                  name="parentalWarning"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No (Clean)</SelectItem>
                        <SelectItem value="Yes">Yes (Explicit)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.parentalWarning?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>℗ Line <span className="text-destructive">*</span></FieldLabel>
                <Input placeholder="eg. 2026 LabelX" {...register("pLine")} />
                <FieldError>{errors.pLine?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>© Line <span className="text-destructive">*</span></FieldLabel>
                <Input placeholder="eg. 2026 LabelX" {...register("cLine")} />
                <FieldError>{errors.cLine?.message}</FieldError>
              </Field>
            </FieldGroup>
          </div>

          {/* --- Section 5: Contributors (Optional Array) --- */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Contributors (Optional)</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendContributor({ name: "", role: "" })}>
                <Plus className="h-4 w-4 mr-1" /> Add Contributor
              </Button>
            </div>
            <div className="space-y-3">
              {contributorFields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-end border p-3 rounded-md bg-muted/30">
                  <Field className="flex-1">
                    <FieldLabel className="text-xs">Name</FieldLabel>
                    <Input placeholder="Full Name" {...register(`contributors.${index}.name`)} />
                    <FieldError>{errors.contributors?.[index]?.name?.message}</FieldError>
                  </Field>
                  <Field className="flex-1">
                    <FieldLabel className="text-xs">Role</FieldLabel>
                    <Input placeholder="eg. Composer / Producer" {...register(`contributors.${index}.role`)} />
                    <FieldError>{errors.contributors?.[index]?.role?.message}</FieldError>
                  </Field>
                  <Button type="button" variant="destructive" size="icon" className="shrink-0 mb-0.5" onClick={() => removeContributor(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t sticky bottom-0 bg-background z-10">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Add Release"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}