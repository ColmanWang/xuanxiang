import Link from "next/link";

export function CitationPreview({ subjectTitle, sourceTitle, locator, classicTitle, witnessTitle, sectionTitle, passageId, passageText, classicSlug }: { subjectTitle: string; sourceTitle: string; locator?: string; classicTitle?: string; witnessTitle?: string; sectionTitle?: string; passageId?: string; passageText?: string; classicSlug?: string }) {
  const href = passageId && classicSlug ? `/classics/${classicSlug}/read?passage=${passageId}&view=research` : undefined;
  return <section aria-label="典据预览" className="rounded-sm border p-4 text-sm">
    <dl className="grid grid-cols-[5rem_1fr] gap-y-2"><dt className="text-muted-foreground">引用对象</dt><dd>{subjectTitle}</dd><dt className="text-muted-foreground">资料</dt><dd>{sourceTitle}</dd><dt className="text-muted-foreground">位置</dt><dd>{locator || "待补 locator"}</dd>{passageId?<><dt className="text-muted-foreground">原典层级</dt><dd>{[classicTitle,witnessTitle,sectionTitle].filter(Boolean).join(" · ")}</dd><dt className="text-muted-foreground">文句</dt><dd className="font-serif leading-7">{passageText}</dd></>:null}</dl>
    {href?<Link href={href} target="_blank" className="mt-4 inline-block text-primary underline-offset-4 hover:underline">预览原典</Link>:null}
  </section>;
}
