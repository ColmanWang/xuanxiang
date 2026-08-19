import { controls,produces } from "./five-elements";
import type { FiveElement,SixRelative } from "./types";
export function calculateSixRelative(palace:FiveElement,line:FiveElement):SixRelative{if(palace===line)return"SIBLING";if(produces(line,palace))return"PARENT";if(produces(palace,line))return"OFFSPRING";if(controls(line,palace))return"OFFICIAL_GHOST";return"WEALTH"}
