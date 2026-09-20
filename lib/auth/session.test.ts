import { describe, expect, it, vi } from "vitest";
import { resolveStudioPrincipal } from "./session";

const verifiedSession = { user: { id: "user-1", email: "Editor@Example.com", emailVerified: true, name: "Editor" } };

describe("Studio principal resolution", () => {
  it("rejects sessions whose provider email is not verified", async () => {
    const database = { studioMember: { findFirst: vi.fn(), updateMany: vi.fn() } };
    await expect(resolveStudioPrincipal({ user: { ...verifiedSession.user, emailVerified: false } }, database)).resolves.toBeNull();
    expect(database.studioMember.findFirst).not.toHaveBeenCalled();
  });

  it("prefers an existing immutable user binding", async () => {
    const database = { studioMember: { findFirst: vi.fn().mockResolvedValueOnce({ id: "member-1", role: "REVIEWER" }), updateMany: vi.fn() } };
    await expect(resolveStudioPrincipal(verifiedSession, database)).resolves.toMatchObject({ userId: "user-1", role: "REVIEWER" });
    expect(database.studioMember.findFirst).toHaveBeenCalledTimes(1);
    expect(database.studioMember.updateMany).not.toHaveBeenCalled();
  });

  it("uses email only for one-time binding and fails closed if the bind loses a race", async () => {
    const database = {
      studioMember: {
        findFirst: vi.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({ id: "member-1", role: "EDITOR" }),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
    };
    await expect(resolveStudioPrincipal(verifiedSession, database)).resolves.toMatchObject({ userId: "user-1", role: "EDITOR" });
    expect(database.studioMember.updateMany).toHaveBeenCalledWith({ where: { id: "member-1", userId: null, enabled: true }, data: { userId: "user-1" } });
    database.studioMember.findFirst.mockReset().mockResolvedValueOnce(null).mockResolvedValueOnce({ id: "member-1", role: "EDITOR" });
    database.studioMember.updateMany.mockResolvedValueOnce({ count: 0 });
    await expect(resolveStudioPrincipal(verifiedSession, database)).resolves.toBeNull();
  });
});
