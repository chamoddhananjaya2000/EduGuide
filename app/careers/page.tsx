"use client"

import { CareerMatches } from "@/components/career-matches"
import { IndustryTrends } from "@/components/industry-trends"
import { SkillsPathway } from "@/components/skills-pathway"
import { Target, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useAnalysis } from "@/lib/analysis-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CareersPage() {
  const { report, history } = useAnalysis()

  if (!report) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-center max-w-md mx-auto gap-6">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
          <Target className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">No Career Matches Found</h1>
          <p className="text-muted-foreground text-sm">
            We require your academic report card in order to run multi-class classification and recommend matching careers.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard to Upload</Link>
        </Button>
      </div>
    )
  }

  const matchCount = report?.careers?.length || 0

  // Check if student has low scores (< 35) or Absent subjects in EITHER current report OR ANY historical transcript
  const hasHistoryLowScoresOrAbsent = history.some((item) =>
    item.report.subjects?.some(
      (s) => s.score === "AB" || s.score === null || (typeof s.score === "number" && s.score < 35)
    )
  )

  const lowScoresOrAbsent =
    hasHistoryLowScoresOrAbsent ||
    report.subjects.some(
      (s) => s.score === "AB" || s.score === null || (typeof s.score === "number" && s.score < 35)
    )

  const isAcademicRecovery = report.careers?.some(c => c.title.toLowerCase().includes("recovery") || c.title.toLowerCase().includes("foundation"))

  const isRecoveryActive = lowScoresOrAbsent || isAcademicRecovery

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <Target className="h-8 w-8 text-primary" />
          {isRecoveryActive ? "Academic Recovery & Foundation Pathways" : "Career Path Recommendations"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isRecoveryActive
            ? "Actionable recovery guidance and core skill steps required to unlock specialized career recommendations"
            : "AI-powered career suggestions aligned with your academic strengths and interests"}
        </p>
      </div>

      {/* Clear Notice Banner for Academic Recovery (<35 marks or AB) */}
      {(lowScoresOrAbsent || isAcademicRecovery) ? (
        <Card className="bg-amber-500/10 border-amber-500/30 text-amber-200">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 font-extrabold text-xl shrink-0">
              !
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-base text-amber-300">Academic Recovery & Foundation Status Active</h4>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Standard career pathing requires a minimum pass mark of <strong>35+</strong> in core subjects. Because current marks contain <strong>Absent (AB)</strong> status or scores below 35, standard professional career matches are locked. Focus on the foundational steps below to unlock future career pathing.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Match Score Banner for Passing Students */
        <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/20">
          <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground animate-pulse">
              <div className="text-center">
                <div className="text-2xl font-bold">{matchCount}</div>
                <div className="text-xs">Matches</div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-1">
                Based on your profile, we found {matchCount} highly compatible pathways
              </h3>
              <p className="text-sm text-muted-foreground">
                Our custom local neural network analyzed your academic performance, and EduGuideAI synthesized career paths with high success potential.
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
      )}

      {/* Career Matches */}
      <CareerMatches />

      {/* Industry Trends & Skills */}
      <div className="grid lg:grid-cols-2 gap-6">
        <IndustryTrends />
        <SkillsPathway />
      </div>
    </div>
  )
}
