"use client";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

// Brand SVG Icons Mapper
const ICON_MAP: Record<string, React.ReactNode> = {
  Spotify: (
    <svg
      className="w-5 h-5 text-[#1DB954]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.894-.982-.336.075-.668-.135-.744-.47-.075-.336.135-.668.47-.743 3.856-.88 7.15-.506 9.822 1.13.295.178.387.563.206.858zm1.224-2.723c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.08-1.182-.413.125-.847-.107-.972-.52-.125-.413.108-.847.52-.972 3.67-1.114 8.243-.574 11.35 1.335.366.226.486.706.26 1.072zm.105-2.833C14.383 8.8 8.417 8.604 4.975 9.648c-.53.16-1.09-.14-1.25-.67-.16-.53.14-1.09.67-1.25 3.963-1.202 10.556-.974 14.654 1.46.478.283.63.897.347 1.375-.283.477-.897.63-1.374.347z" />
    </svg>
  ),
  "Apple Music": (
    <svg
      className="w-5 h-5 text-[#FC3C44]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.188 11.417c-.504.38-.857.942-.857 1.708 0 .157.016.313.047.464l.61 2.873c.094.444-.354.79-.739.54l-2.61-1.693c-.4-.26-.9-.26-1.3 0l-2.61 1.694c-.385.25-.833-.097-.739-.54l.61-2.873c.03-.15.047-.307.047-.464 0-.766-.353-1.328-.857-1.708l-2.292-1.727c-.365-.274-.176-.856.282-.856h2.868c.63 0 1.173-.41 1.354-1.014l.942-3.142c.143-.478.82-.478.964 0l.942 3.142c.18.604.723 1.014 1.354 1.014h2.868c.458 0 .647.582.282.856l-2.292 1.727z" />
    </svg>
  ),
  Tidal: (
    <svg
      className="w-5 h-5 text-[#00E6FF]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 5.72L18.28 12 12 18.28 5.72 12 12 5.72zM12 0l6.28 6.28L12 12.56 5.72 6.28 12 0zm0 11.44l6.28 6.28L12 24l-6.28-6.28 12-12.56zM18.28 5.72L24 11.44l-5.72 5.72-5.72-5.72 5.72-5.72zM5.72 5.72l5.72 5.72L5.72 17.16 0 11.44l5.72-5.72z" />
    </svg>
  ),
  Gaana: (
    <div className="w-5 h-5 rounded-full bg-[#E72C30] flex items-center justify-center text-white text-[10px] font-bold">
      g
    </div>
  ),
  Facebook: (
    <svg
      className="w-5 h-5 text-[#1877F2]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Instagram: (
    <svg
      className="w-5 h-5 text-[#E1306C]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  X: (
    <svg
      className="w-5 h-5 text-foreground"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Threads: (
    <svg
      className="w-5 h-5 text-foreground"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.26 12.78c-.46.33-1.02.5-1.67.5-.78 0-1.44-.27-1.97-.8-.53-.54-.8-1.25-.8-2.14 0-.9.27-1.62.81-2.16.54-.54 1.2-.81 1.99-.81.63 0 1.17.16 1.62.48.45.32.74.77.86 1.35h-1.72c-.08-.22-.22-.39-.42-.51-.2-.12-.44-.18-.73-.18-.39 0-.71.14-.96.42-.25.28-.38.67-.38 1.19 0 .52.13.92.39 1.21.26.29.59.43.99.43.32 0 .58-.07.78-.22.2-.15.33-.36.38-.63h-1.18v-1.33h2.89c-.04.91-.32 1.64-.85 2.18z" />
    </svg>
  ),
};

interface Connection {
  name: string;
  url: string;
}

export function ConnectionIcons({
  connections,
}: {
  connections?: Connection[];
}) {
  if (!connections || connections.length === 0) {
    return <span className="text-xs text-muted-foreground">None</span>;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center -space-x-3.5 hover:space-x-1 transition-all duration-300">
        {connections.map((conn, idx) => (
          <Tooltip key={idx}>
            <TooltipTrigger asChild>
              <div className="p-1.5 bg-background border rounded-full shadow-sm hover:scale-110 hover:z-10 cursor-pointer transition-transform bg-card">
                {ICON_MAP[conn.name] || (
                  <span className="text-xs">{conn.name}</span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="text-xs font-medium space-y-1"
            >
              <p className="font-bold">{conn.name}</p>
              <Link
                href={conn.url || ""}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {" "}
                Visit Profile →
              </Link>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
