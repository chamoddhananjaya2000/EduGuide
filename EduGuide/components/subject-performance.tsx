"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAnalysis } from "@/lib/analysis-context"

export function SubjectPerformance() {
  const { report } = useAnalysis()
  const subjects = report?.subjects || []

  const getScoreColor = (score: number | string | null) => {
    const num = typeof score === "number" ? score : Number(score)
    if (isNaN(num)) return "text-muted-foreground"
    if (num >= 90) return "text-primary"
    if (num >= 80) return "text-green-500"
    if (num >= 70) return "text-blue-500"
    return "text-amber-500"
  }

  return (
    <Card className="border-border bg-card/30 backdrop-blur-md">
      <CardHeader className="pb-4 border-b border-border/40">
        <CardTitle>Subject-wise Performance</CardTitle>
        <CardDescription>Detailed breakdown of your performance across all subjects</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-4">
          {subjects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4 col-span-2">No subjects analyzed yet. Upload a mark sheet to get started.</p>
          ) : (
            subjects.map((subject) => {
              const numericScore = typeof subject.score === "number" ? subject.score : !isNaN(Number(subject.score)) ? Number(subject.score) : 0
              return (
                <div 
                  key={subject.name} 
                  className="flex flex-col gap-3 p-4 rounded-xl bg-muted/10 border border-border hover:border-primary/30 transition-all hover:bg-muted/15"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">{subject.name}</h4>
                      <Badge
                        variant={
                          subject.trend === "up" ? "default" : subject.trend === "down" ? "destructive" : "secondary"
                        }
                        className="text-[9px] px-1.5 py-0.5 tracking-wider font-extrabold"
                      >
                        {subject.trend === "up" ? "↑ Upward" : subject.trend === "down" ? "↓ Attention" : "→ Stable"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-black font-mono ${getScoreColor(subject.score)}`}>
                        {typeof subject.score === "number" ? `${subject.score}%` : String(subject.score || "-")}
                      </span>
                      <Badge variant="outline" className="font-mono text-xs">{subject.grade}</Badge>
                    </div>
                  </div>
                  <Progress value={numericScore} className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {subject.trend === "up" && "Showing strong comprehension and positive grade velocity."}
                    {subject.trend === "down" && "Subject score indicates concepts requiring study intervention."}
                    {subject.trend === "stable" && "Maintaining consistent performance levels across test periods."}
                  </p>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
