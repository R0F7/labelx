import { and, gt, lt, desc, asc, SQL, ilike } from "drizzle-orm";
import { db } from "@/lib/db";

interface JoinParam {
  targetTable: any;
  on: SQL;
  type?: "left" | "inner";
}

interface PaginationParams {
  table: any;
  cursorColumn?: any;
  searchQueryColumn: any;
  cursorKey?: string;
  baseConditions?: (SQL | undefined)[];
  searchQuery?: string;
  cursor?: number | null;
  direction?: "next" | "prev";
  limit?: number;
  columns?: any;
  joins?: JoinParam[]; // নতুন যোগ করা হলো
}

export async function paginateWithCursor<T extends Record<string, any>>({
  table,
  cursorColumn,
  searchQueryColumn,
  cursorKey = "id",
  baseConditions = [],
  searchQuery,
  cursor,
  direction = "next",
  limit = 5,
  columns,
  joins,
}: PaginationParams) {
  let conditions = [...baseConditions].filter(Boolean);

  if (searchQueryColumn && searchQuery) {
    conditions.push(ilike(searchQueryColumn, `%${searchQuery}%`));
  }

  if (cursor) {
    if (direction === "next") {
      conditions.push(gt(cursorColumn, cursor));
    } else {
      conditions.push(lt(cursorColumn, cursor));
    }
  }

  let query: any = columns
    ? db.select(columns).from(table)
    : db.select().from(table);

  if (joins && joins.length > 0) {
    for (const j of joins) {
      if (j.type === "inner") {
        query = query.innerJoin(j.targetTable, j.on);
      } else {
        query = query.leftJoin(j.targetTable, j.on);
      }
    }
  }

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