"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartController = void 0;
const data_source_1 = require("../data-source");
const Part_1 = require("../entities/Part");
const Movement_1 = require("../entities/Movement");
const typeorm_1 = require("typeorm");
class PartController {
    static async getById(req, res) {
        const { id } = req.params;
        const partRepository = data_source_1.AppDataSource.getRepository(Part_1.Part);
        try {
            const part = await partRepository.findOneBy({ id: Number(id) });
            if (!part)
                return res.status(404).json({ message: "Pieza no encontrada" });
            return res.json(part);
        }
        catch (error) {
            return res.status(500).json({ message: "Error al obtener la pieza", error });
        }
    }
    static async getStats(req, res) {
        const partRepository = data_source_1.AppDataSource.getRepository(Part_1.Part);
        const movementRepository = data_source_1.AppDataSource.getRepository(Movement_1.Movement);
        try {
            const totalParts = await partRepository.count();
            const lowStock = await partRepository.count({ where: { stock: (0, typeorm_1.LessThan)(5) } });
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const movementsToday = await movementRepository.count({ where: { createdAt: (0, typeorm_1.MoreThanOrEqual)(today) } });
            return res.json({ totalParts, lowStock, movementsToday });
        }
        catch (error) {
            return res.status(500).json({ message: "Error al obtener estadísticas", error });
        }
    }
    static async getAll(req, res) {
        const partRepository = data_source_1.AppDataSource.getRepository(Part_1.Part);
        return res.json(await partRepository.find());
    }
    static async create(req, res) {
        const { reference, brand, category, description, purchasePrice, stock } = req.body;
        const partRepository = data_source_1.AppDataSource.getRepository(Part_1.Part);
        try {
            const part = new Part_1.Part();
            Object.assign(part, { reference, brand, category, description, purchasePrice, stock: stock || 0 });
            await partRepository.save(part);
            return res.status(201).json({ message: "Pieza creada", part });
        }
        catch (error) {
            return res.status(500).json({ message: "Error al crear", error });
        }
    }
    static async update(req, res) {
        const { id } = req.params;
        const { stock, ...rest } = req.body;
        const partRepository = data_source_1.AppDataSource.getRepository(Part_1.Part);
        const movementRepository = data_source_1.AppDataSource.getRepository(Movement_1.Movement);
        try {
            let part = await partRepository.findOneBy({ id: Number(id) });
            if (!part)
                return res.status(404).json({ message: "No encontrada" });
            const oldStock = part.stock;
            Object.assign(part, rest);
            if (stock !== undefined && stock !== oldStock) {
                const diff = stock - oldStock;
                part.stock = stock;
                const movement = new Movement_1.Movement();
                Object.assign(movement, {
                    part,
                    quantity: Math.abs(diff),
                    status: diff > 0 ? "STOCK" : "USED",
                    purchasePrice: part.purchasePrice,
                    vehiclePlate: "AJUSTE-MANUAL"
                });
                await movementRepository.save(movement);
            }
            await partRepository.save(part);
            return res.json({ message: "Actualizado", part });
        }
        catch (error) {
            return res.status(500).json({ message: "Error", error });
        }
    }
    static async delete(req, res) {
        const partRepository = data_source_1.AppDataSource.getRepository(Part_1.Part);
        const result = await partRepository.delete(req.params.id);
        if (result.affected === 0)
            return res.status(404).json({ message: "No encontrada" });
        return res.json({ message: "Eliminada" });
    }
}
exports.PartController = PartController;
