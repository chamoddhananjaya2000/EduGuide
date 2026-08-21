"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAnalysis } from "@/lib/analysis-context"

export function IndustryTrends() {
  const { report, history } = useAnalysis()

  const isRecoveryActive =
    report?.careers?.some(c => c.title.toLowerCase().includes("recovery") || c.title.toLowerCase().includes("foundation")) ||
    report?.subjects?.some(s => s.score === "AB" || s.score === null || (typeof s.score === "number" && s.score < 35)) ||
    history.some(h => h.report.subjects?.some(s => s.score === "AB" || s.score === null || (typeof s.score === "number" && s.score < 35)))

  const trends = [
    {
      industry: "Technology",
      growth: "+36%",
      trend: "up",
      description: "AI and software development roles rapidly expanding",
    },
    {
      industry: "Healthcare",
      growth: "+23%",
      trend: "up",
      description: "Medical technology and research positions growing",
    },
    {
      industry: "Data Science",
      growth: "+31%",
      trend: "up",
      description: "High demand for analytics and ML expertise",
    },
    {
      industry: "Manufacturing",
      growth: "+7%",
      trend: "up",
      description: "Steady growth in engineering positions",
    },
    {
      industry: "Retail",
      growth: "-2%",
      trend: "down",
      description: "Traditional roles declining, e-commerce growing",
    },
  ]

  return (
    <Card className="border-border bg-card/30 backdrop-blur-md">
      <CardHeader>
        <CardTitle>{isRecoveryActive ? "Industry Market Outlook" : "Industry Trends"}</CardTitle>
        <CardDescription>
          {isRecoveryActive
            ? "General macro job market growth trends (Specialized career matching unlocked after 35+ marks)"
            : "Current job market outlook for your career matches"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isRecoveryActive && (
          <div className="p-3 mb-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-center gap-2">
            <Lock className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Target placement matching is currently locked until foundational recovery steps are completed.</span>
          </div>
        )}
        <div className="space-y-4">
          {trends.map((trend, index) => (
            <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{trend.industry}</h4>
                  <Badge variant={trend.trend === "up" ? "default" : "destructive"} className="text-xs">
                    {trend.growth}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{trend.description}</p>
              </div>
              {trend.trend === "up" ? (
                <TrendingUp className="h-5 w-5 text-primary ml-4" />
              ) : (
                <TrendingDown className="h-5 w-5 text-destructive ml-4" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
