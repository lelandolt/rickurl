/**
 * Prepends https:// when the input has no protocol so the stored destination
 * is always an absolute URL. Best-effort — assumes the value already passed
 * the client-side `isValidUrl` check.
 */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    return new URL(withProtocol).toString()
  } catch {
    return withProtocol
  }
}

/**
 * Basic "does this look like a website" check used on the client to enable the
 * Create button. Accepts input with or without a protocol and requires a
 * dotted hostname (e.g. "example.com"), rejecting bare words like "hello".
 */
export function isValidUrl(input: string): boolean {
  const trimmed = input.trim()
  if (!trimmed) return false

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  let parsed: URL
  try {
    parsed = new URL(withProtocol)
  } catch {
    return false
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false

  // Require a dot with a non-empty label on each side (e.g. "a.b").
  return /^[^\s.]+\.[^\s.]+/.test(parsed.hostname)
}
