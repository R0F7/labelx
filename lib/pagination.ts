import { and, gt, lt, desc, asc, SQL } from "drizzle-orm";
import { db } from "@/lib/db";

interface PaginationParams {
  table: any;
  cursorColumn: any; 
  cursorKey?: string; 
  baseConditions?: (SQL | undefined)[];
  cursor?: number | null;
  direction?: "next" | "prev";
  limit?: number;
  columns?: any;
}

export async function paginateWithCursor<T extends Record<string, any>>({
  table,
  cursorColumn,
  cursorKey = "id",
  baseConditions = [],
  cursor,
  direction = "next",
  limit = 5,
  columns,
}: PaginationParams) {
  let conditions = [...baseConditions].filter(Boolean);

  if (cursor) {
    if (direction === "next") {
      conditions.push(gt(cursorColumn, cursor));
    } else {
      conditions.push(lt(cursorColumn, cursor));
    }
  }

  let query = columns ? db.select(columns).from(table) : db.select().from(table);

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  query = query
    .orderBy(direction === "prev" ? desc(cursorColumn) : asc(cursorColumn))
    .limit(limit + 1);

  const data = (await query) as T[];

  const hasMore = data.length > limit;
  const paginated = hasMore ? data.slice(0, limit) : data;

  if (direction === "prev") {
    paginated.reverse();
  }

  const firstItem = paginated[0];
  const lastItem = paginated[paginated.length - 1];

  let hasNextPage = false;
  let hasPrevPage = false;

  if (!cursor) {
    hasNextPage = hasMore;
    hasPrevPage = false;
  } else if (direction === "next") {
    hasNextPage = hasMore;
    hasPrevPage = true;
  } else if (direction === "prev") {
    hasNextPage = true;
    hasPrevPage = hasMore;
  }

  return {
    data: paginated,
    nextCursor: lastItem ? String(lastItem[cursorKey]) : null,
    prevCursor: firstItem ? String(firstItem[cursorKey]) : null,
    hasNextPage,
    hasPrevPage,
  };
}