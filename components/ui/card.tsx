import type { HTMLAttributes } from "react"; import { cn } from "@/lib/utils";
export function Card({className,...p}:HTMLAttributes<HTMLDivElement>){return <div className={cn("rounded-md border bg-card text-card-foreground",className)} {...p}/>}
export function CardHeader({className,...p}:HTMLAttributes<HTMLDivElement>){return <div className={cn("flex flex-col gap-2 p-6",className)} {...p}/>}
export function CardTitle({className,...p}:HTMLAttributes<HTMLHeadingElement>){return <h3 className={cn("font-serif text-xl font-medium",className)} {...p}/>}
export function CardDescription({className,...p}:HTMLAttributes<HTMLParagraphElement>){return <p className={cn("text-sm leading-6 text-muted-foreground",className)} {...p}/>}
export function CardContent({className,...p}:HTMLAttributes<HTMLDivElement>){return <div className={cn("p-6 pt-0",className)} {...p}/>}
export function CardFooter({className,...p}:HTMLAttributes<HTMLDivElement>){return <div className={cn("flex items-center p-6 pt-0",className)} {...p}/>}
