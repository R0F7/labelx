import Search from "@/components/search";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  HelpCircle,
  SlidersHorizontal,
} from "lucide-react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/db";
import { ticketsTable } from "@/lib/schema";
import { and, desc, eq } from "drizzle-orm";
import { verifySession } from "@/lib/auth";
import Link from "next/link";

const TICKETS = [
  {
    id: "T-1024",
    subject: "Spotify Upload Delay - Album 'Echoes'",
    status: "open",
    priority: "high",
    category: "Distribution",
    date: "2 hours ago",
  },
  {
    id: "T-1021",
    subject: "Incorrect Royalty Calculation Dec 2025",
    status: "pending",
    priority: "medium",
    category: "Finances",
    date: "1 day ago",
  },
  {
    id: "T-1018",
    subject: "Artist Name Mapping on Apple Music",
    status: "closed",
    priority: "low",
    category: "Metadata",
    date: "3 days ago",
  },
  {
    id: "T-1015",
    subject: "WAV File Corrupted during upload",
    status: "open",
    priority: "high",
    category: "Technical",
    date: "4 days ago",
  },
];

async function Page() {
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
  const session = await verifySession();
  const tickets = await db
    .select()
    .from(ticketsTable)
    .where(
      and(
        eq(ticketsTable.organizationId, session.session?.activeOrganizationId!),
        eq(ticketsTable.createdBy, session.user.id),
      ),
    )
    .orderBy(desc(ticketsTable.createdAt))
    .limit(5);

  console.log(tickets);

  return (
    <div className="lg:col-span-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Search className="w-full" />
        <Select defaultValue="all">
          <SelectTrigger className="w-[160px] bg-white">
            <SlidersHorizontal className="mr-2 h-4 w-4 opacity-50" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="border-none shadow-sm overflow-hidden py-0">
        <div className="divide-y">
          {tickets.map((ticket) => (
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
                      <div className="h-6 w-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                        LX
                      </div>
                      <div className="h-6 w-6 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-600 font-bold">
                        AR
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
    </div>
  );
}

export default Page;
