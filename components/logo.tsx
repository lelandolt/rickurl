import { Link2 } from "lucide-react"

interface LogoProps {
  /** "hero" renders the large stacked wordmark, "inline" a compact row. */
  variant?: "hero" | "inline"
}

export function Logo({ variant = "hero" }: LogoProps) {
  if (variant === "inline") {
    return (
      <span className="inline-flex items-center gap-2">
        <Link2 className="h-6 w-6 -rotate-45 text-primary" strokeWidth={2.5} aria-hidden="true" />
        <span className="font-serif text-2xl font-bold tracking-tight text-foreground">RickURL</span>
      </span>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <Link2
        className="mb-1 h-12 w-12 -rotate-45 text-primary"
        strokeWidth={2.5}
        aria-hidden="true"
      />
      <h1 className="font-serif text-6xl font-bold leading-none tracking-tight text-foreground sm:text-7xl md:text-8xl">
        RickURL
      </h1>
    </div>
  )
}
