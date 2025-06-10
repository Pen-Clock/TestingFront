"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, Star, Clock, Users, Play, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data - replace with actual API calls
const mockCourses = [
  {
    _id: "1",
    title: "Complete React Development Course",
    description: "Master React from basics to advanced concepts with hands-on projects",
    instructorName: "John Doe",
    category: "Programming",
    difficulty: "intermediate",
    isPaid: true,
    price: 99.99,
    thumbnail: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    studentsCount: 1250,
    estimatedDuration: 480,
    tags: ["React", "JavaScript", "Frontend"],
  },
  {
    _id: "2",
    title: "Introduction to Python Programming",
    description: "Learn Python programming from scratch with practical examples",
    instructorName: "Jane Smith",
    category: "Programming",
    difficulty: "beginner",
    isPaid: false,
    price: 0,
    thumbnail: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
    studentsCount: 2100,
    estimatedDuration: 360,
    tags: ["Python", "Programming", "Beginner"],
  },
  {
    _id: "3",
    title: "Advanced Machine Learning",
    description: "Deep dive into machine learning algorithms and neural networks",
    instructorName: "Dr. Alex Johnson",
    category: "Data Science",
    difficulty: "advanced",
    isPaid: true,
    price: 149.99,
    thumbnail: "/placeholder.svg?height=200&width=300",
    rating: 4.9,
    studentsCount: 850,
    estimatedDuration: 720,
    tags: ["Machine Learning", "AI", "Python"],
  },
  {
    _id: "4",
    title: "Web Design Fundamentals",
    description: "Learn the basics of web design and user experience",
    instructorName: "Sarah Wilson",
    category: "Design",
    difficulty: "beginner",
    isPaid: false,
    price: 0,
    thumbnail: "/placeholder.svg?height=200&width=300",
    rating: 4.5,
    studentsCount: 1800,
    estimatedDuration: 240,
    tags: ["Design", "UX", "CSS"],
  },
]

const categories = ["All", "Programming", "Data Science", "Design", "Business", "Marketing"]
const difficulties = ["All", "beginner", "intermediate", "advanced"]

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || course.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">EduPlatform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Sign In</Button>
              <Button>Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Learn Without Limits</h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover thousands of courses from expert instructors. Start learning today with free and premium courses.
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <Input
                placeholder="What do you want to learn?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-black"
              />
              <Button variant="secondary">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filters:</span>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty === "All" ? "All Levels" : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">
              {filteredCourses.length} Course{filteredCourses.length !== 1 ? "s" : ""} Found
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {course.isPaid ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        ${course.price}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Free
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="outline" className="bg-white/90">
                      {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{course.instructorName}</p>
                </CardHeader>

                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.studentsCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{Math.floor(course.estimatedDuration / 60)}h</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {course.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <Link href={`/course/${course._id}`} className="w-full">
                    <Button className="w-full">
                      {course.isPaid ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Enroll Now
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Learning
                        </>
                      )}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
