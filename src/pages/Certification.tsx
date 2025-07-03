
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Award, Star, Download, Clock, Users, CheckCircle, Target, Trophy, Certificate } from "lucide-react";
import { Link } from "react-router-dom";

const Certification = () => {
  const certificationPrograms = [
    {
      id: 1,
      title: "KCSE Mathematics Mastery",
      description: "Comprehensive certification for KCSE Mathematics excellence",
      level: "Advanced",
      duration: "6 months",
      students: 234,
      rating: 4.9,
      price: "KSh 15,000",
      modules: 12,
      progress: 0,
      status: "available",
      badge: "🏆",
      skills: ["Algebra", "Geometry", "Calculus", "Statistics"]
    },
    {
      id: 2,
      title: "Digital Literacy Certification",
      description: "Essential digital skills for modern education",
      level: "Beginner",
      duration: "3 months",
      students: 567,
      rating: 4.8,
      price: "KSh 8,000",
      modules: 8,
      progress: 45,
      status: "in-progress",
      badge: "💻",
      skills: ["Computer Basics", "Internet Safety", "Office Applications", "Digital Communication"]
    },
    {
      id: 3,
      title: "English Language Proficiency",
      description: "Advanced English certification for academic success",
      level: "Intermediate",
      duration: "4 months",
      students: 189,
      rating: 4.7,
      price: "KSh 12,000",
      modules: 10,
      progress: 100,
      status: "completed",
      badge: "📚",
      skills: ["Grammar", "Writing", "Speaking", "Reading Comprehension"]
    }
  ];

  const earnedCertificates = [
    {
      id: 1,
      title: "Digital Literacy Fundamentals",
      issueDate: "Nov 15, 2024",
      validUntil: "Nov 15, 2026",
      credentialId: "TUT-DLF-2024-001",
      skills: ["Computer Basics", "Internet Safety"],
      badge: "💻"
    },
    {
      id: 2,
      title: "Physics Problem Solving",
      issueDate: "Oct 20, 2024",
      validUntil: "Oct 20, 2026",
      credentialId: "TUT-PPS-2024-002",
      skills: ["Mechanics", "Thermodynamics"],
      badge: "⚛️"
    }
  ];

  const skillBadges = [
    { name: "Quick Learner", description: "Complete courses 20% faster than average", icon: "⚡", earned: true },
    { name: "Practice Master", description: "Complete 100 practice exercises", icon: "🎯", earned: true },
    { name: "Consistency Champion", description: "Study for 30 consecutive days", icon: "🔥", earned: true },
    { name: "Help Seeker", description: "Ask 50 thoughtful questions", icon: "❓", earned: false },
    { name: "Peer Helper", description: "Help 10 fellow students", icon: "🤝", earned: false },
    { name: "Perfectionist", description: "Score 95%+ on 10 assessments", icon: "💯", earned: true }
  ];

  const upskillCourses = [
    {
      id: 1,
      title: "Python Programming for Beginners",
      provider: "External Partner",
      duration: "8 weeks",
      price: "KSh 20,000",
      rating: 4.8,
      students: 1200,
      certificate: true,
      category: "Technology"
    },
    {
      id: 2,
      title: "Business Communication Skills",
      provider: "TUTAGORA Business",
      duration: "4 weeks",
      price: "KSh 10,000",
      rating: 4.7,
      students: 850,
      certificate: true,
      category: "Business"
    },
    {
      id: 3,
      title: "Data Analysis with Excel",
      provider: "External Partner",
      duration: "6 weeks",
      price: "KSh 15,000",
      rating: 4.9,
      students: 650,
      certificate: true,
      category: "Technology"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TUTAGORA</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/course-dashboard" className="text-gray-700 hover:text-blue-600">Courses</Link>
              <Link to="/certification" className="text-blue-600 font-semibold">Certification</Link>
              <Link to="/ai-learning" className="text-gray-700 hover:text-blue-600">AI Learning</Link>
            </nav>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download Certificates
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Certification & Upskilling
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Earn recognized certificates, build valuable skills, and advance your career 
              with our comprehensive certification programs and upskilling courses.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">2</div>
                <div className="text-purple-100">Certificates Earned</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">1</div>
                <div className="text-blue-100">In Progress</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">4</div>
                <div className="text-green-100">Skill Badges</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">85%</div>
                <div className="text-orange-100">Completion Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Tabs defaultValue="programs" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="programs">Certification Programs</TabsTrigger>
            <TabsTrigger value="certificates">My Certificates</TabsTrigger>
            <TabsTrigger value="badges">Skill Badges</TabsTrigger>
            <TabsTrigger value="upskill">Upskilling Courses</TabsTrigger>
          </TabsList>

          {/* Certification Programs */}
          <TabsContent value="programs" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Certification Programs</h2>
              <p className="text-xl text-gray-600">Structured programs that lead to industry-recognized certificates</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificationPrograms.map((program) => (
                <Card key={program.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-4xl">{program.badge}</div>
                      <Badge variant={program.status === 'completed' ? 'default' : program.status === 'in-progress' ? 'secondary' : 'outline'}>
                        {program.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{program.title}</CardTitle>
                    <CardDescription>{program.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {program.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {program.students}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{program.level}</Badge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-semibold">{program.rating}</span>
                      </div>
                    </div>

                    {program.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{program.progress}%</span>
                        </div>
                        <Progress value={program.progress} className="h-2" />
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Skills you'll learn:</div>
                      <div className="flex flex-wrap gap-1">
                        {program.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-green-600">{program.price}</div>
                      <Button className={program.status === 'in-progress' ? 'bg-blue-600' : 'bg-purple-600'}>
                        {program.status === 'completed' ? 'View Certificate' : 
                         program.status === 'in-progress' ? 'Continue' : 'Enroll Now'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Certificates */}
          <TabsContent value="certificates" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">My Certificates</h2>
              <p className="text-xl text-gray-600">Your earned certificates and credentials</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {earnedCertificates.map((cert) => (
                <Card key={cert.id} className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-4xl">{cert.badge}</div>
                        <div>
                          <CardTitle className="text-xl">{cert.title}</CardTitle>
                          <CardDescription>Credential ID: {cert.credentialId}</CardDescription>
                        </div>
                      </div>
                      <Certificate className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Issued:</span>
                        <div className="text-gray-600">{cert.issueDate}</div>
                      </div>
                      <div>
                        <span className="font-medium">Valid Until:</span>
                        <div className="text-gray-600">{cert.validUntil}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="font-medium">Skills Validated:</div>
                      <div className="flex flex-wrap gap-1">
                        {cert.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Share Certificate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Skill Badges */}
          <TabsContent value="badges" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Skill Badges</h2>
              <p className="text-xl text-gray-600">Micro-credentials that showcase your achievements</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillBadges.map((badge, index) => (
                <Card key={index} className={`${badge.earned ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                  <CardContent className="p-6 text-center">
                    <div className={`text-4xl mb-3 ${badge.earned ? 'grayscale-0' : 'grayscale'}`}>
                      {badge.icon}
                    </div>
                    <h3 className={`font-bold text-lg mb-2 ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {badge.name}
                    </h3>
                    <p className={`text-sm ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                      {badge.description}
                    </p>
                    {badge.earned && (
                      <Badge className="mt-3 bg-green-500 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Earned
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Upskilling Courses */}
          <TabsContent value="upskill" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Upskilling Courses</h2>
              <p className="text-xl text-gray-600">Expand your skills with specialized courses from top providers</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upskillCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{course.category}</Badge>
                      {course.certificate && (
                        <Badge className="bg-yellow-500 text-white">
                          <Award className="h-3 w-3 mr-1" />
                          Certificate
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <CardDescription>by {course.provider}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.students} enrolled
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-semibold">{course.rating}</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{course.price}</div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Enroll Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Certification;
