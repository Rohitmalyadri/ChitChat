import fs from "fs";
import path from "path";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;
const schemaPath = path.join(process.cwd(), "schema.sql");

export const runMigrations = async () => {
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
    } finally {
        await client.end();
    }
};


