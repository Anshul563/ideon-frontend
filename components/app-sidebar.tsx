"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  History,
  BarChart3,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { ThemeToggleButton } from "./ThemeToggleButton";

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
  { name: "Analysis History", href: "/dashboard/history", icon: History },
  { name: "Market Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-border">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tighter text-foreground">Ideon</h2>
              <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold border border-primary/20 leading-none">v1.0</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Creator Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 group-data-[collapsible=icon]:hidden">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                      className={`h-12 rounded-xl transition-all ${
                        isActive 
                          ? "bg-primary/10 text-primary hover:bg-primary/15" 
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <Link href={item.href}>
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                        {isActive && <ChevronRight className="ml-auto w-4 h-4" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6">
        <div className="px-3 mb-4 group-data-[collapsible=icon]:hidden">
          <div className="p-4 rounded-2xl bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 shadow-sm mb-4">
             <h4 className="text-xs font-black text-foreground uppercase tracking-tight mb-1">Upgrade to Pro</h4>
             <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed font-medium">Get unlimited AI analyses and premium features.</p>
             <Link href="/pricing">
                <Button size="sm" className="w-full h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
                   Get Access
                </Button>
             </Link>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="relative flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping opacity-60" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-widest leading-none">
              Systems Live
            </span>
          </div>
        </div>
        <SidebarMenu className="px-3">
          <SidebarMenuItem className="flex items-center gap-2 mb-2">
            <ThemeToggleButton />
            <span className="text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">Appearance</span>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="h-12 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-all"
              tooltip="Sign Out"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-bold">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
