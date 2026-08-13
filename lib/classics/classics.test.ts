import {describe,expect,it} from "vitest";
import {splitHighlightText} from "@/lib/classics/highlight-text";
import {parseReaderParams} from "@/lib/classics/reader-params";
describe("classic reader helpers",()=>{
  it("highlights only the query without HTML injection",()=>{expect(splitHighlightText("一阴一阳之谓道","一阴一阳")).toEqual([{text:"一阴一阳",highlighted:true},{text:"之谓道",highlighted:false}]);expect(splitHighlightText("<script>道</script>","道")[1]).toEqual({text:"道",highlighted:true})});
  it("parses one deep-link value and ignores arrays",()=>{expect(parseReaderParams({section:"xici-shang",passage:" p-1 ",edition:["a","b"]})).toEqual({section:"xici-shang",passage:"p-1",edition:undefined})});
});
