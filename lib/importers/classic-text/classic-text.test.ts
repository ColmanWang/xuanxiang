import { describe,expect,it } from "vitest";
import type { ClassicTextImportPayload } from "@/lib/importers/classic-text/types";
import { flattenSections,validateClassicImport } from "@/lib/importers/classic-text/validation";

const base=():ClassicTextImportPayload=>({classicSlug:"laozi",witness:{id:"w-test",title:"测试本",editionType:"DIGITAL_TRANSCRIPTION"},sections:[{id:"s-1",slug:"chapter-1",title:"第一章",ordinal:1,sectionType:"章",passages:[{id:"p-1",ordinal:1,text:"测试短句。"}]},{id:"s-2",slug:"chapter-2",title:"第二章",ordinal:2,sectionType:"章",children:[{id:"s-2-1",slug:"chapter-2-note",title:"附记",ordinal:1,sectionType:"附",passages:[{id:"p-2",ordinal:1,text:"另一短句。"}]}]}]});
describe("classic text import validation",()=>{
  it("flattens a valid section tree with parent and depth",()=>{const rows=validateClassicImport(base());expect(rows).toHaveLength(3);expect(rows[2]).toMatchObject({parentId:"s-2",depth:1})});
  it("rejects duplicate passage ordinals",()=>{const payload=base();payload.sections[0].passages!.push({id:"p-x",ordinal:1,text:"重复。"});expect(()=>validateClassicImport(payload)).toThrow("Duplicate passage ordinal")});
  it("rejects invalid passage ordinals",()=>{const payload=base();payload.sections[0].passages![0].ordinal=0;expect(()=>validateClassicImport(payload)).toThrow("Invalid passage ordinal")});
  it("rejects duplicate sibling section ordinals",()=>{const payload=base();payload.sections[1].ordinal=1;expect(()=>validateClassicImport(payload)).toThrow("Duplicate section ordinal")});
  it("rejects an invalid explicit parent",()=>{const payload=base();payload.sections[0].parentId="missing";expect(()=>validateClassicImport(payload)).toThrow("Invalid parent section")});
  it("keeps passage ordering data stable",()=>{const rows=flattenSections(base().sections);expect(rows.flatMap(row=>row.passages??[]).map(p=>p.ordinal)).toEqual([1,1])});
});
