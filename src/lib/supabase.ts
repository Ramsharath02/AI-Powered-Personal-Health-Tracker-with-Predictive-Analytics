import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kpqzbrslchbvphajspth.supabase.co/";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwcXpicnNsY2hidnBoYWpzcHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NTkxOTMsImV4cCI6MjA1NjMzNTE5M30.84xpf1QTQXAt0ms3Ux_FGI6jsFhCltz4QSi8w8VwFjo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);