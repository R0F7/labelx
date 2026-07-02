import Search from "@/components/search";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  HelpCircle,
  Ticket,
} from "lucide-react";
import { ticketsTable } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { verifySession } from "@/lib/auth";
import Link from "next/link";
import { user } from "@/auth-schema";
import { paginateWithCursor } from "@/lib/pagination";
import CursorPagination from "@/components/pagination-controls";
import StatusFilter from "../status-filter";

interface PageProps {
  searchParams: Promise<{
    query?: string;
    status?: string;
    cursor?: string;
    direction?: "next" | "prev";
  }>;
}

interface PaginatedTickets {
  id: number;
  subject: string;
  status: string;
  category: string;
  creatorName: string | null;
  updatedAt: Date;
}

async function Page({ searchParams }: PageProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "closed":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-slate-400" />;
    }
  };
  const params = await searchParams;
  const session = await verifySession();
  const orgId = session.session.activeOrganizationId;

  const searchQuery = params?.query?.toLowerCase() || "";
  const statusQuery = params?.status || "";

  const cursor = params?.cursor ? Number(params.cursor) : null;
  const direction = params?.direction || "next";

  const { data, nextCursor, prevCursor, hasNextPage, hasPrevPage } =
    (await paginateWithCursor({
      table: ticketsTable,
      cursorColumn: ticketsTable.id,
      searchQueryColumn: ticketsTable.subject,
      statusQueryColumn: ticketsTable.status,
      searchQuery,
      statusQuery,
      cursor,
      direction,
      orderBy: desc(ticketsTable.createdAt),
      limit: 5,
      baseConditions: [eq(ticketsTable.organizationId, orgId)],
      joins: [
        {
          targetTable: user,
          on: eq(ticketsTable.createdBy, user.id),
          type: "left",
        },
      ],
      columns: {
        id: ticketsTable.id,
        subject: ticketsTable.subject,
        status: ticketsTable.status,
        category: ticketsTable.category,
        updatedAt: ticketsTable.updatedAt,
        creatorName: user.name,
      },
    })) as {
      data: PaginatedTickets[];
      nextCursor: string | null;
      prevCursor: string | null;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };

  const getInitials = (name: string | null) => {
    if (!name) return "US";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="lg:col-span-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Search className="w-full" />
        <StatusFilter currentStatus="all" />
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white dark:bg-zinc-900 py-12 px-4 text-center transition-all animate-in fade-in-50 duration-300">
          <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 mb-4 border border-dashed border-slate-200 dark:border-zinc-700">
            <Ticket className="h-6 w-6 stroke-[1.5]" />
          </div>

          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
            No tickets found
          </h3>

          <p className="text-xs text-muted-foreground max-w-xs mb-5 leading-relaxed">
            We couldn't find any tickets. They might have been closed, or try
            adjusting your search filters.
          </p>
        </div>
      ) : (
        <>
          <Card className="border-none shadow-sm overflow-hidden py-0">
            <div className="divide-y">
              {data.map((ticket) => (
                <Link href={`/tickets/${ticket.id}`} key={ticket.id}>
                  <div className="group flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getStatusIcon(ticket.status)}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-slate-400 font-medium">
                            TICKET-#{ticket.id}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-[10px] uppercase tracking-wider h-5"
                          >
                            {ticket.category}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                          {ticket.subject}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Updated {ticket.updatedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex flex-col items-end mr-4">
                        <div className="flex -space-x-2">
                          <div
                            title={"LabelX"}
                            className="h-6 w-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold"
                          >
                            LX
                          </div>
                          {/* <div className="h-6 w-6 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-600 font-bold">
                        AR
                      </div> */}
                          <div
                            title={ticket?.creatorName || "Unknown User"}
                            className="h-6 w-6 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-600 font-bold uppercase select-none cursor-pointer shrink-0"
                          >
                            {getInitials(ticket.creatorName)}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <CursorPagination
            nextCursor={nextCursor}
            prevCursor={prevCursor}
            hasNext={hasNextPage}
            hasPrev={hasPrevPage}
          />
        </>
      )}
    </div>
  );
}

export default Page;
