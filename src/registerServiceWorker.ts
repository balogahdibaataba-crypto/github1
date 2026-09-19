import { useState, useEffect } from "react";

/**
 * Register the Service Worker for offline availability of the institutions catalog
 */
export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[Service Worker] Registered successfully with scope:", registration.scope);
        })
        .catch((error) => {
          console.warn("[Service Worker] Registration error:", error);
        });
    });
  }
}

/**
 * React Hook to monitor online/offline network state & ServiceWorker cache readiness
 */
export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    if (typeof navigator !== "undefined") {
      return !navigator.onLine;
    }
    return false;
  });

  const [isSWRegistered, setIsSWRegistered] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) setIsSWRegistered(true);
      });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOffline, isSWRegistered };
}
