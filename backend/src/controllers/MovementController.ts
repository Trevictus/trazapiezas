import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Movement } from "../entities/Movement";
import { Part } from "../entities/Part";
import { User } from "../entities/User";
import { ExternalApiService } from "../services/ExternalApiService";

export class MovementController {
  static async getLatest(req: Request, res: Response) {
    const movementRepository = AppDataSource.getRepository(Movement);
    try {
      const movements = await movementRepository.find({
        relations: ["part", "user"],
        order: { createdAt: "DESC" },
        take: 5
      });
      return res.json(movements);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener movimientos", error });
    }
  }

  static async create(req: Request, res: Response) {
    const { partId, quantity, vehiclePlate, status, userId, vin, engineCode } = req.body;

    const movementRepository = AppDataSource.getRepository(Movement);
    const partRepository = AppDataSource.getRepository(Part);
    const userRepository = AppDataSource.getRepository(User);

    try {
      const part = await partRepository.findOneBy({ id: partId });
      if (!part) return res.status(404).json({ message: "Pieza no encontrada" });

      const user = await userRepository.findOneBy({ id: userId });
      if (!user) return res.status(404).json({ message: "Usuario no válido" });

      if (status === "USED" && part.stock < quantity) {
        return res.status(400).json({ message: "Stock insuficiente" });
      }

      const movement = new Movement();
      movement.part = part;
      movement.user = user;
      movement.quantity = quantity;
      movement.vehiclePlate = vehiclePlate ? vehiclePlate.toUpperCase().trim() : null;
      movement.status = status;

      if (status === "USED" && vin) {
        movement.vin = vin;
      }
      if (status === "USED" && engineCode) {
        movement.engineCode = engineCode;
      }

      await movementRepository.save(movement);

      if (status === "STOCK") part.stock += quantity;
      else if (status === "USED") part.stock -= quantity;

      await partRepository.save(part);

      return res.status(201).json({ message: "Movimiento completado", movement });
    } catch (error) {
      return res.status(500).json({ message: "Error al registrar", error });
    }
  }

  static async getByPlate(req: Request, res: Response) {
    const plate = req.params.plate as string;
    const movementRepository = AppDataSource.getRepository(Movement);

    try {
      if (!plate) {
        return res.status(400).json({ message: "La matrícula es obligatoria" });
      }

      const movements = await movementRepository.find({
        where: { vehiclePlate: plate.toUpperCase().trim() },
        relations: ["part", "user"],
        order: { createdAt: "DESC" }
      });

      return res.json(movements);
    } catch (error) {
      console.error("Error en getByPlate:", error);
      return res.status(500).json({ message: "Error al buscar matrícula", error });
    }
  }

  static async getVehicleFromTallerGP(req: Request, res: Response) {
    const plate = req.params.plate as string;

    try {
      if (!plate) {
        return res.status(400).json({ message: "La matrícula es obligatoria" });
      }

      const vehicleData = await ExternalApiService.getVehicleByPlate(
        plate.toUpperCase().trim()
      );
      return res.json({
        plate: plate.toUpperCase().trim(),
        ...vehicleData
      });
    } catch (error: any) {
      console.error("Error consultando TallerGP:", error);
      return res.status(404).json({
        message: "Vehículo no encontrado en TallerGP",
        error: error.message
      });
    }
  }
}
