
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
      color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
      buttonColor: "bg-pink-100 text-pink-700 hover:bg-pink-200"
    },
    {
      type: "student" as const,
      title: "Student",
      description: "Continue your learning journey",
      icon: User,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      buttonColor: "bg-blue-100 text-blue-700 hover:bg-blue-200"
    },
    {
      type: "tutor" as const,
      title: "Tutor",
      description: "Manage your teaching and students",
      icon: GraduationCap,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      buttonColor: "bg-green-500 text-white hover:bg-green-600"
    },
    {
      type: "admin" as const,
      title: "Admin",
      description: "Platform administration",
      icon: Shield,
      color: "bg-gray-50 border-gray-200 hover:bg-gray-100",
      buttonColor: "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-blue-600 mr-2" />
            <DialogTitle className="text-3xl">Welcome Back to TUTAGORA</DialogTitle>
          </div>
          <DialogDescription className="text-center text-lg">
            Sign in to continue your learning journey
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {userTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = userType === type.type;
              
              return (
                <div
                  key={type.type}
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? type.color + " border-current" 
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setUserType(type.type)}
                >
                  <div className="text-center space-y-3">
                    <div className="flex justify-center">
                      <Icon className="h-10 w-10 text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-lg">{type.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {type.description}
                    </p>
                    <Button
                      type="button"
                      className={`w-full ${type.buttonColor}`}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                    >
                      Select {type.title}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading} size="lg">
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <Button variant="link" className="text-sm">
              Forgot your password?
            </Button>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm font-medium"
                onClick={() => {
                  onOpenChange(false);
                  // This would need to be handled by the parent component
                }}
              >
                Sign up here
              </Button>
            </p>
          </div>

          <div className="text-center text-sm text-gray-500">
            Need help? Call us on +44 (0) 203 773 6020 or{" "}
            <Button variant="link" className="p-0 h-auto text-sm">
              email us
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
