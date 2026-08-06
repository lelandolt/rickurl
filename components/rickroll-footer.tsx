import { getRickrollCount } from "@/lib/supabase"
import { RickrollCounter } from "@/components/rickroll-counter"

export async function RickrollFooter() {
  const count = await getRickrollCount()

  return (
    <footer className="mt-10 text-center text-sm text-muted-foreground text-pretty">
      <RickrollCounter initialCount={count} />
    </footer>
  )
}
