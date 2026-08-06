import { NextResponse } from "next/server"

const RICK_ROLL_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
const FALLBACK_URL = "https://example.com"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  // The slug isn't used yet — it will become the Supabase lookup key.
  const { slug } = await params
  void slug

  // TODO: Once Supabase is connected, this route will:
  //   1. Fetch the slug from the Supabase `links` table.
  //   2. Return a 404 (redirect to /not-found) if it doesn't exist or has expired.
  //   3. Redirect to the stored destination URL with 50% probability,
  //      otherwise redirect to the Rick Astley video.
  //   4. Increment the `visits` (and `rickrolls`) analytics counters.

  // For now: flip a coin. Half the time you get the "real" link, half the
  // time you get Rick Astley. Unpredictable outcomes.
  const destination = Math.random() < 0.5 ? FALLBACK_URL : RICK_ROLL_URL

  return NextResponse.redirect(destination, 307)
}
