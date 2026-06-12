// "use client";
// import { TeamSwitcher } from "@/app/(aside)/select-organization/team-switcher";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import UserAvatar from "@/components/user-avatar";
// import { cn } from "@/lib/utils";
// import {
//   BoundingBoxIcon,
//   Building,
//   Buildings,
//   ChartLine,
//   HouseIcon,
//   Ticket,
//   User,
//   VinylRecordIcon,
//   Wallet,
// } from "@phosphor-icons/react/dist/ssr";
// import { MenuIcon } from "lucide-react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useEffect, useRef, useState } from "react";

// function Layout({ children }: { children: React.ReactNode }) {
//   const navItems = [
//     {
//       title: "Dashboard",
//       icon: HouseIcon,
//       href: "/",
//     },
//     {
//       title: "Releases",
//       icon: VinylRecordIcon,
//       href: "/releases",
//     },
//     {
//       title: "Analytics",
//       icon: ChartLine,
//       href: "/analytics",
//     },
//     {
//       title: "Wallet",
//       icon: Wallet,
//       href: "/wallet",
//     },
//     {
//       title: "Artists",
//       icon: User,
//       href: "/artists",
//     },
//     {
//       title: "Labels",
//       icon: Buildings,
//       href: "/labels",
//     },
//     {
//       title: "Tickets",
//       icon: Ticket,
//       href: "/tickets",
//     },
//   ];
//   const pathname = usePathname();

//   const [isOpen, setIsOpen] = useState(false);

//   const sidebarRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [sidebarRef]);

//   return (
//     <>
//       <div>
//         <aside
//           ref={sidebarRef}
//           className={`${isOpen ? "w-60 md:w-14" : "w-14 -left-full"} bg-muted h-screen fixed space-y-4  md:left-0 z-40 transition-width duration-300`}
//         >
//           <div className="w-14 h-12 flex items-center justify-center">
//             <BoundingBoxIcon size={30} />
//           </div>
//           <div className="flex items-center md:justify-center flex-col gap-2 w-full">
//             {navItems.map((nav, i) => (
//               <Tooltip key={i}>
//                 <TooltipTrigger asChild>
//                   <Link href={nav.href} className="w-full px-2">
//                     <div
//                       key={i}
//                       className={cn(
//                         "w-full px-2 md:w-10 h-10 rounded-lg hover:bg-accent/80 cursor-pointer flex gap-4 items-center justify-start md:justify-center",
//                         pathname.split("/")[1] === nav.href.split("/")[1] &&
//                           "bg-accent",
//                       )}
//                     >
//                       <nav.icon size={20} />
//                       <h1 className="text-sm md:hidden">{nav.title}</h1>
//                     </div>
//                   </Link>
//                 </TooltipTrigger>
//                 <TooltipContent side="right">
//                   <p>{nav.title}</p>
//                 </TooltipContent>
//               </Tooltip>
//             ))}
//           </div>
//         </aside>
//         <main className="md:ml-14">
//           <nav className="w-full h-12 flex items-center justify-between px-4 sticky top-0 z-50 bg-background">
//             <div className="text-lg font-medium flex gap-2 items-center">
//               <div className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
//                 <MenuIcon size={20} />
//               </div>
//               <h1>
//                 {navItems.find((nav) => nav.href.startsWith(pathname))?.title}
//               </h1>
//             </div>
//             <UserAvatar />
//           </nav>
//           {children}
//         </main>
//       </div>
//     </>
//   );
// }

// export default Layout;

"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BoundingBoxIcon,
  ChartLine,
  HouseIcon,
  Ticket,
  User,
  VinylRecordIcon,
  Wallet,
  Buildings,
} from "@phosphor-icons/react/dist/ssr";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import UserAvatar from "@/components/user-avatar";

const navItems = [
  { title: "Dashboard", icon: HouseIcon, href: "/" },
  { title: "Releases", icon: VinylRecordIcon, href: "/releases" },
  { title: "Analytics", icon: ChartLine, href: "/analytics" },
  { title: "Wallet", icon: Wallet, href: "/wallet" },
  { title: "Artists", icon: User, href: "/artists" },
  { title: "Labels", icon: Buildings, href: "/labels" },
  { title: "Tickets", icon: Ticket, href: "/tickets" },
];

function SidebarAndNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentTitle = navItems.find((nav) => 
    nav.href === "/" ? pathname === "/" : pathname.startsWith(nav.href)
  )?.title || "Dashboard";

  return (
    <div>
      <aside
        ref={sidebarRef}
        className={`${isOpen ? "w-60 md:w-14" : "w-14 -left-full"} bg-muted h-screen fixed space-y-4 md:left-0 z-40 transition-width duration-300`}
      >
        <div className="w-14 h-12 flex items-center justify-center">
          <BoundingBoxIcon size={30} />
        </div>
        <div className="flex items-center md:justify-center flex-col gap-2 w-full">
          {navItems.map((nav, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Link href={nav.href} className="w-full px-2">
                  <div
                    className={cn(
                      "w-full px-2 md:w-10 h-10 rounded-lg hover:bg-accent/80 cursor-pointer flex gap-4 items-center justify-start md:justify-center",
                      (nav.href === "/" ? pathname === "/" : pathname.startsWith(nav.href)) ? "bg-accent" : "",
                    )}
                  >
                    <nav.icon size={20} />
                    <h1 className="text-sm md:hidden">{nav.title}</h1>
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{nav.title}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </aside>

      <main className="md:ml-14">
        <nav className="w-full h-12 flex items-center justify-between px-4 sticky top-0 z-50 bg-background">
          <div className="text-lg font-medium flex gap-2 items-center">
            <div className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              <MenuIcon size={20} />
            </div>
            <h1>{currentTitle}</h1>
          </div>
          <UserAvatar />
        </nav>
        {children}
      </main>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Layout...</div>}>
      <SidebarAndNav>{children}</SidebarAndNav>
    </Suspense>
  );
}