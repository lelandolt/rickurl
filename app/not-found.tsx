import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/logo"

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="grid w-full max-w-6xl items-center gap-8 md:grid-cols-[2.25fr_1fr] md:gap-12">
        <div className="order-1 flex justify-center md:hidden">
          <Logo variant="inline" />
        </div>

        <div className="order-2 hidden justify-center md:order-1 md:flex">
          <Image
            src="/rick-404.png"
            alt="Illustration of Rick Astley singing into a microphone and pointing"
            width={1536}
            height={1024}
            priority
            className="h-auto w-full"
          />
        </div>

        <div className="order-3 flex flex-col items-center text-center md:order-2 md:items-start md:text-left">
          <div className="hidden md:block">
            <Logo variant="inline" />
          </div>
          <p className="mt-2 font-serif text-8xl font-bold leading-none tracking-tight text-foreground">
            404
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            Never gonna find that page.
          </h2>
          <Image
            src="/rick-404.png"
            alt="Illustration of Rick Astley singing into a microphone and pointing"
            width={1536}
            height={1024}
            priority
            className="my-3 h-auto w-[92vw] max-w-[30rem] md:hidden"
          />
          <p className="mt-3 text-sm font-medium text-muted-foreground text-pretty">
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
