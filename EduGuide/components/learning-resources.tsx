"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Video, FileText, Headphones, Code, GraduationCap } from "lucide-react"
import { useAnalysis } from "@/lib/analysis-context"

const typeIconMap: Record<string, any> = {
  Course: Video,
  Book: FileText,
  Tutorial: Code,
  Podcast: Headphones,
}

export function LearningResources() {
  const { report } = useAnalysis()
  const resources = report?.learningResources || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Learning Resources</CardTitle>
        <CardDescription>Curated materials aligned with your academic needs and career goals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4 col-span-3">No resources recommended yet. Upload a mark sheet to get started.</p>
          ) : (
            resources.map((resource, index) => {
              const Icon = typeIconMap[resource.type] || GraduationCap
              return (
                <Card key={index} className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge variant="secondary" className="text-xs mb-2">
                          {resource.type}
                        </Badge>
                        <CardTitle className="text-base leading-tight">{resource.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Provided by {resource.provider}. Handpicked to align with your academic profile and strengthen your skillset.
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline">{resource.provider}</Badge>
                      <Badge variant="outline">★ {resource.rating}</Badge>
                      <Badge variant="outline">{resource.duration}</Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full bg-transparent" asChild>
                      <a href={resource.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                        Access Resource
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
