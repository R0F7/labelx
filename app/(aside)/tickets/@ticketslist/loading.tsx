import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function TicketsSkeleton() {
  return (
    <div className="lg:col-span-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-[160px] shrink-0" />
      </div>

      {/* Tickets List Container Card */}
      <Card className="border-none shadow-sm overflow-hidden py-0">
        <div className="divide-y">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900"
            >
              <div className="flex items-start gap-4 w-full max-w-[70%]">
                <Skeleton className="h-4 w-4 rounded-full mt-1 shrink-0" />

                <div className="space-y-2 w-full">
                  {/* Meta Row: Ticket ID & Category Badge */}
                  <div className="flex items-center gap-2">
                    {/* Ticket ID Text */}
                    <Skeleton className="h-3 w-16" />
                    {/* Category Badge */}
                    <Skeleton className="h-5 w-20" />
                  </div>

                  {/* Subject Line Skeleton */}
                  <Skeleton className="h-5 w-4/5 sm:w-2/3" />

                  {/* Updated Date Skeleton */}
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>

              {/* Right Side: Avatar Stack + Chevron Icon */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="hidden sm:flex flex-col items-end mr-4">
                  <div className="flex -space-x-2">
                    <Skeleton className="h-6 w-6 rounded-full border-2 border-white dark:border-zinc-900" />
                    <Skeleton className="h-6 w-6 rounded-full border-2 border-white dark:border-zinc-900" />
                  </div>
                </div>
                {/* Chevron Right Icon Skeleton */}
                <Skeleton className="h-5 w-5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Pagination Controls Skeleton */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-8 w-[92px]" />
        <Skeleton className="h-8 w-[68px]" />
      </div>
    </div>
  );
}