
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
    }

    console.log("Payment verification completed:", paymentStatus);

    return new Response(
      JSON.stringify({
        success: true,
        payment_status: paymentStatus,
        transaction_data: paymentData,
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
