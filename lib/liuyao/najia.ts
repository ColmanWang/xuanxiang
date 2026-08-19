import { EarthlyBranch as B,HeavenlyStem as S } from "@/lib/calendar/ganzhi";
import type { Najia,TrigramId } from "./types";
type Placement="INNER"|"OUTER";
const TABLE:Record<TrigramId,Record<Placement,readonly [Najia,Najia,Najia]>>={
 QIAN:{INNER:[{stem:S.JIA,branch:B.ZI},{stem:S.JIA,branch:B.YIN},{stem:S.JIA,branch:B.CHEN}],OUTER:[{stem:S.REN,branch:B.WU},{stem:S.REN,branch:B.SHEN},{stem:S.REN,branch:B.XU}]},
 KUN:{INNER:[{stem:S.YI,branch:B.WEI},{stem:S.YI,branch:B.SI},{stem:S.YI,branch:B.MAO}],OUTER:[{stem:S.GUI,branch:B.CHOU},{stem:S.GUI,branch:B.HAI},{stem:S.GUI,branch:B.YOU}]},
 ZHEN:{INNER:[{stem:S.GENG,branch:B.ZI},{stem:S.GENG,branch:B.YIN},{stem:S.GENG,branch:B.CHEN}],OUTER:[{stem:S.GENG,branch:B.WU},{stem:S.GENG,branch:B.SHEN},{stem:S.GENG,branch:B.XU}]},
 XUN:{INNER:[{stem:S.XIN,branch:B.CHOU},{stem:S.XIN,branch:B.HAI},{stem:S.XIN,branch:B.YOU}],OUTER:[{stem:S.XIN,branch:B.WEI},{stem:S.XIN,branch:B.SI},{stem:S.XIN,branch:B.MAO}]},
 KAN:{INNER:[{stem:S.WU,branch:B.YIN},{stem:S.WU,branch:B.CHEN},{stem:S.WU,branch:B.WU}],OUTER:[{stem:S.WU,branch:B.SHEN},{stem:S.WU,branch:B.XU},{stem:S.WU,branch:B.ZI}]},
 LI:{INNER:[{stem:S.JI,branch:B.MAO},{stem:S.JI,branch:B.CHOU},{stem:S.JI,branch:B.HAI}],OUTER:[{stem:S.JI,branch:B.YOU},{stem:S.JI,branch:B.WEI},{stem:S.JI,branch:B.SI}]},
 GEN:{INNER:[{stem:S.BING,branch:B.CHEN},{stem:S.BING,branch:B.WU},{stem:S.BING,branch:B.SHEN}],OUTER:[{stem:S.BING,branch:B.XU},{stem:S.BING,branch:B.ZI},{stem:S.BING,branch:B.YIN}]},
 DUI:{INNER:[{stem:S.DING,branch:B.SI},{stem:S.DING,branch:B.MAO},{stem:S.DING,branch:B.CHOU}],OUTER:[{stem:S.DING,branch:B.HAI},{stem:S.DING,branch:B.YOU},{stem:S.DING,branch:B.WEI}]},
};
export function assignNajia(lower:TrigramId,upper:TrigramId):Najia[]{return[...TABLE[lower].INNER,...TABLE[upper].OUTER]}
