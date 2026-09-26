import { requireStudioPageAccess } from "../../_lib/gate";
import { RelationCreateForm } from "@/components/studio/record-create-forms";
import { StudioPageHeader } from "@/components/studio/studio-ui";
import { getEntityOptions } from "../../_lib/data";
export default async function Page(){await requireStudioPageAccess();const entities=await getEntityOptions();return <div className="space-y-7"><StudioPageHeader title="新建知识关系" description="确认起点、关系类型与终点方向后，再交由服务端验证 endpoint。"/><RelationCreateForm entities={entities}/></div>}
