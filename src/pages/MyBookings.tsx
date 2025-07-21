import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingList } from "@/components/booking/BookingList";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Calendar } from "lucide-react";

export default function MyBookings() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-6 w-6" />
              <h1 className="text-2xl font-bold">My Bookings</h1>
            </div>
            <p className="text-muted-foreground">
              View and manage your tutoring session bookings
            </p>
          </div>
          
          <BookingList />
        </div>
      </div>
    </ProtectedRoute>
  );
}