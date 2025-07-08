
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, XCircle, RotateCcw, Trophy, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface EnhancedAILearningGameProps {
  subject: string;
}

const EnhancedAILearningGame = ({ subject }: EnhancedAILearningGameProps) => {
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAIGenerated, setIsAIGenerated] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0 && gameMode === 'speed') {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameMode === 'speed') {
      handleAnswer(-1);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, gameMode]);

  const generateAIQuestions = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-study-assistant', {
        body: {
          type: 'generate_quiz',
          prompt: `Generate educational quiz questions for ${subject}`,
          subject: subject,
          difficulty: difficulty
        }
      });

      if (error) throw error;

      // Parse the JSON response from OpenAI
      const content = data.content;
      let parsedQuestions;
      
      try {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedQuestions = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        toast.error('Failed to generate AI questions. Using fallback questions.');
        return;
      }

      if (parsedQuestions && parsedQuestions.questions) {
        setQuestions(parsedQuestions.questions);
        setIsAIGenerated(true);
        toast.success('AI-generated questions loaded!');
      }
    } catch (error) {
      console.error('Error generating AI questions:', error);
      toast.error('Failed to generate AI questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    setIsActive(false);
    
    const correct = answerIndex === questions[currentQuestion].correct;
    
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
        <CardContent className="p-8 text-center space-y-6">
          <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <div>
            <h3 className="text-xl font-semibold mb-2">Ready to start learning?</h3>
            <p className="text-gray-600 mb-6">
              Generate AI-powered questions tailored to your level, or use our curated question bank.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 mb-4">
              <label className="text-sm font-medium">Difficulty:</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="px-3 py-1 border rounded-md"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={generateAIQuestions}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate AI Questions
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  // Use fallback questions for demo
                  setQuestions([
                    {
                      question: `What is a key concept in ${subject}?`,
                      options: ["Option A", "Option B", "Option C", "Option D"],
                      correct: 0,
                      explanation: "This is a sample question for demonstration."
                    }
                  ]);
                  setIsAIGenerated(false);
                }}
              >
                Use Sample Questions
              </Button>
            </div>
          </div>
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
            <CardTitle className="text-center flex items-center justify-center gap-2">
              Choose Your Game Mode
              {isAIGenerated && (
                <Badge variant="secondary" className="ml-2">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Generated
                </Badge>
              )}
            </CardTitle>
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
            <Badge variant="secondary">{subject}</Badge>
            <div className="flex gap-2">
              <Badge variant={difficulty === 'easy' ? 'default' : difficulty === 'medium' ? 'secondary' : 'destructive'}>
                {difficulty}
              </Badge>
              {isAIGenerated && (
                <Badge variant="outline">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI
                </Badge>
              )}
            </div>
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
                    ? index === question.correct
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
                  {showAnswer && index === question.correct && (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  )}
                  {showAnswer && selectedAnswer === index && index !== question.correct && (
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

export default EnhancedAILearningGame;
