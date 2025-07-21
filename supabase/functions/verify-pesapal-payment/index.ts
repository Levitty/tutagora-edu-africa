import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyPaymentRequest {
  orderTrackingId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { orderTrackingId }: VerifyPaymentRequest = await req.json();

    if (!orderTrackingId) {
      throw new Error("Missing orderTrackingId");
    }

    // Get Pesapal access token
    const authResponse = await fetch(`${Deno.env.get("PESAPAL_BASE_URL")}/api/Auth/RequestToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        consumer_key: Deno.env.get("PESAPAL_CONSUMER_KEY"),
        consumer_secret: Deno.env.get("PESAPAL_CONSUMER_SECRET"),
      }),
    });

    if (!authResponse.ok) {
      throw new Error("Failed to authenticate with Pesapal");
    }

    const authData = await authResponse.json();
    const accessToken = authData.token;

    // Get transaction status from Pesapal
    const statusResponse = await fetch(
      `${Deno.env.get("PESAPAL_BASE_URL")}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );

    if (!statusResponse.ok) {
      throw new Error("Failed to get transaction status");
    }

    const statusData = await statusResponse.json();
    console.log("Transaction status from Pesapal:", statusData);

    // Update payment transaction status
    const { error: transactionUpdateError } = await supabaseClient
      .from("payment_transactions")
      .update({
        status: statusData.status_code === 1 ? "completed" : "failed",
        transaction_date: statusData.created_date ? new Date(statusData.created_date).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("pesapal_tracking_id", orderTrackingId);

    if (transactionUpdateError) {
      console.error("Error updating transaction:", transactionUpdateError);
    }

    // Update booking status based on payment
    const paymentStatus = statusData.status_code === 1 ? "paid" : "failed";
    const bookingStatus = statusData.status_code === 1 ? "confirmed" : "pending";

    const { error: bookingUpdateError } = await supabaseClient
      .from("bookings")
      .update({
        payment_status: paymentStatus,
        status: bookingStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("pesapal_tracking_id", orderTrackingId);

    if (bookingUpdateError) {
      console.error("Error updating booking:", bookingUpdateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_status: paymentStatus,
        transaction_status: statusData.status_code,
        message: statusData.description || "Payment verification completed",
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
    console.error("Error in verify-pesapal-payment function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);