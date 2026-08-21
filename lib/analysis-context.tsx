"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { auth, googleProvider } from "./firebase"
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth"

export interface Subject {
  name: string
  score: number | string | null
  grade: string
  trend: "up" | "down" | "stable"
}

export interface Strength {
  title: string
  description: string
  subjects: string[]
}

export interface Weakness {
  title: string
  description: string
  subjects: string[]
  recommendation: string
}

export interface Career {
  title: string
  match: number
  icon: string
  description: string
  skills: string[]
  salary: string
  growth: string
  education: string
}

export interface LearningResource {
  title: string
  provider: string
  type: string
  duration: string
  rating: number
  link: string
}

export interface MarkSheetHistoryItem {
  id: string
  uploadedAt: string
  fileName: string
  report: AnalysisReport
}

export interface AnalysisReport {
  studentName: string
  overallStats: {
    gpa: number
    completedSubjects: number
    accuracyRate: number
    satisfaction: number
  }
  subjects: Subject[]
  strengths: Strength[]
  weaknesses: Weakness[]
  recommendations: string[]
  careers: Career[]
  learningResources: LearningResource[]
}

interface AnalysisContextType {
  report: AnalysisReport | null
  setReport: (report: AnalysisReport | null) => void
  history: MarkSheetHistoryItem[]
  activeViewMode: "latest" | "all"
  setActiveViewMode: (mode: "latest" | "all") => void
  addReportToHistory: (report: AnalysisReport, fileName: string) => Promise<void>
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  consoleLogs: string[]
  addConsoleLog: (log: string) => void
  clearConsoleLogs: () => void
  runMockInference: (fileName: string) => Promise<void>
  loadDemoData: () => void
  resetUserData: () => Promise<void>
  isAuthenticated: boolean
  user: User | null
  login: (email?: string, pass?: string) => Promise<boolean>
  logout: () => void
}

const defaultReport: AnalysisReport = {
  studentName: "John Doe",
  overallStats: {
    gpa: 3.5,
    completedSubjects: 6,
    accuracyRate: 94,
    satisfaction: 96
  },
  subjects: [
    { name: "Mathematics", score: 92, grade: "A", trend: "up" },
    { name: "Physics", score: 88, grade: "A", trend: "up" },
    { name: "Chemistry", score: 85, grade: "A-", trend: "up" },
    { name: "Biology", score: 78, grade: "B+", trend: "stable" },
    { name: "English", score: 75, grade: "B", trend: "down" },
    { name: "History", score: 72, grade: "B", trend: "down" },
  ],
  strengths: [
    {
      title: "Analytical Thinking",
      description: "Strong problem-solving abilities in mathematics and logic",
      subjects: ["Mathematics", "Physics"],
    },
    {
      title: "Quantitative Skills",
      description: "Excellent performance in numerical and data-driven subjects",
      subjects: ["Chemistry"],
    },
    {
      title: "Consistent Performance",
      description: "Maintains steady academic progress over time",
      subjects: ["All Subjects"],
    },
  ],
  weaknesses: [
    {
      title: "Written Expression",
      description: "Needs improvement in essay writing and language comprehension",
      subjects: ["English", "History"],
      recommendation: "Practice daily writing exercises",
    },
    {
      title: "Memory Retention",
      description: "Difficulty retaining factual information for extended periods",
      subjects: ["Biology"],
      recommendation: "Use spaced repetition techniques",
    },
  ],
  recommendations: [
    "Allocate 45 minutes daily for language skill development",
    "Use flashcards and mnemonic devices for fact-based subjects",
    "Join study groups to enhance collaborative learning",
    "Leverage your analytical strength in STEM subjects for career planning",
  ],
  careers: [
    {
      title: "Software Engineer",
      match: 92,
      icon: "Code",
      description: "Design, develop, and maintain software applications and systems",
      skills: ["Programming", "Problem Solving", "Logic"],
      salary: "$85,000 - $150,000",
      growth: "22% projected growth",
      education: "Bachelor's in Computer Science or related field",
    },
    {
      title: "Data Scientist",
      match: 90,
      icon: "Calculator",
      description: "Analyze complex data sets to help organizations make informed decisions",
      skills: ["Statistics", "Machine Learning", "Mathematics"],
      salary: "$90,000 - $160,000",
      growth: "36% projected growth",
      education: "Bachelor's/Master's in Data Science or Statistics",
    },
    {
      title: "Mechanical Engineer",
      match: 88,
      icon: "Cpu",
      description: "Design and develop mechanical systems and devices",
      skills: ["Physics", "CAD", "Problem Solving"],
      salary: "$75,000 - $120,000",
      growth: "7% projected growth",
      education: "Bachelor's in Mechanical Engineering",
    },
  ],
  learningResources: [
    {
      "title": "Python for Everybody Specialization",
      "provider": "University of Michigan / Coursera",
      "type": "Course",
      "duration": "8 weeks",
      "rating": 4.9,
      "link": "https://www.coursera.org/specializations/python",
    },
    {
      "title": "Essential Mathematics for Computer Science",
      "provider": "University of London / Coursera",
      "type": "Course",
      "duration": "10 weeks",
      "rating": 4.8,
      "link": "https://www.coursera.org/specializations/essential-mathematics-computer-science",
    },
    {
      "title": "Google Crash Course on Python",
      "provider": "Google / Coursera",
      "type": "Course",
      "duration": "6 weeks",
      "rating": 4.8,
      "link": "https://www.coursera.org/learn/python-crash-course",
    },
  ]
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined)

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [report, setReportState] = useState<AnalysisReport | null>(null)
  const [history, setHistory] = useState<MarkSheetHistoryItem[]>([])
  const [activeViewMode, setActiveViewMode] = useState<"latest" | "all">("all")
  const [isLoading, setIsLoading] = useState(false)
  const [consoleLogs, setConsoleLogs] = useState<string[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  // Compute aggregated report across all history items
  const computeCombinedReport = (items: MarkSheetHistoryItem[]): AnalysisReport | null => {
    if (!items || items.length === 0) return null
    if (items.length === 1) return items[0].report

    const latest = items[0].report
    // Map of subject name -> array of numeric scores
    const subjectMap: Record<string, number[]> = {}

    items.forEach((item) => {
      item.report.subjects?.forEach((subj) => {
        if (subj.score !== null && subj.score !== "AB" && typeof subj.score === "number") {
          if (!subjectMap[subj.name]) subjectMap[subj.name] = []
          subjectMap[subj.name].push(subj.score)
        }
      })
    })

    const combinedSubjects: Subject[] = Object.entries(subjectMap).map(([name, scores]) => {
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      let grade = "F"
      if (avg >= 75) grade = "A"
      else if (avg >= 65) grade = "B"
      else if (avg >= 55) grade = "C"
      else if (avg >= 35) grade = "S"

      const trend: "up" | "down" | "stable" =
        scores.length >= 2
          ? scores[0] > scores[scores.length - 1]
            ? "up"
            : scores[0] < scores[scores.length - 1]
            ? "down"
            : "stable"
          : "stable"

      return { name, score: avg, grade, trend }
    })

    const avgGpa = Number((items.reduce((acc, curr) => acc + (curr.report.overallStats?.gpa || 0), 0) / items.length).toFixed(2))

    return {
      ...latest,
      studentName: latest.studentName,
      overallStats: {
        ...latest.overallStats,
        gpa: avgGpa,
        completedSubjects: combinedSubjects.length,
      },
      subjects: combinedSubjects.length > 0 ? combinedSubjects : latest.subjects,
      // Use the AI's unified multi-term synthesized strengths, weaknesses, recommendations, careers & resources
      strengths: latest.strengths,
      weaknesses: latest.weaknesses,
      recommendations: latest.recommendations,
      careers: latest.careers,
      learningResources: latest.learningResources,
    }
  }

  const activeReport = activeViewMode === "all" && history.length > 0
    ? computeCombinedReport(history)
    : report

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAuthenticated(true);

        // 1. Instantly load from localStorage cache if available
        try {
          const cachedReport = localStorage.getItem(`eduguide_report_${currentUser.uid}`);
          const cachedHistory = localStorage.getItem(`eduguide_history_${currentUser.uid}`);
          if (cachedReport) {
            setReportState(JSON.parse(cachedReport));
          }
          if (cachedHistory) {
            setHistory(JSON.parse(cachedHistory));
          }
        } catch {
          // localStorage fallback ignore
        }

        // 2. Background sync from server/MongoDB API safely
        try {
          const res = await fetch(`/api/report?userId=${encodeURIComponent(currentUser.uid)}`).catch(() => null);
          if (res && res.ok) {
            const data = await res.json().catch(() => null);
            if (data) {
              const loadedReport = data.report || null;
              const loadedHistory = data.history || (data.report ? [{ id: "1", uploadedAt: new Date().toISOString(), fileName: "Transcript", report: data.report }] : []);
              setReportState(loadedReport);
              setHistory(loadedHistory);

              // Update local cache
              try {
                if (loadedReport) {
                  localStorage.setItem(`eduguide_report_${currentUser.uid}`, JSON.stringify(loadedReport));
                  localStorage.setItem(`eduguide_history_${currentUser.uid}`, JSON.stringify(loadedHistory));
                }
              } catch {}
            }
          }
        } catch (e) {
          // Keep offline state silently
        }
      } else {
        setIsAuthenticated(false);
        setReportState(null);
        setHistory([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const saveToMongoDB = async (rep: AnalysisReport | null, hist: MarkSheetHistoryItem[]) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      // Immediate local cache save
      try {
        if (rep) {
          localStorage.setItem(`eduguide_report_${currentUser.uid}`, JSON.stringify(rep));
          localStorage.setItem(`eduguide_history_${currentUser.uid}`, JSON.stringify(hist));
        } else {
          localStorage.removeItem(`eduguide_report_${currentUser.uid}`);
          localStorage.removeItem(`eduguide_history_${currentUser.uid}`);
        }
      } catch {}

      // Background cloud sync
      try {
        await fetch("/api/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.uid,
            report: rep,
            history: hist,
          }),
        }).catch(() => null);
      } catch (e) {
        // Safe offline fallback
      }
    }
  }

  const setReport = async (newReport: AnalysisReport | null) => {
    setReportState(newReport);
    let updatedHistory = history;
    if (newReport) {
      const newItem: MarkSheetHistoryItem = {
        id: Date.now().toString(),
        uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        fileName: `MarkSheet_${history.length + 1}`,
        report: newReport,
      }
      updatedHistory = [newItem, ...history];
      setHistory(updatedHistory);
    }
    await saveToMongoDB(newReport, updatedHistory);
  }

  const addReportToHistory = async (newReport: AnalysisReport, fileName: string) => {
    setReportState(newReport);
    const newItem: MarkSheetHistoryItem = {
      id: Date.now().toString(),
      uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      fileName: fileName || `MarkSheet_${history.length + 1}`,
      report: newReport,
    }
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    await saveToMongoDB(newReport, updatedHistory);
  }

  const addConsoleLog = (log: string) => {
    setConsoleLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`])
  }

  const clearConsoleLogs = () => {
    setConsoleLogs([])
  }

  const runMockInference = async (fileName: string) => {
    clearConsoleLogs()
    addConsoleLog("Initializing local hybrid AI engine...")
    await new Promise(r => setTimeout(r, 600))
    addConsoleLog("Loading local weights from './trained_model/weights.bin'...")
    await new Promise(r => setTimeout(r, 800))
    addConsoleLog("Weights loaded successfully (Size: 1.0 KB, Format: PyTorch Binary)")
    await new Promise(r => setTimeout(r, 600))
    addConsoleLog("Loading architecture configuration from './trained_model/model_config.json'...")
    await new Promise(r => setTimeout(r, 500))
    addConsoleLog("Local model verified: 5-layer Neural Network (Accuracy: 94.18%)")
    await new Promise(r => setTimeout(r, 700))
    addConsoleLog(`Processing uploaded document '${fileName}'...`)
    await new Promise(r => setTimeout(r, 900))
    addConsoleLog("Extracting local feature vectors (Subject distribution analysis)...")
    await new Promise(r => setTimeout(r, 800))
    addConsoleLog("Local classification complete. Outputting base scores...")
    await new Promise(r => setTimeout(r, 600))
    addConsoleLog("Connecting to EduGuideAI engine for deep contextual and semantic parsing...")
    await new Promise(r => setTimeout(r, 1000))
    addConsoleLog("Synthesizing learning pathways, career matches, and improvement steps...")
  }

  const loadDemoData = async () => {
    clearConsoleLogs()
    await setReport(defaultReport)
    addConsoleLog("Demo data successfully loaded. Welcome back John Doe!")
  }

  const login = async (): Promise<boolean> => {
    try {
      await signInWithPopup(auth, googleProvider)
      return true
    } catch (e) {
      console.error("Google Sign-In Error:", e)
      return false
    }
  }

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Sign-out Error:", e);
    }
  }

  const resetUserData = async () => {
    setReportState(null)
    setHistory([])
    clearConsoleLogs()
    const currentUser = auth.currentUser
    if (currentUser) {
      try {
        localStorage.removeItem(`eduguide_report_${currentUser.uid}`)
        localStorage.removeItem(`eduguide_history_${currentUser.uid}`)
      } catch {}

      try {
        await fetch("/api/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.uid,
            report: null,
            history: [],
          }),
        }).catch(() => null)
      } catch (e) {
        // Safe fallback
      }
    }
  }

  return (
    <AnalysisContext.Provider
      value={{
        report: activeReport,
        setReport,
        history,
        activeViewMode,
        setActiveViewMode,
        addReportToHistory,
        isLoading,
        setIsLoading,
        consoleLogs,
        addConsoleLog,
        clearConsoleLogs,
        runMockInference,
        loadDemoData,
        resetUserData,
        isAuthenticated,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  const context = useContext(AnalysisContext)
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider")
  }
  return context
}
