"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAnalysis } from "@/lib/analysis-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  GraduationCap,
  LayoutDashboard,
  Brain,
  Target,
  TrendingUp,
  Cpu,
  LogOut,
  Menu,
  User,
  ChevronRight
} from "lucide-react"
import { ResetDataButton } from "@/components/reset-data-button"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, report, history, user } = useAnalysis()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analysis", label: "Analysis", icon: Brain },
    { href: "/careers", label: "Careers", icon: Target },
    { href: "/progress", label: "Progress", icon: TrendingUp },
    { href: "/model", label: "Model Status", icon: Cpu },
  ]

  const getPageTitle = () => {
    const item = navItems.find((n) => n.href === pathname)
    return item ? item.label : "Workspace"
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card/30 backdrop-blur-md border-r border-border/40 text-foreground">
      {/* Header / Brand */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border/45">
        <GraduationCap className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold tracking-tight text-gradient">EduGuide AI</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary shadow-sm shadow-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              }`} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Footer User Panel */}
      <div className="p-4 border-t border-border/40 flex flex-col gap-2.5">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded bg-muted/20">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="h-8 w-8 rounded-full border border-border"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary border border-border font-semibold text-xs">
              {user?.displayName ? user.displayName[0].toUpperCase() : "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate leading-none">
              {user?.displayName || report?.studentName || "Student Profile"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
              {user?.email || "student@eduguide.ai"}
            </p>
          </div>
        </div>

        {/* Reset Student Academic Data Button */}
        {(report || history.length > 0) && (
          <ResetDataButton
            variant="sidebar"
            label="Reset Academic Details"
          />
        )}

        <Button
          onClick={logout}
          variant="ghost"
          size="sm"
          className="w-full text-xs text-destructive hover:text-destructive hover:bg-destructive/10 justify-start gap-2 h-8"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="h-16 sticky top-0 z-40 flex items-center justify-between px-6 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger Trigger */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-none">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            {/* Breadcrumb Path */}
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-muted-foreground select-none">
              <span>EduGuide Core</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-semibold">{getPageTitle()}</span>
            </div>
          </div>

          {/* User Signout quick trigger */}
          <div className="flex items-center gap-3">
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="text-xs bg-transparent border-border/80 text-muted-foreground hover:text-foreground hidden sm:flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
        </header>

        {/* Dynamic Inner Layout Body */}
        <div className="flex-grow p-6 md:p-8 fade-in-up">
          {children}
        </div>
      </div>
    </div>
  )
}
