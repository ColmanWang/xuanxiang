import { EditorialError, EditorialErrorCode } from "./errors";

export function assertRevision(expectedUpdatedAt: string, currentUpdatedAt: Date): void {
  const expected = new Date(expectedUpdatedAt);
  if (Number.isNaN(expected.getTime()) || expected.getTime() !== currentUpdatedAt.getTime()) {
    throw new EditorialError(
      EditorialErrorCode.EDITORIAL_CONFLICT,
      "该内容已在其他位置更新，请刷新后重新检查修改",
      "expectedUpdatedAt",
      { expectedUpdatedAt, currentUpdatedAt: currentUpdatedAt.toISOString() },
    );
  }
}

export async function updateWithRevision<T>(input: {
  expectedUpdatedAt: string;
  currentUpdatedAt: Date;
  update: () => Promise<T>;
}): Promise<T> {
  assertRevision(input.expectedUpdatedAt, input.currentUpdatedAt);
  return input.update();
}
