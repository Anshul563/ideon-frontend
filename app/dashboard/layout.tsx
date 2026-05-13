"use client";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
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
import { Search, Bell, User, Mail, Shield, Calendar, MapPin, Camera } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import type { UserProfile } from "@/lib/types";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-background text-muted-foreground">Loading...</div>}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    fetchUser();
    return () => window.clearTimeout(timer);
  }, [paymentStatus]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar user={user} />
        
        <main className="flex-1 relative flex flex-col min-w-0">
          <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-6 backdrop-blur-md bg-background/80 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-4 hidden sm:block" />
              <Breadcrumb className="hidden sm:block">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Overview</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            <div className="flex items-center gap-4 flex-1 justify-end">
              <div className="relative hidden md:block max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search your ideas..."
                  className="w-full pl-10 h-10 rounded-xl bg-accent/40 border-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-xl relative">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                </Button>
                <Separator orientation="vertical" className="h-6 mx-1" />
                
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-3 pl-1 group outline-none">
                      <div className="hidden lg:flex flex-col items-end">
                        <span className="text-xs font-bold leading-none group-hover:text-primary transition-colors">
                          {user ? `${user.firstName} ${user.lastName || ""}` : "Guest User"}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                            {user?.plan || "Free"} Plan
                          </span>
                          {user?.plan === "free" && (
                            <>
                              <span className="text-[10px] text-muted-foreground/30">•</span>
                              <span className="text-[10px] text-primary font-bold uppercase tracking-wider bg-primary/10 px-1.5 rounded-sm">
                                {user?.tokensLeft ?? 0} Tokens Left
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="h-9 w-9 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-sm group-hover:border-primary/50 transition-all overflow-hidden">
                        {user?.profilePic ? (
                          <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] rounded-[32px] border-border bg-card/95 backdrop-blur-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black tracking-tight">Account Profile</DialogTitle>
                      <DialogDescription>
                        Manage your account settings and preferences.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-8 py-6">
                      <div className="flex items-center gap-6">
                        <div className="relative group/avatar">
                          <div className="h-24 w-24 rounded-[32px] bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden shadow-xl">
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
                                        fetchUser();
                                      } catch (err) {
                                        console.error("Failed to update profile pic manually:", err);
                                      }
                                    }
                                  }}
                                  onUploadError={(error: Error) => {
                                    console.error(error);
                                  }}
                                  appearance={{
                                    button: "h-10 w-10 rounded-2xl bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-all border-4 border-background p-0",
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
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-accent/30 border border-border">
                          <Mail className="w-5 h-5 text-primary" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Email Address</span>
                            <span className="text-sm font-semibold">{user?.email || "No email linked"}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-accent/30 border border-border">
                          <Shield className="w-5 h-5 text-primary" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Security Status</span>
                            <span className="text-sm font-semibold flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                               Two-Factor Enabled
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-accent/30 border border-border">
                          <Calendar className="w-5 h-5 text-primary" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Member Since</span>
                            <span className="text-sm font-semibold">April 2024</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-4 pt-2">
                         <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                            <MapPin className="w-3 h-3" /> US East
                         </div>
                         <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                            v1.0 Stable
                         </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

