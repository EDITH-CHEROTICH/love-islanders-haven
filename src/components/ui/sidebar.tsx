
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Link } from "react-router-dom"
import { Home, Heart, User, MessageCircleHeart } from "lucide-react"

import { cn } from "@/lib/utils"

const sidebarVariants = cva(
  "group flex rounded-md p-2 text-sm leading-6 font-medium items-center justify-center md:justify-start md:px-3 gap-3",
  {
    variants: {
      variant: {
        default:
          "bg-sidebar text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/50",
        ghost:
          "bg-transparent hover:bg-sidebar-accent/50 text-sidebar-foreground hover:text-sidebar-primary",
        active:
          "bg-sidebar-primary/10 text-sidebar-primary hover:bg-sidebar-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface NavLinkProps
  extends React.HtmlHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof sidebarVariants> {
  to: string
  active?: boolean
}

const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, to, children, active, variant, ...props }, ref) => {
    return (
      <Link
        to={to}
        className={cn(
          sidebarVariants({ variant: active ? "active" : variant }),
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Link>
    )
  }
)
NavLink.displayName = "NavLink"

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  mobile?: boolean
  activePath?: string
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, mobile = false, activePath = "/", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-2 p-2",
          mobile
            ? "fixed inset-x-0 -bottom-0 border-t border-t-sidebar-border bg-sidebar pb-safe z-50"
            : "h-full border-r border-r-sidebar-border bg-sidebar",
          className
        )}
        {...props}
      >
        <nav className="flex flex-col gap-2">
          <NavLink to="/" active={activePath === "/"}>
            <Home className="h-5 w-5" />
            <span className={cn("flex-1", mobile ? "hidden" : "")}>Home</span>
          </NavLink>
          <NavLink to="/matches" active={activePath === "/matches"}>
            <Heart className="h-5 w-5" />
            <span className={cn("flex-1", mobile ? "hidden" : "")}>Matches</span>
          </NavLink>
          <NavLink to="/profile" active={activePath === "/profile"}>
            <User className="h-5 w-5" />
            <span className={cn("flex-1", mobile ? "hidden" : "")}>Profile</span>
          </NavLink>
          <NavLink to="/ai-companion" active={activePath === "/ai-companion"}>
            <MessageCircleHeart className="h-5 w-5" />
            <span className={cn("flex-1", mobile ? "hidden" : "")}>Companion</span>
          </NavLink>
        </nav>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

export { Sidebar, NavLink, sidebarVariants }
