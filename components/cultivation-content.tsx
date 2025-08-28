"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { BookOpen, Coins } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Lesson {
  _id: string
  monphai: string
  cauhoi: string
  luachon: {
    A: string
    B: string
    C: string
    D: string
  }
  dapan: string
  reward?: number
}

export function CultivationContent() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [answering, setAnswering] = useState(false)
  const [answerResult, setAnswerResult] = useState<{
    submitted: boolean
    correct: boolean
    message: string
    reward?: number
  } | null>(null)
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchLessons()
    }
  }, [user])

  const fetchLessons = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/cultivation/lessons?userId=${user.userId}`)
      if (response.ok) {
        const data = await response.json()
        setLessons(data)
      }
    } catch (error) {
      console.error("Error fetching lessons:", error)
    } finally {
      setLoading(false)
    }
  }

  const startLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson)
    setSelectedAnswer(null)
    setAnswerResult(null)
  }

  const submitAnswer = async () => {
    if (!currentLesson || selectedAnswer === null || !user) return

    setAnswering(true)
    try {
      const response = await fetch("/api/cultivation/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: currentLesson._id,
          answer: selectedAnswer,
          userId: user.userId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAnswerResult({
          submitted: true,
          correct: data.correct,
          message: data.message,
          reward: data.reward,
        })

        toast({
          title: data.correct ? "Chính xác!" : "Sai rồi!",
          description: data.message,
          variant: data.correct ? "default" : "destructive",
        })

        if (data.correct) {
          await refreshUser()
          // Trigger a custom event to refresh wallet display
          window.dispatchEvent(new CustomEvent("walletUpdate"))
        }

        setTimeout(() => {
          setCurrentLesson(null)
          setSelectedAnswer(null)
          setAnswerResult(null)
        }, 5000)
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi câu trả lời",
        variant: "destructive",
      })
    } finally {
      setAnswering(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">Đang tải bài học...</div>
      </div>
    )
  }

  if (currentLesson) {
    const options = [currentLesson.luachon.A, currentLesson.luachon.B, currentLesson.luachon.C, currentLesson.luachon.D]
    const optionKeys = ["A", "B", "C", "D"]

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-primary/30 bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-accent">{currentLesson.monphai}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-4">{currentLesson.cauhoi}</h3>
            </div>

            {answerResult && (
              <div
                className={`p-4 rounded-lg border-2 text-center ${
                  answerResult.correct
                    ? "bg-green-500/10 border-green-500 text-green-400"
                    : "bg-red-500/10 border-red-500 text-red-400"
                }`}
              >
                <div className="text-lg font-bold mb-2">{answerResult.correct ? "🎉 Chính xác!" : "❌ Sai rồi!"}</div>
                <div className="text-sm mb-2">{answerResult.message}</div>
                {answerResult.correct && answerResult.reward && (
                  <div className="text-accent font-semibold">+{answerResult.reward} Linh Thạch</div>
                )}
                {!answerResult.correct && (
                  <div className="text-sm text-muted-foreground mt-2">
                    Đáp án đúng: {currentLesson.dapan}.{" "}
                    {currentLesson.luachon[currentLesson.dapan as keyof typeof currentLesson.luachon]}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              {options.map((option, index) => {
                const optionKey = optionKeys[index]
                let buttonClass = ""

                if (answerResult?.submitted) {
                  if (optionKey === currentLesson.dapan) {
                    buttonClass = "bg-green-500/20 border-green-500 text-green-400"
                  } else if (optionKey === selectedAnswer && !answerResult.correct) {
                    buttonClass = "bg-red-500/20 border-red-500 text-red-400"
                  } else {
                    buttonClass = "opacity-50"
                  }
                } else if (selectedAnswer === optionKey) {
                  buttonClass = "bg-primary text-primary-foreground border-primary"
                } else {
                  buttonClass = "border-border hover:border-accent"
                }

                return (
                  <Button
                    key={`${currentLesson._id}-${optionKey}`}
                    variant="outline"
                    className={`w-full text-left justify-start p-4 h-auto ${buttonClass}`}
                    onClick={() => !answerResult?.submitted && setSelectedAnswer(optionKey)}
                    disabled={answerResult?.submitted}
                  >
                    <span className="mr-3 font-bold">{optionKey}.</span>
                    {option}
                  </Button>
                )
              })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2 text-accent">
                <Coins className="h-4 w-4" />
                <span>Phần thưởng: {currentLesson.reward || 50} Linh Thạch</span>
              </div>
              <div className="space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentLesson(null)
                    setAnswerResult(null)
                  }}
                >
                  Quay lại
                </Button>
                {!answerResult?.submitted ? (
                  <Button
                    onClick={submitAnswer}
                    disabled={selectedAnswer === null || answering}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {answering ? "Đang gửi..." : "Trả lời"}
                  </Button>
                ) : (
                  <div className="text-sm text-muted-foreground">Tự động quay lại sau 5 giây...</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Tu Luyện
        </h2>
        <p className="text-muted-foreground">Nâng cao tu vi qua việc học hỏi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <Card
            key={lesson._id}
            className="border-primary/30 bg-card/90 backdrop-blur-sm hover:border-accent/50 transition-colors"
          >
            <CardHeader>
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg text-foreground">{lesson.monphai}</CardTitle>
              </div>
              <Badge variant="secondary" className="w-fit">
                <Coins className="h-3 w-3 mr-1" />
                {lesson.reward || 50} Linh Thạch
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{lesson.cauhoi}</p>
              <Button
                onClick={() => startLesson(lesson)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Bắt đầu học
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
