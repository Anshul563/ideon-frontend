"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Separator } from "@/components/ui/separator";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Shield, Bell, User } from "lucide-react";
import { Suspense } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background font-mono">
        <AdminSidebar />
        
        <main className="flex-1 relative flex flex-col min-w-0">
          <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-6 backdrop-blur-md bg-background/80 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-4 hidden sm:block" />
              <Breadcrumb className="hidden sm:block">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin" className="font-bold uppercase tracking-tighter text-muted-foreground hover:text-primary">Admin Console</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-bold uppercase tracking-tighter text-primary">Control Center</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Shield className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Super Admin Mode</span>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-full">
              <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-muted-foreground animate-pulse">Initializing Terminal...</div>}>
                {children}
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
