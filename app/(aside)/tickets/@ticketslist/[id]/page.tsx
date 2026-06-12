// import { Button } from "@/components/ui/button";
// import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowBendUpLeftIcon } from "@phosphor-icons/react/dist/ssr";
// import React from "react";

// function Page() {
//   return (
//     <>
//       <div className="lg:col-span-8 space-y-4">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2"> <Button variant="ghost" size={'icon'}><ArrowBendUpLeftIcon size={20}/></Button> Lorem ipsum dolor sit amet.</CardTitle>
//             <CardDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, eius?</CardDescription>
//           </CardHeader>
//         </Card>
//       </div>
//     </>
//   );
// }

// export default Page;

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component
import {
  ArrowBendUpLeftIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
} from "@phosphor-icons/react/dist/ssr";
import React from "react";
import Link from "next/link";

function Page() {
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
            TICKET-#1024
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
                  In Progress
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <ClockIcon size={14} /> 2 hours ago
                </span>
              </div>
              <CardTitle className="text-2xl font-bold leading-tight">
                Lorem ipsum dolor sit amet consectetur.
              </CardTitle>
              <CardDescription className="text-base pt-2">
                Detailed description of the ticket goes here. This captures the
                core issue or data label requirement.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-sm dark:prose-invert">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Ullam, eius? Architecto, unde! Repellendus, quos. This section
                  acts as the primary body for your data parsing notes or ticket
                  history.
                </p>
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
                <span className="font-medium">John Doe</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <TagIcon size={16} /> Label Group
                </span>
                <Badge variant="outline">Logistics</Badge>
              </div>
              <hr className="border-muted" />
              <div className="pt-2">
                <Button className="w-full" size="sm">
                  Update Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Page;
