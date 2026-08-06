import { NextResponse } from "next/server"
import { validateUrl } from "@/lib/validate-url"
import { generateSlug } from "@/lib/slug"
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

  const slug = generateSlug()

  // TODO: Once Supabase is connected, this endpoint will:
  //   1. Validate the URL (done above).
  //   2. Generate a unique random slug, retrying on collision.
  //   3. Store { slug, destination: normalized, expires_at: now + 7 days } in
  //      the Supabase `links` table.
  //   4. Return the generated RickURL pointing at that slug.
  //
  // For now we return a mocked response using the generated slug.

  const origin = new URL(request.url).origin
  const shortUrl = `${origin}/${slug}`

  return NextResponse.json({ shortUrl }, { status: 201 })
}
