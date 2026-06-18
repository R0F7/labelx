// import { z } from "zod";

// export const metadataSchema = z.object({
//   metadataLanguage: z.string().min(1, "Language is required"),
//   releaseType: z.string().min(1, "Release type is required"),
//   releaseTitle: z.string().min(1, "Release title is required"),
//   titleVersion: z.string().optional(),
//   artistType: z.string().min(1, "Artist type is required"),
//   artistName: z.string().min(1, "Artist name is required"),
//   primaryGenre: z.string().min(1, "Primary genre is required"),
//   secondaryGenre: z.string().optional(),
//   labelId: z.string().min(1, "Label is required"),
//   upc: z.string().optional(),
//   originalReleaseDate: z.string().min(1),
//   releaseDate: z.string().min(1),
// });

// export type MetadataFormValues = z.infer<typeof metadataSchema>;

import { z } from "zod";

export const metadataSchema = z.object({
  metadataLanguage: z.string().min(1, "Language is required"),
  releaseType: z.string().min(1, "Release type is required"),
  releaseTitle: z.string().min(1, "Release title is required"),
  titleVersion: z.string().optional(),
  artists: z.array(
    z.object({
      artistType: z.string().min(1, "Artist type is required"),
      artistId: z.string().min(1, "Artist name is required")
      // artistName: z.string().min(1, "Artist name is required"),
    })
  ).min(1, "At least one primary artist is required"),

  primaryGenre: z.string().min(1, "Primary genre is required"),
  secondaryGenre: z.string().optional(),
  labelId: z.string().min(1, "Label is required"),
  upc: z.string().optional(),
  originalReleaseDate: z.string().min(1),
  releaseDate: z.string().min(1),
});

export type MetadataFormValues = z.infer<typeof metadataSchema>;