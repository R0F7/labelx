import { drizzle } from "drizzle-orm/node-postgres";
// import * as schema from "./../auth-schema";

import * as appSchema from "@/lib/schema";
import * as authSchema from "@/auth-schema";

export const db = drizzle(process.env.DATABASE_URL!, {
  // schema: schema,
    schema: {
    ...authSchema,
    ...appSchema,
  },
});
