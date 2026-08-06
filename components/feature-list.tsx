import { Dices, Clock, type LucideIcon } from "lucide-react"

interface Feature {
  icon: LucideIcon
  label: string
}

export function FeatureList() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium text-foreground">
      <FeatureItem icon={Dices} label="50% goes to your link" />
      <Divider />
      {/* Rick Astley gets his own item with a custom mark. */}
      <li className="flex items-center gap-2">
        <RickMark />
        50% goes to Rick Astley
      </li>
      <Divider />
      <FeatureItem icon={Clock} label="Valid for 7 days" />
    </ul>
  )
}

function FeatureItem({ icon: Icon, label }: Feature) {
  return (
    <li className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-foreground" strokeWidth={2} aria-hidden="true" />
      {label}
    </li>
  )
}

function Divider() {
  return <li aria-hidden="true" className="hidden h-4 w-px bg-border sm:block" />
}

/** Tiny sunglasses face mark for the Rick Astley feature. */
function RickMark() {
  return (
    <svg
      className="h-5 w-5 text-foreground"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.5 10.5h4v1.5a2 2 0 0 1-4 0v-1.5Zm7 0h4v1.5a2 2 0 0 1-4 0v-1.5Z"
        fill="currentColor"
      />
      <path d="M10.5 11h3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 16c.9.8 4.1.8 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
