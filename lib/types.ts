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
