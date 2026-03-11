import { Router } from "express";
import { PartController } from "./controllers/PartController";
import { MovementController } from "./controllers/MovementController";
import { AuthController } from "./controllers/AuthController";
import { checkToken, checkRole } from "./middleware/authMiddleware";


const router = Router();

//  Rutas para PIEZAS 
// Cualquiera puede ver las piezas y movimientos
router.get("/parts", checkToken, PartController.getAll);// Solo ADMIN puede crear piezas
router.post("/parts", checkToken, checkRole(["ADMIN"]), PartController.create);

// Rutas para MOVIMIENTOS 
router.post("/movements", checkToken, MovementController.create);
router.get("/movements/vehicle/:plate", checkToken, MovementController.getByPlate);

// Rutas para AUTENTICACIÓN
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// SOLO ADMIN
router.put("/parts/:id", checkToken, checkRole(["ADMIN"]), PartController.update);
router.delete("/parts/:id", checkToken, checkRole(["ADMIN"]), PartController.delete);

export default router;