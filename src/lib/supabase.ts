import { createClient } from "@supabase/supabase-js";

// Make sure to use the ANON KEY for the front-end client
export const supabaseUrl = "https://gyvdbrrbtigqyvwmbtyw.supabase.co";
export const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5dmRicnJidGlncXl2d21idHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NDk2MDcsImV4cCI6MjA4ODAyNTYwN30.mcfiWHvxfdWN4GIVOHnRrT6GDn306-sE4lC-zpHn0_Y";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to generate unique IDs if needed
export const generateId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
