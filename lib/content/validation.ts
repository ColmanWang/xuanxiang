import type { ContentExport } from "./types";

export type ContentValidationSeverity = "WARNING" | "ERROR";
export interface ContentValidationIssue { code: string; severity: ContentValidationSeverity; message: string; entityId?: string; }
export interface ContentValidationReport { status: "PASS" | "PASS_WITH_WARNINGS" | "FAIL"; issues: ContentValidationIssue[]; }

function issue(code: string, severity: ContentValidationSeverity, message: string, entityId?: string): ContentValidationIssue {
  return { code, severity, message, entityId };
}

export function validateKnowledgeBase(content: ContentExport): ContentValidationReport {
  const issues: ContentValidationIssue[] = [];
  const ids = new Set(content.entities.map((entity) => entity.id));
  const slugs = new Map<string, string>();
  for (const entity of content.entities) {
    const key = `${entity.type}:${entity.slug.trim().toLocaleLowerCase()}`;
    const duplicate = slugs.get(key);
    if (duplicate) issues.push(issue("DUPLICATE_SLUG", "ERROR", `Slug ${entity.slug} 与 ${duplicate} 重复`, entity.id));
    slugs.set(key, entity.id);
  }

  const relationIds = new Set(content.relations.map((relation) => relation.id));
  for (const relation of content.relations) {
    if (!ids.has(relation.sourceId) || !ids.has(relation.targetId)) issues.push(issue("DANGLING_RELATION", "ERROR", "关系端点不存在", relation.id));
  }

  const sourceIds = new Set(content.sources.map((source) => source.id));
  const passageIds = new Set(content.passages.map((passage) => passage.id));
  const interpretationIds = new Set(content.interpretations.map((interpretation) => interpretation.id));
  const dynastyIds = new Set(content.entities.filter((entity) => entity.type === "DYNASTY").map((entity) => entity.id));
  const subjectExists = (type: string, id: string) => type === "RELATION" ? relationIds.has(id) : type === "INTERPRETATION" ? interpretationIds.has(id) : type === "DYNASTY" ? dynastyIds.has(id) : ids.has(id);
  for (const citation of content.citations) {
    if (!sourceIds.has(citation.sourceId)) issues.push(issue("DANGLING_CITATION_SOURCE", "ERROR", "Citation 的 Source 不存在", citation.id));
    if (!subjectExists(citation.subjectType, citation.subjectId)) issues.push(issue("DANGLING_CITATION_SUBJECT", "ERROR", "Citation 的 subject 不存在", citation.id));
    if (citation.passageId && !passageIds.has(citation.passageId)) issues.push(issue("DANGLING_CITATION_PASSAGE", "ERROR", "Citation 的 Passage 不存在", citation.id));
  }

  const citationSubjects = new Set(content.citations.map((citation) => `${citation.subjectType}:${citation.subjectId}`));
  for (const entity of content.entities) {
    if (entity.editorialStatus === "SOURCED" && !citationSubjects.has(`${entity.type}:${entity.id}`)) issues.push(issue("SOURCED_WITHOUT_CITATION", "WARNING", "SOURCED 条目尚无直接 Citation", entity.id));
  }

  const witnessIds = new Set(content.witnesses.map((witness) => witness.id));
  for (const witness of content.witnesses) {
    if (!ids.has(witness.classicId)) issues.push(issue("WITNESS_WITHOUT_CLASSIC", "ERROR", "Witness 所属 Classic 不存在", witness.id));
    if (witness.sourceId && !sourceIds.has(witness.sourceId)) issues.push(issue("WITNESS_WITHOUT_SOURCE", "ERROR", "Witness 的 Source 不存在", witness.id));
  }
  const primaryByClassic = new Map<string, number>();
  for (const witness of content.witnesses.filter((item) => item.isPrimary)) primaryByClassic.set(witness.classicId, (primaryByClassic.get(witness.classicId) ?? 0) + 1);
  for (const [classicId, count] of primaryByClassic) if (count > 1) issues.push(issue("MULTIPLE_PRIMARY_WITNESSES", "ERROR", "同一 Classic 存在多个 primary Witness", classicId));

  const sectionIds = new Set(content.sections.map((section) => section.id));
  const parentById = new Map(content.sections.map((section) => [section.id, section.parentId]));
  for (const section of content.sections) {
    if (!witnessIds.has(section.witnessId)) issues.push(issue("ORPHAN_SECTION", "ERROR", "Section 的 Witness 不存在", section.id));
    if (section.parentId && !sectionIds.has(section.parentId)) issues.push(issue("INVALID_SECTION_PARENT", "ERROR", "Section 的 parent 不存在", section.id));
    const visited = new Set([section.id]); let parent = section.parentId;
    while (parent) { if (visited.has(parent)) { issues.push(issue("CYCLIC_SECTION_TREE", "ERROR", "Section tree 存在循环", section.id)); break; } visited.add(parent); parent = parentById.get(parent); }
  }
  for (const passage of content.passages) if (!sectionIds.has(passage.sectionId)) issues.push(issue("ORPHAN_PASSAGE", "ERROR", "Passage 的 Section 不存在", passage.id));
  for (const link of content.passageEntityLinks) {
    if (!passageIds.has(link.passageId) || !ids.has(link.entityId)) issues.push(issue("INVALID_PASSAGE_ENTITY_LINK", "ERROR", "Passage Entity Link 端点不存在", link.id));
  }
  for (const provenance of content.ruleProvenance ?? []) {
    const missing = provenance.citationIds.filter((citationId) => !content.citations.some((citation) => citation.id === citationId));
    if (missing.length) issues.push(issue("DANGLING_RULE_PROVENANCE", "ERROR", `规则典据缺少 Citation：${missing.join(", ")}`, provenance.policyId));
    if (provenance.stable && provenance.status !== "SOURCED") issues.push(issue("STABLE_POLICY_WITHOUT_PROVENANCE", "ERROR", "Stable Policy 缺少正式典据", provenance.policyId));
  }
  const status = issues.some((item) => item.severity === "ERROR") ? "FAIL" : issues.length ? "PASS_WITH_WARNINGS" : "PASS";
  return { status, issues };
}
