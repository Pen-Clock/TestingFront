"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Play, Code, FileText, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../_generated/api"
import { Id } from "../../../../_generated/dataModel"

// Define types
interface Course {
  _id: string;
  title: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface LessonContent {
  videoUrl?: string;
  quizQuestions?: QuizQuestion[];
  codeTemplate?: string;
  expectedOutput?: string;
  codeLanguage?: string;
}

interface Lesson {
  _id: string;
  title: string;
  description?: string;
  type: "video" | "quiz" | "code" | "text";
  content?: LessonContent;
  duration?: number;
  order: number;
}

interface UserProgress {
  _id: string;
  lessonId: string;
  completed: boolean;
  timeSpent?: number;
  quizScore?: number;
}

export default function LearnPage({ params }: { params: { id: string } }) {
  const courseId = params.id as Id<"courses">
  
  // GET REAL DATA FROM CONVEX BACKEND
  const course = useQuery(api.courses.getCourse, { courseId }) as Course | undefined
  const lessons = useQuery(api.lessons.getLessons, { courseId }) as Lesson[] | undefined
  const userProgress = useQuery(api.progress.getUserCourseProgress, { courseId }) as UserProgress[] | undefined
  
  // MUTATIONS
  const markLessonComplete = useMutation(api.lessons.markLessonComplete)
  const submitQuizAnswer = useMutation(api.lessons.submitQuizAnswer)
  const submitCodeExercise = useMutation(api.lessons.submitCodeExercise)
  
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({})
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [codeSubmission, setCodeSubmission] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // LOADING STATE
  if (!course || !lessons || lessons.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading course content...</p>
        </div>
      </div>
    )
  }

  const currentLesson = lessons[currentLessonIndex]
  const completedLessons = lessons.filter((lesson) => {
    const progress = (userProgress || []).find(p => p.lessonId === lesson._id)
    return progress?.completed || false
  }).length
  const progressPercentage = (completedLessons / lessons.length) * 100

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
      setShowQuizResults(false)
      setQuizAnswers({})
      setCodeSubmission("")
    }
  }

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
      setShowQuizResults(false)
      setQuizAnswers({})
      setCodeSubmission("")
    }
  }

  const handleMarkComplete = async (timeSpent: number = 300) => {
    if (!currentLesson) return
    
    setIsSubmitting(true)
    try {
      await markLessonComplete({ 
        lessonId: currentLesson._id as Id<"lessons">,
        timeSpent,
        quizScore: 100 // Default score for non-quiz lessons
      })
    } catch (error) {
      console.error("Failed to mark lesson complete:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuizSubmit = async () => {
    if (!currentLesson?.content?.quizQuestions) return
    
    setIsSubmitting(true)
    try {
      const score = Object.entries(quizAnswers).filter(
        ([qIndex, answer]) =>
          answer === currentLesson.content!.quizQuestions![Number.parseInt(qIndex)].correctAnswer
      ).length
      
      const totalQuestions = currentLesson.content.quizQuestions.length
      const percentage = (score / totalQuestions) * 100
      
      await submitQuizAnswer({
        lessonId: currentLesson._id as Id<"lessons">,
        answers: quizAnswers,
        score: percentage
      })
      
      await markLessonComplete({
        lessonId: currentLesson._id as Id<"lessons">,
        timeSpent: 600, // 10 minutes for quiz
        quizScore: percentage
      })
      
      setShowQuizResults(true)
    } catch (error) {
      console.error("Failed to submit quiz:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCodeSubmit = async () => {
    if (!currentLesson || !codeSubmission.trim()) return
    
    setIsSubmitting(true)
    try {
      await submitCodeExercise({
        lessonId: currentLesson._id as Id<"lessons">,
        code: codeSubmission
      })
      
      await markLessonComplete({
        lessonId: currentLesson._id as Id<"lessons">,
        timeSpent: 1800, // 30 minutes for code exercise
        quizScore: 100
      })
      
      alert("Code submitted successfully!")
    } catch (error) {
      console.error("Failed to submit code:", error)
      alert("Failed to submit code. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderLessonContent = () => {
    if (!currentLesson) return <div>No lesson content available</div>

    switch (currentLesson.type) {
      case "video":
        return (
          <div className="space-y-4">
            <div className="aspect-video">
              {currentLesson.content?.videoUrl ? (
                <iframe
                  src={currentLesson.content.videoUrl}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  title={currentLesson.title}
                />
              ) : (
                <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Video content not available</p>
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() => handleMarkComplete()}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Marking Complete..." : "Mark as Complete"}
              </Button>
            </div>
          </div>
        )

      case "quiz":
        if (!currentLesson.content?.quizQuestions) {
          return <div>Quiz content not available</div>
        }

        return (
          <div className="space-y-6">
            {currentLesson.content.quizQuestions.map((question, qIndex) => (
              <Card key={qIndex}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Question {qIndex + 1}: {question.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={quizAnswers[qIndex]?.toString()}
                    onValueChange={(value) => setQuizAnswers({ ...quizAnswers, [qIndex]: Number.parseInt(value) })}
                  >
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                        <Label htmlFor={`q${qIndex}-o${oIndex}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>

                  {showQuizResults && (
                    <div className="mt-4 p-4 rounded-lg bg-muted">
                      <div
                        className={`flex items-center gap-2 mb-2 ${
                          quizAnswers[qIndex] === question.correctAnswer ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        <CheckCircle className="h-4 w-4" />
                        {quizAnswers[qIndex] === question.correctAnswer ? "Correct!" : "Incorrect"}
                      </div>
                      <p className="text-sm">{question.explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {!showQuizResults ? (
              <Button
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length < currentLesson.content.quizQuestions.length || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-lg font-medium">
                  Score:{" "}
                  {
                    Object.entries(quizAnswers).filter(
                      ([qIndex, answer]) =>
                        answer === currentLesson.content!.quizQuestions![Number.parseInt(qIndex)].correctAnswer,
                    ).length
                  }{" "}
                  / {currentLesson.content.quizQuestions.length}
                </div>
                <Button onClick={handleNextLesson}>Continue to Next Lesson</Button>
              </div>
            )}
          </div>
        )

      case "code":
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Code Exercise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Expected Output: {currentLesson.content?.expectedOutput || "Complete the exercise"}
                </p>
                <Textarea
                  value={codeSubmission || currentLesson.content?.codeTemplate || ""}
                  onChange={(e) => setCodeSubmission(e.target.value)}
                  className="font-mono text-sm min-h-[300px]"
                  placeholder="Write your code here..."
                />
                <div className="flex gap-2 mt-4">
                  <Button 
                    onClick={handleCodeSubmit}
                    disabled={!codeSubmission.trim() || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Code"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setCodeSubmission(currentLesson.content?.codeTemplate || "")}
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">{currentLesson.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {currentLesson.description || "Lesson content will be available soon."}
                  </p>
                  <Button onClick={() => handleMarkComplete()}>
                    Mark as Complete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4" />
      case "quiz":
        return <HelpCircle className="h-4 w-4" />
      case "code":
        return <Code className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const isLessonCompleted = (lessonId: string) => {
    const progress = (userProgress || []).find(p => p.lessonId === lessonId)
    return progress?.completed || false
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/course/${params.id}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
              <h1 className="text-lg font-bold">{course.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">Progress: {Math.round(progressPercentage)}%</div>
              <Progress value={progressPercentage} className="w-32" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-80 border-r bg-muted/30 overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Course Content</h2>
            <div className="space-y-2">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson._id}
                  onClick={() => setCurrentLessonIndex(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    index === currentLessonIndex ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6">
                      {isLessonCompleted(lesson._id) ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        getLessonIcon(lesson.type)
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{lesson.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {lesson.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{currentLesson?.title}</h1>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {getLessonIcon(currentLesson?.type || "text")}
                      <span className="ml-1 capitalize">{currentLesson?.type}</span>
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Lesson {currentLessonIndex + 1} of {lessons.length}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePreviousLesson} disabled={currentLessonIndex === 0}>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleNextLesson}
                    disabled={currentLessonIndex === lessons.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {renderLessonContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}