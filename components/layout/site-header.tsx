"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ResearchModeToggle } from "@/components/research/research-mode-toggle";
import { GlobalSearchDialog } from "@/components/search/global-search-dialog";
import { ThemeToggle } from "./theme-toggle";

const navigation = [
  ["/", "首页"],
  ["/systems", "体系"],
  ["/timeline", "演化"],
  ["/knowledge", "知识库"],
  ["/classics", "典籍"],
  ["/graph", "图谱"],
  ["/tools", "推演"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[4.5rem] max-w-[90rem] items-center px-5 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="玄象首页">
          <span className="brand-sigil" aria-hidden="true">
            象
          </span>
          <span className="font-serif text-2xl font-semibold tracking-[0.18em]">玄象</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-5 xl:flex" aria-label="主导航">
          {navigation.map(([href, label]) => (
            <Link
              key={label}
              href={href}
              className="nav-link text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-7 hidden items-center gap-2 xl:flex">
          <GlobalSearchDialog />
          <ResearchModeToggle compact />
          <ThemeToggle />
        </div>

        <div className="ml-auto flex items-center gap-1 xl:hidden">
          <GlobalSearchDialog onNavigate={() => setOpen(false)} />
          <ThemeToggle />
          <button
            type="button"
            className="grid size-10 place-items-center rounded-sm hover:bg-muted"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "关闭导航" : "打开导航"}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-navigation" className="border-t bg-background px-5 py-5 xl:hidden">
          <div className="mb-4">
            <ResearchModeToggle />
          </div>
          <nav className="grid grid-cols-2 border-y" aria-label="移动端主导航">
            {navigation.map(([href, label]) => (
              <Link
                key={label}
                href={href}
                className="border-b px-3 py-4 text-sm last:border-b-0 even:border-l"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
