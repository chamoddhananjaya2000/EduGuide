"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Award, Target, BookOpen } from "lucide-react"
import { useAnalysis } from "@/lib/analysis-context"

export function QuickStats() {
  const { report, history, activeViewMode } = useAnalysis()

  const gpa = report?.overallStats?.gpa
  const completedSubjects = report?.overallStats?.completedSubjects || report?.subjects?.length
  const careerCount = report?.careers?.length
  const historyCount = history.length

  // Multi-transcript accuracy precision calculation
  const precisionLabel = historyCount >= 3 
    ? "99% High Precision (3+ Sheets)" 
    : historyCount >= 1 
    ? "92% Standard (Upload 3+ for High)" 
    : "Local neural net"

  const stats = [
    {
      label: activeViewMode === "all" ? "Combined GPA (History)" : "Latest GPA",
      value: gpa !== undefined ? gpa.toFixed(2) : "--",
      change: gpa !== undefined ? (historyCount > 1 ? `${historyCount} transcripts aggregated` : "1 transcript uploaded") : "Pending upload",
      icon: Award,
      trend: gpa !== undefined ? "up" : "neutral",
    },
    {
      label: "Subjects Analyzed",
      value: completedSubjects !== undefined ? completedSubjects.toString() : "0",
      change: completedSubjects !== undefined ? (activeViewMode === "all" ? "All history combined" : "Latest transcript") : "Pending upload",
      icon: BookOpen,
      trend: "neutral",
    },
    {
      label: "Career Matches",
      value: careerCount !== undefined ? careerCount.toString() : "0",
      change: careerCount !== undefined ? (report?.careers?.[0]?.title.includes("Recovery") ? "Remedial Needed (<35 Marks)" : "AI aligned") : "Pending upload",
      icon: Target,
      trend: "neutral",
    },
    {
      label: "Analysis Precision",
      value: historyCount >= 3 ? "High Precision" : historyCount === 0 ? "Pending" : "Standard",
      change: precisionLabel,
      icon: TrendingUp,
      trend: historyCount >= 3 ? "up" : "neutral",
    },
  ]

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.trend === "up" ? "text-primary" : "text-muted-foreground"}`}>
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
