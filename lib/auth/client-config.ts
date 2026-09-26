import type { StudioOAuthProvider } from "./config";

export function createStudioSocialSignInOptions(provider: StudioOAuthProvider) {
  return {
    provider,
    callbackURL: "/studio",
    errorCallbackURL: "/studio/login?error=oauth",
  } as const;
}
