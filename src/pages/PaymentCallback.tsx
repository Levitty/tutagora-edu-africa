import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVerifyPayment } from "@/hooks/useBookings";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const verifyPayment = useVerifyPayment();

  const orderTrackingId = searchParams.get('OrderTrackingId');
  const merchantReference = searchParams.get('OrderMerchantReference');

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      if (!orderTrackingId) {
        setVerificationStatus('failed');
        return;
      }

      try {
        const result = await verifyPayment.mutateAsync(orderTrackingId);
        
        if (result.payment_status === 'paid') {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        setVerificationStatus('failed');
      }
    };

    verifyPaymentStatus();
  }, [orderTrackingId, verifyPayment]);

  const handleContinue = () => {
    if (verificationStatus === 'success') {
      navigate('/student-dashboard');
    } else {
      navigate('/browse-tutors');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {verificationStatus === 'loading' && (
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            )}
            {verificationStatus === 'success' && (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
            {verificationStatus === 'failed' && (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          
          <CardTitle className="text-xl">
            {verificationStatus === 'loading' && 'Verifying Payment...'}
            {verificationStatus === 'success' && 'Payment Successful!'}
            {verificationStatus === 'failed' && 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {verificationStatus === 'loading' && (
            <p className="text-muted-foreground">
              Please wait while we verify your payment with Pesapal...
            </p>
          )}
          
          {verificationStatus === 'success' && (
            <div className="space-y-2">
              <p className="text-green-600 font-medium">
                Your booking has been confirmed!
              </p>
              <p className="text-muted-foreground text-sm">
                You will receive a confirmation email shortly. You can view your booking details in your dashboard.
              </p>
              {merchantReference && (
                <p className="text-xs text-muted-foreground">
                  Reference: {merchantReference}
                </p>
              )}
            </div>
          )}
          
          {verificationStatus === 'failed' && (
            <div className="space-y-2">
              <p className="text-red-600 font-medium">
                Payment could not be verified
              </p>
              <p className="text-muted-foreground text-sm">
                Your payment may still be processing. Please check your booking status or contact support if you need assistance.
              </p>
              {orderTrackingId && (
                <p className="text-xs text-muted-foreground">
                  Tracking ID: {orderTrackingId}
                </p>
              )}
            </div>
          )}
          
          {verificationStatus !== 'loading' && (
            <Button 
              onClick={handleContinue}
              className="w-full"
            >
              {verificationStatus === 'success' ? 'Go to Dashboard' : 'Browse Tutors'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}