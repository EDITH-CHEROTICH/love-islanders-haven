
import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader } from "lucide-react"

const Spinner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("animate-spin text-current", className)}
    {...props}
  >
    <Loader size={24} />
    <span className="sr-only">Loading</span>
  </div>
))
Spinner.displayName = "Spinner"

export { Spinner }
