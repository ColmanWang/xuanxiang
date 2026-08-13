import type { Metadata } from "next";
import { DeductionSystemsIndex } from "@/components/tools/deduction-systems-index";

export const metadata: Metadata = {
  title: "推演系统",
  description: "以可追溯的历法与规则引擎构建八字、六爻、紫微、奇门等传统术数推演系统。",
};

export default function ToolsPage() {
  return <DeductionSystemsIndex />;
}
