import { EditorialError, EditorialErrorCode } from "../errors";

export { EditorialErrorCode } from "../errors";

export class EditorialActionError extends EditorialError {
  constructor(
    code: EditorialErrorCode | `${EditorialErrorCode}`,
    message: string,
    field?: string,
    details?: Readonly<Record<string, unknown>>,
  ) {
    super(code as EditorialErrorCode, message, field, details);
    this.name = "EditorialActionError";
  }
}

export type EditorialActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: `${EditorialErrorCode}`; message: string; field?: string; details?: Readonly<Record<string, unknown>> } };

export function toEditorialActionResult<T>(work: () => Promise<T>): Promise<EditorialActionResult<T>> {
  return work().then(
    (data) => ({ ok: true as const, data }),
    (error: unknown) => {
      const normalized = error instanceof EditorialActionError
        ? error
        : new EditorialActionError("VALIDATION_FAILED", "编辑操作失败，请检查输入后重试。");
      return { ok: false as const, error: { code: normalized.code, message: normalized.message, field: normalized.field, details: normalized.details } };
    },
  );
}
