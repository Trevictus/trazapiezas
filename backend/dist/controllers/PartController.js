"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartController = void 0;
const data_source_1 = require("../data-source");
const Part_1 = require("../entities/Part");
class PartController {
    static async create(req, res) {
        const { reference, brand, category, description, purchasePrice } = req.body;
        const partRepository = data_source_1.AppDataSource.getRepository(Part_1.Part);
        try {
            const part = new Part_1.Part();
            part.reference = reference;
            part.brand = brand;
            part.category = category;
            part.description = description;
            part.purchasePrice = purchasePrice;
            part.stock = 0; // Empieza en 0 hasta que registremos un albarán
            await partRepository.save(part);
            return res.status(201).json({ message: "Pieza creada correctamente", part });
        }
        catch (error) {
            return res.status(500).json({ message: "Error al crear la pieza", error });
        }
    }
    static async getAll(req, res) {
        const partRepository = data_source_1.AppDataSource.getRepository(Part_1.Part);
        const parts = await partRepository.find();
        return res.json(parts);
    }
}
exports.PartController = PartController;
