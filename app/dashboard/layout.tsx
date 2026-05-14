"use client";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";
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
    fetchUser();
  }, [paymentStatus]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar user={user} />
        
        <main className="flex-1 relative flex flex-col min-w-0">
          <DashboardNavbar user={user} onUserUpdate={fetchUser} />
          
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
