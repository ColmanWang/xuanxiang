import { EARTHLY_BRANCHES, type Pillar } from "@/lib/calendar/ganzhi";
import type { EarthlyBranch } from "@/lib/calendar/ganzhi";

export interface VoidBranches {
  xunStartBranch: EarthlyBranch;
  branches: readonly [EarthlyBranch, EarthlyBranch];
}

export function calculateVoidBranches(day: Pillar): VoidBranches {
  const xunStartBranchIndex = (day.index % 12 - day.index % 10 + 12) % 12;
  return {
    xunStartBranch: EARTHLY_BRANCHES[xunStartBranchIndex],
    branches: [EARTHLY_BRANCHES[(xunStartBranchIndex + 10) % 12], EARTHLY_BRANCHES[(xunStartBranchIndex + 11) % 12]],
  };
}
