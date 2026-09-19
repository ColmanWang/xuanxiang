"use server";

import { revalidatePath } from "next/cache";
import { toEditorialActionResult } from "@/lib/editorial/actions/errors";
import { acceptCandidateSummaryProposal, rejectCandidateSummaryProposal } from "@/lib/ai/proposals/service";

export async function acceptAiProposalAction(id: string) {
  return toEditorialActionResult(async () => { const data = await acceptCandidateSummaryProposal(id); revalidatePath("/studio/proposals"); return data; });
}

export async function rejectAiProposalAction(id: string) {
  return toEditorialActionResult(async () => { const data = await rejectCandidateSummaryProposal(id); revalidatePath("/studio/proposals"); return data; });
}
