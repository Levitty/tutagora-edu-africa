
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, Upload, FileText, User, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TutorOnboardingProps {
  kycStatus: string;
  onStartKYC: () => void;
}

export const TutorOnboarding = ({ kycStatus, onStartKYC }: TutorOnboardingProps) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800 border-green-200',
          iconColor: 'text-green-600',
          title: 'Verification Complete',
          description: 'Your account is fully verified and ready to start tutoring!',
          progress: 100
        };
      case 'pending':
        return {
          icon: AlertTriangle,
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          iconColor: 'text-orange-600',
          title: 'Verification Pending',
          description: 'Your documents are being reviewed. This usually takes 1-2 business days.',
          progress: 60
        };
      case 'rejected':
        return {
          icon: AlertTriangle,
          color: 'bg-red-100 text-red-800 border-red-200',
          iconColor: 'text-red-600',
          title: 'Verification Required',
          description: 'Please submit your verification documents to start tutoring.',
          progress: 20
        };
      default:
        return {
          icon: Upload,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          iconColor: 'text-blue-600',
          title: 'Get Started',
          description: 'Complete your verification to start offering tutoring services.',
          progress: 0
        };
    }
  };

  const statusInfo = getStatusInfo(kycStatus);
  const StatusIcon = statusInfo.icon;

  const onboardingSteps = [
    {
      icon: User,
      title: "Account Created",
      description: "Your tutor account has been created",
      completed: true
    },
    {
      icon: FileText,
      title: "Submit Documents",
      description: "Upload ID, qualifications, and teaching certificates",
      completed: kycStatus === 'pending' || kycStatus === 'approved'
    },
    {
      icon: GraduationCap,
      title: "Verification Review",
      description: "Our team reviews your qualifications",
      completed: kycStatus === 'approved'
    },
    {
      icon: CheckCircle,
      title: "Start Teaching",
      description: "Begin accepting students and earning money",
      completed: kycStatus === 'approved'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className={`border-2 ${statusInfo.color}`}>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full bg-white`}>
              <StatusIcon className={`h-6 w-6 ${statusInfo.iconColor}`} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">{statusInfo.title}</CardTitle>
              <CardDescription className="text-sm mt-1">
                {statusInfo.description}
              </CardDescription>
            </div>
            <Badge variant="secondary" className={statusInfo.color}>
              {kycStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Verification Progress</span>
                <span>{statusInfo.progress}%</span>
              </div>
              <Progress value={statusInfo.progress} className="h-2" />
            </div>
            
            {kycStatus !== 'approved' && (
              <Button onClick={onStartKYC} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                {kycStatus === 'pending' ? 'View Submission' : 'Start Verification'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started as a Tutor</CardTitle>
          <CardDescription>
            Follow these steps to complete your tutor onboarding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {onboardingSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`
                    p-2 rounded-full transition-colors
                    ${step.completed 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                    }
                  `}>
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  {step.completed && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Benefits Preview */}
      <Card>
        <CardHeader>
          <CardTitle>What you can do after verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Teaching Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Create and sell courses</li>
                <li>• Schedule live sessions</li>
                <li>• Message students directly</li>
                <li>• Track student progress</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Earning Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Set your own hourly rates</li>
                <li>• Receive payments securely</li>
                <li>• View detailed earnings reports</li>
                <li>• Get weekly payouts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
