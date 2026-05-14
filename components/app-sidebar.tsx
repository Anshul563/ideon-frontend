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
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-none bg-sidebar-primary flex items-center justify-center shadow-lg shadow-sidebar-primary/20">
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
            <SidebarMenu className="px-3 gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                      className={`h-10 rounded-none transition-all duration-300 ${
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm font-bold" 
                          : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <Link href={item.href}>
                        <Icon className="w-5 h-5" />
                        <span className="text-sm tracking-tight">{item.name}</span>
                        {isActive && <div className="ml-auto w-1 h-3 rounded-none bg-sidebar-primary" />}
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

          <div className="p-3.5 rounded-none bg-accent/30 border border-sidebar-border mb-3">
             <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-sidebar-foreground/50 uppercase tracking-widest">AI Credits</span>
                <span className="text-[10px] font-black text-sidebar-primary uppercase">
                  {user?.plan && user.plan !== "free" ? "Unlimited" : `${user?.tokensLeft || 0} Left`}
                </span>
             </div>
             {(!user?.plan || user?.plan === "free") && (
               <div className="w-full h-1 bg-sidebar-border rounded-none overflow-hidden">
                  <div 
                    className="h-full bg-sidebar-primary transition-all duration-500" 
                    style={{ width: `${Math.min(100, ((user?.tokensLeft || 0) / 10) * 100)}%` }} 
                  />
               </div>
             )}
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-sidebar-accent/20 border border-sidebar-border">
            <div className="relative flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-none bg-sidebar-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
              <div className="absolute inset-0 w-1.5 h-1.5 rounded-none bg-sidebar-primary animate-ping opacity-60" />
            </div>
            <span className="text-[9px] font-black text-sidebar-foreground/40 uppercase tracking-widest leading-none">
              Systems OK
            </span>
          </div>
        </div>
        
        <SidebarMenu className="px-3">
          <SidebarMenuItem className="flex items-center gap-3 px-3 py-2 mb-2 rounded-none hover:bg-sidebar-accent/50 transition-colors group">
            <ThemeToggleButton />
            <span className="text-xs font-bold text-sidebar-foreground/60 group-hover:text-sidebar-foreground transition-colors group-data-[collapsible=icon]:hidden">Appearance</span>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="h-11 rounded-none text-destructive hover:bg-destructive/10 hover:text-destructive transition-all group"
              tooltip="Sign Out"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="font-bold text-sm">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
