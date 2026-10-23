import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("Warning: Supabase URL or Key is not defined in environment variables (checked SUPABASE_URL, VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).");
}

const supabase = createClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseKey || "placeholder"
);

export const connectDB = async () => {
    if (!supabaseUrl || !supabaseKey) {
        console.warn("Supabase credentials missing during startup.");
        return false;
    }
    console.log("Supabase client initialized successfully.");
    return true;
};

export default supabase;