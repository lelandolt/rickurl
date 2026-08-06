import { NextResponse } from "next/server"
import { validateUrl } from "@/lib/validate-url"
import { createLink } from "@/lib/supabase"
import type { CreateRequestBody, CreateResponse } from "@/lib/types"

export async function POST(request: Request): Promise<NextResponse<CreateResponse>> {
  let body: CreateRequestBody

  try {
    body = (await request.json()) as CreateRequestBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  // Validate the incoming URL on the server. The client never generates slugs
  // and never trusts input — everything is checked here.
  const normalized = validateUrl(body?.url ?? "")
  if (!normalized) {
    return NextResponse.json(
      { error: "Please enter a valid URL." },
      { status: 400 },
    )
  }

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

  const origin = new URL(request.url).origin
  const shortUrl = `${origin}/${slug}`

  return NextResponse.json({ shortUrl }, { status: 201 })
}
