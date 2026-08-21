"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  TrendingUp, 
  Target, 
  Brain, 
  Cpu, 
  Database, 
  ChevronRight, 
  RefreshCw, 
  Layers, 
  Lock, 
  CheckCircle2, 
  Terminal, 
  Plus, 
  X,
  Activity,
  Sparkles
} from "lucide-react"
import { ResetDataButton } from "@/components/reset-data-button"
import { UploadMarkSheet } from "@/components/upload-mark-sheet"
import { RecentActivity } from "@/components/recent-activity"
import { QuickStats } from "@/components/quick-stats"
import { useAnalysis } from "@/lib/analysis-context"
import Link from "next/link"

export default function DashboardPage() {
  const { report, history, loadDemoData, setReport, consoleLogs } = useAnalysis()
  const [showUploader, setShowUploader] = useState(false)
  const [showLogs, setShowLogs] = useState(false)

  const hasData = Boolean(report || history.length > 0)

  return (
    <div className="flex flex-col gap-8 w-full fade-in-up">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {report ? `Welcome, ${report.studentName}` : "Student Dashboard"}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {report 
              ? "Track your academic scores and follow your career compatibility pathways" 
              : "Upload your academic transcript sheet to trigger model classification and EduAI recommendations."}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          {hasData && (
            <ResetDataButton
              variant="outline"
              label="Reset Details"
              className="text-xs"
            />
          )}

          {report && (
            <Button 
              variant={showUploader ? "destructive" : "default"} 
              size="sm" 
              onClick={() => setShowUploader(!showUploader)}
              className="text-xs flex items-center gap-1.5 font-semibold"
            >
              {showUploader ? (
                <>
                  <X className="h-3.5 w-3.5" />
                  Cancel Upload
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" />
                  Upload Another Marksheet
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats (Always displayed) */}
      <QuickStats />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Columns (2/3 width on desktop) */}
        <div className="lg:col-span-2 flex flex-col gap-6 w-full">
          
          {/* Uploader Card (Visible when empty, or when toggle active) */}
          {(!report || showUploader) && (
            <Card className="border-primary/20 glass-effect neon-glow shadow-2xl relative overflow-hidden group hover:border-primary/35 transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Upload className="h-5 w-5" />
                  </div>
                  {report ? "Update Transcript Sheet" : "Start Your Profile Analysis"}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Upload your transcript file (PDF, CSV, Excel, or image). The local neural classifier will extract features before synthesis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UploadMarkSheet />
              </CardContent>
            </Card>
          )}

          {/* Core Student Data Insights (Visible when report is loaded) */}
          {report ? (
            <>
              {/* Parsed Academic Record Table */}
              <Card className="border-border bg-card/30 backdrop-blur-md">
                <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border/40">
                  <div>
                    <CardTitle className="text-lg font-bold">Academic Record Log</CardTitle>
                    <CardDescription>Extracted subjects, scores, and semester trends</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 font-mono text-xs px-2 py-0.5">
                    {report.subjects.length} modules parsed
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {report.subjects.map((sub, i) => (
                      <div 
                        key={i} 
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/15 border border-border/40 hover:border-primary/25 transition-all hover:bg-muted/20"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-sm text-foreground">{sub.name}</span>
                          <span className="text-xs text-muted-foreground font-mono">Grade: {sub.grade}</span>
                        </div>
                        <div className="text-right flex flex-col gap-0.5">
                          <span className="text-base font-extrabold text-primary font-mono">{sub.score}%</span>
                          <span className={`text-[10px] uppercase font-extrabold tracking-wider ${
                            sub.trend === "up" ? "text-green-400" : sub.trend === "down" ? "text-amber-400" : "text-muted-foreground"
                          }`}>
                            {sub.trend === "up" ? "↑ Upward" : sub.trend === "down" ? "↓ Downward" : "→ Stable"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Strengths & Weaknesses quick recap */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="border-primary/20 bg-primary/5/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> Primary Strength
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-bold text-sm text-foreground">{report.strengths[0]?.title || "Analytical Reasoning"}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {report.strengths[0]?.description || "Excellent conceptual command and capability in quantitative modules."}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-amber-500/20 bg-amber-500/5/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                      <Brain className="h-3.5 w-3.5" /> Priority Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-bold text-sm text-foreground">{report.weaknesses[0]?.title || "Synthesized Output"}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {report.weaknesses[0]?.recommendation || "Structure concept summaries and engage in daily focus exercises."}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* User-Friendly Quick Navigation Hub */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider select-none">Quick Navigation Hub</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/20 shadow hover:border-primary/45 transition-all duration-300 group">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
                        <Brain className="h-5 w-5 text-primary" /> Performance Analytics
                      </CardTitle>
                      <CardDescription className="text-xs">
                        View subject grade curves, term trends & detailed analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <Button size="sm" className="w-full text-xs font-semibold flex items-center justify-between" asChild>
                        <Link href="/analysis">
                          <span>Explore Analytics</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/20 shadow hover:border-primary/45 transition-all duration-300 group">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
                        <Target className="h-5 w-5 text-primary" /> Career & Recovery
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Discover matching careers or foundational recovery steps
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <Button size="sm" variant="outline" className="w-full text-xs font-semibold flex items-center justify-between bg-transparent" asChild>
                        <Link href="/careers">
                          <span>View Pathways</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/20 shadow hover:border-primary/45 transition-all duration-300 group">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
                        <TrendingUp className="h-5 w-5 text-primary" /> Progress Tracker
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Track multi-term milestones, GPA timeline & courses
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <Button size="sm" variant="outline" className="w-full text-xs font-semibold flex items-center justify-between bg-transparent" asChild>
                        <Link href="/progress">
                          <span>Track Progress</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            /* Workflow timeline shown when empty */
            <Card className="border-border bg-card/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Academic Mapping Workflow</CardTitle>
                <CardDescription>Follow these phases to map academic performance to compatible fields</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { step: "1", title: "Upload Mark Sheet", desc: "Accepts PDFs, CSVs, Excel sheets (XLSX, XLS), or images of transcripts." },
                  { step: "2", title: "Local Classifier Inference", desc: "Loads local PyTorch neural network weights.bin to extract feature distribution matrices." },
                  { step: "3", title: "EduAI Recommendation Synthesis", desc: "Synthesizes subject metrics to recommend target careers and curriculums." },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-3 border-b border-border/40 last:border-0 last:pb-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs sm:text-sm font-semibold select-none">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

          {/* Right Column (1/3 width on desktop) */}
          <div className="flex flex-col gap-6 w-full">
            
            {/* Top Compatible Career matches summary card (when report loaded) */}
            {report && (
              <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/20 shadow-xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                <CardHeader className="pb-3 border-b border-border/40">
                  <CardTitle className="text-sm font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5 select-none">
                    <Target className="h-4 w-4" /> Top Aligned Pathway
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{report.careers[0]?.title || "Software Pathway"}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                      {report.careers[0]?.description || "Analyze data structures and modern application systems."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40">
                    <span className="text-muted-foreground">Match Score:</span>
                    <span className="font-extrabold text-primary text-sm font-mono">{report.careers[0]?.match || 90}%</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full text-xs font-semibold bg-transparent" asChild>
                    <Link href="/careers">Explore All Career Matches</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Always show History / Activity panel */}
            <RecentActivity />
          </div>
      </div>
    </div>
  )
}
