import { getStudioOAuthConfig } from "@/lib/auth/config";
import { signInToStudio } from "./actions";

export default function StudioLoginPage() {
  const oauth = getStudioOAuthConfig();
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg items-center px-6">
      <section className="w-full space-y-5 border bg-card p-8">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">内部编辑工具</p>
          <h1 className="font-serif text-3xl">登录玄象 Studio</h1>
          <p className="text-sm text-muted-foreground">仅允许已加入 Studio 白名单的编辑人员访问。</p>
        </div>
        {oauth ? (
          <form action={signInToStudio}>
            <button className="w-full border bg-foreground px-4 py-3 text-background" type="submit">
              使用 {oauth.provider === "github" ? "GitHub" : "Google"} 继续
            </button>
          </form>
        ) : <p className="text-sm text-destructive">Studio OAuth 尚未配置，请联系管理员。</p>}
      </section>
    </main>
  );
}
