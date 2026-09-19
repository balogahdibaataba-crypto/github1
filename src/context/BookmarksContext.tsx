import React, { createContext, useContext, useState, useEffect } from "react";

export type SavedType = "institution" | "career" | "program" | "cost_city";

export interface SavedItem {
  id: string;
  type: SavedType;
  title: string;
  subtitle?: string;
  badge?: string;
  extraInfo?: string;
  linkTab?: string;
  data?: any;
  savedAt: string;
}

interface BookmarksContextType {
  savedItems: SavedItem[];
  isSaved: (id: string) => boolean;
  toggleSave: (item: Omit<SavedItem, "savedAt">) => void;
  removeSaved: (id: string) => void;
  clearAllSaved: () => void;
}

const STORAGE_KEY = "orienta_afrik_saved_bookmarks_v1";

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export const BookmarksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
    } catch (e) {
      console.error("Failed to persist saved bookmarks", e);
    }
  }, [savedItems]);

  const isSaved = (id: string) => {
    return savedItems.some((item) => item.id === id);
  };

  const toggleSave = (item: Omit<SavedItem, "savedAt">) => {
    setSavedItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      } else {
        const newItem: SavedItem = {
          ...item,
          savedAt: new Date().toISOString(),
        };
        return [newItem, ...prev];
      }
    });
  };

  const removeSaved = (id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllSaved = () => {
    setSavedItems([]);
  };

  return (
    <BookmarksContext.Provider
      value={{
        savedItems,
        isSaved,
        toggleSave,
        removeSaved,
        clearAllSaved,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = (): BookmarksContextType => {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarksProvider");
  }
  return context;
};
