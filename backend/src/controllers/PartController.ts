import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Part } from "../entities/Part";
import { Movement } from "../entities/Movement";
import { User } from "../entities/User";
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
        return res.json(await partRepository.find({ where: { active: true } }));
    }

    static async create(req: Request, res: Response) {
        const { reference, brand, category, description, purchasePrice, stock, shelfId } = req.body;
        const partRepository = AppDataSource.getRepository(Part);
        const existing = await partRepository.findOneBy({ reference });
        if (existing && !existing.active) {
            existing.active = true;
            Object.assign(existing, { brand, category, description, purchasePrice, stock: stock || 0, shelfId });
            await partRepository.save(existing);
            return res.status(200).json({ message: "Pieza reactivada", part: existing });
        } else if (existing) {
            return res.status(400).json({ message: "Ya existe una pieza con esa referencia", part: existing });
        }
        try {
            const part = new Part();
            Object.assign(part, { reference, brand, category, description, purchasePrice, stock: stock || 0, shelfId });
            await partRepository.save(part);
            return res.status(201).json({ message: "Pieza creada", part });
        } catch (error) {
            return res.status(500).json({ message: "Error al crear", error });
        }
    }

    static async update(req: Request, res: Response) {
        const { id } = req.params;
        const { stock, shelfId, userId, ...rest } = req.body;
        const partRepository = AppDataSource.getRepository(Part);
        try {
            let part = await partRepository.findOneBy({ id: Number(id) });
            if (!part) return res.status(404).json({ message: "No encontrada" });
            const oldStock = part.stock;
            Object.assign(part, rest);
            if (shelfId !== undefined) part.shelfId = shelfId;
            if (stock !== undefined && stock !== oldStock) {
                const diff = stock - oldStock;
                part.stock = stock;
                const movement = new Movement();
                const movementRepository = AppDataSource.getRepository(Movement);
                const userRepository = AppDataSource.getRepository(User);
                const user = await userRepository.findOneBy({ id: userId });
                if (!user) return res.status(404).json({ message: "Usuario no válido" });
                Object.assign(movement, {
                    part,
                    quantity: Math.abs(diff),
                    status: diff > 0 ? "STOCK" : "USED",
                    purchasePrice: part.purchasePrice,
                    vehiclePlate: "AJUSTE-MANUAL",
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role,
                        isActive: user.isActive
                    } as User
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
        const result = await partRepository.update({ id: Number(req.params.id) }, { active: false });
        if (result.affected === 0) return res.status(404).json({ message: "No encontrada" });
        return res.json({ message: "Eliminada" });
    }
}