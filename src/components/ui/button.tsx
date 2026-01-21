import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 hover:shadow-xl",
                outline:
                    "border-2 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover:shadow-md",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80 hover:shadow-lg",
                ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
                link: "text-primary underline-offset-4 hover:underline",
                agri: "bg-agri-green text-white shadow-lg shadow-agri-green/20 hover:bg-agri-green/90 hover:shadow-xl hover:shadow-agri-green/30 hover:-translate-y-0.5",
                premium: "bg-gradient-to-r from-primary via-agri-green to-primary bg-[length:200%_auto] text-white shadow-xl shadow-primary/30 hover:bg-[right_center] hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-500",
                glass: "glass border-white/20 text-foreground hover:bg-white/30 hover:border-white/40 shadow-lg hover:shadow-xl",
            },
            size: {
                default: "h-10 px-5 py-2",
                sm: "h-9 rounded-md px-3 text-xs",
                lg: "h-12 rounded-lg px-8 text-base",
                icon: "h-10 w-10",
                xl: "h-14 rounded-full px-10 text-lg font-bold",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
