import { describe, expect, it } from "vitest";
import { getStudioEntryCapabilities, hasStudioPermission, STUDIO_PERMISSIONS } from "./permissions";
import { EditorialErrorCode } from "@/lib/editorial/errors";

describe("Studio RBAC", () => {
  it("limits editors to draft edits and proposal creation", () => {
    expect(hasStudioPermission("EDITOR", STUDIO_PERMISSIONS.EDIT_DRAFT)).toBe(true);
    expect(hasStudioPermission("EDITOR", STUDIO_PERMISSIONS.CREATE_PROPOSAL)).toBe(true);
    expect(hasStudioPermission("EDITOR", STUDIO_PERMISSIONS.MARK_REVIEWED)).toBe(false);
    expect(hasStudioPermission("EDITOR", STUDIO_PERMISSIONS.EDIT_SOURCE_CITATION)).toBe(false);
  });

  it("allows reviewers to review, publish, and decide proposals", () => {
    expect(hasStudioPermission("REVIEWER", STUDIO_PERMISSIONS.MARK_REVIEWED)).toBe(true);
    expect(hasStudioPermission("REVIEWER", STUDIO_PERMISSIONS.PUBLISH)).toBe(true);
    expect(hasStudioPermission("REVIEWER", STUDIO_PERMISSIONS.ACCEPT_PROPOSAL)).toBe(true);
    expect(hasStudioPermission("REVIEWER", STUDIO_PERMISSIONS.REJECT_PROPOSAL)).toBe(true);
    expect(hasStudioPermission("REVIEWER", STUDIO_PERMISSIONS.ARCHIVE)).toBe(false);
  });

  it("reserves archive, import, and auth management for admins", () => {
    for (const permission of Object.values(STUDIO_PERMISSIONS)) {
      expect(hasStudioPermission("ADMIN", permission)).toBe(true);
    }
    expect(hasStudioPermission("REVIEWER", STUDIO_PERMISSIONS.IMPORT)).toBe(false);
    expect(hasStudioPermission("REVIEWER", STUDIO_PERMISSIONS.MANAGE_AUTH)).toBe(false);
  });

  it("exposes only role-appropriate entry controls", () => {
    expect(getStudioEntryCapabilities("EDITOR")).toEqual({ canReview: false, canPublish: false, canArchive: false });
    expect(getStudioEntryCapabilities("REVIEWER")).toEqual({ canReview: true, canPublish: true, canArchive: false });
    expect(getStudioEntryCapabilities("ADMIN")).toEqual({ canReview: true, canPublish: true, canArchive: true });
  });

  it("exposes stable authentication and authorization errors", () => {
    expect(EditorialErrorCode.AUTHENTICATION_REQUIRED).toBe("AUTHENTICATION_REQUIRED");
    expect(EditorialErrorCode.FORBIDDEN).toBe("FORBIDDEN");
  });
});
