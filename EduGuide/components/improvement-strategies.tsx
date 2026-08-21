import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Clock, BookOpen, Users } from "lucide-react"

export function ImprovementStrategies() {
  const strategies = [
    {
      icon: BookOpen,
      title: "Daily Practice Sessions",
      description: "Dedicate 30 minutes each day to weak subjects",
      timeCommitment: "30 min/day",
      difficulty: "Easy",
      impact: "High",
      subjects: ["Chemistry", "English"],
    },
    {
      icon: Users,
      title: "Join Study Groups",
      description: "Collaborate with peers for better understanding",
      timeCommitment: "2 hours/week",
      difficulty: "Medium",
      impact: "Medium",
      subjects: ["Biology", "History"],
    },
    {
      icon: Clock,
      title: "Spaced Repetition",
      description: "Review concepts at increasing intervals",
      timeCommitment: "15 min/day",
      difficulty: "Easy",
      impact: "High",
      subjects: ["All Subjects"],
    },
    {
      icon: Lightbulb,
      title: "Concept Mapping",
      description: "Create visual diagrams to connect ideas",
      timeCommitment: "1 hour/week",
      difficulty: "Medium",
      impact: "Medium",
      subjects: ["Science", "Math"],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Improvement Strategies
        </CardTitle>
        <CardDescription>AI-recommended approaches for academic growth</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {strategies.map((strategy, index) => {
            const Icon = strategy.icon
            return (
              <div key={index} className="space-y-3 pb-6 border-b last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1">{strategy.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{strategy.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 ml-13">
                  <Badge variant="outline" className="text-xs">
                    {strategy.timeCommitment}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {strategy.difficulty}
                  </Badge>
                  <Badge className="text-xs">{strategy.impact} Impact</Badge>
                </div>
                <div className="flex flex-wrap gap-1 ml-13">
                  {strategy.subjects.map((subject) => (
                    <Badge key={subject} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
