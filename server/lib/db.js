import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { runMigrations } from "./dbMigrations.js";

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const connectDB = async () => {
    await runMigrations();
    console.log("Supabase client initialized successfully.");
};

export default supabase;