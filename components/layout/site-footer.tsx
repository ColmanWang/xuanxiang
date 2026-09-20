import Link from "next/link";

const footerNavigation = [
  ["/knowledge", "知识库"],
  ["/graph", "玄象图谱"],
  ["/people", "人物"],
  ["/schools", "学派"],
  ["/privacy", "隐私说明"],
  ["/terms", "使用条款"],
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[1.5fr_1fr] lg:px-8">
        <div>
          <p className="font-serif text-3xl tracking-[0.14em]">玄象</p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-ink-muted">
            玄象是一个探索中国传统思想体系的平台。我们通过数字化方式连接经典、人物、概念与术数体系，呈现中国传统文化中的宇宙观、自然观与认知方式。
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm" aria-label="页脚导航">
          {footerNavigation.map(([href, label]) => (
            <Link key={href} href={href} className="text-ink-muted hover:text-ink-foreground">
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-ink-rule">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-xs leading-6 text-ink-muted lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 玄象 · 数字典藏与知识图谱</p>
          <p className="max-w-3xl">
            本站内容主要用于中国传统文化、历史与术数研究及娱乐参考，不构成医疗、法律、投资或人生重大决策建议。
          </p>
        </div>
      </div>
    </footer>
  );
}
