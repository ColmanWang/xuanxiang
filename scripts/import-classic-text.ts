import { readFile } from "node:fs/promises";
import type { ClassicTextImportPayload } from "../lib/importers/classic-text/types";
import { importClassicText } from "../lib/importers/classic-text/importer";
const path=process.argv[2];if(!path)throw new Error("Usage: pnpm classics:import <payload.json>");const payload=JSON.parse(await readFile(path,"utf8")) as ClassicTextImportPayload;const result=await importClassicText(payload);console.log(result);
