
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency?: string;
  description?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting Paystack payment process...");
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header missing");
    }

    const token = authHeader.replace("Bearer ", "");
    const userSupabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    const { data: userData, error: userError } = await userSupabase.auth.getUser(token);
    if (userError || !userData.user) {
      console.error("User authentication error:", userError);
      throw new Error("User not authenticated");
    }

    const user = userData.user;
    console.log("Authenticated user:", user.id);

    const { bookingId, amount, currency = "KES", description = "Tutor Booking Payment" }: PaymentRequest = await req.json();
    console.log("Payment request data:", { bookingId, amount, currency, description });

    if (!bookingId || !amount) {
      throw new Error("Missing required fields: bookingId and amount");
    }

    // Verify booking exists and belongs to user
    const { data: booking, error: bookingError } = await supabaseClient
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("student_id", user.id)
      .maybeSingle();

    if (bookingError || !booking) {
      console.error("Booking verification error:", bookingError);
      throw new Error("Booking not found or access denied");
    }

    console.log("Booking verified:", booking.id);

    // Generate unique reference
    const reference = `TUT_${bookingId.substring(0, 8)}_${Date.now()}`;
    console.log("Generated reference:", reference);

    // Check if Paystack secret key is set
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      console.error("Missing Paystack secret key");
      throw new Error("Payment service configuration error - missing Paystack secret key");
    }

    console.log("Initializing Paystack transaction...");

    // Initialize Paystack transaction
    const paystackUrl = "https://api.paystack.co/transaction/initialize";
    
    const paystackData = {
      email: user.email,
      amount: amount * 100, // Paystack expects amount in kobo (smallest currency unit)
      currency: currency,
      reference: reference,
      callback_url: `${req.headers.get("origin")}/payment-callback?provider=paystack`,
      metadata: {
        booking_id: bookingId,
        student_name: booking.student_name || user.user_metadata?.first_name || "Student",
        tutor_id: booking.tutor_id,
        subject: booking.subject,
      },
    };

    console.log("Paystack request data:", paystackData);

    const paystackResponse = await fetch(paystackUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paystackData),
    });

    console.log("Paystack response status:", paystackResponse.status);

    if (!paystackResponse.ok) {
      const paystackError = await paystackResponse.text();
      console.error("Paystack initialization failed:", paystackError);
      throw new Error(`Failed to initialize Paystack payment: ${paystackResponse.status} - ${paystackError}`);
    }

    const paystackResult = await paystackResponse.json();
    console.log("Paystack initialization successful:", paystackResult);

    if (!paystackResult.status || !paystackResult.data?.authorization_url) {
      console.error("Invalid Paystack response:", paystackResult);
      throw new Error("Invalid response from Paystack");
    }

    // Create payment transaction record
    const { error: transactionError } = await supabaseClient
      .from("payment_transactions")
      .insert({
        booking_id: bookingId,
        pesapal_tracking_id: null, // Not used for Paystack
        pesapal_merchant_reference: reference,
        amount: amount,
        currency: currency,
        status: "pending",
        payment_method: "paystack",
      });

    if (transactionError) {
      console.error("Error creating transaction record:", transactionError);
    } else {
      console.log("Payment transaction record created");
    }

    // Update booking with payment info
    const { error: updateError } = await supabaseClient
      .from("bookings")
      .update({
        pesapal_tracking_id: null, // Not used for Paystack
        pesapal_merchant_reference: reference,
        payment_method: "paystack",
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId);

    if (updateError) {
      console.error("Error updating booking:", updateError);
    } else {
      console.log("Booking updated with payment info");
    }

    console.log("Paystack payment process completed successfully");

    return new Response(
      JSON.stringify({
        success: true,
        reference: reference,
        authorization_url: paystackResult.data.authorization_url,
        access_code: paystackResult.data.access_code,
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
    console.error("Error in paystack-payment function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Check the function logs for more information"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
