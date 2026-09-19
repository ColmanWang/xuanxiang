"use server";

import { revalidatePath } from "next/cache";
import { assertEditorialStudioEnabled } from "@/lib/editorial/actions/gate";
import { toEditorialActionResult } from "@/lib/editorial/actions/errors";
import { editorialWriteService } from "@/lib/editorial/actions/service";

async function run<T>(work: () => Promise<T>) {
  return toEditorialActionResult(async () => { assertEditorialStudioEnabled(); const data = await work(); revalidatePath("/studio", "layout"); return data; });
}

export async function saveConceptAction(input: unknown) { return run(() => editorialWriteService.saveConcept(input)); }
export async function savePersonAction(input: unknown) { return run(() => editorialWriteService.savePerson(input)); }
export async function saveSchoolAction(input: unknown) { return run(() => editorialWriteService.saveSchool(input)); }
export async function saveClassicAction(input: unknown) { return run(() => editorialWriteService.saveClassic(input)); }
export async function saveTechniqueAction(input: unknown) { return run(() => editorialWriteService.saveTechnique(input)); }
export async function saveRelationAction(input: unknown) { return run(() => editorialWriteService.saveRelation(input)); }
export async function saveSourceAction(input: unknown) { return run(() => editorialWriteService.saveSource(input)); }
export async function saveCitationAction(input: unknown) { return run(() => editorialWriteService.saveCitation(input)); }
export async function saveInterpretationAction(input: unknown) { return run(() => editorialWriteService.saveInterpretation(input)); }
export async function saveWitnessAction(input: unknown) { return run(() => editorialWriteService.saveWitness(input)); }
export async function saveSectionAction(input: unknown) { return run(() => editorialWriteService.saveSection(input)); }
export async function savePassageAction(input: unknown) { return run(() => editorialWriteService.savePassage(input)); }
export async function markReviewedAction(type: "CONCEPT" | "PERSON" | "SCHOOL" | "CLASSIC" | "TECHNIQUE", id: string, expectedUpdatedAt: Date) { return run(() => editorialWriteService.markReviewed(type, id, expectedUpdatedAt)); }
export async function archiveEntityAction(type: "CONCEPT" | "PERSON" | "SCHOOL" | "CLASSIC" | "TECHNIQUE", id: string, expectedUpdatedAt: Date) { return run(() => editorialWriteService.archiveEntity(type, id, expectedUpdatedAt)); }
export async function setPublicationStatusAction(type: "CONCEPT" | "PERSON" | "SCHOOL" | "CLASSIC" | "TECHNIQUE", id: string, status: "DRAFT" | "PUBLISHED", expectedUpdatedAt: Date) { return run(() => editorialWriteService.setPublicationStatus(type, id, status, expectedUpdatedAt)); }
