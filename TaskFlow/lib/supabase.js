import { createClient } from '@supabase/supabase-js';
 
const SUPABASE_URL = 'https://obfmegcekudfrbpyzdxe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iZm1lZ2Nla3VkZnJicHl6ZHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMDk3MDMsImV4cCI6MjA5NzY4NTcwM30.xVbqimDiTlP3NTlJeQ7uQvR7eD3T8XWS6tqm2jlM9Ic';
 
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);