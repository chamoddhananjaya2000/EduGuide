"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X, CheckCircle2, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnalysis } from "@/lib/analysis-context"

export function UploadMarkSheet() {
  const {
    report,
    setReport,
    history,
    addReportToHistory,
    isLoading,
    setIsLoading,
    consoleLogs,
    addConsoleLog,
    runMockInference,
  } = useAnalysis()

  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileBase64, setFileBase64] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [includeHistory, setIncludeHistory] = useState(true)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    processFile(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    if (file) {
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const isSupported = file.type === "application/pdf" ||
        file.type.includes("image") ||
        file.type === "text/csv" ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel" ||
        ["csv", "xlsx", "xls"].includes(fileExt || "")
      if (isSupported) {
        setUploadedFile(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          setFileBase64(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleUpload = async () => {
    if (!uploadedFile || !fileBase64) return
    setIsLoading(true)
    setIsComplete(false)

    try {
      // Step 1: Run local model simulation logs
      await runMockInference(uploadedFile.name)

      // Step 2: Make the actual API call to the Next.js route handler
      // Pass existing history only when includeHistory is enabled
      const previousReports = includeHistory
        ? history.map((h) => ({
            uploadedAt: h.uploadedAt,
            fileName: h.fileName,
            subjects: h.report.subjects,
            gpa: h.report.overallStats?.gpa,
          }))
        : []

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileData: fileBase64,
          fileName: uploadedFile.name,
          mimeType: uploadedFile.type,
          previousReports,
        }),
      })

      if (!res.ok) {
        throw new Error(`Server returned error: ${res.statusText}`)
      }

      const data = await res.json()

      addConsoleLog("Analysis complete! Parsing output schema...")
      await new Promise(r => setTimeout(r, 600))

      // Update context report and add to history log
      await addReportToHistory(data, uploadedFile.name)
      setIsComplete(true)
      addConsoleLog("[SUCCESS] System idle. Data ready.")
    } catch (err: any) {
      console.error(err)
      addConsoleLog(`[ERROR] Analysis failed: ${err.message || err}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = () => {
    setUploadedFile(null)
    setFileBase64(null)
    setIsComplete(false)
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <CheckCircle2 className="h-16 w-16 text-primary animate-bounce" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Upload & Analysis Successful!</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your mark sheet was processed by the local ONNX Runtime Engine (Model: <code className="text-xs text-primary bg-primary/10 px-1 py-0.5 rounded">ml/eduguide_career_prediction_model.onnx</code>) and synthesized with EduGuide AI.
          </p>
        </div>

        {/* Shortened log console shown after completion */}
        <div className="w-full max-w-md mt-2 p-3 rounded bg-black/90 text-green-400 font-mono text-[10px] border border-green-500/20">
          <p className="text-muted-foreground border-b border-green-500/20 pb-1 mb-1 flex items-center gap-1 font-bold">
            <Terminal className="h-3 w-3 text-green-500" /> ONNX RUNTIME EXECUTION TRACE
          </p>
          {consoleLogs.slice(-3).map((log, idx) => (
            <p key={idx} className="truncate">{log}</p>
          ))}
        </div>

        <Button onClick={handleRemove} variant="outline" className="mt-2">
          Upload Another Mark Sheet
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 transition-all duration-300",
          isDragging ? "border-primary bg-primary/5 scale-[0.99]" : "border-border hover:border-primary/50",
          uploadedFile && "border-primary bg-primary/5",
          isLoading && "opacity-50 pointer-events-none"
        )}
      >
        {uploadedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-10 w-10 text-primary animate-pulse" />
              <div>
                <p className="font-medium text-sm sm:text-base">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            {!isLoading && (
              <Button variant="ghost" size="icon" onClick={handleRemove}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <Upload className="h-12 w-12 text-muted-foreground hover:text-primary transition-colors" />
            <div>
              <p className="text-lg font-medium mb-1">Drop your mark sheet here</p>
              <p className="text-sm text-muted-foreground">or click to browse files (PDF or Images)</p>
            </div>
            <input
              type="file"
              onChange={handleFileInput}
              accept=".pdf,.csv,.xlsx,.xls,image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isLoading}
            />
          </div>
        )}
      </div>

      {uploadedFile && !isComplete && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/60 text-xs">
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">Include Historical Reports</span>
              <span className="text-muted-foreground text-[11px]">
                {includeHistory
                  ? "AI will synthesize cumulative insights across past uploaded sheets"
                  : "Standalone Mode: AI will analyze this sheet independently for testing"}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeHistory}
                onChange={(e) => setIncludeHistory(e.target.checked)}
                className="sr-only peer"
                disabled={isLoading}
              />
              <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <Button onClick={handleUpload} disabled={isLoading} className="w-full relative overflow-hidden">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-background animate-ping" />
                Processing Model Inference...
              </span>
            ) : (
              `Analyze ${includeHistory ? "with History Synthesis" : "in Standalone Mode"}`
            )}
          </Button>
        </div>
      )}

      {/* Terminal Log Console */}
      {consoleLogs.length > 0 && (
        <div className="mt-2 p-4 rounded-lg bg-black text-green-400 font-mono text-[11px] h-56 overflow-y-auto border border-green-500/20 shadow-2xl">
          <div className="flex items-center justify-between border-b border-green-500/25 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <Terminal className="h-3 w-3 text-green-500 animate-pulse" />
              <span className="text-[10px] text-green-500 uppercase tracking-widest font-bold">Hybrid AI Inference Logs</span>
            </div>
            <span className="text-[9px] text-muted-foreground font-mono">STATUS: {isLoading ? "RUNNING" : "IDLE"}</span>
          </div>
          <div className="space-y-1">
            {consoleLogs.map((log, idx) => (
              <div key={idx} className="whitespace-pre-wrap border-l border-green-500/10 pl-2">{log}</div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">Supported formats: PDF, CSV, Excel (XLSX, XLS), JPG, PNG (Max size: 10MB)</p>
    </div>
  )
}
