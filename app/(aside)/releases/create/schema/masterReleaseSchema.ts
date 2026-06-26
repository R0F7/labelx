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
    // .superRefine((artists, ctx) => {
    //   const ids = artists.map((a) => a.artistData.id);

    //   if (new Set(ids).size !== ids.length) {
    //     ctx.addIssue({
    //       code: z.ZodIssueCode.custom,
    //       message: "Duplicate artists are not allowed",
    //     });
    //   }
    // })
    .min(1, "At least one primary artist is required"),
  primaryGenre: z.string().min(1, "Primary genre is required"),
  secondaryGenre: z.string().optional(),
  labelData: z.object({
    id: z.string().min(1, "Label is required"),
    name: z.string(),
  }),
  upc: z.string().optional(),
  // upc: z
  // .string()
  // .regex(/^\d{12,13}$/, "UPC must be 12-13 digits")
  // .optional()
  // .or(z.literal("")),

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

  // Step 3: Tracks Schema with Metadata Validation
  tracks: z
    .array(
      z.object({
        file: z.any().refine((file) => !!file, "Audio file is required"),
        title: z.string().min(1, "Track Title is required"),
        customError: z.string().optional(),
        hash: z.string().optional(),
        duration: z.number().optional(),

        trackVersion: z.string().optional(),
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
        primaryGenre: z.string().min(1, "Primary Genre is required"),
        secondaryGenre: z.string().optional(),

        isrc: z
          .string()
          .min(1, "Click Generate to generate ISRC if you don't have one"),
        // isrc: z
        //   .string()
        //   .regex(/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/, "Invalid ISRC format")
        //   .min(1, "Click Generate to generate ISRC if you don't have one"),

        previewStart: z.string().optional(),
        //       previewStart: z
        // .string()
        // .regex(
        //   /^([0-5]?\d):([0-5]\d)$/,
        //   "Format MM:SS"
        // )
        // .optional()

        trackOrigin: z.string().min(1, "Track Origin is required"),
        explicitContent: z.string().min(1, "Please select explicit status"),
        trackLanguage: z.string().min(1, "Track Language is required"),
        isInstrumental: z.boolean().default(false),
        writers: z
          .array(
            z.object({
              role: z.string().min(1, "Role is required"),
              name: z.string().min(1, "Name is required"),
            }),
          )
          .refine(
            (writers) => {
              const hasComposer = writers.some(
                (writer) => writer.role === "Composer",
              );
              const hasLyricist = writers.some(
                (writer) => writer.role === "Lyricist",
              );

              return hasComposer && hasLyricist;
            },
            {
              message: "Both Composer and Lyricist must be added.",
            },
          ),
      }),
      //   .refine(
      //   (track) => {
      //     const hasComposer = track.writers.some((w) => w.role === "Composer");
      //     const hasLyricist = track.writers.some((w) => w.role === "Lyricist");

      //     if (track.isInstrumental) {
      //       return hasComposer; // ইন্সট্রুমেন্টাল হলে শুধু কম্পোজার থাকলেই হবে
      //     }
      //     return hasComposer && hasLyricist; // ভোকাল গান হলে দুটোই লাগবে
      //   },
      //   {
      //     message: "Vocal tracks require both Composer and Lyricist. Instrumental tracks only require a Composer.",
      //     path: ["writers"], // এরর মেসেজটি যেন writers ফিল্ডে দেখায়
      //   }
      // )
    )
    .min(1, "At least one audio track is required"),

  //step 4: stores
  stores: z.array(z.string()).optional(),
});

export type MasterReleaseFormValues = z.infer<typeof masterReleaseSchema>;
