
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, User, GraduationCap, Shield, Heart, AlertTriangle } from "lucide-react";

interface SignUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SignUpModal = ({ open, onOpenChange }: SignUpModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [userType, setUserType] = useState<"student" | "tutor" | "admin" | "parent">("student");
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();

  const userTypes = [
    {
      type: "parent" as const,
      title: "I am a Parent",
      description: "Manage payments or lessons for your child",
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
      title: "I am a Student",
      description: "Have lessons, message your tutor or watch your lessons back",
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
      title: "I am a Tutor",
      description: "Give lessons or manage bookings with your customers",
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
      title: "I am an Admin",
      description: "Platform administration and management",
      icon: Shield,
      gradient: "bg-gradient-to-br from-purple-400 via-violet-500 to-purple-600",
      hoverGradient: "hover:from-purple-500 hover:via-violet-600 hover:to-purple-700",
      iconColor: "text-purple-100",
      borderColor: "border-purple-300 hover:border-purple-400",
      shadowColor: "hover:shadow-purple-200",
      textColor: "text-purple-50"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    
    try {
      console.log("Starting registration process...");

      await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        phone,
        country,
        user_type: userType
      });
      
      console.log("Registration successful");
      
      if (userType === 'tutor') {
        toast.success("Account created successfully! Please check your email to verify your account. You'll need to complete KYC verification before you can start tutoring.");
      } else {
        toast.success("Account created successfully! Please check your email to verify your account.");
      }
      
      onOpenChange(false);
      
      // Reset form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFirstName("");
      setLastName("");
      setPhone("");
      setCountry("");
      setUserType("student");
    } catch (error: any) {
      console.error("Registration failed:", error);
      
      let errorMessage = "Failed to create account. Please try again.";
      if (error?.message?.includes("User already registered")) {
        errorMessage = "An account with this email already exists. Please try signing in instead.";
      } else if (error?.message?.includes("Invalid email")) {
        errorMessage = "Please enter a valid email address.";
      } else if (error?.message?.includes("Password")) {
        errorMessage = "Password requirements not met. Please use at least 6 characters.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
            Create Your Account
          </DialogTitle>
          <DialogDescription className="text-center text-lg text-muted-foreground">
            Choose your account type and join TUTAGORA
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

          {userType === 'tutor' && (
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl animate-fade-in">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0 animate-bounce" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold">KYC Verification Required</p>
                  <p>As a tutor, you'll need to complete identity verification before you can start teaching and receiving payments.</p>
                </div>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 700 000 000"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                <Input
                  id="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Kenya"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02]" 
              disabled={loading}
              size="lg"
            >
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

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
