import { redirect, notFound } from "next/navigation"
import { resolveVisit } from "@/lib/supabase"

const RICK_ROLL_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

// Every visit flips a coin and writes to the DB, so this route can never be
// statically cached.
export const dynamic = "force-dynamic"

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Flip a coin up front: half the time the visitor reaches their real
  // destination, half the time they get Rick Astley. The choice is passed to
  // the DB so the correct analytics counter (visits / rickrolls) is bumped
  // atomically alongside the lookup.
  const rickroll = Math.random() < 0.5

  let destination: string | null = null
  try {
    destination = await resolveVisit(slug, rickroll)
  } catch (err) {
    console.error("[v0] resolve visit failed:", err)
    // On an unexpected DB error, show the 404 page rather than crashing.
    notFound()
  }

  // Slug doesn't exist or has expired → render the custom 404 page.
  if (!destination) {
    notFound()
  }

  redirect(rickroll ? RICK_ROLL_URL : destination)
}
