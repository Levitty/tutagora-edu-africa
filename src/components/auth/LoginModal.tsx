
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
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      textColor: "text-pink-700",
      borderColor: "border-pink-200"
    },
    {
      type: "student" as const,
      title: "Student",
      description: "Continue your learning journey",
      icon: User,
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200"
    },
    {
      type: "tutor" as const,
      title: "Tutor",
      description: "Manage your teaching and students",
      icon: GraduationCap,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200"
    },
    {
      type: "admin" as const,
      title: "Admin",
      description: "Platform administration",
      icon: Shield,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200"
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
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-blue-600 mr-3" />
          </div>
          <DialogTitle className="text-3xl font-bold text-gray-900">
            Welcome Back to TUTAGORA
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600">
            Sign in to continue your learning journey
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* User Type Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 text-center">I am a...</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {userTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = userType === type.type;
                
                return (
                  <button
                    key={type.type}
                    type="button"
                    onClick={() => setUserType(type.type)}
                    className={`
                      relative p-6 rounded-xl border-2 transition-all duration-200 text-left
                      ${isSelected 
                        ? `${type.bgColor} ${type.borderColor} shadow-md` 
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className="space-y-3">
                      <div className={`
                        p-3 rounded-lg w-fit
                        ${isSelected ? 'bg-white shadow-sm' : 'bg-gray-100'}
                      `}>
                        <Icon className={`
                          h-6 w-6 transition-colors
                          ${isSelected ? type.textColor : 'text-gray-600'}
                        `} />
                      </div>
                      <div>
                        <h4 className={`
                          font-semibold transition-colors
                          ${isSelected ? type.textColor : 'text-gray-900'}
                        `}>
                          {type.title}
                        </h4>
                        <p className={`
                          text-sm transition-colors
                          ${isSelected ? type.textColor : 'text-gray-600'}
                        `}>
                          {type.description}
                        </p>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${type.color}`}></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6 max-w-md mx-auto">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
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
                className="h-12"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold" 
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <Button variant="link" className="text-sm text-blue-600 hover:text-blue-700">
              Forgot your password?
            </Button>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm font-semibold text-blue-600 hover:text-blue-700"
                onClick={() => onOpenChange(false)}
              >
                Sign up here
              </Button>
            </p>
          </div>

          <div className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
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
