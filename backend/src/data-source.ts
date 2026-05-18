import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config(); 

console.log("Intentando conectar con base de datos en producción...");

// Si existe DATABASE_URL (Railway), la usamos directamente. Si no, usamos el fallback local.
export const AppDataSource = new DataSource(
    process.env.DATABASE_URL
        ? {
            type: "postgres",
            url: process.env.DATABASE_URL,
            synchronize: true, // Mantenlo en true para tu entrega de DAW (autocrea tablas)
            logging: true,
            // Crucial para producción: lee tanto los archivos .ts de desarrollo como los .js compilados en dist
            entities: [__dirname + "/entities/*.ts", __dirname + "/entities/*.js"],
          }
        : {
            type: "postgres",
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USERNAME || "admin",
            password: String(process.env.DB_PASSWORD) || "temporal123",
            database: process.env.DB_NAME || "trazapiezas_db",
            synchronize: true,
            logging: true,
            entities: [__dirname + "/entities/*.ts"],
          }
);