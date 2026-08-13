export interface ReaderParams { section?: string; passage?: string; edition?: string }
export function parseReaderParams(input: Record<string, string | string[] | undefined>): ReaderParams {
  const one = (value: string | string[] | undefined) => typeof value === "string" && value.trim() ? value.trim() : undefined;
  return { section: one(input.section), passage: one(input.passage), edition: one(input.edition) };
}
