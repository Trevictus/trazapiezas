import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

// Importante: cargar el config() lo primero de todo
dotenv.config(); 

console.log("Intentando conectar con usuario:", process.env.DB_USERNAME); // Línea de prueba

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: String(process.env.DB_PASSWORD), // Forzamos a que sea string
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true, // Cámbialo a true para ver cómo se crean las tablas en la consola
    entities: [__dirname + "/entities/*.ts"],
});