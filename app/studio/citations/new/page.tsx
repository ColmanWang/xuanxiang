import { CitationCreateForm } from "@/components/studio/record-create-forms";
import { StudioPageHeader } from "@/components/studio/studio-ui";
import { getCitationEditorOptions } from "../../_lib/data";
export default async function Page(){const options=await getCitationEditorOptions();return <div className="space-y-7"><StudioPageHeader title="新建典据" description="Citation 同时校验引用对象、Source 与可选 Passage；不允许孤立引用。"/><CitationCreateForm {...options}/></div>}
