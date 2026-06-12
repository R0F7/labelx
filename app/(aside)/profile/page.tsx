import React, { Suspense } from "react";
import {
  User,
  Settings,
  ShieldCheck,
  Bell,
  Key,
  Cloud,
  Zap,
  Github,
  Mail,
  ExternalLink,
  Plus,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Capitalize } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FingerprintIcon,
  SignOut,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import Form from "next/form";
import { authClient } from "@/lib/auth-client";
import RevokeSession from "./revoke-session";
import { revokeSession } from "./actions";

export default function ProfilePage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* LEFT COLUMN: User Brief */}
        <Suspense
          fallback={
            <div className="md:col-span-4 lg:col-span-3 space-y-6">
              <Skeleton className="w-full h-full" />
            </div>
          }
        >
          <UserCard />
        </Suspense>

        {/* RIGHT COLUMN: Settings & Details */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList>
              <TabsTrigger value="general">
                <Settings className="h-4 w-4" /> General
              </TabsTrigger>
              <TabsTrigger value="session">
                <FingerprintIcon className="h-4 w-4" /> Sessions
              </TabsTrigger>
              <TabsTrigger value="security">
                <ShieldCheck className="h-4 w-4" /> Security
              </TabsTrigger>
              <TabsTrigger value="api">
                <Zap className="h-4 w-4" /> API Keys
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4" /> Notifications
              </TabsTrigger>
            </TabsList>

            {/* General Settings Tab */}
            <TabsContent value="general">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your public identity and data preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Alex" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Parser" />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="bio">Professional Bio</Label>
                      <textarea
                        id="bio"
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Focusing on real-time data ingestion pipelines..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <Suspense fallback={<div></div>}>
              <SessionTab />
            </Suspense>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your authentication methods and sessions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm">
                          Two-Factor Authentication
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    <Switch checked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-sm">
                        Active Sessions
                      </span>
                      <p className="text-xs text-muted-foreground">
                        You are currently logged in from 3 locations.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage Sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Tab - Specifically for your data-heavy background */}
            <TabsContent value="api">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>API Access Tokens</CardTitle>
                      <CardDescription>
                        Authenticate your external data scripts.
                      </CardDescription>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" /> Generate New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      name: "Production Parser",
                      key: "pk_live_4920...321",
                      status: "Active",
                    },
                    {
                      name: "Dev-Staging",
                      key: "pk_test_8812...009",
                      status: "Revoked",
                    },
                  ].map((token) => (
                    <div
                      key={token.name}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <Cloud className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{token.name}</p>
                          <code className="text-[10px] bg-slate-100 dark:bg-slate-800 p-1 rounded">
                            {token.key}
                          </code>
                        </div>
                      </div>
                      <Badge
                        variant={
                          token.status === "Active" ? "secondary" : "outline"
                        }
                      >
                        {token.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

async function UserCard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className="md:col-span-4 lg:col-span-3 space-y-6">
      <Card className="border-none shadow-sm overflow-hidden py-0">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <CardContent className="relative pt-0 text-center">
          <Avatar className="h-24 w-24 border-4 border-white mx-auto -mt-12 mb-4 shadow-xl">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>
              <UserIcon className="size-12" />
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold">{session?.user?.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 italic">
            @{session?.user?.username || session?.user?.email}
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">
              {Capitalize(session?.user?.role || "")}
            </Badge>
          </div>
        </CardContent>
        <Separator />
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
            <Mail className="h-4 w-4" /> {session?.user?.email}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function SessionTab() {
  const sessions = await auth.api.listSessions({
    headers: await headers(),
  });

  return (
    <TabsContent value="session">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
          <CardDescription>
            You have {sessions?.length || 0} sessions active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full flex-col gap-4">
            {sessions && sessions.length > 0 ? (
              sessions.map((session) => (
                <Item key={session.id} variant="outline">
                  <ItemContent>
                    <ItemTitle>
                      {session.ipAddress || "Unknown Device"}
                    </ItemTitle>
                    <ItemDescription>
                      Last active:{" "}
                      {new Date(session.updatedAt).toLocaleString()}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Form action={revokeSession}>
                      <input type="hidden" name="token" value={session.token} />
                      <Button>
                        <SignOut className="size-4" />
                      </Button>
                    </Form>
                  </ItemActions>
                </Item>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active sessions found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

// import React from "react";
// import { Metadata } from "next";
// import {
//   User,
//   Settings,
//   Database,
//   Activity,
//   MapPin,
//   Calendar,
//   ExternalLink,
//   ChevronRight
// } from "lucide-react";

// // shadcn/ui components (Assumed paths)
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export const metadata: Metadata = {
//   title: "Profile | Data Engineer",
//   description: "Advanced analytics and profile dashboard",
// };

// // --- SSR Data Fetching ---
// async function getProfileData() {
//   // Simulate fetching/parsing millions of records
//   return {
//     user: {
//       name: "Alex Rivera",
//       role: "Senior Data Architect",
//       location: "San Francisco, CA",
//       joined: "March 2022",
//       avatar: "https://github.com/shadcn.png",
//       bio: "Specializing in real-time stream processing and high-throughput data pipelines. Currently parsing millions of events per second.",
//     },
//     metrics: [
//       { label: "Data Points Parsed", value: "2.4B", icon: Database },
//       { label: "Uptime", value: "99.99%", icon: Activity },
//       { label: "Projects", value: "142", icon: User },
//     ]
//   };
// }

// export default async function ProfilePage() {
//   const data = await getProfileData();

//   return (
//     <div className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
//       <div className="mx-auto max-w-5xl space-y-8">

//         {/* Header Section (ReUI/Kibo inspired) */}
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center gap-5">
//             <div className="relative">
//               <Avatar className="h-20 w-20 border-2 border-primary/10">
//                 <AvatarImage src={data.user.avatar} />
//                 <AvatarFallback>AR</AvatarFallback>
//               </Avatar>
//               <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
//             </div>
//             <div className="space-y-1">
//               <h1 className="text-2xl font-bold tracking-tight">{data.user.name}</h1>
//               <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
//                 <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {data.user.location}</span>
//                 <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Joined {data.user.joined}</span>
//               </div>
//             </div>
//           </div>
//           <div className="flex gap-3 w-full md:w-auto">
//             <Button variant="outline" size="sm" className="flex-1 md:flex-none">
//               <Settings className="mr-2 h-4 w-4" /> Settings
//             </Button>
//             <Button size="sm" className="flex-1 md:flex-none bg-primary text-primary-foreground">
//               Follow
//             </Button>
//           </div>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//           {/* Left Column: Stats & Info */}
//           <div className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
//                   Performance Metrics
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {data.metrics.map((item) => (
//                   <div key={item.label} className="flex items-center justify-between group cursor-default">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 rounded-md bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
//                         <item.icon className="h-4 w-4" />
//                       </div>
//                       <span className="text-sm font-medium">{item.label}</span>
//                     </div>
//                     <span className="text-sm font-bold">{item.value}</span>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="pt-6 space-y-4">
//                 <div className="space-y-2">
//                   <h4 className="text-sm font-medium">Expertise</h4>
//                   <div className="flex flex-wrap gap-2">
//                     {["Next.js", "Rust", "Apache Kafka", "ClickHouse"].map(tag => (
//                       <Badge key={tag} variant="secondary" className="rounded-md font-mono text-[10px]">
//                         {tag}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Column: Content Tabs */}
//           <div className="lg:col-span-2 space-y-6">
//             <Tabs defaultValue="overview" className="w-full">
//               <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 gap-6">
//                 <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-2">Overview</TabsTrigger>
//                 <TabsTrigger value="projects" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-2">Projects</TabsTrigger>
//                 <TabsTrigger value="activity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-2">Activity</TabsTrigger>
//               </TabsList>

//               <TabsContent value="overview" className="pt-6 space-y-6">
//                 <div className="prose prose-sm dark:prose-invert max-w-none">
//                   <h3 className="text-lg font-semibold text-foreground">About Me</h3>
//                   <p className="text-muted-foreground leading-relaxed">
//                     {data.user.bio}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
//                     <CardHeader className="p-4">
//                       <div className="flex justify-between items-start">
//                         <CardTitle className="text-base font-medium">High-Load Parser</CardTitle>
//                         <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
//                       </div>
//                       <CardDescription>Optimized Node.js worker for processing multi-terabyte JSON streams.</CardDescription>
//                     </CardHeader>
//                   </Card>

//                   <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
//                     <CardHeader className="p-4">
//                       <div className="flex justify-between items-start">
//                         <CardTitle className="text-base font-medium">Analytics Engine</CardTitle>
//                         <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
//                       </div>
//                       <CardDescription>Real-time dashboarding with 50ms latency over 100M rows.</CardDescription>
//                     </CardHeader>
//                   </Card>
//                 </div>
//               </TabsContent>

//               <TabsContent value="projects" className="pt-6 text-center text-muted-foreground">
//                 Load more projects...
//               </TabsContent>
//             </Tabs>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }
