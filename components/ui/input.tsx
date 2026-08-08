import type { InputHTMLAttributes } from "react"; import { cn } from "@/lib/utils";
export function Input({className,...p}:InputHTMLAttributes<HTMLInputElement>){return <input className={cn("h-11 w-full rounded-sm border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring",className)} {...p}/>}
