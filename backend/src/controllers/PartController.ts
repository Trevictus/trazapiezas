import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Part } from "../entities/Part";
import { Movement } from "../entities/Movement";
import { LessThan, MoreThanOrEqual } from "typeorm";

export class PartController {

    static async create(req: Request, res: Response) {
        const { reference, brand, category, description, purchasePrice } = req.body;
        const partRepository = AppDataSource.getRepository(Part);

        try {
            const part = new Part();
            part.reference = reference;
            part.brand = brand;
            part.category = category;
            part.description = description;
            part.purchasePrice = purchasePrice;
            part.stock = 0;

            await partRepository.save(part);
            return res.status(201).json({ message: "Pieza creada correctamente", part });
        } catch (error) {
            return res.status(500).json({ message: "Error al crear la pieza", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        const partRepository = AppDataSource.getRepository(Part);
        const parts = await partRepository.find();
        return res.json(parts);
    }

    static async update(req: Request, res: Response) {
        const { id } = req.params;
        const { reference, brand, category, description, purchasePrice, stock } = req.body;
        const partRepository = AppDataSource.getRepository(Part);
        const movementRepository = AppDataSource.getRepository(Movement);

        try {
            let part = await partRepository.findOneBy({ id: Number(id) });
            if (!part) return res.status(404).json({ message: "Pieza no encontrada" });

            const oldStock = part.stock; // Guardamos el valor previo

            part.reference = reference || part.reference;
            part.brand = brand || part.brand;
            part.category = category || part.category;
            part.description = description || part.description;
            part.purchasePrice = purchasePrice || part.purchasePrice;

            //Si cambia el stock, grabamos por qué
            if (stock !== undefined && stock !== oldStock) {
                const diff = stock - oldStock;
                part.stock = stock;

                const movement = new Movement();
                movement.part = part;
                movement.quantity = Math.abs(diff);
                movement.status = diff > 0 ? "STOCK" : "USED"; // Detecta si es entrada o salida
                movement.purchasePrice = part.purchasePrice;
                movement.vehiclePlate = "AJUSTE-MANUAL";
                
                await movementRepository.save(movement);
            }

            await partRepository.save(part);
            return res.json({ message: "Pieza y movimiento actualizados", part });
        } catch (error) {
            return res.status(500).json({ message: "Error al actualizar", error });
        }
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        const partRepository = AppDataSource.getRepository(Part);

        try {
            const result = await partRepository.delete(id);
            if (result.affected === 0) return res.status(404).json({ message: "Pieza no encontrada" });
            return res.json({ message: "Pieza eliminada correctamente" });
        } catch (error) {
            return res.status(500).json({ message: "Error al eliminar.", error });
        }
    }

    static async getStats(req: Request, res: Response) {
        const partRepository = AppDataSource.getRepository(Part);
        const movementRepository = AppDataSource.getRepository(Movement);

        try {
            // 1. Total de referencias diferentes
            const totalParts = await partRepository.count();

            // 2. Piezas con stock crítico menos de 5 unidades
            const lowStock = await partRepository.count({
                where: { stock: LessThan(5) } // Necesitas importar 'LessThan' de typeorm
            });

            // 3. Movimientos registrados hoy
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const movementsToday = await movementRepository.count();

            return res.json({ totalParts, lowStock, movementsToday });
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener estadísticas", error });
        }
    }
}