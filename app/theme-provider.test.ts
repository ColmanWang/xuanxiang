import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "../components/theme-provider";

describe("theme bootstrap CSP", () => {
  it("passes the request nonce to the rendered inline theme script", () => {
    const props = {
      nonce: "test-request-nonce",
      children: undefined,
    };
    const html = renderToStaticMarkup(createElement(ThemeProvider, props, createElement("span", null, "content")));
    expect(html).toContain('nonce="test-request-nonce"');
    expect(html).toContain("localStorage");
  });
});
