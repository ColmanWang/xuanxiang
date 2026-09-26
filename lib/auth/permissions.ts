export const STUDIO_ROLES = ["EDITOR", "REVIEWER", "ADMIN"] as const;
export type StudioRoleName = (typeof STUDIO_ROLES)[number];

export const STUDIO_PERMISSIONS = {
  EDIT_DRAFT: "EDIT_DRAFT",
  CREATE_PROPOSAL: "CREATE_PROPOSAL",
  MARK_REVIEWED: "MARK_REVIEWED",
  PUBLISH: "PUBLISH",
  ACCEPT_PROPOSAL: "ACCEPT_PROPOSAL",
  REJECT_PROPOSAL: "REJECT_PROPOSAL",
  EDIT_SOURCE_CITATION: "EDIT_SOURCE_CITATION",
  ARCHIVE: "ARCHIVE",
  IMPORT: "IMPORT",
  MANAGE_AUTH: "MANAGE_AUTH",
} as const;

export type StudioPermission = (typeof STUDIO_PERMISSIONS)[keyof typeof STUDIO_PERMISSIONS];

const editorPermissions = [STUDIO_PERMISSIONS.EDIT_DRAFT, STUDIO_PERMISSIONS.CREATE_PROPOSAL] as const;
const reviewerPermissions = [
  ...editorPermissions,
  STUDIO_PERMISSIONS.MARK_REVIEWED,
  STUDIO_PERMISSIONS.PUBLISH,
  STUDIO_PERMISSIONS.ACCEPT_PROPOSAL,
  STUDIO_PERMISSIONS.REJECT_PROPOSAL,
  STUDIO_PERMISSIONS.EDIT_SOURCE_CITATION,
] as const;

const permissionsByRole: Readonly<Record<StudioRoleName, ReadonlySet<StudioPermission>>> = {
  EDITOR: new Set(editorPermissions),
  REVIEWER: new Set(reviewerPermissions),
  ADMIN: new Set(Object.values(STUDIO_PERMISSIONS)),
};

export function hasStudioPermission(role: StudioRoleName, permission: StudioPermission): boolean {
  return permissionsByRole[role].has(permission);
}

export function getStudioEntryCapabilities(role: StudioRoleName) {
  return {
    canReview: hasStudioPermission(role, STUDIO_PERMISSIONS.MARK_REVIEWED),
    canPublish: hasStudioPermission(role, STUDIO_PERMISSIONS.PUBLISH),
    canArchive: hasStudioPermission(role, STUDIO_PERMISSIONS.ARCHIVE),
  };
}
