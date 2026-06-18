import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { artistsTable } from "@/lib/schema";
import { and, eq, ilike } from "drizzle-orm";

export async function GET(req: Request) {
  const session = await verifySession();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  const artists = await db
    .select({
      id: artistsTable.id,
      name: artistsTable.name,
    })
    .from(artistsTable)
    .where(
      and(
        eq(artistsTable.organizationId, session.session.activeOrganizationId),
        ilike(artistsTable.name, `%${query}%`),
      ),
    )
    .limit(20);

  return Response.json({
    success: true,
    data: artists,
  });
}
