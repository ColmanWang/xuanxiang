import { solarTermFixtures, absoluteTimeDifference } from "../fixtures/calendar/solar-terms";
import { getSolarTerms } from "../lib/calendar/lunar-adapter";

const rows=solarTermFixtures.map((fixture)=>{const term=getSolarTerms(fixture.year,fixture.displayedTimezone).find((item)=>item.name===fixture.term);if(!term)throw new Error(`missing ${fixture.year} ${fixture.term}`);const delta=absoluteTimeDifference(term.utcInstant,fixture.expectedInstant);return{fixture,actual:term.utcInstant,delta,pass:delta<=fixture.toleranceSeconds};});
for(const row of rows)console.log(`${row.fixture.year} ${row.fixture.term} expected=${row.fixture.expectedInstant} actual=${row.actual} delta=${row.delta}s ${row.pass?"PASS":"FAIL"}`);
const sorted=rows.map((row)=>row.delta).sort((a,b)=>a-b);const median=sorted.length%2?sorted[(sorted.length-1)/2]:(sorted[sorted.length/2-1]+sorted[sorted.length/2])/2;
console.log(`\nfixtures=${rows.length} max=${Math.max(...sorted)}s median=${median}s failed=${rows.filter((row)=>!row.pass).length}`);
if(rows.some((row)=>!row.pass))process.exitCode=1;
