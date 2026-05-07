import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Part } from "../entities/Part";
import { Movement } from "../entities/Movement";
import { LessThan, MoreThanOrEqual } from "typeorm";

export class PartController {
    static async getById(req: Request, res: Response) {
        const { id } = req.params;
        const partRepository = AppDataSource.getRepository(Part);
        try {
            const part = await partRepository.findOneBy({ id: Number(id) });
            if (!part) return res.status(404).json({ message: "Pieza no encontrada" });
            return res.json(part);
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener la pieza", error });
        }
    }

    static async getStats(req: Request, res: Response) {
        const partRepository = AppDataSource.getRepository(Part);
        const movementRepository = AppDataSource.getRepository(Movement);
        try {
            const totalParts = await partRepository.count();
            const lowStock = await partRepository.count({ where: { stock: LessThan(5) } });
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const movementsToday = await movementRepository.count({ where: { createdAt: MoreThanOrEqual(today) } });
            return res.json({ totalParts, lowStock, movementsToday });
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener estadísticas", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        const partRepository = AppDataSource.getRepository(Part);
        return res.json(await partRepository.find());
    }

    static async create(req: Request, res: Response) {
        const { reference, brand, category, description, purchasePrice, stock } = req.body;
        const partRepository = AppDataSource.getRepository(Part);
        try {
            const part = new Part();
            Object.assign(part, { reference, brand, category, description, purchasePrice, stock: stock || 0 });
            await partRepository.save(part);
            return res.status(201).json({ message: "Pieza creada", part });
        } catch (error) {
            return res.status(500).json({ message: "Error al crear", error });
        }
    }

    static async update(req: Request, res: Response) {
        const { id } = req.params;
        const { stock, ...rest } = req.body;
        const partRepository = AppDataSource.getRepository(Part);
        const movementRepository = AppDataSource.getRepository(Movement);
        try {
            let part = await partRepository.findOneBy({ id: Number(id) });
            if (!part) return res.status(404).json({ message: "No encontrada" });
            const oldStock = part.stock;
            Object.assign(part, rest);
            if (stock !== undefined && stock !== oldStock) {
                const diff = stock - oldStock;
                part.stock = stock;
                const movement = new Movement();
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
        } catch (error) {
            return res.status(500).json({ message: "Error", error });
        }
    }

    static async delete(req: Request, res: Response) {
        const partRepository = AppDataSource.getRepository(Part);
        const result = await partRepository.delete(req.params.id);
        if (result.affected === 0) return res.status(404).json({ message: "No encontrada" });
        return res.json({ message: "Eliminada" });
    }
}