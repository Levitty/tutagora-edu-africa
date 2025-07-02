
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  MessageSquare, 
  Users, 
  Share2, 
  Settings,
  BookOpen,
  Send,
  Hand,
  FileText,
  Download
} from "lucide-react";

const LiveTutoring = () => {
  const { sessionId } = useParams();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Dr. Amina", message: "Welcome everyone! Let's start with today's lesson on quadratic equations.", time: "2:00 PM", type: "tutor" },
    { id: 2, user: "John", message: "Hello, can you hear me clearly?", time: "2:01 PM", type: "student" },
    { id: 3, user: "Dr. Amina", message: "Yes John, audio is clear! Let's begin.", time: "2:01 PM", type: "tutor" }
  ]);

  // Mock session data based on sessionId
  const getSessionData = (id: string) => {
    const sessions = {
      "demo-session": {
        title: "Demo Mathematics Session",
        tutor: "Dr. Amina Ochieng",
        subject: "Mathematics",
        topic: "Quadratic Equations",
        students: 1,
        maxStudents: 20,
        duration: "60 minutes",
        status: "live"
      },
      "math-101": {
        title: "KCSE Mathematics Prep",
        tutor: "Dr. Amina Ochieng",
        subject: "Mathematics", 
        topic: "Algebra Fundamentals",
        students: 15,
        maxStudents: 25,
        duration: "90 minutes",
        status: "live"
      }
    };
    return sessions[id as keyof typeof sessions] || sessions["demo-session"];
  };

  const sessionData = getSessionData(sessionId || "demo-session");

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        user: "You",
        message: chatMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "student" as const
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <BookOpen className="h-6 w-6 text-blue-400" />
              </Link>
              <div>
                <h1 className="text-white font-semibold">{sessionData.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-300">
                  <span>{sessionData.tutor}</span>
                  <span>•</span>
                  <span>{sessionData.topic}</span>
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    {sessionData.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-white border-gray-600">
                {sessionData.students}/{sessionData.maxStudents} students
              </Badge>
              <Button variant="outline" size="sm" className="text-white border-gray-600">
                <Users className="h-4 w-4 mr-2" />
                Participants
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-160px)]">
          {/* Main Video Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Video Display */}
            <Card className="bg-gray-800 border-gray-700 h-[60%]">
              <CardContent className="p-0 h-full relative">
                <div className="bg-gray-900 h-full rounded-lg flex items-center justify-center relative">
                  {/* Tutor Video (Main) */}
                  <div className="w-full h-full bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Avatar className="h-24 w-24 mx-auto mb-4">
                        <AvatarFallback className="text-2xl bg-blue-600">
                          {sessionData.tutor.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-semibold">{sessionData.tutor}</h3>
                      <p className="text-gray-300">Teaching {sessionData.topic}</p>
                    </div>
                  </div>

                  {/* Student Video (Picture-in-Picture) */}
                  <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Avatar className="h-12 w-12 mx-auto mb-2">
                        <AvatarFallback className="bg-green-600">You</AvatarFallback>
                      </Avatar>
                      <p className="text-sm">You</p>
                    </div>
                  </div>

                  {/* Connection Status */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-600 text-white">
                      Connected - HD Quality
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant={isVideoOn ? "default" : "destructive"}
                      size="sm"
                      onClick={() => setIsVideoOn(!isVideoOn)}
                    >
                      {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant={isAudioOn ? "default" : "destructive"}
                      size="sm"
                      onClick={() => setIsAudioOn(!isAudioOn)}
                    >
                      {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant={isHandRaised ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsHandRaised(!isHandRaised)}
                      className={isHandRaised ? "bg-yellow-600" : ""}
                    >
                      <Hand className="h-4 w-4 mr-2" />
                      {isHandRaised ? "Lower Hand" : "Raise Hand"}
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Screen
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button variant="destructive" size="sm">
                      Leave Session
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Whiteboard/Content Area */}
            <Card className="bg-gray-800 border-gray-700 h-[35%]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Interactive Whiteboard
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="bg-white rounded-lg h-[calc(100%-2rem)] flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <p className="text-lg font-semibold mb-2">Quadratic Equations: ax² + bx + c = 0</p>
                    <p>Interactive whiteboard content would appear here</p>
                    <p className="text-sm mt-2">Tutor can draw, write, and share diagrams in real-time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <div className="space-y-4">
            {/* Session Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Session Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Duration:</span>
                  <span className="text-white">{sessionData.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Students:</span>
                  <span className="text-white">{sessionData.students}</span>
                </div>
                <Button className="w-full mt-2" size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Materials
                </Button>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card className="bg-gray-800 border-gray-700 flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat ({chatMessages.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-[400px]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-medium ${
                          msg.type === 'tutor' ? 'text-blue-400' : 'text-green-400'
                        }`}>
                          {msg.user}
                        </span>
                        <span className="text-xs text-gray-400">{msg.time}</span>
                      </div>
                      <p className="text-white text-sm">{msg.message}</p>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-700">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                    <Button size="sm" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-white border-gray-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Open Notebook
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-white border-gray-600">
                  <Download className="h-4 w-4 mr-2" />
                  Save Session
                </Button>
                <Link to="/browse-tutors">
                  <Button variant="outline" size="sm" className="w-full justify-start text-white border-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Book Another
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTutoring;
