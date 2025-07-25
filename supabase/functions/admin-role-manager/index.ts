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

    // Verify admin permissions
    const { data: adminCheck } = await supabaseClient
      .rpc("is_super_admin", { _user_id: userData.user.id });

    if (!adminCheck) {
      throw new Error("Insufficient permissions");
    }

    const { action, target_user_id, new_role } = await req.json();

    const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    switch (action) {
      case "assign_role":
        if (!target_user_id || !new_role) {
          throw new Error("Missing required parameters");
        }

        // Use the secure role assignment function
        const { data: roleResult, error: roleError } = await supabaseClient
          .rpc("assign_user_role", {
            target_user_id,
            new_role,
          });

        if (roleError) {
          throw new Error(`Failed to assign role: ${roleError.message}`);
        }

        // Log the admin action
        await supabaseClient.from("admin_actions").insert({
          admin_id: userData.user.id,
          target_id: target_user_id,
          action_type: "role_assignment",
          target_type: "user",
          notes: `Assigned role ${new_role} to user ${target_user_id}`,
        });

        return new Response(
          JSON.stringify({ success: true, role_assigned: true }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );

      case "revoke_role":
        if (!target_user_id) {
          throw new Error("Missing target_user_id");
        }

        // Remove from user_roles table
        await supabaseClient
          .from("user_roles")
          .delete()
          .eq("user_id", target_user_id);

        // Reset to student in profiles
        await supabaseClient
          .from("profiles")
          .update({ role: "student" })
          .eq("id", target_user_id);

        // Log the admin action
        await supabaseClient.from("admin_actions").insert({
          admin_id: userData.user.id,
          target_id: target_user_id,
          action_type: "role_revocation",
          target_type: "user",
          notes: `Revoked all roles from user ${target_user_id}`,
        });

        return new Response(
          JSON.stringify({ success: true, role_revoked: true }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );

      case "list_users":
        const { data: users } = await supabaseClient
          .from("profiles")
          .select(`
            id,
            first_name,
            last_name,
            user_type,
            role,
            created_at,
            user_roles (role, assigned_at)
          `)
          .order("created_at", { ascending: false });

        return new Response(
          JSON.stringify({ users }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );

      default:
        throw new Error("Invalid action");
    }
  } catch (error) {
    console.error("Admin role manager error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});