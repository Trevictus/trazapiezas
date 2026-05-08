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
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./swagger");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const User_1 = require("./entities/User");
const app = (0, express_1.default)();
// Función para crear usuario administrador
async function seedAdmin() {
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    const existingUsers = await userRepository.count();
    if (existingUsers === 0) {
        const adminUser = new User_1.User();
        adminUser.username = "admin";
        adminUser.password = "admin123";
        adminUser.role = "ADMIN";
        await userRepository.save(adminUser);
        console.log("✅ Usuario administrador creado: admin/admin123");
    }
}
// 1. Middlewares de configuración (Siempre al principio)
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 2. Ruta de prueba
app.get("/test", (req, res) => {
    res.send("Servidor vivo y escuchando");
});
// 3. Rutas de la API
app.use("/api", routes_1.default);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// 4. Gestión global de errores (Siempre al FINAL)
app.use(errorMiddleware_1.globalErrorHandler);
// 5. Inicializar DB y arrancar
data_source_1.AppDataSource.initialize()
    .then(async () => {
    console.log("✅ Conexión exitosa a PostgreSQL");
    await seedAdmin();
    app.listen(3000, () => {
        console.log("🚀 Servidor en http://localhost:3000");
    });
})
    .catch((error) => console.log("❌ Error:", error));
