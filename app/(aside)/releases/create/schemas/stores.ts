import { z } from "zod";

export const storesSchema = z.object({
  stores: z
    .array(z.string())
    .min(1, "Please select at least one store"),
});

export type StoresFormValues = z.infer<typeof storesSchema>;