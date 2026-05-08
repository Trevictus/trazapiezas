"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    // Log del error
    console.error(" [Error Detectado]:", err.stack || err);
    // Si el error tiene un código lo usamos. Si no, 500.
    const statusCode = err.statusCode || 500;
    // Devolvemos un JSON estandarizado
    res.status(statusCode).json({
        status: "error",
        message: err.message || "Error interno del servidor"
    });
};
exports.globalErrorHandler = globalErrorHandler;
