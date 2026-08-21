"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle } from "lucide-react"
import { useAnalysis } from "@/lib/analysis-context"

export function SkillsPathway() {
  const { report, history } = useAnalysis()

  const isRecoveryActive =
    report?.careers?.some(c => c.title.toLowerCase().includes("recovery") || c.title.toLowerCase().includes("foundation")) ||
    report?.subjects?.some(s => s.score === "AB" || s.score === null || (typeof s.score === "number" && s.score < 35)) ||
    history.some(h => h.report.subjects?.some(s => s.score === "AB" || s.score === null || (typeof s.score === "number" && s.score < 35)))

  const standardPathway = [
    {
      title: "Foundation Skills",
      status: "completed",
      skills: ["Mathematics", "Physics", "Problem Solving"],
      description: "Core academic competencies achieved",
    },
    {
      title: "Technical Skills",
      status: "in-progress",
      skills: ["Programming", "Data Analysis", "Statistics"],
      description: "Currently developing through coursework",
    },
    {
      title: "Advanced Certifications",
      status: "upcoming",
      skills: ["AWS Certified", "Python Specialist", "Machine Learning"],
      description: "Recommended next steps for career readiness",
    },
    {
      title: "Professional Skills",
      status: "upcoming",
      skills: ["Communication", "Leadership", "Project Management"],
      description: "Soft skills to complement technical expertise",
    },
  ]

  const recoveryPathway = [
    {
      title: "Attendance & Re-engagement",
      status: "in-progress",
      skills: ["Daily Attendance", "Class Participation", "Advisor Consultation"],
      description: "Priority 1: Re-establish 100% assessment attendance and counselor alignment",
    },
    {
      title: "Remedial Core Learning",
      status: "upcoming",
      skills: ["Core Mathematics", "Foundational Science", "Basic Literacy"],
      description: "Priority 2: Rebuild fundamental concept mastery to surpass 35+ pass marks",
    },
    {
      title: "Consistent Testing Streak",
      status: "upcoming",
      skills: ["3-Term Passing Record", "Assignment Submissions", "Study Habits"],
      description: "Priority 3: Maintain 3 consecutive passing terms without AB or zero marks",
    },
    {
      title: "Career Pathway Unlock",
      status: "upcoming",
      skills: ["Specialized Tracks", "Industry Certifications", "Career Matching"],
      description: "Final Goal: Unlock specialized STEM & professional career recommendations",
    },
  ]

  const pathway = isRecoveryActive ? recoveryPathway : standardPathway

  return (
    <Card className="border-border bg-card/30 backdrop-blur-md">
      <CardHeader>
        <CardTitle>{isRecoveryActive ? "Academic Recovery Roadmap" : "Recommended Skills Pathway"}</CardTitle>
        <CardDescription>
          {isRecoveryActive
            ? "Step-by-step foundation plan to restore academic standing and unlock careers"
            : "Your personalized roadmap to career success"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {pathway.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                {step.status === "completed" ? (
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground" />
                )}
                {index < pathway.length - 1 && <div className="w-0.5 h-full bg-border mt-2" />}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">{step.title}</h4>
                  <Badge
                    variant={
                      step.status === "completed" ? "default" : step.status === "in-progress" ? "secondary" : "outline"
                    }
                  >
                    {step.status === "completed"
                      ? "Complete"
                      : step.status === "in-progress"
                        ? "In Progress"
                        : "Upcoming"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{step.description}</p>
                <div className="flex flex-wrap gap-2">
                  {step.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
