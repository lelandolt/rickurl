import { Check, Music, Clock, type LucideIcon } from "lucide-react"

interface Feature {
  icon: LucideIcon
  label: string
}

export function FeatureList() {
  return (
    <ul className="flex flex-col items-center justify-center gap-3 text-sm font-medium text-foreground sm:flex-row sm:gap-x-6">
      <FeatureItem icon={Check} label="50% goes to your link" />
      <Divider />
      <FeatureItem icon={Music} label="50% goes to Rick Astley" />
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
