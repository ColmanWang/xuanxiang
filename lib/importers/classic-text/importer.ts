import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ClassicTextImportPayload } from "@/lib/importers/classic-text/types";
import { validateClassicImport } from "@/lib/importers/classic-text/validation";
import { validatePassageEntityLinks } from "@/lib/services/passage-link-validation-service";

type TransactionClient = Prisma.TransactionClient;

export async function importClassicText(payload: ClassicTextImportPayload, client: PrismaClient = prisma) {
  const sections = validateClassicImport(payload);
  return client.$transaction(async (tx: TransactionClient) => {
    const classic = await tx.classic.findUnique({ where: { slug: payload.classicSlug }, select: { id: true } });
    if (!classic) throw new Error(`Classic not found: ${payload.classicSlug}`);
    if (payload.witness.sourceId && !await tx.source.findUnique({ where: { id: payload.witness.sourceId }, select: { id: true } })) throw new Error(`Source not found: ${payload.witness.sourceId}`);
    const existingWitness = await tx.textWitness.findUnique({ where: { id: payload.witness.id }, select: { classicId: true } });
    if (existingWitness && existingWitness.classicId !== classic.id) throw new Error("Witness belongs to another Classic");
    await tx.textWitness.upsert({ where: { id: payload.witness.id }, update: { ...payload.witness, classicId: classic.id }, create: { ...payload.witness, classicId: classic.id, editorialStatus: payload.witness.editorialStatus ?? "DRAFT" } });
    for (const section of sections) {
      const { passages = [], ...sectionData } = section;
      const existingSection=await tx.textSection.findUnique({where:{id:section.id},select:{witnessId:true}});
      if(existingSection&&existingSection.witnessId!==payload.witness.id)throw new Error(`Section belongs to another Witness: ${section.id}`);
      await tx.textSection.upsert({ where: { id: section.id }, update: { ...sectionData, witnessId: payload.witness.id }, create: { ...sectionData, witnessId: payload.witness.id } });
      for (const passage of passages){const existingPassage=await tx.textPassage.findUnique({where:{id:passage.id},select:{sectionId:true}});if(existingPassage&&existingPassage.sectionId!==section.id)throw new Error(`Passage belongs to another Section: ${passage.id}`);await tx.textPassage.upsert({ where: { id: passage.id }, update: { sectionId: section.id, ordinal: passage.ordinal, text: passage.text, normalizedText: passage.normalizedText, contentType: passage.contentType ?? "SOURCE_TEXT", editorialStatus: passage.editorialStatus ?? "DRAFT" }, create: { id: passage.id, sectionId: section.id, ordinal: passage.ordinal, text: passage.text, normalizedText: passage.normalizedText, contentType: passage.contentType ?? "SOURCE_TEXT", editorialStatus: passage.editorialStatus ?? "DRAFT" } });}
    }
    const links = sections.flatMap((section) => (section.passages ?? []).flatMap((passage) => (passage.links ?? []).map((link) => ({ ...link, passageId: passage.id }))));
    await validatePassageEntityLinks(tx, links);
    for (const link of links) await tx.passageEntityLink.upsert({ where: { id: link.id }, update: link, create: link });
    return { classicId: classic.id, witnessId: payload.witness.id, sectionCount: sections.length, passageCount: sections.reduce((sum, section) => sum + (section.passages?.length ?? 0), 0), linkCount: links.length };
  });
}
