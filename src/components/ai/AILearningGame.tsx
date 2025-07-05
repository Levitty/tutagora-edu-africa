
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, XCircle, RotateCcw, Trophy, Clock } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

interface AILearningGameProps {
  subject: string;
}

const AILearningGame = ({ subject }: AILearningGameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [gameMode, setGameMode] = useState<'quiz' | 'challenge' | 'speed'>('quiz');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [streak, setStreak] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Subject-specific question banks
  const questionBanks = {
    Mathematics: [
      {
        id: 1,
        question: "What is the value of x in the equation 2x + 5 = 13?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
        explanation: "Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4",
        difficulty: 'easy' as const,
        topic: "Algebra"
      },
      {
        id: 2,
        question: "What is the derivative of x²?",
        options: ["x", "2x", "x²", "2x²"],
        correctAnswer: 1,
        explanation: "Using the power rule: d/dx(x²) = 2x¹ = 2x",
        difficulty: 'medium' as const,
        topic: "Calculus"
      },
      {
        id: 3,
        question: "What is the area of a circle with radius 5?",
        options: ["25π", "10π", "5π", "π"],
        correctAnswer: 0,
        explanation: "Area = πr² = π(5)² = 25π",
        difficulty: 'easy' as const,
        topic: "Geometry"
      }
    ],
    Physics: [
      {
        id: 1,
        question: "What is the unit of force?",
        options: ["Joule", "Newton", "Watt", "Pascal"],
        correctAnswer: 1,
        explanation: "Newton (N) is the SI unit of force, named after Isaac Newton",
        difficulty: 'easy' as const,
        topic: "Mechanics"
      },
      {
        id: 2,
        question: "What is the speed of light in vacuum?",
        options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "3 × 10⁹ m/s"],
        correctAnswer: 0,
        explanation: "The speed of light in vacuum is approximately 3 × 10⁸ meters per second",
        difficulty: 'medium' as const,
        topic: "Optics"
      }
    ],
    Chemistry: [
      {
        id: 1,
        question: "What is the chemical symbol for Gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: 2,
        explanation: "Au comes from the Latin word 'aurum' meaning gold",
        difficulty: 'easy' as const,
        topic: "Elements"
      },
      {
        id: 2,
        question: "What is the pH of pure water?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 1,
        explanation: "Pure water has a pH of 7, which is neutral",
        difficulty: 'easy' as const,
        topic: "Acids and Bases"
      }
    ],
    Biology: [
      {
        id: 1,
        question: "What is the powerhouse of the cell?",
        options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"],
        correctAnswer: 2,
        explanation: "Mitochondria produce ATP, the energy currency of cells",
        difficulty: 'easy' as const,
        topic: "Cell Biology"
      },
      {
        id: 2,
        question: "How many chambers does a human heart have?",
        options: ["2", "3", "4", "5"],
        correctAnswer: 2,
        explanation: "The human heart has 4 chambers: 2 atria and 2 ventricles",
        difficulty: 'easy' as const,
        topic: "Human Biology"
      }
    ],
    English: [
      {
        id: 1,
        question: "Which of these is a noun?",
        options: ["Run", "Beautiful", "Happiness", "Quickly"],
        correctAnswer: 2,
        explanation: "Happiness is a noun - it names a thing (an emotion or state)",
        difficulty: 'easy' as const,
        topic: "Grammar"
      },
      {
        id: 2,
        question: "What is a synonym for 'happy'?",
        options: ["Sad", "Joyful", "Angry", "Tired"],
        correctAnswer: 1,
        explanation: "Joyful means the same as happy - both express positive emotions",
        difficulty: 'easy' as const,
        topic: "Vocabulary"
      }
    ],
    History: [
      {
        id: 1,
        question: "In which year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correctAnswer: 1,
        explanation: "World War II ended in 1945 with the surrender of Japan",
        difficulty: 'easy' as const,
        topic: "World History"
      }
    ]
  };

  useEffect(() => {
    const subjectQuestions = questionBanks[subject as keyof typeof questionBanks] || questionBanks.Mathematics;
    setQuestions(subjectQuestions);
  }, [subject]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0 && gameMode === 'speed') {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameMode === 'speed') {
      handleAnswer(-1); // Auto-submit wrong answer
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, gameMode]);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    setIsActive(false);
    
    const correct = answerIndex === questions[currentQuestion].correctAnswer;
    
    if (correct) {
      setScore(score + (gameMode === 'speed' ? timeLeft * 10 : 100));
      setStreak(streak + 1);
      toast.success("Correct! Well done!");
    } else {
      setStreak(0);
      toast.error("Incorrect. Try again!");
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
      setTimeLeft(gameMode === 'speed' ? 30 : 0);
      setIsActive(gameMode === 'speed');
    } else {
      toast.success(`Game completed! Final score: ${score}`);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setIsActive(false);
  };

  const startGame = (mode: 'quiz' | 'challenge' | 'speed') => {
    setGameMode(mode);
    resetGame();
    if (mode === 'speed') {
      setIsActive(true);
      setTimeLeft(30);
    }
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p>Loading {subject} questions...</p>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Game Mode Selection */}
      {currentQuestion === 0 && !isActive && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Choose Your Game Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => startGame('quiz')}
              >
                <Brain className="h-6 w-6 mb-2" />
                <span>Quiz Mode</span>
                <small className="text-gray-500">Take your time</small>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => startGame('challenge')}
              >
                <Trophy className="h-6 w-6 mb-2" />
                <span>Challenge Mode</span>
                <small className="text-gray-500">Adaptive difficulty</small>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => startGame('speed')}
              >
                <Clock className="h-6 w-6 mb-2" />
                <span>Speed Mode</span>
                <small className="text-gray-500">30 seconds per question</small>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600">Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{streak}</div>
            <div className="text-sm text-gray-600">Streak</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{currentQuestion + 1}/{questions.length}</div>
            <div className="text-sm text-gray-600">Question</div>
          </CardContent>
        </Card>
        {gameMode === 'speed' && (
          <Card>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-orange-600'}`}>
                {timeLeft}s
              </div>
              <div className="text-sm text-gray-600">Time Left</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <Badge variant="secondary">{question.topic}</Badge>
            <Badge variant={question.difficulty === 'easy' ? 'default' : question.difficulty === 'medium' ? 'secondary' : 'destructive'}>
              {question.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-xl">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  showAnswer
                    ? index === question.correctAnswer
                      ? "default"
                      : selectedAnswer === index
                      ? "destructive"
                      : "outline"
                    : selectedAnswer === index
                    ? "secondary"
                    : "outline"
                }
                className="text-left justify-start h-auto p-4"
                onClick={() => !showAnswer && handleAnswer(index)}
                disabled={showAnswer}
              >
                <div className="flex items-center">
                  {showAnswer && index === question.correctAnswer && (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  )}
                  {showAnswer && selectedAnswer === index && index !== question.correctAnswer && (
                    <XCircle className="h-5 w-5 mr-2 text-red-600" />
                  )}
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </div>
              </Button>
            ))}
          </div>

          {showAnswer && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
              <p className="text-blue-800">{question.explanation}</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={resetGame}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart
            </Button>
            {showAnswer && (
              <Button onClick={nextQuestion}>
                {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Game"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AILearningGame;
