import { requireStudioPageAccess } from "../../_lib/gate";
import { SourceCreateForm } from "@/components/studio/record-create-forms";
import { StudioPageHeader } from "@/components/studio/studio-ui";
export default async function Page(){await requireStudioPageAccess();return <div className="space-y-7"><StudioPageHeader title="新增资料来源" description="保存可识别的作品、版本和责任信息；URL 只是访问方式。"/><SourceCreateForm/></div>}
