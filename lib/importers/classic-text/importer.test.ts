import { describe, expect, it } from "vitest";
import { CLASSIC_IMPORT_TRANSACTION_OPTIONS } from "./importer";

describe("classic text import transaction", () => {
  it("allows the controlled batch import to complete over a remote database connection", () => {
    expect(CLASSIC_IMPORT_TRANSACTION_OPTIONS).toEqual({
      maxWait: 10_000,
      timeout: 30_000,
    });
  });
});
