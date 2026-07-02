import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function TicketDetailSkeleton() {
  return (
    <div className="lg:col-span-8 space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* LEFT SIDE: Main Chat Content */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-shadow-sm bg-white dark:bg-zinc-900">
            <CardHeader className="border-b bg-muted/20 pb-6 space-y-3">
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              
              <Skeleton className="h-7 w-5/6 sm:w-2/3" />
              
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start py-3 border-b border-slate-100 dark:border-zinc-800 last:border-b-0"
                  >
                    {/* Reply Message Placeholder */}
                    <div className="space-y-2 w-2/3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    {/* Reply Timestamp Placeholder */}
                    <Skeleton className="h-3 w-16 shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE: Sidebar Details */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white dark:bg-zinc-900">
            <CardHeader>
              <Skeleton className="h-4 w-12" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              
              <hr className="border-muted" />
              
              <div className="pt-2">
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}