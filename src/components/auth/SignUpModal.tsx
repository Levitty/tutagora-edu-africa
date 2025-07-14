
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, User, GraduationCap, Shield, AlertTriangle, Building } from "lucide-react";

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
  const [userType, setUserType] = useState<"student" | "tutor" | "admin" | "institution">("student");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();

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

    if (userType === 'institution' && !institutionName) {
      toast.error("Institution name is required");
      return;
    }

    setLoading(true);
    
    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        phone,
        country,
        user_type: userType,
        ...(userType === 'institution' && {
          institution_name: institutionName,
          institution_type: institutionType
        })
      };

      await signUp(email, password, userData);
      
      if (userType === 'tutor') {
        toast.success("Account created successfully! Please check your email to verify your account. You'll need to complete KYC verification before you can start tutoring.");
      } else if (userType === 'institution') {
        toast.success("Institution account created successfully! Please check your email to verify your account. You'll need to complete accreditation verification before offering courses.");
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
      setInstitutionName("");
      setInstitutionType("");
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Your Account</DialogTitle>
          <DialogDescription>
            Join TUTAGORA and start your learning journey
          </DialogDescription>
        </DialogHeader>
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

          <div className="space-y-2">
            <Label htmlFor="userType">I want to join as</Label>
            <Select value={userType} onValueChange={(value: "student" | "tutor" | "admin" | "institution") => setUserType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Student - Learn from expert tutors
                  </div>
                </SelectItem>
                <SelectItem value="tutor">
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Tutor - Teach and earn money
                  </div>
                </SelectItem>
                <SelectItem value="institution">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Institution - Offer certificate courses
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Super Admin - Platform administration
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            {userType === 'tutor' && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">KYC Verification Required</p>
                    <p>As a tutor, you'll need to complete identity verification before you can start teaching and receiving payments.</p>
                  </div>
                </div>
              </div>
            )}

            {userType === 'institution' && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start">
                  <Building className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Accreditation Required</p>
                    <p>Institutions need to complete accreditation verification before offering certificate courses.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {userType === 'institution' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="institutionName">Institution Name</Label>
                <Input
                  id="institutionName"
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g., ABC University"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="institutionType">Institution Type</Label>
                <Select value={institutionType} onValueChange={setInstitutionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select institution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="technical">Technical Institute</SelectItem>
                    <SelectItem value="training">Training Center</SelectItem>
                    <SelectItem value="certification">Certification Body</SelectItem>
                    <SelectItem value="corporate">Corporate Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
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
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
