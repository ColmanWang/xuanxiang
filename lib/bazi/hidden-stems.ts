import { EarthlyBranch as B, HeavenlyStem as S } from "../calendar/ganzhi";
import type { BranchStemDefinition, HiddenStem } from "./types";
import { tenGod } from "./ten-gods";
export const HIDDEN_STEMS:Record<B,BranchStemDefinition["stems"]>={
 [B.ZI]:[{stem:S.GUI,role:"主气"}],[B.CHOU]:[{stem:S.JI,role:"主气"},{stem:S.GUI,role:"中气"},{stem:S.XIN,role:"余气"}],[B.YIN]:[{stem:S.JIA,role:"主气"},{stem:S.BING,role:"中气"},{stem:S.WU,role:"余气"}],[B.MAO]:[{stem:S.YI,role:"主气"}],[B.CHEN]:[{stem:S.WU,role:"主气"},{stem:S.YI,role:"中气"},{stem:S.GUI,role:"余气"}],[B.SI]:[{stem:S.BING,role:"主气"},{stem:S.WU,role:"中气"},{stem:S.GENG,role:"余气"}],[B.WU]:[{stem:S.DING,role:"主气"},{stem:S.JI,role:"中气"}],[B.WEI]:[{stem:S.JI,role:"主气"},{stem:S.DING,role:"中气"},{stem:S.YI,role:"余气"}],[B.SHEN]:[{stem:S.GENG,role:"主气"},{stem:S.REN,role:"中气"},{stem:S.WU,role:"余气"}],[B.YOU]:[{stem:S.XIN,role:"主气"}],[B.XU]:[{stem:S.WU,role:"主气"},{stem:S.XIN,role:"中气"},{stem:S.DING,role:"余气"}],[B.HAI]:[{stem:S.REN,role:"主气"},{stem:S.JIA,role:"中气"}],};
export function hiddenStems(branch:B,dayStem:S):HiddenStem[]{return HIDDEN_STEMS[branch].map(item=>({...item,tenGod:tenGod(dayStem,item.stem)}));}
