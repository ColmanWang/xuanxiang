import type { Metadata } from "next";
import { StudioShell } from "@/components/studio/studio-shell";
import StudioLoginPage from "./login/page";
import { signOutOfStudio } from "./login/actions";
import { requireEditorialStudio } from "./_lib/gate";

export const metadata:Metadata={title:"编辑台",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
export default async function StudioLayout({children}:{children:React.ReactNode}){const principal=await requireEditorialStudio();if(!principal)return <StudioLoginPage/>;return <><div className="mx-auto flex max-w-[1500px] justify-end border-b px-5 py-2 text-xs"><span className="mr-3 text-muted-foreground">{principal.email} · {principal.role}</span><form action={signOutOfStudio}><button type="submit">退出</button></form></div><StudioShell>{children}</StudioShell></>}
