import { z } from "zod";

export const artworkSchema = z.object({
  artwork: z.any().refine((file) => !!file, {
    message: "Artwork is required",
  }),
});

export type ArtworkFormValues = z.infer<typeof artworkSchema>;