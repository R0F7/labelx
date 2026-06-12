import React from "react";
import ReleaseCard from "./release-card";

// import Image from "next/image";
// import { verifySession } from "@/lib/auth";
// import { db } from "@/lib/db";
// import { releasesTable } from "@/lib/schema";

async function ReleaseGrid() {
  // const session = await verifySession();
  // const releases = await db.select().from(releasesTable);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* {releases.map((release, i) => ( */}
          <ReleaseCard
            release={{
              title: "release.title",
              id: 1,
              // image: "release.artwork!",
              status: "approve",
              artists: ["Alan", "Walker"],
            }}
            // key={i}
          />
        {/* ))} */}
      </div>
    </>
  );
}

export default ReleaseGrid;
