"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./data-source");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// 1. Middlewares (Siempre primero)
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 2. Ruta de prueba directa (Para descartar errores)
app.get("/test", (req, res) => {
    res.send("Servidor vivo y escuchando");
});
// 3. Tus rutas de la API
app.use("/api", routes_1.default);
// 4. Inicializar DB y luego arrancar el servidor
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("✅ Conexión exitosa a PostgreSQL");
    app.listen(3000, () => {
        console.log("🚀 Servidor en http://localhost:3000");
    });
})
    .catch((error) => console.log("❌ Error:", error));
