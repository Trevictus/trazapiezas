import { Router } from "express";
import { PartController } from "./controllers/PartController";
import { AuthController } from "./controllers/AuthController";
import { MovementController } from "./controllers/MovementController";
import { checkToken, checkRole } from "./middleware/authMiddleware";

const router = Router();

// Auth
router.post("/auth/login", AuthController.login);
router.post("/auth/register", checkToken, checkRole(["ADMIN"]), AuthController.register);
router.get("/auth/users", checkToken, checkRole(["ADMIN"]), AuthController.getAllUsers);
router.put("/auth/users/:id/password", checkToken, checkRole(["ADMIN"]), AuthController.updatePassword);

// Parts
router.get("/parts/stats", checkToken, PartController.getStats);
router.get("/parts", checkToken, PartController.getAll);
router.get("/parts/:id", checkToken, PartController.getById);
router.post("/parts", checkToken, checkRole(["ADMIN"]), PartController.create);
router.put("/parts/:id", checkToken, checkRole(["ADMIN"]), PartController.update);
router.delete("/parts/:id", checkToken, checkRole(["ADMIN"]), PartController.delete);

// Movements
router.get("/movements/latest", checkToken, MovementController.getLatest);
router.post("/movements", checkToken, MovementController.create);
router.get("/movements/vehicle/:plate", checkToken, MovementController.getByPlate);

// External APIs
router.get("/external/vehicle/:plate", checkToken, MovementController.getVehicleFromTallerGP);

export default router;