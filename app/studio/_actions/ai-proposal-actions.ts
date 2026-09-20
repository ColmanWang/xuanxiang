"use server";

import { revalidatePath } from "next/cache";
import { toEditorialActionResult } from "@/lib/editorial/actions/errors";
import { acceptCandidateSummaryProposal, rejectCandidateSummaryProposal } from "@/lib/ai/proposals/service";
import { STUDIO_PERMISSIONS } from "@/lib/auth/permissions";
import { authorizeEditorialMutation } from "@/lib/editorial/actions/gate";

export async function acceptAiProposalAction(id: string) {
  return toEditorialActionResult(async () => { await authorizeEditorialMutation(STUDIO_PERMISSIONS.ACCEPT_PROPOSAL); const data = await acceptCandidateSummaryProposal(id); revalidatePath("/studio/proposals"); return data; });
}

export async function rejectAiProposalAction(id: string) {
  return toEditorialActionResult(async () => { await authorizeEditorialMutation(STUDIO_PERMISSIONS.REJECT_PROPOSAL); const data = await rejectCandidateSummaryProposal(id); revalidatePath("/studio/proposals"); return data; });
}
