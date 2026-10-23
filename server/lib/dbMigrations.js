import fs from "fs";
import path from "path";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;
const schemaPath = path.join(process.cwd(), "schema.sql");

export const runMigrations = async () => {
    if (!process.env.DATABASE_URL) {
        console.warn("DATABASE_URL not configured. Skipping database migrations.");
        return;
    }
    if (!fs.existsSync(schemaPath)) {
        console.warn(`schema.sql not found at ${schemaPath}. Skipping database migrations.`);
        return;
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    try {
        await client.connect();
        const sql = fs.readFileSync(schemaPath, "utf8");
        await client.query(sql);
        console.log("Database migrations applied successfully.");
    } catch (error) {
        console.error("Database migrations failed:", error);
        throw error;
    } finally {
        try {
            await client.end();
        } catch {
            // ignore disconnect errors
        }
    }
};


