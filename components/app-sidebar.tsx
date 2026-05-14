"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  History,
  BarChart3,
  Search,
  LogOut,
  Sparkles,
} from "lucide-react";
import { ThemeToggleButton } from "./ThemeToggleButton";
import type { UserProfile } from "@/lib/types";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Market Research", href: "/dashboard/research-page", icon: Search },
  { name: "Analysis History", href: "/dashboard/history", icon: History },
  { name: "Market Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

export function AppSidebar({ user, ...props }: { user?: UserProfile | null } & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 transition-all duration-300">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="w-9 h-9 shrink-0 rounded-none bg-sidebar-primary flex items-center justify-center shadow-lg shadow-sidebar-primary/20">
            <Sparkles className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tighter text-sidebar-foreground">Ideon</h2>
              <span className="px-1.5 py-0.5 rounded-none bg-sidebar-primary/10 text-sidebar-primary text-[10px] font-bold border border-sidebar-primary/20 leading-none">v1.0</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/50 font-bold">Creator Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-[10px] uppercase tracking-widest font-black text-sidebar-foreground/30 group-data-[collapsible=icon]:hidden mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3 gap-1.5 group-data-[collapsible=icon]:px-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href} className="flex group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                      className={`h-10 rounded-none transition-all duration-300 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 ${
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm font-bold" 
                          : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <Link href={item.href} className="flex items-center group-data-[collapsible=icon]:justify-center">
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="text-sm tracking-tight group-data-[collapsible=icon]:hidden ml-3">{item.name}</span>
                        {isActive && <div className="ml-auto w-1 h-3 rounded-none bg-sidebar-primary group-data-[collapsible=icon]:hidden" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="px-3 mb-4 group-data-[collapsible=icon]:hidden">
          {(!user?.plan || user.plan === "free") && (
            <div className="p-3.5 rounded-none bg-sidebar-primary/5 border border-sidebar-primary/10 backdrop-blur-sm mb-3 group/card hover:border-sidebar-primary/30 transition-all flex items-center justify-between gap-3">
               <div className="flex-1">
                 <h4 className="text-[10px] font-black text-sidebar-foreground uppercase tracking-tight">Upgrade</h4>
                 <p className="text-[9px] text-sidebar-foreground/50 font-medium truncate">Get Unlimited AI</p>
               </div>
               <Link href="/pricing">
                  <Button size="sm" className="h-7 px-3 rounded-none bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground text-[9px] font-black uppercase tracking-widest shadow-lg shadow-sidebar-primary/10 transition-all active:scale-95">
                     Pro
                  </Button>
               </Link>
            </div>
          )}

          <div className="group/credits relative p-4 rounded-none bg-accent/30 border border-sidebar-border mb-3 overflow-hidden transition-all hover:bg-accent/40">
            {user?.plan && user.plan !== "free" && (
              <div className="absolute top-0 right-0 p-1">
                 <div className="w-1 h-1 rounded-none bg-sidebar-primary animate-pulse shadow-[0_0_8px_var(--sidebar-primary)]" />
              </div>
            )}
             <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-sidebar-foreground/30 uppercase tracking-[0.2em] mb-1">Resource</span>
                  <span className="text-[11px] font-black text-sidebar-foreground uppercase tracking-tight">AI Credits</span>
                </div>
                <div className="flex flex-col items-end">
                  {user?.plan && user.plan !== "free" ? (
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-sidebar-primary uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 animate-pulse" />
                        Unlimited
                      </span>
                      <span className="text-[8px] text-sidebar-foreground/40 font-bold uppercase mt-0.5">Enterprise Access</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] font-black text-sidebar-foreground uppercase tracking-tight">
                        {user?.tokensLeft || 0} <span className="text-[9px] text-sidebar-foreground/40">/ 10</span>
                      </span>
                      <span className="text-[8px] text-sidebar-foreground/40 font-bold uppercase mt-0.5">Left Today</span>
                    </div>
                  )}
                </div>
             </div>

             {(!user?.plan || user?.plan === "free") ? (
               <div className="relative w-full h-1.5 bg-sidebar-border rounded-none overflow-hidden">
                  <div 
                    className="h-full bg-sidebar-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary),0.3)]" 
                    style={{ width: `${Math.min(100, ((user?.tokensLeft || 0) / 10) * 100)}%` }} 
                  />
               </div>
             ) : (
               <div className="flex items-center gap-1.5 opacity-50">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-1 flex-1 bg-sidebar-primary/20 rounded-none animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
               </div>
             )}
          </div>
        </div>
        
        <SidebarMenu className="px-3 group-data-[collapsible=icon]:px-0">
          <SidebarMenuItem className="flex items-center gap-3 px-3 py-2 mb-2 rounded-none hover:bg-sidebar-accent/50 transition-colors group group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <ThemeToggleButton />
            <span className="text-xs font-bold text-sidebar-foreground/60 group-hover:text-sidebar-foreground transition-colors group-data-[collapsible=icon]:hidden">Appearance</span>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="h-11 rounded-none text-destructive hover:bg-destructive/10 hover:text-destructive transition-all group group-data-[collapsible=icon]:justify-center"
              tooltip="Sign Out"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform shrink-0" />
              <span className="font-bold text-sm group-data-[collapsible=icon]:hidden">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
