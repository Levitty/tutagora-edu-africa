// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rpskgapsanraehehxfdv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwc2tnYXBzYW5yYWVoZWh4ZmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NDc3NDcsImV4cCI6MjA2NzAyMzc0N30.9TsuyUcbTCD8EAHVr8-bryOisTMjQ1OFrv3QyS8Rkvg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});