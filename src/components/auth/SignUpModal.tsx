
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface SignUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SignUpModal = ({ open, onOpenChange }: SignUpModalProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: "student" as "student" | "tutor" | "admin" | "parent",
    phone: "",
    country: ""
  });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        user_type: formData.userType,
        phone: formData.phone,
        country: formData.country,
      });
      toast.success("Account created successfully! Please check your email to verify your account.");
      onOpenChange(false);
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        userType: "student",
        phone: "",
        country: ""
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-600 mr-2" />
            <AlertDialogTitle className="text-2xl">Join TUTAGORA</AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-4">
            <CardDescription className="text-center">
              Create your account and start learning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Type Selection */}
            <div className="grid grid-cols-2 gap-2">
              {["student", "tutor", "parent", "admin"].map((type) => (
                <Button
                  key={type}
                  variant={formData.userType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFormData("userType", type)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+254 700 000 000"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="Kenya"
                value={formData.country}
                onChange={(e) => updateFormData("country", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => updateFormData("password", e.target.value)}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-xs text-gray-600 text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Button variant="link" className="p-0 h-auto">
                  Sign in here
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  );
};
