
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, User, GraduationCap, Shield, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"student" | "tutor" | "admin" | "parent">("student");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const userTypes = [
    {
      type: "parent" as const,
      title: "Parent",
      description: "Access your child's learning progress",
      icon: Heart,
      gradient: "bg-gradient-to-br from-pink-400 via-pink-500 to-rose-500",
      hoverGradient: "hover:from-pink-500 hover:via-pink-600 hover:to-rose-600",
      iconColor: "text-pink-100",
      borderColor: "border-pink-300 hover:border-pink-400",
      shadowColor: "hover:shadow-pink-200",
      textColor: "text-pink-50"
    },
    {
      type: "student" as const,
      title: "Student",
      description: "Continue your learning journey",
      icon: User,
      gradient: "bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500",
      hoverGradient: "hover:from-blue-500 hover:via-blue-600 hover:to-indigo-600",
      iconColor: "text-blue-100",
      borderColor: "border-blue-300 hover:border-blue-400",
      shadowColor: "hover:shadow-blue-200",
      textColor: "text-blue-50"
    },
    {
      type: "tutor" as const,
      title: "Tutor",
      description: "Manage your teaching and students",
      icon: GraduationCap,
      gradient: "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500",
      hoverGradient: "hover:from-emerald-500 hover:via-green-600 hover:to-teal-600",
      iconColor: "text-emerald-100",
      borderColor: "border-emerald-300 hover:border-emerald-400",
      shadowColor: "hover:shadow-emerald-200",
      textColor: "text-emerald-50"
    },
    {
      type: "admin" as const,
      title: "Admin",
      description: "Platform administration",
      icon: Shield,
      gradient: "bg-gradient-to-br from-purple-400 via-violet-500 to-purple-600",
      hoverGradient: "hover:from-purple-500 hover:via-violet-600 hover:to-purple-700",
      iconColor: "text-purple-100",
      borderColor: "border-purple-300 hover:border-purple-400",
      shadowColor: "hover:shadow-purple-200",
      textColor: "text-purple-50"
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Successfully logged in!");
      onOpenChange(false);
      setEmail("");
      setPassword("");
      // Navigation will be handled by the auth state change
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="h-16 w-16 text-blue-600 mr-3 animate-pulse" />
            <DialogTitle className="text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
              Welcome Back to TUTAGORA
            </DialogTitle>
          </div>
          <DialogDescription className="text-center text-xl text-muted-foreground">
            Sign in to continue your learning journey
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* User Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = userType === type.type;
              
              return (
                <div
                  key={type.type}
                  className={`relative cursor-pointer transition-all duration-300 transform ${
                    isSelected ? 'scale-105 -rotate-1' : 'hover:scale-105 hover:rotate-1'
                  }`}
                  onClick={() => setUserType(type.type)}
                >
                  <div
                    className={`
                      ${isSelected ? type.gradient : 'bg-white border-2'}
                      ${!isSelected ? type.borderColor : ''}
                      ${type.hoverGradient}
                      rounded-2xl p-6 shadow-lg transition-all duration-300
                      ${isSelected ? 'shadow-2xl' : `hover:shadow-xl ${type.shadowColor}`}
                      ${isSelected ? 'border-0' : ''}
                    `}
                  >
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <div className={`
                          p-4 rounded-full transition-all duration-300
                          ${isSelected 
                            ? 'bg-white/20 backdrop-blur-sm transform rotate-12' 
                            : 'bg-gray-100 hover:bg-gray-200'
                          }
                        `}>
                          <Icon className={`
                            h-12 w-12 transition-all duration-300
                            ${isSelected ? type.iconColor : 'text-gray-600'}
                            ${isSelected ? 'animate-pulse' : ''}
                          `} />
                        </div>
                      </div>
                      <h3 className={`
                        font-bold text-xl transition-colors duration-300
                        ${isSelected ? type.textColor : 'text-gray-800'}
                      `}>
                        {type.title}
                      </h3>
                      <p className={`
                        text-sm leading-relaxed transition-colors duration-300
                        ${isSelected ? 'text-white/90' : 'text-gray-600'}
                      `}>
                        {type.description}
                      </p>
                      
                      {isSelected && (
                        <div className="animate-fade-in">
                          <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-white rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02]" 
              disabled={loading} 
              size="lg"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <Button variant="link" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Forgot your password?
            </Button>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm font-semibold text-blue-600 hover:text-blue-700"
                onClick={() => {
                  onOpenChange(false);
                  // This would need to be handled by the parent component
                }}
              >
                Sign up here
              </Button>
            </p>
          </div>

          <div className="text-center text-sm text-muted-foreground bg-gray-50 p-4 rounded-lg">
            Need help? Call us on{" "}
            <span className="font-semibold text-blue-600">+44 (0) 203 773 6020</span> or{" "}
            <Button variant="link" className="p-0 h-auto text-sm font-medium text-blue-600 hover:text-blue-700">
              email us
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
