import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { classicRepository } from "@/lib/repositories/classic-repository";
export async function GET(_request:Request,{params}:{params:Promise<{slug:string;section:string}>}){const {slug,section}=await params;const record=await prisma.textSection.findFirst({where:{id:section,witness:{classic:{slug}}},select:{id:true}});if(!record)return NextResponse.json({error:"Section not found"},{status:404});return NextResponse.json(await classicRepository.getSectionPassages(record.id));}
