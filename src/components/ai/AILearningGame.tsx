
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Brain, Trophy, Target, Zap } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

const AILearningGame = ({ subject }: { subject: string }) => {
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])

  // Sample questions - in a real app, these would come from an AI service
  const sampleQuestions: Question[] = [
    {
      id: 1,
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: 1,
      explanation: "2 + 2 = 4. This is basic addition."
    },
    {
      id: 2,
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Mercury", "Earth", "Mars"],
      correct: 1,
      explanation: "Mercury is the closest planet to the Sun in our solar system."
    },
    {
      id: 3,
      question: "What is the capital of Kenya?",
      options: ["Mombasa", "Kisumu", "Nairobi", "Nakuru"],
      correct: 2,
      explanation: "Nairobi is the capital and largest city of Kenya."
    }
  ]

  useEffect(() => {
    setQuestions(sampleQuestions)
  }, [subject])

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setGameCompleted(true)
      saveGameResults()
    }
  }

  const saveGameResults = async () => {
    if (!user?.id) return
    
    try {
      await supabase.from('ai_learning_sessions').insert({
        student_id: user.id,
        subject,
        difficulty_level: 'beginner',
        score: Math.round((score / questions.length) * 100),
        session_data: {
          totalQuestions: questions.length,
          correctAnswers: score,
          completedAt: new Date().toISOString()
        },
        completed_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to save game results:', error)
    }
  }

  const resetGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setGameCompleted(false)
  }

  if (gameCompleted) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Game Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <div className="text-4xl font-bold text-green-600">{percentage}%</div>
            <div className="text-lg">
              You scored {score} out of {questions.length} questions correctly!
            </div>
            <Badge variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "outline"}>
              {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good Job!" : "Keep Practicing!"}
            </Badge>
          </div>
          <Button onClick={resetGame} className="w-full">
            Play Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (questions.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-8">
          <Brain className="h-12 w-12 mx-auto mb-4 text-blue-500 animate-pulse" />
          <p>Loading AI Learning Game...</p>
        </CardContent>
      </Card>
    )
  }

  const question = questions[currentQuestion]

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            {subject} Quiz
          </CardTitle>
          <Badge variant="outline">
            {currentQuestion + 1} / {questions.length}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Score: {score}/{currentQuestion + (selectedAnswer !== null ? 1 : 0)}
            </span>
          </div>
          <Progress value={(currentQuestion / questions.length) * 100} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium">{question.question}</div>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant={
                selectedAnswer === null 
                  ? "outline" 
                  : index === question.correct 
                    ? "default" 
                    : selectedAnswer === index 
                      ? "destructive" 
                      : "outline"
              }
              className="w-full justify-start h-auto p-4"
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
            >
              <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
              {option}
              {selectedAnswer !== null && index === question.correct && (
                <Zap className="h-4 w-4 ml-auto text-green-600" />
              )}
            </Button>
          ))}
        </div>

        {showExplanation && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-medium text-blue-900 mb-2">Explanation:</div>
            <div className="text-blue-800">{question.explanation}</div>
          </div>
        )}

        {showExplanation && (
          <Button onClick={handleNextQuestion} className="w-full">
            {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Game"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default AILearningGame
