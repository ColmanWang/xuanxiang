import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";

vi.mock("./_lib/gate", () => ({
  requireEditorialStudio: vi.fn().mockResolvedValue({ email: "operator@example.test", role: "ADMIN" }),
}));
vi.mock("./login/actions", () => ({ signOutOfStudio: vi.fn() }));
vi.mock("./login/page", () => ({ default: () => null }));
vi.mock("@/components/studio/studio-shell", () => ({ StudioShell: ({ children }: { children: React.ReactNode }) => children }));

import StudioLayout from "./layout";

it("shows the signed-in role without exposing the operator email", async () => {
  const html = renderToStaticMarkup(await StudioLayout({ children: createElement("p", null, "编辑内容") }));
  expect(html).toContain("ADMIN");
  expect(html).toContain("编辑内容");
  expect(html).not.toContain("operator@example.test");
});
