import type { Metadata } from "next";

export const metadata: Metadata = { title: "使用条款", description: "玄象公开站点的使用边界。", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return <article className="page-shell max-w-4xl">
    <p className="eyebrow">TERMS</p><h1 className="mt-3 font-serif text-4xl">使用条款</h1>
    <p className="mt-6 text-sm leading-7 text-muted-foreground">更新日期：2026 年 9 月 19 日。继续使用玄象，表示你理解以下边界。</p>
    <section className="mt-10 space-y-4 leading-8"><h2 className="font-serif text-2xl">知识与研究用途</h2><p>本站用于中国传统文化、历史与术数的学习、研究和娱乐参考。内容可能包含待校订、有争议或不同传统下的观点，不构成专业建议。</p></section>
    <section className="mt-10 space-y-4 leading-8"><h2 className="font-serif text-2xl">推演与 AI</h2><p>四柱与六爻功能是可复核的规则计算工具，不提供断命、断卦或吉凶保证。AI 输出可能不完整或出错；应核对其所列依据，不得将其作为医疗、法律、投资、安全或其他重大决策的唯一依据。</p></section>
    <section className="mt-10 space-y-4 leading-8"><h2 className="font-serif text-2xl">合理使用</h2><p>不得以绕过访问控制、破坏服务、批量滥用接口、侵害他人权利或其他违法方式使用本站。为保护服务与用户，我们可以限制异常请求或暂停相关功能。</p></section>
  </article>;
}
