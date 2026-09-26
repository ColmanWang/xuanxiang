import { describe, expect, it } from "vitest";
import { createStudioSocialSignInOptions } from "./client-config";

describe("createStudioSocialSignInOptions", () => {
  it("starts OAuth in the browser and returns to Studio", () => {
    expect(createStudioSocialSignInOptions("github")).toEqual({
      provider: "github",
      callbackURL: "/studio",
      errorCallbackURL: "/studio/login?error=oauth",
    });
  });
});
