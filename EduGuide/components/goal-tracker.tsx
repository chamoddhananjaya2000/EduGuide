"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function GoalTracker() {
  const goals = [
    {
      title: "Achieve 3.8 GPA",
      progress: 85,
      current: "3.65",
      target: "3.8",
      deadline: "End of Semester",
      status: "on-track",
    },
    {
      title: "Improve Chemistry Grade",
      progress: 70,
      current: "B+",
      target: "A",
      deadline: "Next Exam",
      status: "needs-focus",
    },
    {
      title: "Complete Python Certification",
      progress: 45,
      current: "Module 4/9",
      target: "Certified",
      deadline: "3 months",
      status: "on-track",
    },
    {
      title: "Master Calculus Concepts",
      progress: 92,
      current: "Advanced",
      target: "Expert",
      deadline: "2 weeks",
      status: "ahead",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Academic Goals</CardTitle>
            <CardDescription>Track your progress toward key objectives</CardDescription>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{goal.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      {goal.current} → {goal.target}
                    </span>
                    <span className="text-xs">•</span>
                    <span>{goal.deadline}</span>
                  </div>
                </div>
                <Badge
                  variant={
                    goal.status === "ahead" ? "default" : goal.status === "needs-focus" ? "destructive" : "secondary"
                  }
                  className="text-xs"
                >
                  {goal.status === "ahead" ? "Ahead" : goal.status === "needs-focus" ? "Focus Needed" : "On Track"}
                </Badge>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs font-medium">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
