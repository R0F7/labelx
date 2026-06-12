"use client";

import React, { useState, useMemo } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Music,
  CreditCard as CardIcon,
  Filter,
  Download,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Example from "./credit-card";
import { MagicCard } from "@/components/ui/magic-card";

// --- Mock Data Types ---
type Transaction = {
  id: string;
  source: string;
  status: "Success" | "Processing" | "Failed";
  date: string; // ISO format for easy sorting
  amount: number;
  type: "in" | "out";
  category: "Streaming" | "Withdrawal" | "Batch";
};

const RAW_DATA: Transaction[] = [
  {
    id: "1",
    source: "Spotify Q4 2025",
    status: "Success",
    date: "2026-01-12",
    amount: 2450.0,
    type: "in",
    category: "Batch",
  },
  {
    id: "2",
    source: "Apple Music Monthly",
    status: "Success",
    date: "2026-01-10",
    amount: 1120.5,
    type: "in",
    category: "Streaming",
  },
  {
    id: "3",
    source: "Bank Transfer",
    status: "Processing",
    date: "2026-01-08",
    amount: 500.0,
    type: "out",
    category: "Withdrawal",
  },
  {
    id: "4",
    source: "YouTube Content ID",
    status: "Success",
    date: "2025-12-28",
    amount: 890.0,
    type: "in",
    category: "Streaming",
  },
  {
    id: "5",
    source: "Tidal Royalties",
    status: "Success",
    date: "2025-12-15",
    amount: 145.2,
    type: "in",
    category: "Streaming",
  },
  {
    id: "6",
    source: "Major Label Batch #44",
    status: "Success",
    date: "2025-11-20",
    amount: 5600.0,
    type: "in",
    category: "Batch",
  },
];

export default function WalletPage() {
  const [filter, setFilter] = useState<string>("all");

  // --- Logic: Group Transactions by Month ---
  const groupedTransactions = useMemo(() => {
    const filtered = RAW_DATA.filter(
      (t) => filter === "all" || t.status.toLowerCase() === filter,
    );

    const groups: Record<string, Transaction[]> = {};
    filtered.forEach((tx) => {
      const month = new Date(tx.date).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!groups[month]) groups[month] = [];
      groups[month].push(tx);
    });
    return groups;
  }, [filter]);

  return (
    <div className="p-4 space-y-4">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,200.00</div>
            <p className="text-xs text-muted-foreground mt-1 text-emerald-600 font-medium italic">
              Ready for withdrawal
            </p>
            <div className="mt-4">
              <Button size="sm" variant="outline">
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* The Visual Card Manager */}
        <MagicCard className="overflow-hidden border-none bg-slate-900 text-white shadow-xl relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CardIcon size={120} />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">
                  Default Payout Method
                </p>
                <p className="text-lg font-semibold tracking-tight">
                  ArtistCard Preferred
                </p>
              </div>
              <div className="h-8 w-12 bg-slate-800 rounded flex items-center justify-center border border-slate-700">
                <div className="flex -space-x-2">
                  <div className="w-4 h-4 rounded-full bg-red-500/80" />
                  <div className="w-4 h-4 rounded-full bg-orange-500/80" />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xl font-mono tracking-[0.2em] mb-4">
                  •••• •••• •••• 4242
                </p>
                <p className="text-xs font-medium text-slate-400 uppercase">
                  Alex R. Producer
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                Edit Details
              </Button>
            </div>
          </CardContent>
        </MagicCard>
      </div>

      <div>
        <Tabs>
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">hello</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
