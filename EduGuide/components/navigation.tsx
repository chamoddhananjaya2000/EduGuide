"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, Menu } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAnalysis } from "@/lib/analysis-context"

import { ResetDataButton } from "@/components/reset-data-button"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { logout, isAuthenticated, user, report, history } = useAnalysis()

  const navItems = isAuthenticated
    ? [
        { href: "/", label: "Home" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/analysis", label: "Analysis" },
        { href: "/careers", label: "Careers" },
        { href: "/progress", label: "Progress" },
        { href: "/model", label: "Model Status" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/#features", label: "Features" },
        { href: "/#how-it-works", label: "How It Works" },
      ]

  const hasData = Boolean(report || history.length > 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">EduGuide</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="h-8 w-8 rounded-full border border-border"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-border font-semibold text-sm">
                    {user?.displayName ? user.displayName[0].toUpperCase() : "U"}
                  </div>
                )}
                <span className="text-sm font-medium hidden lg:inline-block">
                  {user?.displayName || "Student"}
                </span>
              </div>
              {hasData && (
                <ResetDataButton variant="ghost" label="Reset Data" className="text-xs text-muted-foreground hover:text-destructive" />
              )}
              <Button onClick={logout} variant="outline" className="text-xs">
                Sign Out
              </Button>
            </div>
          ) : (
            <Button asChild className="text-xs">
              <Link href="/dashboard">Sign In</Link>
            </Button>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <div className="flex flex-col gap-3 mt-4">
                  <div className="flex items-center gap-2.5 px-2 py-1.5 rounded bg-muted/20">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="h-9 w-9 rounded-full border border-border"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-border font-semibold">
                        {user?.displayName ? user.displayName[0].toUpperCase() : "U"}
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold truncate">
                        {user?.displayName || "Student"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user?.email || ""}
                      </span>
                    </div>
                  </div>
                  {hasData && (
                    <ResetDataButton variant="outline" label="Reset Academic Details" className="w-full justify-start text-xs" />
                  )}
                  <Button onClick={() => { logout(); setIsOpen(false); }}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button asChild className="mt-4" onClick={() => setIsOpen(false)}>
                  <Link href="/dashboard">Sign In</Link>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
