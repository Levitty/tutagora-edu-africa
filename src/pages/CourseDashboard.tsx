
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Filter, Play, Download, Award, Clock, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";

const CourseDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Courses" },
    { id: "kcse", name: "KCSE Prep" },
    { id: "jamb", name: "JAMB Prep" },
    { id: "university", name: "University" },
    { id: "skills", name: "Skills" }
  ];

  const courses = [
    {
      id: 1,
      title: "KCSE Mathematics Complete Prep",
      description: "Comprehensive mathematics preparation for KCSE examinations covering all topics",
      tutor: "Dr. Amina Ochieng",
      category: "kcse",
      level: "Secondary",
      students: 245,
      rating: 4.8,
      price: "KSh 2,500",
      duration: "24 hours",
      lessons: 32,
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=400&auto=format&fit=crop",
      downloadable: true,
      examPrep: true
    },
    {
      id: 2,
      title: "Physics for JAMB Success",
      description: "Master physics concepts for JAMB with practical examples and problem-solving techniques",
      tutor: "Prof. Kwame Asante",
      category: "jamb",
      level: "Pre-University",
      students: 189,
      rating: 4.9,
      price: "KSh 3,000",
      duration: "20 hours",
      lessons: 28,
      thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=400&auto=format&fit=crop",
      downloadable: true,
      examPrep: true
    },
    {
      id: 3,
      title: "Web Development Bootcamp",
      description: "Learn HTML, CSS, JavaScript, and React to build modern web applications",
      tutor: "Sarah Tech",
      category: "skills",
      level: "Beginner",
      students: 156,
      rating: 4.7,
      price: "KSh 5,000",
      duration: "40 hours",
      lessons: 45,
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&auto=format&fit=crop",
      downloadable: false,
      examPrep: false
    },
    {
      id: 4,
      title: "Advanced Chemistry for University",
      description: "University-level chemistry covering organic, inorganic, and physical chemistry",
      tutor: "Dr. Fatima Ibrahim",
      category: "university",
      level: "Advanced",
      students: 98,
      rating: 4.6,
      price: "KSh 4,500",
      duration: "35 hours",
      lessons: 38,
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop",
      downloadable: true,
      examPrep: false
    },
    {
      id: 5,
      title: "English Literature KCSE Mastery",
      description: "Complete guide to KCSE English literature with analysis of set books and poetry",
      tutor: "Ms. Grace Wanjiku",
      category: "kcse",
      level: "Secondary",
      students: 167,
      rating: 4.5,
      price: "KSh 2,000",
      duration: "18 hours",
      lessons: 24,
      thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=400&auto=format&fit=crop",
      downloadable: true,
      examPrep: true
    },
    {
      id: 6,
      title: "Digital Marketing Fundamentals",
      description: "Learn social media marketing, SEO, and digital advertising for African businesses",
      tutor: "John Digital",
      category: "skills",
      level: "Intermediate",
      students: 134,
      rating: 4.4,
      price: "KSh 3,500",
      duration: "25 hours",
      lessons: 30,
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop",
      downloadable: false,
      examPrep: false
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.tutor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownloadMaterials = (courseId: number) => {
    console.log(`Downloading materials for course ${courseId}`);
    // Mock download functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Course Dashboard</h1>
                <p className="text-gray-600">Explore our comprehensive course catalog</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/student-dashboard">
                <Button variant="outline" size="sm">Student View</Button>
              </Link>
              <Link to="/tutor-dashboard">
                <Button variant="outline" size="sm">Tutor View</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses, tutors, or subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{filteredCourses.length}</div>
              <p className="text-sm text-gray-600">Available Courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">1,200+</div>
              <p className="text-sm text-gray-600">Active Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">85%</div>
              <p className="text-sm text-gray-600">Pass Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">4.7</div>
              <p className="text-sm text-gray-600">Avg Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  {course.examPrep && (
                    <Badge variant="secondary">Exam Prep</Badge>
                  )}
                  {course.downloadable && (
                    <Badge variant="outline">Offline</Badge>
                  )}
                </div>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">by {course.tutor}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students} students
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{course.lessons} lessons</span>
                    <span className="font-semibold text-blue-600">{course.price}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Start Course
                    </Button>
                    {course.downloadable && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadMaterials(course.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Exam Prep Section */}
        <section className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-6 w-6 mr-2 text-orange-500" />
                Exam Preparation Materials
              </CardTitle>
              <CardDescription>
                Download offline study materials for major African examinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">KCSE Study Pack</h3>
                  <p className="text-sm text-gray-600 mb-3">Complete study materials for all KCSE subjects</p>
                  <Button size="sm" onClick={() => handleDownloadMaterials(101)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download (45 MB)
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">JAMB Question Bank</h3>
                  <p className="text-sm text-gray-600 mb-3">Past questions and practice tests for JAMB</p>
                  <Button size="sm" onClick={() => handleDownloadMaterials(102)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download (32 MB)
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">University Prep Kit</h3>
                  <p className="text-sm text-gray-600 mb-3">Essential materials for university entrance</p>
                  <Button size="sm" onClick={() => handleDownloadMaterials(103)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download (28 MB)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default CourseDashboard;
