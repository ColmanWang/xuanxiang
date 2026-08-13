import { NextResponse } from "next/server";
import { classicRepository } from "@/lib/repositories/classic-repository";
import { searchClassicPassages } from "@/lib/services/classic-text-service";
export async function GET(request:Request,{params}:{params:Promise<{slug:string}>}){const {slug}=await params;const query=new URL(request.url).searchParams;const classic=await classicRepository.getClassicBySlug(slug);if(!classic)return NextResponse.json({error:"Classic not found"},{status:404});return NextResponse.json(await searchClassicPassages(query.get("q")??"",classic.id,query.get("edition")??undefined));}
