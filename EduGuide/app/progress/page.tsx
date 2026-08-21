"use client"

import { ProgressOverview } from "@/components/progress-overview"
import { ImprovementStrategies } from "@/components/improvement-strategies"
import { GoalTracker } from "@/components/goal-tracker"
import { LearningResources } from "@/components/learning-resources"
import { TrendingUp } from "lucide-react"
import { useAnalysis } from "@/lib/analysis-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProgressPage() {
  const { report } = useAnalysis()

  if (!report) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-center max-w-md mx-auto gap-6">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
          <TrendingUp className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">No Progress Records</h1>
          <p className="text-muted-foreground text-sm">
            We require your academic transcripts to create progress trackers, milestones history, and recommend courses.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard to Upload</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          Progress Tracking
        </h1>
        <p className="text-muted-foreground text-lg">
          Monitor your academic journey and follow personalized improvement strategies
        </p>
      </div>

      {/* Progress Overview */}
      <ProgressOverview />

      {/* Goals and Strategies */}
      <div className="grid lg:grid-cols-2 gap-6">
        <GoalTracker />
        <ImprovementStrategies />
      </div>

      {/* Learning Resources */}
      <LearningResources />
    </div>
  )
}
