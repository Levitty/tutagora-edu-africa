
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
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      textColor: "text-pink-700",
      borderColor: "border-pink-200"
    },
    {
      type: "student" as const,
      title: "I am a Student",
      description: "Have lessons, message your tutor or watch your lessons back",
      icon: User,
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200"
    },
    {
      type: "tutor" as const,
      title: "I am a Tutor",
      description: "Give lessons or manage bookings with your customers",
      icon: GraduationCap,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200"
    },
    {
      type: "admin" as const,
      title: "I am an Admin",
      description: "Platform administration and management",
      icon: Shield,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200"
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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-bold text-gray-900">
            Create Your Account
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600">
            Choose your account type and join TUTAGORA
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* User Type Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 text-center">Choose your role</h3>
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

          {userType === 'tutor' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold">KYC Verification Required</p>
                  <p>As a tutor, you'll need to complete identity verification before you can start teaching and receiving payments.</p>
                </div>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-12"
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
                    className="h-12"
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
                  className="h-12"
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
                    className="h-12"
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
                    className="h-12"
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
                    className="h-12"
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
                    className="h-12"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
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
