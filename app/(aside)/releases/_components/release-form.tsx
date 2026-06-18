// "use client";

// import React from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Plus, Trash2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// // --- Zod Schema Definition ---
// export const releaseSchema = z.object({
//   title: z.string().trim().min(1, "Title is required"),
//   version: z.string().trim().min(1, "Version is required"),
//   type: z.enum(["Single", "EP", "Album"]),
//   artists: z.array(
//     z.object({
//       name: z.string().trim().min(1, "Artist name is required"),
//       role: z.enum(["MainArtist", "Featured Artist"]),
//       id: z.string().trim().min(1, "Artist ID is required"),
//     })
//   ).min(1, "At least one artist is required"),
//   metadataLanguage: z.string().min(1, "Language is required"),
//   upc: z.string().optional(),
//   catalogNumber: z.string().optional(),
//   primaryGenre: z.string().trim().min(1, "Primary genre is required"),
//   secondaryGenre: z.string().trim().min(1, "Secondary genre is required"),
//   releaseDate: z.coerce.date({ required_error: "Release date is required" }),
//   originalReleaseDate: z.coerce.date({ required_error: "Original release date is required" }),
//   parentalWarning: z.string().min(1, "Parental warning option is required"),
//   recordLabel: z.string().trim().min(1, "Record label is required"),
//   pLine: z.string().trim().min(1, "P Line is required"),
//   cLine: z.string().trim().min(1, "C Line is required"),
//   contributors: z
//     .array(
//       z.object({
//         name: z.string().min(1, "Contributor name is required"),
//         role: z.string().min(1, "Role is required"), // z.enum([]) কে ফিক্স করা হয়েছে টেস্ট করার সুবিধার্থে
//       })
//     )
//     .optional()
//     .default([]),
// });

// type ReleaseFormValues = z.infer<typeof releaseSchema>;

// export default function ReleaseForm() {
//   const form = useForm<ReleaseFormValues>({
//     resolver: zodResolver(releaseSchema),
//     defaultValues: {
//       title: "",
//       version: "",
//       type: "Single",
//       artists: [{ name: "", role: "MainArtist", id: "" }],
//       metadataLanguage: "English",
//       upc: "",
//       catalogNumber: "",
//       primaryGenre: "",
//       secondaryGenre: "",
//       parentalWarning: "No",
//       recordLabel: "",
//       pLine: "",
//       cLine: "",
//       contributors: [],
//     },
//   });

//   // --- Field Arrays for Dynamic Inputs ---
//   const { fields: artistFields, append: appendArtist, remove: removeArtist } = useFieldArray({
//     control: form.control,
//     name: "artists",
//   });

//   const { fields: contributorFields, append: appendContributor, remove: removeContributor } = useFieldArray({
//     control: form.control,
//     name: "contributors",
//   });

//   function onSubmit(data: ReleaseFormValues) {
//     console.log("Submitted Data:", data);
//     // আপনার API কল বা DB অ্যাকশন এখানে হ্যান্ডেল করবেন
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto p-6">

//         {/* --- 1. Basic Info Section --- */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Basic Information</CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormField
//               control={form.control, form.register}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Release Title</FormLabel>
//                   <FormControl><Input placeholder="e.g. Moonlight Serenade" {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="version"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Version / Subtitle</FormLabel>
//                   <FormControl><Input placeholder="e.g. Radio Edit, Instrumental" {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="type"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Release Type</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="Single">Single</SelectItem>
//                       <SelectItem value="EP">EP</SelectItem>
//                       <SelectItem value="Album">Album</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="metadataLanguage"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Metadata Language</FormLabel>
//                   <FormControl><Input {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </CardContent>
//         </Card>

//         {/* --- 2. Dynamic Artists Section --- */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between unique-card-header">
//             <CardTitle>Artists</CardTitle>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() => appendArtist({ name: "", role: "MainArtist", id: "" })}
//             >
//               <Plus className="mr-2 h-4 w-4" /> Add Artist
//             </Button>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {artistFields.map((field, index) => (
//               <div key={field.id} className="flex flex-col md:flex-row gap-4 items-end border p-4 rounded-lg bg-background/50 relative">
//                 <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
//                   <FormField
//                     control={form.control}
//                     name={`artists.${index}.name`}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Artist Name</FormLabel>
//                         <FormControl><Input placeholder="Name" {...field} /></FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name={`artists.${index}.role`}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Role</FormLabel>
//                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                           <FormControl>
//                             <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="MainArtist">Main Artist</SelectItem>
//                             <SelectItem value="Featured Artist">Featured Artist</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name={`artists.${index}.id`}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Artist Spotify/Apple ID</FormLabel>
//                         <FormControl><Input placeholder="ID or 'New Artist'" {...field} /></FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//                 {artistFields.length > 1 && (
//                   <Button type="button" variant="destructive" size="icon" className="mb-1" onClick={() => removeArtist(index)}>
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 )}
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* --- 3. Distribution & Identifiers --- */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Identifiers & Genres</CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="upc"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>UPC / EAN (Leave blank if auto-generate)</FormLabel>
//                   <FormControl><Input placeholder="Barcode" {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="catalogNumber"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Catalog Number</FormLabel>
//                   <FormControl><Input placeholder="e.g. LX-001" {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="primaryGenre"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Primary Genre</FormLabel>
//                   <FormControl><Input placeholder="e.g. Pop, Electronic" {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="secondaryGenre"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Secondary Genre</FormLabel>
//                   <FormControl><Input placeholder="e.g. Synthwave, Dance" {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </CardContent>
//         </Card>

//         {/* --- 4. Dates & Copyright --- */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Dates & Rights</CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="releaseDate"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Digital Release Date</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="date"
//                       value={field.value ? new Date(field.value).toISOString().substring(0, 10) : ""}
//                       onChange={(e) => field.onChange(e.target.value)}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="originalReleaseDate"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Original Release Date</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="date"
//                       value={field.value ? new Date(field.value).toISOString().substring(0, 10) : ""}
//                       onChange={(e) => field.onChange(e.target.value)}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="recordLabel"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Record Label</FormLabel>
//                   <FormControl><Input {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="parentalWarning"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Parental Advisory</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
//                     <SelectContent>
//                       <SelectItem value="No">No (Clean)</SelectItem>
//                       <SelectItem value="Yes">Yes (Explicit)</SelectItem>
//                       <SelectItem value="Cleaned">Cleaned Version</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="pLine"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>℗ Line (Phonographic Copyright)</FormLabel>
//                   <FormControl><Input placeholder="e.g. 2026 LabelX Records" {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="cLine"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>© Line (Composition Copyright)</FormLabel>
//                   <FormControl><Input placeholder="e.g. 2026 LabelX Publishing" {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </CardContent>
//         </Card>

//         {/* --- 5. Dynamic Contributors Section --- */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between unique-card-header">
//             <CardTitle>Contributors (Optional)</CardTitle>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() => appendContributor({ name: "", role: "Composer" })}
//             >
//               <Plus className="mr-2 h-4 w-4" /> Add Contributor
//             </Button>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {contributorFields.map((field, index) => (
//               <div key={field.id} className="flex gap-4 items-end border p-4 rounded-lg bg-background/50">
//                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <FormField
//                     control={form.control}
//                     name={`contributors.${index}.name`}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Name</FormLabel>
//                         <FormControl><Input placeholder="Full Name" {...field} /></FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name={`contributors.${index}.role`}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Role</FormLabel>
//                         <FormControl><Input placeholder="e.g. Composer, Lyricist, Producer" {...field} /></FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//                 <Button type="button" variant="destructive" size="icon" className="mb-1" onClick={() => removeContributor(index)}>
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//             {contributorFields.length === 0 && (
//               <p className="text-sm text-muted-foreground text-center py-4">No contributors added yet.</p>
//             )}
//           </CardContent>
//         </Card>

//         {/* --- Submit Button --- */}
//         <div className="flex justify-end gap-4">
//           <Button type="submit" size="lg" className="w-full md:w-auto px-8">
//             Create Release
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }

"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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

export default function ReleaseForm() {  
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
    
    // toast.success(res?.message || "Release created successfully");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pr-2">
      {/* <DialogHeader>
        <DialogTitle>Add New Release</DialogTitle>
        <DialogDescription>
          Fill the comprehensive form below to distribute a new album, EP, or
          single.
        </DialogDescription>
      </DialogHeader> */}

      {/* --- Section 1: Basic Metadata --- */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Basic Information
        </h3>
        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>
              Release Title <span className="text-destructive">*</span>
            </FieldLabel>
            <Input placeholder="eg. Starboy" {...register("title")} />
            <FieldError>{errors.title?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>
              Version / Subtitle <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              placeholder="eg. Radio Edit / Remix"
              {...register("version")}
            />
            <FieldError>{errors.version?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>Release Type</FieldLabel>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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
          <h3 className="text-sm font-medium text-muted-foreground">
            Artists <span className="text-destructive">*</span>
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendArtist({ name: "", role: "MainArtist", id: "" })
            }
          >
            <Plus className="h-4 w-4 mr-1" /> Add Artist
          </Button>
        </div>
        <div className="space-y-3">
          {artistFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end border p-3 rounded-md bg-muted/30 relative"
            >
              <Field>
                <FieldLabel className="text-xs">Artist Name</FieldLabel>
                <Input
                  placeholder="Name"
                  {...register(`artists.${index}.name`)}
                />
                <FieldError>
                  {errors.artists?.[index]?.name?.message}
                </FieldError>
              </Field>
              <Field>
                <FieldLabel className="text-xs">Role</FieldLabel>
                <Controller
                  control={control}
                  name={`artists.${index}.role`}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MainArtist">Main Artist</SelectItem>
                        <SelectItem value="Featured Artist">
                          Featured Artist
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <div className="flex gap-2 items-center">
                <Field className="flex-1">
                  <FieldLabel className="text-xs">Spotify/Apple ID</FieldLabel>
                  <Input
                    placeholder="ID"
                    {...register(`artists.${index}.id`)}
                  />
                  <FieldError>
                    {errors.artists?.[index]?.id?.message}
                  </FieldError>
                </Field>
                {artistFields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="shrink-0 mb-0.5"
                    onClick={() => removeArtist(index)}
                  >
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
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Genres & Identifiers
        </h3>
        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>UPC</FieldLabel>
            <Input
              placeholder="Leave blank to auto-generate"
              {...register("upc")}
            />
            <FieldError>{errors.upc?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>Catalog Number</FieldLabel>
            <Input placeholder="eg. LX-001" {...register("catalogNumber")} />
            <FieldError>{errors.catalogNumber?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>
              Primary Genre <span className="text-destructive">*</span>
            </FieldLabel>
            <Input placeholder="eg. Pop" {...register("primaryGenre")} />
            <FieldError>{errors.primaryGenre?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>
              Secondary Genre <span className="text-destructive">*</span>
            </FieldLabel>
            <Input placeholder="eg. R&B" {...register("secondaryGenre")} />
            <FieldError>{errors.secondaryGenre?.message}</FieldError>
          </Field>
        </FieldGroup>
      </div>

      {/* --- Section 4: Dates & Copyrights --- */}
      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Publishing & Rights
        </h3>
        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>
              Digital Release Date <span className="text-destructive">*</span>
            </FieldLabel>
            <Input type="date" {...register("releaseDate")} />
            <FieldError>{errors.releaseDate?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>
              Original Release Date <span className="text-destructive">*</span>
            </FieldLabel>
            <Input type="date" {...register("originalReleaseDate")} />
            <FieldError>{errors.originalReleaseDate?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>
              Record Label <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              placeholder="eg. LabelX Records"
              {...register("recordLabel")}
            />
            <FieldError>{errors.recordLabel?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>Parental Advisory</FieldLabel>
            <Controller
              control={control}
              name="parentalWarning"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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
            <FieldLabel>
              ℗ Line <span className="text-destructive">*</span>
            </FieldLabel>
            <Input placeholder="eg. 2026 LabelX" {...register("pLine")} />
            <FieldError>{errors.pLine?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>
              © Line <span className="text-destructive">*</span>
            </FieldLabel>
            <Input placeholder="eg. 2026 LabelX" {...register("cLine")} />
            <FieldError>{errors.cLine?.message}</FieldError>
          </Field>
        </FieldGroup>
      </div>

      {/* --- Section 5: Contributors (Optional Array) --- */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Contributors (Optional)
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendContributor({ name: "", role: "" })}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Contributor
          </Button>
        </div>
        <div className="space-y-3">
          {contributorFields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-3 items-end border p-3 rounded-md bg-muted/30"
            >
              <Field className="flex-1">
                <FieldLabel className="text-xs">Name</FieldLabel>
                <Input
                  placeholder="Full Name"
                  {...register(`contributors.${index}.name`)}
                />
                <FieldError>
                  {errors.contributors?.[index]?.name?.message}
                </FieldError>
              </Field>
              <Field className="flex-1">
                <FieldLabel className="text-xs">Role</FieldLabel>
                <Input
                  placeholder="eg. Composer / Producer"
                  {...register(`contributors.${index}.role`)}
                />
                <FieldError>
                  {errors.contributors?.[index]?.role?.message}
                </FieldError>
              </Field>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="shrink-0 mb-0.5"
                onClick={() => removeContributor(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}