export interface CreateRequestBody {
  url: string
}

export interface CreateSuccessResponse {
  shortUrl: string
}

export interface ErrorResponse {
  error: string
}

export type CreateResponse = CreateSuccessResponse | ErrorResponse

/**
 * Shape of a stored link.
 *
 * TODO: This will map to the Supabase `links` table once the database
 * integration is added:
 *   - slug         text primary key
 *   - destination  text not null
 *   - created_at   timestamptz default now()
 *   - expires_at   timestamptz  (created_at + 7 days)
 *   - visits       int default 0
 *   - rickrolls    int default 0
 */
export interface StoredLink {
  slug: string
  destination: string
  createdAt: string
  expiresAt: string
  visits: number
  rickrolls: number
}
