"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, Clock, Trophy, TrendingUp, Play, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "convex/react"
import { api } from "../../_generated/api"

// Define types
interface EnrolledCourse {
  _id: string;
  title: string;
  thumbnail?: string;
  progress?: number;
  totalLessons?: number;
  completedLessons?: number;
  lastAccessed?: string;
  nextLesson?: string;
}

interface UserStats {
  totalCoursesEnrolled: number;
  totalLessonsCompleted: number;
  totalTimeSpent: number;
  currentStreak: number;
}

interface Achievement {
  title: string;
  description: string;
  earned: boolean;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // GET REAL DATA FROM CONVEX BACKEND
  const enrolledCourses = useQuery(api.courses.getUserEnrolledCourses, {}) as EnrolledCourse[] | undefined
  const userProgress = useQuery(api.progress.getUserProgress, {}) as any[] | undefined
  const userStats = useQuery(api.users.getUserStats, {}) as UserStats | undefined

  // Default stats if not loaded
  const stats: UserStats = userStats || {
    totalCoursesEnrolled: 0,
    totalLessonsCompleted: 0,
    totalTimeSpent: 0,
    currentStreak: 0
  }

  // CALCULATE ACHIEVEMENTS
  const achievements: Achievement[] = [
    { 
      title: "First Course Completed", 
      description: "Completed your first course", 
      earned: (enrolledCourses || []).some(course => (course.progress || 0) >= 100)
    },
    { 
      title: "Quick Learner", 
      description: "Completed 5 lessons in one day", 
      earned: stats.totalLessonsCompleted >= 5
    },
    { 
      title: "Consistent Learner", 
      description: "Learned for 7 days straight", 
      earned: stats.currentStreak >= 7
    },
    { 
      title: "Code Master", 
      description: "Completed 10 coding exercises", 
      earned: stats.totalLessonsCompleted >= 10
    },
  ]

  // LOADING STATE
  if (enrolledCourses === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <h1 className="text-2xl font-bold">EduPlatform</h1>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Browse Courses
                </Link>
                <Link href="/dashboard" className="font-medium">
                  Dashboard
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Profile</Button>
              <Button variant="outline">Sign Out</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCoursesEnrolled}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLessonsCompleted}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(stats.totalTimeSpent / 60)}h</div>
              <p className="text-xs text-muted-foreground">{stats.totalTimeSpent % 60}m total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentStreak}</div>
              <p className="text-xs text-muted-foreground">days</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Continue Learning Section */}
            <div>
              <h2 className="text-xl font-bold mb-4">Continue Learning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses
                  .filter((course) => (course.progress || 0) < 100)
                  .slice(0, 3)
                  .map((course) => (
                    <Card key={course._id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={course.thumbnail || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Continue
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{course.progress || 0}%</span>
                          </div>
                          <Progress value={course.progress || 0} />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>
                              {course.completedLessons || 0}/{course.totalLessons || 0} lessons
                            </span>
                            <span>{course.lastAccessed || "Never"}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Next: {course.nextLesson || "Start learning"}</p>
                        </div>
                        <Link href={`/course/${course._id}/learn`}>
                          <Button className="w-full mt-4">Continue Learning</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              {enrolledCourses.filter(course => (course.progress || 0) < 100).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No courses in progress. <Link href="/" className="text-primary hover:underline">Browse courses</Link> to get started!</p>
                </div>
              )}
            </div>

            {/* Recent Achievements */}
            <div>
              <h2 className="text-xl font-bold mb-4">Recent Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements
                  .filter((achievement) => achievement.earned)
                  .map((achievement, index) => (
                    <Card key={index}>
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                          <Trophy className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              {achievements.filter(achievement => achievement.earned).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No achievements yet. Keep learning to unlock your first achievement!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">My Courses</h2>
              <Link href="/">
                <Button variant="outline">Browse More Courses</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <Card key={course._id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {(course.progress || 0) >= 100 ? (
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      ) : (
                        <Badge variant="secondary">{course.progress || 0}% Complete</Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{course.title}</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{course.progress || 0}%</span>
                        </div>
                        <Progress value={course.progress || 0} />
                      </div>

                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          {course.completedLessons || 0}/{course.totalLessons || 0} lessons
                        </span>
                        <span>{course.lastAccessed || "Never"}</span>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/course/${course._id}/learn`} className="flex-1">
                          <Button className="w-full" size="sm">
                            {(course.progress || 0) >= 100 ? "Review" : "Continue"}
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Link href={`/course/${course._id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Download Certificate</DropdownMenuItem>
                            <DropdownMenuItem>Leave Review</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {enrolledCourses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>You haven't enrolled in any courses yet. <Link href="/" className="text-primary hover:underline">Browse courses</Link> to get started!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <h2 className="text-xl font-bold">Achievements</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className={achievement.earned ? "border-yellow-200" : "opacity-60"}>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        achievement.earned ? "bg-yellow-100 text-yellow-600" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Trophy className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{achievement.title}</h3>
                      <p className="text-muted-foreground">{achievement.description}</p>
                      {achievement.earned && <Badge className="mt-2 bg-green-100 text-green-800">Earned</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}