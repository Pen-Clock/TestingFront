"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Play, Lock, Star, Clock, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data - replace with actual API calls
const mockCourse = {
  _id: "1",
  title: "Complete React Development Course",
  description:
    "Master React from basics to advanced concepts with hands-on projects. This comprehensive course covers everything from React fundamentals to advanced patterns, state management, and modern development practices.",
  instructorName: "John Doe",
  instructorBio: "Senior Frontend Developer with 8+ years of experience",
  category: "Programming",
  difficulty: "intermediate",
  isPaid: true,
  price: 99.99,
  thumbnail: "/placeholder.svg?height=300&width=500",
  rating: 4.8,
  studentsCount: 1250,
  estimatedDuration: 480,
  tags: ["React", "JavaScript", "Frontend"],
  isEnrolled: false,
  progress: 0,
}

const mockLessons = [
  {
    _id: "1",
    title: "Introduction to React",
    description: "Learn what React is and why it's popular",
    type: "video",
    duration: 15,
    isPreview: true,
    completed: false,
    order: 1,
  },
  {
    _id: "2",
    title: "Setting up Development Environment",
    description: "Install Node.js, npm, and create your first React app",
    type: "video",
    duration: 20,
    isPreview: false,
    completed: false,
    order: 2,
  },
  {
    _id: "3",
    title: "JSX Fundamentals Quiz",
    description: "Test your understanding of JSX syntax",
    type: "quiz",
    duration: 10,
    isPreview: false,
    completed: false,
    order: 3,
  },
  {
    _id: "4",
    title: "Build Your First Component",
    description: "Create a React component from scratch",
    type: "code",
    duration: 30,
    isPreview: false,
    completed: false,
    order: 4,
  },
  {
    _id: "5",
    title: "Props and State",
    description: "Understanding component props and state management",
    type: "video",
    duration: 25,
    isPreview: false,
    completed: false,
    order: 5,
  },
]

const mockReviews = [
  {
    _id: "1",
    userName: "Alice Johnson",
    rating: 5,
    comment: "Excellent course! Very well structured and easy to follow.",
    createdAt: Date.now() - 86400000,
  },
  {
    _id: "2",
    userName: "Bob Smith",
    rating: 4,
    comment: "Great content, but could use more practical exercises.",
    createdAt: Date.now() - 172800000,
  },
]

export default function CoursePage({ params }: { params: { id: string } }) {
  const [isEnrolled, setIsEnrolled] = useState(mockCourse.isEnrolled)

  const handleEnroll = () => {
    // Call API to enroll user
    setIsEnrolled(true)
  }

  const completedLessons = mockLessons.filter((lesson) => lesson.completed).length
  const progressPercentage = (completedLessons / mockLessons.length) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
            <h1 className="text-xl font-bold">EduPlatform</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{mockCourse.category}</Badge>
                <Badge variant="outline">
                  {mockCourse.difficulty.charAt(0).toUpperCase() + mockCourse.difficulty.slice(1)}
                </Badge>
                {mockCourse.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl font-bold mb-4">{mockCourse.title}</h1>

              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{mockCourse.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{mockCourse.studentsCount.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{Math.floor(mockCourse.estimatedDuration / 60)} hours</span>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{mockCourse.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-muted-foreground">Instructor:</span>
                <div>
                  <p className="font-medium">{mockCourse.instructorName}</p>
                  <p className="text-sm text-muted-foreground">{mockCourse.instructorBio}</p>
                </div>
              </div>
            </div>

            {/* Course Content Tabs */}
            <Tabs defaultValue="curriculum" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum" className="space-y-4">
                <div className="space-y-2">
                  {mockLessons.map((lesson, index) => (
                    <Card key={lesson._id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{lesson.title}</h4>
                            <p className="text-sm text-muted-foreground">{lesson.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {lesson.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{lesson.duration}min</span>
                          {lesson.isPreview || isEnrolled ? (
                            <Button size="sm" variant="ghost">
                              <Play className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                          {lesson.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {mockReviews.map((review) => (
                  <Card key={review._id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {review.userName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{review.userName}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="instructor">
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
                      {mockCourse.instructorName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{mockCourse.instructorName}</h3>
                      <p className="text-muted-foreground mb-4">{mockCourse.instructorBio}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>5 Courses</span>
                        <span>12,500 Students</span>
                        <span>4.8 Rating</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Preview */}
            <Card>
              <div className="relative">
                <img
                  src={mockCourse.thumbnail || "/placeholder.svg"}
                  alt={mockCourse.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="lg" className="rounded-full">
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="text-center mb-4">
                  {mockCourse.isPaid ? (
                    <div>
                      <span className="text-3xl font-bold">${mockCourse.price}</span>
                      <p className="text-sm text-muted-foreground">One-time payment</p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold text-green-600">Free</span>
                      <p className="text-sm text-muted-foreground">No payment required</p>
                    </div>
                  )}
                </div>

                {isEnrolled ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <Progress value={progressPercentage} />
                    </div>
                    <Link href={`/course/${mockCourse._id}/learn`}>
                      <Button className="w-full">Continue Learning</Button>
                    </Link>
                  </div>
                ) : (
                  <Button className="w-full" onClick={handleEnroll}>
                    {mockCourse.isPaid ? "Enroll Now" : "Start Learning"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle>Course Includes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{Math.floor(mockCourse.estimatedDuration / 60)} hours of content</span>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  <span className="text-sm">{mockLessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Certificate of completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Lifetime access</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
