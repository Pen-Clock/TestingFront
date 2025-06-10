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

// Mock lesson data
const mockLessons = [
  {
    _id: "1",
    title: "Introduction to React",
    type: "video",
    content: { videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA" },
    completed: true,
  },
  {
    _id: "2",
    title: "JSX Fundamentals Quiz",
    type: "quiz",
    content: {
      quizQuestions: [
        {
          question: "What does JSX stand for?",
          options: ["JavaScript XML", "Java Syntax Extension", "JavaScript Extension", "Java XML"],
          correctAnswer: 0,
          explanation: "JSX stands for JavaScript XML, which allows you to write HTML-like syntax in JavaScript.",
        },
        {
          question: "Which of the following is valid JSX?",
          options: ["<div>Hello World</div>", "<div>Hello World", "div>Hello World</div>", "All of the above"],
          correctAnswer: 0,
          explanation: "JSX elements must be properly closed with matching opening and closing tags.",
        },
      ],
    },
    completed: false,
  },
  {
    _id: "3",
    title: "Build Your First Component",
    type: "code",
    content: {
      codeTemplate: `import React from 'react';

function Welcome(props) {
  // Your code here
  return (
    <div>
      
    </div>
  );
}

export default Welcome;`,
      codeLanguage: "javascript",
      expectedOutput: "A component that displays 'Hello, [name]!'",
    },
    completed: false,
  },
]

export default function LearnPage({ params }: { params: { id: string } }) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({})
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [codeSubmission, setCodeSubmission] = useState("")

  const currentLesson = mockLessons[currentLessonIndex]
  const completedLessons = mockLessons.filter((lesson) => lesson.completed).length
  const progressPercentage = (completedLessons / mockLessons.length) * 100

  const handleNextLesson = () => {
    if (currentLessonIndex < mockLessons.length - 1) {
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

  const handleQuizSubmit = () => {
    setShowQuizResults(true)
    // Mark lesson as completed
    mockLessons[currentLessonIndex].completed = true
  }

  const handleCodeSubmit = () => {
    // Submit code and mark lesson as completed
    mockLessons[currentLessonIndex].completed = true
    alert("Code submitted successfully!")
  }

  const renderLessonContent = () => {
    switch (currentLesson.type) {
      case "video":
        return (
          <div className="space-y-4">
            <div className="aspect-video">
              <iframe
                src={currentLesson.content.videoUrl}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title={currentLesson.title}
              />
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  mockLessons[currentLessonIndex].completed = true
                  handleNextLesson()
                }}
              >
                Mark as Complete
              </Button>
            </div>
          </div>
        )

      case "quiz":
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
                disabled={Object.keys(quizAnswers).length < currentLesson.content.quizQuestions.length}
                className="w-full"
              >
                Submit Quiz
              </Button>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-lg font-medium">
                  Score:{" "}
                  {
                    Object.entries(quizAnswers).filter(
                      ([qIndex, answer]) =>
                        answer === currentLesson.content.quizQuestions[Number.parseInt(qIndex)].correctAnswer,
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
                  Expected Output: {currentLesson.content.expectedOutput}
                </p>
                <Textarea
                  value={codeSubmission || currentLesson.content.codeTemplate}
                  onChange={(e) => setCodeSubmission(e.target.value)}
                  className="font-mono text-sm min-h-[300px]"
                  placeholder="Write your code here..."
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleCodeSubmit}>Submit Code</Button>
                  <Button variant="outline" onClick={() => setCodeSubmission(currentLesson.content.codeTemplate)}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return <div>Lesson content not available</div>
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
              <h1 className="text-lg font-bold">Complete React Development Course</h1>
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
              {mockLessons.map((lesson, index) => (
                <button
                  key={lesson._id}
                  onClick={() => setCurrentLessonIndex(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    index === currentLessonIndex ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6">
                      {lesson.completed ? (
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
                  <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {getLessonIcon(currentLesson.type)}
                      <span className="ml-1 capitalize">{currentLesson.type}</span>
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Lesson {currentLessonIndex + 1} of {mockLessons.length}
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
                    disabled={currentLessonIndex === mockLessons.length - 1}
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
