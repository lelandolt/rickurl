import "server-only"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { generateSlug } from "@/lib/slug"

/**
 * Server-only Supabase client using the service-role key.
 *
 * The `links` table has RLS enabled with no anon/authenticated policies, so it
 * is completely inaccessible from the browser. All reads and writes go through
 * this privileged client, which bypasses RLS — hence the `import "server-only"`
 * guard to guarantee this module never ships to the client bundle.
 */
let client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (client) return client

  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error("Supabase environment variables are not configured.")
  }

  client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return client
}

const MAX_SLUG_ATTEMPTS = 5

/**
 * Inserts a new link, generating a fresh random slug and retrying on the rare
 * chance of a primary-key collision. Returns the slug that was stored.
 * `expires_at` defaults to now + 7 days in the database.
 */
export async function createLink(destination: string): Promise<string> {
  const supabase = getClient()

  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
    const slug = generateSlug()
    const { error } = await supabase.from("links").insert({ slug, destination })

    if (!error) return slug

    // 23505 = unique_violation: slug already taken, try another.
    if (error.code === "23505") continue

    throw new Error(`Failed to create link: ${error.message}`)
  }

  throw new Error("Could not generate a unique slug after several attempts.")
}

/**
 * Atomically records a visit and returns the stored destination.
 *
 * The 50/50 rickroll coin flip is decided here so the same call that resolves
 * the destination also increments the correct analytics counter. Returns null
 * when the slug does not exist or has expired.
 */
export async function resolveVisit(
  slug: string,
  rickroll: boolean,
): Promise<string | null> {
  const supabase = getClient()

  const { data, error } = await supabase.rpc("record_visit", {
    p_slug: slug,
    p_rickroll: rickroll,
  })

  if (error) {
    throw new Error(`Failed to resolve link: ${error.message}`)
  }

  const row = Array.isArray(data) ? data[0] : data
  return row?.destination ?? null
}

/**
 * Returns the lifetime number of successful rickrolls, for the homepage footer
 * counter. Reads a persistent counter that survives the daily purge of expired
 * links, so the total only ever grows. Falls back to 0 on any error so the
 * page never fails to render over a stat.
 */
export async function getRickrollCount(): Promise<number> {
  const supabase = getClient()

  // Read the single-row persistent counter via RPC — one value back, no row
  // scan, and immune to expired-link cleanup.
  const { data, error } = await supabase.rpc("total_rickrolls")

  if (error) {
    console.error("[v0] rickroll count failed:", error.message)
    return 0
  }

  return Number(data ?? 0)
}

/**
 * Increments the lifetime rickroll counter by one and returns the new total.
 * Used when someone clicks the footer rickroll link — a rickroll that isn't
 * tied to any specific short link.
 */
export async function bumpRickrollCount(): Promise<number> {
  const supabase = getClient()

  const { data, error } = await supabase.rpc("bump_rickrolls")

  if (error) {
    console.error("[v0] rickroll bump failed:", error.message)
    throw new Error("Failed to record rickroll.")
  }

  return Number(data ?? 0)
}
