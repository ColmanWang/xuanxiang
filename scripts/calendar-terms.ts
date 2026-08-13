import { getSolarTerms } from "../lib/calendar/lunar-adapter";
const args=process.argv.slice(2);const year=Number(args[0]);const timezone=args[1]??"Asia/Shanghai";
if(!Number.isInteger(year)){console.error("用法：pnpm calendar:terms 2026 Asia/Shanghai");process.exit(1);}
for(const term of getSolarTerms(year,timezone))console.log(`${term.name.padEnd(2,"　")}  ${term.localDateTime}  ${timezone}  (${term.utcInstant})`);
