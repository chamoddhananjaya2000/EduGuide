"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Brain, Target, TrendingUp } from "lucide-react"
import { useAnalysis } from "@/lib/analysis-context"
import { ResetDataButton } from "@/components/reset-data-button"

export function RecentActivity() {
  const { history } = useAnalysis()

  return (
    <Card className="border-border bg-card/30 backdrop-blur-md">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg font-bold">Uploaded Mark Sheet History</CardTitle>
          <CardDescription>All recorded transcripts stored for precision analysis</CardDescription>
        </div>
        {history.length > 0 && (
          <ResetDataButton
            variant="ghost"
            size="sm"
            label="Clear"
            className="text-xs text-muted-foreground hover:text-destructive h-7 px-2"
          />
        )}
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No uploads recorded yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((item, index) => (
              <div key={item.id || index} className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/10 border border-border/30 hover:border-primary/20 transition-all">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs text-foreground truncate">{item.fileName}</p>
                  <p className="text-[11px] text-muted-foreground">GPA: {item.report?.overallStats?.gpa?.toFixed(2) || "N/A"} • {item.report?.subjects?.length || 0} Subjects</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">{item.uploadedAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
