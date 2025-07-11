
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calendar, Clock, Video, Award, User, Target, TrendingUp, PlayCircle } from "lucide-react";

export const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const upcomingClasses = [
    { id: 1, subject: "Mathematics", tutor: "Dr. Amina Ochieng", time: "2:00 PM", date: "Today", type: "1-on-1" },
    { id: 2, subject: "Physics", tutor: "Prof. Kwame Asante", time: "4:00 PM", date: "Tomorrow", type: "Group" },
    { id: 3, subject: "Chemistry", tutor: "Dr. Fatima Ibrahim", time: "10:00 AM", date: "Wednesday", type: "1-on-1" }
  ];

  const courses = [
    { id: 1, title: "KCSE Mathematics Prep", progress: 75, lessons: 24, completed: 18, tutor: "Dr. Amina", nextLesson: "Calculus Basics" },
    { id: 2, title: "Physics for JAMB", progress: 45, lessons: 32, completed: 14, tutor: "Prof. Kwame", nextLesson: "Wave Motion" },
    { id: 3, title: "Web Development", progress: 90, lessons: 20, completed: 18, tutor: "John Doe", nextLesson: "React Hooks" }
  ];

  const learningStats = {
    totalHours: 48,
    coursesEnrolled: 12,
    averageScore: 85,
    streak: 7,
    certificatesEarned: 3,
    studyGoalProgress: 78
  };

  const recentAchievements = [
    { title: "Mathematics Quiz Master", description: "Scored 95% in Advanced Algebra", date: "2 days ago", icon: "🏆" },
    { title: "Consistent Learner", description: "Maintained 7-day study streak", date: "Today", icon: "🔥" },
    { title: "Physics Explorer", description: "Completed Mechanics module", date: "1 week ago", icon: "🚀" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, John!</h1>
                <p className="text-gray-600">Ready to continue your learning journey?</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Target className="h-3 w-3 mr-1" />
                {learningStats.studyGoalProgress}% Goal Complete
              </Badge>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Learning Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{learningStats.coursesEnrolled}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{learningStats.totalHours}h</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{learningStats.averageScore}%</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{learningStats.streak}d 🔥</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{learningStats.certificatesEarned}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{learningStats.studyGoalProgress}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Upcoming Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-600 p-2 rounded-lg">
                        <BookOpen className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{cls.subject}</h3>
                        <p className="text-gray-600 text-sm">{cls.tutor} • {cls.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{cls.time}</p>
                      <p className="text-gray-600 text-sm">{cls.date}</p>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Video className="h-4 w-4 mr-2" />
                      Join
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Course Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Your Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {courses.map((course) => (
                  <div key={course.id} className="space-y-3 p-4 border border-gray-100 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-600">with {course.tutor}</p>
                        <p className="text-xs text-blue-600 mt-1">Next: {course.nextLesson}</p>
                      </div>
                      <Badge variant="secondary">
                        {course.completed}/{course.lessons} lessons
                      </Badge>
                    </div>
                    <Progress value={course.progress} className="h-3" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{course.progress}% complete</span>
                      <Button variant="outline" size="sm">
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Continue
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-600" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{achievement.title}</h4>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Study Timer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-indigo-600" />
                  Study Timer
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-4xl font-bold text-indigo-600">25:00</div>
                <p className="text-gray-600">Pomodoro Session</p>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Study Session
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Courses
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Class
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  View Certificates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
