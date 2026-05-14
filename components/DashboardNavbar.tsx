"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
import { Search, Bell, User, Mail, Shield, Calendar, MapPin, Camera, Sparkles } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import axios from "axios";
import type { UserProfile } from "@/lib/types";

interface DashboardNavbarProps {
  user: UserProfile | null;
  onUserUpdate: () => void;
}

export function DashboardNavbar({ user, onUserUpdate }: DashboardNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
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
        
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon" className="rounded-none lg:hidden">
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-none relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-none border-2 border-background" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-1" />
          
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 md:gap-3 pl-1 group outline-none">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-xs font-bold leading-none group-hover:text-primary transition-colors">
                    {user ? `${user.firstName} ${user.lastName || ""}` : "Guest User"}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      {user?.plan || "Free"} Plan
                    </span>
                  </div>
                </div>
                <div className="h-8 w-8 md:h-9 md:w-9 rounded-none bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-sm group-hover:border-primary/50 transition-all overflow-hidden">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  )}
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-none border-border bg-card/95 backdrop-blur-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight">Account Profile</DialogTitle>
                <DialogDescription>
                  Manage your account settings and preferences.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-8 py-6">
                <div className="flex items-center gap-6">
                  <div className="relative group/avatar">
                    <div className="h-24 w-24 rounded-none bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden shadow-xl">
                      {user?.profilePic ? (
                        <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-10 w-10 text-primary" />
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2">
                       {mounted && (
                         <UploadButton
                            endpoint="profilePicture"
                            onClientUploadComplete={async (res) => {
                              if (res && res[0]) {
                                try {
                                  await axios.post(
                                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/update-profile-pic`,
                                    { url: res[0].url },
                                    {
                                      headers: {
                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                      },
                                    }
                                  );
                                  onUserUpdate();
                                } catch (err) {
                                  console.error("Failed to update profile pic manually:", err);
                                }
                              }
                            }}
                            onUploadError={(error: Error) => {
                              console.error(error);
                            }}
                            appearance={{
                              button: "h-10 w-10 rounded-none bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-all border-4 border-background p-0",
                              allowedContent: "hidden",
                            }}
                            content={{
                              button: <Camera className="w-4 h-4" />
                            }}
                            headers={{
                              Authorization: `Bearer ${localStorage.getItem("token")}`,
                            }}
                          />
                       )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">
                      {user ? `${user.firstName} ${user.lastName || ""}` : "Guest User"}
                    </h4>
                    <p className="text-sm text-muted-foreground capitalize">{user?.plan || "Free"} Account Member</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center gap-4 p-4 rounded-none bg-accent/30 border border-border">
                    <Mail className="w-5 h-5 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Email Address</span>
                      <span className="text-sm font-semibold">{user?.email || "No email linked"}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 rounded-none bg-accent/30 border border-border">
                    <Shield className="w-5 h-5 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Security Status</span>
                      <span className="text-sm font-semibold flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-none bg-emerald-500" />
                         Two-Factor Enabled
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-none bg-accent/30 border border-border">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">AI Credits</span>
                      <span className="text-sm font-semibold">
                         {user?.plan === "pro" || user?.plan === "premium" ? (
                           <span className="text-primary">Unlimited Credits</span>
                         ) : (
                           `${user?.tokensLeft || 0} Analyses Remaining`
                         )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-none bg-accent/30 border border-border">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Member Since</span>
                      <span className="text-sm font-semibold">April 2024</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 pt-2">
                   <div className="flex items-center gap-1.5 px-3 py-1 rounded-none bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                      <MapPin className="w-3 h-3" /> US East
                   </div>
                   <div className="flex items-center gap-1.5 px-3 py-1 rounded-none bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                      v1.0 Stable
                   </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
