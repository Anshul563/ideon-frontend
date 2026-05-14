"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { X, ExternalLink, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Announcement {
  id: number;
  content: string;
  isActive: string;
  bgColor: string;
  textColor: string;
  link?: string;
}

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements/active`);
        if (res.data) {
          setAnnouncement(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch announcement", error);
      }
    };
    fetchActive();
  }, []);

  if (!announcement || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        style={{ backgroundColor: announcement.bgColor, color: announcement.textColor }}
        className="relative z-50 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-x-6 sm:gap-x-12">
            <div className="flex items-center gap-2 text-sm font-bold tracking-tight font-mono uppercase">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <div dangerouslySetInnerHTML={{ __html: announcement.content }} className="announcement-content" />
            </div>
            
            {announcement.link && (
              <a
                href={announcement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-none rounded-none bg-black/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-white shadow-sm hover:bg-black/20 transition-all flex items-center gap-1.5"
              >
                Learn More <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-black/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
