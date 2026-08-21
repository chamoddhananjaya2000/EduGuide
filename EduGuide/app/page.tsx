"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAnalysis } from "@/lib/analysis-context"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Brain,
  TrendingUp,
  Target,
  Sparkles,
  BarChart3,
  Lightbulb,
  Users,
  Award,
  GraduationCap,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Database
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const { isAuthenticated } = useAnalysis()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background grid and blur blobs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <Navigation />

      {/* Hero Section */}
      <section className="container relative pt-24 pb-20 md:pt-32 md:pb-28 max-w-7xl mx-auto fade-in-up">
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Next-Gen Academic Analytics
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-gradient tracking-tight">
            Align Academic Success With Career Goals
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed text-balance">
            Upload your mark sheets and academic transcripts to get instant strength mapping, course pathway recommendations, and AI career compatibility evaluations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button size="lg" className="px-8 py-6 font-semibold flex items-center gap-2 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300" asChild>
              <Link href="/dashboard">
                Enter Platform
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 bg-transparent border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/10" asChild>
              <a href="#features">Explore Features</a>
            </Button>
          </div>

          {/* Clean Stats Display */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 w-full max-w-5xl">
            {[
              { value: "94.2%", label: "Neural Network Acc" },
              { value: "8+", label: "Target Careers Logged" },
              { value: "98%", label: "Accuracy Rating" },
              { value: "Instant", label: "EduGuideAI Synthesis" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-1.5 p-4 rounded-xl border border-border/40 bg-card/20 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="container py-24 border-t border-border/30 max-w-7xl mx-auto scroll-mt-16">
        <div className="flex flex-col items-center gap-4 mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient">
            Make Academic Progress Seamless
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Everything you need to parse performance indexes, discover strengths, and plan career targets.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Brain,
              title: "Local Model Parsing",
              desc: "A custom 5-layer multi-class neural network classifies transcript weights locally from binary files.",
            },
            {
              icon: Target,
              title: "Career Path Synthesis",
              desc: "Contextual compatibility index scores map your academic scores to target industry verticals.",
            },
            {
              icon: TrendingUp,
              title: "Progress Analytics",
              desc: "Visual charts trace overall GPA timelines, helping you track improvement metrics across terms.",
            },
            {
              icon: Lightbulb,
              title: "Adaptive Curriculums",
              desc: "Personalized recommendation pipelines highlight key concepts that require focus.",
            },
            {
              icon: BarChart3,
              title: "Subject Breakdown",
              desc: "Interactive grade logs evaluate academic indicators to outline performance matrices.",
            },
            {
              icon: Award,
              title: "Targeted Resources",
              desc: "Instantly compile edX, MIT, and open courseware classes specific to your career goals.",
            },
          ].map((feat, i) => {
            const Icon = feat.icon
            return (
              <Card key={i} className="p-6 border-border/50 bg-card/10 backdrop-blur-sm hover:border-primary/40 hover:bg-card/25 transition-all duration-300 group shadow-md hover:shadow-lg hover:shadow-primary/5">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{feat.desc}</p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container py-24 border-t border-border/30 max-w-7xl mx-auto scroll-mt-16">
        <div className="flex flex-col items-center gap-4 mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient">
            Accelerated Insights. Better Careers.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Our platform combines localized classification intelligence with deep cloud contextual processing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Upload Mark Sheet",
              desc: "Provide your report card in PDF or image format. The secure uploader prepares the asset.",
            },
            {
              step: "2",
              title: "Local Classifier Inference",
              desc: "Our neural network weights parse transcript vectors, outputting local performance categories.",
            },
            {
              step: "3",
              title: "EduGuideAI Synthesis",
              desc: "The EduGuideAI engine compiles tailored curriculum resources and outlines matched career pathways.",
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-4 p-6 rounded-xl border border-border/30 bg-card/10 hover:border-primary/30 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 border border-primary/20 text-primary text-lg font-extrabold select-none">
                {item.step}
              </div>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container py-20 border-t border-border/30 max-w-6xl mx-auto">
        <Card className="p-8 md:p-14 glass-effect neon-glow relative overflow-hidden group hover:border-primary/45 transition-all duration-300">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/15 transition-colors" />
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto relative z-10">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gradient">
              Join Students Aligning Their Future Today
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl text-pretty">
              Access localized model metrics, upload academic data sheets, and explore dynamic pathway courses instantly.
            </p>
            <Button size="lg" className="px-8 py-6 font-semibold flex items-center gap-2 mt-2 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300" asChild>
              <Link href="/dashboard">
                Access Platform Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer Section */}
      <footer className="container py-12 border-t border-border/30 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 select-none">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight text-gradient">EduGuide AI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 EduGuide AI platform. Powered by custom CNN classifiers & EduGuideAI APIs.
          </p>
        </div>
      </footer>
    </div>
  )
}
