/**
 * Normalizes and validates a user-supplied URL.
 *
 * - Accepts input with or without a protocol (defaults to https://).
 * - Only allows http/https schemes.
 * - Returns the normalized absolute URL string, or null if invalid.
 */
export function validateUrl(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  // Prepend a protocol if the user omitted one (e.g. "example.com").
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  let parsed: URL
  try {
    parsed = new URL(withProtocol)
  } catch {
    return null
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return null
  }

  // Require a dot in the hostname so bare words ("hello") are rejected.
  if (!parsed.hostname.includes(".")) {
    return null
  }

  return parsed.toString()
}
