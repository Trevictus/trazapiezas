import { Request, Response, NextFunction } from "express";

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // 1. Obtenemos el rol del usuario que viene del token (JWT)
        const user = res.locals.jwtPayload;

        // 2. Comprobamos si el rol del usuario está en la lista permitida
        if (roles.indexOf(user.role) > -1) {
            next();
        } else {
            res.status(403).json({ message: "No tienes permisos suficientes (Rol insuficiente)" });
        }
    };
};