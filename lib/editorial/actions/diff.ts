export interface TextDiffPart { kind: "unchanged" | "added" | "removed"; text: string }

/** Small line-oriented diff intended for editorial review, not textual scholarship. */
export function diffEditorialText(before: string, after: string): TextDiffPart[] {
  const left = before.split("\n");
  const right = after.split("\n");
  const matrix = Array.from({ length: left.length + 1 }, () => Array<number>(right.length + 1).fill(0));
  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) matrix[i][j] = left[i] === right[j] ? matrix[i + 1][j + 1] + 1 : Math.max(matrix[i + 1][j], matrix[i][j + 1]);
  }
  const parts: TextDiffPart[] = [];
  const append = (kind: TextDiffPart["kind"], line: string) => {
    const last = parts.at(-1);
    const text = `${line}\n`;
    if (last?.kind === kind) last.text += text;
    else parts.push({ kind, text });
  };
  let i = 0; let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) { append("unchanged", left[i]); i += 1; j += 1; }
    else if (matrix[i + 1][j] >= matrix[i][j + 1]) { append("removed", left[i]); i += 1; }
    else { append("added", right[j]); j += 1; }
  }
  while (i < left.length) { append("removed", left[i]); i += 1; }
  while (j < right.length) { append("added", right[j]); j += 1; }
  return parts.map((part) => ({ ...part, text: part.text.replace(/\n$/, "") }));
}
