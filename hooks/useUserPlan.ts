import { useState, useEffect } from "react";
import axios from "axios";

export function useUserPlan() {
  const [plan, setPlan] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPlan(res.data.plan || "free");
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return { plan, loading, isPaid: plan !== "free" };
}
