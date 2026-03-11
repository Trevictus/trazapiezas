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
        const part = await partRepository.findOneBy({ id: partId });
        if (!part) return res.status(404).json({ message: "Pieza no encontrada" });

        // Si el estado es USED (montado en coche), comprobamos si hay stock
        if (status === "USED" && part.stock < quantity) {
            return res.status(400).json({ 
                message: `Stock insuficiente. Solo quedan ${part.stock} unidades.` 
            });
        }

        const movement = new Movement();
        movement.part = part;
        movement.quantity = quantity;
        movement.purchasePrice = purchasePrice;
        movement.vehiclePlate = vehiclePlate;
        movement.status = status || "STOCK";

        await movementRepository.save(movement);

        // Actualizar stock: Si es STOCK suma, si es USED resta
        if (status === "STOCK") {
            part.stock += quantity;
        } else if (status === "USED") {
            part.stock -= quantity;
        }
        
        await partRepository.save(part);

        return res.status(201).json({ message: "Movimiento registrado con éxito", movement });
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