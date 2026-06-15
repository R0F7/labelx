import { db } from "@/lib/db";
import { labelsTable } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import LabelDetails from "../_components/label-details";
import { verifySession } from "@/lib/auth";
import { organization, user } from "@/auth-schema";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await verifySession();
  const orgId = session.session.activeOrganizationId;
  const conditions = [
    eq(labelsTable.id, Number(id)),
    eq(labelsTable.organizationId, orgId),
  ];

  const [label] = await db
    .select()
    .from(labelsTable)
    .where(and(...conditions))
    // .leftJoin(user, eq(labelsTable.createdBy, user.id))
    // .leftJoin(organization, eq(labelsTable.organizationId, organization.id))
    .limit(1);

  if (!label) {
    return <div className="p-6 text-muted-foreground">Label not found</div>;
  }

  return <LabelDetails label={label} />;
}
