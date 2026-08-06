import { NextResponse } from "next/server"
import { notFound } from "next/navigation"
import { resolveVisit } from "@/lib/supabase"

const RICK_ROLL_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params

  // Flip a coin up front: half the time we send the visitor to their real
  // destination, half the time they get Rick Astley. The choice is passed to
  // the DB so the correct analytics counter (visits / rickrolls) is bumped
  // atomically alongside the lookup.
  const rickroll = Math.random() < 0.5

  let destination: string | null
  try {
    destination = await resolveVisit(slug, rickroll)
  } catch (err) {
    console.error("[v0] resolve visit failed:", err)
    // On an unexpected DB error, fall back to the 404 page rather than 500.
    notFound()
  }

  // Slug doesn't exist or has expired → render the custom 404 page.
  if (!destination) {
    notFound()
  }

  return NextResponse.redirect(rickroll ? RICK_ROLL_URL : destination, 307)
}
