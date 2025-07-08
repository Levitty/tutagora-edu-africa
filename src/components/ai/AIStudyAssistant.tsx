
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Brain, BookOpen, HelpCircle, Zap, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIStudyAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [difficulty, setDifficulty] = useState("medium");
  const [assistantType, setAssistantType] = useState("homework_help");
  const [isLoading, setIsLoading] = useState(false);

  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", 
    "English", "History", "Computer Science", "Economics"
  ];

  const difficulties = [
    { value: "easy", label: "Beginner" },
    { value: "medium", label: "Intermediate" },
    { value: "hard", label: "Advanced" }
  ];

  const assistantTypes = [
    { value: "homework_help", label: "Homework Help", icon: HelpCircle },
    { value: "explain_concept", label: "Explain Concepts", icon: BookOpen },
    { value: "generate_practice", label: "Practice Problems", icon: Zap },
    { value: "generate_quiz", label: "Quiz Generator", icon: Brain }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-study-assistant', {
        body: {
          type: assistantType,
          prompt: input,
          subject: subject,
          difficulty: difficulty
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setInput("");
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user';
    
    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[80%] p-4 rounded-lg ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <div className="whitespace-pre-wrap">{message.content}</div>
          <div className={`text-xs mt-2 ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            AI Study Assistant
          </CardTitle>
          <p className="text-gray-600">
            Get help with assignments, understand concepts, and generate practice problems
          </p>
        </CardHeader>
      </Card>

      {/* Assistant Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Choose Assistant Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {assistantTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.value}
                  variant={assistantType === type.value ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setAssistantType(type.value)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{type.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subj) => (
                    <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff.value} value={diff.value}>{diff.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Chat with AI Assistant</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">{subject}</Badge>
              <Badge variant="outline">{difficulties.find(d => d.value === difficulty)?.label}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Messages */}
          <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Start a conversation with your AI study assistant!</p>
                <p className="text-sm mt-2">Ask questions, request explanations, or generate practice problems.</p>
              </div>
            ) : (
              messages.map(renderMessage)
            )}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 text-gray-900 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your question or describe what you need help with..."
              className="flex-1 min-h-[80px]"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIStudyAssistant;
