import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { labelsTable } from "@/lib/schema";
import { and, eq, ilike } from "drizzle-orm";

export async function GET(req: Request) {
  const session = await verifySession();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  const labels = await db
    .select({
      id: labelsTable.id,
      name: labelsTable.name,
    })
    .from(labelsTable)
    .where(
      and(
        eq(labelsTable.organizationId, session.session.activeOrganizationId),
        ilike(labelsTable.name, `%${query}%`),
      ),
    )
    .limit(20);

  return Response.json({
    success: true,
    data: labels,
  });
}
