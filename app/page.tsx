import { Logo } from "@/components/logo"
import { UrlShortener } from "@/components/url-shortener"
import { FeatureList } from "@/components/feature-list"
import { RickrollFooter } from "@/components/rickroll-footer"

// The footer reads a live rickroll count, so render on each request.
export const dynamic = "force-dynamic"

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center px-4 py-16">
      <div className="flex w-full max-w-2xl flex-1 flex-col justify-center">
        <header className="flex flex-col items-center text-center">
          <Logo />
          <p className="mt-4 font-serif text-xl text-foreground text-balance sm:text-2xl">
            The internet&apos;s least reliable URL shortener.
          </p>
        </header>

        <div className="mt-8">
          <UrlShortener />
        </div>

        <div className="mt-8">
          <FeatureList />
        </div>
      </div>

      <RickrollFooter />
    </main>
  )
}
