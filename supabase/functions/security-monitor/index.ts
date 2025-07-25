import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("Invalid token");
    }

    const { event_type, event_data } = await req.json();

    // Get client IP and user agent for audit trail
    const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Log security event
    const { error: auditError } = await supabaseClient
      .from("security_audit")
      .insert({
        user_id: userData.user.id,
        event_type,
        event_data,
        ip_address: clientIP,
        user_agent: userAgent,
      });

    if (auditError) {
      console.error("Failed to log security event:", auditError);
    }

    // Check for suspicious activity patterns
    const suspiciousPatterns = [
      "failed_login_attempt",
      "role_escalation_attempt",
      "unauthorized_access",
      "suspicious_file_upload",
    ];

    if (suspiciousPatterns.includes(event_type)) {
      // Get recent events from this user/IP
      const { data: recentEvents } = await supabaseClient
        .from("security_audit")
        .select("*")
        .or(`user_id.eq.${userData.user.id},ip_address.eq.${clientIP}`)
        .gte("created_at", new Date(Date.now() - 15 * 60 * 1000).toISOString()) // Last 15 minutes
        .order("created_at", { ascending: false });

      const suspiciousEventCount = recentEvents?.filter(event => 
        suspiciousPatterns.includes(event.event_type)
      ).length || 0;

      // If more than 5 suspicious events in 15 minutes, flag for review
      if (suspiciousEventCount > 5) {
        await supabaseClient
          .from("security_audit")
          .insert({
            user_id: userData.user.id,
            event_type: "potential_security_threat",
            event_data: {
              suspicious_event_count: suspiciousEventCount,
              recent_events: recentEvents?.slice(0, 10),
              requires_review: true,
            },
            ip_address: clientIP,
            user_agent: userAgent,
          });
      }
    }

    return new Response(
      JSON.stringify({ success: true, event_logged: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Security monitor error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});