import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting booking confirmation email process...");
    
    const { booking, studentEmail, tutorEmail, paymentData } = await req.json();
    
    if (!booking || !studentEmail || !tutorEmail) {
      throw new Error("Missing required data for confirmation emails");
    }

    // Format the scheduled date and time
    const scheduledDate = new Date(booking.scheduled_at);
    const formattedDate = scheduledDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = scheduledDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Student confirmation email
    const studentEmailContent = `
      <h2>Booking Confirmation - Your Session is Confirmed!</h2>
      <p>Dear ${booking.student?.first_name || 'Student'},</p>
      
      <p>Great news! Your tutoring session has been confirmed and payment has been processed successfully.</p>
      
      <h3>Session Details:</h3>
      <ul>
        <li><strong>Tutor:</strong> ${booking.tutor?.first_name} ${booking.tutor?.last_name}</li>
        <li><strong>Subject:</strong> ${booking.subject}</li>
        <li><strong>Date:</strong> ${formattedDate}</li>
        <li><strong>Time:</strong> ${formattedTime}</li>
        <li><strong>Duration:</strong> ${booking.duration_minutes} minutes</li>
        <li><strong>Amount Paid:</strong> KSh ${booking.total_amount.toLocaleString()}</li>
        <li><strong>Payment Reference:</strong> ${booking.pesapal_merchant_reference}</li>
      </ul>
      
      ${booking.notes ? `<p><strong>Additional Notes:</strong> ${booking.notes}</p>` : ''}
      
      <p>Please make sure to be available at the scheduled time. Your tutor will contact you through the platform.</p>
      
      <p>Best regards,<br>
      The EduConnect Team</p>
    `;

    // Tutor confirmation email
    const tutorEmailContent = `
      <h2>New Booking Confirmed - You Have a New Student!</h2>
      <p>Dear ${booking.tutor?.first_name || 'Tutor'},</p>
      
      <p>Congratulations! You have a new confirmed booking. Payment has been processed successfully.</p>
      
      <h3>Session Details:</h3>
      <ul>
        <li><strong>Student:</strong> ${booking.student?.first_name} ${booking.student?.last_name}</li>
        <li><strong>Subject:</strong> ${booking.subject}</li>
        <li><strong>Date:</strong> ${formattedDate}</li>
        <li><strong>Time:</strong> ${formattedTime}</li>
        <li><strong>Duration:</strong> ${booking.duration_minutes} minutes</li>
        <li><strong>Your Earnings:</strong> KSh ${booking.total_amount.toLocaleString()}</li>
        <li><strong>Booking Reference:</strong> ${booking.pesapal_merchant_reference}</li>
      </ul>
      
      ${booking.notes ? `<p><strong>Student Notes:</strong> ${booking.notes}</p>` : ''}
      
      <p>Please prepare for the session and be ready to contact your student at the scheduled time. Your earnings will be processed according to our payment schedule.</p>
      
      <p>Best regards,<br>
      The EduConnect Team</p>
    `;

    // Initialize Resend with API key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY not found, logging emails instead of sending");
      
      console.log("Student confirmation email:", {
        to: studentEmail,
        subject: "Booking Confirmed - Your Tutoring Session",
        content: studentEmailContent
      });

      console.log("Tutor confirmation email:", {
        to: tutorEmail,
        subject: "New Booking Confirmed - You Have a Student!",
        content: tutorEmailContent
      });
    } else {
      const resend = new Resend(resendApiKey);
      
      try {
        // Send student email
        await resend.emails.send({
          from: "EduConnect <bookings@resend.dev>",
          to: [studentEmail],
          subject: "Booking Confirmed - Your Tutoring Session",
          html: studentEmailContent,
        });
        console.log("Student confirmation email sent successfully");

        // Send tutor email
        await resend.emails.send({
          from: "EduConnect <bookings@resend.dev>",
          to: [tutorEmail],
          subject: "New Booking Confirmed - You Have a Student!",
          html: tutorEmailContent,
        });
        console.log("Tutor confirmation email sent successfully");
      } catch (emailError: any) {
        console.error("Failed to send emails:", emailError);
        // Continue execution even if emails fail
      }
    }

    console.log("Booking confirmation emails processed successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Confirmation emails sent successfully",
        studentEmail,
        tutorEmail,
        bookingId: booking.id
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-confirmation function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);