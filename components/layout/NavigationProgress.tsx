"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Only trigger on actual navigation (pathname change)
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    // Clear any existing animation
    if (timerRef.current) clearInterval(timerRef.current);

    // Start bar at 0 and animate to ~85%
    setProgress(0);
    setVisible(true);

    let current = 0;
    timerRef.current = setInterval(() => {
      // Slow down as it approaches 85%
      const increment =
        current < 30 ? 8 : current < 60 ? 4 : current < 80 ? 1.5 : 0.3;
      current = Math.min(current + increment, 85);
      setProgress(current);
    }, 50);

    // After a short delay, complete and hide
    const completeTimer = setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      setProgress(100);
      setTimeout(() => setVisible(false), 300);
    }, 600);

    return () => {
      clearInterval(timerRef.current!);
      clearTimeout(completeTimer);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-[3px] pointer-events-none"
      style={{
        width: `${progress}%`,
        transition:
          progress === 100
            ? "width 0.2s ease-out, opacity 0.3s ease 0.1s"
            : "width 0.4s ease-out",
        opacity: progress === 100 ? 0 : 1,
        background: "linear-gradient(90deg, #F59E0B, #EF4444, #EC4899)",
        boxShadow: "0 0 8px rgba(245, 158, 11, 0.8)",
      }}
    />
  );
}
