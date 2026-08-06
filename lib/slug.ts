const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789"

/**
 * Generates a random URL-safe slug. Collision handling lives in
 * `createLink` (lib/supabase.ts), which retries on a unique-key violation.
 */
export function generateSlug(length = 6): string {
  let slug = ""
  for (let i = 0; i < length; i++) {
    slug += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return slug
}
