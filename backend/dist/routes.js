"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PartController_1 = require("./controllers/PartController");
const router = (0, express_1.Router)();
router.post("/parts", PartController_1.PartController.create);
router.get("/parts", PartController_1.PartController.getAll);
exports.default = router;
