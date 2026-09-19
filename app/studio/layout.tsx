import type { Metadata } from "next";
import { StudioShell } from "@/components/studio/studio-shell";
import { requireEditorialStudio } from "./_lib/gate";

export const metadata:Metadata={title:"编辑台",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
export default function StudioLayout({children}:{children:React.ReactNode}){requireEditorialStudio();return <StudioShell>{children}</StudioShell>}
