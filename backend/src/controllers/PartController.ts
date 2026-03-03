import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Part } from "../entities/Part";

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
            part.stock = 0; // Empieza en 0 hasta que registremos un albarán

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
}