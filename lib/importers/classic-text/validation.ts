import type { ClassicTextImportPayload, FlattenedSection, SectionImport } from "@/lib/importers/classic-text/types";

export function flattenSections(sections: SectionImport[], parentId?: string, depth = 0): FlattenedSection[] {
  return sections.flatMap((section) => [
    { ...section, children: undefined, parentId: section.parentId ?? parentId, depth },
    ...flattenSections(section.children ?? [], section.id, depth + 1),
  ]);
}

export function validateClassicImport(payload: ClassicTextImportPayload): FlattenedSection[] {
  if (!payload.classicSlug.trim()) throw new Error("classicSlug is required");
  if (!payload.witness.id.trim() || !payload.witness.title.trim()) throw new Error("Witness id and title are required");
  const sections = flattenSections(payload.sections);
  const sectionIds = new Set<string>();
  const sectionSlugs = new Set<string>();
  const sectionOrdinals = new Set<string>();
  for (const section of sections) {
    if (sectionIds.has(section.id)) throw new Error(`Duplicate section id: ${section.id}`);
    if (sectionSlugs.has(section.slug)) throw new Error(`Duplicate section slug: ${section.slug}`);
    if (!Number.isInteger(section.ordinal) || section.ordinal < 1) throw new Error(`Invalid section ordinal: ${section.id}`);
    if (section.parentId && !sections.some((candidate) => candidate.id === section.parentId)) throw new Error(`Invalid parent section: ${section.parentId}`);
    if (section.parentId === section.id) throw new Error(`Section cannot parent itself: ${section.id}`);
    const ordinalKey=`${section.parentId??"root"}:${section.ordinal}`;
    if(sectionOrdinals.has(ordinalKey))throw new Error(`Duplicate section ordinal: ${ordinalKey}`);
    sectionOrdinals.add(ordinalKey);
    sectionIds.add(section.id); sectionSlugs.add(section.slug);
    const ordinals = new Set<number>();
    for (const passage of section.passages ?? []) {
      if (!passage.text.trim()) throw new Error(`Empty passage: ${passage.id}`);
      if (!Number.isInteger(passage.ordinal) || passage.ordinal < 1) throw new Error(`Invalid passage ordinal: ${passage.id}`);
      if (ordinals.has(passage.ordinal)) throw new Error(`Duplicate passage ordinal in ${section.id}: ${passage.ordinal}`);
      ordinals.add(passage.ordinal);
    }
  }
  const parentById=new Map(sections.map(section=>[section.id,section.parentId]));
  for(const section of sections){const visited=new Set<string>([section.id]);let parent=section.parentId;while(parent){if(visited.has(parent))throw new Error(`Cyclic section tree: ${section.id}`);visited.add(parent);parent=parentById.get(parent)}}
  return sections;
}
