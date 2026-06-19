import { z } from "zod";

export const metadataSchema = z.object({
  metadataLanguage: z.string().min(1, "Language is required"),
  releaseType: z.string().min(1, "Release type is required"),
  releaseTitle: z.string().min(1, "Release title is required"),
  titleVersion: z.string().optional(),
  artists: z
    .array(
      z.object({
        artistType: z.string().min(1, "Artist type is required"),
        artistData: z.object({
          id: z.string().min(1, "Artist is required"),
          name: z.string(),
        }),
      }),
    )
    .min(1, "At least one primary artist is required"),
  primaryGenre: z.string().min(1, "Primary genre is required"),
  secondaryGenre: z.string().optional(),
  labelData: z.object({
    id: z.string().min(1, "Label is required"),
    name: z.string(),
  }),
  upc: z.string().optional(),
originalReleaseDate: z.string().min(1, "Original release date is required"),
releaseDate: z.string().min(1, "Digital release date is required"),
});

export type MetadataFormValues = z.infer<typeof metadataSchema>;