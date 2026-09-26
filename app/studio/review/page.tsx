import { requireStudioPageAccess } from "../_lib/gate";
import { EntryTable, GapList, StudioPageHeader } from "@/components/studio/studio-ui";
import { getStudioEntries, getStudioGaps } from "../_lib/data";
export default async function ReviewPage(){await requireStudioPageAccess();const[entries,gaps]=await Promise.all([getStudioEntries(),getStudioGaps()]);const queue=entries.filter(item=>item.editorialStatus!=="REVIEWED");return <div className="space-y-8"><StudioPageHeader title="校订队列" description="REVIEWED 只能来自人工校订动作。典据数量不会触发自动升级。"/><section><h3 className="mb-4 font-serif text-xl">待校订条目</h3><EntryTable entries={queue.slice(0,30)}/></section><section><h3 className="mb-4 font-serif text-xl">校订前检查</h3><GapList gaps={gaps}/></section></div>}
