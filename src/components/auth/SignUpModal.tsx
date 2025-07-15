
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
      color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
      buttonColor: "bg-pink-100 text-pink-700 hover:bg-pink-200"
    },
    {
      type: "student" as const,
      title: "I am a Student",
      description: "Have lessons, message your tutor or watch your lessons back",
      icon: User,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      buttonColor: "bg-blue-100 text-blue-700 hover:bg-blue-200"
    },
    {
      type: "tutor" as const,
      title: "I am a Tutor",
      description: "Give lessons or manage bookings with your customers",
      icon: GraduationCap,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      buttonColor: "bg-green-500 text-white hover:bg-green-600"
    },
    {
      type: "admin" as const,
      title: "I am an Admin",
      description: "Platform administration and management",
      icon: Shield,
      color: "bg-gray-50 border-gray-200 hover:bg-gray-100",
      buttonColor: "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Create Your Account</DialogTitle>
          <DialogDescription className="text-center">
            Choose your account type and join TUTAGORA
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
                      <Icon className="h-12 w-12 text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-lg">{type.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {type.description}
                    </p>
                    <Button
                      type="button"
                      className={`w-full ${type.buttonColor}`}
                      variant={isSelected ? "default" : "outline"}
                    >
                      {type.title.replace("I am a ", "")} sign up
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {userType === 'tutor' && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">KYC Verification Required</p>
                  <p>As a tutor, you'll need to complete identity verification before you can start teaching and receiving payments.</p>
                </div>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 700 000 000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Kenya"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>

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
