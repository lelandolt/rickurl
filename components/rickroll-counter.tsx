"use client"

import { useState } from "react"

const RICKROLL_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

export function RickrollCounter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount)

  function handleRickroll() {
    // Optimistically bump the visible count, then persist. Clicking the link
    // is itself a rickroll, so the lifetime total should grow.
    setCount((c) => c + 1)

    // Fire-and-forget: reconcile with the server's authoritative total, but
    // don't block the navigation to the video.
    fetch("/api/rickroll", { method: "POST", keepalive: true })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.total === "number") setCount(data.total)
      })
      .catch(() => {
        // Revert the optimistic bump if the request failed.
        setCount((c) => c - 1)
      })
  }

  return (
    <p>
      Proudly enabled{" "}
      <span className="font-semibold text-foreground">{count.toLocaleString()}</span>{" "}
      {count === 1 ? "rickroll" : "rickrolls"}.{" "}
      <a
        href={RICKROLL_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleRickroll}
        className="font-medium text-primary underline underline-offset-4 hover:no-underline"
      >
        Learn more
      </a>
    </p>
  )
}
