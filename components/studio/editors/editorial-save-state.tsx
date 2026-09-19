"use client";

import { useEffect } from "react";

export function EditorialSaveState({ dirty, saving = false }: { dirty: boolean; saving?: boolean }) {
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  return <span role="status" className="text-xs text-muted-foreground">{saving ? "正在保存…" : dirty ? "有未保存修改" : "已保存"}</span>;
}
