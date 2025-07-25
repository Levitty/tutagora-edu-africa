import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting Paystack payment verification...");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { reference } = await req.json();
    console.log("Verifying payment for reference:", reference);

    if (!reference) {
      throw new Error("Payment reference is required");
    }

    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key not configured");
    }

    // Verify transaction with Paystack
    const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;
    
    const verifyResponse = await fetch(verifyUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text();
      console.error("Paystack verification failed:", errorText);
      throw new Error(`Failed to verify payment: ${verifyResponse.status}`);
    }

    const verifyResult = await verifyResponse.json();
    console.log("Paystack verification result:", verifyResult);

    if (!verifyResult.status || !verifyResult.data) {
      throw new Error("Invalid verification response from Paystack");
    }

    const paymentData = verifyResult.data;
    const paymentStatus = paymentData.status === "success" ? "paid" : "failed";
    
    console.log("Payment status determined:", paymentStatus);

    // Update payment transaction
    const { error: transactionError } = await supabaseClient
      .from("payment_transactions")
      .update({
        status: paymentStatus,
        transaction_date: new Date().toISOString(),
      })
      .eq("pesapal_merchant_reference", reference);

    if (transactionError) {
      console.error("Error updating transaction:", transactionError);
    } else {
      console.log("Transaction updated successfully");
    }

    // Update booking status
    const { error: bookingError } = await supabaseClient
      .from("bookings")
      .update({
        payment_status: paymentStatus,
        status: paymentStatus === "paid" ? "confirmed" : "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("pesapal_merchant_reference", reference);

    if (bookingError) {
      console.error("Error updating booking:", bookingError);
      throw new Error("Failed to update booking status");
    }

    console.log("Booking updated successfully");

    // Get the updated booking data separately
    const { data: booking, error: fetchError } = await supabaseClient
      .from("bookings")
      .select("*")
      .eq("pesapal_merchant_reference", reference)
      .single();

    if (fetchError) {
      console.error("Error fetching booking:", fetchError);
      throw new Error("Failed to fetch updated booking");
    }

    console.log("Booking updated successfully:", booking);

    // If payment successful, send confirmation emails and create earnings record
    if (paymentStatus === "paid" && booking) {
      console.log("Processing successful payment...");
      
      // Get user emails
      const { data: authUsers, error: authError } = await supabaseClient.auth.admin.listUsers();
      if (authError) {
        console.error("Error getting auth users:", authError);
      }

      const studentUser = authUsers?.users?.find(user => user.id === booking.student_id);
      const tutorUser = authUsers?.users?.find(user => user.id === booking.tutor_id);

      if (studentUser && tutorUser) {
        // Send confirmation emails
        try {
          await supabaseClient.functions.invoke('send-booking-confirmation', {
            body: {
              booking,
              studentEmail: studentUser.email,
              tutorEmail: tutorUser.email,
              paymentData
            }
          });
          console.log("Confirmation emails initiated");
        } catch (emailError) {
          console.error("Error sending confirmation emails:", emailError);
          // Don't fail the whole process if email fails
        }
      }

      // Create earnings record for tutor
      try {
        const { error: earningsError } = await supabaseClient
          .from("analytics")
          .insert({
            metric_name: "tutor_earnings",
            metric_value: booking.total_amount,
            metric_date: new Date().toISOString().split('T')[0],
          });

        if (earningsError) {
          console.error("Error creating earnings record:", earningsError);
        } else {
          console.log("Earnings record created");
        }
      } catch (earningsError) {
        console.error("Error processing earnings:", earningsError);
      }

      // Update tutor profile earnings if it exists
      try {
        const { data: currentProfile } = await supabaseClient
          .from("profiles")
          .select("id")
          .eq("id", booking.tutor_id)
          .single();

        if (currentProfile) {
          // We could add a total_earnings field to profiles if needed
          console.log("Tutor profile found for earnings update");
        }
      } catch (profileError) {
        console.error("Error checking tutor profile:", profileError);
      }
    }

    console.log("Payment verification completed:", paymentStatus);

    return new Response(
      JSON.stringify({
        success: true,
        payment_status: paymentStatus,
        transaction_data: paymentData,
        booking: booking,
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
    console.error("Error in verify-paystack-payment function:", error);
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