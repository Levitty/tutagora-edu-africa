import { format } from "date-fns";
import { Calendar, Clock, User, DollarSign, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBookings, useVerifyPayment } from "@/hooks/useBookings";
import { toast } from "@/hooks/use-toast";

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'confirmed':
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'refunded':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

export const BookingList = () => {
  const { data: bookings = [], isLoading } = useBookings();
  const verifyPayment = useVerifyPayment();

  const handleVerifyPayment = async (trackingId: string) => {
    try {
      const result = await verifyPayment.mutateAsync(trackingId);
      toast({
        title: "Payment Verified",
        description: result.message,
      });
    } catch (error) {
      console.error('Payment verification error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Bookings Found</h3>
          <p className="text-muted-foreground">
            You haven't made any bookings yet. Browse tutors to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking: any) => (
        <Card key={booking.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                {getStatusIcon(booking.status)}
                {booking.subject}
              </CardTitle>
              <div className="flex gap-2">
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
                <Badge className={getPaymentStatusColor(booking.payment_status)}>
                  {booking.payment_status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Tutor/Student Info */}
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                {booking.tutor && (
                  <span className="font-medium">
                    Tutor: {booking.tutor.first_name} {booking.tutor.last_name}
                  </span>
                )}
                {booking.student && (
                  <span className="font-medium">
                    Student: {booking.student.first_name} {booking.student.last_name}
                  </span>
                )}
              </div>
            </div>

            {/* Date and Time */}
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(booking.scheduled_at), 'EEEE, MMMM do, yyyy')}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {format(new Date(booking.scheduled_at), 'h:mm a')} 
                ({booking.duration_minutes} minutes)
              </span>
            </div>

            {/* Amount */}
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">
                KES {booking.total_amount.toLocaleString()}
              </span>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">{booking.notes}</p>
              </div>
            )}

            {/* Payment Verification */}
            {booking.payment_status === 'pending' && booking.pesapal_tracking_id && (
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVerifyPayment(booking.pesapal_tracking_id)}
                  disabled={verifyPayment.isPending}
                >
                  {verifyPayment.isPending ? 'Verifying...' : 'Verify Payment'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};