import { NextResponse } from "next/server"
import { bumpRickrollCount } from "@/lib/supabase"

// Records a rickroll triggered by clicking the footer "Learn more" link.
export async function POST(): Promise<NextResponse> {
  try {
    const total = await bumpRickrollCount()
    return NextResponse.json({ total }, { status: 200 })
  } catch (err) {
    console.error("[v0] rickroll route failed:", err)
    return NextResponse.json({ error: "Failed to record rickroll." }, { status: 500 })
  }
}
