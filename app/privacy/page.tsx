import type { Metadata } from "next";

export const metadata: Metadata = { title: "隐私说明", description: "玄象的数据处理与第三方 AI 说明。", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <article className="page-shell max-w-4xl">
    <p className="eyebrow">PRIVACY</p><h1 className="mt-3 font-serif text-4xl">隐私说明</h1>
    <p className="mt-6 text-sm leading-7 text-muted-foreground">更新日期：2026 年 9 月 27 日。本说明适用于玄象公开站点。玄象由项目维护者作为个人非商业 GitHub 项目维护，目前不用于商业经营。</p>
    <section className="mt-10 space-y-4 leading-8"><h2 className="font-serif text-2xl">我们处理的信息</h2><p>使用知识问答时，服务会处理你主动提交的问题，以及为了回答而检索的已发布知识片段或你选择的排盘计算上下文。服务还可能处理请求时必要的网络和技术信息，用于限流、安全、日志和故障排查。</p></section>
    <section className="mt-10 space-y-4 leading-8"><h2 className="font-serif text-2xl">保存期限</h2><p>技术与安全日志原则上保存不超过 30 天。账号及授权记录在账号使用期间保留；停止使用或提出删除请求后，原则上在 30 天内处理。为安全审计、故障调查或法律义务确有必要的记录，可在完成相应目的所需期间保留。</p></section>
    <section className="mt-10 space-y-4 leading-8"><h2 className="font-serif text-2xl">第三方 AI 服务</h2><p>当前 1.0 staging 版本保持 AI 功能关闭。若未来开启公开 AI 功能，你的问题、检索上下文和相关计算轨迹可能发送给项目配置的第三方、OpenAI 兼容的聊天或嵌入服务商。届时将在启用前更新本说明。请勿在 AI 输入中提交身份证号、账号密码、详细医疗资料等敏感信息。</p></section>
    <section className="mt-10 space-y-4 leading-8"><h2 className="font-serif text-2xl">使用边界</h2><p>程序负责确定性计算，AI 只负责基于已检索资料的说明；AI 不参与排盘计算、不直接发布内容，也不应用于医疗、法律、投资或人生重大决策。</p></section>
    <section className="mt-10 space-y-4 leading-8"><h2 className="font-serif text-2xl">你的请求与联系方式</h2><p>如需查询本项目处理的信息，或申请访问、更正或删除相关数据，请发送邮件至 <a className="underline underline-offset-4" href="mailto:colmanwang.001@gmail.com">colmanwang.001@gmail.com</a>。为防止未授权操作，处理请求前可能需要核对与账号相关的必要信息。</p></section>
    <section className="mt-10 space-y-4 leading-8"><h2 className="font-serif text-2xl">说明更新</h2><p>本说明发生实质变化时，项目会更新页面顶部的日期和相应内容。对本说明有疑问，也可通过上述邮箱联系项目维护者。</p></section>
  </article>;
}
