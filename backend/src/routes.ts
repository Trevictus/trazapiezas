import { Router } from "express";
import { PartController } from "./controllers/PartController";
import { MovementController } from "./controllers/MovementController";
import { AuthController } from "./controllers/AuthController";
import { checkToken, checkRole } from "./middleware/authMiddleware";

const router = Router();

router.post("/auth/login", AuthController.login);
router.post("/auth/register", AuthController.register);

router.get("/parts", checkToken, PartController.getAll);
router.post("/parts", checkToken, checkRole(["ADMIN"]), PartController.create);

router.post("/movements", checkToken, MovementController.create);

router.get("/movements/vehicle/:plate", checkToken, MovementController.getByPlate);

router.put("/parts/:id", checkToken, checkRole(["ADMIN"]), PartController.update);
router.delete("/parts/:id", checkToken, checkRole(["ADMIN"]), PartController.delete);

export default router;