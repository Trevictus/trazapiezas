"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
class AuthController {
    static async register(req, res) {
        const { username, password, role } = req.body;
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        try {
            // Evitar usuarios duplicados
            const existingUser = await userRepository.findOneBy({ username });
            if (existingUser) {
                return res.status(400).json({ message: "El nombre de usuario ya existe" });
            }
            const user = new User_1.User();
            user.username = username;
            user.password = password;
            user.role = role || "MECHANIC";
            await userRepository.save(user);
            return res.status(201).json({ message: "Usuario creado correctamente", user: { id: user.id, username: user.username, role: user.role } });
        }
        catch (error) {
            return res.status(500).json({ message: "Error al registrar usuario", error });
        }
    }
    static async login(req, res) {
        const { username, password } = req.body;
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        try {
            const user = await userRepository.findOneBy({ username });
            if (!user)
                return res.status(404).json({ message: "Usuario no encontrado" });
            if (!user.isActive)
                return res.status(403).json({ message: "Cuenta desactivada. Contacte con el administrador." });
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid)
                return res.status(401).json({ message: "Contraseña incorrecta" });
            const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "clave_de_emergencia", { expiresIn: "24h" });
            return res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
        }
        catch (error) {
            return res.status(500).json({ message: "Error en el login", error });
        }
    }
    static async getAllUsers(req, res) {
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        try {
            const users = await userRepository.find({
                select: ["id", "username", "role", "isActive"]
            });
            return res.json({ users });
        }
        catch (error) {
            return res.status(500).json({ message: "Error al obtener usuarios", error });
        }
    }
    static async updatePassword(req, res) {
        const id = String(req.params.id);
        const { password } = req.body;
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        try {
            const userId = parseInt(id, 10);
            const user = await userRepository.findOneBy({ id: userId });
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            await userRepository.save(user);
            return res.status(200).json({ message: "Password updated" });
        }
        catch (error) {
            return res.status(500).json({ message: "Error al actualizar contraseña", error });
        }
    }
    static async deleteUser(req, res) {
        const id = String(req.params.id);
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        try {
            const userId = parseInt(id, 10);
            const adminUserId = req.user?.userId;
            if (adminUserId === userId) {
                return res.status(403).json({ message: "No puedes eliminar tu propia cuenta" });
            }
            const user = await userRepository.findOneBy({ id: userId });
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            await userRepository.remove(user);
            return res.status(200).json({ message: "Usuario eliminado" });
        }
        catch (error) {
            return res.status(500).json({ message: "Error al eliminar usuario", error });
        }
    }
    static async toggleUserStatus(req, res) {
        const id = String(req.params.id);
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        try {
            const userId = parseInt(id, 10);
            const adminUserId = req.user?.userId;
            if (adminUserId === userId) {
                return res.status(403).json({ message: "No puedes cambiar tu propio estado" });
            }
            const user = await userRepository.findOneBy({ id: userId });
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            user.isActive = !user.isActive;
            await userRepository.save(user);
            return res.status(200).json({ isActive: user.isActive });
        }
        catch (error) {
            return res.status(500).json({ message: "Error al cambiar estado del usuario", error });
        }
    }
}
exports.AuthController = AuthController;
