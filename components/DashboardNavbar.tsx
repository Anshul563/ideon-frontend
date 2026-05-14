"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Search, 
  Bell, 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  MapPin, 
  Camera, 
  Sparkles,
  ChevronRight,
  Settings,
  CreditCard,
  HelpCircle
} from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import { ContactSupportDialog } from "./ContactSupportDialog";
import axios from "axios";
import type { UserProfile } from "@/lib/types";

interface DashboardNavbarProps {
  user: UserProfile | null;
  onUserUpdate: () => void;
}

export function DashboardNavbar({ user, onUserUpdate }: DashboardNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPageName = () => {
    if (pathname === "/dashboard") return "Overview";
    if (pathname.includes("/research-page")) return "Market Research";
    if (pathname.includes("/history")) return "History";
    if (pathname.includes("/analytics")) return "Analytics";
    if (pathname.includes("/result")) return "Analysis Result";
    return "Dashboard";
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/dashboard/history?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-4 md:px-6 backdrop-blur-md bg-background/80 sticky top-0 z-10">
      <div className="flex items-center gap-2 md:gap-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4 hidden lg:block" />
        <Breadcrumb className="hidden lg:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{getPageName()}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div className="flex items-center gap-1 md:gap-4 flex-1 justify-end">
        <div className="relative hidden lg:block max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search your ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full pl-10 h-10 rounded-none bg-accent/40 border-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-none text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
            onClick={() => setIsSupportOpen(true)}
            title="Contact Support"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>

          <ContactSupportDialog 
            open={isSupportOpen} 
            onOpenChange={setIsSupportOpen} 
            user={user} 
          />
          
          <Separator orientation="vertical" className="h-8 opacity-50" />
          
          <Link href="/dashboard/profile" className="flex items-center gap-3 group outline-none">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[11px] font-black leading-none group-hover:text-primary transition-colors text-right uppercase tracking-tighter">
                {user ? `${user.firstName} ${user.lastName || ""}` : "Guest User"}
              </span>
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1 opacity-70">
                {user?.plan || "Free"} Plan
              </span>
            </div>
            <div className="h-9 w-9 rounded-none bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-sm group-hover:border-primary/50 transition-all overflow-hidden">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="h-4 w-4 text-primary" />
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
