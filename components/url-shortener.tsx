"use client"

import { useState } from "react"
import { ArrowRight, Link as LinkIcon, Check, Copy, Loader2, RotateCcw } from "lucide-react"
import { isValidUrl } from "@/lib/validate-url"
import type { CreateResponse } from "@/lib/types"

type Status = "idle" | "loading" | "success" | "error"

export function UrlShortener() {
  const [url, setUrl] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Basic client-side website check — the Create button only activates when
  // the input looks like a real URL, so there's no need for an error message.
  const isValid = isValidUrl(url)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (status === "loading" || !isValid) return

    setStatus("loading")

    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const data = (await res.json()) as CreateResponse

      if (!res.ok || !("shortUrl" in data)) {
        setStatus("error")
        return
      }

      setShortUrl(data.shortUrl)
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  async function handleCopy() {
    if (!shortUrl) return
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard permissions can fail silently; leave the UI unchanged.
    }
  }

  function handleReset() {
    setUrl("")
    setShortUrl(null)
    setCopied(false)
    setStatus("idle")
  }

  const isLoading = status === "loading"

  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4">
      {status === "success" && shortUrl ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
              <LinkIcon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate font-mono text-sm text-foreground">{shortUrl}</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label="Copy short link to clipboard"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" aria-hidden="true" /> Copy
                </>
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="mx-auto inline-flex items-center gap-1.5 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Shorten another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <label htmlFor="url" className="sr-only">
            Paste a URL to shorten
          </label>
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
            <LinkIcon className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              id="url"
              name="url"
              type="text"
              inputMode="url"
              autoComplete="off"
              placeholder="Paste a URL..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (status === "error") setStatus("idle")
              }}
              disabled={isLoading}
              className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Creating...
              </>
            ) : (
              <>
                Create RickURL <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
