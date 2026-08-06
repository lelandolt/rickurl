const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789"

/**
 * Generates a random URL-safe slug.
 *
 * TODO: Once Supabase is wired up, generation should retry on collision by
 * checking the `links` table for an existing slug before returning.
 */
export function generateSlug(length = 6): string {
  let slug = ""
  for (let i = 0; i < length; i++) {
    slug += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return slug
}
