import { useState, useEffect } from "react";
import axios from "axios";

import { UserProfile } from "@/lib/types";

export function useUserPlan() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return { 
    user,
    plan: user?.plan || "free", 
    loading, 
    isPaid: user?.plan !== "free",
    tokensLeft: user?.tokensLeft ?? 0
  };
}
