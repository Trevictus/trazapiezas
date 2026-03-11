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
        const { reference, brand, category, description, purchasePrice } = req.body;
        const partRepository = AppDataSource.getRepository(Part);

        try {
            let part = await partRepository.findOneBy({ id: Number(id) });
            if (!part) return res.status(404).json({ message: "Pieza no encontrada" });

            part.reference = reference || part.reference;
            part.brand = brand || part.brand;
            part.category = category || part.category;
            part.description = description || part.description;
            part.purchasePrice = purchasePrice || part.purchasePrice;

            await partRepository.save(part);
            return res.json({ message: "Pieza actualizada", part });
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
}