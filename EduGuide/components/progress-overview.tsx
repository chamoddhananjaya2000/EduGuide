"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Award, Target, Calendar } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

import { useAnalysis } from "@/lib/analysis-context"

export function ProgressOverview() {
  const { report, history } = useAnalysis()
  const currentGPA = report?.overallStats?.gpa || 0
  const historyCount = history.length
  const hasEnoughHistory = historyCount >= 3

  // Map real uploaded historical marksheets to progress chart
  const realProgressData = [...history].reverse().map((item, index) => ({
    name: item.fileName || `Term ${index + 1}`,
    gpa: Number((item.report?.overallStats?.gpa || 0).toFixed(2)),
  }))

  const milestones = [
    { icon: Award, label: `${currentGPA >= 3.0 ? "3.0+ GPA Level" : "Academic Profile Registered"}`, date: `${historyCount} Upload(s)`, status: "completed" },
    { icon: Target, label: `${historyCount} Marksheets Recorded`, date: "Multi-Term History", status: historyCount >= 1 ? "completed" : "in-progress" },
    { icon: TrendingUp, label: "High Precision (3+ Sheets)", date: historyCount >= 3 ? "Unlocked" : "Pending 3 Sheets", status: historyCount >= 3 ? "completed" : "in-progress" },
    { icon: Calendar, label: "Career / Recovery Alignment", date: "Active", status: "completed" },
  ]

  const chartConfig = {
    gpa: {
      label: "GPA",
      color: "#06d6a0",
    },
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Academic Progress Timeline</CardTitle>
          <CardDescription>
            {hasEnoughHistory
              ? `GPA trajectory across ${historyCount} recorded marksheets`
              : "Requires at least 3 uploaded marksheets for historical progress tracking"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasEnoughHistory ? (
            <div className="h-[280px] flex flex-col items-center justify-center text-center p-6 bg-muted/10 rounded-lg border border-dashed border-border/60 gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                {historyCount}/3
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Progress Timeline Locked</h4>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Upload at least <strong>3 marksheets</strong> to plot longitudinal GPA progress curves over terms.
                </p>
              </div>
            </div>
          ) : (
            <>
              <ChartContainer config={chartConfig} className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={realProgressData}>
                    <defs>
                      <linearGradient id="colorGPA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06d6a0" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06d6a0" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 4.0]} tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="gpa"
                      stroke="#06d6a0"
                      strokeWidth={3}
                      fill="url(#colorGPA)"
                      dot={{ r: 4, fill: '#06d6a0', stroke: '#0d1117', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#06d6a0', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Overall GPA: {currentGPA.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Milestones</CardTitle>
          <CardDescription>Records and precision badges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon
              return (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      milestone.status === "completed" ? "bg-primary/10" : "bg-secondary"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${milestone.status === "completed" ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{milestone.label}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">{milestone.date}</p>
                      <Badge
                        variant={milestone.status === "completed" ? "default" : "secondary"}
                        className="text-xs h-5"
                      >
                        {milestone.status === "completed" ? "✓" : "..."}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
