import React from "react";
import {
  ChevronRight,
  Music2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateTicket } from "./create-ticket";

function Layout({
  children,
  ticketslist,
}: {
  children: React.ReactNode;
  ticketslist: React.ReactNode;
}) {
  return (
    <>
      <div className="flex-1 space-y-6 p-6 min-h-screen">
        {/* Header with LabelX Branding */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Support Center
              </h2>
              <p className="text-muted-foreground text-sm">
                Need help with your distribution or royalties?
              </p>
            </div>
          </div>
          <CreateTicket />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Filters - 4 columns on large screens */}

          {/* <Suspense fallback={<TicketsSkeleton />}> */}
          {ticketslist}
          {/* </Suspense> */}

          {/* Action Sidebar - 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-indigo-900 text-white border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Music2 className="h-5 w-5" /> Distribution Help
                </CardTitle>
                <CardDescription className="text-indigo-200">
                  Fast-track your issues by selecting a specific area.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  className="bg-white/10 border-none text-white hover:bg-white/20 text-xs justify-start h-12"
                >
                  Royalties
                </Button>
                <Button
                  variant="secondary"
                  className="bg-white/10 border-none text-white hover:bg-white/20 text-xs justify-start h-12"
                >
                  Takedowns
                </Button>
                <Button
                  variant="secondary"
                  className="bg-white/10 border-none text-white hover:bg-white/20 text-xs justify-start h-12"
                >
                  ID Mapping
                </Button>
                <Button
                  variant="secondary"
                  className="bg-white/10 border-none text-white hover:bg-white/20 text-xs justify-start h-12"
                >
                  Store Link
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Knowledge Base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm group cursor-pointer hover:text-indigo-600">
                  <span className="text-muted-foreground group-hover:text-indigo-600">
                    Distribution Timelines
                  </span>
                  <ChevronRight size={14} />
                </div>
                <div className="flex items-center justify-between text-sm group cursor-pointer hover:text-indigo-600">
                  <span className="text-muted-foreground group-hover:text-indigo-600">
                    Royalty Reporting FAQ
                  </span>
                  <ChevronRight size={14} />
                </div>
                <div className="flex items-center justify-between text-sm group cursor-pointer hover:text-indigo-600">
                  <span className="text-muted-foreground group-hover:text-indigo-600">
                    YouTube Content ID
                  </span>
                  <ChevronRight size={14} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
