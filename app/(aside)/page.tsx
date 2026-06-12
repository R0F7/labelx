import { Metadata } from "next"
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Download,
  MoreHorizontal,
  Music,
  Music2,
  Package,
  Plus,
  Search,
  Users,
  Disc,
  BarChart3,
  Globe,
  PlayCircle
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Dashboard | TuneDistro",
  description: "Music distribution analytics and management.",
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <a
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Music2 className="h-6 w-6" />
            <span className="sr-only">TuneDistro</span>
          </a>
          <a
            href="#"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Catalog
          </a>
          <a
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Analytics
          </a>
          <a
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Wallet
          </a>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search releases..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        
        {/* Header Actions */}
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Overview</h1>
            <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        New Release
                    </span>
                </Button>
            </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Listeners
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,234,299</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Payout
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,423.00</div>
              <p className="text-xs text-muted-foreground">
                Available for withdrawal
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          
          {/* Main Content Area (Tabs: Releases & Streams) */}
          <div className="xl:col-span-2">
            <Tabs defaultValue="releases" className="w-full">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="releases">Recent Releases</TabsTrigger>
                        <TabsTrigger value="streams">Top Tracks</TabsTrigger>
                    </TabsList>
                </div>
                
                <TabsContent value="releases">
                    <Card className="xl:col-span-2">
                    <CardHeader className="px-7">
                        <CardTitle>Releases</CardTitle>
                        <CardDescription>
                        Recent albums and singles distributed to stores.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Cover</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="hidden sm:table-cell">UPC</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="bg-accent/50">
                            <TableCell>
                                <div className="h-10 w-10 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-500">
                                    <Disc size={20} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">Neon Nights</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    Synthwave • Single
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                899123001
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                2023-11-24
                            </TableCell>
                            <TableCell className="text-right">
                                <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25">Live</Badge>
                            </TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>
                                <div className="h-10 w-10 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-400">
                                    <Music size={20} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">Midnight Drive</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    Lo-Fi • EP
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                899123002
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                2023-11-20
                            </TableCell>
                            <TableCell className="text-right">
                                <Badge variant="outline" className="text-amber-600 border-amber-200">Processing</Badge>
                            </TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>
                                <div className="h-10 w-10 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-400">
                                    <Music size={20} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">Summer Haze</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    Pop • Album
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                899123003
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                2023-10-15
                            </TableCell>
                            <TableCell className="text-right">
                                <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25">Live</Badge>
                            </TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>
                                <div className="h-10 w-10 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-400">
                                    <Music size={20} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">Echoes of Rain</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    Ambient • Single
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                899123004
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                2023-09-01
                            </TableCell>
                            <TableCell className="text-right">
                                <Badge variant="destructive">Rejected</Badge>
                            </TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="streams">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Performing Tracks</CardTitle>
                            <CardDescription>
                                Based on streams from Spotify, Apple Music, and Amazon.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-muted bg-background text-sm font-medium text-muted-foreground">
                                            {i}
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Track Title {i}</p>
                                            <p className="text-sm text-muted-foreground">Artist Name</p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            {/* {(Math.random() * 100000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} */}
                                            {(45231).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar (Platform Split & Actions) */}
          <div className="grid gap-4 md:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Platform Split</CardTitle>
                <CardDescription>Revenue share by DSP.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                            <PlayCircle size={16} fill="white" />
                        </div>
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">Spotify</p>
                            <p className="text-xs text-muted-foreground">62% of streams</p>
                        </div>
                    </div>
                    <div className="ml-auto font-medium">$12,450</div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-rose-500 flex items-center justify-center text-white">
                            <Music size={16} />
                        </div>
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">Apple Music</p>
                            <p className="text-xs text-muted-foreground">28% of streams</p>
                        </div>
                    </div>
                    <div className="ml-auto font-medium">$8,100</div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-sky-500 flex items-center justify-center text-white">
                            <Globe size={16} />
                        </div>
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">Amazon/Other</p>
                            <p className="text-xs text-muted-foreground">10% of streams</p>
                        </div>
                    </div>
                    <div className="ml-auto font-medium">$2,300</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                    <CardTitle>Withdraw Funds</CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                        You have earnings ready to payout.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold mb-4">$1,423.00</div>
                    <Button variant="secondary" className="w-full">
                        Request Payout
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  )
}