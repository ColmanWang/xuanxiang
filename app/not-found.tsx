import Link from "next/link";

export default function NotFound() {
  return <section className="page-shell max-w-3xl text-center">
    <p className="eyebrow">404</p><h1 className="mt-4 font-serif text-4xl">未找到这一页</h1>
    <p className="mx-auto mt-6 max-w-xl leading-8 text-muted-foreground">链接可能已更改，或该条目尚未公开发布。</p>
    <Link className="mt-8 inline-flex border border-primary px-5 py-3 text-sm text-primary hover:bg-muted" href="/">返回首页</Link>
  </section>;
}
