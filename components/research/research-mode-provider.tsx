"use client";

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type ResearchMode = "browse" | "research";

interface ResearchModeContextValue {
  mode: ResearchMode;
  setMode: (mode: ResearchMode) => void;
}

const ResearchModeContext = createContext<ResearchModeContextValue | null>(null);
const STORAGE_KEY = "xuanxiang:view-mode:v1";
const CHANGE_EVENT = "xuanxiang:view-mode-change";

function getStoredMode(): ResearchMode {
  const savedMode = window.localStorage.getItem(STORAGE_KEY);
  return savedMode === "research" ? "research" : "browse";
}

function subscribeToMode(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function getServerMode(): ResearchMode {
  return "browse";
}

export function ResearchModeProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(subscribeToMode, getStoredMode, getServerMode);

  useEffect(() => {
    document.documentElement.dataset.viewMode = mode;
  }, [mode]);

  const setMode = useCallback((nextMode: ResearchMode) => {
    window.localStorage.setItem(STORAGE_KEY, nextMode);
    document.documentElement.dataset.viewMode = nextMode;
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode]);

  return (
    <ResearchModeContext.Provider value={value}>
      {children}
    </ResearchModeContext.Provider>
  );
}

export function useResearchMode() {
  const context = useContext(ResearchModeContext);
  if (!context) {
    throw new Error("useResearchMode must be used within ResearchModeProvider");
  }
  return context;
}
