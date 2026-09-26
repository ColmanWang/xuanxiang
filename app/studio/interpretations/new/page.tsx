import { requireStudioPageAccess } from "../../_lib/gate";
import { InterpretationCreateForm } from "@/components/studio/record-create-forms";
import { StudioPageHeader } from "@/components/studio/studio-ui";
import { getEntityOptions } from "../../_lib/data";
export default async function Page(){await requireStudioPageAccess();const entities=await getEntityOptions();return <div className="space-y-7"><StudioPageHeader title="新建异说" description="并列记录不同人物、学派与时期的解释，不自动生成唯一结论。"/><InterpretationCreateForm entities={entities}/></div>}
