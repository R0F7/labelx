import { z } from "zod";

export const trackSchema = z.object({
  title: z.string().min(1),

  version: z.string().optional(),

  primaryGenre: z.string().min(1),

  secondaryGenre: z.string().optional(),

  isrc: z.string().optional(),

  previewStartTime: z.number().default(30),

  trackOrigin: z.string().optional(),

  explicitContent: z.boolean().default(false),

  language: z.string().optional(),

  instrumental: z.boolean().default(false),

  audioFile: z.any(),
});

export const tracksSchema = z.object({
  tracks: z.array(trackSchema).min(1),
});

export type TracksFormValues = z.infer<typeof tracksSchema>;