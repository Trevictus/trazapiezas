import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export class AuthController {
    static async register(req: Request, res: Response) {
        const { username, password, role } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        try {
            // Evitar usuarios duplicados
            const existingUser = await userRepository.findOneBy({ username });
            if (existingUser) {
                return res.status(400).json({ message: "El nombre de usuario ya existe" });
            }

            const user = new User();
            user.username = username;
            user.password = password; 
            user.role = role || "MECHANIC";

            await userRepository.save(user);
            return res.status(201).json({ message: "Usuario creado correctamente", user: { id: user.id, username: user.username, role: user.role } });
        } catch (error) {
            return res.status(500).json({ message: "Error al registrar usuario", error });
        }
    }

    static async login(req: Request, res: Response) {
        const { username, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        try {
            const user = await userRepository.findOneBy({ username });
            if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ message: "Contraseña incorrecta" });

            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET || "clave_de_emergencia",
                { expiresIn: "24h" }
            );

            return res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
        } catch (error) {
            return res.status(500).json({ message: "Error en el login", error });
        }
    }

    static async getAllUsers(req: Request, res: Response) {
        const userRepository = AppDataSource.getRepository(User);

        try {
            const users = await userRepository.find({
                select: ["id", "username", "role"]
            });
            return res.json({ users });
        } catch (error) {
            return res.status(500).json({ message: "Error al obtener usuarios", error });
        }
    }

    static async updatePassword(req: Request, res: Response) {
        const id = String(req.params.id);
        const { password } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        try {
            const userId = parseInt(id, 10);
            const user = await userRepository.findOneBy({ id: userId });
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            await userRepository.save(user);

            return res.status(200).json({ message: "Updated" });
        } catch (error) {
            return res.status(500).json({ message: "Error al actualizar contraseña", error });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        const id = String(req.params.id);
        const userRepository = AppDataSource.getRepository(User);

        try {
            const userId = parseInt(id, 10);
            const adminUserId = (req as any).user?.userId;
            if (adminUserId === userId) {
                return res.status(403).json({ message: "No puedes eliminar tu propia cuenta" });
            }

            const user = await userRepository.findOneBy({ id: userId });
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            await userRepository.remove(user);
            return res.status(200).json({ message: "Success" });
        } catch (error) {
            return res.status(500).json({ message: "Error al eliminar usuario", error });
        }
    }
}