"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- Zod Schema Definition ---
export const releaseSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  version: z.string().trim().min(1, "Version is required"),
  type: z.enum(["Single", "EP", "Album"]),
  artists: z.array(
    z.object({
      name: z.string().trim().min(1, "Artist name is required"),
      role: z.enum(["MainArtist", "Featured Artist"]),
      id: z.string().trim().min(1, "Artist ID is required"),
    })
  ).min(1, "At least one artist is required"),
  metadataLanguage: z.string().min(1, "Language is required"),
  upc: z.string().optional(),
  catalogNumber: z.string().optional(),
  primaryGenre: z.string().trim().min(1, "Primary genre is required"),
  secondaryGenre: z.string().trim().min(1, "Secondary genre is required"),
  releaseDate: z.coerce.date({ required_error: "Release date is required" }),
  originalReleaseDate: z.coerce.date({ required_error: "Original release date is required" }),
  parentalWarning: z.string().min(1, "Parental warning option is required"),
  recordLabel: z.string().trim().min(1, "Record label is required"),
  pLine: z.string().trim().min(1, "P Line is required"),
  cLine: z.string().trim().min(1, "C Line is required"),
  contributors: z
    .array(
      z.object({
        name: z.string().min(1, "Contributor name is required"),
        role: z.string().min(1, "Role is required"), // z.enum([]) কে ফিক্স করা হয়েছে টেস্ট করার সুবিধার্থে
      })
    )
    .optional()
    .default([]),
});

type ReleaseFormValues = z.infer<typeof releaseSchema>;

export default function ReleaseForm() {
  const form = useForm<ReleaseFormValues>({
    resolver: zodResolver(releaseSchema),
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

  // --- Field Arrays for Dynamic Inputs ---
  const { fields: artistFields, append: appendArtist, remove: removeArtist } = useFieldArray({
    control: form.control,
    name: "artists",
  });

  const { fields: contributorFields, append: appendContributor, remove: removeContributor } = useFieldArray({
    control: form.control,
    name: "contributors",
  });

  function onSubmit(data: ReleaseFormValues) {
    console.log("Submitted Data:", data);
    // আপনার API কল বা DB অ্যাকশন এখানে হ্যান্ডেল করবেন
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto p-6">
        
        {/* --- 1. Basic Info Section --- */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control, form.register}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release Title</FormLabel>
                  <FormControl><Input placeholder="e.g. Moonlight Serenade" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version / Subtitle</FormLabel>
                  <FormControl><Input placeholder="e.g. Radio Edit, Instrumental" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="EP">EP</SelectItem>
                      <SelectItem value="Album">Album</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metadataLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metadata Language</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* --- 2. Dynamic Artists Section --- */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between unique-card-header">
            <CardTitle>Artists</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendArtist({ name: "", role: "MainArtist", id: "" })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Artist
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {artistFields.map((field, index) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-4 items-end border p-4 rounded-lg bg-background/50 relative">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <FormField
                    control={form.control}
                    name={`artists.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Artist Name</FormLabel>
                        <FormControl><Input placeholder="Name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`artists.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MainArtist">Main Artist</SelectItem>
                            <SelectItem value="Featured Artist">Featured Artist</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`artists.${index}.id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Artist Spotify/Apple ID</FormLabel>
                        <FormControl><Input placeholder="ID or 'New Artist'" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {artistFields.length > 1 && (
                  <Button type="button" variant="destructive" size="icon" className="mb-1" onClick={() => removeArtist(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* --- 3. Distribution & Identifiers --- */}
        <Card>
          <CardHeader>
            <CardTitle>Identifiers & Genres</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="upc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UPC / EAN (Leave blank if auto-generate)</FormLabel>
                  <FormControl><Input placeholder="Barcode" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="catalogNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catalog Number</FormLabel>
                  <FormControl><Input placeholder="e.g. LX-001" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primaryGenre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Genre</FormLabel>
                  <FormControl><Input placeholder="e.g. Pop, Electronic" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secondaryGenre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Genre</FormLabel>
                  <FormControl><Input placeholder="e.g. Synthwave, Dance" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* --- 4. Dates & Copyright --- */}
        <Card>
          <CardHeader>
            <CardTitle>Dates & Rights</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="releaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Digital Release Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      value={field.value ? new Date(field.value).toISOString().substring(0, 10) : ""} 
                      onChange={(e) => field.onChange(e.target.value)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="originalReleaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Release Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      value={field.value ? new Date(field.value).toISOString().substring(0, 10) : ""} 
                      onChange={(e) => field.onChange(e.target.value)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recordLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Record Label</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentalWarning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parental Advisory</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="No">No (Clean)</SelectItem>
                      <SelectItem value="Yes">Yes (Explicit)</SelectItem>
                      <SelectItem value="Cleaned">Cleaned Version</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pLine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>℗ Line (Phonographic Copyright)</FormLabel>
                  <FormControl><Input placeholder="e.g. 2026 LabelX Records" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cLine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>© Line (Composition Copyright)</FormLabel>
                  <FormControl><Input placeholder="e.g. 2026 LabelX Publishing" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* --- 5. Dynamic Contributors Section --- */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between unique-card-header">
            <CardTitle>Contributors (Optional)</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendContributor({ name: "", role: "Composer" })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Contributor
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {contributorFields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-end border p-4 rounded-lg bg-background/50">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`contributors.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input placeholder="Full Name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`contributors.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl><Input placeholder="e.g. Composer, Lyricist, Producer" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="button" variant="destructive" size="icon" className="mb-1" onClick={() => removeContributor(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {contributorFields.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No contributors added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* --- Submit Button --- */}
        <div className="flex justify-end gap-4">
          <Button type="submit" size="lg" className="w-full md:w-auto px-8">
            Create Release
          </Button>
        </div>
      </form>
    </Form>
  );
}