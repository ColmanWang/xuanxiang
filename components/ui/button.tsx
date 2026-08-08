import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default"|"outline"|"ghost"; size?: "default"|"sm"; children: ReactNode };
export const buttonVariants = ({variant="default",size="default"}:{variant?:Props["variant"];size?:Props["size"]}={}) => cn("inline-flex items-center justify-center gap-2 rounded-sm border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", size==="sm"?"h-9 px-3":"h-11 px-5", variant==="default"?"border-primary bg-primary text-primary-foreground hover:bg-primary/90":variant==="outline"?"border-border bg-background hover:bg-muted":"border-transparent hover:bg-muted");
export function Button({className,variant,size,...props}:Props){return <button className={cn(buttonVariants({variant,size}),className)} {...props}/>}
export function ButtonLink({href,children,variant,size,className}:{href:string;children:ReactNode;variant?:Props["variant"];size?:Props["size"];className?:string}){return <Link href={href} className={cn(buttonVariants({variant,size}),className)}>{children}</Link>}
