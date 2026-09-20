import type { Metadata } from "next";

export const metadata: Metadata = { title: "隐私说明", description: "玄象的数据处理与第三方 AI 说明。", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <article className="page-shell max-w-4xl">
    <p className="eyebrow">PRIVACY</p><h1 className="mt-3 font-serif text-4xl">隐私说明</h1>
    <p className="mt-6 text-sm leading-7 text-muted-foreground">更新日期：2026 年 9 月 19 日。本说明适用于玄象公开站点。</p>
    <section className="mt-10 space-y-4 leading-8"><h2 className="font-serif text-2xl">我们处理的信息</h2><p>使用知识问答时，服务会处理你主动提交的问题，以及为了回答而检索的已发布知识片段或你选择的排盘计算上下文。服务还可能处理请求时必要的网络和技术信息，用于限流、安全、日志和故障排查。</p></section>
    <section className="mt-10 space-y-4 leading-8"><h2 className="font-serif text-2xl">第三方 AI 服务</h2><p>公开 AI 功能启用时，你的问题、检索上下文和相关计算轨迹可能发送给平台运营者配置的第三方、OpenAI 兼容的聊天或嵌入服务商。具体服务商会随部署配置变化，其处理也受各自条款约束。请勿在 AI 输入中提交身份证号、账号密码、详细医疗资料等敏感信息。</p></section>
    <section className="mt-10 space-y-4 leading-8"><h2 className="font-serif text-2xl">使用边界</h2><p>程序负责确定性计算，AI 只负责基于已检索资料的说明；AI 不参与排盘计算、不直接发布内容，也不应用于医疗、法律、投资或人生重大决策。</p></section>
  </article>;
}
