import { z } from "zod";
const lineValue=z.union([z.literal(6),z.literal(7),z.literal(8),z.literal(9)]);
export const liuyaoInputSchema=z.object({method:z.enum(["MANUAL_LINE_VALUES","THREE_COINS"]),lineOrder:z.literal("BOTTOM_TO_TOP").optional(),lines:z.array(lineValue).length(6),divinationTime:z.object({localDateTime:z.string().min(1),timezone:z.string().min(1),timeDisambiguation:z.enum(["EARLIER","LATER"]).optional()}).strict(),question:z.string().max(500).optional(),ruleSetId:z.literal("STANDARD_WENWANG_GUA").optional()}).strict();
