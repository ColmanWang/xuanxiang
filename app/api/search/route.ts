import { NextResponse } from "next/server";
import { searchKnowledge } from "@/lib/services/search-service";
export async function GET(request: Request) { const query = new URL(request.url).searchParams.get("q")?.trim() ?? ""; return NextResponse.json(query ? await searchKnowledge(query) : []); }
