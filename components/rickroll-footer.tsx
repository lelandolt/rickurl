import { getRickrollCount } from "@/lib/supabase"

const RICKROLL_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

export async function RickrollFooter() {
  const count = await getRickrollCount()

  return (
    <footer className="mt-10 text-center text-sm text-muted-foreground text-pretty">
      <p>
        Proudly responsible for{" "}
        <span className="font-semibold text-foreground">
          {count.toLocaleString()}
        </span>{" "}
        {count === 1 ? "rickroll" : "rickrolls"} and counting.{" "}
        <a
          href={RICKROLL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-4 hover:no-underline"
        >
          Learn more
        </a>
      </p>
    </footer>
  )
}
