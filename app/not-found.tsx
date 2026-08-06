import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/logo"

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="grid w-full max-w-4xl items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="order-2 flex justify-center md:order-1">
          <Image
            src="/rick-sticker.png"
            alt="Illustration of Rick Astley singing into a microphone and pointing"
            width={420}
            height={420}
            priority
            className="h-auto w-64 sm:w-80 md:w-full"
          />
        </div>

        <div className="order-1 flex flex-col items-center text-center md:order-2 md:items-start md:text-left">
          <Logo variant="inline" />
          <p className="mt-2 font-serif text-8xl font-bold leading-none tracking-tight text-foreground">
            404
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            Never gonna find that page.
          </h2>
          <p className="mt-3 text-lg text-muted-foreground text-pretty">
            The link you&apos;re looking for doesn&apos;t exist or has expired.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Back to RickURL
          </Link>
        </div>
      </div>
    </main>
  )
}
