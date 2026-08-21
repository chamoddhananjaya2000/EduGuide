"use client"

import React, { useState } from "react"
import { useAnalysis } from "@/lib/analysis-context"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { RotateCcw, Trash2, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"

interface ResetDataButtonProps {
  variant?: "outline" | "ghost" | "destructive" | "sidebar" | "badge"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  label?: string
  showIcon?: boolean
}

export function ResetDataButton({
  variant = "outline",
  size = "sm",
  className = "",
  label = "Reset Academic Data",
  showIcon = true,
}: ResetDataButtonProps) {
  const { resetUserData, report, history } = useAnalysis()
  const [isOpen, setIsOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [justReset, setJustReset] = useState(false)

  const hasData = Boolean(report || history.length > 0)

  const handleConfirmReset = async () => {
    setIsResetting(true)
    try {
      await resetUserData()
      setJustReset(true)
      setTimeout(() => setJustReset(false), 3000)
    } catch (err) {
      console.error("Failed to reset user data:", err)
    } finally {
      setIsResetting(false)
      setIsOpen(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {variant === "sidebar" ? (
          <button
            type="button"
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors text-left group ${className}`}
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground group-hover:text-destructive transition-transform group-hover:-rotate-90 duration-200" />
            <span>{label}</span>
          </button>
        ) : (
          <Button
            type="button"
            variant={variant === "badge" ? "ghost" : variant}
            size={size}
            className={`text-xs flex items-center gap-1.5 transition-all ${
              variant === "outline"
                ? "border-destructive/30 text-destructive/90 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                : variant === "ghost"
                ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                : ""
            } ${className}`}
          >
            {justReset ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Cleared</span>
              </>
            ) : (
              <>
                {showIcon && (
                  <RotateCcw className="h-3.5 w-3.5" />
                )}
                <span>{label}</span>
              </>
            )}
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md bg-card/95 backdrop-blur-xl border border-destructive/20 shadow-2xl">
        <AlertDialogHeader className="space-y-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive mx-auto sm:mx-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <AlertDialogTitle className="text-lg font-bold text-foreground">
            Clear Academic Details & History?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
            This action will remove all your uploaded marksheets, GPA scores, semester performance trends, and career compatibility recommendations from your profile.
          </AlertDialogDescription>

          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-foreground flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            <span>
              <strong>Note:</strong> Your user account and Google login will <strong>remain active</strong>. Only student transcript data is cleared.
            </span>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="pt-3 gap-2 sm:gap-0">
          <AlertDialogCancel disabled={isResetting} className="text-xs">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleConfirmReset()
            }}
            disabled={isResetting}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-semibold flex items-center gap-1.5"
          >
            {isResetting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Clearing Details...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All Details</span>
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
