import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config(); 

console.log("Intentando conectar con usuario:", process.env.DB_USERNAME); // Línea de prueba

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "admin",
    password: String(process.env.DB_PASSWORD) || "temporal123",
    database: process.env.DB_NAME || "trazapiezas_db",
    synchronize: true,
    logging: true,
    entities: [__dirname + "/entities/*.ts"],
});