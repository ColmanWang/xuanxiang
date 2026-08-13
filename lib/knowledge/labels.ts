import type { EditorialStatus, EvidenceStatus, RelationType, SourceType } from "@prisma/client";

export const editorialStatusLabels: Record<EditorialStatus, string> = { DRAFT: "草稿", BASIC: "基础条目", SOURCED: "已有典据", REVIEWED: "已校订" };
export const evidenceStatusLabels: Record<EvidenceStatus, string> = { DOCUMENTED: "有文献依据", TRADITIONAL: "传统归属", INFERRED: "关系推定", CONTESTED: "存在争议" };
export const sourceTypeLabels: Record<SourceType, string> = { PRIMARY_TEXT: "原典", CLASSICAL_COMMENTARY: "古典注疏", MODERN_BOOK: "现代著作", ACADEMIC_PAPER: "学术论文", REFERENCE_WORK: "工具书", OTHER: "其他资料" };
export const relationTypeLabels: Record<RelationType, string> = { RELATED_TO: "相关", BELONGS_TO: "属于", DERIVED_FROM: "源自", INFLUENCED_BY: "受到影响", WRITTEN_BY: "作者为", APPEARS_IN: "出现于", DEVELOPED_DURING: "发展于", USES: "使用", INTERPRETS: "解释" };
