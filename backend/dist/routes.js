"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PartController_1 = require("./controllers/PartController");
const AuthController_1 = require("./controllers/AuthController");
const MovementController_1 = require("./controllers/MovementController");
const ShelfController_1 = require("./controllers/ShelfController");
const authMiddleware_1 = require("./middleware/authMiddleware");
const router = (0, express_1.Router)();
// Auth
router.post("/auth/login", AuthController_1.AuthController.login);
router.post("/auth/register", authMiddleware_1.checkToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), AuthController_1.AuthController.register);
router.get("/auth/users", authMiddleware_1.checkToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), AuthController_1.AuthController.getAllUsers);
router.put("/auth/users/:id/password", authMiddleware_1.checkToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), AuthController_1.AuthController.updatePassword);
router.delete("/auth/users/:id", authMiddleware_1.checkToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), AuthController_1.AuthController.deleteUser);
router.patch("/auth/users/:id/status", authMiddleware_1.checkToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), AuthController_1.AuthController.toggleUserStatus);
// Shelves
router.get("/shelves", authMiddleware_1.checkToken, ShelfController_1.ShelfController.getAll);
router.get("/shelves/:id", authMiddleware_1.checkToken, ShelfController_1.ShelfController.getById);
router.post("/shelves", authMiddleware_1.checkToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), ShelfController_1.ShelfController.create);
router.put("/shelves/:id", authMiddleware_1.checkToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), ShelfController_1.ShelfController.update);
router.delete("/shelves/:id", authMiddleware_1.checkToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), ShelfController_1.ShelfController.delete);
// Parts
router.get("/parts/stats", authMiddleware_1.checkToken, PartController_1.PartController.getStats);
router.get("/parts", authMiddleware_1.checkToken, PartController_1.PartController.getAll);
router.get("/parts/:id", authMiddleware_1.checkToken, PartController_1.PartController.getById);
router.post("/parts", authMiddleware_1.checkToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), PartController_1.PartController.create);
router.put("/parts/:id", authMiddleware_1.checkToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), PartController_1.PartController.update);
router.delete("/parts/:id", authMiddleware_1.checkToken, (0, authMiddleware_1.checkRole)(["ADMIN"]), PartController_1.PartController.delete);
// Movements
router.get("/movements/latest", authMiddleware_1.checkToken, MovementController_1.MovementController.getLatest);
router.post("/movements", authMiddleware_1.checkToken, MovementController_1.MovementController.create);
router.get("/movements/vehicle/:plate", authMiddleware_1.checkToken, MovementController_1.MovementController.getByPlate);
// External APIs
router.get("/external/vehicle/:plate", authMiddleware_1.checkToken, MovementController_1.MovementController.getVehicleFromTallerGP);
exports.default = router;
