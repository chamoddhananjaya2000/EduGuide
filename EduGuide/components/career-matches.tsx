"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Briefcase, Cpu, Calculator, Microscope, Rocket, Sparkles, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useAnalysis } from "@/lib/analysis-context"

const iconMap: Record<string, any> = {
  Code,
  Briefcase,
  Cpu,
  Calculator,
  Microscope,
  Rocket,
  Sparkles,
  TrendingUp,
}

export function CareerMatches() {
  const { report, history } = useAnalysis()
  const careers = report?.careers || []
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const isRecoveryMode =
    careers.some((c) => c.title.toLowerCase().includes("recovery") || c.title.toLowerCase().includes("foundation")) ||
    history.some((h) => h.report.subjects?.some((s) => s.score === "AB" || s.score === null || (typeof s.score === "number" && s.score < 35)))

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-2xl font-bold">
        {isRecoveryMode ? "Academic Recovery & Skill Pathways" : "Your Top Career Matches"}
      </h2>
      <div className="grid gap-6">
        {careers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No careers recommended yet. Upload a mark sheet to get started.</p>
        ) : (
          careers.map((career, index) => {
            const Icon = iconMap[career.icon] || Briefcase
            const isExpanded = expandedIndex === index
            return (
              <Card key={index} className="hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{career.title}</CardTitle>
                        <CardDescription className="leading-relaxed">{career.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {!isRecoveryMode ? (
                        <Badge className="bg-primary text-primary-foreground text-base px-3 py-1">
                          {career.match}% Match
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10 text-xs px-2.5 py-1 font-semibold uppercase tracking-wider">
                          Recovery Step
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isRecoveryMode && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Compatibility Score</span>
                        <span className="text-sm font-medium">{career.match}%</span>
                      </div>
                      <Progress value={career.match} className="h-2" />
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Required Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {career.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Salary Range</p>
                      <p className="font-medium text-foreground">{career.salary}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Education Requirement</p>
                      <p className="font-medium text-foreground text-xs">{career.education}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Job Market Growth</p>
                      <p className="font-medium text-primary">{career.growth}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      variant={isExpanded ? "default" : "outline"} 
                      className="w-full bg-transparent text-xs font-semibold"
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    >
                      {isExpanded ? "Close Pathway Detail" : "View Career Pathway"}
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-border/40 space-y-4 fade-in-up">
                      <h4 className="font-bold text-sm text-primary uppercase tracking-wider flex items-center gap-2 select-none">
                        <TrendingUp className="h-4 w-4" /> Recommended Milestones Pathway
                      </h4>
                      <div className="relative pl-6 border-l border-primary/20 space-y-5 py-1">
                        {/* Step 1 */}
                        <div className="relative">
                          <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                          <h5 className="font-bold text-xs text-foreground uppercase tracking-wide">Phase 1: Academic Foundation</h5>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            Strengthen concept foundations. Engage in projects related to {career.skills.slice(0, 2).join(" and ")} to build portfolio credits.
                          </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                          <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                          <h5 className="font-bold text-xs text-foreground uppercase tracking-wide">Phase 2: Core Skill Acquisition</h5>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            Acquire critical industry skills: <span className="font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded text-[10px]">{career.skills.join(" • ")}</span>.
                          </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                          <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                          <h5 className="font-bold text-xs text-foreground uppercase tracking-wide">Phase 3: Certification & Coursework</h5>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            Complete training certifications corresponding to a <span className="font-semibold text-foreground">{career.education}</span> to satisfy entry standards.
                          </p>
                        </div>

                        {/* Step 4 */}
                        <div className="relative">
                          <div className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                          <h5 className="font-bold text-xs text-foreground uppercase tracking-wide">Phase 4: Market Placement</h5>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            Enter target hiring pipelines. Average benchmark compensation ranges from <span className="font-bold text-foreground">{career.salary}</span> with a projected market growth of <span className="text-primary font-bold">{career.growth}</span>.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
