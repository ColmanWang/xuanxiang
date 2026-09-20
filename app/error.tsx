"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="page-shell max-w-3xl text-center" role="alert">
    <p className="eyebrow">TEMPORARILY UNAVAILABLE</p><h1 className="mt-4 font-serif text-4xl">页面暂时无法显示</h1>
    <p className="mx-auto mt-6 max-w-xl leading-8 text-muted-foreground">请稍后重试。知识库内容与推演数据不会因此被修改。</p>
    <button className="mt-8 border border-primary px-5 py-3 text-sm text-primary hover:bg-muted" onClick={reset} type="button">重试</button>
  </section>;
}
