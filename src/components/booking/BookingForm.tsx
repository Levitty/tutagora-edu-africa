import { useState } from "react";
import { format, addDays, startOfDay, isAfter, isBefore } from "date-fns";
import { Calendar, Clock, User, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCreateBooking, usePesapalPayment } from "@/hooks/useBookings";
import { useTutorAvailability } from "@/hooks/useTutorAvailability";
import { toast } from "@/hooks/use-toast";

interface BookingFormProps {
  tutorId: string;
  tutorName: string;
  tutorPhoto?: string;
  hourlyRate: number;
  subjects: string[];
}

const DURATION_OPTIONS = [
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
];

const DAYS_OF_WEEK = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export const BookingForm = ({ tutorId, tutorName, tutorPhoto, hourlyRate, subjects }: BookingFormProps) => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState("");

  const { data: availability = [] } = useTutorAvailability(tutorId);
  const createBooking = useCreateBooking();
  const pesapalPayment = usePesapalPayment();

  // Generate available dates (next 30 days)
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(startOfDay(new Date()), i);
    const dayOfWeek = date.getDay();
    const hasAvailability = availability.some(slot => slot.day_of_week === dayOfWeek);
    return hasAvailability ? date : null;
  }).filter(Boolean) as Date[];

  // Get available times for selected date
  const getAvailableTimesForDate = (dateStr: string) => {
    if (!dateStr) return [];
    
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    
    return availability
      .filter(slot => slot.day_of_week === dayOfWeek)
      .map(slot => ({
        start: slot.start_time,
        end: slot.end_time,
      }));
  };

  const generateTimeSlots = (start: string, end: string) => {
    const slots = [];
    const startTime = new Date(`2000-01-01 ${start}`);
    const endTime = new Date(`2000-01-01 ${end}`);
    
    const current = new Date(startTime);
    while (current < endTime) {
      const timeStr = current.toTimeString().slice(0, 5);
      slots.push(timeStr);
      current.setMinutes(current.getMinutes() + 60); // 1-hour slots
    }
    
    return slots;
  };

  const availableTimes = selectedDate 
    ? getAvailableTimesForDate(selectedDate).flatMap(slot => 
        generateTimeSlots(slot.start, slot.end)
      )
    : [];

  const totalAmount = (duration / 60) * hourlyRate;

  const handleBooking = async () => {
    if (!selectedSubject || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create the booking
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();
      
      const booking = await createBooking.mutateAsync({
        tutor_id: tutorId,
        subject: selectedSubject,
        scheduled_at: scheduledAt,
        duration_minutes: duration,
        hourly_rate: hourlyRate,
        notes: notes || undefined,
      });

      // Initiate Pesapal payment
      const paymentResult = await pesapalPayment.mutateAsync({
        bookingId: booking.id,
        amount: totalAmount,
        currency: 'KES',
      });

      if (paymentResult.redirect_url) {
        // Redirect to Pesapal payment page
        window.location.href = paymentResult.redirect_url;
      }
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {tutorPhoto && (
            <img 
              src={tutorPhoto} 
              alt={tutorName}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <h3 className="text-xl font-semibold">Book a Session</h3>
            <p className="text-muted-foreground">with {tutorName}</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Subject Selection */}
        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(subject => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Selection */}
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger>
              <SelectValue placeholder="Select a date" />
            </SelectTrigger>
            <SelectContent>
              {availableDates.map(date => (
                <SelectItem key={date.toISOString()} value={format(date, 'yyyy-MM-dd')}>
                  {format(date, 'EEEE, MMMM do, yyyy')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div className="space-y-2">
            <Label htmlFor="time">Time *</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map(time => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Duration Selection */}
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any specific topics or requirements..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        {/* Pricing Summary */}
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span>Hourly Rate:</span>
            <span>KES {hourlyRate.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Duration:</span>
            <span>{duration / 60} hour{duration > 60 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
            <span>Total Amount:</span>
            <span>KES {totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Book Button */}
        <Button 
          onClick={handleBooking}
          disabled={!selectedSubject || !selectedDate || !selectedTime || createBooking.isPending || pesapalPayment.isPending}
          className="w-full"
          size="lg"
        >
          {createBooking.isPending || pesapalPayment.isPending ? (
            "Processing..."
          ) : (
            "Book & Pay with Pesapal"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};