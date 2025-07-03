
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Brain, Gamepad2, Trophy, Zap, Target, Star, Play, ArrowRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const AILearning = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [xp, setXp] = useState(350);
  const [streak, setStreak] = useState(7);

  const gamifiedCourses = [
    {
      id: 1,
      title: "Math Quest: Algebra Adventure",
      description: "Embark on an epic journey through algebraic equations",
      level: "Beginner",
      xp: 1200,
      badges: 5,
      completion: 65,
      icon: "🧙‍♂️",
      color: "from-purple-500 to-blue-500"
    },
    {
      id: 2,
      title: "Science Lab: Chemistry Wizardry",
      description: "Mix potions and discover the magic of chemistry",
      level: "Intermediate",
      xp: 800,
      badges: 3,
      completion: 40,
      icon: "⚗️",
      color: "from-green-500 to-teal-500"
    },
    {
      id: 3,
      title: "Language Arena: English Mastery",
      description: "Battle grammar monsters and unlock word power",
      level: "Advanced",
      xp: 2000,
      badges: 8,
      completion: 80,
      icon: "📚",
      color: "from-orange-500 to-red-500"
    }
  ];

  const achievements = [
    { name: "Quick Learner", description: "Complete 5 lessons in a day", icon: "⚡", unlocked: true },
    { name: "Streak Master", description: "Maintain 7-day learning streak", icon: "🔥", unlocked: true },
    { name: "Quiz Champion", description: "Score 100% on 10 quizzes", icon: "🏆", unlocked: false },
    { name: "Night Owl", description: "Study after 10 PM", icon: "🦉", unlocked: true },
  ];

  const aiFeatures = [
    {
      title: "Adaptive Learning Path",
      description: "AI adjusts difficulty based on your performance",
      icon: <Brain className="h-8 w-8 text-purple-600" />
    },
    {
      title: "Personalized Challenges",
      description: "Custom quests tailored to your learning style",
      icon: <Target className="h-8 w-8 text-blue-600" />
    },
    {
      title: "Smart Recommendations",
      description: "AI suggests content based on your interests",
      icon: <Zap className="h-8 w-8 text-yellow-600" />
    },
    {
      title: "Performance Analytics",
      description: "Detailed insights into your learning patterns",
      icon: <Trophy className="h-8 w-8 text-green-600" />
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
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Level {currentLevel}
              </Badge>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                {streak} Day Streak 🔥
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                The Future of Learning
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience education like never before with AI-powered gamification, 
              personalized learning paths, and immersive challenges that make studying addictive.
            </p>
          </div>

          {/* Player Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold">{xp}</div>
                <div className="text-purple-100">Total XP</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold">{currentLevel}</div>
                <div className="text-blue-100">Current Level</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold">12</div>
                <div className="text-green-100">Badges Earned</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold">{streak}</div>
                <div className="text-orange-100">Day Streak</div>
              </CardContent>
            </Card>
          </div>

          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg">
            <Play className="mr-2 h-5 w-5" />
            Start Your Quest
          </Button>
        </div>
      </section>

      {/* Gamified Courses */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Adventure</h2>
            <p className="text-xl text-gray-600">Pick a quest and start your learning journey</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {gamifiedCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
                <div className={`h-4 bg-gradient-to-r ${course.color}`}></div>
                <CardHeader className="text-center pb-4">
                  <div className="text-6xl mb-4">{course.icon}</div>
                  <CardTitle className="text-xl font-bold">{course.title}</CardTitle>
                  <CardDescription className="text-gray-600">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{course.level}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-semibold">{course.xp} XP</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.completion}%</span>
                    </div>
                    <Progress value={course.completion} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{course.badges} badges</span>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                      Continue Quest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered by Advanced AI</h2>
            <p className="text-xl text-gray-600">Intelligent features that adapt to your learning style</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Achievements</h2>
            <p className="text-xl text-gray-600">Unlock badges and showcase your progress</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className={`${achievement.unlocked ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className={`text-4xl ${achievement.unlocked ? 'grayscale-0' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-sm ${achievement.unlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <Badge className="bg-yellow-500 text-white">Unlocked!</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Challenge */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Gift className="h-16 w-16 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Daily Challenge</h2>
            <p className="text-xl text-green-100">Complete today's challenge and earn bonus XP!</p>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Math Lightning Round</h3>
              <p className="mb-6">Solve 10 algebra problems in under 5 minutes</p>
              <div className="flex justify-center items-center space-x-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">+500</div>
                  <div className="text-sm text-green-200">XP Reward</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">🏆</div>
                  <div className="text-sm text-green-200">Special Badge</div>
                </div>
              </div>
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Accept Challenge
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AILearning;
