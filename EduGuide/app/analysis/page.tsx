"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubjectPerformance } from "@/components/subject-performance"
import { StrengthsWeaknesses } from "@/components/strengths-weaknesses"
import { PerformanceTrends } from "@/components/performance-trends"
import { AIInsights } from "@/components/ai-insights"
import { Brain, Sparkles } from "lucide-react"
import { useAnalysis } from "@/lib/analysis-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ResetDataButton } from "@/components/reset-data-button"
import Link from "next/link"

export default function AnalysisPage() {
  const { report, history, activeViewMode, setActiveViewMode } = useAnalysis()

  if (!report) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-center max-w-md mx-auto gap-6">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
          <Brain className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">No Performance Profile</h1>
          <p className="text-muted-foreground text-sm">
            We require your academic transcripts to generate performance curves, category averages, and custom strengths/weaknesses charts.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard to Upload</Link>
        </Button>
      </div>
    )
  }

  const historyCount = history.length

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary animate-pulse" />
            Performance Analytics
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Comprehensive insights into your academic performance vectors processed by local neural weights and EduAI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Reset Academic Data */}
          <ResetDataButton variant="outline" label="Reset Details" className="text-xs" />

          {/* History Mode Toggle */}
          <div className="flex items-center p-1 rounded-lg bg-muted/30 border border-border/50 text-xs shrink-0">
            <button
              onClick={() => setActiveViewMode("latest")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all whitespace-nowrap ${
                activeViewMode === "latest"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Latest Upload
            </button>
            <button
              onClick={() => setActiveViewMode("all")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeViewMode === "all"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All History ({historyCount})
            </button>
          </div>

          <Badge variant="outline" className={`px-3 py-1.5 font-mono text-xs flex items-center gap-1.5 select-none whitespace-nowrap shrink-0 ${
            historyCount >= 3 ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : "text-primary border-primary/20 bg-primary/5"
          }`}>
            <span className={`h-2 w-2 rounded-full ${historyCount >= 3 ? "bg-emerald-400" : "bg-primary"} animate-ping`} />
            {historyCount >= 3 ? "99% High Precision (3+ Sheets)" : `${historyCount}/3 Marksheets (Upload 3+ for max precision)`}
          </Badge>
        </div>
      </div>

      {/* AI Insights Banner */}
      <AIInsights />

      {/* Main Analysis Tabs */}
      <Tabs defaultValue="subjects" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="strengths">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="mt-6">
          <SubjectPerformance />
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <PerformanceTrends />
        </TabsContent>

        <TabsContent value="strengths" className="mt-6">
          <StrengthsWeaknesses />
        </TabsContent>
      </Tabs>
    </div>
  )
}
