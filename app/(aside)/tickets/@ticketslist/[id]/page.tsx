import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowBendUpLeftIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ticketsTable } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { user } from "@/auth-schema";
import UpdateTicket from "../../update-ticket";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await verifySession();
  const orgId = session.session.activeOrganizationId;
  const conditions = [
    eq(ticketsTable.id, Number(id)),
    eq(ticketsTable.organizationId, orgId),
  ];

  const [ticket] = await db
    .select({
      id: ticketsTable.id,
      subject: ticketsTable.subject,
      status: ticketsTable.status,
      chats: ticketsTable.chats,
      createdAt: ticketsTable.createdAt,
      creatorName: user.name,
    })
    .from(ticketsTable)
    .where(and(...conditions))
    .leftJoin(user, eq(ticketsTable.createdBy, user.id))
    .limit(1);

  return (
    <div className="lg:col-span-8 space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href={"/tickets"}>
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowBendUpLeftIcon size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-sm text-muted-foreground">Back to Tickets</h1>
          <p className="text-xs font-mono uppercase tracking-tight text-muted-foreground/60">
            TICKET-#{ticket.id}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-6">
              <div className="flex justify-between items-start mb-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                >
                  {ticket.status}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <ClockIcon size={14} />
                  {formatDistanceToNow(new Date(ticket.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <CardTitle className="text-2xl font-bold leading-tight">
                {ticket.subject}
              </CardTitle>
              <CardDescription className="text-base pt-2">
                {ticket.chats[0].message}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-sm dark:prose-invert">
                {ticket.chats && ticket.chats.length > 1 ? (
                  ticket.chats.slice(1).map((chat, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-start py-2 border-b last:border-b-0"
                    >
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        {chat.message}
                      </p>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                        <ClockIcon size={14} />
                        {formatDistanceToNow(new Date(chat.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                    <p className="text-sm text-muted-foreground font-medium">
                      No replies yet
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      As soon as there is a response, it will appear here.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar for Metadata/Attributes */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <UserIcon size={16} /> Assignee
                </span>
                <span className="font-medium">{ticket.creatorName}</span>
              </div>
              {/* <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <TagIcon size={16} /> Label Group
                </span>
                <Badge variant="outline">Logistics</Badge>
              </div> */}
              <hr className="border-muted" />
              <div className="pt-2">
                <UpdateTicket key={ticket.id} ticketId={ticket.id} currentStatus={ticket.status} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Page;
