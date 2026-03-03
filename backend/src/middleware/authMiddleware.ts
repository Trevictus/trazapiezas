import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) return res.status(403).json({ message: "No se proporcionó token" });

    try {
        const decoded = jwt.verify(token, "TU_CLAVE_SECRETA_SUPER_SEGURA");
        (req as any).user = decoded; // Guardamos los datos del usuario en la petición
        next(); // ¡Pasa adelante!
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

export const checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!roles.includes(user.role)) {
            return res.status(403).json({ message: "No tienes permiso para esta acción" });
        }
        next();
    };
};