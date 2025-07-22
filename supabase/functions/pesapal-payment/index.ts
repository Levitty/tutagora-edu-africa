
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
    console.log("Starting Pesapal payment process...");
    
    // Initialize Supabase client with service role for database operations
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
      .single();

    if (bookingError || !booking) {
      console.error("Booking verification error:", bookingError);
      throw new Error("Booking not found or access denied");
    }

    console.log("Booking verified:", booking.id);

    // Generate unique merchant reference
    const merchantReference = `TUT_${bookingId.substring(0, 8)}_${Date.now()}`;
    console.log("Generated merchant reference:", merchantReference);

    // Check if required Pesapal environment variables are set
    let pesapalBaseUrl = Deno.env.get("PESAPAL_BASE_URL");
    const pesapalConsumerKey = Deno.env.get("PESAPAL_CONSUMER_KEY");
    const pesapalConsumerSecret = Deno.env.get("PESAPAL_CONSUMER_SECRET");

    if (!pesapalBaseUrl || !pesapalConsumerKey || !pesapalConsumerSecret) {
      console.error("Missing Pesapal environment variables");
      throw new Error("Payment service configuration error - missing environment variables");
    }

    // Ensure the base URL has the correct protocol
    if (!pesapalBaseUrl.startsWith('http://') && !pesapalBaseUrl.startsWith('https://')) {
      pesapalBaseUrl = `https://${pesapalBaseUrl}`;
    }

    // Remove trailing slash if present
    pesapalBaseUrl = pesapalBaseUrl.replace(/\/$/, '');

    console.log("Using Pesapal Base URL:", pesapalBaseUrl);
    console.log("Requesting Pesapal access token...");

    // Get Pesapal access token
    const authUrl = `${pesapalBaseUrl}/api/Auth/RequestToken`;
    console.log("Auth URL:", authUrl);

    const authResponse = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        consumer_key: pesapalConsumerKey,
        consumer_secret: pesapalConsumerSecret,
      }),
    });

    if (!authResponse.ok) {
      const authError = await authResponse.text();
      console.error("Pesapal auth failed:", authError);
      console.error("Auth response status:", authResponse.status);
      throw new Error(`Failed to authenticate with Pesapal: ${authResponse.status} - ${authError}`);
    }

    const authData = await authResponse.json();
    console.log("Auth response data:", authData);
    
    if (!authData.token) {
      console.error("No token in auth response:", authData);
      throw new Error("Failed to obtain access token from Pesapal");
    }
    
    const accessToken = authData.token;
    console.log("Pesapal access token obtained successfully");

    // Create payment order
    const orderData = {
      id: merchantReference,
      currency: currency,
      amount: amount,
      description: description,
      callback_url: `${req.headers.get("origin")}/payment-callback`,
      redirect_mode: "TOP_WINDOW",
      notification_id: Deno.env.get("PESAPAL_IPN_ID") || "",
      billing_address: {
        email_address: user.email,
        first_name: booking.student_name || user.user_metadata?.first_name || "Student",
        last_name: user.user_metadata?.last_name || "",
        line_1: "",
        line_2: "",
        city: "",
        state: "",
        postal_code: "",
        zip_code: "",
        country_code: "KE",
      },
    };

    console.log("Creating Pesapal order:", orderData);

    const orderUrl = `${pesapalBaseUrl}/api/Transactions/SubmitOrderRequest`;
    console.log("Order URL:", orderUrl);

    const orderResponse = await fetch(orderUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    });

    console.log("Order response status:", orderResponse.status);
    console.log("Order response headers:", Object.fromEntries(orderResponse.headers.entries()));

    if (!orderResponse.ok) {
      const orderError = await orderResponse.text();
      console.error("Pesapal order creation failed:", orderError);
      console.error("Order response status:", orderResponse.status);
      
      // Try to parse error as JSON for better error messages
      try {
        const errorData = JSON.parse(orderError);
        console.error("Parsed error data:", errorData);
        throw new Error(`Failed to create payment order: ${orderResponse.status} - ${errorData.error?.message || orderError}`);
      } catch (parseError) {
        throw new Error(`Failed to create payment order: ${orderResponse.status} - ${orderError}`);
      }
    }

    const orderResult = await orderResponse.json();
    console.log("Pesapal order created successfully:", orderResult);

    // Validate that we got the required fields
    if (!orderResult.order_tracking_id) {
      console.error("Missing order_tracking_id in response:", orderResult);
      throw new Error("Invalid response from Pesapal - missing tracking ID");
    }

    // Create payment transaction record
    const { error: transactionError } = await supabaseClient
      .from("payment_transactions")
      .insert({
        booking_id: bookingId,
        pesapal_tracking_id: orderResult.order_tracking_id,
        pesapal_merchant_reference: merchantReference,
        amount: amount,
        currency: currency,
        status: "pending",
        payment_method: "pesapal",
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
        pesapal_tracking_id: orderResult.order_tracking_id,
        pesapal_merchant_reference: merchantReference,
        payment_method: "pesapal",
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId);

    if (updateError) {
      console.error("Error updating booking:", updateError);
    } else {
      console.log("Booking updated with payment info");
    }

    console.log("Payment process completed successfully");

    return new Response(
      JSON.stringify({
        success: true,
        order_tracking_id: orderResult.order_tracking_id,
        redirect_url: orderResult.redirect_url,
        merchant_reference: merchantReference,
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
    console.error("Error in pesapal-payment function:", error);
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
