import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import { globalErrorHandler } from "./middleware/errorMiddleware";

const app = express();

// 1. Middlewares de configuración (Siempre al principio)
app.use(cors());
app.use(express.json());

// 2. Ruta de prueba
app.get("/test", (req, res) => {
    res.send("Servidor vivo y escuchando");
});

// 3. Rutas de la API
app.use("/api", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 4. Gestión global de errores (Siempre al FINAL)
app.use(globalErrorHandler); 

// 5. Inicializar DB y arrancar
AppDataSource.initialize()
    .then(() => {
        console.log("✅ Conexión exitosa a PostgreSQL");
        app.listen(3000, () => {
            console.log("🚀 Servidor en http://localhost:3000");
        });
    })
    .catch((error) => console.log("❌ Error:", error));