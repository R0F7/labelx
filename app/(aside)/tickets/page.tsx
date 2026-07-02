"use client";

import React, { useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Plus, 
  SlidersHorizontal,
  Music2,
  HelpCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- Mock Ticket Data ---
const TICKETS = [
  { id: "T-1024", subject: "Spotify Upload Delay - Album 'Echoes'", status: "open", priority: "high", category: "Distribution", date: "2 hours ago" },
  { id: "T-1021", subject: "Incorrect Royalty Calculation Dec 2025", status: "pending", priority: "medium", category: "Finances", date: "1 day ago" },
  { id: "T-1018", subject: "Artist Name Mapping on Apple Music", status: "closed", priority: "low", category: "Metadata", date: "3 days ago" },
  { id: "T-1015", subject: "WAV File Corrupted during upload", status: "open", priority: "high", category: "Technical", date: "4 days ago" },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "pending": return <Clock className="h-4 w-4 text-blue-500" />;
      case "closed": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      default: return <HelpCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 min-h-screen">
      {/* Header with LabelX Branding */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">

          <div>
            <h2 className="text-2xl font-bold tracking-tight">Support Center</h2>
            <p className="text-muted-foreground text-sm">Need help with your distribution or royalties?</p>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4" /> Create New Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Filters - 4 columns on large screens */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search tickets by subject or ID..." 
                className="pl-9 bg-white" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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

          {/* Ticket List */}
          <Card className="border-none shadow-sm overflow-hidden py-0">
            <div className="divide-y">
              {TICKETS.map((ticket) => {
                return(
                <div 
                  key={ticket.id} 
                  className="group flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getStatusIcon(ticket.status)}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-400 font-medium">{ticket.id}</span>
                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider h-5">
                          {ticket.category}
                        </Badge>
                        {ticket.priority === "high" && (
                          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        )}
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        {ticket.subject}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">Updated {ticket.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end mr-4">
                      <div className="flex -space-x-2">
                        <div className="h-6 w-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">LX</div>
                        <div className="h-6 w-6 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-600 font-bold">AR</div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500" />
                  </div>
                </div>
              )
              })}
            </div>
          </Card>
        </div>

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
              <Button variant="secondary" className="bg-white/10 border-none text-white hover:bg-white/20 text-xs justify-start h-12">
                Royalties
              </Button>
              <Button variant="secondary" className="bg-white/10 border-none text-white hover:bg-white/20 text-xs justify-start h-12">
                Takedowns
              </Button>
              <Button variant="secondary" className="bg-white/10 border-none text-white hover:bg-white/20 text-xs justify-start h-12">
                ID Mapping
              </Button>
              <Button variant="secondary" className="bg-white/10 border-none text-white hover:bg-white/20 text-xs justify-start h-12">
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
                <span className="text-muted-foreground group-hover:text-indigo-600">Distribution Timelines</span>
                <ChevronRight size={14} />
              </div>
              <div className="flex items-center justify-between text-sm group cursor-pointer hover:text-indigo-600">
                <span className="text-muted-foreground group-hover:text-indigo-600">Royalty Reporting FAQ</span>
                <ChevronRight size={14} />
              </div>
              <div className="flex items-center justify-between text-sm group cursor-pointer hover:text-indigo-600">
                <span className="text-muted-foreground group-hover:text-indigo-600">YouTube Content ID</span>
                <ChevronRight size={14} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}