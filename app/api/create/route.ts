import { NextResponse } from "next/server"
import { normalizeUrl } from "@/lib/validate-url"
import { createLink } from "@/lib/supabase"
import type { CreateRequestBody, CreateResponse } from "@/lib/types"

export async function POST(request: Request): Promise<NextResponse<CreateResponse>> {
  let body: CreateRequestBody

  try {
    body = (await request.json()) as CreateRequestBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  // The client gates the Create button on a basic website check, so validation
  // lives there. Here we only normalize (prepend https:// when missing) so the
  // stored destination is always a usable absolute URL.
  const normalized = normalizeUrl(body?.url ?? "")

  // Persist the link. `createLink` generates a unique random slug (retrying on
  // collision) and stores the destination with a 7-day expiry.
  let slug: string
  try {
    slug = await createLink(normalized)
  } catch (err) {
    console.error("[v0] create link failed:", err)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }

  // Always hand back the canonical apex domain (no www), regardless of which
  // host the request actually came in on (preview URL, www, etc.).
  const base = (process.env.NEXT_PUBLIC_SHORT_URL_BASE ?? "https://rickurl.com").replace(/\/+$/, "")
  const shortUrl = `${base}/${slug}`

  return NextResponse.json({ shortUrl }, { status: 201 })
}
