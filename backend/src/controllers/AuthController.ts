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
            const user = new User();
            user.username = username;
            user.password = password; // Se encriptará sola gracias al @BeforeInsert
            user.role = role;

            await userRepository.save(user);
            return res.status(201).json({ message: "Usuario creado correctamente" });
        } catch (error) {
            return res.status(500).json({ message: "Error al registrar usuario", error });
        }
    }

    /**
     * @openapi
     * /auth/login:
     * post:
     * summary: Iniciar sesión
     * tags: [Auth]
     * requestBody:
     * required: true
     * content:
     * application/json:
     * schema:
     * type: object
     * properties:
     * username:
     * type: string
     * password:
     * type: string
     * responses:
     * 200:
     * description: Login exitoso, devuelve el token.
     */
    static async login(req: Request, res: Response) {
        const { username, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        try {
            const user = await userRepository.findOneBy({ username });
            if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ message: "Contraseña incorrecta" });

            // Creamos el Token que dura 24 horas
            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET || "clave_de_emergencia",
                { expiresIn: "24h" }
            );

            return res.json({ token, role: user.role });
        } catch (error) {
            return res.status(500).json({ message: "Error en el login", error });
        }
    }
}