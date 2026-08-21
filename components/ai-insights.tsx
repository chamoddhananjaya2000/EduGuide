"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, TrendingUp, AlertCircle, Target } from "lucide-react"
import { useAnalysis } from "@/lib/analysis-context"

export function AIInsights() {
  const { report } = useAnalysis()

  const topStrengthTitle = report?.strengths?.[0]?.title || "Analytical Thinking"
  const topStrengthDesc = report?.strengths?.[0]?.description || "Analytical thinking and core STEM concepts"

  const growthSubject = report?.subjects?.find(s => s.trend === "up")
  const growthTitle = growthSubject ? `${growthSubject.name} Gain` : "Academic Velocity"
  const growthDesc = growthSubject
    ? `Significant score improvement of ${growthSubject.score}% achieved in this module.`
    : "Steady performance gains across core modules"

  const attentionTitle = report?.weaknesses?.[0]?.title || "Needs Attention"
  const attentionDesc = report?.weaknesses?.[0]
    ? `${report.weaknesses[0].description} Recommendation: ${report.weaknesses[0].recommendation}`
    : "Written communication and conceptual summaries"

  const recommendationText = report?.recommendations?.[0] || "Leverage study guides and spaced repetition"

  const insights = [
    {
      icon: Sparkles,
      tag: "Top Strength",
      title: topStrengthTitle,
      description: topStrengthDesc,
      color: "text-primary",
      bg: "bg-primary/10",
      borderColor: "border-primary/20 hover:border-primary/45",
      cardBg: "bg-primary/5",
      glowColor: "bg-primary",
    },
    {
      icon: TrendingUp,
      tag: "Growth Area",
      title: growthTitle,
      description: growthDesc,
      color: "text-green-400",
      bg: "bg-green-500/10",
      borderColor: "border-green-500/20 hover:border-green-500/45",
      cardBg: "bg-green-500/5",
      glowColor: "bg-green-500",
    },
    {
      icon: AlertCircle,
      tag: "Needs Attention",
      title: attentionTitle,
      description: attentionDesc,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      borderColor: "border-amber-500/20 hover:border-amber-500/45",
      cardBg: "bg-amber-500/5",
      glowColor: "bg-amber-500",
    },
    {
      icon: Target,
      tag: "AI Guidance",
      title: "EduAI Recommendation",
      description: recommendationText,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      borderColor: "border-blue-500/20 hover:border-blue-500/45",
      cardBg: "bg-blue-500/5",
      glowColor: "bg-blue-500",
    },
  ]

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {insights.map((insight, index) => {
        const Icon = insight.icon
        return (
          <Card
            key={index}
            className={`relative overflow-hidden border ${insight.borderColor} ${insight.cardBg} backdrop-blur-md shadow-lg group hover:shadow-xl hover:scale-[1.01] transition-all duration-300 rounded-xl`}
          >
            {/* Corner glowing aura */}
            <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity ${insight.glowColor}`} />
            
            <CardContent className="flex flex-col gap-4 p-5 h-full justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                  {insight.tag}
                </span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${insight.bg} ${insight.color} shadow-inner`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              
              <div className="space-y-1.5 mt-1">
                <h4 className="font-bold text-sm text-foreground tracking-tight">
                  {insight.title}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-normal">
                  {insight.description}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
