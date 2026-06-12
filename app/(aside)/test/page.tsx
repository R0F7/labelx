import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { artistsTable, releasesTable } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import React from "react";

async function Page() {
  // const data = await db
  //   .select()
  //   .from(releasesTable)
  //   .where(
  //     // Checks if the JSONB array contains an object with the key "id" and value 2
  //     sql`${releasesTable.artists} @> ${JSON.stringify([{ id: 1 }])}`,
  //   );
  // console.log(data);
  return (
    <>
      <div>Page</div>
    </>
  );
}

export default Page;
