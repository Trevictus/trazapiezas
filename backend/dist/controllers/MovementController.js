"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementController = void 0;
const data_source_1 = require("../data-source");
const Movement_1 = require("../entities/Movement");
const Part_1 = require("../entities/Part");
const User_1 = require("../entities/User");
const ExternalApiService_1 = require("../services/ExternalApiService");
class MovementController {
    static async getLatest(req, res) {
        const movementRepository = data_source_1.AppDataSource.getRepository(Movement_1.Movement);
        try {
            const movements = await movementRepository.find({
                relations: ["part", "user"],
                order: { createdAt: "DESC" },
                take: 5
            });
            return res.json(movements);
        }
        catch (error) {
            return res.status(500).json({ message: "Error al obtener movimientos", error });
        }
    }
    static async create(req, res) {
        const { partId, quantity, vehiclePlate, status, userId, vin, engineCode } = req.body;
        const movementRepository = data_source_1.AppDataSource.getRepository(Movement_1.Movement);
        const partRepository = data_source_1.AppDataSource.getRepository(Part_1.Part);
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        try {
            const part = await partRepository.findOneBy({ id: partId });
            if (!part)
                return res.status(404).json({ message: "Pieza no encontrada" });
            const user = await userRepository.findOneBy({ id: userId });
            if (!user)
                return res.status(404).json({ message: "Usuario no válido" });
            if (status === "USED" && part.stock < quantity) {
                return res.status(400).json({ message: "Stock insuficiente" });
            }
            const movement = new Movement_1.Movement();
            movement.part = part;
            movement.user = user;
            movement.quantity = quantity;
            movement.vehiclePlate = vehiclePlate ? vehiclePlate.toUpperCase().trim() : null;
            movement.status = status;
            if (status === "USED" && vin) {
                movement.vin = vin;
            }
            if (status === "USED" && engineCode) {
                movement.engineCode = engineCode;
            }
            await movementRepository.save(movement);
            if (status === "STOCK")
                part.stock += quantity;
            else if (status === "USED")
                part.stock -= quantity;
            await partRepository.save(part);
            return res.status(201).json({ message: "Movimiento completado", movement });
        }
        catch (error) {
            return res.status(500).json({ message: "Error al registrar", error });
        }
    }
    static async getByPlate(req, res) {
        const plate = req.params.plate;
        const movementRepository = data_source_1.AppDataSource.getRepository(Movement_1.Movement);
        try {
            if (!plate) {
                return res.status(400).json({ message: "La matrícula es obligatoria" });
            }
            const movements = await movementRepository.find({
                where: { vehiclePlate: plate.toUpperCase().trim() },
                relations: ["part", "user"],
                order: { createdAt: "DESC" }
            });
            return res.json(movements);
        }
        catch (error) {
            console.error("Error en getByPlate:", error);
            return res.status(500).json({ message: "Error al buscar matrícula", error });
        }
    }
    static async getVehicleFromTallerGP(req, res) {
        const plate = req.params.plate;
        try {
            if (!plate) {
                return res.status(400).json({ message: "La matrícula es obligatoria" });
            }
            const vehicleData = await ExternalApiService_1.ExternalApiService.getVehicleByPlate(plate.toUpperCase().trim());
            return res.json({
                plate: plate.toUpperCase().trim(),
                ...vehicleData
            });
        }
        catch (error) {
            console.error("Error consultando TallerGP:", error);
            return res.status(404).json({
                message: "Vehículo no encontrado en TallerGP",
                error: error.message
            });
        }
    }
}
exports.MovementController = MovementController;
