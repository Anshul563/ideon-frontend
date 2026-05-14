"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Ticket,
  LogOut,
  ShieldCheck,
  Settings,
  MessageSquare,
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

const adminNavItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin?tab=users", icon: Users },
  { name: "Sales", href: "/admin?tab=payments", icon: CreditCard },
  { name: "Coupons", href: "/admin?tab=coupons", icon: Ticket },
  { name: "Support", href: "/admin?tab=tickets", icon: MessageSquare },
];

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  // We'll use search params to handle tabs for now as per the current implementation
  // but we can transition to actual sub-routes easily.

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tighter text-sidebar-foreground">Admin</h2>
              <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold border border-primary/20 leading-none">Console</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/50 font-bold">Ideon Central</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-[10px] uppercase tracking-widest font-black text-sidebar-foreground/30 group-data-[collapsible=icon]:hidden mb-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3 gap-1.5">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                      className={`h-10 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm font-bold" 
                          : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <Link href={item.href}>
                        <Icon className="w-5 h-5" />
                        <span className="text-sm tracking-tight">{item.name}</span>
                        {isActive && <div className="ml-auto w-1 h-3 rounded-full bg-primary" />}
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
        <SidebarMenu className="px-3">
          <SidebarMenuItem className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl hover:bg-sidebar-accent/50 transition-colors group">
            <ThemeToggleButton />
            <span className="text-xs font-bold text-sidebar-foreground/60 group-hover:text-sidebar-foreground transition-colors group-data-[collapsible=icon]:hidden">Appearance</span>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="h-11 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-all group"
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
