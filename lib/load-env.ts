import dotenv from "dotenv";

// Ensure scripts load local env before importing database modules.
dotenv.config({ path: ".env.development" });
