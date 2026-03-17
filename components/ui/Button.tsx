import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "group inline-flex items-center justify-center whitespace-nowrap transition-all cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#006BE9] focus-visible:outline-offset-[3px] focus-visible:bg-[#006BE9] focus-visible:text-white gap-2",
    {
        variants: {
            variant: {
                primary:
                    "font-medium bg-transparent text-[#052049] border-3 border-[#006BE9] tracking-normal hover:bg-[#006BE9] hover:text-white active:bg-[#4CA0FF]",

                primarySolid:
                    "font-medium bg-[#006BE9] text-white border-3 border-[#006BE9] tracking-normal hover:bg-[#0F388A] hover:border-[#0F388A] hover:text-white active:bg-[#052049] active:border-[#052049]",

                secondary:
                    "font-medium text-[#006BE9] hover:text-[#0F388A] hover:bg-transparent active:text-[#006BE9]",

                secondaryDark:
                    "font-medium bg-transparent border-2 border-white text-white hover:bg-white/10 hover:border-white active:bg-white/20 active:text-white focus-visible:outline-white",

                ghost:
                    "font-medium hover:bg-gray-100 text-[#052049]",

                tertiary:
                    "font-normal text-[#052049] hover:text-[#006BE9] active:text-[#052049] p-0 h-auto",

                link:
                    "font-normal text-[#006BE9] hover:text-[#006BE9] hover:no-underline active:text-[#052049] underline underline-offset-4 !p-0 h-auto leading-tight focus-visible:bg-transparent focus-visible:text-[#006BE9] focus-visible:no-underline focus-visible:outline-2 focus-visible:outline-offset-0",

                neutralCircle:
                    "font-medium border border-[#D1D3D3] bg-white text-gray-700 rounded-full transition-colors hover:bg-gray-50 aria-pressed:bg-[#E2F4FC]/60 aria-pressed:border-[#178CCB] aria-pressed:text-[#052049] aria-pressed:hover:bg-[#CFEAFB]",
            },
            size: {
                default: "px-6 py-2.5 text-[18.66px]",
                sm: "h-9 px-3 text-[16px]",
                lg: "h-11 px-8 text-[18.66px]",
                icon: "h-9 w-9 p-0 !rounded-full aspect-square flex-shrink-0",
            },
            fullWidth: {
                true: "w-full",
                false: "w-auto",
            }
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
            fullWidth: false,
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    icon?: React.ReactNode
    iconPosition?: "start" | "end"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, icon, iconPosition = "end", children, ...props }, ref) => {
        return (
            <button
                className={cn(
                    buttonVariants({ variant, size, className }),
                    (variant === "link" || variant === "tertiary" || variant === "secondary") && "!p-0 !h-auto",
                    fullWidth && "justify-between"
                )}
                ref={ref}
                {...props}
            >
                {icon && iconPosition === "start" && (
                    <span className="flex items-center justify-center transition-all shrink-0">
                        {icon}
                    </span>
                )}
                {children && (
                    <span className={cn(fullWidth && "flex-1 text-left")}>
                        {children}
                    </span>
                )}
                {icon && iconPosition === "end" && (
                    <span className="flex items-center justify-center transition-all shrink-0">
                        {icon}
                    </span>
                )}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
