"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAnalysis } from "@/lib/analysis-context"

export function StrengthsWeaknesses() {
  const { report } = useAnalysis()
  const strengths = report?.strengths || []
  const weaknesses = report?.weaknesses || []
  const recommendations = report?.recommendations || []

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              Strengths
            </CardTitle>
            <CardDescription>Areas where you excel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {strengths.map((strength, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-semibold">{strength.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{strength.description}</p>
                <div className="flex flex-wrap gap-2">
                  {strength.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-amber-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
            <CardDescription>Focus areas to enhance performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {weaknesses.map((weakness, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-semibold">{weakness.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{weakness.description}</p>
                <div className="flex flex-wrap gap-2">
                  {weakness.subjects.map((subject) => (
                    <Badge key={subject} variant="outline">
                      {subject}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-primary">→ {weakness.recommendation}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            AI-Generated Recommendations
          </CardTitle>
          <CardDescription>Personalized strategies to maximize your academic potential</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed pt-0.5">{rec}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
