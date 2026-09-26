"use client";

import { useState } from "react";
import { createAuthClient } from "better-auth/react";
import { createStudioSocialSignInOptions } from "@/lib/auth/client-config";
import type { StudioOAuthProvider } from "@/lib/auth/config";

const authClient = createAuthClient();

export function StudioSignInButton({ provider }: { provider: StudioOAuthProvider }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function signIn() {
    setPending(true);
    setError(false);
    try {
      await authClient.signIn.social(createStudioSocialSignInOptions(provider));
    } catch {
      setError(true);
      setPending(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        className="w-full border bg-foreground px-4 py-3 text-background disabled:cursor-wait disabled:opacity-70"
        type="button"
        disabled={pending}
        onClick={signIn}
      >
        {pending ? "正在前往登录…" : `使用 ${provider === "github" ? "GitHub" : "Google"} 继续`}
      </button>
      {error ? <p className="text-sm text-destructive">无法启动登录，请刷新页面后重试。</p> : null}
    </div>
  );
}
