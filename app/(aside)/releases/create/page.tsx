import { verifySession } from "@/lib/auth";
import ReleaseForm from "./release-form";
import { db } from "@/lib/db";
import { releasesTable } from "@/lib/schema";
import { and, eq } from "drizzle-orm";

export default async function CreateReleasePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const session = await verifySession();
  const orgId = session.session.activeOrganizationId;

  let releaseData = null;

  if (id) {
    const releaseId = Number(id);

    if (!isNaN(releaseId)) {
      releaseData = await db.query.releasesTable.findFirst({
        where: and(
          eq(releasesTable.id, releaseId),
          eq(releasesTable.organizationId, orgId),
        ),

        with: {
          tracks: true,
          label: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });
    }
  }

  return (
    <section className="p-4">
      <div className="max-w-5xl mx-auto">
        <ReleaseForm initialData={releaseData} key={releaseData?.id}/>
      </div>
    </section>
  );
}
