import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import routes from "./routes";

const app = express();

// 1. Middlewares (Siempre primero)
app.use(cors());
app.use(express.json());

// 2. Ruta de prueba directa (Para descartar errores)
app.get("/test", (req, res) => {
    res.send("Servidor vivo y escuchando");
});

// 3. Tus rutas de la API
app.use("/api", routes);

// 4. Inicializar DB y luego arrancar el servidor
AppDataSource.initialize()
    .then(() => {
        console.log("✅ Conexión exitosa a PostgreSQL");
        app.listen(3000, () => {
            console.log("🚀 Servidor en http://localhost:3000");
        });
    })
    .catch((error) => console.log("❌ Error:", error));