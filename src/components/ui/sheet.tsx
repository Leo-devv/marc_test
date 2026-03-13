"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const SheetContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void }>({
  open: false,
  setOpen: () => {},
})

function Sheet({ open, onOpenChange, children }: SheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = open ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen
  return (
    <SheetContext.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

function SheetTrigger({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = React.useContext(SheetContext)
  return <button onClick={() => setOpen(true)} {...props}>{children}</button>
}

function SheetClose({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = React.useContext(SheetContext)
  return <button onClick={() => setOpen(false)} {...props}>{children}</button>
}

function SheetContent({ className, children, side = "right" }: React.HTMLAttributes<HTMLDivElement> & { side?: "top" | "right" | "bottom" | "left" }) {
  const { open, setOpen } = React.useContext(SheetContext)
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className={cn(
        "fixed z-50 bg-background p-6 shadow-lg transition-transform",
        side === "right" && "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l",
        side === "left" && "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r",
        side === "top" && "inset-x-0 top-0 border-b",
        side === "bottom" && "inset-x-0 bottom-0 border-t",
        className
      )}>
        {children}
      </div>
    </div>
  )
}

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-2", className)} {...props} />
}

function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
}

function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold text-foreground", className)} {...props} />
}

function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription }
