import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://frpjlwfgfkwkdkcqjuzn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZycGpsd2ZnZmt3a2RrY3FqdXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4MjIxMTcsImV4cCI6MjA0OTM5ODExN30.qlP4zyE2my2izUZBIDqNy81hO_aq2F4-sO2BuU28lY0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
