"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Play, Lock, Star, Clock, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../_generated/api"
import { Id } from "../../../_generated/dataModel"

// Define types
interface Course {
  _id: string;
  title: string;
  description: string;
  instructorName?: string;
  instructorBio?: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  isPaid: boolean;
  price?: number;
  thumbnail?: string;
  rating?: number;
  studentsCount?: number;
  estimatedDuration: number;
  tags?: string[];
}

interface Lesson {
  _id: string;
  title: string;
  description?: string;
  type: "video" | "quiz" | "code" | "text";
  duration?: number;
  isPreview: boolean;
  completed?: boolean;
  order: number;
}

interface Review {
  _id: string;
  userName?: string;
  rating: number;
  comment: string;
  createdAt?: number;
}

interface UserEnrollment {
  _id: string;
  courseId: string;
  userId: string;
  progress?: number;
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const courseId = params.id as Id<"courses">
  
  // GET REAL DATA FROM CONVEX BACKEND
  const course = useQuery(api.courses.getCourse, { courseId }) as Course | undefined
  const lessons = useQuery(api.lessons.getLessons, { courseId }) as Lesson[] | undefined
  const reviews = useQuery(api.reviews.getCourseReviews, { courseId }) as Review[] | undefined
  const userEnrollment = useQuery(api.courses.getUserEnrollment, { courseId }) as UserEnrollment | undefined
  
  // MUTATIONS
  const enrollInCourse = useMutation(api.courses.enrollInCourse)
  
  const [isEnrolling, setIsEnrolling] = useState(false)

  const handleEnroll = async () => {
    if (!course) return
    
    setIsEnrolling(true)
    try {
      await enrollInCourse({ courseId })
    } catch (error) {
      console.error("Enrollment failed:", error)
      alert("Enrollment failed. Please try again.")
    } finally {
      setIsEnrolling(false)
    }
  }

  // LOADING STATES
  if (course === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  // CALCULATE PROGRESS
  const completedLessons = (lessons || []).filter((lesson) => lesson.completed).length
  const totalLessons = (lessons || []).length
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
  const isEnrolled = !!userEnrollment

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
                <Badge variant="outline">{course.category}</Badge>
                <Badge variant="outline">
                  {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                </Badge>
                {(course.tags || []).map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{(course.studentsCount || 0).toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{Math.floor(course.estimatedDuration / 60)} hours</span>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{course.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-muted-foreground">Instructor:</span>
                <div>
                  <p className="font-medium">{course.instructorName || "Unknown Instructor"}</p>
                  <p className="text-sm text-muted-foreground">{course.instructorBio || "No bio available"}</p>
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
                  {lessons === undefined ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading lessons...</p>
                    </div>
                  ) : lessons.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No lessons available yet.
                    </div>
                  ) : (
                    lessons.map((lesson, index) => (
                      <Card key={lesson._id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium">{lesson.title}</h4>
                              <p className="text-sm text-muted-foreground">{lesson.description || "No description"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {lesson.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{lesson.duration || 0}min</span>
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
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {reviews === undefined ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading reviews...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No reviews yet. Be the first to review this course!
                  </div>
                ) : (
                  reviews.map((review) => (
                    <Card key={review._id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          {(review.userName || "U").charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{review.userName || "Anonymous"}</span>
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
                              {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                            </span>
                          </div>
                          <p className="text-sm">{review.comment}</p>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="instructor">
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
                      {(course.instructorName || "I").charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{course.instructorName || "Unknown Instructor"}</h3>
                      <p className="text-muted-foreground mb-4">{course.instructorBio || "No bio available"}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Instructor</span>
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
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
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
                  {course.isPaid ? (
                    <div>
                      <span className="text-3xl font-bold">${course.price || 0}</span>
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
                    <Link href={`/course/${course._id}/learn`}>
                      <Button className="w-full">Continue Learning</Button>
                    </Link>
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                  >
                    {isEnrolling 
                      ? "Enrolling..." 
                      : course.isPaid 
                        ? "Enroll Now" 
                        : "Start Learning"
                    }
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
                  <span className="text-sm">{Math.floor(course.estimatedDuration / 60)} hours of content</span>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  <span className="text-sm">{totalLessons} lessons</span>
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