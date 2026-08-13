import { describe,expect,it } from "vitest";
import { luckCycleFixtures,validateLuckFixtureProvenance } from "@/fixtures/bazi/luck-cycles";
import { BAZI_REGRESSION_MANIFEST,evaluateBaziFoundation } from "./foundation";
import { KNOWN_LUCK_DIFFERENCES,validateKnownDifferences } from "./known-differences";
import { STANDARD_ZIPING } from "./rules";

describe("Phase 7.5 foundation metadata",()=>{
  it("requires provenance metadata on every luck fixture",()=>{
    expect(luckCycleFixtures).toHaveLength(20);
    expect(validateLuckFixtureProvenance()).toEqual({valid:true,errors:[]});
    expect(luckCycleFixtures.every((fixture)=>fixture.tier==="B")).toBe(true);
  });
  it("keeps formalization separate from the traditional statement",()=>{
    for(const reference of STANDARD_ZIPING.references){
      expect(reference.traditionalDescription).not.toBe(reference.formalization);
      expect(reference.citationIds.length).toBeGreaterThan(0);
      expect(reference.referenceRole).toBe("LATER_FORMULATION");
    }
  });
  it("classifies both one-day display differences",()=>{
    expect(KNOWN_LUCK_DIFFERENCES.map((item)=>item.fixtureId)).toEqual(["luck-02","luck-05"]);
    expect(validateKnownDifferences()).toEqual({valid:true,unresolved:[]});
  });
  it("generates a versioned machine-readable manifest",()=>{
    expect(BAZI_REGRESSION_MANIFEST.engineVersion).toBe("1.2.0");
    expect(BAZI_REGRESSION_MANIFEST.stableRuleSetVersion).toBe("1.1.0");
    expect(BAZI_REGRESSION_MANIFEST.luckFixtureCount).toBe(20);
  });
  it("reports readiness without lowering the Tier A threshold",()=>{
    expect(evaluateBaziFoundation({provenanceValid:true,tierACount:0})).toMatchObject({status:"READY_WITH_LIMITATIONS"});
    expect(evaluateBaziFoundation({provenanceValid:false})).toMatchObject({status:"BLOCKED"});
  });
});
