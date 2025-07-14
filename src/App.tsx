
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/StudentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import CourseDashboard from "./pages/CourseDashboard";
import TutorBrowsing from "./pages/TutorBrowsing";
import TutorProfile from "./pages/TutorProfile";
import LiveTutoring from "./pages/LiveTutoring";
import AILearning from "./pages/AILearning";
import AIStudyAssistantPage from "./pages/AIStudyAssistant";
import TutorAvailability from "./pages/TutorAvailability";
import Certification from "./pages/Certification";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import CourseCreation from "./pages/CourseCreation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/tutor-dashboard" element={<TutorDashboard />} />
            <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
            <Route path="/course-dashboard" element={<CourseDashboard />} />
            <Route path="/browse-tutors" element={<TutorBrowsing />} />
            <Route path="/tutor-profile/:tutorId" element={<TutorProfile />} />
            <Route path="/live-tutoring/:sessionId" element={<LiveTutoring />} />
            <Route path="/ai-learning" element={<AILearning />} />
            <Route path="/ai-study-assistant" element={<AIStudyAssistantPage />} />
            <Route path="/tutor-availability" element={<TutorAvailability />} />
            <Route path="/certification" element={<Certification />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/app/course-creation" element={<CourseCreation />} />
            <Route path="/app/dashboard" element={<StudentDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
