import { CreateEntryForm } from "@/components/studio/create-entry-form";
import { StudioPageHeader } from "@/components/studio/studio-ui";
export default function NewEntryPage(){return <div className="space-y-7"><StudioPageHeader title="新建结构化条目" description="新条目以 DRAFT 且未发布状态创建，不会出现在前台搜索、图谱或公开详情页。"/><CreateEntryForm/></div>}
