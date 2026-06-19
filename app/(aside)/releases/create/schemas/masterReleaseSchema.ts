import { z } from "zod";

export const masterReleaseSchema = z.object({
  // Step 1: Metadata Fields
  metadataLanguage: z.string().min(1, "Metadata language is required"),
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

  // Step 2: Artwork Validation
  artwork: z
    .any()
    .refine((file) => !!file, "Artwork is required")
    .refine(
      (file) =>
        !file || file.type === "image/jpeg" || file.type === "image/jpg",
      "Format: JPG only",
    )
    .refine(
      (file) => !file || file.size <= 10 * 1024 * 1024,
      "Maximum file size: 10MB",
    )
    .superRefine(async (file, ctx) => {
      if (!file || !(file instanceof File)) return;

      const dimensions = await new Promise<{ width: number; height: number }>(
        (resolve) => {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          img.onload = () => {
            resolve({ width: img.width, height: img.height });
            URL.revokeObjectURL(img.src);
          };
        },
      );

      if (dimensions.width !== 3000 || dimensions.height !== 3000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Image must be 3000x3000px (Detected: ${dimensions.width}x${dimensions.height}px)`,
        });
      }
    }),

  // Step 3 & 4 (আপাতত অপশনাল রাখছি যাতে ক্র্যাশ না করে)
  tracks: z.array(z.any()).optional(),
  stores: z.array(z.string()).optional(),
});

export type MasterReleaseFormValues = z.infer<typeof masterReleaseSchema>;
