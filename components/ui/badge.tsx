import type { HTMLAttributes } from "react"; import { cn } from "@/lib/utils";
export function Badge({className,...p}:HTMLAttributes<HTMLSpanElement>){return <span className={cn("inline-flex rounded-sm border bg-secondary px-2 py-0.5 text-xs text-secondary-foreground",className)} {...p}/>}
