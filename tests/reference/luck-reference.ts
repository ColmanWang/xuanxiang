import { Lunar, Solar } from "lunar-typescript";
import type { BirthInput, LuckDirection } from "@/lib/bazi/types";

const cycle = ["甲子","乙丑","丙寅","丁卯","戊辰","己巳","庚午","辛未","壬申","癸酉","甲戌","乙亥","丙子","丁丑","戊寅","己卯","庚辰","辛巳","壬午","癸未","甲申","乙酉","丙戌","丁亥","戊子","己丑","庚寅","辛卯","壬辰","癸巳","甲午","乙未","丙申","丁酉","戊戌","己亥","庚子","辛丑","壬寅","癸卯","甲辰","乙巳","丙午","丁未","戊申","己酉","庚戌","辛亥","壬子","癸丑","甲寅","乙卯","丙辰","丁巳","戊午","己未","庚申","辛酉","壬戌","癸亥"] as const;

export function referenceSequence(month: string, direction: LuckDirection, count: number) {
  const start = cycle.indexOf(month as (typeof cycle)[number]);
  return Array.from({ length: count }, (_, index) => cycle[(start + (direction === "FORWARD" ? 1 : -1) * (index + 1) + 600) % 60]);
}

export function referenceYun(input: BirthInput) {
  if (!input.time || (input.sex !== "MALE" && input.sex !== "FEMALE")) throw new Error("完整公历时间与性别为必需字段");
  const solar = Solar.fromYmdHms(input.date.year, input.date.month, input.date.day, input.time.hour, input.time.minute, input.time.second ?? 0);
  const yun = Lunar.fromSolar(solar).getEightChar().getYun(input.sex === "MALE" ? 1 : 0, 2);
  return {
    direction: yun.isForward() ? "FORWARD" : "BACKWARD",
    startAge: { years: yun.getStartYear(), months: yun.getStartMonth(), days: yun.getStartDay() },
  } as const;
}
