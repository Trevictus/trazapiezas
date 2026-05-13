import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Shelf } from "../entities/Shelf";
import { Part } from "../entities/Part";

export class ShelfController {
    static async getAll(req: Request, res: Response) {
        const shelfRepository = AppDataSource.getRepository(Shelf);
        try {
            const shelves = await shelfRepository.find({ relations: ["parts"] });
            return res.json(shelves);
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener estanterías", error });
        }
    }

    static async getById(req: Request, res: Response) {
        const { id } = req.params;
        const shelfRepository = AppDataSource.getRepository(Shelf);
        try {
            const shelf = await shelfRepository.findOne({
                where: { id: id as string },
                relations: ["parts"]
            });
            if (!shelf) return res.status(404).json({ message: "Estantería no encontrada" });
            return res.json(shelf);
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener estantería", error });
        }
    }

    static async create(req: Request, res: Response) {
        const { name, description } = req.body;
        const shelfRepository = AppDataSource.getRepository(Shelf);
        try {
            const existingShelf = await shelfRepository.findOneBy({ name });
            if (existingShelf) {
                return res.status(400).json({ message: "Ya existe una estantería con ese nombre" });
            }

            const shelf = new Shelf();
            shelf.name = name;
            shelf.description = description;
            shelf.parts = [];

            const newShelf = await shelfRepository.save(shelf);
            return res.status(201).json(newShelf);
        } catch (error) {
            return res.status(500).json({ message: "Error al crear estantería", error });
        }
    }

    static async update(req: Request, res: Response) {
        const { id } = req.params;
        const { name, description } = req.body;
        const shelfRepository = AppDataSource.getRepository(Shelf);
        try {
            let shelf = await shelfRepository.findOneBy({ id: id as string });
            if (!shelf) return res.status(404).json({ message: "Estantería no encontrada" });

            if (name && name !== shelf.name) {
                const existingShelf = await shelfRepository.findOneBy({ name });
                if (existingShelf) {
                    return res.status(400).json({ message: "Ya existe una estantería con ese nombre" });
                }
            }

            shelf.name = name || shelf.name;
            shelf.description = description || shelf.description;

            await shelfRepository.save(shelf);
            return res.json({ message: "Estantería actualizada", shelf });
        } catch (error) {
            return res.status(500).json({ message: "Error al actualizar estantería", error });
        }
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        const shelfRepository = AppDataSource.getRepository(Shelf);
        const partRepository = AppDataSource.getRepository(Part);
        try {
            const shelf = await shelfRepository.findOneBy({ id: id as string });
            if (!shelf) return res.status(404).json({ message: "Estantería no encontrada" });

            await partRepository.update({ shelfId: id as string }, { shelfId: null as any });

            await shelfRepository.remove(shelf);
            return res.json({ message: "Estantería eliminada" });
        } catch (error) {
            return res.status(500).json({ message: "Error al eliminar estantería", error });
        }
    }
}
