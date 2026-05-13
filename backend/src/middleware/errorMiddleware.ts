import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Log del error
    console.error(" [Error Detectado]:", err.stack || err);

    // Si el error tiene un código lo usamos. Si no, 500.
    const statusCode = err.statusCode || 500;
    
    // Devolvemos un JSON estandarizado
    res.status(statusCode).json({
        status: "error",
        message: err.error?.message || "Error interno del servidor"
    });
};