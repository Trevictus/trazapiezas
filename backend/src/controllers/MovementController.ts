import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Movement } from "../entities/Movement";
import { Part } from "../entities/Part";

export class MovementController {
    static async create(req: Request, res: Response) {
        const { partId, quantity, purchasePrice, vehiclePlate, status } = req.body;
        const movementRepository = AppDataSource.getRepository(Movement);
        const partRepository = AppDataSource.getRepository(Part);

        try {
            // 1. Buscar si la pieza existe
            const part = await partRepository.findOneBy({ id: partId });
            if (!part) return res.status(404).json({ message: "Pieza no encontrada" });

            // 2. Crear el movimiento
            const movement = new Movement();
            movement.part = part;
            movement.quantity = quantity;
            movement.purchasePrice = purchasePrice;
            movement.vehiclePlate = vehiclePlate;
            movement.status = status || "STOCK";

            await movementRepository.save(movement);

            // 3. Actualizar el stock físico de la pieza
            part.stock += quantity;
            await partRepository.save(part);

            return res.status(201).json({ message: "Movimiento registrado y stock actualizado", movement });
        } catch (error) {
            return res.status(500).json({ message: "Error al registrar movimiento", error });
        }
    }


    static async getByPlate(req: Request, res: Response) {
    const { plate } = req.params as { plate: string };
    const movementRepository = AppDataSource.getRepository(Movement);

    try {
        const movements = await movementRepository.find({
            where: { vehiclePlate: plate },
            relations: ["part"]
        });
        return res.json(movements);
    } catch (error) {
        return res.status(500).json({ message: "Error al buscar la matrícula", error });
    }
}
}