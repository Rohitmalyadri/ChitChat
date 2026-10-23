import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables.");
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